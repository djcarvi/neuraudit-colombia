
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Form, Image, Row, Badge, ListGroup } from "react-bootstrap";
import logo1 from '../../../assets/images/brand-logos/desktop-dark.png';
import logo2 from '../../../assets/images/brand-logos/desktop-logo.png';
import { Link, useParams } from "react-router-dom";
import contratacionService from '../../../services/neuraudit/contratacionService';

interface ContratoDetalleProps { }

const ContratoDetalle: React.FC<ContratoDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [contrato, setContrato] = useState<any>(null);
    const [prestador, setPrestador] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log('fetchData called with id:', id);
            if (!id) {
                console.log('No ID provided');
                setLoading(false);
                return;
            }
            try {
                console.log('Fetching contrato with id:', id);
                const contratoData = await contratacionService.getContrato(id);
                console.log('Contrato data received:', contratoData);
                // El servicio ya devuelve los datos directamente, no necesitamos .data
                setContrato(contratoData);
                
                if (contratoData?.prestador) {
                    const prestadorId = typeof contratoData.prestador === 'string' 
                        ? contratoData.prestador 
                        : contratoData.prestador.id || contratoData.prestador._id;
                    console.log('Fetching prestador with id:', prestadorId);
                    const prestadorData = await contratacionService.getPrestador(prestadorId);
                    console.log('Prestador data received:', prestadorData);
                    // Como ya tenemos el prestador en contratoData.prestador, no necesitamos hacer otra llamada
                    setPrestador(contratoData.prestador);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                console.log('Setting loading to false');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando contrato...</span>
            </div>
            <span className="ms-2">Cargando detalles del contrato...</span>
        </div>
    );
    
    if (!id) return (
        <div className="alert alert-warning">
            <h4>Error</h4>
            <p>ID de contrato no válido</p>
        </div>
    );
    
    if (!contrato) return (
        <div className="alert alert-danger">
            <h4>Contrato no encontrado</h4>
            <p>No se pudo cargar la información del contrato con ID: {id}</p>
            <Link to={`${import.meta.env.BASE_URL}neuraudit/contratacion/contratos`} className="btn btn-primary">
                Volver a Contratos
            </Link>
        </div>
    );

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Detalle de Contrato" />

            <Pageheader title="Contratación" subtitle="Contratos" currentpage="Detalle de Contrato" activepage="Detalle" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card invoice-card">
                        <Card.Body>
                            <div className="row gy-3">
                                <Col xl={12}>
                                    <Image  src={logo2} alt="" className="img-fluid desktop-logo" />
                                    <Image  src={logo1} alt="" className="img-fluid desktop-dark" />
                                </Col>
                                <Col xl={12}>
                                    <Row>
                                        <Col xl={4} lg={4} md={6} sm={6} className="">
                                            <p className="text-muted mb-2">
                                                PRESTADOR DE SERVICIOS:
                                            </p>
                                            <p className="fw-bold mb-1">
                                                {prestador?.razon_social || 'N/A'}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                NIT: {prestador?.nit || 'N/A'}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                {prestador?.direccion || 'Dirección no especificada'}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                {prestador?.municipio || ''}, {prestador?.departamento || ''}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                {prestador?.email || 'N/A'}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                Tel: {prestador?.telefono || 'N/A'}
                                            </p>
                                            <p className="text-muted">Código habilitación: <span className="text-primary fw-medium">{prestador?.codigo_habilitacion || 'N/A'}</span></p>
                                        </Col>
                                        <Col xl={4} lg={4} md={6} sm={6} className="ms-auto mt-sm-0 mt-3">
                                            <p className="text-muted mb-2">
                                                ENTIDAD CONTRATANTE:
                                            </p>
                                            <p className="fw-bold mb-1">
                                                EPS Familiar de Colombia
                                            </p>
                                            <p className="text-muted mb-1">
                                                NIT: 830.003.564-7
                                            </p>
                                            <p className="text-muted mb-1">
                                                Av. Carrera 68 # 49A-47
                                            </p>
                                            <p className="text-muted mb-1">
                                                Bogotá D.C., Colombia
                                            </p>
                                            <p className="text-muted mb-1">
                                                contratacion@epsfamiliar.com.co
                                            </p>
                                            <p className="text-muted">
                                                (601) 3078000
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Número de Contrato:</p>
                                    <p className="fs-15 mb-1">{contrato?.numero_contrato || 'N/A'}</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Fecha de Inicio:</p>
                                    <p className="fs-15 mb-1">{contrato?.fecha_inicio ? new Date(contrato.fecha_inicio).toLocaleDateString('es-CO') : 'N/A'}</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Fecha de Fin:</p>
                                    <p className="fs-15 mb-1">{contrato?.fecha_fin ? new Date(contrato.fecha_fin).toLocaleDateString('es-CO') : 'N/A'}</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Modalidad Principal:</p>
                                    <p className="fs-16 mb-1 fw-medium">
                                        <Badge bg={contrato?.modalidad_principal?.codigo === 'CAPITACION' ? 'success' : 'primary'}>
                                            {contrato?.modalidad_principal?.nombre || 'N/A'}
                                        </Badge>
                                    </p>
                                </Col>
                                <Col xl={12}>
                                    <div className="table-responsive">
                                        <h5 className="fw-semibold mb-3">Servicios Contratados y Tarifas</h5>
                                        <SpkTables tableClass="nowrap text-nowrap table-borderless border mt-4" header={[{ title: 'Código CUPS' }, { title: 'Descripción del Servicio' }, { title: 'Tipo' }, { title: 'Tarifa Contratada' }, { title: 'Modalidad' }]}>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        890201
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Consulta de primera vez por medicina general
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <Badge bg="info">Consulta</Badge>
                                                </td>
                                                <td>
                                                    $45,000
                                                </td>
                                                <td>
                                                    <Badge bg="success">Capitación</Badge>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        890301
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Consulta de control por medicina general
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <Badge bg="info">Consulta</Badge>
                                                </td>
                                                <td>
                                                    $35,000
                                                </td>
                                                <td>
                                                    <Badge bg="success">Capitación</Badge>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        891201
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Consulta de primera vez por medicina especializada
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <Badge bg="warning">Especializada</Badge>
                                                </td>
                                                <td>
                                                    $85,000
                                                </td>
                                                <td>
                                                    <Badge bg="primary">Evento</Badge>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        362101
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Hemograma automático con recuento de plaquetas
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <Badge bg="secondary">Laboratorio</Badge>
                                                </td>
                                                <td>
                                                    $25,000
                                                </td>
                                                <td>
                                                    <Badge bg="primary">Evento</Badge>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}></td>
                                                <td colSpan={2}>
                                                    <table className="table table-sm text-nowrap mb-0 table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Total Servicios Contratados:</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">4 servicios</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Consultas:</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">2 servicios</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Especializadas:</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">1 servicio</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Laboratorio:</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">1 servicio</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Valor Promedio UPC:</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">$47,500</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0 fs-14">Estado del Contrato:</p>
                                                                </th>
                                                                <td>
                                                                    <Badge bg={contrato?.estado === 'ACTIVO' ? 'success' : 'warning'} className="fs-12">
                                                                        {contrato?.estado || 'N/A'}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </SpkTables>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <Card className="custom-card">
                                        <Card.Body>
                                            <h6 className="fw-semibold mb-4">
                                                Información del Contrato:
                                            </h6>
                                            <div className="row">
                                                <Col xl={12}>
                                                    <p className="fs-14 fw-medium">
                                                        Modalidades de Pago
                                                    </p>
                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item className="d-flex justify-content-between">
                                                            <span>Capitación:</span>
                                                            <Badge bg="success">Activa</Badge>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex justify-content-between">
                                                            <span>Evento:</span>
                                                            <Badge bg="primary">Activa</Badge>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                    <p className="mt-3">
                                                        <span className="fw-medium text-muted fs-12">Población Asignada:</span> {contrato?.poblacion_asignada || 'N/A'} afiliados
                                                    </p>
                                                    <p>
                                                        <span className="fw-medium text-muted fs-12">Vigencia:</span> {contrato?.fecha_inicio ? new Date(contrato.fecha_inicio).toLocaleDateString('es-CO') : 'N/A'} - {contrato?.fecha_fin ? new Date(contrato.fecha_fin).toLocaleDateString('es-CO') : 'N/A'}
                                                    </p>
                                                    <p className="mb-0">
                                                        <span className="fw-medium text-muted fs-12">Estado : 
                                                            <Badge bg={contrato?.estado === 'ACTIVO' ? 'success' : 'warning'} className="ms-1">
                                                                {contrato?.estado || 'N/A'}
                                                            </Badge>
                                                        </span>
                                                    </p>
                                                </Col>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={12}>
                                    <div>
                                        <label htmlFor="contrato-observaciones" className="form-label">Observaciones y Cláusulas Especiales:</label>
                                        <Form.Control as="textarea" className="" id="contrato-observaciones" rows={3} defaultValue={contrato?.observaciones || "Contrato sujeto a la normatividad vigente del Sistema General de Seguridad Social en Salud. Los servicios se prestan bajo las condiciones pactadas en el presente instrumento contractual y según los estándares de calidad establecidos por la Superintendencia Nacional de Salud."} readOnly />
                                    </div>
                                </Col>
                            </div>
                        </Card.Body>
                        <div className="card-footer text-end">
                            <SpkButton Buttonvariant="warning" Customclass="btn m-1">Exportar PDF<i className="ri-file-pdf-line ms-1 align-middle d-inline-block"></i></SpkButton>
                            <SpkButton Buttonvariant="success" Customclass="btn m-1">Descargar Contrato<i className="ri-download-2-line ms-1 d-inline-block"></i></SpkButton>
                            <SpkButton Buttonvariant="primary" Customclass="btn m-1">Enviar por Email <i className="ri-send-plane-2-line ms-1 align-middle d-inline-block"></i></SpkButton>
                            <Link to={`${import.meta.env.BASE_URL}neuraudit/contratacion/contratos`} className="btn btn-secondary m-1">
                                <i className="ri-arrow-left-line me-1"></i>Volver a Contratos
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ContratoDetalle;