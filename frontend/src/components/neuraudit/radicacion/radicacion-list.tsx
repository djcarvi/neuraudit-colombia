
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import RadicacionTable, { EstadoRadicacion, RadicacionCard, EstadoOptions } from "../../../shared/data/neuraudit/radicaciondata";
import SpkListCard from "../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import radicacionService from "../../../services/neuraudit/radicacionService";

interface RadicacionListProps { }

const RadicacionList: React.FC<RadicacionListProps> = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [radicacionCards, setRadicacionCards] = useState([...RadicacionCard]);
    const [radicaciones, setRadicaciones] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEstado, setSelectedEstado] = useState(null);

    const loadRadicacionData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Cargar estadísticas para las tarjetas
            const stats = await radicacionService.getRadicacionStats();
            console.log('Stats received:', stats);
            console.log('Type of stats:', typeof stats);
            console.log('Stats properties:', Object.keys(stats || {}));
            
            // Actualizar las tarjetas con datos reales del backend
            const updatedCards = [...RadicacionCard];
            
            // Calcular estadísticas desde la respuesta
            const totalRadicaciones = stats.total_radicaciones || 0;
            const radicacionesUltimoMes = stats.radicaciones_ultimo_mes || 0;
            const proximasVencer = stats.proximas_vencer || 0;
            const vencidas = stats.vencidas || 0;
            
            // Calcular porcentaje de cambio mensual
            const porcentajeCambio = totalRadicaciones > 0 ? 
                ((radicacionesUltimoMes / totalRadicaciones) * 100) : 0;
            
            // Actualizar tarjetas con datos reales
            updatedCards[0] = {
                ...updatedCards[0],
                titles: 'Total Radicaciones',
                count: totalRadicaciones.toString(),
                percent: `${porcentajeCambio.toFixed(1)}%`,
                icon: porcentajeCambio > 0 
                    ? 'ti ti-trending-up me-1 fw-semibold align-middle d-inline-block'
                    : 'ti ti-trending-down me-1 fw-semibold align-middle d-inline-block',
                iconColor: porcentajeCambio > 0 ? 'success fw-medium' : 'danger fw-medium'
            };
            
            // Contar por estados
            let enAuditoriaCount = 0;
            let devueltasCount = 0;
            let pendientesCount = 0;
            const valorTotal = stats.valor_total || 0;
            
            if (stats.stats_by_estado) {
                stats.stats_by_estado.forEach((estadoInfo: any) => {
                    if (estadoInfo.estado === 'EN_AUDITORIA') {
                        enAuditoriaCount = estadoInfo.count;
                    }
                    if (estadoInfo.estado === 'DEVUELTA') {
                        devueltasCount = estadoInfo.count;
                    }
                    if (estadoInfo.estado === 'RADICADA') {
                        pendientesCount = estadoInfo.count;
                    }
                });
            }
            
            // Formatear valor total como moneda colombiana
            const valorTotalFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(valorTotal);
            
            updatedCards[1] = {
                ...updatedCards[1],
                titles: 'Valor Total',
                count: valorTotalFormateado, // CORREGIDO: usar valor_total real del backend
                percent: valorTotal > 0 ? `${((valorTotal / 1000000)).toFixed(1)}M` : '0'
            };
            
            updatedCards[2] = {
                ...updatedCards[2],
                titles: 'En Auditoría',
                count: enAuditoriaCount.toString(),
                percent: totalRadicaciones > 0 ? 
                    `${((enAuditoriaCount / totalRadicaciones) * 100).toFixed(1)}%` : '0%'
            };
            
            updatedCards[3] = {
                ...updatedCards[3],
                titles: 'Pendientes',
                count: pendientesCount.toString(),
                percent: `${vencidas} vencidas`
            };
            
            updatedCards[4] = {
                ...updatedCards[4],
                titles: 'Devueltas',
                count: devueltasCount.toString(),
                percent: totalRadicaciones > 0 ? 
                    `${((devueltasCount / totalRadicaciones) * 100).toFixed(2)}%` : '0%'
            };
            
            setRadicacionCards(updatedCards);
            
            // Cargar listado de radicaciones
            const filters = {
                estado: selectedEstado?.value,
                search: searchTerm
            };
            const radicacionesData = await radicacionService.getRadicaciones(filters);
            console.log('Radicaciones data received:', radicacionesData);
            setRadicaciones(radicacionesData.results || []);
            
            setLoading(false);
        } catch (err) {
            console.error('Error loading radicacion data:', err);
            setError('Error al cargar los datos de radicación');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRadicacionData();
    }, [selectedEstado, searchTerm]);

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="NeurAudit-Radicación" />

            <Pageheader title="Radicación" subtitle="Cuentas Médicas" currentpage="Consulta Radicaciones" activepage="Radicación" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row className="row-cols-xxl-5 row-cols-sm-2">
                {radicacionCards.map((idx, index) => (
                    <div className="col-12" key={index}>
                        <SpkListCard list={idx} listCard={true} cardClass={`dashboard-main-card orders-main-cards ${idx.priceColor}`} />
                    </div>
                ))}
            </Row>

            {/* <!--End::row-1 --> */}

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
                                    placeholder="Buscar radicación" 
                                    aria-label="search-radicacion"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* <!-- Filters Section --> */}

                            <div className="d-flex gap-4 flex-wrap w-sm-50 justify-content-end">

                                {/* <!-- Category Filter --> */}

                                <div>
                                <SpkDropdown Customclass="d-grid" Customtoggleclass="btn btn-primary-light" Togglevariant="" iconPosition='before' Icon={true} IconClass="ri-upload-2-line me-1" Toggletext="Exportar">
                                <Dropdown.Item as="li" className=""><i className="bi bi-file-earmark-excel me-2"></i>Excel</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-file-earmark-excel me-2"></i>CSV</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-filetype-pdf me-2"></i>PDF</Dropdown.Item>
                                    </SpkDropdown>
                                </div>

                                {/* <!-- Status Filter --> */}

                                <div className="custom-list-select">
                                    <SpkSelect 
                                        option={EstadoOptions} 
                                        placeholder="Estado Radicación" 
                                        classNameprefix="Select2"
                                        value={selectedEstado}
                                        onChange={setSelectedEstado}
                                    />
                                </div>

                            </div>
                        </Card.Header>

                        {/* <!-- Table inside the card-body --> */}

                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger m-3" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <div id="orders-table" className="grid-card-table">
                                    <RadicacionTable data={radicaciones} />
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-2 --> */}

        </Fragment>
    )
};

export default RadicacionList;