
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import togglelogo from '../../../../../assets/images/brand-logos/toggle-logo.png';
import BG9 from '../../../../../assets/images/media/backgrounds/9.png';
import facebook from '../../../../../assets/images/media/apps/facebook.png';
import google from '../../../../../assets/images/media/apps/google.png';

interface BasicProps { }

const Basic: React.FC<BasicProps> = () => {

    const [values, setValues] = useState<any>({
        email: '',
        password: '',
        showPassword: false
    });

    const [errors, setErrors] = useState<any>({});

    const validate = () => {
        const newErrors: any = {};

        // Email validation
        if (!values.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = "Invalid email format.";
        }

        // Password validation
        if (!values.password) {
            newErrors.password = "Password is required.";
        } else if (values.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const router = useNavigate()
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (validate()) {
            router(`${import.meta.env.BASE_URL}dashboards/sales/`);
            toast.success('Login successful', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Handle form submission logic here
        }
    };


    return (

        <Fragment>

            <Seo title="Signin-Basic" />

            <div className="authentication-basic-background">
                <Image  src={BG9} alt="" />
            </div>
            <div className="container">
                <Row className="justify-content-center align-items-center authentication authentication-basic h-100">
                    <Col xxl={4} xl={5} lg={6} md={6} sm={8} className="col-12">
                        <Card className="custom-card border-0 my-4">
                            <Card.Body className="p-5 custom-sign">
                                <div className="mb-4">
                                    <Link to={`${import.meta.env.BASE_URL}dashboards/sales`}>
                                        <Image  src={togglelogo} alt="logo" className="desktop-dark" />
                                    </Link>
                                </div>
                                <div>
                                    <h4 className="mb-1 fw-semibold">Hi,Welcome back!</h4>
                                    <p className="mb-4 text-muted fw-normal text-nowrap">Please enter your credentials</p>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <div className="row gy-3">
                                        <Col xl={12}>
                                            <Form.Label htmlFor="signin-email" className="text-default">Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                className="form-control "
                                                id="signup-firstname"
                                                placeholder="Enter Email ID"
                                                value={values.email}
                                                onChange={(e) => setValues({ ...values, email: e.target.value })}
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Col>
                                        <Col xl={12} className="mb-2">
                                            <Form.Label htmlFor="signin-password" className="text-default d-block">Password</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={values.showPassword ? "text" : "password"}
                                                    className="form-control "
                                                    id="signup-password"
                                                    placeholder="Password"
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
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" defaultChecked />
                                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                                        Remember me
                                                    </label>
                                                    <Link to={`${import.meta.env.BASE_URL}pages/authentication/reset-password/basic/`} className="float-end link-danger fw-medium fs-12">Forget password ?</Link>
                                                </div>
                                            </div>
                                        </Col>
                                    </div>
                                    <div className="d-grid mt-3">
                                        <SpkButton Buttontype="submit" Customclass="btn btn-primary">Sign In</SpkButton>
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
                                            <Image src={facebook} alt="" />
                                        </span>
                                        <span className="lh-1 ms-2 fs-13 text-default fw-medium">Signup with Facebook</span>
                                    </SpkButton>
                                </div>
                                <div className="text-center mt-3 fw-medium">
                                    Dont have an account? <Link to={`${import.meta.env.BASE_URL}pages/authentication/sign-up/basic/`} className="text-primary">Sign Up</Link>
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