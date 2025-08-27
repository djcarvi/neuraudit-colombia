/**
 * Servicio para gestión de Tarifarios Oficiales
 * ISS 2001 (Mínimo Nacional) y SOAT 2025 (Máximo Nacional)
 */

const API_BASE_URL = 'http://localhost:8003/api';

export interface TarifarioISS2001 {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: string;
  uvr?: number | string;
  valor_uvr_2001?: number | string;
  valor_calculado?: number;
  valor_referencia_actual?: number;
  contratos_activos: number;
  uso_frecuente: boolean;
}

export interface TarifarioSOAT2025 {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: string;
  grupo_quirurgico?: string;
  uvb?: number;
  valor_2025_uvb?: number | string;
  valor_calculado?: number;
  valor_referencia_actual?: number;
  seccion_manual?: string;
  contratos_activos: number;
  uso_frecuente: boolean;
}

export interface TarifarioEstadisticas {
  total: number;
  quirurgicos: number;
  diagnosticos: number;
  consultas: number;
  internacion?: number;
  laboratorio?: number;
  estancias?: number;
  con_contratos: number;
  uso_frecuente: number;
  distribucion_por_tipo: Array<{tipo: string; count: number}>;
}

class TarifariosOficialesService {
  
  // Obtener tarifarios ISS 2001 (incluye estadísticas)
  async getTarifariosISS2001(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    tipo_servicio?: string;
    con_contratos_activos?: boolean;
    uso_frecuente?: boolean;
  }): Promise<{ results: TarifarioISS2001[], count: number, stats: TarifarioEstadisticas }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.tipo_servicio) queryParams.append('tipo_servicio', params.tipo_servicio);
      if (params?.con_contratos_activos) queryParams.append('con_contratos_activos', 'true');
      if (params?.uso_frecuente) queryParams.append('uso_frecuente', 'true');

      const url = `${API_BASE_URL}/contratacion/tarifarios-oficiales/iss/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('🌐 ISS API Call:', url);
      
      const response = await fetch(url);
      console.log('📡 ISS Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ISS API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ ISS API Success:', { count: data.count, results: data.results?.length });
      return data;
    } catch (error) {
      console.error('❌ Error fetching tarifarios ISS 2001:', error);
      throw error;
    }
  }

  // Obtener tarifarios SOAT 2025 (incluye estadísticas)
  async getTarifariosSOAT2025(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    tipo_servicio?: string;
    grupo_quirurgico?: string;
    con_contratos_activos?: boolean;
    uso_frecuente?: boolean;
  }): Promise<{ results: TarifarioSOAT2025[], count: number, stats: TarifarioEstadisticas }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.tipo_servicio) queryParams.append('tipo_servicio', params.tipo_servicio);
      if (params?.grupo_quirurgico) queryParams.append('grupo_quirurgico', params.grupo_quirurgico);
      if (params?.con_contratos_activos) queryParams.append('con_contratos_activos', 'true');
      if (params?.uso_frecuente) queryParams.append('uso_frecuente', 'true');

      const url = `${API_BASE_URL}/contratacion/tarifarios-oficiales/soat/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('🌐 SOAT API Call:', url);
      
      const response = await fetch(url);
      console.log('📡 SOAT Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SOAT API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ SOAT API Success:', { count: data.count, results: data.results?.length });
      return data;
    } catch (error) {
      console.error('❌ Error fetching tarifarios SOAT 2025:', error);
      throw error;
    }
  }

  // Comparar código específico entre ISS y SOAT
  async compararCodigo(codigo: string): Promise<{
    iss_2001: TarifarioISS2001 | null;
    soat_2025: TarifarioSOAT2025 | null;
    diferencia_porcentual?: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/catalogs/tarifarios-oficiales/comparar/${codigo}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error comparing código:', error);
      throw error;
    }
  }

  // Obtener códigos más consultados
  async getCodigosMasConsultados(): Promise<TarifarioISS2001[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/catalogs/tarifarios-oficiales/mas-consultados/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching códigos más consultados:', error);
      throw error;
    }
  }

  // Obtener procedimientos en tendencia
  async getProcedimientosEnTendencia(): Promise<TarifarioISS2001[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/catalogs/tarifarios-oficiales/tendencia/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching procedimientos en tendencia:', error);
      throw error;
    }
  }

  // Buscar tarifas similares en SOAT basado en descripción ISS
  async buscarSimilaresPorDescripcion(codigoISS: string): Promise<{
    descripcion_buscada: string;
    palabras_clave: string[];
    resultados: TarifarioSOAT2025[];
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contratacion/tarifarios-oficiales/iss/buscar_similares/?codigo_iss=${codigoISS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error buscando tarifas similares:', error);
      throw error;
    }
  }
}

export default new TarifariosOficialesService();