
import React, { Fragment } from "react";
import { Card, Col, Form, Image, InputGroup, ListGroup, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import { Benefits, InfoList, JobListings, JobsSwiper, Qualifications, Responsibilities } from "../../../../shared/data/dashboards/jobs/jobdetailsdata";
import SpkSwiperJs from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import comppanyLogo8 from '../../../../assets/images/company-logos/8.png';

interface JobDetailsProps { }

const JobDetails: React.FC<JobDetailsProps> = () => {

    const breakpoints = {
        "@0.00": {
            slidesPerView: 1,
            spaceBetween: 10,
        }
    }

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Job Details" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Job Details" activepage="Job Details" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={9}>
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="d-flex flex-wrap align-items-top justify-content-between gap-2">
                                <div>
                                    <div className="d-flex flex-wrap gap-3">
                                        <div>
                                            <span className="avatar avatar-lg bg-light">
                                                <Image  src={comppanyLogo8} alt="" />
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="fw-medium mb-2 d-flex align-items-center"><Link to="#!">Software Developer</Link></h4>
                                            <Link to="#!"><i className="bi bi-building"></i>Tech Solutions Inc.</Link>
                                            <div className="d-flex fs-14 mt-4">
                                                <div>
                                                    <p className="mb-2"><i className="bi bi-geo-alt me-2"></i>New York, NY (Hybrid: 3 days in office, 2 days remote)</p>
                                                    <p><i className="bi bi-briefcase me-2"></i>2+ years in software development</p>
                                                </div>
                                                <div className="ms-4">
                                                    <p className="mb-2"><i className="bi bi-coin me-2"></i>
                                                        <span className="fw-medium">$80,000 - $110,000 per year (depending on experience)</span></p>
                                                    <p><i className="bi bi-mortarboard  me-2"></i>Development Team</p>
                                                </div>
                                            </div>
                                            <div className="popular-tags">
                                                <Link to="#!" className="badge rounded-pill bg-info-transparent me-1"><i className="bi bi-clock me-1"></i>Full Time</Link>
                                                <Link to="#!" className="badge rounded-pill bg-danger-transparent"><i className="bi bi-briefcase me-1"></i>13 Openings</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="btn-list mb-2">
                                        <Link to="#!" className="btn btn-primary"> Apply Now</Link>
                                        <Link to="#!" className="btn btn-icon btn-primary-light btn-wave">
                                            <i className="ri-heart-line"></i>
                                        </Link>
                                        <Link to="#!" className="btn btn-icon btn-primary-light btn-wave">
                                            <i className="ri-share-line"></i>
                                        </Link>
                                    </div>
                                    <p className="mb-0">
                                        <SpkTooltips placement="top" title="45 days left">
                                            <i className="bi bi-info-circle text-danger"></i>
                                        </SpkTooltips>
                                        <span className="fw-medium"> 45 days left </span> to apply this job</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Body>
                            <h5 className="fw-medium">Job Description</h5>
                            <p className="op-9">We are looking for a skilled and passionate Software Developer to join our dynamic development team. As a Software Developer, you will play a crucial role in designing, developing, and maintaining our core software applications and systems. You will collaborate with cross-functional teams to create innovative solutions that meet the needs of our clients.</p>
                            <Row className="gy-3">
                                <Col xl={6}>
                                    <h5 className="fw-medium mb-3">Key Responsibilities :</h5>
                                    <ol className="list-unstyled list-group-numbered mb-0">
                                        {Responsibilities.map((item, index) => (
                                            <li key={index} className="list-group-item">
                                                {item}
                                            </li>
                                        ))}
                                    </ol>
                                </Col>
                                <Col xl={6}>
                                    <h5 className="fw-medium mb-3">Skills & Qualifications :</h5>
                                    <ol className="list-unstyled list-group-numbered mb-0">
                                        {Qualifications.map((item, index) => (
                                            <li key={index} className="list-group-item">
                                                {item}
                                            </li>
                                        ))}
                                    </ol>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <div>
                        <h4 className="fw-medium mb-0">Related Jobs</h4>
                        <p className="">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                        <SpkSwiperJs className="swiper-related-jobs" slides={JobsSwiper} spaceBetween={20} autoplay={true} pagination={false} loop={true} navigation={true} breakpoint={breakpoints} />
                    </div>
                    <Row>
                        <Col xl={6}>
                            <Card className="custom-card border bg-primary-transparent shadow-none">
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h5 className="fw-medium mb-0">&#128400; Was this job fit for someone?</h5>
                                        <Link to="#!" className="btn btn-success btn-lg" role="button">
                                            <i className="ri-share-line me-2 align-middle d-inline-block"></i>Share Now
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={6}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="d-flex align-items-center gap-4 flex-wrap">
                                        <div className="w-sm-50">
                                            <h5 className="fw-medium mb-0">Latest Job Alerts</h5>
                                        </div>
                                        <InputGroup>
                                            <Form.Control type="text" className="" placeholder="Email Here" aria-label="blog-email" aria-describedby="blog-subscribe" />
                                            <SpkButton Buttonvariant="primary" Customclass="btn" Buttontype="button">Subscribe</SpkButton>
                                        </InputGroup>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Job Highlights</div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled job-highlights-list">
                                {InfoList.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className="avatar avatar-sm border lh-1 avatar-rounded me-2 bg-light text-default">
                                                    <i className={item.iconClass}></i>
                                                </span>
                                            </div>
                                            <div>{item.label}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Benefits
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush list-group-numbered">
                                {Benefits.map((benefit, index) => (
                                    <ListGroup.Item key={index} className="">
                                        {benefit}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Similar Jobs
                            </div>
                            <Link to="#!" className="text-primary fw-medium fs-13">
                                View All <i className="fe fe-arrow-right"></i>
                            </Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush">
                                {JobListings.map((job, index) => (
                                    <ListGroup.Item key={index} className="mb-2">
                                        <div className="d-sm-flex flex-wrap gap-2">
                                            <span className="avatar avatar-md avatar-rounded bg-primary bg-opacity-10 border">
                                                {job.icon}
                                            </span>
                                            <div className="flex-grow-1">
                                                <p className="fw-medium fs-13 mb-1">
                                                    <Link to="#!">{job.title}</Link>
                                                </p>
                                                <p className="mb-0 me-3">
                                                    <i className="bi bi-building text-muted"></i> {job.company}
                                                </p>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-1 --> */}

        </Fragment>
    )
};

export default JobDetails;