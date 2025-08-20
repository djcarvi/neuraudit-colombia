
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useRef, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import togglelogo from '../../../../../assets/images/brand-logos/toggle-logo.png';
import BG9 from '../../../../../assets/images/media/backgrounds/9.png';
interface BasicProps { }

const Basic: React.FC<BasicProps> = () => {

    const [inputValues, setInputValues] = useState({
        one: '',
        two: '',
        three: '',
        four: '',
    });

    const [error, setError] = useState('');

    const inputsRef:any = {
        one: useRef(null),
        two: useRef(null),
        three: useRef(null),
        four: useRef(null),
    };

    const handleChange = (
        current:any,
        next:any,
        value:any
    ) => {
        if (!/^\d?$/.test(value)) return; // Only allow one digit

        const updatedValues:any = { ...inputValues, [current]: value };
        setInputValues(updatedValues);

        if (value && next && inputsRef[next].current) {
            inputsRef[next].current?.focus();
        }
    };

    const handlePaste = (e:any) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);

        if (paste.length === 4) {
            setInputValues({
                one: paste[0],
                two: paste[1],
                three: paste[2],
                four: paste[3],
            });

            inputsRef.four.current?.focus();
        }

        e.preventDefault();
    };
    const router = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();

        const { one, two, three, four } = inputValues;

        if (!one || !two || !three || !four) {
            setError('All fields are required.');
            return;
        }

        const fullOTP = `${one}${two}${three}${four}`;
        router(`${import.meta.env.BASE_URL}dashboards/sales/`);
        toast.success('Verify Your Account successful', {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        console.log('Submitted OTP:', fullOTP);

        setError('');

        // TODO: Call your backend API with OTP
    };
    return (
        <Fragment>
            <Seo title="Twostep-Basic" />

            <div className="authentication-basic-background">
                <Image  src={BG9} alt="" />
            </div>
            <div className="container">
                <Row className="justify-content-center align-items-center authentication authentication-basic h-100">
                    <Col xxl={4} xl={5} lg={6} md={8} sm={12} className="col-12">
                        <Card className="custom-card border-0 my-4">
                            <Card.Body className="p-sm-5">
                                <div className="mb-4">
                                    <Link to={`${import.meta.env.BASE_URL}dashboards/sales`}>
                                        <Image  src={togglelogo} alt="logo" className="desktop-dark" />
                                    </Link>
                                </div>
                                <p className="h4 mb-2 fw-semibold">Verify Your Account</p>
                                <p className="mb-4 text-muted fw-normal text-nowrap two-step-verification">Enter the 4 digit code sent to the registered email Id.</p>
                                <Form onSubmit={handleSubmit} >
                                    <Row className=" gy-3">
                                        <Col xl={12} className="mb-2">
                                            <Row className="">
                                                <Col className="col-3">
                                                    <Form.Control id="one"
                                                        ref={inputsRef.one}
                                                        type="text"
                                                        maxLength={1}
                                                        value={inputValues.one}
                                                        onChange={(e) => handleChange('one', 'two', e.target.value)}
                                                        onPaste={handlePaste}
                                                        className="form-control-lg text-center  "
                                                    />
                                                </Col>
                                                <Col className="col-3">
                                                    <Form.Control id="two"
                                                        ref={inputsRef.two}
                                                        type="text"
                                                        maxLength={1}
                                                        value={inputValues.two}
                                                        onChange={(e) => handleChange('two', 'three', e.target.value)}
                                                        className="form-control-lg text-center "
                                                    />
                                                </Col>
                                                <Col className="col-3">
                                                    <Form.Control id="three"
                                                        ref={inputsRef.three}
                                                        type="text"
                                                        maxLength={1}
                                                        value={inputValues.three}
                                                        onChange={(e) => handleChange('three', 'four', e.target.value)}
                                                        className="form-control-lg text-center  "
                                                    />
                                                </Col>
                                                <Col className="col-3">
                                                    <Form.Control id="four"
                                                        ref={inputsRef.four}
                                                        type="text"
                                                        maxLength={1}
                                                        value={inputValues.four}
                                                        onChange={(e) => handleChange('four', null, e.target.value)}
                                                        className="form-control-lg text-center"
                                                    />
                                                </Col>
                                            </Row>
                                            <div className="form-check mt-3">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Did not recieve a code ?<Link to={`${import.meta.env.BASE_URL}applications/email/mail-app`} className="text-primary ms-2 d-inline-block fw-medium">Resend</Link>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={12} className="d-grid mt-3">
                                            {error && <p className="text-danger text-sm text-center mb-2">{error}</p>}
                                            <SpkButton Buttontype="submit" Customclass="btn btn-lg btn-primary">Verify</SpkButton>
                                        </Col>
                                    </Row>
                                </Form>
                                <div className="text-center">
                                    <p className="text-danger mt-3 mb-0 fw-medium"><sup><i className="ri-asterisk"></i></sup>Keep the verification code private!</p>
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