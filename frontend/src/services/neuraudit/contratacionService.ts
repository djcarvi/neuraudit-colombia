// contratacionService.ts - Servicio para el módulo de contratación

import httpInterceptor from './httpInterceptor';

interface PrestadorStats {
  total_prestadores: number;
  prestadores_activos: number;
  con_contrato_vigente: number;
  prestadores_nuevos_mes: number;
  niveles_bajos: string;
  fecha_consulta: string;
}

interface PrestadorData {
  id: string;
  nit: string;
  razon_social: string;
  nombre_comercial: string;
  codigo_habilitacion: string;
  tipo_prestador: string;
  nivel_atencion: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  habilitado_reps: boolean;
  fecha_habilitacion: string;
  servicios_habilitados: string[];
}

class ContratacionService {
  async getPrestadoresStats(): Promise<PrestadorStats> {
    try {
      const response = await httpInterceptor.get('/api/contratacion/prestadores/estadisticas/');
      return response;
    } catch (error) {
      console.error('Error loading prestadores stats:', error);
      throw error;
    }
  }

  async getContratosStats(): Promise<any> {
    try {
      const response = await httpInterceptor.get('/api/contratacion/contratos/estadisticas/');
      return response;
    } catch (error) {
      console.error('Error loading contratos stats:', error);
      throw error;
    }
  }

  async getContratos(filters?: any): Promise<{results: any[], count: number}> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.estado) {
        params.append('estado', filters.estado);
      }
      
      if (filters?.modalidad_principal) {
        params.append('modalidad_principal', filters.modalidad_principal);
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      
      if (filters?.page) {
        params.append('page', filters.page);
      }
      
      const url = params.toString() ? `/api/contratacion/contratos/?${params.toString()}` : '/api/contratacion/contratos/';
      const response = await httpInterceptor.get(url);
      return response;
    } catch (error) {
      console.error('Error loading contratos:', error);
      throw error;
    }
  }

  async getPrestadores(filters?: any): Promise<{results: PrestadorData[], count: number}> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.estado) {
        params.append('estado', filters.estado);
      }
      
      if (filters?.tipo_prestador) {
        params.append('tipo_prestador', filters.tipo_prestador);
      }
      
      if (filters?.nivel_atencion) {
        params.append('nivel_atencion', filters.nivel_atencion);
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      
      if (filters?.page) {
        params.append('page', filters.page);
      }
      
      const url = params.toString() ? `/api/contratacion/prestadores/?${params.toString()}` : '/api/contratacion/prestadores/';
      const response = await httpInterceptor.get(url);
      return response;
    } catch (error) {
      console.error('Error loading prestadores:', error);
      throw error;
    }
  }

  async exportPrestadores(formato: 'excel' | 'csv' | 'pdf'): Promise<void> {
    try {
      const response = await httpInterceptor.get(`/api/contratacion/prestadores/export/?formato=${formato}`, {
        responseType: 'blob'
      });
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prestadores_${new Date().toISOString().split('T')[0]}.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting prestadores:', error);
      throw error;
    }
  }

  async importPrestadoresCSV(csvFile: File, skipRows: number = 0): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('archivo', csvFile);
      formData.append('skip_rows', skipRows.toString());
      
      // NO establecer Content-Type manualmente para FormData
      const response = await httpInterceptor.post('/api/contratacion/prestadores/import_csv/', formData);
      return response;
    } catch (error) {
      console.error('Error importing prestadores from CSV:', error);
      throw error;
    }
  }

  async createPrestador(prestadorData: any): Promise<any> {
    try {
      const response = await httpInterceptor.post('/api/contratacion/prestadores/', prestadorData);
      return response;
    } catch (error) {
      console.error('Error creating prestador:', error);
      throw error;
    }
  }

  async updatePrestador(id: string, prestadorData: any): Promise<any> {
    try {
      const response = await httpInterceptor.put(`/api/contratacion/prestadores/${id}/`, prestadorData);
      return response;
    } catch (error) {
      console.error('Error updating prestador:', error);
      throw error;
    }
  }

  async getPrestadorById(id: string): Promise<PrestadorData> {
    try {
      const response = await httpInterceptor.get(`/api/contratacion/prestadores/${id}/`);
      return response;
    } catch (error) {
      console.error('Error getting prestador:', error);
      throw error;
    }
  }

  async getContrato(id: string): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/contratacion/contratos/${id}/`);
      return response;
    } catch (error) {
      console.error('Error getting contrato:', error);
      throw error;
    }
  }

  async getPrestador(id: string): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/contratacion/prestadores/${id}/`);
      return response;
    } catch (error) {
      console.error('Error getting prestador:', error);
      throw error;
    }
  }

  async getTarifariosOficiales(tipo: 'iss' | 'soat', filters?: any): Promise<{results: any[], count: number, stats: any}> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      
      if (filters?.tipo_servicio) {
        params.append('tipo_servicio', filters.tipo_servicio);
      }
      
      if (filters?.con_contratos_activos) {
        params.append('con_contratos_activos', 'true');
      }
      
      if (filters?.page) {
        params.append('page', filters.page);
      }
      
      // Endpoint real de tarifarios oficiales MongoDB NoSQL
      const url = params.toString() 
        ? `/api/contratacion/tarifarios-oficiales/${tipo}/?${params.toString()}` 
        : `/api/contratacion/tarifarios-oficiales/${tipo}/`;
      
      const response = await httpInterceptor.get(url);
      return response;
    } catch (error) {
      console.error(`Error loading tarifarios ${tipo}:`, error);
      throw error;
    }
  }

  async exportTarifarios(tipo: 'iss' | 'soat', formato: 'excel' | 'csv' | 'pdf'): Promise<void> {
    try {
      const response = await httpInterceptor.get(`/api/contratacion/tarifarios-oficiales/${tipo}/export/?formato=${formato}`, {
        responseType: 'blob'
      });
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tarifario_${tipo}_${new Date().toISOString().split('T')[0]}.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting tarifarios:', error);
      throw error;
    }
  }
}

export default new ContratacionService();