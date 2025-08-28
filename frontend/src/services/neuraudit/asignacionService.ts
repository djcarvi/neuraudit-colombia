// src/services/neuraudit/asignacionService.ts

/**
 * Servicio Frontend para Sistema de Asignación Automática
 * Integración con backend Django + MongoDB NoSQL
 * 
 * FUNCIONALIDADES:
 * - Dashboard de métricas de asignación
 * - Generar propuestas automáticas
 * - Aprobar/rechazar asignaciones
 * - Gestión manual de asignaciones
 */

import httpInterceptor from './httpInterceptor';

// =====================================
// TIPOS E INTERFACES
// =====================================

export interface AuditorPerfil {
  id: string;
  username: string;
  nombres: string;
  apellidos: string;
  perfil: 'MEDICO' | 'ADMINISTRATIVO';
  especializacion?: string;
  capacidad_maxima_dia: number;
  tipos_auditoria_permitidos: string[];
  disponibilidad: {
    activo: boolean;
    vacaciones: boolean;
    horarios: Record<string, any>;
    capacidad_actual: number;
  };
  metricas_historicas: {
    tiempo_promedio_auditoria: number;
    glosas_promedio_por_caso: number;
    efectividad_glosas: number;
    casos_completados_mes: number;
  };
  carga_actual?: {
    total_asignadas: number;
    en_proceso: number;
    completadas_hoy: number;
  };
  porcentaje_carga?: number;
}

export interface AsignacionIndividual {
  radicacion_id: string;
  numero_radicado: string;
  auditor_asignado: string;
  auditor_perfil: 'MEDICO' | 'ADMINISTRATIVO';
  tipo_auditoria: 'AMBULATORIO' | 'HOSPITALARIO';
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  complejidad: 'ALTA' | 'MEDIA' | 'BAJA';
  fecha_limite: string;
  valor_auditoria: number;
  prestador_info: any;
  servicios_cantidad: number;
  justificacion_algoritmo: string;
  peso_asignacion: number;
}

export interface PropuestaAsignacion {
  id: string;
  fecha_propuesta: string;
  coordinador_id: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'PARCIAL';
  algoritmo_version: string;
  metricas_distribucion: {
    total_radicaciones: number;
    auditores_involucrados: number;
    balance_score: number;
    tipos_servicio: {
      ambulatorio: number;
      hospitalario: number;
    };
    distribucion_prioridad: {
      alta: number;
      media: number;
      baja: number;
    };
    valor_total_asignado: number;
    carga_promedio_auditor: number;
    distribucion_auditores: Record<string, any>;
  };
  asignaciones_individuales: AsignacionIndividual[];
  decisiones_coordinador: any[];
  trazabilidad: any;
}

export interface EstadisticasDashboard {
  radicaciones_pendientes: number;
  auditores_disponibles: number;
  asignaciones_hoy: number;
  propuesta_pendiente: boolean;
  balance_actual: number;
  fecha_actualizacion: string;
}

export interface DecisionCoordinador {
  accion: 'APROBAR_MASIVO' | 'RECHAZAR_MASIVO' | 'APROBAR_INDIVIDUAL' | 'REASIGNAR';
  propuesta_id: string;
  radicaciones_ids?: string[];
  justificacion?: string;
  reasignaciones?: {
    radicacion_id: string;
    nuevo_auditor: string;
  }[];
}

// =====================================
// SERVICIO PRINCIPAL
// =====================================

class AsignacionService {

  // =====================================
  // DASHBOARD Y MÉTRICAS
  // =====================================

