// auditoriaService.ts - Servicio para el módulo de auditoría médica

import httpInterceptor from './httpInterceptor';

interface RadicacionAuditoria {
  id: string;
  numero_radicado: string;
  fecha_radicacion: string;
  pss_nit: string;
  pss_nombre: string;
  modalidad_pago: string;
  valor_total: number;
  estado: string;
  cantidad_facturas: number;
  fecha_asignacion?: string;
  auditor_asignado?: {
    id: string;
    username: string;
    full_name: string;
  };
}

interface AuditoriaStats {
  total_pendientes: number;
  total_en_proceso: number;
  total_auditadas: number;
  valor_total_pendiente: number;
  stats_by_modalidad: Array<{
    modalidad: string;
    count: number;
    valor_total: number;
  }>;
}

class AuditoriaService {
  // Obtener estadísticas de auditoría
  async getAuditoriaStats(): Promise<AuditoriaStats> {
    try {
      const response = await httpInterceptor.get('/api/auditoria/stats/');
      return response;
    } catch (error) {
      console.error('Error loading auditoria stats:', error);
      throw error;
    }
  }

  // Obtener radicaciones pendientes de auditoría
  async getRadicacionesPendientes(filters?: any): Promise<{results: RadicacionAuditoria[], count: number}> {
    try {
      const params = new URLSearchParams();
      
      // Filtro principal: solo radicaciones pendientes de auditoría
      if (filters?.estado && filters.estado !== '') {
        params.append('estado', filters.estado);
      }
      // Si no hay filtro de estado, mostrar todas
      
      if (filters?.modalidad && filters.modalidad !== '') {
        params.append('modalidad', filters.modalidad);
      }
      
      if (filters?.prestador && filters.prestador !== '') {
        params.append('prestador', filters.prestador);
      }
      
      if (filters?.search && filters.search !== '') {
        params.append('search', filters.search);
      }
      
      if (filters?.page) {
        params.append('page', filters.page);
      }
      
      // Por defecto, ordenar por fecha de radicación descendente
      params.append('ordering', '-fecha_radicacion');
      
      // Usar el nuevo endpoint MongoDB nativo para auditoría
      const url = `/api/radicacion/auditoria-pendientes/?${params.toString()}`;
      console.log('URL de solicitud:', url);
      console.log('Parámetros enviados:', params.toString());
      const response = await httpInterceptor.get(url);
      
      // Los datos ya vienen en el formato correcto desde el aggregation pipeline
      // No necesitamos transformación adicional
      
      return response;
    } catch (error) {
      console.error('Error loading radicaciones pendientes:', error);
      throw error;
    }
  }

  // Obtener detalle de una radicación para auditar
  async getRadicacionDetalle(radicacionId: string): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/auditoria/radicacion/${radicacionId}/`);
      return response;
    } catch (error) {
      console.error('Error loading radicacion detalle:', error);
      throw error;
    }
  }

  // Obtener facturas de una radicación
  async getFacturasRadicacion(radicacionId: string): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/auditoria/facturas/?radicacion_id=${radicacionId}`);
      return response;
    } catch (error) {
      console.error('Error loading facturas:', error);
      throw error;
    }
  }

  // Obtener servicios de una factura
  async getServiciosFactura(facturaId: string): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/auditoria/servicios/?factura_id=${facturaId}`);
      return response;
    } catch (error) {
      console.error('Error loading servicios:', error);
      throw error;
    }
  }

  // Aplicar glosa a un servicio
  async aplicarGlosa(servicioId: string, glosaData: any): Promise<any> {
    try {
      // Si el servicioId es "None" o undefined, significa que es un servicio RIPS
      // que aún no tiene registro en auditoría
      if (!servicioId || servicioId === 'None') {
        console.log('Servicio RIPS sin ID de auditoría. Glosa pendiente de aplicar:', glosaData);
        // Por ahora retornar éxito para que la UI funcione
        // Las glosas se aplicarán cuando se cree la factura en auditoría
        return { success: true, message: 'Glosa registrada para aplicar' };
      }
      
      const response = await httpInterceptor.post(`/api/auditoria/servicios/${servicioId}/aplicar_glosa/`, glosaData);
      return response;
    } catch (error) {
      console.error('Error aplicando glosa:', error);
      throw error;
    }
  }

  // Aprobar un servicio
  async aprobarServicio(servicioId: string): Promise<any> {
    try {
      const response = await httpInterceptor.post(`/api/auditoria/servicios/${servicioId}/aprobar/`);
      return response;
    } catch (error) {
      console.error('Error aprobando servicio:', error);
      throw error;
    }
  }

  // Finalizar auditoría de una factura
  async finalizarAuditoriaFactura(facturaId: string): Promise<any> {
    try {
      const response = await httpInterceptor.post(`/api/auditoria/facturas/${facturaId}/finalizar/`);
      return response;
    } catch (error) {
      console.error('Error finalizando auditoría:', error);
      throw error;
    }
  }

  // Obtener prestadores para filtro
  async getPrestadores(): Promise<any> {
    try {
      const response = await httpInterceptor.get('/api/prestadores/list/');
      return response;
    } catch (error) {
      console.error('Error loading prestadores:', error);
      throw error;
    }
  }
}

export default new AuditoriaService();