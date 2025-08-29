import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logoEpsFamiliar from "../../../../../assets/images/brand-logos/logo_epsfamiliar.png";
import logoAnalitica from "../../../../../assets/images/brand-logos/logo_analiticaneuronal.png";
import BG9 from '../../../../../assets/images/media/backgrounds/9.png';

interface BasicProps { }

const Basic: React.FC<BasicProps> = () => {

    const [values, setValues] = useState<any>({
        email: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: any = {};

        // Email validation
        if (!values.email) {
            newErrors.email = "El correo electrónico es requerido.";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = "Formato de correo electrónico inválido.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const router = useNavigate()
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            // Aquí iría la lógica para enviar el email de recuperación
            setTimeout(() => {
                toast.success('Se ha enviado un correo electrónico con las instrucciones para recuperar tu contraseña', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setLoading(false);
                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    router(`${import.meta.env.BASE_URL}firebase/login/`);
                }, 3000);
            }, 1500);
        }
    };

    return (
        <Fragment>
            <Seo title="Recuperar Contraseña - Neuralytic" />

            <div className="authentication-basic-background">
                <Image src={BG9} alt="" />
            </div>
            
            <div className="container">
                <Row className="justify-content-center align-items-center authentication authentication-basic h-100">
                    <Col xxl={4} xl={5} lg={6} md={6} sm={8} className="col-12">
                        <Card className="custom-card border-0 my-4">
                            <Card.Body className="p-5 custom-sign">
                                <div className="mb-4">
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <Image src={logoEpsFamiliar} alt="EPS Familiar de Colombia" height="50" />
                                        <div className="vr" style={{ height: '50px' }}></div>
                                        <Image src={logoAnalitica} alt="Analítica Neuronal" height="50" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-1 fw-semibold">Recuperar Contraseña</h4>
                                    <p className="mb-4 text-muted fw-normal">Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.</p>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <div className="row gy-3">
                                        <Col xl={12}>
                                            <Form.Label htmlFor="reset-email" className="text-default">Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                className="form-control"
                                                id="reset-email"
                                                placeholder="correo@ejemplo.com"
                                                value={values.email}
                                                onChange={(e) => setValues({ ...values, email: e.target.value })}
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Col>
                                    </div>
                                    <div className="d-grid mt-3">
                                        <SpkButton 
                                            Buttontype="submit" 
                                            Customclass={`btn btn-primary ${loading ? 'disabled' : ''}`}
                                            disabled={loading}
                                        >
                                            <i className="ri-mail-send-line me-2"></i>
                                            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                                            {loading && <i className="fa fa-spinner fa-spin ms-2"></i>}
                                        </SpkButton>
                                    </div>
                                </Form>
                                <div className="text-center mt-4 fw-medium">
                                    ¿Recordaste tu contraseña? <Link to={`${import.meta.env.BASE_URL}firebase/login/`} className="text-primary">Volver al Login</Link>
                                </div>
                                <div className="text-center mt-3 fw-medium">
                                    Sistema desarrollado por <strong>Analítica Neuronal</strong> para <strong>EPS Familiar de Colombia</strong>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <ToastContainer />
            </div>
        </Fragment>
    )
};

export default Basic;