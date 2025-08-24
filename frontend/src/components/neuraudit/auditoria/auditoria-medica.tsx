
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { Link, useNavigate } from "react-router-dom";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import auditoriaService from "../../../services/neuraudit/auditoriaService";
import httpInterceptor from "../../../services/neuraudit/httpInterceptor";

interface AuditoriaMedicaProps { }

const AuditoriaMedica: React.FC<AuditoriaMedicaProps> = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [radicaciones, setRadicaciones] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        estado: '',
        modalidad: '',
        prestador: '',
        search: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [prestadores, setPrestadores] = useState<any[]>([{ value: '', label: 'Todos los Prestadores' }]);
    const [loadingPrestadores, setLoadingPrestadores] = useState(false);

    const statusBadgeClass: any = {
        "RADICADA": "bg-warning-transparent",
        "EN_AUDITORIA": "bg-info-transparent",
        "AUDITADA": "bg-success-transparent",
        "DEVUELTA": "bg-danger-transparent",
        "PAGADA": "bg-success-transparent",
        "BORRADOR": "bg-secondary-transparent"
    };

    const modalidadColorClass: any = {
        "EVENTO": "text-primary",
        "CAPITACION": "text-info",
        "PGP": "text-success"
    };

    // Cargar prestadores para el filtro
    const loadPrestadores = async () => {
        try {
            setLoadingPrestadores(true);
            const response = await httpInterceptor.get('/api/radicacion/prestadores-unicos/');
            setPrestadores(response || [{ value: '', label: 'Todos los Prestadores' }]);
        } catch (error) {
            console.error('Error cargando prestadores:', error);
            setPrestadores([{ value: '', label: 'Todos los Prestadores' }]);
        } finally {
            setLoadingPrestadores(false);
        }
    };

    // Cargar radicaciones pendientes
    const loadRadicaciones = async () => {
        try {
            setLoading(true);
            console.log('Aplicando filtros:', filters);
            const response = await auditoriaService.getRadicacionesPendientes({
                ...filters,
                page: currentPage
            });
            console.log('Respuesta del servidor:', response);
            
            setRadicaciones(response.results || []);
            setTotalCount(response.count || 0);
            setTotalPages(Math.ceil((response.count || 0) / 10)); // Asumiendo 10 por página
            
        } catch (error) {
            console.error('Error cargando radicaciones:', error);
            // Solo mostrar error si es crítico, no para respuestas vacías
            setRadicaciones([]);
            setTotalCount(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar prestadores al montar el componente
    useEffect(() => {
        loadPrestadores();
    }, []);

    // Efecto para cargar datos cuando cambian los filtros o página
    useEffect(() => {
        loadRadicaciones();
    }, [filters, currentPage]);

    // Manejar cambios en filtros
    const handleFilterChange = (filterName: string, value: any) => {
        console.log(`Cambiando filtro ${filterName} a:`, value);
        setFilters(prev => {
            const newFilters = {
                ...prev,
                [filterName]: value
            };
            console.log('Nuevos filtros:', newFilters);
            return newFilters;
        });
        setCurrentPage(1); // Reset a primera página cuando cambian filtros
    };

    // Manejar búsqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            search: searchInput
        }));
        setCurrentPage(1);
    };

    // Navegar a detalle de radicación
    const handleVerDetalle = (radicacionId: string) => {
        navigate(`/neuraudit/auditoria/radicacion/${radicacionId}`);
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

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Auditoría Médica - NeurAudit" />

            <Pageheader title="Auditoría" subtitle="Médica" currentpage="Cuentas Pendientes" activepage="Auditoría Médica" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                <div className="d-flex flex-wrap gap-2 flex-grow-1">
                                    <div style={{ minWidth: '200px' }}>
                                        <SpkSelect name="estado" 
                                        value={filters.estado ? { 
                                            value: filters.estado, 
                                            label: filters.estado === 'RADICADA' ? 'Radicadas' :
                                                   filters.estado === 'EN_AUDITORIA' ? 'En Auditoría' :
                                                   filters.estado === 'AUDITADA' ? 'Auditadas' :
                                                   filters.estado === 'DEVUELTA' ? 'Devueltas' : filters.estado
                                        } : null}
                                        option={[
                                            { value: '', label: 'Todos los estados' },
                                            { value: 'RADICADA', label: 'Radicadas' },
                                            { value: 'EN_AUDITORIA', label: 'En Auditoría' },
                                            { value: 'AUDITADA', label: 'Auditadas' },
                                            { value: 'DEVUELTA', label: 'Devueltas' }
                                        ]} mainClass="basic-multi-select w-100" menuplacement='auto' classNameprefix="Select2" placeholder="Estado" 
                                        onfunchange={(e: any) => handleFilterChange('estado', e?.value || '')} />
                                    </div>
                                    
                                    <div style={{ minWidth: '300px' }}>
                                        <SpkSelect name="prestador" 
                                        value={filters.prestador ? prestadores.find(p => p.value === filters.prestador) : null}
                                        option={prestadores} 
                                        mainClass="basic-multi-select w-100" menuplacement='auto' classNameprefix="Select2" placeholder="Prestador" 
                                        onfunchange={(e: any) => handleFilterChange('prestador', e?.value || '')} />
                                    </div>
                                    
                                    <div style={{ minWidth: '200px' }}>
                                        <SpkSelect name="modalidad" 
                                        value={filters.modalidad ? { 
                                            value: filters.modalidad, 
                                            label: filters.modalidad === 'EVENTO' ? 'Evento' :
                                                   filters.modalidad === 'CAPITACION' ? 'Capitación' : filters.modalidad
                                        } : null}
                                        option={[
                                            { value: '', label: 'Todas las modalidades' },
                                            { value: 'EVENTO', label: 'Evento' },
                                            { value: 'CAPITACION', label: 'Capitación' }
                                        ]} mainClass="basic-multi-select w-100" menuplacement='auto' classNameprefix="Select2" placeholder="Modalidad" 
                                        onfunchange={(e: any) => handleFilterChange('modalidad', e?.value || '')} />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <SpkButton Buttonvariant="secondary" Customclass="btn" onClickfunc={() => {
                                        const clearedFilters = {
                                            estado: '',
                                            modalidad: '',
                                            prestador: '',
                                            search: ''
                                        };
                                        setFilters(clearedFilters);
                                        setSearchInput('');
                                        setCurrentPage(1);
                                        console.log('Filtros limpiados:', clearedFilters);
                                    }}>
                                        <i className="ri-filter-off-line me-1"></i>Limpiar
                                    </SpkButton>
                                    <SpkButton Buttonvariant="success" Customclass="btn">
                                        <i className="ri-download-2-line me-1"></i>Exportar
                                    </SpkButton>
                                    <SpkButton Buttonvariant="info" Customclass="btn" onClickfunc={() => {
                                        loadRadicaciones();
                                        loadPrestadores();
                                    }}>
                                        <i className="ri-refresh-line me-1"></i>Actualizar
                                    </SpkButton>
                                </div>
                                <Form onSubmit={handleSearch} className="d-flex" role="search">
                                    <Form.Control 
                                        className="me-2" 
                                        type="search" 
                                        placeholder="Buscar radicación..." 
                                        aria-label="Search"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <SpkButton Buttonvariant="primary" Customclass="btn" Buttontype="submit">
                                        <i className="ri-search-line"></i>
                                    </SpkButton>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-1 --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[
                                    { title: 'Nº Radicación' }, 
                                    { title: 'Prestador' }, 
                                    { title: 'Fecha Radicación' }, 
                                    { title: 'Facturas' }, 
                                    { title: 'Valor Total' }, 
                                    { title: 'Estado' }, 
                                    { title: 'Modalidad' }, 
                                    { title: 'Asignado a' }, 
                                    { title: 'Acciones' }
                                ]} >
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : radicaciones.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-4">
                                                <p className="mb-0 text-muted">No hay radicaciones pendientes de auditoría</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        radicaciones.map((radicacion) => (
                                            <tr key={radicacion.id}>
                                                <td>
                                                    <span className="fw-medium">{radicacion.numero_radicado}</span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="fw-medium">{radicacion.pss_nombre}</div>
                                                        <small className="text-muted">NIT: {radicacion.pss_nit}</small>
                                                    </div>
                                                </td>
                                                <td>{formatDate(radicacion.fecha_radicacion)}</td>
                                                <td>
                                                    <SpkBadge variant="" Customclass="bg-primary-transparent">
                                                        {radicacion.cantidad_facturas}
                                                    </SpkBadge>
                                                </td>
                                                <td className="fw-medium">{formatCurrency(radicacion.valor_total)}</td>
                                                <td>
                                                    <SpkBadge variant="" Customclass={`${statusBadgeClass[radicacion.estado]}`}>
                                                        {radicacion.estado}
                                                    </SpkBadge>
                                                </td>
                                                <td>
                                                    <span className={`${modalidadColorClass[radicacion.modalidad_pago]} d-flex align-items-center`}>
                                                        <i className="ri-circle-fill me-1 fs-10 lh-1"></i>{radicacion.modalidad_pago}
                                                    </span>
                                                </td>
                                                <td>
                                                    {radicacion.auditor_asignado ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="avatar avatar-sm avatar-rounded">
                                                                <i className="ri-user-line"></i>
                                                            </span>
                                                            <span className="text-muted">{radicacion.auditor_asignado.full_name || radicacion.auditor_asignado.username}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">Sin asignar</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <SpkButton 
                                                            Buttonvariant="primary-light" 
                                                            Customclass="btn-sm"
                                                            onClickfunc={() => handleVerDetalle(radicacion.id)}
                                                        >
                                                            <i className="ri-eye-line me-1"></i>Auditar
                                                        </SpkButton>
                                                        <SpkDropdown toggleas="a" Icon={true} Navigate="#!" Customtoggleclass="btn btn-icon btn-sm btn-light no-caret" IconClass="fe fe-more-vertical">
                                                            <Dropdown.Item onClick={() => handleVerDetalle(radicacion.id)}>
                                                                <i className="ti ti-eye me-1 d-inline-block"></i>Ver Detalle
                                                            </Dropdown.Item>
                                                            <Dropdown.Item href="#!">
                                                                <i className="ti ti-file-download me-1 d-inline-block"></i>Descargar
                                                            </Dropdown.Item>
                                                            <Dropdown.Item href="#!">
                                                                <i className="ti ti-user me-1 d-inline-block"></i>Reasignar
                                                            </Dropdown.Item>
                                                        </SpkDropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-flex align-items-center">
                                <div> 
                                    Mostrando {radicaciones.length} de {totalCount} registros 
                                    <i className="bi bi-arrow-right ms-2 fw-semibold"></i> 
                                </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-2">
                                        <Pagination className="mb-0 flex-wrap">
                                            <Pagination.Prev 
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            >
                                                Anterior
                                            </Pagination.Prev>
                                            
                                            {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                                const pageNumber = index + 1;
                                                return (
                                                    <Pagination.Item
                                                        key={pageNumber}
                                                        active={pageNumber === currentPage}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </Pagination.Item>
                                                );
                                            })}
                                            
                                            {totalPages > 5 && (
                                                <>
                                                    <Pagination.Item disabled>
                                                        <i className='bi bi-three-dots'></i>
                                                    </Pagination.Item>
                                                    <Pagination.Item
                                                        active={currentPage === totalPages}
                                                        onClick={() => setCurrentPage(totalPages)}
                                                    >
                                                        {totalPages}
                                                    </Pagination.Item>
                                                </>
                                            )}
                                            
                                            <Pagination.Next 
                                                className="text-primary"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            >
                                                Siguiente
                                            </Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-2 --> */}
        </Fragment>
    )
};

export default AuditoriaMedica;