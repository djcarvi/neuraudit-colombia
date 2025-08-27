import React, { useState, useEffect } from 'react';
import { Card, Form, Table, Button, Modal, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { contratacionMongoDBService, ServicioCUPSContractual, TarifaCUPSContractual } from '../../../services/neuraudit/contratacionServiceMongoDB';

interface ServiciosCUPSContractualesProps {
    contratoId: string;
    numeroContrato: string;
    manualTarifario: string;
}

const ServiciosCUPSContractuales: React.FC<ServiciosCUPSContractualesProps> = ({ 
    contratoId, 
    numeroContrato,
    manualTarifario 
}) => {
    const [tarifas, setTarifas] = useState<TarifaCUPSContractual[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    
    // Estado para nuevo servicio
    const [nuevoServicio, setNuevoServicio] = useState<ServicioCUPSContractual>({
        codigo_cups: '',
        descripcion: '',
        valor_negociado: 0,
        aplica_copago: false,
        aplica_cuota_moderadora: false,
        requiere_autorizacion: false,
        restricciones: {
            sexo: 'AMBOS',
            ambito: 'AMBOS'
        }
    });
    
    // Estado para estadísticas
    const [estadisticas, setEstadisticas] = useState<any>(null);
    
    // Cargar servicios CUPS del contrato
    const cargarServicios = async () => {
        setLoading(true);
        try {
            const response = await contratacionMongoDBService.buscarTarifasCUPS({
                contrato_id: contratoId
            });
            setTarifas(response.results || []);
        } catch (error) {
            console.error('Error cargando servicios:', error);
            toast.error('Error cargando servicios CUPS');
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar estadísticas
    const cargarEstadisticas = async () => {
        try {
            const stats = await contratacionMongoDBService.obtenerEstadisticasContrato(contratoId);
            setEstadisticas(stats);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    };
    
    useEffect(() => {
        cargarServicios();
        cargarEstadisticas();
    }, [contratoId]);
    
    // Guardar nuevo servicio
    const guardarServicio = async () => {
        try {
            if (!nuevoServicio.codigo_cups || !nuevoServicio.descripcion || nuevoServicio.valor_negociado <= 0) {
                toast.warning('Complete todos los campos requeridos');
                return;
            }
            
            const resultado = await contratacionMongoDBService.agregarServiciosCUPS(
                contratoId,
                [nuevoServicio]
            );
            
            if (resultado.success) {
                toast.success('Servicio agregado exitosamente');
                setShowModal(false);
                cargarServicios();
                cargarEstadisticas();
                // Limpiar formulario
                setNuevoServicio({
                    codigo_cups: '',
                    descripcion: '',
                    valor_negociado: 0,
                    aplica_copago: false,
                    aplica_cuota_moderadora: false,
                    requiere_autorizacion: false,
                    restricciones: { sexo: 'AMBOS', ambito: 'AMBOS' }
                });
            } else {
                toast.error(resultado.error || 'Error agregando servicio');
            }
        } catch (error) {
            console.error('Error guardando servicio:', error);
            toast.error('Error guardando servicio');
        }
    };
    
    // Manejar importación de Excel
    const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        try {
            setLoading(true);
            const resultado = await contratacionMongoDBService.importarServiciosCUPS(
                contratoId,
                file
            );
            
            if (resultado.success) {
                toast.success(
                    `Importación exitosa: ${resultado.insertados} insertados, ${resultado.actualizados} actualizados`
                );
                setShowImportModal(false);
                cargarServicios();
                cargarEstadisticas();
            } else {
                toast.error(resultado.error || 'Error en importación');
            }
        } catch (error) {
            console.error('Error importando:', error);
            toast.error('Error importando archivo');
        } finally {
            setLoading(false);
        }
    };
    
    // Exportar a Excel
    const handleExportar = async () => {
        try {
            await contratacionMongoDBService.exportarTarifario(contratoId);
            toast.success('Tarifario exportado exitosamente');
        } catch (error) {
            console.error('Error exportando:', error);
            toast.error('Error exportando tarifario');
        }
    };
    
    // Formatear valor como moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };
    
    // Renderizar badge de variación
    const renderVariacionBadge = (porcentaje: number) => {
        if (porcentaje > 10) {
            return <Badge bg="danger">+{porcentaje.toFixed(1)}%</Badge>;
        } else if (porcentaje > 0) {
            return <Badge bg="warning">+{porcentaje.toFixed(1)}%</Badge>;
        } else if (porcentaje < -10) {
            return <Badge bg="success">{porcentaje.toFixed(1)}%</Badge>;
        } else {
            return <Badge bg="secondary">{porcentaje.toFixed(1)}%</Badge>;
        }
    };
    
    // Filtrar tarifas
    const tarifasFiltradas = tarifas.filter(tarifa => 
        tarifa.codigo_cups.toLowerCase().includes(busqueda.toLowerCase()) ||
        tarifa.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    return (
        <>
            {/* Card de estadísticas */}
            {estadisticas && (
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col xs={12} sm={6} md={3}>
                                <div className="text-center">
                                    <h3>{estadisticas.resumen?.total_servicios || 0}</h3>
                                    <p className="text-muted mb-0">Total Servicios</p>
                                </div>
                            </Col>
                            <Col xs={12} sm={6} md={3}>
                                <div className="text-center">
                                    <h3>{formatCurrency(estadisticas.resumen?.valor_promedio || 0)}</h3>
                                    <p className="text-muted mb-0">Valor Promedio</p>
                                </div>
                            </Col>
                            <Col xs={12} sm={6} md={3}>
                                <div className="text-center">
                                    <h3>{estadisticas.resumen?.requieren_autorizacion || 0}</h3>
                                    <p className="text-muted mb-0">Requieren Autorización</p>
                                </div>
                            </Col>
                            <Col xs={12} sm={6} md={3}>
                                <div className="text-center">
                                    <h3>{manualTarifario}</h3>
                                    <p className="text-muted mb-0">Manual Base</p>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
            
            {/* Card principal */}
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0">Servicios CUPS Contractuales</h5>
                        <small className="text-muted">Contrato: {numeroContrato}</small>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="bi bi-plus-circle me-1"></i>
                            Agregar Servicio
                        </Button>
                        <Button 
                            variant="info" 
                            size="sm"
                            onClick={() => setShowImportModal(true)}
                        >
                            <i className="bi bi-upload me-1"></i>
                            Importar Excel
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleExportar}
                        >
                            <i className="bi bi-download me-1"></i>
                            Exportar
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {/* Buscador */}
                    <div className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Buscar por código o descripción..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    ) : tarifasFiltradas.length > 0 ? (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Código CUPS</th>
                                        <th>Descripción</th>
                                        <th>Valor Negociado</th>
                                        <th>Valor Referencia</th>
                                        <th>Variación</th>
                                        <th>Restricciones</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tarifasFiltradas.map((tarifa) => (
                                        <tr key={tarifa._id}>
                                            <td>
                                                <code>{tarifa.codigo_cups}</code>
                                            </td>
                                            <td>
                                                <div>{tarifa.descripcion}</div>
                                                {tarifa.requiere_autorizacion && (
                                                    <small className="text-warning">
                                                        <i className="bi bi-shield-exclamation me-1"></i>
                                                        Requiere autorización
                                                    </small>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <strong>{formatCurrency(tarifa.valor_negociado)}</strong>
                                            </td>
                                            <td className="text-end">
                                                {formatCurrency(tarifa.valor_referencia)}
                                            </td>
                                            <td className="text-center">
                                                {renderVariacionBadge(tarifa.porcentaje_variacion)}
                                            </td>
                                            <td>
                                                {tarifa.restricciones?.sexo !== 'AMBOS' && (
                                                    <Badge bg="info" className="me-1">
                                                        {tarifa.restricciones.sexo}
                                                    </Badge>
                                                )}
                                                {tarifa.restricciones?.ambito !== 'AMBOS' && (
                                                    <Badge bg="secondary">
                                                        {tarifa.restricciones.ambito}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg={tarifa.estado === 'ACTIVO' ? 'success' : 'secondary'}>
                                                    {tarifa.estado}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <Alert variant="info" className="text-center">
                            <i className="bi bi-info-circle me-2"></i>
                            No se encontraron servicios CUPS en este contrato
                        </Alert>
                    )}
                    
                    {/* Servicios con variación extrema */}
                    {estadisticas?.servicios_variacion_extrema?.length > 0 && (
                        <div className="mt-4">
                            <h6>⚠️ Servicios con Variación Extrema</h6>
                            <Table size="sm" className="table-bordered">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Variación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estadisticas.servicios_variacion_extrema.map((servicio: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{servicio.codigo_cups}</td>
                                            <td>{servicio.descripcion}</td>
                                            <td className="text-center">
                                                {renderVariacionBadge(servicio.porcentaje_variacion)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
            
            {/* Modal agregar servicio */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Servicio CUPS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Código CUPS <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nuevoServicio.codigo_cups}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            codigo_cups: e.target.value
                                        })}
                                        placeholder="Ej: 890201"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>Descripción <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nuevoServicio.descripcion}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            descripcion: e.target.value
                                        })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Valor Negociado <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={nuevoServicio.valor_negociado}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            valor_negociado: parseFloat(e.target.value) || 0
                                        })}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Aplicaciones</Form.Label>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Requiere Autorización"
                                        checked={nuevoServicio.requiere_autorizacion}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            requiere_autorizacion: e.target.checked
                                        })}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Aplica Copago"
                                        checked={nuevoServicio.aplica_copago}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            aplica_copago: e.target.checked
                                        })}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Aplica Cuota Moderadora"
                                        checked={nuevoServicio.aplica_cuota_moderadora}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            aplica_cuota_moderadora: e.target.checked
                                        })}
                                    />
                                </div>
                            </Col>
                        </Row>
                        
                        <h6>Restricciones</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Sexo</Form.Label>
                                    <Form.Select
                                        value={nuevoServicio.restricciones?.sexo}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            restricciones: {
                                                ...nuevoServicio.restricciones,
                                                sexo: e.target.value as any
                                            }
                                        })}
                                    >
                                        <option value="AMBOS">Ambos</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ámbito</Form.Label>
                                    <Form.Select
                                        value={nuevoServicio.restricciones?.ambito}
                                        onChange={(e) => setNuevoServicio({
                                            ...nuevoServicio,
                                            restricciones: {
                                                ...nuevoServicio.restricciones,
                                                ambito: e.target.value as any
                                            }
                                        })}
                                    >
                                        <option value="AMBOS">Ambos</option>
                                        <option value="AMBULATORIO">Ambulatorio</option>
                                        <option value="HOSPITALARIO">Hospitalario</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={guardarServicio}>
                        Guardar Servicio
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Modal importar Excel */}
            <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Importar Servicios desde Excel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info">
                        <strong>Formato requerido:</strong>
                        <ul className="mb-0 mt-2">
                            <li>codigo_cups (requerido)</li>
                            <li>descripcion (requerido)</li>
                            <li>valor_negociado (requerido)</li>
                            <li>aplica_copago (opcional, true/false)</li>
                            <li>requiere_autorizacion (opcional, true/false)</li>
                            <li>restriccion_sexo (opcional, M/F/AMBOS)</li>
                            <li>restriccion_ambito (opcional, AMBULATORIO/HOSPITALARIO/AMBOS)</li>
                        </ul>
                    </Alert>
                    <Form.Group>
                        <Form.Label>Seleccionar archivo Excel</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImportExcel}
                            disabled={loading}
                        />
                    </Form.Group>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ServiciosCUPSContractuales;