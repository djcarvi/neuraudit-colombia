
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTimelineCard from "../../../shared/@spk-reusable-components/reusable-pages/spk-timelinecard";
import { Activities, ActivityLogs, ProjectTimeline, TimelineData } from "../../../shared/data/pages/timelinedata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";

interface TimelineProps { }

const Timeline: React.FC<TimelineProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Timeline" />

            <Pageheader title="Pages" currentpage="Timeline" activepage="Timeline" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row className="mb-5">
                <Col xl={12}>
                    <h6>Timeline 1</h6>
                    <div className="timeline">
                        <div className="container">
                            <Row>
                                <Col lg={12}>
                                    <div className="timeline-container">
                                        <div className="timeline-end">
                                            <span className="avatar avatar-lg avatar-rounded bg-primary text-center">
                                                <i className="ri ri-building-line fs-4"></i>
                                            </span>
                                        </div>
                                        <div className="timeline-continue">
                                            <Row className="timeline-right">
                                                <Col md={6}>
                                                    <div className="timeline-time-container primary">
                                                        <p className="timeline-date text-primary">
                                                            Jan 15
                                                        </p>
                                                        <span className="timeline-time fs-12 text-muted fw-medium d-block">
                                                            2023
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="timeline-box primary">
                                                        <h6 className="fw-semibold">Company Founded</h6>
                                                        <p className="mb-0 text-muted">Our journey began with a vision to revolutionize the industry. On January 15th, 2023, we officially founded the company with a small but dedicated team and big dreams for the future.</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="timeline-left">
                                                <Col md={6}>
                                                    <div className="timeline-box ms-md-auto success">
                                                        <h6 className="fw-semibold">First Product Launch</h6>
                                                        <p className="mb-0 text-muted">After months of hard work and dedication, we launched our first product. It was a pivotal moment in our company's history, setting the stage for everything that was to come.</p>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="timeline-time-container success">
                                                        <p className="timeline-date text-success">
                                                            Feb 20
                                                        </p>
                                                        <span className="timeline-time fs-12 text-muted fw-medium d-block text-start">
                                                            02:00 PM
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="col-12">
                                                    <div className="timeline-year">
                                                        <span className="avatar avatar-lg avatar-rounded bg-success text-center">
                                                            <i className="ri ri-money-dollar-circle-line fs-4"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row className="timeline-right">
                                                <Col md={6}>
                                                    <div className="timeline-time-container warning">
                                                        <p className="timeline-date text-warning">
                                                            Apr 5
                                                        </p>
                                                        <span className="timeline-time fs-12 text-muted fw-medium d-block">
                                                            11:45 AM
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="timeline-box warning">
                                                        <h6 className="fw-semibold">Secured First Round of Funding</h6>
                                                        <p className="mb-0 text-muted">We secured our first round of funding from angel investors. This was a major milestone that allowed us to scale and bring our product to market faster.</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="timeline-left">
                                                <Col md={6}>
                                                    <div className="timeline-box ms-md-auto info">
                                                        <h6 className="fw-semibold">Expanded Team</h6>
                                                        <p className="mb-0 text-muted">As our business grew, we expanded our team to include experts in various fields, from marketing to engineering. This allowed us to focus on innovation and improve our products.</p>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="timeline-time-container info">
                                                        <p className="timeline-date text-info">
                                                            May 18
                                                        </p>
                                                        <span className="timeline-time fs-12 text-muted fw-medium d-block text-start">
                                                            04:20 PM
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="col-12">
                                                    <div className="timeline-year">
                                                        <span className="avatar avatar-lg avatar-rounded bg-danger text-center">
                                                            <i className="ri ri-settings-3-line fs-4"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row className="timeline-right">
                                                <Col md={6}>
                                                    <div className="timeline-time-container danger">
                                                        <p className="timeline-date text-danger">
                                                            Aug 25
                                                        </p>
                                                        <span className="timeline-time fs-12 text-muted fw-medium d-block">
                                                            09:15 AM
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="timeline-box danger">
                                                        <h6 className="fw-semibold">Launched New Feature</h6>
                                                        <p className="mb-0 text-muted">A major milestone in our product development, we launched a new feature that was highly anticipated by our users. It garnered positive feedback and improved user engagement.</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="timeline-left">
                                                <Col md={6}>
                                                    <div className="timeline-box ms-md-auto teal">
                                                        <h6 className="fw-semibold">Reached 100k Users</h6>
                                                        <p className="mb-0 text-muted">We hit a major milestone: 100,000 active users. This achievement reflected the hard work of our team and the value our product brings to our users.</p>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="timeline-time-container teal">
                                                        <p className="timeline-date text-teal">
                                                            Oct 10
                                                        </p>
                                                        <span className="timeline-time fs-12 text-muted fw-medium d-block text-start">
                                                            01:30 PM
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="timeline-start">
                                            <span className="avatar avatar-lg avatar-rounded bg-warning text-center">
                                                <i className="ri ri-user-star-line fs-4"></i>
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row className="mb-5">
                <Col xl={12}>
                    <h6>Timeline 2</h6>
                    <div className="p-5">
                        <div className="timeline-steps">
                            {TimelineData.map((item, index) => (
                                <SpkTimelineCard key={index} timeline={item} />
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row className="">
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Icons Timeline</div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <ul className="list-unstyled timeline-list-1">
                                {ActivityLogs.map((log, index) => (
                                    <li key={index}>
                                        <span className="fw-semibold d-block fs-15 mb-1">{log.title}</span>
                                        <span className="d-block mb-1">{log.description}</span>
                                        <span className="fs-13 text-muted d-block">{log.timestamp}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Rounded Timeline
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled timeline-list-2">
                                {Activities.map((activity, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center mb-1 gap-2">
                                            <div className="lh-1">
                                                <span className="avatar avatar-xs avatar-rounded">
                                                    <Image src={activity.avatar} alt={activity.user} />
                                                </span>
                                            </div>
                                            <div className="fw-semibold flex-fill">{activity.title}</div>
                                            <div className="fs-13 text-muted">{activity.time}</div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="fs-13 text-muted">{activity.user} {activity.message}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Solid Timeline
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled timeline-list-3">
                                {ProjectTimeline.map((event, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-3 mb-1 flex-wrap">
                                            <div className="fw-semibold fs-15">{event.title}</div>
                                            <SpkBadge variant="" Customclass={`bg-${event.badgeColor}`}>{event.time}</SpkBadge>
                                        </div>
                                        <div className="fs-13 text-muted" dangerouslySetInnerHTML={{ __html: event.description }} />
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Timeline;