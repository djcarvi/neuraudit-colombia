// radicacionService.ts - Servicio para el módulo de radicación

import httpInterceptor from './httpInterceptor';

interface RadicacionStats {
  success: boolean;
  total_radicaciones: number;
  stats_by_estado: Array<{
    estado: string;
    count: number;
  }>;
  radicaciones_ultimo_mes: number;
  proximas_vencer: number;
  vencidas: number;
  valor_total: number;
  fecha_consulta: string;
}

interface RadicacionData {
  id: string;
  numeroRadicado: string;
  fechaRadicacion: string;
  prestador: {
    nombre: string;
    nit: string;
  };
  numeroFactura: string;
  valorTotal: number;
  estado: string;
  diasTranscurridos: number;
}

class RadicacionService {
  async getRadicacionStats(): Promise<RadicacionStats> {
    try {
      // CAMBIO CRÍTICO: Usar endpoint MongoDB en lugar del Django ORM
      const response = await httpInterceptor.get('/api/radicacion/mongodb/stats/');
      return response;
    } catch (error) {
      console.error('Error loading radicacion stats from MongoDB:', error);
      throw error;
    }
  }

  async getRadicaciones(filters?: any): Promise<{results: RadicacionData[], count: number}> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.estado) {
        params.append('estado', filters.estado);
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      
      if (filters?.page) {
        params.append('page', filters.page);
      }
      
      if (filters?.prestador_nit) {
        params.append('prestador_nit', filters.prestador_nit);
      }
      
      if (filters?.fecha_desde) {
        params.append('fecha_desde', filters.fecha_desde);
      }
      
      if (filters?.fecha_hasta) {
        params.append('fecha_hasta', filters.fecha_hasta);
      }
      
      // CAMBIO CRÍTICO: Usar endpoint MongoDB en lugar del Django ORM
      const url = params.toString() ? `/api/radicacion/mongodb/list/?${params.toString()}` : '/api/radicacion/mongodb/list/';
      const response = await httpInterceptor.get(url);
      return response;
    } catch (error) {
      console.error('Error loading radicaciones from MongoDB:', error);
      throw error;
    }
  }

  async exportRadicaciones(formato: 'excel' | 'pdf'): Promise<void> {
    try {
      const response = await httpInterceptor.get(`/api/radicacion/export/?formato=${formato}`, {
        responseType: 'blob'
      });
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `radicaciones_${new Date().toISOString().split('T')[0]}.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting radicaciones:', error);
      throw error;
    }
  }

  async processFiles(files: { factura_xml: File | null, rips_json: File | null, cuv_file: File | null, soportes: File[] }, contratoInfo?: { contrato_id: string, modalidad_contrato: string }) {
    try {
      const formData = new FormData();
      
      if (files.factura_xml) {
        formData.append('factura_xml', files.factura_xml);
      }
      if (files.rips_json) {
        formData.append('rips_json', files.rips_json);
      }
      if (files.cuv_file) {
        formData.append('cuv_file', files.cuv_file);
      }
      
      // Agregar soportes si existen
      files.soportes.forEach(soporte => {
        formData.append('soportes_adicionales', soporte);
      });
      
      // Agregar información del contrato si está disponible
      if (contratoInfo) {
        formData.append('contrato_id', contratoInfo.contrato_id);
        formData.append('modalidad_contrato', contratoInfo.modalidad_contrato);
      }
      
      // Importante: NO establecer Content-Type manualmente para FormData
      const response = await httpInterceptor.post('/api/radicacion/process_files/', formData);
      return response;
    } catch (error) {
      console.error('Error processing files:', error);
      throw error;
    }
  }

  async getContratosActivosPrestador(prestadorNit: string) {
    try {
      const response = await httpInterceptor.get(`/api/radicacion/mongodb/contratos-activos/?prestador_nit=${prestadorNit}`);
      return response;
    } catch (error) {
      console.error('Error loading contratos activos:', error);
      throw error;
    }
  }

  async createRadicacion(radicacionData: any, files?: { factura_xml: File | null, rips_json: File | null, cuv_file: File | null, soportes: File[] }) {
    try {
      // Si hay contrato_id, usar el nuevo endpoint MongoDB
      if (radicacionData.contrato_id) {
        // Preparar datos para el endpoint MongoDB
        const mongodbData = {
          contrato_id: radicacionData.contrato_id,
          prestador_nit: radicacionData.pss_nit,
          numero_factura: radicacionData.factura_numero,
          fecha_expedicion: radicacionData.factura_fecha_expedicion,
          fecha_inicio_periodo: radicacionData.fecha_atencion_inicio,
          fecha_fin_periodo: radicacionData.fecha_atencion_inicio,  // Por ahora usar la misma fecha
          valor_factura: radicacionData.factura_valor_total || 0,
          valor_copago: 0,
          valor_cuota_moderadora: 0,
          total_usuarios: 1,  // Por defecto
          total_servicios: 1,  // Por defecto
          documentos: []
        };
        
        const response = await httpInterceptor.post('/api/radicacion/mongodb/radicar-con-contrato/', mongodbData);
        return response;
      }
      
      // Si se proporcionan archivos, enviar como FormData (comportamiento anterior)
      if (files) {
        const formData = new FormData();
        
        // Agregar datos de radicación como JSON
        formData.append('radicacion_data', JSON.stringify(radicacionData));
        
        // Agregar archivos
        if (files.factura_xml) {
          formData.append('factura_xml', files.factura_xml);
        }
        if (files.rips_json) {
          formData.append('rips_json', files.rips_json);
        }
        if (files.cuv_file) {
          formData.append('cuv_file', files.cuv_file);
        }
        
        // Agregar soportes
        files.soportes.forEach(soporte => {
          formData.append('soportes_adicionales', soporte);
        });
        
        const response = await httpInterceptor.post('/api/radicacion/create_with_files/', formData);
        return response;
      } else {
        // Sin archivos, enviar solo datos (comportamiento anterior)
        const response = await httpInterceptor.post('/api/radicacion/', radicacionData);
        return response;
      }
    } catch (error) {
      console.error('Error creating radicacion:', error);
      throw error;
    }
  }
}

export default new RadicacionService();