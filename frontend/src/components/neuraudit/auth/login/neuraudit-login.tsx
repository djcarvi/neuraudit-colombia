
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Seo from "../../../../shared/layouts-components/seo/seo";
import authService from "../../../../services/neuraudit/authService";
import { Fragment, useState, useEffect } from "react"
import { Card, Col, Form, Image, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import togglelogo from '../../../../assets/images/brand-logos/toggle-logo.png';
import BG9 from '../../../../assets/images/media/backgrounds/9.png';
import media72 from '../../../../assets/images/media/media-72.png';
import facebook from '../../../../assets/images/media/apps/facebook.png';
import google from '../../../../assets/images/media/apps/google.png';
import googleSignInLight from '../../../../assets/images/google-signin/google-signin-light.svg';
import googleSignInDark from '../../../../assets/images/google-signin/google-signin-dark.svg';
interface NeurAuditLoginProps { }

const NeurAuditLogin: React.FC<NeurAuditLoginProps> = () => {

    const [values, setValues] = useState<any>({
        username: '',
        password: '',
        nit: '',  // Para usuarios PSS
        showPassword: false,
        tipoUsuario: ''  // EPS o PSS
    });
    
    const [loading, setLoading] = useState(false);
    const [showNIT, setShowNIT] = useState(false);

    const [errors, setErrors] = useState<any>({});

    const validate = () => {
        const newErrors: any = {};

        // Username validation
        if (!values.username) {
            newErrors.username = "Usuario es requerido.";
        }

        // Password validation
        if (!values.password) {
            newErrors.password = "Contraseña es requerida.";
        } else if (values.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }
        
        // NIT validation for PSS users
        if (showNIT && !values.nit) {
            newErrors.nit = "NIT es requerido para usuarios PSS.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const router = useNavigate();
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const loginData = {
                    user_type: values.tipoUsuario.toLowerCase() as 'eps' | 'pss',
                    username: values.username,
                    password: values.password,
                    ...(showNIT && { nit: values.nit })
                };
                
                const userData = await authService.login(loginData);
                
                // Guardar datos de autenticación
                authService.saveAuthData(userData, true); // true = recordarme
                
                // Login exitoso
                if (userData) {
                    toast.success('Login exitoso', {
                        position: 'top-right',
                        autoClose: 1500,
                    });
                    
                    // Redirigir según el perfil del usuario
                    const role = userData.role;
                    if (['ADMIN', 'DIRECTIVO', 'COORDINADOR_AUDITORIA'].includes(role)) {
                        router(`${import.meta.env.BASE_URL}dashboards/sales/`);
                    } else if (['AUDITOR_MEDICO', 'AUDITOR_ADMINISTRATIVO'].includes(role)) {
                        router(`${import.meta.env.BASE_URL}neuraudit/auditoria/medica`);
                    } else if (role === 'RADICADOR') {
                        router(`${import.meta.env.BASE_URL}neuraudit/radicacion/nueva`);
                    } else {
                        router(`${import.meta.env.BASE_URL}dashboards/sales/`);
                    }
                }
            } catch (error: any) {
                toast.error(error.message || 'Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleTipoUsuarioChange = (tipo: 'EPS' | 'PSS') => {
        setValues({ ...values, tipoUsuario: tipo });
        setShowNIT(tipo === 'PSS');
    };

    const handleGoogleSignIn = async () => {
        // Por ahora solo mostramos un mensaje
        // En una implementación real, aquí iría la lógica de OAuth
        toast.info('Login con Google próximamente disponible', {
            position: 'top-right',
            autoClose: 2000,
        });
    };


    return (

        <Fragment>
            <Seo title="NeurAudit Login - Sistema de Auditoría Médica" />

            <Row className="authentication authentication-cover-main mx-0">
                <Col xxl={9} xl={9}>
                    <Row className="justify-content-center align-items-center h-100">
                        <Col xxl={4} xl={5} lg={6} md={6} sm={8} className="col-12">
                            <Card className="custom-card border-0 shadow-none my-4">
                                <Card.Body className="p-5">
                                    <div>
                                        <h4 className="mb-1 fw-semibold">🏥 NeurAudit Colombia</h4>
                                        <p className="mb-4 text-muted fw-normal">Sistema de Auditoría Médica - EPS Familiar de Colombia</p>
                                        
                                        {/* Selección tipo de usuario */}
                                        <div className="d-flex gap-3 mb-4">
                                            <SpkButton 
                                                Buttonvariant={values.tipoUsuario === 'EPS' ? 'primary' : 'outline-primary'}
                                                Customclass="btn flex-fill"
                                                onClickfunc={() => handleTipoUsuarioChange('EPS')}
                                            >
                                                Usuario EPS
                                            </SpkButton>
                                            <SpkButton 
                                                Buttonvariant={values.tipoUsuario === 'PSS' ? 'primary' : 'outline-primary'}
                                                Customclass="btn flex-fill"
                                                onClickfunc={() => handleTipoUsuarioChange('PSS')}
                                            >
                                                Prestador PSS/PTS
                                            </SpkButton>
                                        </div>
                                    </div>
                                    <Form onSubmit={handleSubmit}>
                                        <Row className=" gy-3">
                                            <Col xl={12}>
                                                {/* Campo NIT para PSS */}
                                                {showNIT && (
                                                    <>
                                                        <Form.Label htmlFor="signin-nit" className="text-default">NIT</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control mb-3"
                                                            id="signin-nit"
                                                            placeholder="Ingrese NIT del prestador"
                                                            value={values.nit}
                                                            onChange={(e) => setValues({ ...values, nit: e.target.value })}
                                                            isInvalid={!!errors.nit}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.nit}</Form.Control.Feedback>
                                                    </>
                                                )}
                                                
                                                <Form.Label htmlFor="signin-username" className="text-default">Usuario</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className="form-control"
                                                    id="signin-username"
                                                    placeholder="Ingrese su usuario"
                                                    value={values.username}
                                                    onChange={(e) => setValues({ ...values, username: e.target.value })}
                                                    isInvalid={!!errors.username}
                                                    disabled={!values.tipoUsuario}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                            </Col>
                                            <Col xl={12} className="mb-2">
                                                <Form.Label htmlFor="signin-password" className="text-default d-block">Contraseña</Form.Label>
                                                <div className="position-relative">
                                                    <Form.Control
                                                        type={values.showPassword ? "text" : "password"}
                                                        className="form-control "
                                                        id="signup-password"
                                                        placeholder="Ingrese su contraseña"
                                                        value={values.password}
                                                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                                                        isInvalid={!!errors.password}
                                                    />
                                                    <Link to="#!" className="show-password-button text-muted"
                                                        onClick={() => setValues((prev: any) => ({ ...prev, showPassword: !prev.showPassword }))}>
                                                        {values.showPassword ? (
                                                            <i className="ri-eye-line align-middle"></i>
                                                        ) : (
                                                            <i className="ri-eye-off-line align-middle"></i>
                                                        )}
                                                    </Link>
                                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" defaultChecked />
                                                            <label className="form-check-label" htmlFor="defaultCheck1">
                                                                Recordarme
                                                            </label>
                                                        </div>
                                                        <Link to={`${import.meta.env.BASE_URL}neuraudit/auth/reset-password`} className="link-danger fw-medium fs-12">¿Olvidó su contraseña?</Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="d-grid mt-3">
                                            <SpkButton 
                                            Buttontype="submit" 
                                            Customclass="btn btn-primary"
                                            disabled={loading || !values.tipoUsuario}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Iniciando sesión...
                                                </>
                                            ) : (
                                                'Iniciar Sesión'
                                            )}
                                        </SpkButton>
                                        </div>
                                    </Form>
                                    <div className="text-center my-3 authentication-barrier">
                                        <span className="op-4 fs-13">OR</span>
                                    </div>
                                    <div className="d-grid mb-3">
                                        <div 
                                            onClick={handleGoogleSignIn}
                                            style={{ cursor: 'pointer' }}
                                            className="mb-3"
                                        >
                                            <Image 
                                                src={googleSignInLight} 
                                                alt="Iniciar sesión con Google" 
                                                className="img-fluid mx-auto d-block"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </div>
                                        <SpkButton Customclass="btn btn-white btn-w-lg border d-flex align-items-center justify-content-center flex-fill">
                                            <span className="avatar avatar-xs">
                                                <Image  src={facebook} alt="" />
                                            </span>
                                            <span className="lh-1 ms-2 fs-13 text-default fw-medium">Iniciar con Microsoft</span>
                                        </SpkButton>
                                    </div>
                                    <div className="text-center mt-3 fw-medium">
                                        ¿No tiene cuenta? <Link to={`${import.meta.env.BASE_URL}neuraudit/auth/register`} className="text-primary">Solicitar Acceso</Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3} xl={3} lg={12} className="d-xl-block d-none px-0">
                    <div className="authentication-cover overflow-hidden">
                        <div className="authentication-cover-logo">
                            <Link to={`${import.meta.env.BASE_URL}dashboards/sales`}>
                                <Image  src={togglelogo} alt="logo" className="desktop-dark" />
                            </Link>
                        </div>
                        <div className="authentication-cover-background">
                            <Image  src={BG9} alt="" />
                        </div>
                        <div className="authentication-cover-content">
                            <div className="p-5">
                                <h3 className="fw-semibold lh-base">Sistema de Auditoría Médica</h3>
                                <p className="mb-0 text-muted fw-medium">Plataforma integral para radicación, auditoría, glosas y conciliación de cuentas médicas según Resolución 2284 de 2023.</p>
                            </div>
                            <div>
                                <Image  src={media72} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}
export default NeurAuditLogin;