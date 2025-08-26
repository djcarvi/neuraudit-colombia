import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Nav, Pagination, Row, Tab, Form, Collapse } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkContratoCard from "../../../shared/@spk-reusable-components/dashboards-reusable/neuraudit/spk-contratocard";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import contratacionService from "../../../services/neuraudit/contratacionService";
import { useNavigate, Link } from "react-router-dom";
import LabeledTwoThumbs1 from "../../../shared/data/dashboards/jobs/searchjobdata";

interface ContratosListProps { }

const ContratosList: React.FC<ContratosListProps> = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [contratos, setContratos] = useState([]);
    const [contratosFiltrados, setContratosFiltrados] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [openEstado, setOpenEstado] = useState(false);
    const [openModalidad, setOpenModalidad] = useState(false);
    
    // Estados de filtros
    const [filtrosEstado, setFiltrosEstado] = useState({
        vigente: false,
        por_vencer: false,
        vencido: false,
        por_iniciar: false
    });
    
    const [filtrosModalidad, setFiltrosModalidad] = useState({
        evento: false,
        capitacion: false,
        pgp: false,
        paquete: false
    });
    
    const [rangoPrecio, setRangoPrecio] = useState([0, 1000000000]);

    const loadContratosData = async () => {
        try {
            setLoading(true);
            const contratosData = await contratacionService.getContratos({});
            setContratos(contratosData.results || []);
            setContratosFiltrados(contratosData.results || []);
        } catch (err: any) {
            console.error('Error loading contratos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContratosData();
    }, []);

    const filterContratos = (modalidad: string) => {
        setActiveTab(modalidad);
        if (modalidad === "all") {
            setContratosFiltrados(contratos);
        } else if (modalidad === "vigente") {
            const filtered = contratos.filter((contrato: any) => 
                contrato.estado === "VIGENTE"
            );
            setContratosFiltrados(filtered);
        } else if (modalidad === "por_vencer") {
            const filtered = contratos.filter((contrato: any) => 
                contrato.estado === "POR_VENCER" || (contrato.dias_restantes && contrato.dias_restantes <= 30)
            );
            setContratosFiltrados(filtered);
        } else {
            const filtered = contratos.filter((contrato: any) => 
                contrato.modalidad_principal?.codigo === modalidad.toUpperCase()
            );
            setContratosFiltrados(filtered);
        }
    };

    const handleNuevoContrato = () => {
        navigate('/neuraudit/contratacion/contratos/nuevo');
    };
    
    // Aplicar filtros avanzados
    const aplicarFiltros = () => {
        let filtered = [...contratos];
        
        // Filtrar por estado
        const estadosSeleccionados = Object.entries(filtrosEstado)
            .filter(([_, selected]) => selected)
            .map(([estado, _]) => estado);
            
        if (estadosSeleccionados.length > 0) {
            filtered = filtered.filter((contrato: any) => {
                if (estadosSeleccionados.includes('vigente') && contrato.estado === 'VIGENTE') return true;
                if (estadosSeleccionados.includes('por_vencer') && contrato.estado === 'POR_VENCER') return true;
                if (estadosSeleccionados.includes('vencido') && contrato.estado === 'VENCIDO') return true;
                if (estadosSeleccionados.includes('por_iniciar') && contrato.estado === 'POR_INICIAR') return true;
                return false;
            });
        }
        
        // Filtrar por modalidad
        const modalidadesSeleccionadas = Object.entries(filtrosModalidad)
            .filter(([_, selected]) => selected)
            .map(([modalidad, _]) => modalidad.toUpperCase());
            
        if (modalidadesSeleccionadas.length > 0) {
            filtered = filtered.filter((contrato: any) =>
                modalidadesSeleccionadas.includes(contrato.modalidad_principal?.codigo)
            );
        }
        
        // Filtrar por rango de precio
        filtered = filtered.filter((contrato: any) =>
            contrato.valor_total >= rangoPrecio[0] && contrato.valor_total <= rangoPrecio[1]
        );
        
        setContratosFiltrados(filtered);
        setShowFilters(false);
    };
    
    const limpiarFiltros = () => {
        setFiltrosEstado({
            vigente: false,
            por_vencer: false,
            vencido: false,
            por_iniciar: false
        });
        setFiltrosModalidad({
            evento: false,
            capitacion: false,
            pgp: false,
            paquete: false
        });
        setRangoPrecio([0, 1000000000]);
        setContratosFiltrados(contratos);
    };

    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="NeurAudit-Contratos" />
            <Pageheader title="Contratación" subtitle="Contratos" currentpage="Gestión de Contratos" activepage="Contratación" />

            <Row>
                <Col xxl={showFilters ? 3 : 0} xl={showFilters ? 3 : 0} className={showFilters ? "" : "d-none"}>
                    <Card className="custom-card products-navigation-card">
                        <Card.Body className="p-0">
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Estado del Contrato</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-vigente" 
                                            checked={filtrosEstado.vigente}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, vigente: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-vigente">
                                            Vigente
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.estado === "VIGENTE").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-por-vencer"
                                            checked={filtrosEstado.por_vencer}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, por_vencer: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-por-vencer">
                                            Por Vencer
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.estado === "POR_VENCER").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-vencido"
                                            checked={filtrosEstado.vencido}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, vencido: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-vencido">
                                            Vencido
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.estado === "VENCIDO").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="estado-por-iniciar"
                                            checked={filtrosEstado.por_iniciar}
                                            onChange={(e) => setFiltrosEstado({...filtrosEstado, por_iniciar: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="estado-por-iniciar">
                                            Por Iniciar
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.estado === "POR_INICIAR").length}
                                        </SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Modalidad de Pago</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="mod-evento"
                                            checked={filtrosModalidad.evento}
                                            onChange={(e) => setFiltrosModalidad({...filtrosModalidad, evento: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="mod-evento">
                                            Evento
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.modalidad_principal?.codigo === "EVENTO").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="mod-capitacion"
                                            checked={filtrosModalidad.capitacion}
                                            onChange={(e) => setFiltrosModalidad({...filtrosModalidad, capitacion: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="mod-capitacion">
                                            Capitación
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.modalidad_principal?.codigo === "CAPITACION").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="mod-pgp"
                                            checked={filtrosModalidad.pgp}
                                            onChange={(e) => setFiltrosModalidad({...filtrosModalidad, pgp: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="mod-pgp">
                                            PGP
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.modalidad_principal?.codigo === "PGP").length}
                                        </SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="" 
                                            id="mod-paquete"
                                            checked={filtrosModalidad.paquete}
                                            onChange={(e) => setFiltrosModalidad({...filtrosModalidad, paquete: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="mod-paquete">
                                            Paquete
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">
                                            {contratos.filter((c: any) => c.modalidad_principal?.codigo === "PAQUETE").length}
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
                                                            onClick={() => filterContratos("all")}
                                                        >
                                                            Todos
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="evento" 
                                                            active={activeTab === "evento"}
                                                            onClick={() => filterContratos("evento")}
                                                        >
                                                            Evento
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="capitacion" 
                                                            active={activeTab === "capitacion"}
                                                            onClick={() => filterContratos("capitacion")}
                                                        >
                                                            Capitación
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="pgp" 
                                                            active={activeTab === "pgp"}
                                                            onClick={() => filterContratos("pgp")}
                                                        >
                                                            PGP
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="paquete" 
                                                            active={activeTab === "paquete"}
                                                            onClick={() => filterContratos("paquete")}
                                                        >
                                                            Paquete
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="vigente" 
                                                            active={activeTab === "vigente"}
                                                            onClick={() => filterContratos("vigente")}
                                                        >
                                                            Vigentes
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item role="presentation">
                                                        <Nav.Link 
                                                            eventKey="por_vencer" 
                                                            active={activeTab === "por_vencer"}
                                                            onClick={() => filterContratos("por_vencer")}
                                                        >
                                                            Por Vencer
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <SpkButton 
                                                    Buttonvariant="primary" 
                                                    Buttontype="button" 
                                                    Customclass="btn btn-sm btn-wave"
                                                    onClickfunc={handleNuevoContrato}
                                                >
                                                    <i className="ri-add-line me-1"></i> Nuevo Contrato
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
                                                    <li className="dropdown-item">Menor Valor</li>
                                                    <li className="dropdown-item">Por Vencer</li>
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
                                                {contratosFiltrados.map((contrato: any) => (
                                                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={contrato.id}>
                                                        <SpkContratoCard contrato={contrato} />
                                                    </Col>
                                                ))}
                                                {contratosFiltrados.length === 0 && (
                                                    <Col xl={12}>
                                                        <div className="text-center py-5">
                                                            <i className="ri-file-text-line display-4 text-muted"></i>
                                                            <p className="text-muted mt-3">No hay contratos en esta categoría</p>
                                                            <SpkButton 
                                                                Buttonvariant="primary" 
                                                                Customclass="btn-wave mt-2"
                                                                onClickfunc={handleNuevoContrato}
                                                            >
                                                                Crear Primer Contrato
                                                            </SpkButton>
                                                        </div>
                                                    </Col>
                                                )}
                                                {contratosFiltrados.length > 0 && (
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

export default ContratosList;