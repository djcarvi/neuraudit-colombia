
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import asignacionService from "../../../services/neuraudit/asignacionService";

// Importar datos de la plantilla original para mantener estructura
import { 
    AnalyticData, 
    Audienceoptions, 
    Audienceseries, 
    Averageoptions, 
    Averageseries, 
    BrowsersData, 
    CountryData, 
    Devices, 
    Engagementdata, 
    InfluencerData, 
    ListItemsData, 
    Sessionoptions, 
    Sessionseries, 
    Timeoptions, 
    Timeseries 
} from "../../../shared/data/dashboards/analyticsdata";
import SpkAnalyticsCard from "../../../shared/@spk-reusable-components/dashboards-reusable/spk-analyticscard";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTooltips from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import Seo from "../../../shared/layouts-components/seo/seo";

interface AsignacionDashboardProps { }

const AsignacionDashboard: React.FC<AsignacionDashboardProps> = () => {

    // Estado para datos de asignación
    const [estadisticas, setEstadisticas] = useState<any>(null);
    const [auditores, setAuditores] = useState<any[]>([]);
    const [propuesta, setPropuesta] = useState<any>(null);
    const [tendencias, setTendencias] = useState<any>(null);
    const [metricasAlgoritmo, setMetricasAlgoritmo] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos reales del backend
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargar todos los datos en paralelo
                const [stats, auditoresCarga, tendenciasData, metricas] = await Promise.all([
                    asignacionService.obtenerEstadisticasDashboard(),
                    asignacionService.obtenerCargaAuditores(),
                    asignacionService.obtenerTendenciasAsignacion('mes'),
                    asignacionService.obtenerMetricasAlgoritmo()
                ]);
                
                setEstadisticas(stats);
                setAuditores(auditoresCarga);
                setTendencias(tendenciasData);
                setMetricasAlgoritmo(metricas);
                
                // Cargar propuesta por separado para manejar mejor el caso null
                try {
                    const propuestaPendiente = await asignacionService.obtenerPropuestaPendiente();
                    setPropuesta(propuestaPendiente);
                } catch (propuestaError) {
                    // No es un error crítico si no hay propuesta
                    console.log('No hay propuestas pendientes');
                    setPropuesta(null);
                }
            } catch (error) {
                console.error('Error cargando datos del dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        
        cargarDatos();
    }, []);

    // Generar datos de propuestas para tabla
    const propuestasRecientes = propuesta ? [
        {
            id: propuesta.id,
            fecha: new Date(propuesta.fecha_propuesta).toLocaleDateString(),
            balance: `${(propuesta.metricas_distribucion?.balance_score * 100).toFixed(1)}%`,
            estado: propuesta.estado,
            radicaciones: propuesta.metricas_distribucion?.total_radicaciones || 0
        }
    ] : [];

    // Datos de métricas principales adaptados - usando formato de la plantilla
    const asignacionAnalyticData = estadisticas ? [
        {
            svgIcon: AnalyticData[0].svgIcon, // Usar el icono de la plantilla
            svgColor: "primary",
            title: "Radicaciones Pendientes",
            value: estadisticas.radicaciones_pendientes.toString(),
            icon: "ti ti-arrow-narrow-up me-1",
            iconColor: "success",
            percent: "+2.5%",
            year: "vs mes anterior"
        },
        {
            svgIcon: AnalyticData[1].svgIcon, // Usar el icono de la plantilla
            svgColor: "success",
            title: "Auditores Disponibles",
            value: estadisticas.auditores_disponibles.toString(),
            icon: "ti ti-arrow-narrow-up me-1",
            iconColor: "success",
            percent: "+1.2%",
            year: "vs mes anterior"
        },
        {
            svgIcon: AnalyticData[2].svgIcon, // Usar el icono de la plantilla
            svgColor: "warning",
            title: "Asignaciones Hoy",
            value: estadisticas.asignaciones_hoy.toString(),
            icon: "ti ti-arrow-narrow-up me-1",
            iconColor: "success",
            percent: "+5.4%",
            year: "vs ayer"
        },
        {
            svgIcon: AnalyticData[3].svgIcon, // Usar el icono de la plantilla
            svgColor: "info",
            title: "Balance Algoritmo",
            value: `${(estadisticas.balance_actual * 100).toFixed(1)}%`,
            icon: "ti ti-arrow-narrow-up me-1",
            iconColor: "success",
            percent: "+0.8%",
            year: "rango óptimo"
        }
    ] : AnalyticData;

    return (

        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="NeurAudit-Asignación" />
            <Pageheader title="Asignación" subtitle="Dashboard" currentpage="Dashboard de Asignación" activepage="Asignación" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        {loading ? (
                            // Loading skeleton
                            Array(4).fill(0).map((_, index) => (
                                <Col xxl={3} lg={6} key={`loading-${index}`}>
                                    <Card className="custom-card">
                                        <Card.Body className="p-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="placeholder-glow">
                                                        <span className="placeholder col-8"></span>
                                                        <span className="placeholder col-4"></span>
                                                    </div>
                                                </div>
                                                <div className="placeholder-glow">
                                                    <span className="placeholder col-12" style={{width: '40px', height: '40px'}}></span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            asignacionAnalyticData.map((idx, index) => (
                                <Col xxl={3} lg={6} key={index}>
                                    <SpkAnalyticsCard analytic={idx} />
                                </Col>
                            ))
                        )}
                        <Col xxl={4}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between custom-analytics">
                                    <div className="card-title">
                                        Auditores por Perfil
                                    </div>
                                    <SpkDropdown Id="dropdownMenuButton1" toggleas="a" Togglevariant="" Menulabel="dropdownMe nuButton1" Toggletext="View All" Customtoggleclass="p-0 fs-12 text-muted no-caret" Arrowicon={true}>
                                        <Dropdown.Item as="li" href="#!">Day</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Month</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Year</Dropdown.Item>
                                    </SpkDropdown>
                                </Card.Header>
                                <Card.Body>
                                    <div id="sessions-device">
                                        {auditores.length > 0 ? (
                                            <Spkapexcharts 
                                                height={258} 
                                                type={"donut"} 
                                                width={"100%"} 
                                                chartOptions={{
                                                    ...Sessionoptions,
                                                    labels: ['Médicos', 'Administrativos']
                                                }} 
                                                chartSeries={[
                                                    auditores.filter(a => a.perfil === 'MEDICO').length,
                                                    auditores.filter(a => a.perfil === 'ADMINISTRATIVO').length
                                                ]} 
                                            />
                                        ) : (
                                            <Spkapexcharts 
                                                height={258} 
                                                type={"donut"} 
                                                width={"100%"} 
                                                chartOptions={Sessionoptions} 
                                                chartSeries={Sessionseries} 
                                            />
                                        )}
                                    </div>
                                </Card.Body>
                                <Card.Footer className="p-0">
                                    <div className="row">
                                        {auditores.length > 0 ? (
                                            <>
                                                <div className="col">
                                                    <div className="p-3 text-center border-sm-end">
                                                        <h5 className="fw-semibold mb-1">
                                                            {auditores.filter(a => a.perfil === 'MEDICO').length}
                                                        </h5>
                                                        <span className="fs-12 d-block">Médicos</span>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="p-3 text-center">
                                                        <h5 className="fw-semibold mb-1">
                                                            {auditores.filter(a => a.perfil === 'ADMINISTRATIVO').length}
                                                        </h5>
                                                        <span className="fs-12 d-block">Administrativos</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            Devices.map((device, index) => (
                                                <div key={index} className="col">
                                                    <div className={`p-3 text-center ${device.border ? "border-sm-end" : ""}`}>
                                                        <h5 className="fw-semibold mb-1">{device.percentage}</h5>
                                                        <span className="fs-12 d-block">{device.label}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col xxl={8}>
                            <Card className=" custom-card">
                                <Card.Header className="">
                                    <div className="card-title">
                                        Tendencia de Asignaciones
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div id="audience-metrics">
                                        {tendencias && tendencias.series.length > 0 ? (
                                            <Spkapexcharts 
                                                height={330} 
                                                type={"line"} 
                                                width={"100%"} 
                                                chartOptions={{
                                                    ...Audienceoptions,
                                                    labels: tendencias.categorias.length > 0 ? tendencias.categorias : Audienceoptions.labels
                                                }} 
                                                chartSeries={tendencias.series.length > 0 ? tendencias.series : Audienceseries}
                                            />
                                        ) : (
                                            <Spkapexcharts 
                                                height={330} 
                                                type={"line"} 
                                                width={"100%"} 
                                                chartOptions={Audienceoptions} 
                                                chartSeries={Audienceseries}
                                            />
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xxl={4} lg={6}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Auditores por Carga
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-wrap visitors-countries-table" header={[{ title: 'N°' }, { title: 'Auditor' }, { title: 'Carga %' }]}>
                                            {(loading ? CountryData : auditores.slice(0, 5)).map((data, index) => (
                                                <tr key={index}>
                                                    <td className="border-bottom-0">{index + 1}</td>
                                                    <td className="border-bottom-0">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xs avatar-rounded">
                                                                    <i className={`ri-user-${data.perfil === 'MEDICO' ? 'heart' : 'settings'}-line`}></i>
                                                                </span>
                                                            </div>
                                                            <div className="fw-semibold">{data.nombres} {data.apellidos}</div>
                                                        </div>
                                                    </td>
                                                    <td className="border-bottom-0 text-end">
                                                        <span className="fs-12 text-muted me-2">
                                                            (
                                                            <i className={`ti ti-arrow-${data.porcentaje_carga > 75 ? "up text-danger" : "down text-success"} fs-16 align-middle`}></i>
                                                            {data.perfil})
                                                        </span>
                                                        {data.porcentaje_carga ? `${data.porcentaje_carga.toFixed(1)}%` : '0%'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xxl={8} lg={6}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Propuestas Recientes
                                    </div>
                                    <SpkDropdown Togglevariant="" toggleas="a" Customtoggleclass="p-0 fs-12 text-muted tag-link no-caret" Toggletext="View All" Arrowicon={true}>
                                        <Dropdown.Item>Download</Dropdown.Item>
                                        <Dropdown.Item>Import</Dropdown.Item>
                                        <Dropdown.Item>Export</Dropdown.Item>
                                    </SpkDropdown>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive campaigntable">
                                        <SpkTables tableClass="text-nowrap" header={[{ title: 'Propuesta' }, { title: 'Fecha' }, { title: 'Balance' }, { title: 'Estado' }, { title: 'Acción' }]}>
                                            {(loading ? InfluencerData : propuestasRecientes).map((data, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center lh-1">
                                                            <span className="avatar avatar-sm p-1 bg-light me-2">
                                                                <i className="ri-file-list-3-line"></i>
                                                            </span>
                                                            <div>
                                                                <p className="fw-medium mb-1">#{data.id?.slice(-8) || 'PRO001'}</p>
                                                                <span className="fs-12 text-muted">{data.radicaciones} radicaciones</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{data.fecha}</td>
                                                    <td>
                                                        <span className={`text-${parseFloat(data.balance) > 80 ? 'success' : parseFloat(data.balance) > 60 ? 'warning' : 'danger'}`}>
                                                            {data.balance}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass={`${data.estado === "APROBADA" ? "bg-success-transparent" : data.estado === "PENDIENTE" ? "bg-warning-transparent" : "bg-danger-transparent"}`}>
                                                            {data.estado}
                                                        </SpkBadge>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="btn-list">
                                                            <SpkTooltips placement="top" title="Ver Detalles">
                                                                <Link to={`/neuraudit/asignacion/propuesta/${data.id}`} className="btn btn-light btn-icon btn-sm">
                                                                    <i className="bi bi-eye"></i>
                                                                </Link>
                                                            </SpkTooltips>
                                                            <SpkTooltips placement="top" title="Aprobar">
                                                                <Link to="#!" className="btn btn-success btn-icon btn-sm me-0">
                                                                    <i className="bi bi-check-circle"></i>
                                                                </Link>
                                                            </SpkTooltips>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Asignaciones Activas
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div>
                                            <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                        </div>
                                        <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-primary btn-sm btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                            <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                        </SpkDropdown>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap" header={[{ title: 'N°', headerClassname: 'text-center' }, { title: 'Radicación' }, { title: 'Auditor' }, { title: 'Estado' }, { title: 'Prioridad' }, { title: 'Progreso' }, { title: 'Completado', headerClassname: 'text-center' }]}>
                                            {Engagementdata.map((user) => (
                                                <tr key={user.rank}>
                                                    <td className="text-center">{user.rank}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-sm avatar-rounded">
                                                                    <Image  src={user.avatarUrl} alt={user.name} />
                                                                </span>
                                                            </div>
                                                            <div>{user.name}</div>
                                                        </div>
                                                    </td>
                                                    <td>{user.clicks}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xs avatar-rounded">
                                                                    <Image  src={user.countryFlagUrl} alt={user.country} />
                                                                </span>
                                                            </div>
                                                            <div>{user.country}</div>
                                                        </div>
                                                    </td>
                                                    <td className="">{user.views}</td>
                                                    <td className="">{user.conversionRate}</td>
                                                    <td className="text-center">{user.percentage}</td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div> Showing 5 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                        <div className="ms-auto">
                                            <nav aria-label="Page navigation" className="pagination-style-4">
                                                <Pagination className="mb-0">
                                                    <Pagination.Prev disabled>Prev</Pagination.Prev>
                                                    <Pagination.Item active>{1}</Pagination.Item>
                                                    <Pagination.Item>{2}</Pagination.Item>
                                                    <Pagination.Next className="text-primary">Next</Pagination.Next>
                                                </Pagination>
                                            </nav>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Rendimiento Algoritmo
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled browser-insights-list">
                                        {(metricasAlgoritmo.length > 0 ? metricasAlgoritmo : BrowsersData).map((metrica, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            {metrica.imageUrl ? (
                                                                <Image src={metrica.imageUrl} alt={metrica.name} />
                                                            ) : (
                                                                <i className="ri-bar-chart-2-line fs-16"></i>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-medium">{metrica.name}</span>
                                                        <span className="d-block text-muted fs-12">{metrica.company}</span>
                                                    </div>
                                                    <div className="text-end w-25">
                                                        <span className="d-block mb-1 fw-semibold">{metrica.downloads}</span>
                                                        <SpkProgress variant={metrica.progressColor} animated striped mainClass="progress-xs w-75 ms-auto" now={metrica.progress} />
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Asignaciones por Día
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div id="users-by-time">
                                        <Spkapexcharts height={262} type={"heatmap"} width={"100%"} chartOptions={Timeoptions} chartSeries={Timeseries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Balance de Carga
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3 flex-wrap">
                                        <h4 className="fw-bold mb-0">{estadisticas?.balance_actual ? `${(estadisticas.balance_actual * 100).toFixed(1)}%` : 'Cargando...'}</h4>
                                        <div className="ms-2">
                                            <SpkBadge variant="" Customclass="badge bg-success-transparent">1.02<i className="ri-arrow-up-s-fill align-mmiddle ms-1"></i></SpkBadge>
                                            <span className="text-muted ms-1 text-nowrap">balance del algoritmo</span>
                                        </div>
                                    </div>
                                    <div className="progress-stacked progress-animate progress-sm mb-4">
                                        <div className="progress-bar" role="progressbar" style={{ width: "21%" }} aria-valuenow={21} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-info" role="progressbar" style={{ width: "26%" }} aria-valuenow={26} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: "35%" }} aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-success" role="progressbar" style={{ width: "18%" }} aria-valuenow={18} aria-valuemin={0} aria-valuemax={100}></div>
                                    </div>
                                    <ul className="list-unstyled mb-0 pt-2 top-referral-pages">
                                        {ListItemsData.map((item, index) => (
                                            <li key={index} className={item.className}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>{item.path}</div>
                                                    <div className="fs-12 text-muted">{item.views}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Tiempo Promedio
                                    </div>
                                </Card.Header>
                                <Card.Body className="pb-0">
                                    <div className="d-flex gap-3 flex-wrap align-items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" className="text-primary bg-primary-transparent rounded-1 px-1" viewBox="0 0 24 24"><g fill="currentColor"><path fillOpacity="0.5" d="M8 13h6v4H8z"></path><path d="M6 6H4v12h2zm14 1H8v4h12z"></path></g></svg> <div>
                                            <h6 className="fw-medium mb-0">42min</h6>
                                        </div>
                                        <div className="ms-auto text-muted fs-11 text-end">
                                            <div className="fw-medium">Por Auditoría</div>
                                            <span className="text-success fw-semibold"> 1.25% <i className="ri-arrow-up-line lh-1 align-center fs-14 fw-normal"></i></span>
                                        </div>
                                    </div>
                                    <div id="analytics-avgsession">
                                        <Spkapexcharts height={285} type={"bar"} width={"100%"} chartOptions={Averageoptions} chartSeries={Averageseries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

        </Fragment>
    )
};

export default AsignacionDashboard;