  /**
   * Obtiene estadísticas generales para el dashboard
   */
  async obtenerEstadisticasDashboard(): Promise<EstadisticasDashboard> {
    try {
      const response = await httpInterceptor.get(
        '/api/asignacion/dashboard/estadisticas/'
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas dashboard:', error);
      throw new Error('No se pudieron cargar las estadísticas del dashboard');
    }
  }

  /**
   * Obtiene carga de trabajo actual de todos los auditores
   */
  async obtenerCargaAuditores(): Promise<AuditorPerfil[]> {
    try {
      const response = await httpInterceptor.get(
        '/api/asignacion/auditores/carga/'
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo carga auditores:', error);
      throw new Error('No se pudo cargar la información de auditores');
    }
  }

  // =====================================
  // GENERACIÓN DE PROPUESTAS AUTOMÁTICAS
  // =====================================

  /**
   * Genera nueva propuesta de asignación automática
   */
  async generarPropuestaAsignacion(coordinadorUsername: string): Promise<string> {
    try {
      const response = await httpInterceptor.post(
        '/api/asignacion/propuestas/generar/',
        {
          coordinador_username: coordinadorUsername
        }
      );
      return response.propuesta_id;
    } catch (error) {
      console.error('Error generando propuesta:', error);
      throw new Error('No se pudo generar la propuesta de asignación');
    }
  }

  /**
   * Obtiene propuesta de asignación pendiente
   */
  async obtenerPropuestaPendiente(): Promise<PropuestaAsignacion | null> {
    try {
      const response = await httpInterceptor.get(
        '/api/asignacion/propuestas/actual/'
      );
      return response;
    } catch (error: any) {
      // Si es 404, significa que no hay propuestas pendientes - esto es normal
      if (error.status === 404 || error.message?.includes('No hay propuestas pendientes')) {
        console.log('No hay propuestas pendientes actualmente (esto es normal)');
        return null; // No hay propuesta pendiente
      }
      console.error('Error obteniendo propuesta:', error);
      throw new Error('Error al cargar la propuesta de asignación');
    }
  }

  /**
   * Obtiene detalles de una propuesta específica
   */
  async obtenerPropuesta(propuestaId: string): Promise<PropuestaAsignacion> {
    try {
      const response = await httpInterceptor.get(
        `/api/asignacion/propuestas/${propuestaId}/`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo propuesta:', error);
      throw new Error('No se pudo cargar la propuesta de asignación');
    }
  }

  // =====================================
  // GESTIÓN DE DECISIONES COORDINADOR
  // =====================================

  /**
   * Procesa decisión del coordinador sobre propuesta
   */
  async procesarDecisionCoordinador(decision: DecisionCoordinador): Promise<boolean> {
    try {
      // Extraer propuesta_id de la decisión para usarlo en la URL
      const { propuesta_id, ...decisionData } = decision;
      
      const response = await httpInterceptor.post(
        `/api/asignacion/propuestas/${propuesta_id}/procesar_decision/`,
        decisionData
      );
      return response.success;
    } catch (error) {
      console.error('Error procesando decisión:', error);
      throw new Error('No se pudo procesar la decisión del coordinador');
    }
  }

  /**
   * Aprobación masiva de toda la propuesta
   */
  async aprobarPropuestaMasiva(
    propuestaId: string, 
    coordinadorUsername: string
  ): Promise<boolean> {
    const decision: DecisionCoordinador = {
      accion: 'APROBAR_MASIVO',
      propuesta_id: propuestaId
    };
    return this.procesarDecisionCoordinador(decision);
  }

  /**
   * Rechazo masivo de toda la propuesta
   */
  async rechazarPropuestaMasiva(
    propuestaId: string, 
    coordinadorUsername: string,
    justificacion: string
  ): Promise<boolean> {
    const decision: DecisionCoordinador = {
      accion: 'RECHAZAR_MASIVO',
      propuesta_id: propuestaId,
      justificacion: justificacion
    };
    return this.procesarDecisionCoordinador(decision);
  }

  /**
   * Aprobación individual de asignaciones específicas
   */
  async aprobarAsignacionesIndividuales(
    propuestaId: string,
    radicacionesIds: string[]
  ): Promise<boolean> {
    const decision: DecisionCoordinador = {
      accion: 'APROBAR_INDIVIDUAL',
      propuesta_id: propuestaId,
      radicaciones_ids: radicacionesIds
    };
    return this.procesarDecisionCoordinador(decision);
  }

  /**
   * Reasignar auditor para asignaciones específicas
   */
  async reasignarAuditores(
    propuestaId: string,
    reasignaciones: { radicacion_id: string; nuevo_auditor: string }[]
  ): Promise<boolean> {
    const decision: DecisionCoordinador = {
      accion: 'REASIGNAR',
      propuesta_id: propuestaId,
      reasignaciones: reasignaciones
    };
    return this.procesarDecisionCoordinador(decision);
  }

  // =====================================
  // ASIGNACIONES MANUALES
  // =====================================

  /**
   * Obtiene asignaciones actuales para vista Kanban
   */
  async obtenerAsignacionesKanban(): Promise<{
    pendientes: AsignacionIndividual[];
    asignadas: AsignacionIndividual[];
    en_proceso: AsignacionIndividual[];
    completadas: AsignacionIndividual[];
  }> {
    try {
      const response = await httpInterceptor.get('/api/asignacion/kanban/');
      return response;
    } catch (error) {
      console.error('Error obteniendo asignaciones Kanban:', error);
      throw new Error('No se pudieron cargar las asignaciones');
    }
  }

  /**
   * Mueve asignación entre estados (drag & drop)
   */
  async moverAsignacion(
    asignacionId: string,
    nuevoEstado: 'ASIGNADA' | 'EN_PROCESO' | 'COMPLETADA'
  ): Promise<boolean> {
    try {
      const response = await httpInterceptor.patch(
        `/api/asignacion/asignaciones/${asignacionId}/mover/`,
        { nuevo_estado: nuevoEstado }
      );
      return response.success;
    } catch (error) {
      console.error('Error moviendo asignación:', error);
      throw new Error('No se pudo actualizar la asignación');
    }
  }

  /**
   * Asignación manual de radicación a auditor
   */
  async asignarManualmente(
    radicacionId: string,
    auditorUsername: string,
    tipoAuditoria: 'AMBULATORIO' | 'HOSPITALARIO',
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA'
  ): Promise<string> {
    try {
      const response = await httpInterceptor.post('/api/asignacion/manual/', {
        radicacion_id: radicacionId,
        auditor_username: auditorUsername,
        tipo_auditoria: tipoAuditoria,
        prioridad: prioridad
      });
      return response.asignacion_id;
    } catch (error) {
      console.error('Error en asignación manual:', error);
      throw new Error('No se pudo realizar la asignación manual');
    }
  }

  // =====================================
  // TRAZABILIDAD Y REPORTES
  // =====================================

  /**
   * Obtiene historial de trazabilidad para una propuesta
   */
  async obtenerTrazabilidad(propuestaId: string): Promise<any[]> {
    try {
      const response = await httpInterceptor.get(
        `/api/asignacion/propuestas/${propuestaId}/trazabilidad/`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo trazabilidad:', error);
      throw new Error('No se pudo cargar la trazabilidad');
    }
  }

  /**
   * Genera reporte de rendimiento del algoritmo
   */
  async generarReporteRendimiento(fechaInicio: string, fechaFin: string): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/asignacion/reportes/rendimiento/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
      return response;
    } catch (error) {
      console.error('Error generando reporte:', error);
      throw new Error('No se pudo generar el reporte de rendimiento');
    }
  }

  /**
   * Obtiene tendencias de asignaciones por período
   */
  async obtenerTendenciasAsignacion(periodo: 'mes' | 'semana' | 'año' = 'mes'): Promise<any> {
    try {
      const response = await httpInterceptor.get(`/api/asignacion/tendencias/?periodo=${periodo}`);
      return response.success ? response.tendencias : { categorias: [], series: [] };
    } catch (error) {
      console.error('Error obteniendo tendencias:', error);
      throw new Error('No se pudieron cargar las tendencias de asignación');
    }
  }

  /**
   * Obtiene métricas del algoritmo de asignación
   */
  async obtenerMetricasAlgoritmo(): Promise<any[]> {
    try {
      const response = await httpInterceptor.get('/api/asignacion/metricas-algoritmo/');
      return response.success ? response.metricas : [];
    } catch (error) {
      console.error('Error obteniendo métricas del algoritmo:', error);
      throw new Error('No se pudieron cargar las métricas del algoritmo');
    }
  }

  // =====================================
  // UTILIDADES
  // =====================================

  /**
   * Calcula días hábiles entre dos fechas
   */
  calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {
    let dias = 0;
    let fechaActual = new Date(fechaInicio);
    
    while (fechaActual <= fechaFin) {
      const diaSemana = fechaActual.getDay();
      // 0 = domingo, 6 = sábado
      if (diaSemana !== 0 && diaSemana !== 6) {
        dias++;
      }
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return dias;
  }

  /**
   * Formatea valor monetario en COP
   */
  formatearValor(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  /**
   * Calcula porcentaje de balance del algoritmo
   */
  calcularPorcentajeBalance(balanceScore: number): string {
    return `${(balanceScore * 100).toFixed(1)}%`;
  }

  /**
   * Obtiene color por prioridad
   */
  obtenerColorPrioridad(prioridad: 'ALTA' | 'MEDIA' | 'BAJA'): string {
    const colores = {
      'ALTA': '#dc3545',    // Rojo
      'MEDIA': '#fd7e14',   // Naranja
      'BAJA': '#28a745'     // Verde
    };
    return colores[prioridad];
  }

  /**
   * Obtiene ícono por tipo de auditoría
   */
  obtenerIconoTipoAuditoria(tipo: 'AMBULATORIO' | 'HOSPITALARIO'): string {
    const iconos = {
      'AMBULATORIO': 'ri-hospital-line',
      'HOSPITALARIO': 'ri-hospital-fill'
    };
    return iconos[tipo];
  }
}

// Exportar instancia singleton
export const asignacionService = new AsignacionService();
export default asignacionService;