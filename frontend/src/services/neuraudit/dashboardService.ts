// dashboardService.ts - Servicio para obtener datos del dashboard de NeurAudit

import httpInterceptor from './httpInterceptor';
import type { DashboardGeneralData as DashboardDataImported } from './types';

interface DashboardGeneralData extends DashboardDataImported {
  // Extender con campos específicos del servicio si es necesario
  // Resumen Auditoría (gráfico principal)
  resumenAuditoria: {
    meses: string[];
    totalRadicado: number[];
    totalGlosado: number[];
    totalConciliado: number[];
  };
  
  // Distribución por auditores
  distribucionAuditores: {
    labels: string[];
    series: number[];
  };
  
  // Top servicios radicados
  topServiciosRadicados: Array<{
    id?: string;
    codigo?: string;
    descripcion?: string;
    nombre?: string;
    cantidadRadicada?: number;
    cantidad?: number;
    valorTotal?: number;
    valor?: number;
    porcentaje: number;
  }>;
  
  // Actividad reciente
  actividadReciente: Array<{
    id: string;
    tipo: string;
    mensaje?: string;
    descripcion?: string;
    usuario: string;
    fecha: string;
    valor?: number;
    icono?: string;
    color?: string;
    metadata?: any;
  }>;
  
  // Top prestadores
  topPrestadores: Array<{
    id?: string;
    nit: string;
    nombre: string;
    valorRadicado?: number;
    valor?: number;
    facturas?: number;
    cantidad?: number;
    avatar?: string;
  }>;
  
  // Top auditores por glosas
  topAuditoresGlosas: Array<{
    id?: string;
    nombre: string;
    tipo?: string;
    totalGlosas?: number;
    glosas?: number;
    valorGlosado?: number;
    valor_glosado?: number;
    efectividad: number;
  }>;
  
  // Facturas recientes
  facturasRecientes: Array<{
    id: string;
    numeroFactura?: string;
    numero_factura?: string;
    prestador: string;
    fechaRadicacion?: string;
    fecha?: string;
    valor: number;
    estado: string;
    estadoColor?: string;
    dias_transcurridos?: number;
  }>;
  
  // Conciliaciones recientes
  conciliacionesRecientes: Array<{
    id: string;
    codigo?: string;
    caso?: string;
    prestador: string;
    fechaInicio?: string;
    fecha?: string;
    valorDisputa?: number;
    valor_glosado?: number;
    valorConciliado?: number;
    valor_acordado?: number;
    estado: string;
    estadoColor?: string;
    auditor?: string;
  }>;
}

