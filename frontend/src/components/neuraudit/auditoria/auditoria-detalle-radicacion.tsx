
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import auditoriaService from "../../../services/neuraudit/auditoriaService";
import httpInterceptor from "../../../services/neuraudit/httpInterceptor";

interface AuditoriaDetalleRadicacionProps { }

const AuditoriaDetalleRadicacion: React.FC<AuditoriaDetalleRadicacionProps> = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [radicacion, setRadicacion] = useState<any>(null);
    const [facturas, setFacturas] = useState<any[]>([]);

    // Cargar datos de la radicación
    useEffect(() => {
        if (id) {
            loadRadicacionData();
        }
    }, [id]);

    const loadRadicacionData = async () => {
        try {
            setLoading(true);
            
            // Cargar datos de la radicación usando httpInterceptor
            const data = await httpInterceptor.get(`/api/radicacion/${id}/`);
            console.log('Datos de radicación:', data);
            setRadicacion(data);
            
            // Obtener información de servicios RIPS
            let totalServicios = 0;
            try {
                const serviciosData = await httpInterceptor.get(`/api/radicacion/${id}/servicios-rips/`);
                if (serviciosData && serviciosData.total_servicios !== undefined) {
                    totalServicios = serviciosData.total_servicios;
                    data.total_servicios = totalServicios;
                    data.estadisticas_servicios = serviciosData.estadisticas;
                    console.log('Total servicios desde RIPS:', data.total_servicios);
                    console.log('Estadísticas de servicios:', data.estadisticas_servicios);
                }
            } catch (error) {
                console.error('Error obteniendo servicios RIPS:', error);
                data.total_servicios = 0;
            }
            
            // Primero intentar cargar facturas de la colección auditoria_facturas
            try {
                const facturasResponse = await auditoriaService.getFacturasRadicacion(id);
                console.log('Facturas desde auditoría:', facturasResponse);
                
                if (facturasResponse.results && facturasResponse.results.length > 0) {
                    // Si hay facturas en el módulo de auditoría, usarlas
                    setFacturas(facturasResponse.results);
                } else {
                    // Si no hay facturas en auditoría, mostrar la factura de la radicación
                    // Esto es temporal hasta que se implemente la creación de múltiples facturas
                    if (data.factura_numero) {
                        const facturaVirtual = {
                            id: data.id,
                            numero_factura: data.factura_numero,
                            fecha_expedicion: data.factura_fecha_expedicion,
                            valor_total: data.factura_valor_total,
                            estado: data.estado === 'RADICADA' ? 'PENDIENTE' : 
                                   data.estado === 'EN_AUDITORIA' ? 'EN_AUDITORIA' : 
                                   data.estado === 'AUDITADA' ? 'AUDITADA' : 'PENDIENTE',
                            total_servicios: totalServicios || data.total_servicios || 0,
                            radicacion_id: data.id,
                            es_virtual: true // Indicador para saber que es temporal
                        };
                        setFacturas([facturaVirtual]);
                        console.log('Usando factura de radicación (temporal):', facturaVirtual);
                    }
                }
            } catch (error) {
                console.error('Error cargando facturas:', error);
                // En caso de error, usar la factura de la radicación
                if (data.factura_numero) {
                    setFacturas([{
                        id: data.id,
                        numero_factura: data.factura_numero,
                        fecha_expedicion: data.factura_fecha_expedicion,
                        valor_total: data.factura_valor_total,
                        estado: 'PENDIENTE',
                        total_servicios: totalServicios || data.total_servicios || 0,
                        radicacion_id: data.id,
                        es_virtual: true
                    }]);
                }
            }
            
        } catch (error) {
            console.error('Error cargando datos:', error);
            setRadicacion(null);
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
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
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

    if (!radicacion) {
        return (
            <div className="text-center py-5">
                <p>No se encontró la radicación</p>
            </div>
        );
    }

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={`Auditoría - ${radicacion?.numero_radicado || 'Detalle'}`} />

            <Pageheader 
                title="Auditoría Médica" 
                subtitle="Detalle Radicación" 
                currentpage={radicacion?.numero_radicado || 'Cargando...'} 
                activepage="Detalle" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card invoice-card">
                        <Card.Body>
                            <div className="row gy-3">
                                <Col xl={12}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h4 className="fw-semibold mb-1">Detalle de Auditoría Médica</h4>
                                            <p className="text-muted mb-0">Sistema NeurAudit - EPS Familiar de Colombia</p>
                                        </div>
                                        <div className="text-end">
                                            <SpkBadge variant="" Customclass={`badge ${
                                                radicacion?.estado === 'RADICADA' ? 'bg-warning-transparent' :
                                                radicacion?.estado === 'EN_AUDITORIA' ? 'bg-info-transparent' :
                                                radicacion?.estado === 'AUDITADA' ? 'bg-success-transparent' :
                                                'bg-secondary-transparent'
                                            } fs-14`}>
                                                {radicacion?.estado || 'Cargando...'}
                                            </SpkBadge>
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={12}>
                                    <Row>
                                        <Col xl={4} lg={4} md={6} sm={6} className="">
                                            <p className="text-muted mb-2 fw-semibold">
                                                Prestador de Servicios de Salud:
                                            </p>
                                            <p className="fw-bold mb-1">
                                                {radicacion?.pss_nombre || 'Sin nombre'}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                NIT: {radicacion?.pss_nit || 'N/A'}
                                            </p>
                                            {radicacion?.pss_direccion && (
                                                <p className="mb-1 text-muted">
                                                    {radicacion?.pss_direccion}
                                                </p>
                                            )}
                                            {radicacion?.pss_email && (
                                                <p className="mb-1 text-muted">
                                                    {radicacion?.pss_email}
                                                </p>
                                            )}
                                            {radicacion?.pss_telefono && (
                                                <p className="mb-1 text-muted">
                                                    Tel: {radicacion?.pss_telefono}
                                                </p>
                                            )}
                                            <p className="text-muted">
                                                Modalidad: <span className="fw-medium text-primary">{radicacion?.modalidad_pago || 'N/A'}</span>
                                            </p>
                                        </Col>
                                        <Col xl={4} lg={4} md={6} sm={6} className="ms-auto mt-sm-0 mt-3">
                                            <p className="text-muted mb-2 fw-semibold">
                                                EPS Familiar de Colombia:
                                            </p>
                                            <p className="fw-bold mb-1">
                                                EPS Familiar de Colombia S.A.S
                                            </p>
                                            <p className="mb-1 text-muted">
                                                NIT: 830.003.564-7
                                            </p>
                                            <p className="mb-1 text-muted">
                                                Calle 100 No. 19-50, Bogotá D.C.
                                            </p>
                                            <p className="mb-1 text-muted">
                                                info@epsfamiliar.com.co
                                            </p>
                                            <p className="text-muted">
                                                Tel: (601) 307-7022
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Número Radicación:</p>
                                    <p className="fs-15 mb-1">{radicacion?.numero_radicado || 'N/A'}</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Fecha Radicación:</p>
                                    <p className="fs-15 mb-1">{radicacion?.created_at ? formatDate(radicacion.created_at) : 'N/A'}</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Período Atención:</p>
                                    <p className="fs-15 mb-1">{radicacion?.fecha_atencion_inicio && radicacion?.fecha_atencion_fin ? `${formatDate(radicacion.fecha_atencion_inicio)} - ${formatDate(radicacion.fecha_atencion_fin)}` : 'N/A'}</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Valor Total:</p>
                                    <p className="fs-16 mb-1 fw-medium text-primary">{radicacion?.factura_valor_total ? formatCurrency(radicacion.factura_valor_total) : 'N/A'}</p>
                                </Col>
                                <Col xl={12}>
                                    <h6 className="fw-semibold mb-3 mt-4">Facturas de la Radicación:</h6>
                                    <div className="table-responsive">
                                        <SpkTables tableClass="nowrap text-nowrap table-hover" header={[{ title: 'Número Factura' }, { title: 'Fecha Expedición' }, { title: 'Servicios' }, { title: 'Valor Factura' }, { title: 'Estado' }, { title: 'Acciones' }]}>
                                            {facturas.map((factura, index) => (
                                                <tr key={factura.id || index}>
                                                    <td>
                                                        <div className="fw-medium">
                                                            {factura.numero_factura}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-muted">
                                                            {formatDate(factura.fecha_expedicion)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass="badge bg-primary-transparent">
                                                            {factura.total_servicios || 0} servicios
                                                        </SpkBadge>
                                                    </td>
                                                    <td>
                                                        {formatCurrency(factura.valor_total)}
                                                    </td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass={`badge ${
                                                            factura.estado === 'PENDIENTE' ? 'bg-warning-transparent' :
                                                            factura.estado === 'EN_AUDITORIA' ? 'bg-info-transparent' :
                                                            factura.estado === 'AUDITADA' ? 'bg-success-transparent' :
                                                            factura.estado === 'GLOSADA' ? 'bg-danger-transparent' :
                                                            'bg-secondary-transparent'
                                                        }`}>
                                                            {factura.estado || 'PENDIENTE'}
                                                        </SpkBadge>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-1">
                                                            <SpkButton 
                                                                Buttonvariant="primary-light" 
                                                                Customclass="btn-sm btn-icon"
                                                                data-bs-toggle="tooltip" 
                                                                data-bs-placement="top" 
                                                                title="Auditar Servicios"
                                                                onClick={() => navigate(`/neuraudit/auditoria/factura/${factura.id}`)}
                                                            >
                                                                <i className="ri-stethoscope-line"></i>
                                                            </SpkButton>
                                                            <SpkButton 
                                                                Buttonvariant="info-light" 
                                                                Customclass="btn-sm btn-icon"
                                                                data-bs-toggle="tooltip" 
                                                                data-bs-placement="top" 
                                                                title="Ver Soportes"
                                                            >
                                                                <i className="ri-file-list-3-line"></i>
                                                            </SpkButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {facturas.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="text-center text-muted py-3">
                                                        No se encontraron facturas para esta radicación
                                                    </td>
                                                </tr>
                                            )}
                                        </SpkTables>
                                    </div>
                                </Col>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Información de Pago y Resumen Financiero */}
            <Row>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Body>
                            <h6 className="fw-semibold mb-4">
                                Información de Pago:
                            </h6>
                            <div className="row">
                                <Col xl={12}>
                                    <p className="fs-14 fw-medium">
                                        Modalidad de Pago: {radicacion?.modalidad_pago}
                                    </p>
                                    <p>
                                        <span className="fw-medium text-muted fs-12">Régimen:</span> {radicacion?.regimen || 'Contributivo'}
                                    </p>
                                    <p>
                                        <span className="fw-medium text-muted fs-12">Tipo de Servicio:</span> {radicacion?.tipo_servicio_display || radicacion?.tipo_servicio || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="fw-medium text-muted fs-12">Fecha Límite Radicación:</span> {radicacion?.fecha_limite_radicacion ? formatDate(radicacion.fecha_limite_radicacion) : 'Por definir'}
                                    </p>
                                    <p className="mb-0">
                                        <span className="fw-medium text-muted fs-12">Estado Radicación: </span>
                                        <SpkBadge variant="" Customclass={`badge ${
                                            radicacion?.estado === 'RADICADA' ? 'bg-warning-transparent' :
                                            radicacion?.estado === 'EN_AUDITORIA' ? 'bg-info-transparent' :
                                            radicacion?.estado === 'AUDITADA' ? 'bg-success-transparent' :
                                            'bg-secondary-transparent'
                                        }`}>
                                            {radicacion?.estado}
                                        </SpkBadge>
                                    </p>
                                </Col>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4} className="ms-auto">
                    <Card className="custom-card">
                        <Card.Body>
                            <h6 className="fw-semibold mb-4">Resumen Financiero:</h6>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Valor Radicado:</span>
                                <span className="fw-semibold">{formatCurrency(radicacion?.factura_valor_total || 0)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Valor Aceptado:</span>
                                <span className="fw-semibold text-success">{formatCurrency(0)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Valor Glosado:</span>
                                <span className="fw-semibold text-danger">{formatCurrency(0)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Total Facturas:</span>
                                <span className="fw-semibold">{facturas.length}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Total Servicios:</span>
                                <span className="fw-semibold text-primary">{radicacion?.total_servicios || 0}</span>
                            </div>
                            {radicacion?.estadisticas_servicios && (
                                <div className="small text-muted mb-3">
                                    {Object.entries(radicacion.estadisticas_servicios).map(([tipo, cantidad]) => 
                                        cantidad > 0 && (
                                            <div key={tipo} className="d-flex justify-content-between">
                                                <span className="text-capitalize">{tipo.toLowerCase().replace('_', ' ')}:</span>
                                                <span>{cantidad}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">Días Transcurridos:</span>
                                <span className="fw-semibold">{radicacion?.created_at ? Math.floor((new Date().getTime() - new Date(radicacion.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} días</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Action Buttons */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <div className="card-footer text-end border-0">
                            <SpkButton 
                                Buttonvariant="secondary" 
                                Customclass="btn m-1"
                                onClick={() => navigate('/neuraudit/auditoria/medica')}
                            >
                                <i className="ri-arrow-left-line me-1 align-middle d-inline-block"></i>Volver
                            </SpkButton>
                            <SpkButton Buttonvariant="info" Customclass="btn m-1">
                                <i className="ri-file-list-3-line me-1 align-middle d-inline-block"></i>Ver Soportes
                            </SpkButton>
                            <SpkButton Buttonvariant="warning" Customclass="btn m-1">
                                <i className="ri-file-pdf-line me-1 align-middle d-inline-block"></i>Exportar PDF
                            </SpkButton>
                            <SpkButton Buttonvariant="primary" Customclass="btn m-1">
                                <i className="ri-check-line me-1 align-middle d-inline-block"></i>Iniciar Auditoría
                            </SpkButton>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default AuditoriaDetalleRadicacion;