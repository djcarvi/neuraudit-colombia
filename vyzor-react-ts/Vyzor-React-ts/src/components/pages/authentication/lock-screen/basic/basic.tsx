
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import togglelogo from '../../../../../assets/images/brand-logos/toggle-logo.png';
import BG9 from '../../../../../assets/images/media/backgrounds/9.png';
import face12 from '../../../../../assets/images/faces/12.jpg';

interface BasicProps { }

const Basic: React.FC<BasicProps> = () => {

    const [formData, setFormData] = useState<any>({
        password: ''
    });

    const [formErrors, setFormErrors] = useState<any>({});
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        passwords: false,
    });

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prev:any) => ({ ...prev, [id]: value }));
        setFormErrors((prev:any) => ({ ...prev, [id]: '' }));
    };

    const togglePasswordVisibility = (field: any) => {
        setPasswordVisibility((prev:any) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validate = () => {
        const errors:any = {};

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
        }
    };

    return (

        <Fragment>

            <Seo title="Lockscreen-Basic" />

            <div className="authentication-basic-background">
                <Image  src={BG9} alt="" />
            </div>

            <div className="container">
                <Row className="justify-content-center align-items-center authentication authentication-basic h-100">
                    <Col xxl={4} xl={5} lg={6} md={6} sm={8} className="col-12">
                        <Card className="custom-card border-0 my-4">
                            <Card.Body className="p-5">
                                <div className="mb-4">
                                    <Link to={`${import.meta.env.BASE_URL}dashboards/sales`}>
                                        <Image  src={togglelogo} alt="logo" className="desktop-dark" />
                                    </Link>
                                </div>
                                <p className="h4 mb-2 fw-semibold">Hello Tom Phillip</p>
                                <p className="mb-3 text-muted fw-normal">Welcome Back</p>
                                <div className="d-flex gap-2 align-items-center mb-3">
                                    <div className="lh-1">
                                        <span className="avatar avatar-sm avatar-rounded">
                                            <Image src={face12} alt="" />
                                        </span>
                                    </div>
                                    <div>
                                        <p className="mb-0 text-dark fw-medium">tomphillip32@gmail.com</p>
                                    </div>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                <Row className="gy-3">
                                    <Col xl={12} className="mb-2">
                                        <label htmlFor="lockscreen-password" className="form-label text-default">Password</label>
                                        <div className="position-relative custom-auth">
                                            <Form.Control
                                                type={passwordVisibility.password ? 'text' : 'password'}
                                                className="form-control form-control-lg"
                                                id="password"
                                                placeholder="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <Link onClick={() => togglePasswordVisibility('password')} to="#!" className="show-password-button text-muted" id="button-addon2"><i className={`align-middle ${passwordVisibility.password ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i></Link>
                                        </div>
                                        {formErrors.password && (
                                            <p className="text-danger text-xs mt-1">{formErrors.password}</p>
                                        )}
                                    </Col>
                                    <Col xl={12} className="d-grid mt-2">
                                    <SpkButton Buttontype="submit" Customclass="btn btn-lg btn-primary">Unlock</SpkButton>
                                    </Col>
                                </Row>
                                </Form>
                                <div className="text-center">
                                    <p className="fw-medium mt-3 mb-0">Try unlock with <Link  className="text-success" to="#!"><u>Finger print</u></Link> / <Link  className="text-success" to="#!"><u>Face Id</u></Link></p>
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