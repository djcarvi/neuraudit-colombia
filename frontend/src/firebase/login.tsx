import { Fragment, useState,useEffect } from 'react';
import {  Card, Col, Form, Image, Row, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo1 from "../assets/images/brand-logos/toggle-logo.png";
import logoEpsFamiliar from "../assets/images/brand-logos/logo_epsfamiliar.png";
import logoAnalitica from "../assets/images/brand-logos/logo_analiticaneuronal.png";
import google from '../assets/images/media/apps/google.png';
import googleSignInLight from '../assets/images/google-signin/google-signin-light.svg';
import BG9 from '../assets/images/media/backgrounds/9.png';
import { auth } from './auth';
import authService from '../services/neuraudit/authService';
import googleAuthService from '../services/neuraudit/googleAuthService';
import SpkButton from '../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons';
import Seo from '../shared/layouts-components/seo/seo';
import ParticleCard from '../shared/data/authentication/particles';
import SpkAlerts from '../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-alerts';
import { toast, ToastContainer } from 'react-toastify';

interface ComponentProps { }

const Signin: React.FC<ComponentProps> = () => {


  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});

  const togglePasswordVisibility = (field: string) => {
      setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [err, setError] = useState("");
  const [err1, setError1] = useState("");
  const [data, setData] = useState({
      "email": "adminnextjs@gmail.com",
      "password": "1234567890",
      "userType": "eps",
      "nit": "",
      "username": ""
  });
  const { email, password, userType, nit, username } = data;
  const changeHandler = (e:any) => {
      setData({ ...data, [e.target.name]: e.target.value });
      setError("");
  };
  const [loading, setLoading] = useState(false);

  const Login = async (e:any) => {
      e.preventDefault();
      setLoading(true);

      try {
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          console.log(userCredential.user);
          
          toast.success('Login successful', {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              RouteChange();
            }, 1200);
      } catch (err:any) {
          setError(err.message);
          // Show error message
          toast.error('Invalid details', {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
      } finally {
          setLoading(false);
      }
  };
  const [loading1, setLoading1] = useState(false);

  const Login1 = async (_e:any) => {
      _e.preventDefault();
      setLoading1(true);
      
      try {
          const loginData = {
              user_type: userType,
              username: username || email.split('@')[0], // Use username or extract from email
              password: password,
              ...(userType === 'pss' && { nit: nit })
          };

          const userData = await authService.login(loginData);
          authService.saveAuthData(userData, true);
          
          toast.success('Inicio de sesión exitoso', {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
        setTimeout(() => {
          RouteChange(); // Navigate after toast delay
        }, 2000);
          
      } catch (error: any) {
          setError1(error.message || "Error de conexión");
          toast.error(error.message || 'Error de conexión', {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
      }

      setLoading1(false);
  };


  const router = useNavigate();
  const RouteChange = () => {
    // Obtener el usuario actual para determinar la ruta según el rol
    const user = authService.getCurrentUser();
    let path = `${import.meta.env.BASE_URL}dashboards/sales/`;
    
    if (user && user.role) {
      switch (user.role) {
        case 'SUPERADMIN':
        case 'DIRECTIVO':
        case 'COORDINADOR_AUDITORIA':
          path = `${import.meta.env.BASE_URL}dashboards/sales/`;
          break;
        case 'AUDITOR_MEDICO':
        case 'AUDITOR_ADMINISTRATIVO':
          path = `${import.meta.env.BASE_URL}neuraudit/auditoria/medica`;
          break;
        case 'RADICADOR':
          path = `${import.meta.env.BASE_URL}neuraudit/radicacion/nueva`;
          break;
        default:
          path = `${import.meta.env.BASE_URL}dashboards/sales/`;
      }
    }
    
    router(path);
  };

  const handleGoogleSignIn = async (response: any) => {
    console.log('Respuesta de Google en login:', response);
    try {
      setLoading(true);
      const userData = await googleAuthService.handleCredentialResponse(response);
      
      if (userData) {
        toast.success('Login con Google exitoso', {
          position: 'top-right',
          autoClose: 1500,
        });
        
        setTimeout(() => {
          RouteChange();
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión con Google', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const body = document.body
    body.classList.add("authentication-background");
    
    // Inicializar Google Sign-In
    const initGoogleSignIn = async () => {
      await googleAuthService.initialize();
      const googleButton = document.getElementById('google-signin-button');
      if (googleButton) {
        await googleAuthService.renderButton(googleButton, handleGoogleSignIn);
      }
    };
    
    initGoogleSignIn();
    
    return () => {
      body.classList.remove("authentication-background");
    };
  }, []);
  return (
    <Fragment>
      <Seo title={"NeurAudit - Login"} />
      <div className="authentication-basic-background">
        <Image src={BG9} alt="" />
      </div>
      <ParticleCard />
      <div className="container">
        <Row className="justify-content-center align-items-center authentication authentication-basic h-100">
          <Col xxl={4} xl={5} lg={6} md={6} sm={8} className="col-12">
              <Card className="custom-card border-0 my-4">
                    <Card.Body className="p-sm-5 p-4">
                      <div className="mb-4">
                        {err1 &&
                          <SpkAlerts variant="danger">{err1}</SpkAlerts>
                        }
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <Image src={logoEpsFamiliar} alt="EPS Familiar de Colombia" height="50" />
                          <div className="vr" style={{ height: '50px' }}></div>
                          <Image src={logoAnalitica} alt="Analítica Neuronal" height="50" />
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-1 fw-semibold">Neuralytic</h4>
                        <p className="mb-4 text-muted fw-normal">Sistema de Auditoría Médica</p>
                      </div>
                      <div className="row gy-3">
                        <Col xl={12}>
                          <label className="form-label text-default fw-semibold">Tipo de Usuario</label>
                          <ButtonGroup className="w-100">
                            <input 
                              type="radio" 
                              className="btn-check" 
                              name="userType" 
                              id="eps-user" 
                              value="eps" 
                              checked={userType === 'eps'}
                              onChange={changeHandler}
                            />
                            <label className="btn btn-outline-primary" htmlFor="eps-user">
                              EPS Familiar
                            </label>
                            
                            <input 
                              type="radio" 
                              className="btn-check" 
                              name="userType2" 
                              id="pss-user" 
                              value="pss"
                              checked={userType === 'pss'}
                              onChange={(e) => setData({ ...data, userType: e.target.value })}
                            />
                            <label className="btn btn-outline-primary" htmlFor="pss-user">
                              Prestador (PSS)
                            </label>
                          </ButtonGroup>
                        </Col>
                        {userType === 'pss' && (
                          <Col xl={12}>
                            <label htmlFor="nit" className="form-label text-default">NIT del Prestador</label>
                            <div className="input-group">
                              <div className="input-group-text">
                                <i className="ri-building-line text-muted"></i>
                              </div>
                              <Form.Control
                                type="text"
                                name="nit"
                                id="nit"
                                placeholder="123456789-0"
                                value={nit}
                                onChange={changeHandler}
                              />
                            </div>
                          </Col>
                        )}
                        <Col xl={12}>
                          <label htmlFor="signin-email" className="form-label text-default">
                            {userType === 'pss' ? 'Usuario PSS' : 'Usuario EPS'}
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <i className="ri-user-line text-muted"></i>
                            </div>
                            <Form.Control 
                              type="text" 
                              name="username" 
                              className="signin-email-input" 
                              id="username" 
                              placeholder={userType === 'pss' ? 'usuario.pss' : 'usuario.eps'}
                              value={username}
                              onChange={changeHandler}
                            />
                          </div>
                        </Col>
                        <Col xl={12} className="mb-2">
                          <label htmlFor="signin-password" className="form-label text-default d-block">Contraseña</label>
                          <div className="position-relative">
                            <Form.Control name="password" type={passwordVisibility.password ? 'text' : 'password'} value={password}
                                onChange={changeHandler} className="create-password-input" id="signin-password" placeholder="Contraseña" />
                              <Link to="#!" onClick={() => togglePasswordVisibility('password')} className="show-password-button text-muted" id="button-addon2">
                                <i className={`${passwordVisibility.password ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i></Link>
                          </div>
                          <div className="mt-2">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" defaultChecked />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Recordar mi sesión
                              </label>
                              <Link to={`${import.meta.env.BASE_URL}pages/authentication/reset-password/basic`} className="float-end link-danger fw-medium fs-12">¿Olvidaste tu contraseña?</Link>
                            </div>
                          </div>
                        </Col>
                      </div>
                      <div className="d-grid mt-3">
                        <button onClick={Login1} className={`btn btn-primary ${loading1 ? 'disabled' : ''}`}>
                          <i className="ri-login-circle-line me-2"></i> Iniciar Sesión
                          {loading1 && <i className="fa fa-spinner fa-spin me-2 ms-2"></i>}
                        </button>
                      </div>
                      <div className="text-center my-3 authentication-barrier">
                        <span className="op-4 fs-13">OR</span>
                      </div>
                      <div className="d-grid mb-3">
                        <div 
                          id="google-signin-button"
                          className="d-flex justify-content-center"
                          style={{ minHeight: '44px' }}
                        >
                          {/* El botón de Google se renderizará aquí */}
                        </div>
                      </div>
                      <div className="text-center mt-3 fw-medium">
                        Sistema desarrollado por <strong>Analítica Neuronal</strong> para <strong>EPS Familiar de Colombia</strong>
                      </div>
                    </Card.Body>
              </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default Signin;