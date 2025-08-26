
import { Link, useParams } from "react-router-dom";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkFriendscard from "../../../shared/@spk-reusable-components/reusable-pages/spk-friendscard";
import SpkProfileCard from "../../../shared/@spk-reusable-components/reusable-pages/spk-profilecard";
import { FriendsList, ProfileGallery, Profiles } from "../../../shared/data/pages/profiledata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Dropdown, Form, Image, Nav, Row, Tab, Badge, Table, Alert, ListGroup } from "react-bootstrap";
import { FilePond } from "react-filepond";
import contratacionService from '../../../services/neuraudit/contratacionService';
import face2 from '../../../assets/images/faces/2.jpg';
import face3 from '../../../assets/images/faces/3.jpg';
import face4 from '../../../assets/images/faces/4.jpg';
import face5 from '../../../assets/images/faces/5.jpg';
import face6 from '../../../assets/images/faces/6.jpg';
import face8 from '../../../assets/images/faces/8.jpg';
import face10 from '../../../assets/images/faces/10.jpg';
import face12 from '../../../assets/images/faces/12.jpg';
import face13 from '../../../assets/images/faces/13.jpg';
import face14 from '../../../assets/images/faces/14.jpg';
import face15 from '../../../assets/images/faces/15.jpg';

import media3 from '../../../assets/images/media/media-3.jpg';
import media10 from '../../../assets/images/media/media-10.jpg';
import media23 from '../../../assets/images/media/media-23.jpg';
interface ContratoDetalleProps { }

