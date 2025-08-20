// types.ts - Interfaces TypeScript para datos del dashboard NeurAudit

export interface DashboardTotal {
  valor: number;
  cantidad: number;
  porcentaje: number;
  tendencia: 'up' | 'down';
}

export interface ResumenMensual {
  meses: string[];
  totalRadicado: number[];
  totalGlosado: number[];
  totalConciliado: number[];
}

export interface DistribucionAuditores {
  labels: string[];
  series: number[];
}

export interface RadicacionReciente {
  id: string;
  numero_radicado: string;
  prestador: string;
  nit: string;
  fecha: string;
  valor: number;
  estado: string;
  usuario: string;
}

export interface ActividadReciente {
  id: string;
  tipo: string;
  mensaje: string;
  usuario: string;
  fecha: string;
  icono: string;
  color: string;
  metadata: any;
}

export interface TopPrestador {
  nombre: string;
  nit: string;
  cantidad: number;
  valor: number;
}

export interface TopAuditor {
  nombre: string;
  tipo: string;
  glosas: number;
  valor_glosado: number;
  efectividad: number;
}

export interface TopServicio {
  nombre: string;
  cantidad: number;
  valor: number;
  porcentaje: number;
}

export interface FacturaReciente {
  id: string;
  numero_factura: string;
  prestador: string;
  fecha: string;
  valor: number;
  estado: string;
  dias_transcurridos: number;
}

export interface ConciliacionReciente {
  id: string;
  caso: string;
  prestador: string;
  valor_glosado: number;
  valor_acordado: number;
  estado: string;
  fecha: string;
  auditor: string;
}

export interface EstadoTipo {
  estado: string;
  count: number;
  total: number;
}

export interface DashboardGeneralData {
  totales: {
    radicado: DashboardTotal;
    devuelto: DashboardTotal;
    glosado: DashboardTotal;
    conciliado: DashboardTotal;
  };
  graficos: {
    resumenMensual: ResumenMensual;
    distribucionAuditores: DistribucionAuditores;
  };
  listas: {
    radicacionesRecientes: RadicacionReciente[];
    actividadReciente: ActividadReciente[];
    topPrestadores: TopPrestador[];
    topAuditores: TopAuditor[];
    topServicios: TopServicio[];
    facturasRecientes: FacturaReciente[];
    conciliacionesRecientes: ConciliacionReciente[];
  };
  estadisticas: {
    totalRadicaciones: number;
    radicacionesUltimoMes: number;
    estadosPorTipo: EstadoTipo[];
  };
}