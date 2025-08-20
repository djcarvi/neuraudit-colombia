
import React, { Fragment, useState } from "react";
import { Card, Col, Container, Form, Image, ListGroup, Modal, Nav, Row, Tab } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import { CheckoutSummary, SummaryData } from "../../../../shared/data/dashboards/ecommerce/checkoutdata";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";

interface CheckoutProps { }

const Checkout: React.FC<CheckoutProps> = () => {

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Checkout" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Checkout" activepage="Checkout" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Container>
                <Row>
                    <Col xl={8}>
                        <Card className="custom-card !border-0">
                            <Card.Body>
                                <h5 className="mb-3">
                                    Personal Info
                                </h5>
                                <Row className="gy-4">
                                    <Col md={6}>
                                        <Form.Control type="text" className="" id="firstName" placeholder="First Name" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="text" className="" id="lastName" placeholder="Last Name" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="emailAddress" placeholder="Email Address" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="mobileNumber" placeholder="Mobile Number" />
                                    </Col>
                                </Row>
                                <div className="mt-5 mb-3 d-flex align-items-center justify-content-between flex-wrap">
                                    <h5 className="fw-semibold mb-0">Shipping Address</h5>
                                    <Link to="#select-address" onClick={handleShow} className="link-primary" data-bs-toggle="modal">Select From Address Book</Link>
                                </div>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="fullName" placeholder="Full Name" />
                                    </Col>
                                </Row>
                                <Row className="gy-4">
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="address1" placeholder="Address 1" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="address2" placeholder="Address 2" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="landMark" placeholder="Landmark" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="pinZipCode" placeholder="Pincode / Zipcode" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="city" placeholder="City" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="email" className="" id="stateDistrict" placeholder="State, District" />
                                    </Col>
                                    <div className="col-md-12">
                                        <Form.Control as="textarea" rows={3} className="form-control" id="deliveryInstructions" placeholder="Delivery Instructions" />
                                    </div>
                                    <Col md={12}>
                                        <div className="form-group d-flex align-items-center flex-wrap">
                                            <div className="min-w-fit-content me-4">
                                                <p className="mb-0 fw-medium">Address Type:</p>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex gap-4 flex-wrap">
                                                    <div className="form-check mb-0">
                                                        <input className="form-check-input" type="radio" name="addressType" id="radio-1" defaultChecked />
                                                        <label className="form-check-labe fs-13l" htmlFor="radio-1">Home</label>
                                                    </div>
                                                    <div className="form-check mb-0">
                                                        <input className="form-check-input" type="radio" name="addressType" id="radio-2" />
                                                        <label className="form-check-label fs-13" htmlFor="radio-2">Work</label>
                                                    </div>
                                                    <div className="form-check mb-0">
                                                        <input className="form-check-input" type="radio" name="addressType" id="radio-3" />
                                                        <label className="form-check-label fs-13" htmlFor="radio-3">Other</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="mt-5">
                                    <h5 className="fw-semibold mb-3">Payment Method</h5>
                                    <Tab.Container defaultActiveKey={"paypal"}>
                                        <Nav className="nav-tabs custom-nav-tabs-2 gap-3" id="myTab" role="tablist">
                                            <Nav.Item role="presentation" className="me-0" >
                                                <Nav.Link eventKey={"paypal"} role="tab">
                                                    <div className="d-flex align-items-center">
                                                        <span className="min-w-fit-content me-3">
                                                            <i className={`bi bi-paypal fs-20`}></i>
                                                        </span>
                                                        <div className="flex-grow-1">PayPal</div>
                                                    </div>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item role="presentation" className="me-0" >
                                                <Nav.Link eventKey={"credit"} role="tab" className="me-0">
                                                    <div className="d-flex align-items-center">
                                                        <span className="min-w-fit-content me-3">
                                                            <i className={`bi bi-credit-card fs-20`}></i>
                                                        </span>
                                                        <div className="flex-grow-1">Credit Or Debit Card</div>
                                                    </div>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item role="presentation" className="me-0" >
                                                <Nav.Link eventKey={"upi"} role="tab" className="me-0"> 
                                                    <div className="d-flex align-items-center">
                                                        <span className="min-w-fit-content me-3">
                                                            <i className={`bi bi-globe fs-20`}></i>
                                                        </span>
                                                        <div className="flex-grow-1">UPI / Net Banking</div>
                                                    </div>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item role="presentation" className="me-0" >
                                                <Nav.Link eventKey={"cash"} role="tab">
                                                    <div className="d-flex align-items-center">
                                                        <span className="min-w-fit-content me-3">
                                                            <i className={`bi bi-cash-stack fs-20`}></i>
                                                        </span>
                                                        <div className="flex-grow-1">Cash On Delivery</div>
                                                    </div>
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey={"paypal"} className="tab-pane p-0 border-0" id="paypal-tab" role="tabpanel">
                                                <p className="mb-3 mt-4 text-muted">Order will be placed once the payment is done. Please read all the terms &amp; conditions about <Link to="#!" className="text-primary text-decoration-underline">refund policy</Link>.</p>
                                                <Link to="#!" className="btn btn-primary">Proceed to pay <i className="ti ti-arrow-right fs-18 ms-2 align-middle d-inline-block rtl-transform-icon"></i></Link>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey={"credit"} className="tab-pane p-0 border-0" id="card-tab" role="tabpanel">
                                                <p className="mb-2 mt-4 fw-medium">Card Details:</p>
                                                <Row className="gy-4">
                                                    <Col md={6}>
                                                        <Form.Control type="text" className="" id="cardHolderName" placeholder="Card Holder Name" />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Control type="text" className="" id="cardNumber" placeholder="Card Number" />
                                                    </Col>
                                                    <div className="col-md-3">
                                                        <Form.Control type="text" className="" id="expDate" placeholder="Expiry Date" />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <Form.Control type="text" className="" id="cvv" placeholder="CVV" />
                                                    </div>
                                                </Row>
                                                <p className="mb-3 mt-2 fs-13 text-muted">
                                                    <span><i className="ti ti-lock fs-16"></i></span>
                                                    <span>Your transaction is secured with encryption.</span>
                                                </p>
                                                <Link to="#!" className="btn btn-primary">Proceed to pay <i className="ti ti-arrow-right fs-18 ms-2 align-middle d-inline-block rtl-transform-icon"></i></Link>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey={"upi"} className="tab-pane p-0 border-0" id="netbanking-tab" role="tabpanel">
                                                <p className="mb-3 mt-4 text-muted">Order will be placed once the payment is done. Please read all the terms & conditions about <Link to="#!" className="text-primary text-decoration-underline">refund policy</Link>.</p>
                                                <Link to="#!" className="btn btn-primary">Proceed to pay <i className="ti ti-arrow-right fs-18 ms-2 align-middle d-inline-block rtl-transform-icon"></i></Link>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey={"cash"} className="tab-pane p-0 border-0" id="cod-tab" role="tabpanel">
                                                <p className="mb-3 mt-4 text-muted">Proceed to place order. If you have any doubts regarding returning/exchanging products, checkout <Link to="#!" className="text-primary text-decoration-underline">Return & Exchange policy</Link></p>
                                                <Link to="#!" className="btn btn-primary">Proceed to checkout <i className="ti ti-arrow-right align-middle fs-18 ms-2 d-inline-block rtl-transform-icon"></i></Link>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card className="custom-card overflow-hidden">
                            <Card.Body className="p-0">
                                <ListGroup className="list-group-flush">
                                    {CheckoutSummary.map((product) => (
                                        <ListGroup.Item className="" key={product.id}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="lh-1">
                                                    <span className="avatar avatar-xxl">
                                                        <Image  src={product.imageUrl} alt={product.name} />
                                                    </span>
                                                </div>
                                                <div className="flex-fill">
                                                    <span className="fw-semibold d-block mb-2">{product.name}</span>
                                                    <span className="text-muted d-block fs-13 mb-1">Color : {product.color}</span>
                                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                        <span className="text-muted d-block fs-13">
                                                            Qty : {product.quantity} x ${product.price.toFixed(2)}
                                                        </span>
                                                        <div className="fw-semibold">
                                                            ${(product.quantity * product.price).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                            <div className="card-footer">
                                <span className="d-block fs-14 text-muted mb-1">Have a coupon ? Enter below</span>
                                <div className="input-group mb-1">
                                    <Form.Control type="text" className="form-control-sm" placeholder="Coupon Code" aria-label="coupon-code" aria-describedby="coupons" />
                                    <SpkButton Buttonvariant="primary" Customclass="btn input-group-text">Apply</SpkButton>
                                </div>
                                <ul className="list-unstyled cart-order-summary-list mt-3">
                                    {SummaryData.map((item, index) => (
                                        <li key={index}>
                                            <div className={`d-flex align-items-center justify-content-between ${item.isTotal ? 'text-primary' : ''}`}>
                                                <div>{item.label}</div>
                                                <div className={`fw-medium ${item.isTotal ? 'fw-semibold h5 mb-0 text-primary' : ''} ${item.isFree ? 'text-success' : ''}`}>
                                                    {item.value}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: select address modal --> */}

            <Modal show={show} size="lg" onHide={handleClose} className="fade modal-style-1 modal-3" centered id="select-address" aria-hidden="true">
                <Modal.Body>
                    <div className="d-flex align-items-start justify-content-between mb-4">
                        <h6 className="fs-18 mb-0">Select Address</h6>
                        <SpkButton Buttonvariant="" onClickfunc={handleClose} Buttontype="button" Customclass="btn-close p-1" data-bs-dismiss="modal" aria-label="Close"></SpkButton>
                    </div>
                    <div className="row">
                        <Col md={12}>
                            <Card className="custom-card checkout-address-card">
                                <Card.Body>

                                    {/* <!-- form-check --> */}

                                    <input className="form-check-input d-none" type="radio" id="address1_select" name="select-address" defaultChecked />
                                    <label className="position-absolute all-0 cursor-pointer" htmlFor="address1_select"></label>

                                    {/* <!-- form-check --> */}

                                    <SpkBadge variant="" Customclass="bg-secondary rounded-pill custom-badge-3">Default</SpkBadge>

                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="lh-1">
                                            <span className="avatar avatar-md avatar-rounded border"><i className="ti ti-home fs-5"></i></span>
                                        </div>
                                        <h6 className="fs-16 mb-0">Home</h6>
                                    </div>
                                    <p className="mb-1 fw-medium text-default">Ruby Disousa</p>
                                    <p className="mb-1 fw-medium text-muted fs-13">rubyakuner@ginna.mail</p>
                                    <p className="mb-2 fw-medium text-muted fs-13">+11-23-1116773</p>
                                    <p className="mb-0 fs-13 text-muted">
                                        H.No: 3-116/458, Golden Park, Marias St.,
                                        Near 12Amet Residency, 14756, United States Of America
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={12}>
                            <Card className="custom-card checkout-address-card">
                                <Card.Body>

                                    {/* <!-- form-check --> */}

                                    <input className="form-check-input d-none" type="radio" id="address2_select" name="select-address" />
                                    <label className="position-absolute all-0 cursor-pointer" htmlFor="address2_select"></label>

                                    {/* <!-- form-check --> */}

                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="lh-1">
                                            <span className="avatar avatar-md avatar-rounded border"><i className="ti ti-briefcase fs-16"></i></span>
                                        </div>
                                        <h6 className="fs-16 mb-0">Work</h6>
                                    </div>
                                    <p className="mb-1 fw-medium">Ruby Disousa</p>
                                    <p className="mb-1 fw-medium text-muted fs-13">rubyakuner@ginna.mail</p>
                                    <p className="mb-2 fw-medium text-muted fs-13">+11-23-1116773</p>
                                    <p className="mb-0 fs-13 text-muted">
                                        Taj Building, 3rd Floor, Room No: 3, Silver St.,
                                        Adugiahsuk, LICE, 14756, United States Of America
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                    <div className="d-flex align-items-center gap-2 justify-content-end">
                        <Link to="#!" onClick={handleClose} className="btn btn-light" data-bs-dismiss="modal">Cancel</Link>
                        <Link to="#!" className="btn btn-primary">Select address</Link>
                    </div>
                </Modal.Body>
            </Modal>

            {/* <!-- End:: select address modal --> */}

        </Fragment>
    )
};

export default Checkout;