import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Nav, Pagination, Row, Tab, Form, Collapse } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkDevolucionCard from "../../../shared/@spk-reusable-components/dashboards-reusable/neuraudit/spk-devolucioncard";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import devolucionesService from "../../../services/neuraudit/devolucionesService";
import { useNavigate, Link } from "react-router-dom";
import LabeledTwoThumbs1 from "../../../shared/data/dashboards/jobs/searchjobdata";

interface DevolucionesListProps { }

const DevolucionesList: React.FC<DevolucionesListProps> = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [devoluciones, setDevoluciones] = useState([]);
    const [devolucionesFiltradas, setDevolucionesFiltradas] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [openEstado, setOpenEstado] = useState(false);
    const [openCausal, setOpenCausal] = useState(false);
    
    // Estados de filtros
    const [filtrosEstado, setFiltrosEstado] = useState({
        pendiente: false,
        en_respuesta: false,
        aceptada: false,
        rechazada: false
    });
    
    const [filtrosCausal, setFiltrosCausal] = useState({
        DE16: false,
        DE44: false,
        DE50: false,
        DE56: false
    });
    
    const [rangoValor, setRangoValor] = useState([0, 1000000000]);

    const loadDevolucionesData = async () => {
        try {
            setLoading(true);
            const devolucionesData = await devolucionesService.getDevoluciones({});
            setDevoluciones(devolucionesData.results || []);
            setDevolucionesFiltradas(devolucionesData.results || []);
        } catch (err: any) {
            console.error('Error loading devoluciones:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDevolucionesData();
    }, []);

    const filterDevoluciones = (causal: string) => {
        setActiveTab(causal);
        if (causal === "all") {
            setDevolucionesFiltradas(devoluciones);
        } else if (causal === "pendiente") {
            const filtered = devoluciones.filter((devolucion: any) => 
                devolucion.estado === "PENDIENTE"
            );
            setDevolucionesFiltradas(filtered);
        } else if (causal === "en_respuesta") {
            const filtered = devoluciones.filter((devolucion: any) => 
                devolucion.estado === "EN_RESPUESTA"
            );
            setDevolucionesFiltradas(filtered);
        } else {
            const filtered = devoluciones.filter((devolucion: any) => 
                devolucion.causal_codigo === causal.toUpperCase()
            );
            setDevolucionesFiltradas(filtered);
        }
    };

    const handleNuevaDevolucion = () => {
        navigate('/neuraudit/devoluciones/nueva');
    };
    
    // Aplicar filtros avanzados
    const aplicarFiltros = () => {
        let filtered = [...devoluciones];
        
        // Filtrar por estado
        const estadosSeleccionados = Object.entries(filtrosEstado)
            .filter(([_, selected]) => selected)
            .map(([estado, _]) => estado);
            
        if (estadosSeleccionados.length > 0) {
            filtered = filtered.filter((devolucion: any) => {
                if (estadosSeleccionados.includes('pendiente') && devolucion.estado === 'PENDIENTE') return true;
                if (estadosSeleccionados.includes('en_respuesta') && devolucion.estado === 'EN_RESPUESTA') return true;
                if (estadosSeleccionados.includes('aceptada') && devolucion.estado === 'ACEPTADA') return true;
                if (estadosSeleccionados.includes('rechazada') && devolucion.estado === 'RECHAZADA') return true;
                return false;
            });
        }
        
        // Filtrar por causal
        const causalesSeleccionadas = Object.entries(filtrosCausal)
            .filter(([_, selected]) => selected)
            .map(([causal, _]) => causal);
            
        if (causalesSeleccionadas.length > 0) {
            filtered = filtered.filter((devolucion: any) =>
                causalesSeleccionadas.includes(devolucion.causal_codigo)
            );
        }
        
        // Filtrar por rango de valor
        filtered = filtered.filter((devolucion: any) =>
            devolucion.valor_total >= rangoValor[0] && devolucion.valor_total <= rangoValor[1]
        );
        
        setDevolucionesFiltradas(filtered);
        setShowFilters(false);
    };
    
    const limpiarFiltros = () => {
        setFiltrosEstado({
            pendiente: false,
            en_respuesta: false,
            aceptada: false,
            rechazada: false
        });
        setFiltrosCausal({
            DE16: false,
            DE44: false,
            DE50: false,
            DE56: false
        });
        setRangoValor([0, 1000000000]);
        setDevolucionesFiltradas(devoluciones);
    };

    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="NeurAudit-Devoluciones" />
            <Pageheader title="Devoluciones" subtitle="Gestión de Devoluciones" currentpage="Devoluciones Automáticas" activepage="Radicación" />

            <Row>
                <Col xxl={showFilters ? 3 : 0} xl={showFilters ? 3 : 0} className={showFilters ? "" : "d-none"}>
                    <Card className="custom-card products-navigation-card">
                        <Card.Body className="p-0">
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Estado de la Devolución</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-pendiente" 
                                            checked={filtrosEstado.pendiente}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, pendiente: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-pendiente">
                                            Pendiente
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.estado === "PENDIENTE").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-en-respuesta"
                                            checked={filtrosEstado.en_respuesta}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, en_respuesta: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-en-respuesta">
                                            En Respuesta PSS
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.estado === "EN_RESPUESTA").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-aceptada"
                                            checked={filtrosEstado.aceptada}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, aceptada: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-aceptada">
                                            Aceptada
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.estado === "ACEPTADA").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-rechazada"
                                            checked={filtrosEstado.rechazada}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, rechazada: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-rechazada">
                                            Rechazada
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.estado === "RECHAZADA").length}
                                        </SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Causal de Devolución</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="causal-DE16"
                                            checked={filtrosCausal.DE16}
                                            onChange={(e) => setFiltrosCausal({...filtrosCausal, DE16: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="causal-DE16">
                                            DE16 - Otro responsable de pago
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.causal_codigo === "DE16").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="causal-DE44"
                                            checked={filtrosCausal.DE44}
                                            onChange={(e) => setFiltrosCausal({...filtrosCausal, DE44: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="causal-DE44">
                                            DE44 - Fuera de red
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.causal_codigo === "DE44").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="causal-DE50"
                                            checked={filtrosCausal.DE50}
                                            onChange={(e) => setFiltrosCausal({...filtrosCausal, DE50: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="causal-DE50">
                                            DE50 - Factura ya pagada
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.causal_codigo === "DE50").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="causal-DE56"
                                            checked={filtrosCausal.DE56}
                                            onChange={(e) => setFiltrosCausal({...filtrosCausal, DE56: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="causal-DE56">
                                            DE56 - Radicación extemporánea
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {devoluciones.filter((d: any) => d.causal_codigo === "DE56").length}
                                        </SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Rango de Valor</h6>
                                <div className="py-3 pb-0">
                                    <div id="nonlinear">
                                        <LabeledTwoThumbs1 rtl={false} />
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3">
                                <div className="d-grid gap-2">
                                    <SpkButton 
                                        Buttonvariant="primary" 
                                        Buttontype="button" 
                                        Customclass="btn btn-wave"
                                        onClickfunc={aplicarFiltros}
                                    >
                                        Aplicar Filtros
                                    </SpkButton>
                                    <SpkButton 
                                        Buttonvariant="light" 
                                        Buttontype="button" 
                                        Customclass="btn btn-wave"
                                        onClickfunc={limpiarFiltros}
                                    >
                                        Limpiar Filtros
                                    </SpkButton>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={showFilters ? 9 : 12} xl={showFilters ? 9 : 12} className="">
                    <Tab.Container activeKey={activeTab}>
                        {/* <!-- Start::row-1 --> */}
                        <Row>
                            <Col xl={12}>
                                <Card className="custom-card">
                                    <Card.Body>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                            <div>
                                                <Nav className="nav-tabs nav-tabs-header mb-0" role="tablist">
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="all" 
                                                            active={activeTab === "all"}
                                                            onClick={() => filterDevoluciones("all")}
                                                        >
                                                            Todas
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="DE16" 
                                                            active={activeTab === "DE16"}
                                                            onClick={() => filterDevoluciones("DE16")}
                                                        >
                                                            DE16
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="DE44" 
                                                            active={activeTab === "DE44"}
                                                            onClick={() => filterDevoluciones("DE44")}
                                                        >
                                                            DE44
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="DE50" 
                                                            active={activeTab === "DE50"}
                                                            onClick={() => filterDevoluciones("DE50")}
                                                        >
                                                            DE50
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="DE56" 
                                                            active={activeTab === "DE56"}
                                                            onClick={() => filterDevoluciones("DE56")}
                                                        >
                                                            DE56
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="pendiente" 
                                                            active={activeTab === "pendiente"}
                                                            onClick={() => filterDevoluciones("pendiente")}
                                                        >
                                                            Pendientes
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="en_respuesta" 
                                                            active={activeTab === "en_respuesta"}
                                                            onClick={() => filterDevoluciones("en_respuesta")}
                                                        >
                                                            En Respuesta
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <SpkButton 
                                                    Buttonvariant="primary" 
                                                    Buttontype="button" 
                                                    Customclass="btn btn-sm btn-wave"
                                                    onClickfunc={handleNuevaDevolucion}
                                                >
                                                    <i className="ri-add-line me-1"></i> Nueva Devolución Manual
                                                </SpkButton>
                                                <SpkButton 
                                                    Buttonvariant="secondary" 
                                                    Buttontype="button" 
                                                    Customclass="btn btn-sm btn-wave"
                                                    onClickfunc={() => setShowFilters(!showFilters)}
                                                >
                                                    <i className="ri-filter-3-line me-1"></i> Filtros
                                                </SpkButton>
                                                <SpkDropdown 
                                                    Customtoggleclass="btn btn-sm btn-wave waves-effect waves-light no-caret" 
                                                    Togglevariant="primary" 
                                                    Arrowicon={true} 
                                                    Toggletext="Ordenar Por"
                                                >
                                                    <li className="dropdown-item">Más Recientes</li>
                                                    <li className="dropdown-item">Mayor Valor</li>
                                                    <li className="dropdown-item">Próximas a Vencer</li>
                                                    <li className="dropdown-item">Por Causal</li>
                                                </SpkDropdown>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* <!-- Start:: row-2 --> */}
                        <Row>
                            <Col xl={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey={activeTab} className="p-0 border-0">
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="row">
                                                {devolucionesFiltradas.map((devolucion: any) => (
                                                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={devolucion.id}>
                                                        <SpkDevolucionCard devolucion={devolucion} />
                                                    </Col>
                                                ))}
                                                {devolucionesFiltradas.length === 0 && (
                                                    <Col xl={12}>
                                                        <div className="text-center py-5">
                                                            <i className="ri-file-text-line display-4 text-muted"></i>
                                                            <p className="text-muted mt-3">No hay devoluciones en esta categoría</p>
                                                            <SpkButton 
                                                                Buttonvariant="primary" 
                                                                Customclass="btn-wave mt-2"
                                                                onClickfunc={handleNuevaDevolucion}
                                                            >
                                                                Crear Primera Devolución
                                                            </SpkButton>
                                                        </div>
                                                    </Col>
                                                )}
                                                {devolucionesFiltradas.length > 0 && (
                                                    <nav aria-label="Page navigation">
                                                        <Pagination className="justify-content-end mb-4">
                                                            <Pagination.Prev disabled>Anterior</Pagination.Prev>
                                                            <Pagination.Item active>1</Pagination.Item>
                                                            <Pagination.Item>2</Pagination.Item>
                                                            <Pagination.Next>Siguiente</Pagination.Next>
                                                        </Pagination>
                                                    </nav>
                                                )}
                                            </div>
                                        )}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Col>
            </Row>
        </Fragment>
    )
};

export default DevolucionesList;