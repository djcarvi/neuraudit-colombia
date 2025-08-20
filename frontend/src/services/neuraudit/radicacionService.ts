// radicacionService.ts - Servicio para el módulo de radicación

import httpInterceptor from './httpInterceptor';

interface RadicacionStats {
  total_radicaciones: number;
  stats_by_estado: Array<{
    estado: string;
    count: number;
  }>;
  radicaciones_ultimo_mes: number;
  proximas_vencer: number;
  vencidas: number;
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
      const response = await httpInterceptor.get('/api/radicacion/dashboard_stats/');
      return response;
    } catch (error) {
      console.error('Error loading radicacion stats:', error);
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
      
      const url = params.toString() ? `/api/radicacion/?${params.toString()}` : '/api/radicacion/';
      const response = await httpInterceptor.get(url);
      return response;
    } catch (error) {
      console.error('Error loading radicaciones:', error);
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

  async processFiles(files: { factura_xml: File | null, rips_json: File | null, soportes: File[] }) {
    try {
      const formData = new FormData();
      
      if (files.factura_xml) {
        formData.append('factura_xml', files.factura_xml);
      }
      if (files.rips_json) {
        formData.append('rips_json', files.rips_json);
      }
      
      // Agregar soportes si existen
      files.soportes.forEach(soporte => {
        formData.append('soportes_adicionales', soporte);
      });
      
      // Importante: NO establecer Content-Type manualmente para FormData
      const response = await httpInterceptor.post('/api/radicacion/process_files/', formData);
      return response;
    } catch (error) {
      console.error('Error processing files:', error);
      throw error;
    }
  }

  async createRadicacion(radicacionData: any) {
    try {
      const response = await httpInterceptor.post('/api/radicacion/', radicacionData);
      return response;
    } catch (error) {
      console.error('Error creating radicacion:', error);
      throw error;
    }
  }
}

export default new RadicacionService();