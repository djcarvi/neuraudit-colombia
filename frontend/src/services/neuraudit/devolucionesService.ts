// devolucionesService.ts - Servicio para el módulo de devoluciones automáticas

import httpInterceptor from './httpInterceptor';

interface DevolucionStats {
  success: boolean;
  total_devoluciones: number;
  stats_by_estado: Array<{
    estado: string;
    count: number;
  }>;
  stats_by_causal: Array<{
    causal: string;
    descripcion: string;
    count: number;
  }>;
  devoluciones_ultimo_mes: number;
  proximas_vencer: number;
  vencidas: number;
  valor_total_devuelto: number;
  fecha_consulta: string;
}

interface DevolucionData {
  id: string;
  numero_devolucion: string;
  fecha_devolucion: string;
  fecha_limite_respuesta: string;
  radicacion: {
    numeroRadicado: string;
    numeroFactura: string;
  };
  prestador: {
    razon_social: string;
    nit: string;
  };
  causal_codigo: string;
  causal_descripcion: string;
  valor_devuelto: number;
  estado: string;
  dias_restantes_respuesta?: number;
  facturas_afectadas?: number;
  respuesta_prestador?: string;
  fecha_respuesta_prestador?: string;
}

class DevolucionesService {
  async getDevoluciones(filters?: any): Promise<{results: DevolucionData[], count: number}> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.estado) {
        params.append('estado', filters.estado);
      }
      
      if (filters?.causal) {
        params.append('causal', filters.causal);
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
      
      const url = params.toString() ? `/api/devoluciones/list/?${params.toString()}` : '/api/devoluciones/list/';
      const response = await httpInterceptor.get(url);
      return response;
    } catch (error) {
      console.error('Error loading devoluciones:', error);
      // Retornar datos vacíos mientras se implementa el backend
      return {
        results: [],
        count: 0
      };
    }
  }

  async getDevolucionStats(): Promise<DevolucionStats> {
    try {
      const response = await httpInterceptor.get('/api/devoluciones/stats/');
      return response;
    } catch (error) {
      console.error('Error loading devoluciones stats:', error);
      // Retornar datos de prueba mientras se implementa el backend
      return {
        success: true,
        total_devoluciones: 0,
        stats_by_estado: [
          { estado: 'PENDIENTE', count: 0 },
          { estado: 'EN_RESPUESTA', count: 0 },
          { estado: 'ACEPTADA', count: 0 },
          { estado: 'RECHAZADA', count: 0 }
        ],
        stats_by_causal: [
          { causal: 'DE16', descripcion: 'Persona corresponde a otro responsable de pago', count: 0 },
          { causal: 'DE44', descripcion: 'Prestador no hace parte de la red integral', count: 0 },
          { causal: 'DE50', descripcion: 'Factura ya pagada o en trámite', count: 0 },
          { causal: 'DE56', descripcion: 'No radicación de soportes dentro de 22 días hábiles', count: 0 }
        ],
        devoluciones_ultimo_mes: 0,
        proximas_vencer: 0,
        vencidas: 0,
        valor_total_devuelto: 0,
        fecha_consulta: new Date().toISOString()
      };
    }
  }

  async getDevolucionById(id: string): Promise<DevolucionData> {
    try {
      const response = await httpInterceptor.get(`/api/devoluciones/${id}/`);
      return response;
    } catch (error) {
      console.error('Error loading devolucion details:', error);
      throw error;
    }
  }

  async createDevolucionManual(data: any): Promise<any> {
    try {
      const response = await httpInterceptor.post('/api/devoluciones/create/', data);
      return response;
    } catch (error) {
      console.error('Error creating manual devolucion:', error);
      throw error;
    }
  }

  async responderDevolucion(id: string, respuestaData: any): Promise<any> {
    try {
      const response = await httpInterceptor.post(`/api/devoluciones/${id}/responder/`, respuestaData);
      return response;
    } catch (error) {
      console.error('Error responding to devolucion:', error);
      throw error;
    }
  }

  async exportDevoluciones(formato: 'excel' | 'pdf'): Promise<void> {
    try {
      const response = await httpInterceptor.get(`/api/devoluciones/export/?formato=${formato}`, {
        responseType: 'blob'
      });
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `devoluciones_${new Date().toISOString().split('T')[0]}.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting devoluciones:', error);
      throw error;
    }
  }

  // Función específica para calcular días hábiles según Resolución 2284
  calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {
    let dias = 0;
    const actual = new Date(fechaInicio);
    
    while (actual <= fechaFin) {
      const diaSemana = actual.getDay();
      // Excluir sábados (6) y domingos (0)
      if (diaSemana !== 0 && diaSemana !== 6) {
        dias++;
      }
      actual.setDate(actual.getDate() + 1);
    }
    
    return dias;
  }
}

export default new DevolucionesService();