class DashboardService {
  async getDashboardData(filters?: {
    periodo?: 'dia' | 'semana' | 'mes' | 'año';
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<DashboardGeneralData> {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      if (filters?.periodo) {
        params.append('periodo', filters.periodo);
      }
      
      if (filters?.fechaInicio) {
        params.append('fecha_inicio', filters.fechaInicio);
      }
      
      if (filters?.fechaFin) {
        params.append('fecha_fin', filters.fechaFin);
      }
      
      // Usar el nuevo endpoint centralizado con parámetros
      const url = params.toString() ? `/api/dashboard/general/?${params.toString()}` : '/api/dashboard/general/';
      const dashboardData = await httpInterceptor.get(url);
      
      // Procesar los datos del nuevo formato
      return this.processDashboardDataV2(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      throw error;
    }
  }

  private processDashboardData(rawData: any): DashboardGeneralData {
    const { radicacionStats, glosasStats, conciliacionStats, auditoriaStats } = rawData;
    
    console.log('Raw data received:', rawData);
    
    // Calcular tendencias (comparando con mes anterior)
    const calcularTendencia = (actual: number, anterior: number) => {
      const porcentaje = anterior > 0 ? ((actual - anterior) / anterior) * 100 : 0;
      return {
        porcentaje: Math.abs(porcentaje),
        tendencia: porcentaje >= 0 ? 'up' : 'down'
      };
    };

    // Tarjetas principales - manejando estructura real del backend
    const totalRadicaciones = radicacionStats?.total_radicaciones || 0;
    const ultimoMes = radicacionStats?.radicaciones_ultimo_mes || 0;
    
    const totalRadicado = {
      valor: totalRadicaciones * 1000000, // Simulando valor monetario
      ...calcularTendencia(totalRadicaciones, ultimoMes)
    };

    // Por ahora usamos valores temporales mientras se implementan todos los endpoints
    const totalDevuelto = {
      valor: 0,
      cantidad: 0,
      porcentaje: 0,
      tendencia: 'up' as const
    };

    const totalGlosado = {
      valor: 0,
      cantidad: 0,
      porcentaje: 0,
      tendencia: 'up' as const
    };

    const totalConciliado = {
      valor: 0,
      cantidad: 0,
      porcentaje: 0,
      tendencia: 'up' as const
    };

    // Resumen para gráfico principal (últimos 12 meses)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const resumenAuditoria = {
      meses,
      totalRadicado: this.generateMonthlyData(12, 100000, 300000),
      totalGlosado: this.generateMonthlyData(12, 20000, 80000),
      totalConciliado: this.generateMonthlyData(12, 15000, 60000)
    };

    // Distribución por auditores
    const distribucionAuditores = {
      labels: ['Auditor Médico', 'Auditor Administrativo', 'Coordinador', 'Conciliador'],
      series: [45, 30, 15, 10]
    };

    // Top servicios (simulado con datos reales)
    const topServiciosRadicados = [
      {
        id: '1',
        codigo: '890201',
        descripcion: 'CONSULTA MEDICINA GENERAL',
        cantidadRadicada: 15234,
        valorTotal: 458000000,
        porcentaje: 23.5
      },
      {
        id: '2',
        codigo: '890301',
        descripcion: 'CONSULTA MEDICINA ESPECIALIZADA',
        cantidadRadicada: 8921,
        valorTotal: 356000000,
        porcentaje: 18.2
      },
      {
        id: '3',
        codigo: '395001',
        descripcion: 'HOSPITALIZACIÓN GENERAL',
        cantidadRadicada: 3456,
        valorTotal: 890000000,
        porcentaje: 15.8
      },
      {
        id: '4',
        codigo: '902210',
        descripcion: 'LABORATORIO CLÍNICO',
        cantidadRadicada: 28934,
        valorTotal: 234000000,
        porcentaje: 12.3
      },
      {
        id: '5',
        codigo: '879300',
        descripcion: 'IMÁGENES DIAGNÓSTICAS',
        cantidadRadicada: 12890,
        valorTotal: 567000000,
        porcentaje: 10.2
      }
    ];

    // Actividad reciente
    const actividadReciente = this.generateRecentActivity();

    // Top prestadores
    const topPrestadores = this.generateTopPrestadores();

    // Top auditores
    const topAuditoresGlosas = this.generateTopAuditores();

    // Facturas recientes
    const facturasRecientes = this.processFacturasRecientes(rawData.facturasRecientes || { results: [] });

    // Conciliaciones recientes
    const conciliacionesRecientes = this.processConciliacionesRecientes(rawData.conciliacionesRecientes || { results: [] });

    return {
      totalRadicado,
      totalDevuelto,
      totalGlosado,
      totalConciliado,
      resumenAuditoria,
      distribucionAuditores,
      topServiciosRadicados,
      actividadReciente,
      topPrestadores,
      topAuditoresGlosas,
      facturasRecientes,
      conciliacionesRecientes
    };
  }

  private generateMonthlyData(count: number, min: number, max: number): number[] {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  private generateRecentActivity(): any[] {
    const tipos = ['radicacion', 'glosa', 'conciliacion', 'devolucion'];
    const usuarios = ['María García', 'Juan Pérez', 'Ana López', 'Carlos Rodríguez'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `act-${i + 1}`,
      tipo: tipos[Math.floor(Math.random() * tipos.length)] as any,
      descripcion: this.getActivityDescription(tipos[Math.floor(Math.random() * tipos.length)]),
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
      fecha: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      valor: Math.floor(Math.random() * 1000000) + 100000
    }));
  }

  private getActivityDescription(tipo: string): string {
    const descriptions: Record<string, string[]> = {
      radicacion: [
        'Radicó factura #FAC-2024-',
        'Nueva radicación de servicios médicos',
        'Radicación masiva procesada'
      ],
      glosa: [
        'Aplicó glosa técnica FA0001',
        'Glosa administrativa por documentación',
        'Nueva glosa por pertinencia médica'
      ],
      conciliacion: [
        'Inició proceso de conciliación',
        'Conciliación finalizada exitosamente',
        'Actualización en caso de conciliación'
      ],
      devolucion: [
        'Factura devuelta por documentación',
        'Devolución por fuera de términos',
        'Procesó devolución masiva'
      ]
    };
    
    const options = descriptions[tipo] || ['Actividad registrada'];
    return options[Math.floor(Math.random() * options.length)] + Math.floor(Math.random() * 9999);
  }

