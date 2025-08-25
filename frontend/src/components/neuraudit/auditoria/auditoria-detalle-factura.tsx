import SpkAccordions from "../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-accordions";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Row, Form, Alert, Badge, Dropdown } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import httpInterceptor from "../../../services/neuraudit/httpInterceptor";
import ModalAplicarGlosa from "./modal-aplicar-glosa";
import ModalFinalizarAuditoria from "./modal-finalizar-auditoria";
import { toast } from 'react-toastify';

interface AuditoriaDetalleFacturaProps { }

const AuditoriaDetalleFactura: React.FC<AuditoriaDetalleFacturaProps> = () => {
    const { facturaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [factura, setFactura] = useState<any>(null);
    const [servicios, setServicios] = useState<any>({});
    const [usuarios, setUsuarios] = useState<string[]>([]);
    const [showModalGlosa, setShowModalGlosa] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
    const [glosasAplicadas, setGlosasAplicadas] = useState<{[key: string]: any[]}>({});
    const [finalizando, setFinalizando] = useState(false);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Set<string>>(new Set());
    const [showModalGlosaMasiva, setShowModalGlosaMasiva] = useState(false);
    const [showModalFinalizar, setShowModalFinalizar] = useState(false);
    
    // Estado para múltiples filtros
    const [filtros, setFiltros] = useState({
        codigo: '',
        descripcion: '',
        usuario: '',
        diagnostico: '',
        fechaDesde: '',
        fechaHasta: '',
        valorMinimo: '',
        valorMaximo: '',
        tipoServicio: '',
        conGlosas: ''
    });

    // Cargar datos de la factura y servicios
    useEffect(() => {
        if (facturaId) {
            loadFacturaData();
        }
    }, [facturaId]);

    const loadFacturaData = async () => {
        try {
            setLoading(true);
            
            // Siempre trabajar directamente con la radicación
            // El facturaId es realmente el ID de la radicación
            const radicacionData = await httpInterceptor.get(`/api/radicacion/${facturaId}/`);
            console.log('Datos de radicación:', radicacionData);
            
            // Crear objeto factura desde los datos de radicación
            const factura = {
                id: radicacionData.id,
                numero_factura: radicacionData.factura_numero,
                fecha_expedicion: radicacionData.factura_fecha_expedicion,
                valor_total: radicacionData.factura_valor_total,
                estado_auditoria: radicacionData.estado === 'RADICADA' ? 'PENDIENTE' : 
                               radicacionData.estado === 'EN_AUDITORIA' ? 'EN_AUDITORIA' : 
                               radicacionData.estado === 'AUDITADA' ? 'AUDITADA' : 'PENDIENTE',
                radicacion_info: {
                    numero_radicado: radicacionData.numero_radicado,
                    prestador_nombre: radicacionData.pss_nombre,
                    prestador_nit: radicacionData.pss_nit,
                    fecha_radicacion: radicacionData.fecha_radicacion,
                    tipo_servicio: radicacionData.tipo_servicio,
                    modalidad_pago: radicacionData.modalidad_pago
                }
            };
            setFactura(factura);
            
            // Cargar servicios desde RIPS directamente
            console.log('Cargando servicios desde RIPS...');
            const serviciosResponse = await httpInterceptor.get(`/api/radicacion/${facturaId}/servicios-rips/`);
            console.log('Servicios RIPS recibidos:', serviciosResponse);
            
            if (serviciosResponse.servicios_por_tipo) {
                setServicios(serviciosResponse.servicios_por_tipo);
                
                // Extraer usuarios únicos para el filtro
                const usuariosUnicos = new Set<string>();
                Object.values(serviciosResponse.servicios_por_tipo).forEach((tipoServicios: any) => {
                    tipoServicios.forEach((servicio: any) => {
                        // Buscar en ambos lugares posibles
                        const documento = servicio.usuario_documento || servicio.detalle_json?.usuario_documento;
                        if (documento) {
                            usuariosUnicos.add(documento);
                        }
                    });
                });
                setUsuarios(Array.from(usuariosUnicos).sort());
            }
            
        } catch (error: any) {
            console.error('Error cargando datos:', error);
            console.error('Detalles del error:', error.response?.data || error.message);
            
            // Si es un error 404, intentar mostrar algo de información
            if (error.response?.status === 404) {
                console.error('La radicación no fue encontrada');
            }
            
            setFactura(null);
        } finally {
            setLoading(false);
        }
    };

    // Formatear valor en pesos colombianos
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    };

    // Filtrar servicios con múltiples criterios
    const filtrarServicios = (servicios: any[]) => {
        return servicios.filter(servicio => {
            // Filtro por código
            if (filtros.codigo) {
                const codigo = (servicio.codConsulta || servicio.codProcedimiento || servicio.codTecnologiaSalud || '').toLowerCase();
                if (!codigo.includes(filtros.codigo.toLowerCase())) return false;
            }
            
            // Filtro por descripción
            if (filtros.descripcion) {
                const descripcion = (servicio.descripcion || servicio.nomTecnologiaSalud || '').toLowerCase();
                if (!descripcion.includes(filtros.descripcion.toLowerCase())) return false;
            }
            
            // Filtro por usuario
            if (filtros.usuario) {
                const documento = servicio.usuario_documento || servicio.detalle_json?.usuario_documento || '';
                if (!documento.includes(filtros.usuario)) return false;
            }
            
            // Filtro por diagnóstico
            if (filtros.diagnostico) {
                const diagnostico = (servicio.detalle_json?.diagnostico_principal || '').toLowerCase();
                if (!diagnostico.includes(filtros.diagnostico.toLowerCase())) return false;
            }
            
            // Filtro por fechas
            if (filtros.fechaDesde || filtros.fechaHasta) {
                const fechaServicio = servicio.detalle_json?.fecha_atencion || servicio.detalle_json?.fecha_procedimiento;
                if (fechaServicio) {
                    const fecha = new Date(fechaServicio);
                    if (filtros.fechaDesde && fecha < new Date(filtros.fechaDesde)) return false;
                    if (filtros.fechaHasta && fecha > new Date(filtros.fechaHasta)) return false;
                }
            }
            
            // Filtro por valor
            const valor = parseFloat(servicio.vrServicio || '0');
            if (filtros.valorMinimo && valor < parseFloat(filtros.valorMinimo)) return false;
            if (filtros.valorMaximo && valor > parseFloat(filtros.valorMaximo)) return false;
            
            // Filtro por tipo de servicio
            if (filtros.tipoServicio && servicio.tipo_servicio !== filtros.tipoServicio) return false;
            
            // Filtro por glosas
            if (filtros.conGlosas) {
                const servicioKey = generarClaveServicio(servicio);
                const glosasLocales = glosasAplicadas[servicioKey] || [];
                const todasLasGlosas = [...(servicio.glosas_aplicadas || servicio.glosas || []), ...glosasLocales];
                const tieneGlosas = todasLasGlosas.length > 0;
                
                if (filtros.conGlosas === 'si' && !tieneGlosas) return false;
                if (filtros.conGlosas === 'no' && tieneGlosas) return false;
            }
            
            return true;
        });
    };

    // Manejar aplicación de glosa
    const handleAplicarGlosa = (servicio: any) => {
        // Incluir las glosas locales en el servicio antes de pasarlo al modal
        const servicioKey = generarClaveServicio(servicio);
        const glosasLocales = glosasAplicadas[servicioKey] || [];
        const servicioConGlosas = {
            ...servicio,
            glosas_aplicadas: [...(servicio.glosas_aplicadas || servicio.glosas || []), ...glosasLocales]
        };
        setServicioSeleccionado(servicioConGlosas);
        setShowModalGlosa(true);
    };

    const handleGlosaAplicada = (glosas?: any[]) => {
        // Si se pasaron glosas nuevas, guardarlas en el estado local
        if (glosas && servicioSeleccionado) {
            const servicioKey = generarClaveServicio(servicioSeleccionado);
            
            // Las glosas que vienen del modal ya son solo las nuevas (temporales)
            setGlosasAplicadas(prev => ({
                ...prev,
                [servicioKey]: [...(prev[servicioKey] || []), ...glosas]
            }));
        }
        
        // NO recargar datos porque perdería las glosas temporales
        // loadFacturaData();
        
        // Forzar re-render para actualizar la vista
        setServicios({...servicios});
    };
    
    const handleGlosaMasivaAplicada = (glosasNuevas: {[key: string]: any[]}) => {
        console.log('=== GLOSAS MASIVAS RECIBIDAS ===');
        console.log('Glosas nuevas:', glosasNuevas);
        
        // Agregar las glosas masivas al estado
        setGlosasAplicadas(prev => {
            const updated = {...prev};
            Object.entries(glosasNuevas).forEach(([servicioKey, glosas]) => {
                if (!updated[servicioKey]) {
                    updated[servicioKey] = [];
                }
                updated[servicioKey] = [...updated[servicioKey], ...glosas];
            });
            console.log('Estado actualizado de glosas:', updated);
            return updated;
        });
        
        // Limpiar selección
        setServiciosSeleccionados(new Set());
        
        // Forzar re-render
        setServicios({...servicios});
        
        toast.info(`Glosas aplicadas localmente. Recuerde hacer clic en "Finalizar Auditoría" para guardar en la base de datos.`);
    };
    
    // Obtener servicios seleccionados con toda su información
    const getServiciosSeleccionadosCompletos = () => {
        const serviciosCompletos: any[] = [];
        
        Object.entries(servicios).forEach(([tipo, serviciosList]: [string, any]) => {
            serviciosList.forEach((servicio: any) => {
                const servicioKey = generarClaveServicio(servicio);
                if (serviciosSeleccionados.has(servicioKey)) {
                    serviciosCompletos.push({
                        ...servicio,
                        key: servicioKey,
                        tipo_servicio: servicio.tipo_servicio || tipo
                    });
                }
            });
        });
        
        return serviciosCompletos;
    };
    
    // Generar clave única para cada servicio
    const generarClaveServicio = (servicio: any) => {
        // Incluir más campos para hacer la clave verdaderamente única
        const tipo = servicio.tipo_servicio || 'OTRO';
        const codigo = servicio.codConsulta || servicio.codProcedimiento || servicio.codTecnologiaSalud || 'NA';
        const usuario = servicio.detalle_json?.usuario_documento || servicio.usuario_documento || 'NA';
        const fecha = servicio.detalle_json?.fecha_atencion || servicio.detalle_json?.fecha_procedimiento || 'NA';
        const cantidad = servicio.cantidad || '1';
        
        return `${tipo}_${codigo}_${usuario}_${fecha}_${cantidad}`;
    };
    
    // Calcular estadísticas para el modal de finalizar
    const calcularEstadisticasFinales = () => {
        let totalFacturado = 0;
        let totalGlosadoEfectivo = 0;
        let cantidadServicios = 0;
        let cantidadGlosas = 0;
        
        Object.values(servicios).forEach((tipoServicios: any) => {
            tipoServicios.forEach((servicio: any) => {
                cantidadServicios++;
                const valorServicio = parseFloat(servicio.vrServicio || '0');
                totalFacturado += valorServicio;
                
                const servicioKey = generarClaveServicio(servicio);
                const glosasLocales = glosasAplicadas[servicioKey] || [];
                
                if (glosasLocales.length > 0) {
                    cantidadGlosas += glosasLocales.length;
                    const valorGlosadoServicio = glosasLocales.reduce((sum: number, g: any) => 
                        sum + parseFloat(g.valor_glosado || g.valor || '0'), 0);
                    totalGlosadoEfectivo += Math.min(valorGlosadoServicio, valorServicio);
                }
            });
        });
        
        return {
            totalFacturado,
            totalGlosadoEfectivo,
            totalAPagar: totalFacturado - totalGlosadoEfectivo,
            cantidadServicios,
            cantidadGlosas,
            porcentajeGlosado: totalFacturado > 0 ? (totalGlosadoEfectivo / totalFacturado) * 100 : 0
        };
    };

    // Finalizar auditoría
    const finalizarAuditoria = async (observacionesFinales?: string) => {
        console.log('=== INICIANDO finalizarAuditoria ===');
        console.log('Observaciones recibidas:', observacionesFinales);
        
        try {
            setFinalizando(true);
            setShowModalFinalizar(false);
            
            // Recopilar todas las glosas aplicadas
            const glosasParaGuardar: any[] = [];
            
            Object.values(servicios).forEach((tipoServicios: any) => {
                tipoServicios.forEach((servicio: any) => {
                    const servicioKey = generarClaveServicio(servicio);
                    const glosasLocales = glosasAplicadas[servicioKey] || [];
                    
                    if (glosasLocales.length > 0) {
                        glosasParaGuardar.push({
                            servicio_key: servicioKey,
                            tipo_servicio: servicio.tipo_servicio,
                            codigo_servicio: servicio.codConsulta || servicio.codProcedimiento || servicio.codTecnologiaSalud,
                            usuario_documento: servicio.detalle_json?.usuario_documento,
                            valor_servicio: parseFloat(servicio.vrServicio || '0'),
                            glosas: glosasLocales,
                            detalle_servicio: servicio.detalle_json
                        });
                    }
                });
            });
            
            // Calcular totales
            let totalFacturado = 0;
            let totalGlosadoEfectivo = 0;
            
            Object.values(servicios).forEach((tipoServicios: any) => {
                tipoServicios.forEach((servicio: any) => {
                    const valorServicio = parseFloat(servicio.vrServicio || '0');
                    totalFacturado += valorServicio;
                    
                    const servicioKey = generarClaveServicio(servicio);
                    const glosasLocales = glosasAplicadas[servicioKey] || [];
                    
                    if (glosasLocales.length > 0) {
                        const valorGlosadoServicio = glosasLocales.reduce((sum: number, g: any) => 
                            sum + parseFloat(g.valor_glosado || g.valor || '0'), 0);
                        totalGlosadoEfectivo += Math.min(valorGlosadoServicio, valorServicio);
                    }
                });
            });
            
            const payload = {
                radicacion_id: facturaId,
                glosas_aplicadas: glosasParaGuardar,
                totales: {
                    valor_facturado: totalFacturado,
                    valor_glosado_efectivo: totalGlosadoEfectivo,
                    valor_a_pagar: totalFacturado - totalGlosadoEfectivo,
                    cantidad_servicios_glosados: glosasParaGuardar.length,
                    fecha_auditoria: new Date().toISOString()
                },
                estado_auditoria: 'FINALIZADA',
                observaciones_finales: observacionesFinales || ''
            };
            
            console.log('=== FINALIZANDO AUDITORÍA ===');
            console.log('Estado de glosas aplicadas:', glosasAplicadas);
            console.log('Glosas para guardar:', glosasParaGuardar);
            console.log('Payload completo:', JSON.stringify(payload, null, 2));
            
            // Llamar al endpoint del backend
            const response = await httpInterceptor.post(`/api/radicacion/${facturaId}/finalizar-auditoria/`, payload);
            
            if (response.success) {
                toast.success('Auditoría finalizada exitosamente');
                // Redirigir al listado de auditorías
                setTimeout(() => {
                    navigate('/neuraudit/auditoria');
                }, 1500);
            } else {
                throw new Error(response.message || 'Error al finalizar auditoría');
            }
            
        } catch (error: any) {
            console.error('Error finalizando auditoría:', error);
            toast.error(`Error al finalizar auditoría: ${error.message || 'Error desconocido'}`);
        } finally {
            setFinalizando(false);
        }
    };

    // Obtener color de badge según tipo de servicio (siguiendo Vue design)
    const getServiceColor = (tipoServicio: string) => {
        const colores: {[key: string]: string} = {
            'CONSULTA': 'primary',        // Azul
            'PROCEDIMIENTO': 'info',      // Cian  
            'MEDICAMENTO': 'success',     // Verde
            'URGENCIA': 'danger',         // Rojo
            'HOSPITALIZACION': 'warning', // Amarillo
            'RECIEN_NACIDO': 'secondary', // Gris
            'OTROS_SERVICIOS': 'dark',    // Negro
            'AYUDAS_DIAGNOSTICAS': 'purple' // Morado
        };
        return colores[tipoServicio] || 'secondary';
    };

    // Obtener icono según tipo de servicio
    const getServiceIcon = (tipoServicio: string) => {
        const iconos: {[key: string]: string} = {
            'CONSULTA': 'ri-stethoscope-line',
            'PROCEDIMIENTO': 'ri-surgical-mask-line', 
            'MEDICAMENTO': 'ri-capsule-line',
            'URGENCIA': 'ri-alarm-warning-line',
            'HOSPITALIZACION': 'ri-hotel-bed-line',
            'RECIEN_NACIDO': 'ri-baby-line',
            'OTROS_SERVICIOS': 'ri-more-line',
            'AYUDAS_DIAGNOSTICAS': 'ri-microscope-line'
        };
        return iconos[tipoServicio] || 'ri-service-line';
    };

    // Manejar selección de servicios
    const toggleServicioSeleccionado = (servicioKey: string) => {
        const newSeleccionados = new Set(serviciosSeleccionados);
        if (newSeleccionados.has(servicioKey)) {
            newSeleccionados.delete(servicioKey);
        } else {
            newSeleccionados.add(servicioKey);
        }
        setServiciosSeleccionados(newSeleccionados);
    };
    
    const seleccionarTodosServicios = (serviciosList: any[], seleccionar: boolean) => {
        if (seleccionar) {
            const keys = serviciosList.map(s => generarClaveServicio(s));
            setServiciosSeleccionados(new Set([...serviciosSeleccionados, ...keys]));
        } else {
            const keys = serviciosList.map(s => generarClaveServicio(s));
            const newSeleccionados = new Set(serviciosSeleccionados);
            keys.forEach(key => newSeleccionados.delete(key));
            setServiciosSeleccionados(newSeleccionados);
        }
    };

    // Crear tabla de servicios para un tipo específico
    const crearTablaServicios = (serviciosFiltrados: any[], tipoServicio: string) => {
        if (!serviciosFiltrados || serviciosFiltrados.length === 0) {
            return <Alert variant="info">No hay servicios de este tipo para mostrar.</Alert>;
        }
        
        const todosSeleccionados = serviciosFiltrados.every(s => 
            serviciosSeleccionados.has(generarClaveServicio(s))
        );
        const algunosSeleccionados = serviciosFiltrados.some(s => 
            serviciosSeleccionados.has(generarClaveServicio(s))
        );

        return (
            <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                <SpkTables tableClass="table table-hover table-sm table-bordered align-middle" header={[
                    { 
                        title: (
                            <Form.Check
                                type="checkbox"
                                checked={todosSeleccionados}
                                indeterminate={!todosSeleccionados && algunosSeleccionados}
                                onChange={(e) => seleccionarTodosServicios(serviciosFiltrados, e.target.checked)}
                                title="Seleccionar todos"
                            />
                        ), 
                        width: '5%' 
                    },
                    { title: 'Código', width: '10%' }, 
                    { title: 'Descripción', width: '23%' }, 
                    { title: 'Usuario', width: '14%' }, 
                    { title: 'Cantidad', width: '7%' }, 
                    { title: 'Valor Unitario', width: '10%' }, 
                    { title: 'Valor Total', width: '10%' }, 
                    { title: 'Estado', width: '11%' }, 
                    { title: 'Acciones', width: '10%' }
                ]}>
                    {serviciosFiltrados.map((servicio: any, index: number) => {
                        // Obtener glosas aplicadas localmente
                        const servicioKey = generarClaveServicio(servicio);
                        const glosasLocales = glosasAplicadas[servicioKey] || [];
                        const todasLasGlosas = [...(servicio.glosas_aplicadas || servicio.glosas || []), ...glosasLocales];
                        const isSeleccionado = serviciosSeleccionados.has(servicioKey);
                        
                        return (
                        <tr key={servicio.id || index}>
                            <td className="text-center">
                                <Form.Check
                                    type="checkbox"
                                    checked={isSeleccionado}
                                    onChange={() => toggleServicioSeleccionado(servicioKey)}
                                    disabled={todasLasGlosas.length > 0}
                                    title={todasLasGlosas.length > 0 ? "Servicio ya tiene glosas" : "Seleccionar servicio"}
                                />
                            </td>
                            <td className="text-center">
                                <code className="fs-11">
                                    {servicio.codConsulta || servicio.codProcedimiento || servicio.codTecnologiaSalud || 'N/A'}
                                </code>
                            </td>
                            <td className="text-wrap" style={{minWidth: '200px', maxWidth: '300px'}}>
                                <div className="fw-semibold text-truncate" title={servicio.descripcion || servicio.nomTecnologiaSalud || 'Sin descripción'}>
                                    {servicio.descripcion || servicio.nomTecnologiaSalud || 'Sin descripción'}
                                </div>
                                {(servicio.detalle_json?.fecha_atencion || servicio.detalle_json?.fecha_procedimiento) && (
                                    <small className="text-muted d-block">
                                        <i className="ri-calendar-line me-1"></i>
                                        {formatDate(servicio.detalle_json?.fecha_atencion || servicio.detalle_json?.fecha_procedimiento)}
                                    </small>
                                )}
                            </td>
                            <td className="text-wrap" style={{minWidth: '120px', maxWidth: '180px'}}>
                                <div className="fw-medium text-truncate" title={servicio.detalle_json?.usuario_documento || 'N/A'}>
                                    {servicio.detalle_json?.usuario_documento || 'N/A'}
                                </div>
                                {servicio.detalle_json?.diagnostico_principal && (
                                    <small className="text-muted d-block text-truncate" title={`Dx: ${servicio.detalle_json.diagnostico_principal}`}>
                                        Dx: {servicio.detalle_json.diagnostico_principal}
                                    </small>
                                )}
                            </td>
                            <td className="text-center">
                                {servicio.cantidad || 1}
                                {servicio.detalle_json?.tipo_unidad && (
                                    <div>
                                        <small className="text-muted">{servicio.detalle_json.tipo_unidad}</small>
                                    </div>
                                )}
                            </td>
                            <td className="text-end">{formatCurrency(parseFloat(servicio.vrServicio || '0'))}</td>
                            <td className="text-end fw-bold">
                                {formatCurrency(parseFloat(servicio.vrServicio || '0'))}
                                {todasLasGlosas.length > 0 && (() => {
                                    const valorServicio = parseFloat(servicio.vrServicio || '0');
                                    const valorGlosadoTotal = todasLasGlosas.reduce((sum: number, g: any) => 
                                        sum + parseFloat(g.valor_glosado || g.valor || '0'), 0);
                                    const valorGlosadoEfectivo = Math.min(valorGlosadoTotal, valorServicio);
                                    const excede = valorGlosadoTotal > valorServicio;
                                    
                                    return (
                                        <div>
                                            <small className="text-danger">
                                                - {formatCurrency(valorGlosadoEfectivo)}
                                            </small>
                                            {excede && (
                                                <div>
                                                    <small className="text-warning" title={`Valor total glosado: ${formatCurrency(valorGlosadoTotal)}`}>
                                                        <i className="ri-alert-line"></i> Glosas exceden valor
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </td>
                            <td>
                                {todasLasGlosas.length > 0 ? (
                                    <div>
                                        <SpkBadge variant="" Customclass="bg-danger-transparent">
                                            <i className="ri-alert-line me-1"></i>
                                            Con Glosa
                                        </SpkBadge>
                                        {todasLasGlosas.length > 0 && (
                                            <div className="mt-1">
                                                <small className="text-danger fw-semibold">
                                                    {todasLasGlosas.length} glosa(s)
                                                </small>
                                                <br/>
                                                <small className="text-muted">
                                                    ${(todasLasGlosas.reduce((sum: number, g: any) => 
                                                        sum + parseFloat(g.valor_glosado || g.valor || '0'), 0)
                                                    ).toLocaleString('es-CO')}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                ) : servicio.estado === 'APROBADO' ? (
                                    <SpkBadge variant="" Customclass="bg-success-transparent">
                                        <i className="ri-check-line me-1"></i>
                                        Aprobado
                                    </SpkBadge>
                                ) : (
                                    <SpkBadge variant="" Customclass="bg-secondary-transparent">
                                        <i className="ri-time-line me-1"></i>
                                        Pendiente
                                    </SpkBadge>
                                )}
                            </td>
                            <td>
                                <div className="btn-list d-flex justify-content-center gap-1">
                                    <Link 
                                        to="#!"
                                        className="btn btn-sm btn-primary-light btn-wave btn-icon p-1"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="top" 
                                        title="Ver Detalle"
                                        onClick={() => console.log('Ver detalle:', servicio)}
                                        style={{width: '28px', height: '28px'}}
                                    >
                                        <i className="ri-eye-line fs-14"></i>
                                    </Link>
                                    {(!servicio.estado || servicio.estado !== 'FINALIZADO') && (
                                        <Link 
                                            to="#!"
                                            className="btn btn-sm btn-warning-light btn-wave btn-icon p-1"
                                            data-bs-toggle="tooltip" 
                                            data-bs-placement="top" 
                                            title="Aplicar Glosa"
                                            onClick={() => handleAplicarGlosa(servicio)}
                                            style={{width: '28px', height: '28px'}}
                                        >
                                            <i className="ri-alert-line fs-14"></i>
                                        </Link>
                                    )}
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                </SpkTables>
            </div>
        );
    };

    // Crear datos para los acordeones con datos reales del backend
    const crearAccordionData = () => {
        if (!servicios || Object.keys(servicios).length === 0) {
            return [];
        }

        // Mapeo de tipos de servicios según backend real
        const tiposServicioBackend = [
            { key: 'CONSULTA', label: 'Consultas Médicas', icon: 'ri-stethoscope-line', color: 'primary' },
            { key: 'PROCEDIMIENTO', label: 'Procedimientos Médicos', icon: 'ri-surgical-mask-line', color: 'info' },
            { key: 'MEDICAMENTO', label: 'Medicamentos y Tecnologías', icon: 'ri-capsule-line', color: 'success' },
            { key: 'OTRO_SERVICIO', label: 'Otros Servicios', icon: 'ri-more-line', color: 'dark' },
            { key: 'URGENCIA', label: 'Urgencias', icon: 'ri-alarm-warning-line', color: 'danger' },
            { key: 'HOSPITALIZACION', label: 'Hospitalización', icon: 'ri-hotel-bed-line', color: 'warning' },
            { key: 'RECIEN_NACIDO', label: 'Recién Nacidos', icon: 'ri-baby-line', color: 'secondary' }
        ];

        return tiposServicioBackend
            .map((tipo, index) => {
                const serviciosTipo = servicios[tipo.key] || [];
                const serviciosFiltrados = filtrarServicios(serviciosTipo);
                
                // Solo incluir tipos que tienen servicios después del filtro
                const hayFiltrosActivos = Object.values(filtros).some(f => f !== '');
                if (hayFiltrosActivos && serviciosFiltrados.length === 0) {
                    return null;
                }
                
                // Solo incluir tipos que tienen servicios sin filtro
                if (!hayFiltrosActivos && serviciosTipo.length === 0) {
                    return null;
                }
                
                // Calcular valor total usando vrServicio del backend
                const totalValor = serviciosFiltrados.reduce((acc: number, servicio: any) => 
                    acc + parseFloat(servicio.vrServicio || '0'), 0);

                return {
                    id: index + 1,
                    title: (
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="d-flex align-items-center">
                                <i className={`${tipo.icon} me-2 fs-16`}></i>
                                <span className="fw-semibold">{tipo.label}</span>
                                <Badge bg={tipo.color} className="ms-2">
                                    {serviciosFiltrados.length}
                                </Badge>
                            </div>
                            <small className="text-muted me-3">
                                {formatCurrency(totalValor)}
                            </small>
                        </div>
                    ),
                    content: crearTablaServicios(serviciosFiltrados, tipo.key)
                };
            })
            .filter(Boolean); // Eliminar nulls
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!factura) {
        return (
            <Fragment>
                <Seo title="Error - Factura no encontrada" />
                <Pageheader title="Error" subtitle="Factura no encontrada" currentpage="Error" activepage="Error" />
                <div className="text-center py-5">
                    <Alert variant="danger">
                        <i className="ri-error-warning-line me-2"></i>
                        No se encontró la factura solicitada
                        <div className="mt-2 small">
                            ID: {facturaId}
                        </div>
                    </Alert>
                    <div className="mt-3">
                        <p className="text-muted">Por favor verifique la consola del navegador para más detalles del error.</p>
                    </div>
                    <Link 
                        to="#!"
                        className="btn btn-primary btn-wave mt-3"
                        onClick={() => navigate(-1)}
                    >
                        <i className="ri-arrow-left-line me-2"></i>
                        Volver
                    </Link>
                </div>
            </Fragment>
        );
    }

    const accordionData = crearAccordionData();

    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title={`Auditoría - Factura ${factura?.numero_factura || ''}`} />
            <Pageheader title="Auditoría Médica" subtitle="Detalle de Factura" currentpage={`Factura ${factura?.numero_factura || ''}`} activepage="Detalle Factura" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="d-flex align-items-center flex-wrap justify-content-between gap-2">
                                <div className="d-flex flex-wrap gap-2 w-sm-75">
                                    <div>
                                        <span className="avatar avatar-xxl bg-primary">
                                            <i className="ri-file-text-line fs-24 lh-1"></i>
                                        </span>
                                    </div>
                                    <div className="ms-3 w-sm-75">
                                        <h4 className="fw-medium mb-0 d-flex align-items-center gap-2">
                                            <Link to="#!" className="lh-1">{factura.numero_factura}</Link>
                                            <SpkBadge 
                                                variant="" 
                                                Customclass={`bg-${factura.estado_auditoria === 'PENDIENTE' ? 'warning' : 
                                                           factura.estado_auditoria === 'AUDITADA' ? 'success' : 'info'}-transparent`}
                                            >
                                                {factura.estado_auditoria}
                                            </SpkBadge>
                                        </h4>
                                        {factura.radicacion_info && (
                                            <div className="my-1">
                                                <Link to="#!" className="fw-medium">
                                                    <i className="bi bi-building me-1 align-middle"></i> 
                                                    {factura.radicacion_info.prestador_nombre}
                                                </Link>
                                                <span className="text-muted ms-2">NIT: {factura.radicacion_info.prestador_nit}</span>
                                            </div>
                                        )}
                                        <Row className="mt-3 gy-2">
                                            <Col xl={6}>
                                                <div><i className="bi bi-calendar-event me-2"></i>{formatDate(factura.fecha_expedicion)}</div>
                                            </Col>
                                            <Col xl={6}>
                                                <div><i className="bi bi-file-text me-2"></i>{factura.radicacion_info?.numero_radicado || 'N/A'}</div>
                                            </Col>
                                            <Col xl={6}>
                                                <div className="fw-semibold text-success">
                                                    <i className="bi bi-currency-dollar me-2"></i>{formatCurrency(parseFloat(factura.valor_total || '0'))}
                                                </div>
                                            </Col>
                                            <Col xl={6}>
                                                <i className="bi bi-credit-card me-2"></i>{factura.radicacion_info?.modalidad_pago || 'N/A'}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="btn-list">
                                    <Link to="#!" className="btn btn-primary btn-wave" onClick={() => navigate(-1)}>
                                        <i className="ri-arrow-left-line me-1"></i> Volver
                                    </Link>
                                    <Link to="#!" className="btn btn-icon btn-secondary-light btn-wave">
                                        <i className="ri-download-line"></i>
                                    </Link>
                                    <Link to="#!" className="btn btn-icon btn-info-light btn-wave">
                                        <i className="ri-share-line"></i>
                                    </Link>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 - Estadísticas --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ri-bar-chart-line me-2"></i>
                                Estadísticas
                            </div>
                            <SpkDropdown 
                                toggleas="a" 
                                Togglevariant="" 
                                Customtoggleclass="fs-12 text-muted no-caret" 
                                Arrowicon={true} 
                                Toggletext="Opciones"
                            >
                                <Dropdown.Item onClick={() => {
                                    console.log('Exportar estadísticas...');
                                    // TODO: Implementar exportación
                                }}>Exportar Estadísticas</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    loadFacturaData();
                                    toast.info('Datos actualizados');
                                }}>Actualizar</Dropdown.Item>
                            </SpkDropdown>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col md={3}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-info d-block mx-auto mb-1">
                                            <i className="ri-list-check-2 fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Total Servicios</div>
                                        <span className="fs-12 text-muted">
                                            {Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                acc + filtrarServicios(tipo).length, 0)} servicios
                                        </span>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-success d-block mx-auto mb-1">
                                            <i className="ri-money-dollar-circle-line fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Valor Total</div>
                                        <span className="fs-12 text-success fw-medium">
                                            {formatCurrency(
                                                Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                    acc + filtrarServicios(tipo).reduce((subAcc: number, servicio: any) => 
                                                        subAcc + parseFloat(servicio.vrServicio || '0'), 0), 0)
                                            )}
                                        </span>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-warning d-block mx-auto mb-1">
                                            <i className="ri-alert-line fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Con Glosas</div>
                                        <span className="fs-12 text-warning fw-medium">
                                            {Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                acc + filtrarServicios(tipo).filter((s: any) => {
                                                    const servicioKey = generarClaveServicio(s);
                                                    const glosasLocales = glosasAplicadas[servicioKey] || [];
                                                    const todasLasGlosas = [...(s.glosas_aplicadas || s.glosas || []), ...glosasLocales];
                                                    return todasLasGlosas.length > 0;
                                                }).length, 0)} servicios
                                        </span>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-danger d-block mx-auto mb-1">
                                            <i className="ri-money-cny-circle-line fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Valor Glosado</div>
                                        <span className="fs-12 text-danger fw-medium">
                                            {formatCurrency(
                                                Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                    acc + filtrarServicios(tipo).reduce((subAcc: number, servicio: any) => {
                                                        const servicioKey = generarClaveServicio(servicio);
                                                        const glosasLocales = glosasAplicadas[servicioKey] || [];
                                                        const todasLasGlosas = [...(servicio.glosas_aplicadas || servicio.glosas || []), ...glosasLocales];
                                                        
                                                        if (todasLasGlosas.length > 0) {
                                                            const valorServicio = parseFloat(servicio.vrServicio || '0');
                                                            const valorGlosadoTotal = todasLasGlosas.reduce((gAcc: number, glosa: any) => 
                                                                gAcc + parseFloat(glosa.valor_glosado || glosa.valor || '0'), 0);
                                                            // Usar el valor efectivo (no puede superar el valor del servicio)
                                                            const valorGlosadoEfectivo = Math.min(valorGlosadoTotal, valorServicio);
                                                            return subAcc + valorGlosadoEfectivo;
                                                        }
                                                        return subAcc;
                                                    }, 0), 0)
                                            )}
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 - Filtros --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ri-filter-3-line me-2"></i>
                                Filtros de Búsqueda
                            </div>
                            <div className="btn-list">
                                <SpkButton 
                                    Buttonvariant="light" 
                                    Buttontype="button" 
                                    Customclass="btn btn-sm btn-light"
                                    onClickfunc={() => {
                                        setFiltros({
                                            codigo: '',
                                            descripcion: '',
                                            usuario: '',
                                            diagnostico: '',
                                            fechaDesde: '',
                                            fechaHasta: '',
                                            valorMinimo: '',
                                            valorMaximo: '',
                                            tipoServicio: '',
                                            conGlosas: ''
                                        });
                                        toast.info('Filtros limpiados');
                                    }}
                                >
                                    <i className="ri-refresh-line me-1"></i>
                                    Limpiar Filtros
                                </SpkButton>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Código del Servicio</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Buscar por código..."
                                            value={filtros.codigo}
                                            onChange={(e) => setFiltros({...filtros, codigo: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Buscar en descripción..."
                                            value={filtros.descripcion}
                                            onChange={(e) => setFiltros({...filtros, descripcion: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Documento Usuario</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Número de documento..."
                                            value={filtros.usuario}
                                            onChange={(e) => setFiltros({...filtros, usuario: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Diagnóstico</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Buscar diagnóstico..."
                                            value={filtros.diagnostico}
                                            onChange={(e) => setFiltros({...filtros, diagnostico: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Fecha Desde</Form.Label>
                                        <Form.Control 
                                            type="date"
                                            value={filtros.fechaDesde}
                                            onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Fecha Hasta</Form.Label>
                                        <Form.Control 
                                            type="date"
                                            value={filtros.fechaHasta}
                                            onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Valor Mínimo</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            placeholder="$0"
                                            value={filtros.valorMinimo}
                                            onChange={(e) => setFiltros({...filtros, valorMinimo: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Valor Máximo</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            placeholder="$999999"
                                            value={filtros.valorMaximo}
                                            onChange={(e) => setFiltros({...filtros, valorMaximo: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Tipo de Servicio</Form.Label>
                                        <Form.Select 
                                            value={filtros.tipoServicio}
                                            onChange={(e) => setFiltros({...filtros, tipoServicio: e.target.value})}
                                        >
                                            <option value="">Todos los tipos</option>
                                            <option value="CONSULTA">Consultas</option>
                                            <option value="PROCEDIMIENTO">Procedimientos</option>
                                            <option value="MEDICAMENTO">Medicamentos</option>
                                            <option value="URGENCIA">Urgencias</option>
                                            <option value="HOSPITALIZACION">Hospitalización</option>
                                            <option value="RECIEN_NACIDO">Recién Nacidos</option>
                                            <option value="OTRO_SERVICIO">Otros Servicios</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Con Glosas</Form.Label>
                                        <Form.Select 
                                            value={filtros.conGlosas}
                                            onChange={(e) => setFiltros({...filtros, conGlosas: e.target.value})}
                                        >
                                            <option value="">Todos</option>
                                            <option value="si">Con Glosas</option>
                                            <option value="no">Sin Glosas</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 - Servicios --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ri-list-check-2 me-2"></i>
                                Servicios Médicos por Tipo
                                {serviciosSeleccionados.size > 0 && (
                                    <Badge bg="primary" className="ms-2">
                                        {serviciosSeleccionados.size} seleccionados
                                    </Badge>
                                )}
                            </div>
                            <div className="btn-list">
                                {serviciosSeleccionados.size > 0 ? (
                                    <>
                                        <SpkButton
                                            Buttonvariant="warning" 
                                            Buttontype="button" 
                                            Customclass="btn btn-sm btn-warning-light btn-wave"
                                            onClickfunc={() => setShowModalGlosaMasiva(true)}
                                        >
                                            <i className="ri-alert-line me-1"></i>
                                            Aplicar Glosa Masiva ({serviciosSeleccionados.size})
                                        </SpkButton>
                                        <SpkButton
                                            Buttonvariant="secondary" 
                                            Buttontype="button" 
                                            Customclass="btn btn-sm btn-secondary-light btn-wave"
                                            onClickfunc={() => setServiciosSeleccionados(new Set())}
                                        >
                                            <i className="ri-close-line me-1"></i>
                                            Limpiar Selección
                                        </SpkButton>
                                    </>
                                ) : (
                                    <>
                                        <Link to="#!" className="btn btn-sm btn-info-light btn-wave">
                                            <i className="ri-checkbox-multiple-line me-1"></i>
                                            Seleccionar Servicios
                                        </Link>
                                        <Link to="#!" className="btn btn-sm btn-success-light btn-wave">
                                            <i className="ri-check-line me-1"></i>
                                            Aprobar Todo
                                        </Link>
                                    </>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {accordionData.length > 0 ? (
                                <SpkAccordions 
                                    items={accordionData} 
                                    defaultActiveKey={1}
                                    accordionClass="accordion-border-primary accordions-items-seperate"
                                />
                            ) : (
                                <Alert variant="warning" className="text-center mb-0">
                                    <i className="ri-information-line me-2"></i>
                                    No se encontraron servicios para mostrar con los filtros aplicados.
                                    {Object.values(filtros).some(f => f !== '') && (
                                        <div className="mt-2">
                                            <Link 
                                                to="#!"
                                                className="btn btn-sm btn-warning-light btn-wave"
                                                onClick={() => {
                                                    setFiltros({
                                                        codigo: '',
                                                        descripcion: '',
                                                        usuario: '',
                                                        diagnostico: '',
                                                        fechaDesde: '',
                                                        fechaHasta: '',
                                                        valorMinimo: '',
                                                        valorMaximo: '',
                                                        tipoServicio: '',
                                                        conGlosas: ''
                                                    });
                                                }}
                                            >
                                                <i className="ri-close-line me-1"></i>
                                                Limpiar Filtros
                                            </Link>
                                        </div>
                                    )}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 - Resumen y Finalización --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                <i className="ri-calculator-line me-2"></i>
                                Resumen de Auditoría
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {(() => {
                                // Calcular totales con lógica de valor efectivo
                                let totalServicios = 0;
                                let totalFacturado = 0;
                                let totalGlosadoEfectivo = 0;
                                let totalGlosadoReal = 0;
                                let serviciosConGlosas = 0;
                                
                                Object.values(servicios).forEach((tipoServicios: any) => {
                                    filtrarServicios(tipoServicios).forEach((servicio: any) => {
                                        const valorServicio = parseFloat(servicio.vrServicio || '0');
                                        totalServicios++;
                                        totalFacturado += valorServicio;
                                        
                                        const servicioKey = generarClaveServicio(servicio);
                                        const glosasLocales = glosasAplicadas[servicioKey] || [];
                                        const todasLasGlosas = [...(servicio.glosas_aplicadas || servicio.glosas || []), ...glosasLocales];
                                        
                                        if (todasLasGlosas.length > 0) {
                                            serviciosConGlosas++;
                                            const valorGlosadoServicio = todasLasGlosas.reduce((sum: number, g: any) => 
                                                sum + parseFloat(g.valor_glosado || g.valor || '0'), 0);
                                            totalGlosadoReal += valorGlosadoServicio;
                                            totalGlosadoEfectivo += Math.min(valorGlosadoServicio, valorServicio);
                                        }
                                    });
                                });
                                
                                const totalAPagar = totalFacturado - totalGlosadoEfectivo;
                                const porcentajeGlosado = totalFacturado > 0 ? (totalGlosadoEfectivo / totalFacturado * 100) : 0;
                                
                                return (
                                    <Row className="gy-3">
                                        <Col md={6}>
                                            <table className="table table-sm table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-muted">Total Servicios Auditados:</td>
                                                        <td className="text-end fw-medium">{totalServicios}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Servicios con Glosas:</td>
                                                        <td className="text-end fw-medium text-warning">{serviciosConGlosas}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted">Porcentaje Glosado:</td>
                                                        <td className="text-end fw-medium">
                                                            <Badge bg={porcentajeGlosado > 30 ? 'danger' : porcentajeGlosado > 15 ? 'warning' : 'success'}>
                                                                {porcentajeGlosado.toFixed(2)}%
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Col>
                                        <Col md={6}>
                                            <table className="table table-sm table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-muted">Valor Total Facturado:</td>
                                                        <td className="text-end fw-medium">{formatCurrency(totalFacturado)}</td>
                                                    </tr>
                                                    <tr className="text-danger">
                                                        <td className="text-muted">Valor Glosado (Efectivo):</td>
                                                        <td className="text-end fw-bold">- {formatCurrency(totalGlosadoEfectivo)}</td>
                                                    </tr>
                                                    {totalGlosadoReal > totalGlosadoEfectivo && (
                                                        <tr>
                                                            <td className="text-muted">
                                                                <small>(Glosas totales aplicadas):</small>
                                                            </td>
                                                            <td className="text-end">
                                                                <small className="text-warning">{formatCurrency(totalGlosadoReal)}</small>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr className="border-top border-top-dashed">
                                                        <td className="fw-bold text-primary">Total a Pagar:</td>
                                                        <td className="text-end fw-bold text-primary fs-16">{formatCurrency(totalAPagar)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Col>
                                    </Row>
                                );
                            })()}
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Row className="gy-2">
                                <Col md={12}>
                                    <div className="alert alert-info mb-3">
                                        <i className="ri-information-line me-2"></i>
                                        Al finalizar la auditoría, se guardarán todas las glosas aplicadas y el prestador será notificado para que pueda responder en el plazo legal de 5 días hábiles.
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="btn-list justify-content-center">
                                        <SpkButton 
                                            Buttonvariant="secondary" 
                                            Buttontype="button" 
                                            Customclass="btn btn-secondary btn-wave"
                                            onClickfunc={() => navigate(-1)}
                                        >
                                            <i className="ri-arrow-left-line me-2"></i>
                                            Volver
                                        </SpkButton>
                                        <SpkButton 
                                            Buttonvariant="warning" 
                                            Buttontype="button" 
                                            Customclass="btn btn-warning btn-wave"
                                            onClickfunc={() => {
                                                // TODO: Implementar guardado temporal
                                                toast.info('Auditoría guardada temporalmente');
                                            }}
                                        >
                                            <i className="ri-save-line me-2"></i>
                                            Guardar Borrador
                                        </SpkButton>
                                        <SpkButton 
                                            Buttonvariant="primary" 
                                            Buttontype="button" 
                                            Customclass="btn btn-primary btn-wave"
                                            disabled={finalizando}
                                            onClickfunc={() => {
                                                console.log('=== ABRIENDO MODAL FINALIZAR ===');
                                                setShowModalFinalizar(true);
                                            }}
                                        >
                                            <i className="ri-check-double-line me-2"></i>
                                            Finalizar Auditoría
                                        </SpkButton>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-5 --> */}

            {/* Modal de Aplicar Glosa - Individual */}
            <ModalAplicarGlosa
                show={showModalGlosa && !showModalGlosaMasiva}
                onHide={() => setShowModalGlosa(false)}
                servicio={servicioSeleccionado}
                esMasivo={false}
                onGlosaAplicada={handleGlosaAplicada}
            />
            
            {/* Modal de Aplicar Glosa - Masivo */}
            <ModalAplicarGlosa
                show={showModalGlosaMasiva}
                onHide={() => setShowModalGlosaMasiva(false)}
                servicios={getServiciosSeleccionadosCompletos()}
                esMasivo={true}
                onGlosaAplicada={handleGlosaMasivaAplicada}
            />
            
            {/* Modal de Finalizar Auditoría */}
            <ModalFinalizarAuditoria
                show={showModalFinalizar}
                onHide={() => {
                    console.log('=== CERRANDO MODAL FINALIZAR ===');
                    setShowModalFinalizar(false);
                }}
                onConfirm={(observaciones) => {
                    console.log('=== MODAL onConfirm RECIBIDO ===');
                    console.log('Observaciones recibidas en onConfirm:', observaciones);
                    finalizarAuditoria(observaciones);
                }}
                loading={finalizando}
                estadisticas={calcularEstadisticasFinales()}
                factura={factura}
            />
        </Fragment>
    );
};

export default AuditoriaDetalleFactura;