
import { Othercolors, bgcolor, bggradient, bgoutline, bgtransparent, bordercolors } from "../../../../shared/data/general/utilities/colorsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface ColorsProps { }

const Colors: React.FC<ColorsProps> = () => {

    return (
        <Fragment>

            <Seo title={"Colors"} />

            <Pageheader title="Utilities" currentpage="Colors" activepage="Colors" />

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col lg={12} sm={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Background Colors
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                {bgcolor.map((idx, index) => (
                                    <div className="p-3 col" key={index}>
                                        <div className={`m-2 bg-${idx.color} mx-auto color-container`}></div>
                                        <p className="pb-0 mb-0 fw-medium text-center"><code>{idx.class}</code></p>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={12} sm={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Background gradients
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                {bggradient.map((idx, index) => (
                                    <div className="p-2 col" key={index}>
                                        <div className={`m-2 bg-${idx.color} mx-auto color-container`}></div>
                                        <p className="pb-0 mb-0 fw-medium text-center"><code>{idx.class}</code></p>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={12} sm={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Background transparent colors
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                {bgtransparent.map((idx, index) => (
                                    <div className="p-3 col" key={index}>
                                        <div className={`m-2 bg-${idx.color} mx-auto color-container`}></div>
                                        <p className="pb-0 mb-0 fw-medium text-center"><code>{idx.class}</code></p>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={12} sm={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Background outline colors
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                {bgoutline.map((idx, index) => (
                                    <div className="p-3 col" key={index}>
                                        <div className={`m-2 bg-${idx.color} mx-auto color-container`}><i className="bi bi-emoji-smile fs-18"></i></div>
                                        <p className="pb-0 mb-0 fw-medium text-center"><code>{idx.class}</code></p>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={12} sm={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Border Colors
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                {bordercolors.map((idx, index) => (
                                    <div className="p-3 col" key={index}>
                                        <div className={`m-2 border ${idx.color} mx-auto color-container`}></div>
                                        <p className="pb-0 mb-0 fw-medium text-center"><code>{idx.class}</code></p>
                                    </div>
                                ))}

                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={12} sm={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Background Opacity
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                <div className="p-3 col">
                                    <div className="m-2 bg-success bg-opacity-100 text-fixed-white mx-auto color-container">100%</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.bg-opacity-75</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 bg-success text-fixed-white bg-opacity-75 mx-auto color-container">75%</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.bg-opacity-75</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 bg-success text-fixed-dark bg-opacity-50 mx-auto color-container">50%</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.bg-opacity-50</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 bg-success text-fixed-dark bg-opacity-25 mx-auto color-container">25%</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.bg-opacity-25</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 bg-success text-fixed-dark bg-opacity-10 mx-auto color-container">10%</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.bg-opacity-10</code></p>
                                </div>
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
                                Text Colors
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row row-cols-12 d-flex align-items-center">
                                <div className="p-3 col">
                                    <div className="m-2 text-primary fw-medium fs-14 text-center">primary</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-primary</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-secondary fw-medium fs-14 text-center">secondary</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-secondary</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-warning fw-medium fs-14 text-center">warning</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-warning</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-info fw-medium fs-14 text-center">info</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-info</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-success fw-medium fs-14 text-center">success</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-success</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-danger fw-medium fs-14 text-center">danger</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-danger</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-light bg-dark fw-medium fs-14 text-center">light</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-light</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-dark fw-medium fs-14 text-center">dark</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-dark</code></p>
                                </div>
                                <div className="p-3 col">
                                    <div className="m-2 text-muted fw-medium fs-14 text-center">muted</div>
                                    <p className="pb-0 mb-0 fw-medium text-center"><code>.text-muted</code></p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Text Opacity
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="row row-cols-12 d-flex align-items-center">
                                        <div className="p-3 col">
                                            <div className="m-2 text-primary fw-medium fs-14 text-center">Opacity-100</div>
                                            <p className="pb-0 mb-0 fw-medium text-center"><code>100% opacity</code></p>
                                        </div>
                                        <div className="p-3 col">
                                            <div className="m-2 text-primary text-opacity-75 fw-medium fs-14 text-center">Opacity-100</div>
                                            <p className="pb-0 mb-0 fw-medium text-center"><code>.text-opacity-75</code></p>
                                        </div>
                                        <div className="p-3 col">
                                            <div className="m-2 text-primary text-opacity-50 fw-medium fs-14 text-center">Opacity-100</div>
                                            <p className="pb-0 mb-0 fw-medium text-center"><code>.text-opacity-50</code></p>
                                        </div>
                                        <div className="p-3 col">
                                            <div className="m-2 text-primary text-opacity-25 fw-medium fs-14 text-center">Opacity-100</div>
                                            <p className="pb-0 mb-0 fw-medium text-center"><code>.text-opacity-25</code></p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Callout
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="callout">Lorem ipsum dolor sit amet consectetur adipisicing
                                elit. </div>
                            <div className="callout callout-info">Lorem ipsum dolor sit amet consectetur
                                adipisicing
                                elit. </div>
                            <div className="callout callout-warning">Lorem ipsum dolor sit amet
                                consectetur
                                adipisicing elit. </div>
                            <div className="callout callout-danger">Lorem ipsum dolor sit amet
                                consectetur
                                adipisicing elit.
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <h6 className="mb-3">Other Colors:</h6>
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-blue-${idx.data}`} key={index}>$blue-{idx.data}</div>
                            ))}

                            <div className="flex-fill p-3 bd-blue">$blue</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-indigo-${idx.data}`} key={index}>$indigo-{idx.data}</div>
                            ))}

                            <div className="flex-fill p-3 bd-indigo">$indigo</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-purple-${idx.data}`} key={index}>$purple-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-purple">$purple</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-pink-${idx.data}`} key={index}>$pink-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-pink">$pink</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-red-${idx.data}`} key={index}>$red-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-red">$red</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-orange-${idx.data}`} key={index}>$orange-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-orange">$orange</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-yellow-${idx.data}`} key={index}>$yellow-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-yellow">$yellow</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-green-${idx.data}`} key={index}>$green-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-green">$green</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-teal-${idx.data}`} key={index}>$teal-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-teal">$teal</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-cyan-${idx.data}`} key={index}>$cyan-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-cyan">$cyan</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="d-xl-flex flex-wrap">
                            {Othercolors.map((idx, index) => (
                                <div className={`flex-fill p-3 bd-gray-${idx.data}`} key={index}>$gray-{idx.data}</div>
                            ))}
                            <div className="flex-fill p-3 bd-gray">$gray</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

        </Fragment>
    )
};

export default Colors;