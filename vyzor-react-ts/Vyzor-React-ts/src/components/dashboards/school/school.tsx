
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { Analyticspayments, SchoolAttendanceOptions, SchoolAttendanceSeries, SchoolCards, SchoolEvents, SchoolOptions, SchoolOverviewOptions, SchoolOverviewSeries, SchoolSeries, StudentActivities, StudentPayments, TopStudents } from "../../../shared/data/dashboards/schooldata";
import SpkSchoolCard from "../../../shared/@spk-reusable-components/dashboards-reusable/spk-schoolcard";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";

interface SchoolProps { }

const School: React.FC<SchoolProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-School" />

            <Pageheader title="Dashboards" currentpage="School" activepage="School" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={3}>
                    <Row>
                        {SchoolCards.map((idx, index) => (
                            <Col xxl={12} lg={6} className="" key={index}>
                                <SpkSchoolCard cardClass={idx.cardClass} bodyClass={idx.bodyClass} school={idx.school} />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                School Revenue
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="school-revenue">
                                <Spkapexcharts height={317} type={"line"} width={"100%"} chartOptions={SchoolOptions} chartSeries={SchoolSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Events
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled school-events-list">
                                {SchoolEvents.map((event) => (
                                    <li key={event.id} >
                                        <div className="d-flex align-items-center gap-3 flex-wrap flex-xxl-nowrap">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md ${event.bgClass}`}>
                                                    <i className={`ti ${event.icon} fs-5`}></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap">
                                                    <span className="d-block fw-semibold">{event.title}</span>
                                                    <SpkBadge variant="" Customclass=" bg-light text-default border">{event.date}</SpkBadge>
                                                </div>
                                                <div className="text-muted fs-13 event-description">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Students Activity
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled students-activity-list">
                                {StudentActivities.map((activity) => (
                                    <li key={activity.id} className={activity.listClass}>
                                        <div className="d-flex align-items-start gap-2">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    {activity.avatar ? (
                                                        <Image  src={activity.avatar} alt={activity.name} />
                                                    ) : (
                                                        <span className="avatar avatar-md avatar-rounded bg-warning">
                                                            {activity.initials}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="d-flex align-items-start justify-content-between gap-3">
                                                    <span className="d-block fw-semibold">{activity.name}</span>
                                                    <SpkBadge variant="" Customclass={`badge ${activity.badgeClass}`}>{activity.date}</SpkBadge>
                                                </div>
                                                <span className="fs-13 text-muted">{activity.description}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Students Overview
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="students-overview">
                                <Spkapexcharts height={227} type={"donut"} width={"100%"} chartOptions={SchoolOverviewOptions} chartSeries={SchoolOverviewSeries} />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Row className="g-0">
                                <div className="col border-end border-inline-end-dashed">
                                    <div className="text-center">
                                        <span className="student-overview-type boys">Boys</span>
                                        <h5 className="mb-0 mt-1 fw-semibold d-flex align-items-center justify-content-center gap-1">6,560
                                            <span className="badge bg-success-transparent rounded-pill  d-inline-flex align-items-center">
                                                <i className="ti ti-arrow-up me-1"></i>2.45%
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="text-center">
                                        <span className="student-overview-type girls">Girls</span>
                                        <h5 className="mb-0 mt-1 fw-semibold d-flex align-items-center justify-content-center gap-1">3,354
                                            <span className="badge bg-danger-transparent rounded-pill  d-inline-flex align-items-center">
                                                <i className="ti ti-arrow-down me-1"></i>6.76%
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Top Students
                            </div>
                            <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush">
                                {TopStudents.map((student) => (
                                    <ListGroup.Item key={student.id} className="">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md">
                                                    <Image width={40} height={40} src={student.avatar} alt={student.name} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{student.name}</span>
                                                <span className="fs-13 text-muted">{student.grade}</span>
                                            </div>
                                            <div className="text-end">
                                                <span>
                                                    GPA : <span className="fw-medium text-primary">{student.gpa}</span>
                                                </span>
                                                <span className={`${student.achievementClass} fs-13 d-block`}>
                                                    {student.achievement}
                                                </span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Students Fee Analytics
                            </div>
                            <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <table className="table text-nowrap">
                                    <tbody>
                                        {Analyticspayments.map((payment, index) => (
                                            <tr key={index}>
                                                <td>{payment.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="lh-1">
                                                            <span className="avatar avatar-md avatar-rounded">
                                                                <Image  src={payment.imageUrl} alt="img" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="d-block fw-semibold lh-1 mb-1">{payment.name}</span>
                                                            <span className="fs-13 text-muted">{payment.feeType}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <span className={`fs-13 fw-semibold ${payment.status === 'Paid' ? 'text-success' : payment.status === 'Pending' ? 'text-danger' : 'text-warning'}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xxl={9}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Student Summary
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-primary btn-sm btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" >New</Dropdown.Item>
                                    <Dropdown.Item as="li" >Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" >Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Student ID' }, { title: 'Name' }, { title: 'Grade' }, { title: 'Fee Status' }, { title: 'Attendance (%)' }, { title: 'Marks (%)' }, { title: 'Last Payment Date' }, { title: 'Total Fees Paid' }]} >
                                    {StudentPayments.map((payment, index) => (
                                        <tr key={index}>
                                            <td>{payment.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image src={payment.imageUrl} alt={payment.name} />
                                                        </span>
                                                    </div>
                                                    <div className="fw-semibold">{payment.name}</div>
                                                </div>
                                            </td>
                                            <td>{payment.grade}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`${payment.status === 'Paid' ? 'bg-success' : payment.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                                                    {payment.status}
                                                </SpkBadge>
                                            </td>
                                            <td>{payment.currentPerformance}</td>
                                            <td>{payment.previousPerformance}</td>
                                            <td>{payment.dueDate}</td>
                                            <td>{payment.amount}</td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <div className="d-flex align-items-center">
                                <div> Showing 6 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-2">
                                        <Pagination className="mb-0 flex-wrap">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item>1</Pagination.Item>
                                            <Pagination.Item active>2</Pagination.Item>
                                            <Pagination.Item><i className='bi bi-three-dots'></i></Pagination.Item>
                                            <Pagination.Item>17</Pagination.Item>
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Attendance Overview
                            </div>
                            <Link to="#!" className="btn btn-primary-light btn-sm">View All</Link>
                        </Card.Header>
                        <Card.Body>
                            <div id="attendance-overview">
                                <Spkapexcharts height={365} type={"bar"} width={"100%"} chartOptions={SchoolAttendanceOptions} chartSeries={SchoolAttendanceSeries} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <div className="row mt-0 g-0">
                                <div className="col-6 border-end border-inline-end-dashed text-center p-3">
                                    <p className="mb-1 fw-medium">Boys</p>
                                    <h5 className="text-warning fw-semibold mb-0">12.34K</h5>
                                </div>
                                <div className="col-6 text-center p-3">
                                    <p className="mb-1 fw-medium">Girls</p>
                                    <h5 className="text-primary fw-semibold mb-0">10.19K</h5>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default School;