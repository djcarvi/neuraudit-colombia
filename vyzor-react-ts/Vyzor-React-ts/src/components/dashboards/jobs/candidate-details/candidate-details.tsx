
import React, { Fragment } from "react";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import { Certifications, PersonalInfoList, Preferences, ProjectsCandidate, Skills, SocialLinks } from "../../../../shared/data/dashboards/jobs/candidatedetailsdata";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkProgress from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import face13 from '../../../../assets/images/faces/13.jpg';
import comppanyLogo4 from '../../../../assets/images/company-logos/4.png';
import comppanyLogo10 from '../../../../assets/images/company-logos/10.png';
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";

interface CandidateDetailsProps { }

const CandidateDetails: React.FC<CandidateDetailsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Candidate Details" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Candidate Details" activepage="Candidate Details" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                <Col xxl={9} xl={8} className="">
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="d-flex align-items-center flex-wrap justify-content-between gap-2">
                                <div className="d-flex flex-wrap gap-2 w-sm-75">
                                    <div>
                                        <span className="avatar avatar-xxl">
                                            <Image src={face13} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="ms-3 w-sm-75">
                                        <h4 className="fw-medium mb-0 d-flex align-items-center gap-2">
                                            <Link to="#!" className="lh-1">Jhon Doe</Link>
                                            <span className="text-success fs-13 lh-1"><i className="ti ti-star-filled me-1 text-warning"></i>4.5</span>
                                        </h4>
                                        <div className="my-1">
                                            <Link to="#!" className="fw-medium"><i className="bi bi-briefcase me-1 align-middle"></i> Software Engineer</Link>
                                        </div>
                                        <div className="popular-tags">
                                            <Link to="#!" className="badge rounded-pill bg-info-transparent me-1"><i className="bi bi-moon-stars me-1"></i>Full Time</Link>
                                            <Link to="#!" className="badge rounded-pill bg-danger-transparent"><i className="bi bi-clock me-1"></i> Immediate Joinee</Link>
                                        </div>
                                        <Row className="row mt-3 gy-2">
                                            <Col xl={6}>
                                                <div><i className="bi bi-geo-alt me-2"></i>Hyderabad, India</div>
                                            </Col>
                                            <Col xl={6}>
                                                <div><i className="bi bi-briefcase me-2"></i>6 Years Experience</div>
                                            </Col>
                                            <Col xl={6}>
                                                <div>
                                                    <i className="bi bi-coin me-2"></i>Package (Yearly) : $80,000 - $100,000
                                                </div>
                                            </Col>
                                            <Col xl={6}>
                                                <i className="bi bi-mortarboard me-2"></i>B.Sc. in Computer Science
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="btn-list">
                                    <Link to="#!" className="btn btn-primary"><i className="bi bi-download me-1"></i> Download CV</Link>
                                    <Link to="#!" className="btn btn-icon btn-primary-light btn-wave">
                                        <i className="ri-heart-line fs-13"></i>
                                    </Link>
                                    <Link to="#!" className="btn btn-icon btn-primary-light btn-wave">
                                        <i className="ri-share-line"></i>
                                    </Link>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <h6 className="fw-semibold mb-3">About</h6>
                                    <div>
                                        <p className="text-muted">Hi, I'm John Doe, a passionate Software Engineer with over 8 years of experience in developing full-stack applications. My expertise lies in JavaScript, Node.js, and React, which I’ve used to build scalable web applications and optimize performance across various platforms. I am a problem-solver at heart, and I love tackling complex challenges while ensuring my code is clean and efficient.</p>
                                        <p className="text-muted">I believe in continuous learning and always strive to stay updated with the latest technologies in the industry. I am well-versed in both front-end and back-end development, allowing me to contribute to all phases of software development. I’m also passionate about working in agile environments, collaborating with cross-functional teams to meet project goals and deadlines.</p>
                                        <p className="mb-0 text-muted">When I’m not coding, you’ll find me mentoring junior developers, where I share my knowledge and help others grow in their careers. I’m always looking for new opportunities to push the boundaries of technology and contribute to innovative projects. I thrive in a team-oriented environment and am excited to collaborate with others to create impactful solutions.</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h6 className="fw-semibold mb-3">Projects</h6>
                                    <div className="row">
                                        {ProjectsCandidate.map((project) => (
                                            <Col xl={6} key={project.id}>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-start gap-3 mb-4 flex-wrap">
                                                            <div>
                                                                <span className="avatar avatar-lg avatar-rounded bg-light">
                                                                    <Image width={48} height={48} src={project.logoSrc} alt={project.title} />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill w-50">
                                                                <Link to="#!" className="fw-semibold fs-14 d-block text-truncate project-list-title">
                                                                    {project.title}
                                                                </Link>
                                                                <span className="d-block text-muted fs-13">{project.description}</span>
                                                            </div>
                                                            <Link to="#!" className="btn btn-primary-light">
                                                                <i className="ti ti-eye me-1 align-middle d-inline-block"></i>View
                                                            </Link>
                                                        </div>
                                                        <div className="d-flex align-items-center flex-wrap justify-content-between">
                                                            <div>
                                                                <span className="text-muted fs-11 d-block">Assigned Date :</span>
                                                                <span className="fw-semibold d-block">{project.assignedDate}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted fs-11 d-block">Status :</span>
                                                                <SpkBadge variant="" Customclass="bg-success-transparent">{project.status}</SpkBadge>
                                                            </div>
                                                            <div className="text-end">
                                                                <span className="text-muted fs-11 d-block">Due Date :</span>
                                                                <span className="fw-semibold d-block">{project.dueDate}</span>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row className="gy-3">
                                        <Col xl={6}>
                                            <h6 className="fw-semibold mb-3">
                                                Certifications
                                            </h6>
                                            <ListGroup>
                                                {Certifications.map((cert, index) => (
                                                    <ListGroup.Item className="" key={index}>
                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                            <div className="fw-medium">{cert.title}</div>
                                                            <div>-</div>
                                                            <div>{cert.issuer}</div>
                                                            <div>-</div>
                                                            <div>{cert.year}</div>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                        <Col xl={6}>
                                            <h6 className="fw-semibold mb-3">
                                                Job Preferences
                                            </h6>
                                            <ListGroup>
                                                {Preferences.map((pref, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                            <div className="fw-medium">{pref.label}:</div>
                                                            <div>{pref.value}</div>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Experience Overview
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0 candidate-edu-timeline">
                            <div className="p-4 border-bottom">
                                <div className="d-flex align-items-start gap-3">
                                    <div>
                                        <span className="avatar avatar-xl bg-light">
                                            <Image src={comppanyLogo10} alt="" />
                                        </span>
                                    </div>
                                    <div>
                                        <span className="d-block fw-medium fs-14 mb-1">Software Engineer (June 2014 - Present)</span>
                                        <div className="d-flex gap-2 mb-3 flex-wrap">
                                            <span className="d-block">Tech Innovations Inc.</span>
                                            <div className="mb-0 fs-13 text-muted"><i className="bi bi-geo-alt me-1 align-middle"></i>New York, USA</div>
                                        </div>
                                        <div className="fw-semibold mb-2">Key Responsibilities :</div>
                                        <ol className="list-group border-0 list-bullets">
                                            <li className="border-0 py-1">Develop and maintain web applications.</li>
                                            <li className="border-0 py-1">Collaborate with cross-functional teams.</li>
                                            <li className="border-0 py-1">Write clean and scalable code using JavaScript, React, and Node.js.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="d-flex align-items-start gap-3">
                                    <div>
                                        <span className="avatar avatar-xl bg-light">
                                            <Image width={64} height={64} src={comppanyLogo4} alt="" />
                                        </span>
                                    </div>
                                    <div>
                                        <div className="fw-medium fs-14 mb-1">Junior Developer (May 2012 - May 2014)</div>
                                        <div className="d-flex gap-2 mb-3 flex-wrap">
                                            <div>CodeLabs Pvt Ltd.</div>
                                            <div className="mb-0 fs-13 text-muted"><i className="bi bi-geo-alt me-1"></i>San Francisco, USA</div>
                                        </div>
                                        <div className="fw-medium mb-2">Key Responsibilities :</div>
                                        <ol className="list-group border-0 list-bullets">
                                            <li className="border-0 py-1">Assisted in designing and developing software solutions.</li>
                                            <li className="border-0 py-1">Wrote unit tests and ensured software stability.</li>
                                            <li className="border-0 py-1">Supported senior developers in various projects.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Personal Information
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled candidate-personal-info-list">
                                {PersonalInfoList.map((info, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-start gap-2 justify-content-between flex-wrap">
                                            <span className="d-block text-muted d-inline-flex align-items-center personal-info-type">
                                                <i className={`ti ${info.icon} me-2 align-middle fs-16`}></i>
                                                {info.label}
                                            </span>
                                            <span className="fw-medium d-block text-end">{info.value}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Skills
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled job-candidate-skills-list">
                                {Skills.map((skill, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="d-block">{skill.name}</span>
                                            <span className="d-block fw-medium">{skill.progress}%</span>
                                        </div>
                                        <SpkProgress variant={skill.color} mainClass="progress-xs" animated striped now={skill.progress} />
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Portfolio
                            </div>
                        </Card.Header>
                        <Card.Body className="d-flex flex-wrap gap-2">
                            <div className="btn-list">
                                {SocialLinks.map((link, index) => (
                                    <SpkTooltips placement="top" key={link.title || index}  title={link.title}>
                                    <Link to={link.href} className={`btn btn-icon rounded-circle ${link.buttonClass}`} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={link.title}>
                                        <i className={link.iconClass}></i>
                                    </Link>
                                    </SpkTooltips>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-2 --> */}

        </Fragment>
    )
};

export default CandidateDetails;