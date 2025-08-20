
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface PositionProps { }

const Position: React.FC<PositionProps> = () => {

    return (

        <Fragment>

            <Seo title={"Position"} />

            <Pageheader title="Utilities" currentpage="Position" activepage="Position" />

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Positions
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-position-utils">
                            <div className="position-relative">
                                <div className="position-absolute top-0 start-0"></div>
                                <div className="position-absolute top-0 end-0"></div>
                                <div className="position-absolute top-50 start-50"></div>
                                <div className="position-absolute bottom-50 end-50"></div>
                                <div className="position-absolute bottom-0 start-0"></div>
                                <div className="position-absolute bottom-0 end-0"></div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Centering Elements With Positions
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-position-utils">
                            <div className="position-relative">
                                <div className="position-absolute top-0 start-0 translate-middle"></div>
                                <div className="position-absolute top-0 start-50 translate-middle"></div>
                                <div className="position-absolute top-0 start-100 translate-middle"></div>
                                <div className="position-absolute top-50 start-0 translate-middle"></div>
                                <div className="position-absolute top-50 start-50 translate-middle"></div>
                                <div className="position-absolute top-50 start-100 translate-middle"></div>
                                <div className="position-absolute top-100 start-0 translate-middle"></div>
                                <div className="position-absolute top-100 start-50 translate-middle"></div>
                                <div className="position-absolute top-100 start-100 translate-middle"></div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                By adding .translate-middle-x or .translate-middle-y classes
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-position-utils">
                            <div className="position-relative">
                                <div className="position-absolute top-0 start-0"></div>
                                <div className="position-absolute top-0 start-50 translate-middle-x"></div>
                                <div className="position-absolute top-0 end-0"></div>
                                <div className="position-absolute top-50 start-0 translate-middle-y"></div>
                                <div className="position-absolute top-50 start-50 translate-middle"></div>
                                <div className="position-absolute top-50 end-0 translate-middle-y"></div>
                                <div className="position-absolute bottom-0 start-0"></div>
                                <div className="position-absolute bottom-0 start-50 translate-middle-x"></div>
                                <div className="position-absolute bottom-0 end-0"></div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Examples:
                            </div>
                        </Card.Header>
                        <div
                            className="card-body bd-example-position-examples d-flex justify-content-around flex-wrap gap-4">
                            <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-primary position-relative">
                                Mails <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">+99
                                    <span className="visually-hidden">unread messages</span></span>
                            </SpkButton>

                            <SpkButton Buttontype="button" Buttonvariant="dark" Customclass="btn btn-dark position-relative about text-white">
                                Marker <svg width="1em" height="1em" viewBox="0 0 16 16"
                                    className="position-absolute top-100 start-50 translate-middle mt-1 svg-white"
                                    fill="#212529" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z">
                                    </path>
                                </svg>
                            </SpkButton>

                            <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-primary position-relative">
                                Alerts <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2"><span
                                    className="visually-hidden">unread messages</span></span>
                            </SpkButton>
                        </div>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Example With Buttons
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-position-examples">
                            <div className="position-relative m-4">
                                <div className="progress" style={{ height: "1px" }}>
                                    <div className="progress-bar" role="progressbar" style={{ width: "50%" }}
                                        aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                                    </div>
                                </div>
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill"
                                    Style={{ width: "2rem", height: "2rem" }}>1</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill"
                                    Style={{ width: "2rem", height: "2rem" }}>2</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="secondary" Customclass="position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill"
                                    Style={{ width: "2rem", height: "2rem" }}>3</SpkButton>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Position;