const ContratoDetalle: React.FC<ContratoDetalleProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [contrato, setContrato] = useState<any>(null);
    const [prestador, setPrestador] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const contratoData = await contratacionService.getContrato(id);
                setContrato(contratoData);
                if (contratoData?.prestador) {
                    setPrestador(contratoData.prestador);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const [files, setFiles] = useState<any>([]);

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Detalle Contrato - NeurAudit" />

            <Pageheader title="Contratación" currentpage="Detalle de Contrato" activepage="Contratos" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row className="justify-content-center">
                <Col xl={10}>
                    <Row>
                        <Tab.Container defaultActiveKey={"servicios"} >
                            <Col xl={12}>
                                <Card className="custom-card profile-card">
                                    <div className="profile-banner-image profile-img">
                                        <Image  src={media3} className="card-img-top" alt="..." />
                                    </div>
                                    <Card.Body className="p-4 pb-0 position-relative">
                                        <div className="d-flex align-items-end justify-content-between flex-wrap">
                                            <div>
                                                <span className="avatar avatar-xxl avatar-rounded bg-info online">
                                                    <Image  src={face12} alt="" />
                                                </span>
                                                <div className="mt-4 mb-3 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                                                    <div>
                                                        <h5 className="fw-semibold mb-1">{contrato?.numero_contrato || 'Sin número'}</h5>
                                                        <span className="d-block fw-medium text-muted mb-1">{prestador?.razon_social || 'Prestador no cargado'}</span>
                                                        <p className="fs-12 mb-0 fw-medium text-muted"> <span className="me-3 d-inline-block"><i className="ri-building-line me-1 align-middle d-inline-block"></i>NIT: {prestador?.nit || 'N/A'}</span> <span><i className="ri-phone-line me-1 align-middle d-inline-block"></i>{prestador?.telefono || 'Sin teléfono'}</span> </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Nav className="nav-tabs mb-0 tab-style-8 scaleX" id="myTab" role="tablist">
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"servicios"} className="" id="servicios-tab" data-bs-toggle="tab"
                                                            data-bs-target="#servicios-tab-pane" type="button" role="tab"
                                                            aria-controls="servicios-tab-pane" aria-selected="true">Servicios</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"tarifas"} className="" id="tarifas-tab" data-bs-toggle="tab"
                                                            data-bs-target="#tarifas-tab-pane" type="button" role="tab"
                                                            aria-controls="tarifas-tab-pane" aria-selected="false">Tarifas</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"clausulas"} className="" id="clausulas-tab" data-bs-toggle="tab"
                                                            data-bs-target="#clausulas-tab-pane" type="button" role="tab"
                                                            aria-controls="clausulas-tab-pane" aria-selected="false">Cláusulas</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"anexos"} className="" id="anexos-tab" data-bs-toggle="tab"
                                                            data-bs-target="#anexos-tab-pane" type="button" role="tab"
                                                            aria-controls="anexos-tab-pane" aria-selected="false">Anexos</Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={12}>
                                <Tab.Content id="profile-tabs">
                                    <Tab.Pane eventKey={"servicios"} className="p-0 border-0" id="servicios-tab-pane" role="tabpanel" aria-labelledby="servicios-tab" tabIndex={0}>
                                        <Row>
                                            <Col xxl={4}>
                                                <Row>
                                                    <Col xl={12}>
                                                        <Card className="custom-card">
                                                            <Card.Body>
                                                                <div className="d-flex align-items-center justify-content-center gap-4">
                                                                    <div className="text-center">
                                                                        <h3 className="fw-semibold mb-1">
                                                                            {contrato?.valor_total ? `${Number(contrato.valor_total).toLocaleString('es-CO', {maximumFractionDigits: 0})}` : 'N/A'}
                                                                        </h3>
                                                                        <span className="d-block text-muted">Valor Total</span>
                                                                    </div>
                                                                    <div className="vr"></div>
                                                                    <div className="text-center">
                                                                        <h3 className="fw-semibold mb-1">
                                                                            {contrato?.porcentaje_negociacion || 95}%
                                                                        </h3>
                                                                        <span className="d-block text-muted">% Negociación</span>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Card className="custom-card">
                                                            <Card.Header>
                                                                <div className="card-title">
                                                                    Información del Contrato
                                                                </div>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <p className="text-muted">Contrato de prestación de servicios de salud entre EPS Familiar de Colombia y {prestador?.razon_social || 'el prestador'}, regido por la normatividad vigente del Sistema General de Seguridad Social en Salud.</p>
                                                                <div className="text-muted">
                                                                    <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-calendar-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Fecha Inicio : </span> {contrato?.fecha_inicio ? new Date(contrato.fecha_inicio).toLocaleDateString('es-CO') : 'N/A'}
                                                                    </div>
                                                                    <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-calendar-check-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Fecha Fin : </span> {contrato?.fecha_fin ? new Date(contrato.fecha_fin).toLocaleDateString('es-CO') : 'N/A'}
                                                                    </div>
                                                                    <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-file-list-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Modalidad : </span> {contrato?.modalidad_principal?.nombre || 'N/A'}
                                                                    </div>
                                                                    <div className="mb-0 d-flex align-items-center gap-1">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-shield-check-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Estado : </span> <Badge bg={contrato?.estado === 'VIGENTE' ? 'success' : 'warning'}>{contrato?.estado || 'N/A'}</Badge>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Card className="custom-card overflow-hidden">
                                                            <Card.Header>
                                                                <div className="card-title">
                                                                    Tarifarios Base
                                                                </div>
                                                            </Card.Header>
                                                            <Card.Body className="p-0">
                                                                <ul className="list-group list-group-flush social-media-list">
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-primary-transparent"><i className="ri-file-text-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Manual ISS 2001</span>
                                                                                <Link to="#!" className="text-muted">Tarifa mínima de referencia</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-secondary-transparent"><i className="ri-file-shield-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Manual SOAT 2025</span>
                                                                                <Link to="#!" className="text-muted">Tarifa máxima permitida</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-success-transparent"><i className="ri-calculator-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Porcentaje Negociación</span>
                                                                                <Link to="#!" className="text-muted">{contrato?.porcentaje_negociacion || 95}% del manual base</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-orange-transparent"><i className="ri-file-list-3-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Manual Tarifario</span>
                                                                                <Link to="#!" className="text-muted">{contrato?.manual_tarifario || 'MIXTO'}</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xxl={8}>
                                                <Card className="custom-card">
                                                    <Tab.Container defaultActiveKey={"status"}>
                                                        <Card.Header className="p-0">
                                                            <Nav className="nav-tabs tab-style-8 scaleX justify-content-end" id="myTab4" role="tablist">
                                                                <Nav.Item role="presentation">
                                                                    <Nav.Link eventKey={"cups"} className="" id="cups-tab" data-bs-toggle="tab" data-bs-target="#cups-tab-pane" type="button" role="tab" aria-controls="cups-tab-pane" aria-selected="true"><i className="ri-hospital-line lh-1 me-1"></i>CUPS</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item role="presentation">
                                                                    <Nav.Link eventKey={"cum"} className="" id="cum-tab" data-bs-toggle="tab" data-bs-target="#cum-tab-pane" type="button" role="tab" aria-controls="cum-tab-pane" aria-selected="false" tabIndex={2}><i className="ri-capsule-line lh-1 me-1"></i>Medicamentos</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item role="presentation">
                                                                    <Nav.Link eventKey={"dispositivos"} className="" id="dispositivos-tab" data-bs-toggle="tab" data-bs-target="#dispositivos-tab-pane" type="button" role="tab" aria-controls="dispositivos-tab-pane" aria-selected="false" tabIndex={1}><i className="ri-heart-pulse-line lh-1 me-1"></i>Dispositivos</Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                        </Card.Header>
                                                        <Card.Body className="">
                                                            <Tab.Content id="myTabContent3">
                                                                <Tab.Pane eventKey={"cups"} className="overflow-hidden p-0 border-0" id="cups-tab-pane" role="tabpanel" aria-labelledby="cups-tab" tabIndex={0}>
                                                                    <p className="mb-3 text-muted">Servicios CUPS contratados. Los servicios no incluidos generarán glosas automáticas tipo CO (Cobertura).</p>
                                                                    <div className="input-group mb-3">
                                                                        <Form.Control type="text" className="form-control" placeholder="Buscar servicio CUPS..." />
                                                                        <SpkButton Buttonvariant="primary" Customclass="btn">Agregar <i className="ri-add-line ms-1"></i></SpkButton>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey={"cum"} className="overflow-hidden border-0 p-0" id="cum-tab-pane" role="tabpanel" aria-labelledby="cum-tab" tabIndex={0}>
                                                                    <p className="mb-3 text-muted">Código Único de Medicamentos contratados.</p>
                                                                    <div className="input-group mb-3">
                                                                        <Form.Control type="text" className="form-control" placeholder="Buscar medicamento CUM..." />
                                                                        <SpkButton Buttonvariant="success" Customclass="btn">Agregar <i className="ri-add-line ms-1"></i></SpkButton>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey={"dispositivos"} className="overflow-hidden border-0 p-0" id="dispositivos-tab-pane" role="tabpanel" aria-labelledby="dispositivos-tab" tabIndex={0}>
                                                                    <p className="mb-3 text-muted">Dispositivos médicos contratados.</p>
                                                                    <div className="input-group mb-3">
                                                                        <Form.Control type="text" className="form-control" placeholder="Buscar dispositivo médico..." />
                                                                        <SpkButton Buttonvariant="warning" Customclass="btn">Agregar <i className="ri-add-line ms-1"></i></SpkButton>
                                                                    </div>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Card.Body>
                                                    </Tab.Container>
                                                </Card>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-rounded avatar-md bg-primary-transparent">
                                                                    <i className="ri-hospital-line fs-20"></i>
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <span className="d-block fw-semibold">Servicios CUPS Contratados</span>
                                                                <span className="text-muted fs-13">Total: {contrato?.servicios_contratados?.length || 0} servicios</span>
                                                            </div>
                                                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                                                                <Dropdown.Item as="li" href="#!"><i className="ri-edit-line me-2"></i>Editar</Dropdown.Item>
                                                                <Dropdown.Item as="li" href="#!"><i className="ri-download-line me-2"></i>Exportar</Dropdown.Item>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className="my-3">Lista de servicios médicos contratados según CUPS. Los servicios no incluidos generarán glosas CO automáticamente.</div>
                                                        <div className="table-responsive">
                                                            <Table className="table table-bordered table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Código</th>
                                                                        <th>Descripción</th>
                                                                        <th>Tarifa</th>
                                                                        <th>Modalidad</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>890201</td>
                                                                        <td>Consulta de primera vez medicina general</td>
                                                                        <td>$45,000</td>
                                                                        <td><Badge bg="success">CAP</Badge></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>890301</td>
                                                                        <td>Consulta de control medicina general</td>
                                                                        <td>$35,000</td>
                                                                        <td><Badge bg="success">CAP</Badge></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>891201</td>
                                                                        <td>Consulta medicina especializada</td>
                                                                        <td>$85,000</td>
                                                                        <td><Badge bg="primary">EVE</Badge></td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Card.Body>
                                                    <div className="card-footer">
                                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="avatar-list-stacked">
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face2} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face8} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face2} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face10} alt="img" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                and 8 others <i className="ri-heart-3-fill text-danger"></i> this post
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <Link to="#!" className="p-1 px-2 bg-primary-transparent rounded"><i className="ri-message-3-line me-1"></i>Comment</Link>
                                                                <Link to="#!" className="p-1 px-2 bg-info-transparent rounded"><i className="ri-share-forward-line me-1"></i>Share</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer">
                                                        <ul className="list-unstyled post-comments-list">
                                                            <li>
                                                                <div className="d-flex align-items-start gap-3">
                                                                    <div className="lh-1">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face4} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill p-3 rounded bg-light">
                                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                            <div className="fw-semibold">Emily_Smith</div>
                                                                            <div className="text-muted fs-13">2 hours ago</div>
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Wow, what a peaceful view! Nature at its best &#x1F60D;.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="d-flex align-items-start gap-3">
                                                                    <div className="lh-1">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face14} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill p-3 rounded bg-light">
                                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                            <div className="fw-semibold">JohnDoe</div>
                                                                            <div className="text-muted fs-13">1 hours ago</div>
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Absolutely stunning! The colors are just perfect &#x1F305;&#x1F499;.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="d-flex align-items-center lh-1 gap-3 flex-wrap">
                                                                    <div className="">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face12} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill">
                                                                        <div className="input-group">
                                                                            <Form.Control type="text" className="" placeholder="Write a comment" aria-label="comment" />
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-primary" Buttontype="button">Post</SpkButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </Card>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-rounded avatar-md">
                                                                    <Image  src={face12} alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <span className="d-block fw-semibold">Tom Phillip</span>
                                                                <span className="text-muted fs-13">2 days ago</span>
                                                            </div>
                                                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                                                                <Dropdown.Item as="li" href="#!">Edit</Dropdown.Item>
                                                                <Dropdown.Item as="li" href="#!">Delete</Dropdown.Item>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className="my-3">Success is not final, failure is not fatal: It is the courage to continue that counts. Keep pushing forward! <Link to="#!">&#128170; #MotivationMonday</Link></div>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="avatar-list-stacked">
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face12} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face3} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face15} alt="img" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                and 2 others <i className="ri-heart-3-fill text-danger"></i> this post
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <Link to="#!" className="p-1 px-2 bg-primary-transparent rounded"><i className="ri-message-3-line me-1"></i>Comment</Link>
                                                                <Link to="#!" className="p-1 px-2 bg-info-transparent rounded"><i className="ri-share-forward-line me-1"></i>Share</Link>
                                                            </div>
                                                        </div>
                                                    </Card.Footer>
                                                    <Card.Footer>
                                                        <ul className="list-unstyled post-comments-list">
                                                            <li>
                                                                <div className="d-flex align-items-center lh-1 gap-3 flex-wrap">
                                                                    <div className="">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face12} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill">
                                                                        <div className="input-group">
                                                                            <Form.Control type="text" className="" placeholder="Write a comment" aria-label="comment" />
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-primary" Buttontype="button">Post</SpkButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </Card.Footer>
                                                </Card>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-rounded avatar-md">
                                                                    <Image  src={face12} alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <span className="d-block fw-semibold">Tom Phillip</span>
                                                                <span className="text-muted fs-13">14 hrs ago</span>
                                                            </div>
                                                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                                                                <Dropdown.Item as="li" href="#!">Edit</Dropdown.Item>
                                                                <Dropdown.Item as="li" href="#!">Delete</Dropdown.Item>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className="my-3">The serene beauty of the evening beach with the soft waves and the sky painted in shades of orange and pink is a perfect way to unwind after a long day. &#x1F305; &#127754; <Link to="#!">#BeachVibes</Link> <Link to="#!">#EveningSunset</Link> <Link to="#!">#Relaxing</Link></div>
                                                        <div className="profile-img">
                                                            <Image  src={media10} className="card-img" alt="..." />
                                                        </div>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="avatar-list-stacked">
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face13} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face3} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face4} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face14} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face5} alt="img" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                and 25 others <i className="ri-heart-3-fill text-danger"></i> this post
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <Link to="#!" className="p-1 px-2 bg-primary-transparent rounded"><i className="ri-message-3-line me-1"></i>Comment</Link>
                                                                <Link to="#!" className="p-1 px-2 bg-info-transparent rounded"><i className="ri-share-forward-line me-1"></i>Share</Link>
                                                            </div>
                                                        </div>
                                                    </Card.Footer>
                                                    <Card.Footer>
                                                        <ul className="list-unstyled post-comments-list">
                                                            <li>
                                                                <div className="d-flex align-items-start gap-3">
                                                                    <div className="lh-1">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face6} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill p-3 rounded bg-light">
                                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                            <div className="fw-semibold">Emma Watson</div>
                                                                            <div className="text-muted fs-13">2 hours ago</div>
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Such a peaceful moment at the beach! Perfect way to end the day.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="d-flex align-items-center lh-1 gap-3 flex-wrap">
                                                                    <div className="">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face12} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill">
                                                                        <div className="input-group">
                                                                            <Form.Control type="text" className="" placeholder="Write a comment" aria-label="comment" />
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-primary" Buttontype="button">Post</SpkButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={'gallery'} className="tab-pane p-0 border-0" id="gallery-tab-pane" role="tabpanel"
                                        aria-labelledby="gallery-tab" tabIndex={0}>
                                        <Row>
                                            <Col xl={12}>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <ProfileGallery />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"followers"} className="tab-pane p-0 border-0" id="followers-tab-pane" role="tabpanel"
                                        aria-labelledby="followers-tab" tabIndex={0}>
                                        <Row>
                                            {Profiles.map((idx, index) => (
                                                <Col xl={4} key={index}>
                                                    <SpkProfileCard profile={idx} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"friends"} className="tab-pane p-0 border-0" id="friends-tab-pane" role="tabpanel"
                                        aria-labelledby="friends-tab" tabIndex={0}>
                                        <Row>
                                            {FriendsList.map((idx, index) => (
                                                <Col xxl={3} xl={4} lg={6} key={index}>
                                                    <SpkFriendscard obj={idx} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Tab.Container>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

        </Fragment>

    )
};

export default ContratoDetalle;