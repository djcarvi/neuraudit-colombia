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

interface AuditoriaDetalleFacturaProps { }

const AuditoriaDetalleFactura: React.FC<AuditoriaDetalleFacturaProps> = () => {
    const { facturaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [factura, setFactura] = useState<any>(null);
    const [servicios, setServicios] = useState<any>({});
    const [filtroUsuario, setFiltroUsuario] = useState<string>('');
    const [usuarios, setUsuarios] = useState<string[]>([]);
    const [showModalGlosa, setShowModalGlosa] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);

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
                        if (servicio.usuario_documento) {
                            usuariosUnicos.add(servicio.usuario_documento);
                        }
                    });
                });
                setUsuarios(Array.from(usuariosUnicos));
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

    // Filtrar servicios por usuario
    const filtrarServiciosPorUsuario = (servicios: any[]) => {
        if (!filtroUsuario) return servicios;
        return servicios.filter(servicio => 
            servicio.usuario_documento === filtroUsuario || 
            servicio.detalle_json?.usuario_documento === filtroUsuario
        );
    };

    // Manejar aplicación de glosa
    const handleAplicarGlosa = (servicio: any) => {
        setServicioSeleccionado(servicio);
        setShowModalGlosa(true);
    };

    const handleGlosaAplicada = () => {
        // Recargar datos después de aplicar glosa
        loadFacturaData();
        
        // Mostrar notificación de éxito (si tienes react-toastify configurado)
        // toast.success('Glosa aplicada exitosamente');
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

    // Crear tabla de servicios para un tipo específico
    const crearTablaServicios = (serviciosFiltrados: any[], tipoServicio: string) => {
        if (!serviciosFiltrados || serviciosFiltrados.length === 0) {
            return <Alert variant="info">No hay servicios de este tipo para mostrar.</Alert>;
        }

        return (
            <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                <SpkTables tableClass="table table-hover table-sm table-bordered align-middle" header={[
                    { title: 'Código', width: '10%' }, 
                    { title: 'Descripción', width: '25%' }, 
                    { title: 'Usuario', width: '15%' }, 
                    { title: 'Cantidad', width: '8%' }, 
                    { title: 'Valor Unitario', width: '10%' }, 
                    { title: 'Valor Total', width: '10%' }, 
                    { title: 'Estado', width: '12%' }, 
                    { title: 'Acciones', width: '10%' }
                ]}>
                    {serviciosFiltrados.map((servicio: any, index: number) => (
                        <tr key={servicio.id || index}>
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
                                {(servicio.glosas_aplicadas || servicio.glosas)?.length > 0 && (
                                    <div>
                                        <small className="text-danger">
                                            - {formatCurrency(
                                                (servicio.glosas_aplicadas || servicio.glosas).reduce((sum: number, g: any) => 
                                                    sum + parseFloat(g.valor_glosado || g.valor || '0'), 0)
                                            )}
                                        </small>
                                    </div>
                                )}
                            </td>
                            <td>
                                {servicio.tiene_glosa || servicio.glosas?.length > 0 ? (
                                    <div>
                                        <SpkBadge variant="" Customclass="bg-danger-transparent">
                                            <i className="ri-alert-line me-1"></i>
                                            Con Glosa
                                        </SpkBadge>
                                        {(servicio.glosas_aplicadas || servicio.glosas)?.length > 0 && (
                                            <div className="mt-1">
                                                <small className="text-danger fw-semibold">
                                                    {(servicio.glosas_aplicadas || servicio.glosas).length} glosa(s)
                                                </small>
                                                <br/>
                                                <small className="text-muted">
                                                    ${((servicio.glosas_aplicadas || servicio.glosas).reduce((sum: number, g: any) => 
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
                    ))}
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
            .filter(tipo => servicios[tipo.key] && servicios[tipo.key].length > 0)
            .map((tipo, index) => {
                const serviciosTipo = servicios[tipo.key] || [];
                const serviciosFiltrados = filtrarServiciosPorUsuario(serviciosTipo);
                
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
            });
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

            {/* <!-- Start:: row-2 --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ri-filter-3-line me-2"></i>
                                Filtros y Estadísticas
                            </div>
                            <SpkDropdown 
                                toggleas="a" 
                                Togglevariant="" 
                                Customtoggleclass="fs-12 text-muted no-caret" 
                                Arrowicon={true} 
                                Toggletext="Opciones"
                            >
                                <Dropdown.Item>Exportar Todo</Dropdown.Item>
                                <Dropdown.Item>Limpiar Filtros</Dropdown.Item>
                                <Dropdown.Item>Actualizar</Dropdown.Item>
                            </SpkDropdown>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            <i className="ri-user-line me-1"></i>
                                            Filtrar por Usuario
                                        </Form.Label>
                                        <Form.Select 
                                            value={filtroUsuario}
                                            onChange={(e) => setFiltroUsuario(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Todos los usuarios</option>
                                            {usuarios.map(usuario => (
                                                <option key={usuario} value={usuario}>
                                                    {usuario}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-info d-block mx-auto mb-1">
                                            <i className="ri-list-check-2 fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Total Servicios</div>
                                        <span className="fs-12 text-muted">
                                            {Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                acc + filtrarServiciosPorUsuario(tipo).length, 0)} servicios
                                        </span>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-success d-block mx-auto mb-1">
                                            <i className="ri-money-dollar-circle-line fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Valor Filtrado</div>
                                        <span className="fs-12 text-success fw-medium">
                                            {formatCurrency(
                                                Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                    acc + filtrarServiciosPorUsuario(tipo).reduce((subAcc: number, servicio: any) => 
                                                        subAcc + parseFloat(servicio.vrServicio || '0'), 0), 0)
                                            )}
                                        </span>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="text-center">
                                        <span className="avatar avatar-md avatar-rounded bg-warning d-block mx-auto mb-1">
                                            <i className="ri-alert-line fs-18 lh-1"></i>
                                        </span>
                                        <div className="fw-medium mb-0">Con Glosas</div>
                                        <span className="fs-12 text-warning fw-medium">
                                            {Object.values(servicios).reduce((acc: number, tipo: any) => 
                                                acc + filtrarServiciosPorUsuario(tipo).filter((s: any) => 
                                                    s.tiene_glosa || (s.glosas && s.glosas.length > 0)
                                                ).length, 0)} servicios
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
                                                    acc + filtrarServiciosPorUsuario(tipo).reduce((subAcc: number, servicio: any) => {
                                                        const glosas = servicio.glosas_aplicadas || servicio.glosas || [];
                                                        if (glosas.length > 0) {
                                                            return subAcc + glosas.reduce((gAcc: number, glosa: any) => 
                                                                gAcc + parseFloat(glosa.valor_glosado || glosa.valor || '0'), 0);
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
            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-3 --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                <i className="ri-list-check-2 me-2"></i>
                                Servicios Médicos por Tipo
                            </div>
                            <div className="btn-list">
                                <Link to="#!" className="btn btn-sm btn-success-light btn-wave">
                                    <i className="ri-check-line me-1 fw-medium"></i>Aprobar Todo
                                </Link>
                                <Link to="#!" className="btn btn-sm btn-warning-light btn-wave">
                                    <i className="ri-pause-line me-1 fw-medium"></i>Pausar
                                </Link>
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
                                    {filtroUsuario && (
                                        <div className="mt-2">
                                            <Link 
                                                to="#!"
                                                className="btn btn-sm btn-warning-light btn-wave"
                                                onClick={() => setFiltroUsuario('')}
                                            >
                                                <i className="ri-close-line me-1"></i>
                                                Limpiar Filtro
                                            </Link>
                                        </div>
                                    )}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-3 --> */}

            {/* Modal de Aplicar Glosa */}
            <ModalAplicarGlosa
                show={showModalGlosa}
                onHide={() => setShowModalGlosa(false)}
                servicio={servicioSeleccionado}
                onGlosaAplicada={handleGlosaAplicada}
            />
        </Fragment>
    );
};

export default AuditoriaDetalleFactura;