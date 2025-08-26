import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import PrestadorTable, { PrestadorCard, EstadoOptions, TipoPrestadorOptions, NivelAtencionOptions } from "../../../shared/data/neuraudit/contratacion/prestadoresdata";
import SpkListCard from "../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import contratacionService from "../../../services/neuraudit/contratacionService";
import ModalImportarCSV from "./modal-importar-csv";
import { toast } from 'react-toastify';

interface PrestadoresListProps { }

const PrestadoresList: React.FC<PrestadoresListProps> = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [prestadorCards, setPrestadorCards] = useState([...PrestadorCard]);
    const [prestadores, setPrestadores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedNivel, setSelectedNivel] = useState(null);
    const [showModalImportar, setShowModalImportar] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);

    const loadPrestadorData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Cargar estadísticas para las tarjetas
            const stats = await contratacionService.getPrestadoresStats();
            console.log('Stats received:', stats);
            
            // Actualizar las tarjetas con datos reales del backend
            const updatedCards = [...PrestadorCard];
            
            // Calcular estadísticas desde la respuesta
            const totalPrestadores = stats.total || 0;
            const prestadoresActivos = stats.activos || 0;
            const prestadoresConContrato = stats.con_contratos || 0;
            const prestadoresNuevos = stats.alta_complejidad || 0;
            
            // Calcular porcentaje de activos
            const porcentajeActivos = totalPrestadores > 0 ? 
                ((prestadoresActivos / totalPrestadores) * 100) : 0;
            
            // Actualizar tarjetas con datos reales
            updatedCards[0] = {
                ...updatedCards[0],
                titles: 'Total Prestadores',
                count: totalPrestadores.toString(),
                percent: `${porcentajeActivos.toFixed(1)}% activos`,
                icon: 'ti ti-building-hospital me-1 fw-semibold align-middle d-inline-block',
                iconColor: 'primary fw-medium'
            };
            
            updatedCards[1] = {
                ...updatedCards[1],
                titles: 'Prestadores Activos',
                count: prestadoresActivos.toString(),
                percent: `${prestadoresNuevos} nuevos`,
                icon: 'ti ti-check-circle me-1 fw-semibold align-middle d-inline-block',
                iconColor: 'success fw-medium'
            };
            
            updatedCards[2] = {
                ...updatedCards[2],
                titles: 'Con Contrato Vigente',
                count: prestadoresConContrato.toString(),
                percent: totalPrestadores > 0 ? 
                    `${((prestadoresConContrato / totalPrestadores) * 100).toFixed(1)}%` : '0%',
                icon: 'ti ti-file-check me-1 fw-semibold align-middle d-inline-block',
                iconColor: 'info fw-medium'
            };
            
            updatedCards[3] = {
                ...updatedCards[3],
                titles: 'Alta Complejidad',
                count: (stats.alta_complejidad || 0).toString(),
                percent: `${stats.alta_complejidad_porcentaje || 0}% del total`,
                icon: 'ti ti-medical-cross me-1 fw-semibold align-middle d-inline-block',
                iconColor: 'warning fw-medium'
            };
            
            // Nueva card: Sin Contrato
            const prestadoresSinContrato = totalPrestadores - prestadoresConContrato;
            const porcentajeSinContrato = totalPrestadores > 0 ? 
                ((prestadoresSinContrato / totalPrestadores) * 100) : 0;
            
            if (updatedCards[4]) {
                updatedCards[4] = {
                    ...updatedCards[4],
                    titles: 'Sin Contrato',
                    count: prestadoresSinContrato.toString(),
                    percent: `${porcentajeSinContrato.toFixed(1)}% del total`,
                    icon: 'ti ti-file-x me-1 fw-semibold align-middle d-inline-block',
                    iconColor: 'danger fw-medium'
                };
            }
            
            setPrestadorCards(updatedCards);
            
            // Cargar listado de prestadores
            const filters = {
                estado: selectedEstado?.value,
                tipo_prestador: selectedTipo?.value,
                nivel_atencion: selectedNivel?.value,
                search: searchTerm
            };
            const prestadoresData = await contratacionService.getPrestadores(filters);
            setPrestadores(prestadoresData.results || []);
            
            setLoading(false);
        } catch (err: any) {
            console.error('Error loading prestadores data:', err);
            // Mostrar mensaje de error más específico
            const errorMessage = err.response?.data?.detail || err.message || 'Error al cargar los datos de prestadores';
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrestadorData();
    }, [selectedEstado, selectedTipo, selectedNivel, searchTerm]);

    const handleImportarCSV = async (file: File, skipRows: number) => {
        try {
            setImportLoading(true);
            setImportResult(null);
            
            const result = await contratacionService.importPrestadoresCSV(file, skipRows);
            
            setImportResult(result);
            
            // Mostrar notificación según resultado
            if (result.registros_exitosos > 0) {
                toast.success(`Se importaron ${result.registros_exitosos} prestadores exitosamente`);
                
                // Recargar datos para mostrar nuevos prestadores
                await loadPrestadorData();
            }
            
            if (result.registros_con_error > 0) {
                toast.warning(`Se encontraron ${result.registros_con_error} errores durante la importación`);
            }
            
            if (result.registros_duplicados > 0) {
                toast.info(`Se omitieron ${result.registros_duplicados} prestadores duplicados`);
            }
            
        } catch (error: any) {
            console.error('Error al importar CSV:', error);
            toast.error(error.response?.data?.error || 'Error al importar archivo CSV');
            setImportResult(null);
        } finally {
            setImportLoading(false);
        }
    };

    const handleCloseModalImportar = () => {
        setShowModalImportar(false);
        setImportResult(null);
    };

    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="NeurAudit-Prestadores" />
            <Pageheader title="Contratación" subtitle="Red de Prestadores" currentpage="Lista de Prestadores" activepage="Contratación" />

            {/* <!-- Start::row-1 --> */}
            <Row className="row-cols-xxl-5 row-cols-sm-2">
                {prestadorCards.map((idx, index) => (
                    <div className="col-12" key={index}>
                        <SpkListCard list={idx} listCard={true} cardClass={`dashboard-main-card orders-main-cards ${idx.priceColor}`} />
                    </div>
                ))}
            </Row>

            {/* <!-- Start::row-2 --> */}
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between border-bottom-0">
                            {/* <!-- Search Bar --> */}
                            <div className="w-sm-25">
                                <Form.Control 
                                    className="" 
                                    type="search" 
                                    id="search-input" 
                                    placeholder="Buscar por NIT o razón social" 
                                    aria-label="search-prestador"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* <!-- Filters Section --> */}
                            <div className="d-flex gap-2 flex-wrap w-sm-60 justify-content-end">
                                {/* <!-- Tipo Prestador Filter --> */}
                                <div className="custom-list-select">
                                    <SpkSelect 
                                        option={TipoPrestadorOptions} 
                                        placeholder="Tipo Prestador" 
                                        classNameprefix="Select2"
                                        value={selectedTipo}
                                        onChange={setSelectedTipo}
                                    />
                                </div>

                                {/* <!-- Nivel Atención Filter --> */}
                                <div className="custom-list-select">
                                    <SpkSelect 
                                        option={NivelAtencionOptions} 
                                        placeholder="Nivel Atención" 
                                        classNameprefix="Select2"
                                        value={selectedNivel}
                                        onChange={setSelectedNivel}
                                    />
                                </div>

                                {/* <!-- Status Filter --> */}
                                <div className="custom-list-select">
                                    <SpkSelect 
                                        option={EstadoOptions} 
                                        placeholder="Estado" 
                                        classNameprefix="Select2"
                                        value={selectedEstado}
                                        onChange={setSelectedEstado}
                                    />
                                </div>

                                {/* <!-- Actions --> */}
                                <div className="d-flex gap-2">
                                    <SpkButton 
                                        Buttonvariant='success' 
                                        Customclass="btn-wave"
                                        iconPosition='before' 
                                        icon={<i className="ri-file-upload-line me-1"></i>}
                                        onClickfunc={() => setShowModalImportar(true)}
                                    >
                                        Importar CSV
                                    </SpkButton>
                                    <SpkButton 
                                        Buttonvariant='primary' 
                                        Customclass="btn-wave"
                                        iconPosition='before' 
                                        icon={<i className="ri-add-line me-1"></i>}
                                    >
                                        Nuevo Prestador
                                    </SpkButton>
                                    <SpkDropdown Customclass="d-grid" Customtoggleclass="btn btn-primary-light" Togglevariant="" iconPosition='before' Icon={true} IconClass="ri-upload-2-line me-1" Toggletext="Exportar">
                                        <Dropdown.Item as="li" className=""><i className="bi bi-file-earmark-excel me-2"></i>Excel</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-file-earmark-excel me-2"></i>CSV</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-filetype-pdf me-2"></i>PDF</Dropdown.Item>
                                    </SpkDropdown>
                                </div>
                            </div>
                        </Card.Header>

                        {/* <!-- Table inside the card-body --> */}
                        <Card.Body>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <div>
                                    {prestadores.length === 0 ? (
                                        <div className="text-center py-5">
                                            <i className="ri-building-line display-4 text-muted"></i>
                                            <p className="text-muted mt-3">No hay prestadores registrados</p>
                                            <p className="text-muted">Importe prestadores usando el botón "Importar CSV"</p>
                                        </div>
                                    ) : (
                                        <PrestadorTable data={prestadores} />
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para importar CSV */}
            <ModalImportarCSV
                show={showModalImportar}
                onHide={handleCloseModalImportar}
                onConfirm={handleImportarCSV}
                loading={importLoading}
                resultadoProceso={importResult}
            />
        </Fragment>
    )
};

export default PrestadoresList;