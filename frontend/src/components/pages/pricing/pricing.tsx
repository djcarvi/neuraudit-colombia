
import SpkBasicPriceCard from "../../../shared/@spk-reusable-components/reusable-pages/spk-basicpricecard";
import SpkPriceCard from "../../../shared/@spk-reusable-components/reusable-pages/spk-pricecard";
import { BasicPricing1data, BasicPricingdata, PricingData, YearData } from "../../../shared/data/pages/pricingdata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";

interface PricingProps { }

const Pricing: React.FC<PricingProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Pricing" />

            <Pageheader title="Pages" currentpage="Pricing" activepage="Pricing" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <div className="row d-flex justify-content-center mb-5">
                <Tab.Container defaultActiveKey={"month"}>
                    <div className="pricing-heading-section text-center mb-5">
                        <span className="badge bg-primary-transparent rounded-pill">
                            Pricing Plans
                        </span>
                        <h2 className="fw-semibold mt-2">Choose the Right Plan for Your Needs</h2>
                        <span className="d-block text-muted fs-16 mb-3">Choose a plan that fits your needs with scalable features and great value.</span>
                        <div className="tab-style-1 border p-1 bg-white rounded-pill d-inline-block">
                            <Nav className="nav-pills" role="tablist">
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"month"} type="button" className="rounded-pill fw-medium" data-bs-toggle="pill" data-bs-target="#pricing-monthly" aria-selected="true" role="tab">Monthly</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"year"} type="button" className="rounded-pill fw-medium" data-bs-toggle="pill" data-bs-target="#pricing-yearly" aria-selected="false" role="tab" tabIndex={-1}>Yearly</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                    </div>
                    <Col xl={9}>
                        <Tab.Content className="">
                            <Tab.Pane eventKey={"month"} className="p-0 border-0" id="pricing-monthly" role="tabpanel">
                                <Row>
                                    {PricingData.map((idx, index) => (
                                        <Col xxl={4} xl={12} className="" key={index}>
                                            <SpkPriceCard price={idx} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"year"} className="p-0 border-0" id="pricing-yearly" role="tabpanel">
                                <Row>
                                    {YearData.map((idx, index) => (
                                        <Col xxl={4} xl={12} className="" key={index}>
                                            <SpkPriceCard price={idx} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Tab.Container>
            </div>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row className="d-flex justify-content-center">
                <Tab.Container defaultActiveKey={"monthly"}>
                    <div className="pricing-heading-section text-center mb-5">
                        <span className="badge bg-primary-transparent rounded-pill">
                            Our Pricing
                        </span>
                        <h2 className="fw-semibold mt-2">Choose the Plan That Fits Your Needs</h2>
                        <span className="d-block text-muted fs-16 mb-3">Select the right fit and enjoy seamless access to all features.</span>
                        <div className="tab-style-1 border bg-white rounded-0 d-inline-block">
                            <Nav className="nav nav-pills" role="tablist">
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"monthly"} type="button" className="rounded-0 fw-medium" data-bs-toggle="pill" data-bs-target="#pricing1-monthly" aria-selected="true" role="tab">Monthly</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"yearly"} type="button" className="rounded-0 fw-medium" data-bs-toggle="pill" data-bs-target="#pricing1-yearly" aria-selected="false" role="tab" tabIndex={-1}>Yearly</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                    </div>
                    <Col xl={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey={"monthly"} className="p-0 border-0" id="pricing1-monthly" role="tabpanel">
                                <Row>
                                    {BasicPricingdata.map((card, index) => (
                                        <Col xxl={4} key={index}>
                                            <SpkBasicPriceCard cardClass={card.cardClass} price={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"yearly"} className="p-0 border-0" id="pricing1-yearly" role="tabpanel">
                                <Row>
                                    {BasicPricing1data.map((card, index) => (
                                        <Col xxl={4} key={index}>
                                            <SpkBasicPriceCard cardClass={card.cardClass} price={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Tab.Container>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default Pricing;