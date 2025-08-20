

import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import media4 from '../../../../assets/images/media/media-4.jpg';
interface HelpersProps { }

const Helpers: React.FC<HelpersProps> = () => {

    return (

        <Fragment>

            <Seo title={"Helpers"} />

            <Pageheader title="Utilities" currentpage="Helpers" activepage="Helpers" />

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Colors With backgrounds
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-bg-primary p-3">Primary with contrasting color</div>
                            <div className="text-bg-secondary p-3">Secondary with contrasting color</div>
                            <div className="text-bg-success p-3">Success with contrasting color</div>
                            <div className="text-bg-danger p-3">Danger with contrasting color</div>
                            <div className="text-bg-warning p-3">Warning with contrasting color</div>
                            <div className="text-bg-info p-3">Info with contrasting color</div>
                            <div className="text-bg-light p-3 text-default">Light with contrasting color</div>
                            <div className="text-bg-dark p-3 text-white">Dark with contrasting color</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9} xl={9} lg={6} md={6} sm={12} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">With Other Components</div>
                        </Card.Header>
                        <Card.Body>
                            <h6 className="fw-medium mb-3">Badges:</h6>
                            <SpkBadge variant="" Customclass="text-bg-primary me-1">Primary</SpkBadge>
                            <SpkBadge variant="" Customclass="text-bg-info mb-4">Info</SpkBadge>
                            <h6 className="fw-medium mb-3">cards:</h6>
                            <div className="card text-bg-success mb-3 text-fixed-white" style={{ maxWidth: "18rem" }}>
                                <div className="card-header border-bottom-0">
                                    <div className="card-title text-fixed-white">
                                        Header
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <p className="card-text text-fixed-white">Some quick example text to build on the card title
                                        and
                                        make up the bulk of the card's content.</p>
                                </div>
                            </div>
                            <div className="card text-bg-danger mb-3 text-fixed-white" style={{ maxWidth: "18rem" }}>
                                <div className="card-header border-bottom-0">
                                    <div className="card-title text-fixed-white">
                                        Header
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <p className="card-text text-fixed-white">Some quick example text to build on the card title
                                        and
                                        make up the bulk of the card's content.</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={3} lg={6} md={6} sm={12} className="">
                    <Card className="custom-card streched-card">
                        <Card.Header>
                            <div className="card-title">
                                Card With Stretched Links
                            </div>
                        </Card.Header>
                        <Card.Body className="grid-cards">
                            <Image  className="bd-placeholder-img card-img-top card-img" src={media4} alt="..." />
                            <div className="card-body pb-0">
                                <h5 className="card-title">Card with stretched links</h5>
                                <p className="card-text">
                                    <Link to="#!" className="stretched-link text-danger"
                                        style={{ position: "relative" }}>Stretched link will not work
                                        here,
                                        because <code>position: relative</code> is added to the
                                        link</Link>
                                </p>
                                <p className="card-text bg-light mb-0 p-1 rounded" style={{ transform: "rotate(0)" }}>
                                    This <Link to="#!" className="text-warning stretched-link">stretched
                                        link </Link>
                                    will only be spread over the <code>p</code>-tag, because a
                                    transform is
                                    applied to it.
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={12} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Clearfix
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="bg-light clearfix">
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-primary float-start m-1">Example Button
                                    floated left</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-primary float-end m-1">Example Button
                                    floated
                                    right</SpkButton>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Colored links
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-evenly flex-wrap">
                                <Link to="#!" className="link-primary fw-medium fs-15 p-1">Primary</Link>
                                <Link to="#!" className="link-secondary fw-medium fs-15 p-1">Secondary</Link>
                                <Link to="#!" className="link-success fw-medium fs-15 p-1">Success</Link>
                                <Link to="#!" className="link-danger fw-medium fs-15 p-1">Danger</Link>
                                <Link to="#!" className="link-warning fw-medium fs-15 p-1">Warning</Link>
                                <Link to="#!" className="link-info fw-medium fs-15 p-1">Info</Link>
                                <Link to="#!" className="link-light fw-medium fs-15 p-1">Light</Link>
                                <Link to="#!" className="link-dark fw-medium fs-15 p-1">Dark</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Ratio
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="ratio ratio-16x9">
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/-lDlbQ7DiCI" title="YouTube video player" style={{ border: "0px" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Aspect ratios
                                    </div>
                                </Card.Header>
                                <div className="card-body bd-example-ratios">
                                    <div className="ratio ratio-1x1 me-1">
                                        <div className="d-flex align-items-center justify-content-center">1x1</div>
                                    </div>
                                    <div className="ratio ratio-4x3 me-1">
                                        <div className="d-flex align-items-center justify-content-center">4x3</div>
                                    </div>
                                    <div className="ratio ratio-16x9 me-1">
                                        <div className="d-flex align-items-center justify-content-center">16x9</div>
                                    </div>
                                    <div className="ratio ratio-21x9">
                                        <div className="d-flex align-items-center justify-content-center">21x9</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Custom ratios
                                    </div>
                                </Card.Header>
                                <div className="card-body bd-example-ratios bd-example-ratios-breakpoint overflow-x-auto">
                                    <div className="ratio me-1" style={{ "--bs-aspect-ratio": "50%" } as React.CSSProperties}>
                                        <div className="d-flex align-items-center justify-content-center">2x1</div>
                                    </div>
                                    <div className="ratio ratio-4x3">
                                        <div className="d-flex align-items-center justify-content-center">4x3, then 2x1</div>
                                    </div>
                                </div>
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
                                Vertical Stacking
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="vstack gap-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border p-1 px-2 rounded">Second item</div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Horizontal Stacking
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="hstack gap-3 mb-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border p-1 px-2 rounded">Second item</div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                            <div className="hstack gap-3 mb-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border ms-auto p-1 px-2 rounded">Second item</div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                            <div className="hstack gap-sm-3 gap-2">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border ms-auto p-1 px-2 rounded">Second item</div>
                                <div className="vr"></div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <div className="col-xl-4">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vstack For Buttons
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="vstack gap-2 col-md-5 mx-auto">
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-primary">Save
                                    changes</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="outline-primary" Customclass="btn btn-outline-primary">Cancel</SpkButton>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-4">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Inline Form With Hstack
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="hstack gap-3 flex-wrap flex-xl-nowrap">
                                <input className="form-control me-auto" type="text"
                                    placeholder="Add your item here..."
                                    aria-label="Add your item here..." />
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-primary">Submit</SpkButton>
                                <div className="vr"></div>
                                <SpkButton Buttontype="button" Buttonvariant="outline-danger" Customclass="btn btn-outline-danger">Reset</SpkButton>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-4">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Text Truncation
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <div className="col-2 text-truncate">
                                    This text is quite long, and will be truncated once displayed.
                                </div>
                            </Row>

                            {/* <!-- Inline level --> */}

                            <span className="d-inline-block text-truncate" style={{ maxWidth: "150px" }}>
                                This text is quite long, and will be truncated once displayed.
                            </span>
                        </Card.Body>
                    </Card>
                </div>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <div className="col-xl-4">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                CUSTOM FOCUS RING
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Link to="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2">
                                Custom focus ring
                            </Link>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-4">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                CSS VARIABLE FOCUS RING
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Link to="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2" style={{ "--bs-focus-ring-color": "rgba(var(--success-rgb), .25)" } as React.CSSProperties}>
                                Green focus ring
                            </Link>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-4">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                BLURRY OFFSET FOCUS RING
                            </div>
                        </Card.Header>
                        <div className="card-body p-4">
                            <Link to="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2" style={{ "--bs-focus-ring-x": "10px", "--bs-focus-ring-y": "10px", "--bs-focus-ring-blur": "4px" } as React.CSSProperties}>
                                Blurry offset focus ring
                            </Link>
                        </div>
                    </Card>
                </div>

            </Row>

            {/* <!-- End:: row-6 --> */}

            <Col xl={6}>
                <Card className="custom-card">
                    <Card.Header>
                        <div className="card-title">
                            FOCUS RING UTILITIES
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-primary py-1 px-2 text-decoration-none border rounded-2">Primary focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-secondary py-1 px-2 text-decoration-none border rounded-2">Secondary focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-success py-1 px-2 text-decoration-none border rounded-2">Success focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-danger py-1 px-2 text-decoration-none border rounded-2">Danger focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-warning py-1 px-2 text-decoration-none border rounded-2">Warning focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-info py-1 px-2 text-decoration-none border rounded-2">Info focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-light py-1 px-2 text-decoration-none border rounded-2">Light focus</Link></p>
                        <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-dark py-1 px-2 text-decoration-none border rounded-2">Dark focus</Link></p>
                    </Card.Body>
                </Card>
            </Col>

        </Fragment>
    )
};

export default Helpers;