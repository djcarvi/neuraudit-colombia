import React, { Fragment } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pageheader from '../../../shared/layouts-components/pageheader/pageheader'
import Seo from '../../../shared/layouts-components/seo/seo'

const Support = () => {
    return (
        <Fragment>
            <Seo title="Centro de Soporte" />
            <Pageheader title="Soporte" currentpage="Centro de Soporte" activepage="Soporte" />
            
            <Row>
                <Col xl={12}>
                    <div className="text-center mb-4">
                        <h2 className="fw-semibold mb-2">¿Cómo podemos ayudarte?</h2>
                        <p className="text-muted">Centro de Soporte - Sistema Neuralytic</p>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center mb-5">
                <Col xl={8}>
                    <Card className="custom-card">
                        <Card.Body className="p-5">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    placeholder="Buscar en el centro de ayuda..."
                                    aria-label="Buscar ayuda"
                                />
                                <button className="btn btn-primary" type="button">
                                    <i className="ti ti-search"></i> Buscar
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xl={10}>
                    <Row>
                        <Col xl={4} lg={6} md={6} sm={12} className="mb-4">
                            <Card className="custom-card text-center">
                                <Card.Body>
                                    <div className="mb-3">
                                        <span className="avatar avatar-xl bg-primary-transparent">
                                            <i className="ti ti-book fs-2"></i>
                                        </span>
                                    </div>
                                    <h5 className="fw-semibold mb-2">Documentación</h5>
                                    <p className="text-muted mb-3">Guías completas y manuales del sistema</p>
                                    <Link to="#!" className="btn btn-sm btn-primary">Ver Documentación</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col xl={4} lg={6} md={6} sm={12} className="mb-4">
                            <Card className="custom-card text-center">
                                <Card.Body>
                                    <div className="mb-3">
                                        <span className="avatar avatar-xl bg-secondary-transparent">
                                            <i className="ti ti-video fs-2"></i>
                                        </span>
                                    </div>
                                    <h5 className="fw-semibold mb-2">Video Tutoriales</h5>
                                    <p className="text-muted mb-3">Aprende a usar el sistema paso a paso</p>
                                    <Link to="#!" className="btn btn-sm btn-secondary">Ver Tutoriales</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col xl={4} lg={6} md={6} sm={12} className="mb-4">
                            <Card className="custom-card text-center">
                                <Card.Body>
                                    <div className="mb-3">
                                        <span className="avatar avatar-xl bg-success-transparent">
                                            <i className="ti ti-headset fs-2"></i>
                                        </span>
                                    </div>
                                    <h5 className="fw-semibold mb-2">Soporte Técnico</h5>
                                    <p className="text-muted mb-3">Contacta con nuestro equipo de soporte</p>
                                    <Link to="#!" className="btn btn-sm btn-success">Contactar Soporte</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="justify-content-center mt-5">
                <Col xl={8}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Preguntas Frecuentes</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="accordion" id="accordionFAQ">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true">
                                            ¿Cómo radico una factura médica?
                                        </button>
                                    </h2>
                                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#accordionFAQ">
                                        <div className="accordion-body">
                                            Para radicar una factura médica, dirígete al módulo de Radicación, selecciona "Nueva Radicación" y sigue los pasos del formulario. Asegúrate de tener todos los documentos requeridos en formato PDF o XML según corresponda.
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false">
                                            ¿Cuáles son los plazos para responder glosas?
                                        </button>
                                    </h2>
                                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                                        <div className="accordion-body">
                                            Según la normativa vigente, tienes 5 días hábiles para responder a las glosas aplicadas. El sistema te notificará automáticamente cuando tengas glosas pendientes de respuesta.
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="false">
                                            ¿Cómo actualizo mi información de perfil?
                                        </button>
                                    </h2>
                                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                                        <div className="accordion-body">
                                            Ve a tu perfil haciendo clic en tu nombre en la esquina superior derecha, selecciona "Mi Perfil" o "Configuración de Cuenta" y podrás actualizar tu información personal, contraseña y preferencias.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center mt-5">
                <Col xl={8}>
                    <Card className="custom-card bg-primary text-white">
                        <Card.Body className="text-center p-5">
                            <h4 className="fw-semibold mb-2">¿No encuentras lo que buscas?</h4>
                            <p className="mb-4 op-8">Nuestro equipo de soporte está aquí para ayudarte</p>
                            <div className="d-flex gap-2 justify-content-center">
                                <Link to="mailto:soporte@neuralytic.co" className="btn btn-light">
                                    <i className="ti ti-mail me-2"></i>soporte@neuralytic.co
                                </Link>
                                <Link to="tel:+576018000123" className="btn btn-light">
                                    <i className="ti ti-phone me-2"></i>(601) 800-0123
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Support