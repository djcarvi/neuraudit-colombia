
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import { Fragment, useState } from "react"
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import togglelogo from '../../../../../assets/images/brand-logos/toggle-logo.png';
import BG9 from '../../../../../assets/images/media/backgrounds/9.png';
import facebook from '../../../../../assets/images/media/apps/facebook.png';
import google from '../../../../../assets/images/media/apps/google.png';
import media72 from '../../../../../assets/images/media/media-72.png';
interface CoverProps { }

const Cover: React.FC<CoverProps> = () => {

 const [formData, setFormData] = useState({
         password: '',
         confirmPassword: '',
     });
 
     const [formErrors, setFormErrors] = useState<any>({});
     const [passwordVisibility, setPasswordVisibility] = useState<any>({
         password: false,
         passwords: false,
     });
 
     const handleChange = (e: any) => {
         const { id, value } = e.target;
         setFormData((prev) => ({ ...prev, [id]: value }));
         setFormErrors((prev: any) => ({ ...prev, [id]: '' }));
     };
 
     const togglePasswordVisibility = (field: any) => {
         setPasswordVisibility((prev: any) => ({
             ...prev,
             [field]: !prev[field],
         }));
     };
 
     const validate = () => {
         const errors: any = {};
 
         if (!formData.password || formData.password.length < 6) {
             errors.password = 'Password must be at least 6 characters';
         }
 
         if (formData.confirmPassword !== formData.password) {
             errors.confirmPassword = 'Passwords do not match';
         }
 
         setFormErrors(errors);
         return Object.keys(errors).length === 0;
     };
     const router = useNavigate()
     const handleSubmit = (e: any) => {
         e.preventDefault();
         if (validate()) {
            router(`${import.meta.env.BASE_URL}dashboards/sales/`);
             toast.success('Create Password successful', {
                 position: 'top-right',
                 autoClose: 1500,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
             });
         }
     };
 

    return (
        <Fragment>

            <Seo title="Createpassword-Cover" />

            <Row className="authentication authentication-cover-main mx-0">
                <Col xxl={9} xl={9} className="">
                    <Row className="justify-content-center align-items-center h-100">
                        <Col xxl={4} xl={5} lg={6} md={6} sm={8} className="col-12">
                            <Card className="custom-card border-0 shadow-none my-4">
                                <Card.Body className="p-5">
                                    <div>
                                        <h4 className="mb-1 fw-semibold">Create Password</h4>
                                        <p className="mb-4 text-muted fw-normal text-nowrap">Set your new password</p>
                                    </div>
                                       <Form onSubmit={handleSubmit}>
                                    <Row className=" gy-3">
                                        <Col xl={12} className="">
                                            <Form.Label htmlFor="create-password" className="text-default">Password</Form.Label>
                                            <div className="position-relative custom-auth">
                                                <Form.Control
                                                    type={passwordVisibility.password ? 'text' : 'password'}
                                                    className="form-control form-control-lg"
                                                    id="password"
                                                    placeholder="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <Link to="#!" onClick={() => togglePasswordVisibility('password')} className="show-password-button text-muted"><i className={`align-middle ${passwordVisibility.password ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i></Link>
                                            </div>
                                            {formErrors.password && (
                                                <p className="text-danger text-xs mt-1">{formErrors.password}</p>
                                            )}
                                        </Col>
                                        <Col xl={12} className="custom-auth">
                                            <Form.Label htmlFor="create-confirmpassword" className="text-default">Confirm Password</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={passwordVisibility.passwords ? 'text' : 'password'}
                                                    className="form-control form-control-lg"
                                                    id="confirmPassword"
                                                    placeholder="confirm password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                                <Link onClick={() => togglePasswordVisibility('passwords')} to="#!" className="show-password-button text-muted"><i className={`${passwordVisibility.passwords ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i></Link>
                                            </div>
                                            {formErrors.confirmPassword && (
                                                <p className="text-danger text-xs mt-1">{formErrors.confirmPassword}</p>
                                            )}
                                            <div className="mt-2">
                                                <div className="form-check mb-0">
                                                    <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" defaultChecked />
                                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                                        Remember password ?
                                                    </label>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="d-grid mt-3">
                                    <SpkButton Buttontype="submit" Customclass="btn btn-primary">Create Password</SpkButton>
                                    </div>
                                    </Form>
                                    <div className="text-center my-3 authentication-barrier">
                                        <span className="op-4 fs-13">OR</span>
                                    </div>
                                    <div className="d-grid mb-3">
                                        <SpkButton Customclass="btn btn-white btn-w-lg border d-flex align-items-center justify-content-center flex-fill mb-3">
                                            <span className="avatar avatar-xs">
                                                <Image  src={google} alt="" />
                                            </span>
                                            <span className="lh-1 ms-2 fs-13 text-default fw-medium">Signup with Google</span>
                                        </SpkButton>
                                        <SpkButton Customclass="btn btn-white btn-w-lg border d-flex align-items-center justify-content-center flex-fill">
                                            <span className="avatar avatar-xs">
                                                <Image  src={facebook} alt="" />
                                            </span>
                                            <span className="lh-1 ms-2 fs-13 text-default fw-medium">Signup with Facebook</span>
                                        </SpkButton>
                                    </div>
                                    <div className="text-center mt-3 fw-medium">
                                        Dont have an account? <Link to={`${import.meta.env.BASE_URL}pages/authentication/sign-up/basic`} className="text-primary">Sign Up</Link>
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
                                <h3 className="fw-semibold lh-base">Welcome to Dashboard</h3>
                                <p className="mb-0 text-muted fw-medium">Manage your website and content with ease using our powerful admin tools.</p>
                            </div>
                            <div>
                                <Image  src={media72} alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <ToastContainer />
        </Fragment>
    )
}

export default Cover;