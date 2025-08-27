// services/neuraudit/contratacionServiceMongoDB.ts
/**
 * Servicio NoSQL MongoDB para gestión de servicios CUPS contractuales
 */

import { neurauditAxios } from '../axiosConfig';

export interface ServicioCUPSContractual {
    codigo_cups: string;
    descripcion: string;
    valor_negociado: number;
    aplica_copago?: boolean;
    aplica_cuota_moderadora?: boolean;
    requiere_autorizacion?: boolean;
    restricciones?: {
        sexo?: 'M' | 'F' | 'AMBOS';
        ambito?: 'AMBULATORIO' | 'HOSPITALARIO' | 'AMBOS';
        edad_minima?: number;
        edad_maxima?: number;
    };
}

export interface TarifaCUPSContractual {
    _id: string;
    contrato_id: string;
    numero_contrato: string;
    codigo_cups: string;
    descripcion: string;
    valor_negociado: number;
    valor_referencia: number;
    porcentaje_variacion: number;
    requiere_autorizacion: boolean;
    restricciones: any;
    estado: string;
}

export interface ValidacionTarifa {
    valido: boolean;
    glosa_aplicable?: string;
    descripcion_glosa?: string;
    codigo_cups: string;
    valor_facturado: number;
    valor_contractual?: number;
    diferencia?: number;
    porcentaje_diferencia?: number;
    requiere_autorizacion?: boolean;
    observaciones?: string;
}

export interface EstadisticasContrato {
    contrato_id: string;
    resumen: {
        total_servicios: number;
        valor_promedio: number;
        valor_minimo: number;
        valor_maximo: number;
        requieren_autorizacion: number;
    };
    distribucion_tipos: Array<{
        _id: string;
        cantidad: number;
        valor_total: number;
    }>;
    servicios_variacion_extrema: Array<{
        codigo_cups: string;
        descripcion: string;
        valor_negociado: number;
        valor_referencia: number;
        porcentaje_variacion: number;
    }>;
}

export const contratacionMongoDBService = {
    // Buscar tarifas CUPS contractuales
    buscarTarifasCUPS: async (params: {
        contrato_id?: string;
        codigo_cups?: string;
        prestador_nit?: string;
        fecha_servicio?: string;
    }) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });
        
        const response = await neurauditAxios.get(
            `/api/contratacion/mongodb/servicios-cups/?${queryParams}`
        );
        return response.data;
    },
    
    // Agregar servicios CUPS a un contrato
    agregarServiciosCUPS: async (contratoId: string, servicios: ServicioCUPSContractual[]) => {
        const response = await neurauditAxios.post('/api/contratacion/mongodb/servicios-cups/', {
            contrato_id: contratoId,
            servicios: servicios
        });
        return response.data;
    },
    
    // Validar tarifa CUPS facturada vs contractual
    validarTarifaCUPS: async (params: {
        contrato_id: string;
        codigo_cups: string;
        valor_facturado: number;
        fecha_servicio: string;
    }): Promise<ValidacionTarifa> => {
        const response = await neurauditAxios.post(
            '/api/contratacion/mongodb/validar-tarifa-cups/',
            params
        );
        return response.data;
    },
    
    // Obtener estadísticas de contrato
    obtenerEstadisticasContrato: async (contratoId: string): Promise<EstadisticasContrato> => {
        const response = await neurauditAxios.get(
            `/api/contratacion/mongodb/estadisticas-contrato/${contratoId}/`
        );
        return response.data.data;
    },
    
    // Importar servicios CUPS desde Excel
    importarServiciosCUPS: async (contratoId: string, archivo: File, hoja: string = 'Sheet1') => {
        const formData = new FormData();
        formData.append('contrato_id', contratoId);
        formData.append('archivo', archivo);
        formData.append('hoja', hoja);
        
        const response = await neurauditAxios.post(
            '/api/contratacion/mongodb/importar-servicios-cups/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },
    
    // Exportar tarifario contractual a Excel
    exportarTarifario: async (contratoId: string) => {
        const response = await neurauditAxios.get(
            `/api/contratacion/mongodb/exportar-tarifario/${contratoId}/`,
            {
                responseType: 'blob'
            }
        );
        
        // Crear link de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tarifario_contrato_${contratoId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
    
    // Buscar servicios CUPS en catálogo oficial para agregar
    buscarCUPSCatalogo: async (busqueda: string) => {
        const response = await neurauditAxios.get(
            `/api/catalogs/cups/search/?q=${busqueda}`
        );
        return response.data.results;
    },
    
    // Validación masiva de tarifas para auditoría
    validarTarifasMasivas: async (validaciones: Array<{
        contrato_id: string;
        codigo_cups: string;
        valor_facturado: number;
        fecha_servicio: string;
    }>) => {
        const resultados = await Promise.all(
            validaciones.map(v => contratacionMongoDBService.validarTarifaCUPS(v))
        );
        
        // Agrupar por tipo de glosa
        const glosasPorTipo: { [key: string]: ValidacionTarifa[] } = {};
        resultados.forEach(resultado => {
            if (!resultado.valido && resultado.glosa_aplicable) {
                if (!glosasPorTipo[resultado.glosa_aplicable]) {
                    glosasPorTipo[resultado.glosa_aplicable] = [];
                }
                glosasPorTipo[resultado.glosa_aplicable].push(resultado);
            }
        });
        
        return {
            total: validaciones.length,
            validas: resultados.filter(r => r.valido).length,
            con_glosas: resultados.filter(r => !r.valido).length,
            glosas_por_tipo: glosasPorTipo
        };
    }
};