  private generateTopPrestadores(): any[] {
    const prestadores = [
      { nit: '900123456-1', nombre: 'CLÍNICA SAN RAFAEL S.A.' },
      { nit: '890234567-2', nombre: 'HOSPITAL UNIVERSITARIO NACIONAL' },
      { nit: '800345678-3', nombre: 'CENTRO MÉDICO ESPECIALIZADO' },
      { nit: '900456789-4', nombre: 'LABORATORIO CLÍNICO CENTRAL' },
      { nit: '890567890-5', nombre: 'IMÁGENES DIAGNÓSTICAS S.A.S.' }
    ];

    return prestadores.map((p, i) => ({
      id: `prest-${i + 1}`,
      ...p,
      valorRadicado: Math.floor(Math.random() * 900000000) + 100000000,
      facturas: Math.floor(Math.random() * 500) + 100,
      avatar: `/api/placeholder/32/32`
    }));
  }

  private generateTopAuditores(): any[] {
    const auditores = [
      'Dra. Laura Martínez',
      'Dr. Roberto Sánchez',
      'Dra. Carolina Herrera',
      'Dr. Miguel Ángel Torres',
      'Dra. Patricia Gómez'
    ];

    return auditores.map((nombre, i) => ({
      id: `aud-${i + 1}`,
      nombre,
      totalGlosas: Math.floor(Math.random() * 300) + 50,
      valorGlosado: Math.floor(Math.random() * 50000000) + 10000000,
      efectividad: Math.floor(Math.random() * 30) + 70
    }));
  }

  private processFacturasRecientes(data: any): any[] {
    if (!data?.results) return [];
    
    return data.results.slice(0, 5).map((factura: any) => ({
      id: factura.id,
      numeroFactura: factura.numero_factura,
      prestador: factura.prestador_info?.nombre || 'Sin información',
      fechaRadicacion: factura.fecha_radicacion,
      valor: factura.valor_total,
      estado: this.mapEstadoFactura(factura.estado),
      estadoColor: this.getEstadoColor(factura.estado)
    }));
  }

  private processConciliacionesRecientes(data: any): any[] {
    if (!data?.results) return [];
    
    return data.results.slice(0, 5).map((caso: any) => ({
      id: caso.id,
      codigo: caso.codigo_caso,
      prestador: caso.prestador_info?.nombre || 'Sin información',
      fechaInicio: caso.fecha_creacion,
      valorDisputa: caso.valor_en_disputa,
      valorConciliado: caso.valor_conciliado,
      estado: this.mapEstadoConciliacion(caso.estado),
      estadoColor: this.getEstadoConciliacionColor(caso.estado)
    }));
  }

  private mapEstadoFactura(estado: string): string {
    const estados: Record<string, string> = {
      'RADICADA': 'Radicada',
      'EN_AUDITORIA': 'En Auditoría',
      'AUDITADA': 'Auditada',
      'GLOSADA': 'Con Glosas',
      'DEVUELTA': 'Devuelta',
      'APROBADA': 'Aprobada'
    };
    return estados[estado] || estado;
  }

