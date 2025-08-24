import SpkAccordions from "../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-accordions";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../shared/layouts-components/showcode/showcode";
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Collapse, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import httpInterceptor from "../../../services/neuraudit/httpInterceptor";
import ModalAplicarGlosa from "./modal-aplicar-glosa";

interface AuditoriaDetalleFacturaTemplateProps { }

const AuditoriaDetalleFacturaTemplate: React.FC<AuditoriaDetalleFacturaTemplateProps> = () => {

    const [isFirstCollapsed, setisFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setisSecondCollapsed] = useState(false);

    const first = () => {
        if (isFirstCollapsed === false) {
            setisFirstCollapsed(true);
        }
        else if (isFirstCollapsed === true) {
            setisFirstCollapsed(false);
        }
    };

    const second = () => {

        if (isSecondCollapsed === true) {
            setisSecondCollapsed(false);
        }
        else if (isSecondCollapsed === false) {
            setisSecondCollapsed(true);
        }
    };

    const both = () => {
        if (isSecondCollapsed === true) {
            setisSecondCollapsed(false);
        }
        else if (isSecondCollapsed === false) {
            setisSecondCollapsed(true);
        }
        if (isFirstCollapsed === true) {
            setisFirstCollapsed(false);
        }
        else if (isFirstCollapsed === false) {
            setisFirstCollapsed(true);
        }
    };

    const [open, setOpen] = useState(false);

    const [opens, setOpens] = useState(false);

    // Estados específicos del componente médico
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
            
            // Cargar datos de la factura
            const facturaData = await httpInterceptor.get(`/api/auditoria/facturas/${facturaId}/`);
            console.log('Datos de factura:', facturaData);
            setFactura(facturaData);
            
            // Cargar servicios de la factura 
            const serviciosResponse = await httpInterceptor.get(`/api/auditoria/facturas/${facturaId}/servicios/`);
            console.log('Servicios recibidos:', serviciosResponse);
            setServicios(serviciosResponse.servicios_por_tipo || {});
            
            // Extraer usuarios únicos para el filtro
            const usuariosUnicos = new Set<string>();
            Object.values(serviciosResponse.servicios_por_tipo || {}).forEach((tipoServicios: any) => {
                tipoServicios.forEach((servicio: any) => {
                    if (servicio.detalle_json?.usuario_documento) {
                        usuariosUnicos.add(servicio.detalle_json.usuario_documento);
                    }
                });
            });
            setUsuarios(Array.from(usuariosUnicos));
            
        } catch (error) {
            console.error('Error cargando datos:', error);
            setFactura(null);
        } finally {
            setLoading(false);
        }
    };

    // Función para formatear valor en pesos colombianos
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Función para determinar badge de estado
    const getEstadoBadge = (servicio: any) => {
        if (servicio.tiene_glosa || servicio.glosas_aplicadas?.length > 0) {
            return '<span class="badge bg-warning">Con Glosa</span>';
        }
        return '<span class="badge bg-success">Aprobado</span>';
    };

    // Función para manejar click en servicio
    const handleServicioClick = (servicio: any, tipoServicio: string) => {
        setServicioSeleccionado({ ...servicio, tipoServicio });
        setShowModalGlosa(true);
    };

    // Generar contenido de tabla para servicios
    const generarTablaServicios = (serviciosLista: any[], tipoServicio: string) => {
        if (!serviciosLista || serviciosLista.length === 0) {
            return `
                <div class="alert alert-info">
                    <i class="ri-information-line me-2"></i>
                    No hay servicios de este tipo en la factura.
                </div>
            `;
        }

        const rows = serviciosLista.map(servicio => {
            const codigo = servicio.codigo_servicio || servicio.detalle_json?.codServicio || '';
            const descripcion = servicio.nombre_servicio || servicio.detalle_json?.nombreServicio || 'Sin descripción';
            const usuario = servicio.numeroDocumentoUsuario || servicio.detalle_json?.numeroDocumento || '';
            const valor = servicio.valor_servicio || servicio.detalle_json?.vrServicio || 0;
            
            return `
                <tr style="cursor: pointer;" onclick="window.handleServicioClick('${servicio.id}', '${tipoServicio}')">
                    <td><code>${codigo}</code></td>
                    <td>${descripcion}</td>
                    <td>${usuario}</td>
                    <td>${formatCurrency(valor)}</td>
                    <td>${getEstadoBadge(servicio)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary-light" onclick="event.stopPropagation(); window.handleServicioClick('${servicio.id}', '${tipoServicio}')">
                            <i class="ri-file-list-line"></i> Aplicar Glosa
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Usuario</th>
                            <th>Valor</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    };

    // Hacer funciones globales para onclick
    useEffect(() => {
        (window as any).handleServicioClick = (servicioId: string, tipoServicio: string) => {
            const servicio = servicios[tipoServicio]?.find((s: any) => s.id === servicioId);
            if (servicio) {
                handleServicioClick(servicio, tipoServicio);
            }
        };
    }, [servicios]);

    // Datos médicos para acordeones generados dinámicamente
    const ConsultasData = [
        {
            id: 1,
            title: "Consultas Médicas",
            content: generarTablaServicios(servicios.consultas || [], 'consultas')
        }
    ];

    const ProcedimientosData = [
        {
            id: 1,
            title: "Procedimientos",
            content: generarTablaServicios(servicios.procedimientos || [], 'procedimientos')
        }
    ];

    const MedicamentosData = [
        {
            id: 1,
            title: "Medicamentos POS",
            content: `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Código ATC</th>
                                <th>Nombre Genérico</th>
                                <th>Cantidad</th>
                                <th>Valor Unitario</th>
                                <th>Valor Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>N02BE01</code></td>
                                <td>Paracetamol 500mg</td>
                                <td>20</td>
                                <td>$150</td>
                                <td>$3,000</td>
                                <td><span class="badge bg-success">Aprobado</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        {
            id: 2,
            title: "Medicamentos No POS",
            content: `
                <div class="alert alert-warning">
                    <i class="ri-alert-line me-2"></i>
                    No hay medicamentos No POS en esta factura.
                </div>
            `
        }
    ];

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
            <div className="text-center py-5">
                <p>No se encontró la factura</p>
            </div>
        );
    }

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Auditoría - Detalle Factura" />

            <Pageheader title="Auditoría Médica" currentpage="Detalle Factura" activepage="Detalle Factura" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Consultas Médicas" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ConsultasData} defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Procedimientos Médicos <p class='text-muted subtitle fs-12 fw-normal'>Omit the <code>data-bs-parent</code>
                        attribute on each
                        <code>.accordion-collapse</code>
                        to make accordion items stay open when another item is opened.
                    </p>" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions alwaysopen={true} items={ProcedimientosData} defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Medicamentos <p class='subtitle text-muted fs-12 fw-normal'> Add <code>.accordion-flush</code> to remove the default <code>background-color</code>, some borders, and some rounded corners to render accordions edge-to-edge with their parent container. </p>" customCardClass="custom-card" customCardBodyClass="p-0" reactCode="" reusableCode="">
                        <SpkAccordions items={MedicamentosData} flush={true} closeAll={true} accordionClass="accordion-flush" />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <h6 className="mb-3">Light Colors:</h6>
            <Row>
                <Col xl={12}>
                    <ShowCode title="Primary" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ConsultasData} accordionClass="accordion-primary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Secondary" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ProcedimientosData} accordionClass="accordion-secondary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-5 --> */}

            <h6 className="mb-3">Solid Colors:</h6>
            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Primary" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ConsultasData} accordionClass="accordion-solid-primary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Secondary" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ProcedimientosData} accordionClass="accordion-solid-secondary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-4 --> */}

            <h6 className="mb-3">Colored Borders:</h6>
            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Primary" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ConsultasData} accordionClass="accordion-border-primary accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Success" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={MedicamentosData} accordionClass="accordion-border-success accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-7 --> */}

            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Example" customCardClass="custom-card" customCardBodyClass="" reactCode="">
                        <p className="mb-0">
                            <SpkButton Customclass="collapsed m-1" Buttonvariant="primary" aria-controls="example-collapse-text" Buttontoggle="collapse" onClickfunc={() => setOpens(!opens)}
                                Navigate="#collapseExample">
                                Link with href
                            </SpkButton>
                            <SpkButton Buttonvariant="secondary" Customclass="collapsed m-1" Buttontype="button" onClickfunc={() => setOpens(!opens)} aria-controls="example-collapse-text" Expand={opens}
                                Buttontoggle="collapse" Buttontarget="#collapseExample">
                                Button with data-bs-target
                            </SpkButton>
                        </p>
                        <Collapse in={opens}>
                            <div className="card card-body mb-0">
                                Some placeholder content for the collapse component. This panel
                                is
                                hidden by default but revealed when the user activates the
                                relevant
                                trigger.
                            </div>
                        </Collapse>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Targets Collapse" customCardClass="custom-card" customCardBodyClass="" reactCode="">
                        <p className="mb-0">
                            <SpkButton Buttonvariant='primary' Customclass="m-1" Buttontoggle="collapse" onClickfunc={() => { first(); }}
                                Navigate="#!" Expand={false} Buttoncontrols="">Toggle first element</SpkButton>
                            <SpkButton Buttonvariant='success' Customclass="m-1" Buttontype="button" Buttontoggle="collapse" onClickfunc={() => { second(); }} Expand={false} Buttontarget="#multiCollapseExample2"
                                Buttoncontrols="multiCollapseExample2">Toggle second
                                element</SpkButton>
                            <SpkButton Buttonvariant='danger' Customclass="m-1" Buttontype="button" Buttontoggle="collapse" onClickfunc={() => { both(); }} Expand={false} Buttonlabel=".multi-collapse"
                                Buttoncontrols=" multiCollapseExample2" >Toggle
                                both elements</SpkButton>
                        </p>
                        <Row>
                            <div className="col m-1">
                                {isFirstCollapsed ? (
                                    <div className="multi-collapse" id="multiCollapseExample1">
                                        <div className="card card-body mb-0">
                                            Some placeholder content for the first collapse
                                            component of
                                            this multi-collapse example. This panel is hidden by
                                            default
                                            but revealed when the user activates the relevant
                                            trigger.
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="col m-1">
                                {isSecondCollapsed ? (
                                    <div className=" multi-collapse" id="multiCollapseExample2">
                                        <div className="card card-body mb-0">
                                            Some placeholder content for the second collapse
                                            component
                                            of this multi-collapse example. This panel is hidden by
                                            default but revealed when the user activates the
                                            relevant
                                            trigger.
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </Row>
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-7 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Custom Icon Accordion" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ConsultasData} accordionClass="accordion-customicon1 accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Custom Accordion" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={MedicamentosData} accordionClass="customized-accordion accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

            {/* <!-- Start:: row-9 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Left Aligned Icons" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ConsultasData} accordionClass="accordionicon-left accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Without Icon" customCardClass="custom-card" customCardBodyClass="" reactCode="" reusableCode="">
                        <SpkAccordions items={ProcedimientosData} accordionClass="accordionicon-none accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-9 --> */}

            {/* <!-- Start:: row-7 --> */}

            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Horizontal Collapse" customCardClass="custom-card" customCardBodyClass="" reactCode="">
                        <p>
                            <SpkButton Buttonvariant='primary' Buttontype="button" Buttontoggle="collapse" onClickfunc={() => setOpen(!open)} Buttoncontrols="example-collapse-text" Expand={open}
                                Buttontarget="#collapseWidthExample" >
                                Toggle width collapse
                            </SpkButton>
                        </p>
                        <div style={{ minHeight: "120px" }}>
                            <Collapse in={open} dimension="width">
                                <div id="example-collapse-text">
                                    <Card body style={{ width: "230px" }}>This is some placeholder content for a horizontal collapse. It's
                                        hidden by default and shown when triggered.
                                    </Card>
                                </div>
                            </Collapse>
                        </div>
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-7 --> */}

            {/* Modal de Aplicar Glosa */}
            <ModalAplicarGlosa
                show={showModalGlosa}
                onHide={() => setShowModalGlosa(false)}
                servicio={servicioSeleccionado}
                onGlosaAplicada={() => loadFacturaData()}
            />

        </Fragment>
    )
};

export default AuditoriaDetalleFacturaTemplate;