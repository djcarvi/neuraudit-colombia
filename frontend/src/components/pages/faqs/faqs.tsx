
import SpkAccordions from "../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-accordions";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Faqs1, Faqs2, Faqs3, Faqs4, Faqs5, Faqs6 } from "../../../shared/data/pages/faqsdata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Form, Image, Nav, Row, Tab } from "react-bootstrap";
import media65 from '../../../assets/images/media/media-65.png';
import media74 from '../../../assets/images/media/media-74.png';
interface FaqsProps { }

const Faqs: React.FC<FaqsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Pages-Faq's" />

            <Pageheader title="Pages" currentpage="Faq's" activepage="Faq's" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card faq-banner-card">
                        <Card.Body className="text-center">
                            <div className="faq-banner-background">
                                <Image  src={media65} alt="" />
                            </div>
                            <h3 className="fw-semibold text-primary">Frequently Asked Questions</h3>
                            <span className="d-block text-muted mb-4">Find quick answers to common queries about using the admin panel.</span>
                            <div className="row justify-content-center">
                                <Col xl={6}>
                                    <Form.Control type="text" className="form-control-lg border-0 shadow-none" id="input-text" placeholder="Search Faq's" />
                                </Col>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Tab.Container defaultActiveKey={"faq2"}>
                    <Col xl={3}>
                        <Card className="custom-card">
                            <Card.Body>
                                <Nav className="nav-tabs flex-column nav-tabs-header faq-nav mb-0 d-sm-flex d-inline-block" role="tablist">
                                    <Nav.Item className="m-1" role="presentation">
                                        <Nav.Link eventKey={"faq1"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#faq1" aria-selected="false" tabIndex={-1}><i className="ri-question-line me-2 fs-16"></i>General</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1" role="presentation">
                                        <Nav.Link eventKey={"faq2"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#faq2" aria-selected="true"><i className="ri-user-line me-2 fs-16"></i>Account & Login</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1" role="presentation">
                                        <Nav.Link eventKey={"faq3"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#faq3" aria-selected="false" tabIndex={-1}><i className="ri-wallet-line me-2 fs-16"></i>Payments & Billing</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1" role="presentation">
                                        <Nav.Link eventKey={"faq4"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#faq4" aria-selected="false" tabIndex={-1}><i className="ri-global-line me-2 fs-16"></i>Website Usage & Features</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1" role="presentation">
                                        <Nav.Link eventKey={"faq5"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#faq5" aria-selected="false" tabIndex={-1}><i className="ri-customer-service-2-line me-2 fs-16"></i>Technical Support</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1" role="presentation">
                                        <Nav.Link eventKey={"faq6"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#faq6" aria-selected="false" tabIndex={-1}><i className="ri-lock-line me-2 fs-16"></i>Privacy & Security</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={9} className="my-auto">
                        <Row className="mb-4">
                            <Col xl={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey={"faq1"} className="border-0 p-0" id="faq1"
                                        role="tabpanel">
                                        <SpkAccordions bodyClass="" items={Faqs1} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"faq2"} className="border-0 p-0" id="faq2"
                                        role="tabpanel">
                                        <SpkAccordions bodyClass="" items={Faqs2} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"faq3"} className="border-0 p-0" id="faq3"
                                        role="tabpanel">
                                        <SpkAccordions bodyClass="" items={Faqs3} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"faq4"} className="border-0 p-0" id="faq4"
                                        role="tabpanel">
                                        <SpkAccordions bodyClass="" items={Faqs4} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"faq5"} className="border-0 p-0" id="faq5"
                                        role="tabpanel">
                                        <SpkAccordions bodyClass="" items={Faqs5} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"faq6"} className="border-0 p-0" id="faq6"
                                        role="tabpanel">
                                        <SpkAccordions bodyClass="" items={Faqs6} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Col>
                </Tab.Container>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={3}>
                    <Card className="custom-card bg-primary-transparent border-0">
                        <Card.Body className="p-0">
                            <Image src={media74} alt="" className="img-fluid" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={9}>
                    <h5 className="fw-semibold">Still Have Questions? Post them here!</h5>
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="row gy-2 mb-3">
                                <Col xl={6}>
                                    <Form.Label htmlFor="user-name" className="">Your Name</Form.Label>
                                    <Form.Control type="text" className="" id="user-name" placeholder="Enter Your Name" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="user-email" className="">Email Id</Form.Label>
                                    <Form.Control type="text" className="" id="user-email" placeholder="Enter Email" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="text-area" className="">Post Your Question</Form.Label>
                                    <Form.Control className="" as="textarea" placeholder="Enter your question here" id="text-area" rows={2} />
                                </Col>
                            </div>
                            <SpkButton Buttontype="button" Buttonvariant="success" Customclass="btn float-end">Send<i className="ri-send-plane-2-line ms-2"></i></SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Faqs;