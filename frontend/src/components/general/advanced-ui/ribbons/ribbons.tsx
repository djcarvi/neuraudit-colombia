
import SpkRibbons from "../../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-ribbons";
import { Ribbon4, Ribbon6, Ribbons2, Ribbons3 } from "../../../../shared/data/general/adavanec-ui/ribbonsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface RibbonsProps { }

const Ribbons: React.FC<RibbonsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Ribbons"} />

            <Pageheader title="Advanced Ui" currentpage="Ribbons" activepage="Ribbons" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                RIBBON STYLE 1
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col xl={6}>
                                    <Card className="custom-card mb-0 ribbon-card shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon" ribbonColor="primary" ribbonPosition="ribbon-top-left">
                                                <span>ribbon</span>
                                            </SpkRibbons>
                                            <div className="card-subtitle fw-semibold mb-2 text-end">Top Left</div>
                                            <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={6}>
                                    <Card className="custom-card mb-0 ribbon-card shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon" ribbonColor="secondary" ribbonPosition="ribbon-top-right">
                                                <span>ribbon</span>
                                            </SpkRibbons>
                                            <div className="card-subtitle fw-semibold mb-2 text-start">Top Right</div>
                                            <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={6}>
                                    <Card className="custom-card mb-0 ribbon-card shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon" ribbonColor="success" ribbonPosition="ribbon-bottom-left">
                                                <span>ribbon</span>
                                            </SpkRibbons>
                                            <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            <div className="card-subtitle fw-semibold mt-2 text-end">Bottom Left</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={6}>
                                    <Card className="custom-card mb-0 ribbon-card shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon" ribbonColor="orange" ribbonPosition="ribbon-bottom-right">
                                                <span>ribbon</span>
                                            </SpkRibbons>
                                            <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            <div className="card-subtitle fw-semibold mt-2 text-start">Bottom Right</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                RIBBON STYLE 2
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="gy-3">
                                {Ribbons2.map((idx, index) => (
                                    <Col xl={6} key={index}>
                                        <Card className="custom-card mb-0 shadow-none border">
                                            <Card.Body className="p-4">
                                                <SpkRibbons ribbonClass="ribbon-2" ribbonColor={idx.color} ribbonPosition={`ribbon-${idx.position}`}>
                                                    <span>Congratulations</span>
                                                </SpkRibbons>
                                                <span className="d-block pt-4">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                                <div className={`card-subtitle fw-semibold mt-2 text-${idx.class}`}>{idx.title} Ribbon</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
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
                                RIBBON STYLE 3
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="gy-3">
                                {Ribbons3.map((idx, index) => (
                                    <Col xl={3} key={index}>
                                        <Card className="custom-card mb-0 shadow-none border">
                                            <Card.Body className="p-4">
                                                <SpkRibbons ribbonClass="ribbon-3" ribbonColor={idx.color} ribbonPosition={idx.position}>
                                                    <span><i className="fe fe-zap"></i></span>
                                                </SpkRibbons>
                                                <div className={`card-subtitle fw-semibold mb-2 text-${idx.class}`}>{idx.title}</div>
                                                <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">RIBBON STYLE 4</div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                {Ribbon4.map((idx, index) => (
                                    <Col xl={6} key={index}>
                                        <Card className="custom-card mb-0 shadow-none border">
                                            <Card.Body className="p-4">
                                                <SpkRibbons ribbonClass="ribbon-4" ribbonColor={idx.color} ribbonPosition={idx.position} >
                                                    <span>{idx.titleClass}</span>
                                                </SpkRibbons>
                                                <div className={`card-subtitle fw-semibold mb-2 text-${idx.class}`}>{idx.title}</div>
                                                <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                RIBBON STYLE 5
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row gy-3">
                                <div className="col-xl-3">
                                    <Card className="custom-card mb-0 overflow-hidden shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon-5 ribbon-primary top-left">OFFER</SpkRibbons>
                                            <div className="card-subtitle fw-semibold mb-2 text-end">Top Left</div>
                                            <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                        </Card.Body>
                                    </Card>
                                </div>
                                <div className="col-xl-3">
                                    <Card className="custom-card mb-0 overflow-hidden shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon-5 ribbon-secondary top-right">OPEN</SpkRibbons>
                                            <div className="card-subtitle fw-semibold mb-2 text-start">Top Right</div>
                                            <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                        </Card.Body>
                                    </Card>
                                </div>
                                <div className="col-xl-3">
                                    <Card className="custom-card mb-0 overflow-hidden shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon-5 ribbon-success bottom-left">CLOSE</SpkRibbons>
                                            <span className="d-block mb-2">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            <div className="card-subtitle fw-semibold text-end">Bottom Left</div>
                                        </Card.Body>
                                    </Card>
                                </div>
                                <div className="col-xl-3">
                                    <Card className="custom-card mb-0 overflow-hidden shadow-none border">
                                        <Card.Body className="p-4">
                                            <SpkRibbons ribbonClass="ribbon-5 ribbon-orange bottom-right">SALE</SpkRibbons>
                                            <span className="d-block mb-2">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            <div className="card-subtitle fw-semibold text-start">Bottom Right</div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">RIBBON STYLE 6</div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                {Ribbon6.map((idx, index) => (
                                    <Col xl={6} key={index}>
                                        <Card className="custom-card mb-0 shadow-none border">
                                            <Card.Body className="p-4">
                                                <SpkRibbons ribbonClass={`ribbon-6 ribbon-${idx.position} ribbon-${idx.color}`}>{idx.titleClass}</SpkRibbons>
                                                <div className={`card-subtitle fw-semibold mb-2 text-${idx.class}`}>{idx.title}</div>
                                                <span className="d-block">Join us in congratulating [Employee Name] for their outstanding contributions and dedication. Their hard work and commitment have truly set a standard for excellence. Let's celebrate their achievements together!</span>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

        </Fragment>
    )
};

export default Ribbons;