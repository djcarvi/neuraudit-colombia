
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Acquisitions, GenderStats, Jobsactivities, JobsCards, JobsEmployeeOptions, JobsEmployeeSeries, JobsOverviewOptions, JobsOverviewSeries, JobsPostings, JobsRecent, JobsTable } from "../../../../shared/data/dashboards/jobs/jobsdashboardata";
import SpkListCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Link } from "react-router-dom";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface JobsProps { }

const Jobs: React.FC<JobsProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Dashboards" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Dashboard" activepage="Jobs" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row className="row row-cols-xxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1">
                {JobsCards.map((idx, index) => (
                    <div className="col" key={index}>
                        <SpkListCard jobsCard={true} list={idx} />
                    </div>
                ))}
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Employees Performance
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="employees-performance">
                                <Spkapexcharts height={378} type={"line"} width={"100%"} chartOptions={JobsEmployeeOptions} chartSeries={JobsEmployeeSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Recent Activity
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled jobs-recent-activity-list">
                                {Jobsactivities.map((activity, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-start gap-3 flex-wrap flex-xxl-nowrap">
                                            <div>
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <Image src={activity.avatar} alt={activity.name} />
                                                </span>
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="fw-semibold">{activity.name}</div>
                                                    <SpkBadge variant="" Customclass={`${activity.badgeClass}`}>
                                                        {activity.badgeText}
                                                    </SpkBadge>
                                                </div>
                                                <div className="fs-13 description mb-1">{activity.description}</div>
                                                <span className="d-block fs-12 text-muted">{activity.timestamp}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Candidates Overview
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="candidates-overview">
                                <Spkapexcharts height={236} width={"100%"} type={"donut"} chartOptions={JobsOverviewOptions} chartSeries={JobsOverviewSeries} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <ListGroup className="list-group-flush">
                                {GenderStats.map((stat, index) => (
                                    <ListGroup.Item key={index} className="">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md bg-${stat.color}-transparent svg-${stat.color}`}>
                                                    {stat.icon}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="fs-13 d-block">{stat.gender}</span>
                                                <h5 className="fw-semibold mb-0">{stat.count}</h5>
                                            </div>
                                            <div className="text-end">
                                                <span className={stat.percentageChange > 0 ? 'text-success' : 'text-danger'}>
                                                    <i className={`ti ti-arrow-narrow-${stat.percentageChange > 0 ? 'up' : 'down'} me-1`}></i>
                                                    {stat.percentageChange}%
                                                </span>
                                                <span className="d-block fs-13 text-muted">This Year</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xxl={6}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Recently Added Jobs
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Company' }, { title: 'Job Role' }, { title: 'Location' }, { title: 'Job Type' }]}>
                                    {JobsTable.map((job, index) => (
                                        <tr key={index} className={index === JobsTable.length - 1 ? "border-bottom-0" : ""}>
                                            <td className={index === JobsTable.length - 1 ? "border-bottom-0" : ""}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-light avatar-rounded">
                                                        <Image width={28} height={28} src={job.companyLogo} alt={job.companyName} />
                                                    </span>
                                                    <Link to="#!" className="fw-medium">
                                                        {job.companyName}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className={index === JobsTable.length - 1 ? "border-bottom-0" : ""}>{job.position}</td>
                                            <td className={index === JobsTable.length - 1 ? "border-bottom-0" : ""}>
                                                <span className="text-muted">
                                                    <i className="ti ti-map-pin me-1"></i>
                                                    {job.location}
                                                </span>
                                            </td>
                                            <td className={index === JobsTable.length - 1 ? "border-bottom-0" : ""}>
                                                <SpkBadge variant="" Customclass={`${job.badgeClass} rounded-pill`}>{job.jobType}</SpkBadge>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Acquisitions
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="progress progress-md mb-4 mt-2">
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: "52%" }} aria-valuenow={52} aria-valuemin={0} aria-valuemax={100}></div>
                                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: "12%" }} aria-valuenow={12} aria-valuemin={0} aria-valuemax={100}></div>
                                <div className="progress-bar bg-success" role="progressbar" style={{ width: "16%" }} aria-valuenow={16} aria-valuemin={0} aria-valuemax={100}></div>
                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: "12%" }} aria-valuenow={12} aria-valuemin={0} aria-valuemax={100}></div>
                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "8%" }} aria-valuenow={8} aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                            <ListGroup as="ul" className="acquisitions-list mt-1">
                                {Acquisitions.map((item, index) => (
                                    <ListGroup.Item as="li" key={index} className="">
                                        {item.label}
                                        <SpkBadge variant="" Customclass={`float-end ${item.badgeClass}`}>{item.count}</SpkBadge>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={12}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Recent Jobs
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush overflow-scroll" id="recent-jobs">
                                {JobsRecent.map((job, index) => (
                                    <ListGroup.Item key={index} className={`${index === 0 ? "border-top-0" : ""} border-start-0 border-end-0 ${index === JobsRecent.length - 1 ? "border-bottom-0" : ""}`}>
                                        <Link to="#!">
                                            <div className="d-flex align-items-center flex-wrap">
                                                <div className="me-2 lh-1">
                                                    <span className={`avatar avatar-md avatar-rounded ${job.bgClass}`}>{job.initials}</span>
                                                </div>
                                                <div className="flex-fill">
                                                    <p className="mb-0 fw-semibold">{job.title}</p>
                                                    <p className="fs-12 text-muted mb-0">
                                                        {job.companyInfo} - {job.timeInfo}
                                                    </p>
                                                </div>
                                                <div className="text-end">
                                                    <p className={`mb-0 fs-12 ${job.jobTypeColor}`}>{job.jobType}</p>
                                                    <SpkBadge variant="" Customclass={`badge ${job.badgeClass}`}>{job.badge}</SpkBadge>
                                                </div>
                                            </div>
                                        </Link>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Recent Job Postings
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-primary btn-sm btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'Job Title' }, { title: 'Department' }, { title: 'Company Name' }, { title: 'Location' }, { title: 'Applications' }, { title: 'Status' }, { title: 'Posted By' }, { title: 'Posted Date' }, { title: 'Actions' }]}>
                                    {JobsPostings.map((job) => (
                                        <tr key={job.id}>
                                            <td>{job.id}</td>
                                            <td>{job.title}</td>
                                            <td>{job.department}</td>
                                            <td>{job.company}</td>
                                            <td>{job.location}</td>
                                            <td>{job.applicants}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`${job.status === "Active" ? "bg-success-transparent" : "bg-danger-transparent"}`}>
                                                    {job.status}
                                                </SpkBadge>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xs avatar-rounded">
                                                            <Image width={20} height={20} src={job.avatar} alt={job.applicantName} />
                                                        </span>
                                                    </div>
                                                    <div>{job.applicantName}</div>
                                                </div>
                                            </td>
                                            <td>{job.datePosted}</td>
                                            <td>
                                                <div className="btn-list">
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-primary-light btn-icon btn-sm">
                                                        <i className="ti ti-edit"></i>
                                                    </SpkButton>
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-danger-light btn-icon btn-sm">
                                                        <i className="ti ti-trash"></i>
                                                    </SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <div className="d-flex align-items-center flex-wrap">
                                <div> Showing 6 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-2">
                                        <Pagination className="mb-0 flex-wrap">
                                            <Pagination.Prev disabled>
                                                Prev
                                            </Pagination.Prev>
                                            <Pagination.Item>1</Pagination.Item>
                                            <Pagination.Item active>2</Pagination.Item>
                                            <Pagination.Item><i className='bi bi-three-dots'></i></Pagination.Item>
                                            <Pagination.Item>17</Pagination.Item>
                                            <Pagination.Next className="text-primary">
                                                Next
                                            </Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

        </Fragment>
    )
};

export default Jobs;