  private getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      'RADICADA': 'primary',
      'EN_AUDITORIA': 'warning',
      'AUDITADA': 'info',
      'GLOSADA': 'danger',
      'DEVUELTA': 'secondary',
      'APROBADA': 'success'
    };
    return colores[estado] || 'secondary';
  }

  private mapEstadoConciliacion(estado: string): string {
    const estados: Record<string, string> = {
      'ABIERTO': 'Abierto',
      'EN_PROCESO': 'En Proceso',
      'ACUERDO_PARCIAL': 'Acuerdo Parcial',
      'CONCILIADO': 'Conciliado',
      'NO_CONCILIADO': 'No Conciliado',
      'CERRADO': 'Cerrado'
    };
    return estados[estado] || estado;
  }

  private getEstadoConciliacionColor(estado: string): string {
    const colores: Record<string, string> = {
      'ABIERTO': 'primary',
      'EN_PROCESO': 'warning',
      'ACUERDO_PARCIAL': 'info',
      'CONCILIADO': 'success',
      'NO_CONCILIADO': 'danger',
      'CERRADO': 'secondary'
    };
    return colores[estado] || 'secondary';
  }
  private processDashboardDataV2(data: any): DashboardGeneralData {
    // Verificar que tenemos la estructura correcta
    if (!data || !data.totales) {
      throw new Error('Invalid dashboard data structure');
    }
    
    // Usar datos exactos del backend
    const totales = data.totales;
    const graficos = data.graficos || {};
    const listas = data.listas || {};
    const estadisticas = data.estadisticas || {};
    
    // Tarjetas principales - usar datos exactos del backend
    const totalRadicado = totales.radicado;
    const totalDevuelto = totales.devuelto;
    const totalGlosado = totales.glosado;
    const totalConciliado = totales.conciliado;

    // Gráficos - usar datos exactos
    const resumenAuditoria = graficos.resumenMensual || {
      meses: [],
      totalRadicado: [],
      totalGlosado: [],
      totalConciliado: []
    };
    const distribucionAuditores = graficos.distribucionAuditores || {
      labels: [],
      series: []
    };

    // Usar las listas reales del backend
    const actividadReciente = listas.actividadReciente || [];
    const topPrestadores = listas.topPrestadores || [];
    const topAuditoresGlosas = listas.topAuditores || [];
    const topServiciosRadicados = listas.topServicios || [];
    const facturasRecientes = listas.facturasRecientes || [];
    const conciliacionesRecientes = listas.conciliacionesRecientes || [];
    
    // Mapear facturas recientes para agregar color de estado si falta
    const facturasConColor = facturasRecientes.map((factura: any) => ({
      ...factura,
      numeroFactura: factura.numero_factura || factura.numeroFactura,
      fechaRadicacion: factura.fecha || factura.fechaRadicacion,
      estadoColor: factura.estadoColor || this.getEstadoColor(factura.estado)
    }));
    
    // Mapear conciliaciones para agregar color de estado si falta
    const conciliacionesConColor = conciliacionesRecientes.map((conc: any) => ({
      ...conc,
      codigo: conc.caso || conc.codigo,
      fechaInicio: conc.fecha || conc.fechaInicio,
      valorDisputa: conc.valor_glosado || conc.valorDisputa,
      valorConciliado: conc.valor_acordado || conc.valorConciliado,
      estadoColor: conc.estadoColor || this.getEstadoConciliacionColor(conc.estado)
    }));
    
    // Mapear servicios y auditores para campos consistentes
    const serviciosFormateados = topServiciosRadicados.map((servicio: any) => ({
      ...servicio,
      cantidadRadicada: servicio.cantidad || servicio.cantidadRadicada,
      valorTotal: servicio.valor || servicio.valorTotal
    }));
    
    const auditoresFormateados = topAuditoresGlosas.map((auditor: any) => ({
      ...auditor,
      totalGlosas: auditor.glosas || auditor.totalGlosas,
      valorGlosado: auditor.valor_glosado || auditor.valorGlosado
    }));
    
    const prestadoresFormateados = topPrestadores.map((prestador: any) => ({
      ...prestador,
      valorRadicado: prestador.valor || prestador.valorRadicado,
      facturas: prestador.cantidad || prestador.facturas
    }));

    return {
      totales,
      graficos,
      listas: {
        radicacionesRecientes: listas.radicacionesRecientes || [],
        actividadReciente,
        topPrestadores: prestadoresFormateados,
        topAuditores: auditoresFormateados,
        topServicios: serviciosFormateados,
        facturasRecientes: facturasConColor,
        conciliacionesRecientes: conciliacionesConColor
      },
      estadisticas,
      // Campos específicos del servicio
      totalRadicado,
      totalDevuelto,
      totalGlosado,
      totalConciliado,
      resumenAuditoria,
      distribucionAuditores,
      topServiciosRadicados: serviciosFormateados,
      actividadReciente,
      topPrestadores: prestadoresFormateados,
      topAuditoresGlosas: auditoresFormateados,
      facturasRecientes: facturasConColor,
      conciliacionesRecientes: conciliacionesConColor
    };
  }

  private generateTopServicios(): any[] {
    return [
      {
        id: '1',
        codigo: '890201',
        descripcion: 'CONSULTA MEDICINA GENERAL',
        cantidadRadicada: 15234,
        valorTotal: 458000000,
        porcentaje: 23.5
      },
      {
        id: '2',
        codigo: '890301',
        descripcion: 'CONSULTA MEDICINA ESPECIALIZADA',
        cantidadRadicada: 8921,
        valorTotal: 356000000,
        porcentaje: 18.2
      },
      {
        id: '3',
        codigo: '395001',
        descripcion: 'HOSPITALIZACIÓN GENERAL',
        cantidadRadicada: 3456,
        valorTotal: 890000000,
        porcentaje: 15.8
      }
    ];
  }
}

export default new DashboardService();