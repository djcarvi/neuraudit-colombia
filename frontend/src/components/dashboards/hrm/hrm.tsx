
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { Applicants, AttendanceData, AttendanceOptions, AttendanceSeries, AttendancesToday, CandidateOptions, CandidateSeries, EmployeeOptions, Employees, EmployeeSeries, Hrmcards } from "../../../shared/data/dashboards/hrmdata";
import SpkHrmCard from "../../../shared/@spk-reusable-components/dashboards-reusable/spk-htmcard";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";

interface HrmProps { }

const Hrm: React.FC<HrmProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-HRM" />

            <Pageheader title="Dashboards" currentpage="HRM" activepage="HRM" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={4} xl={6} className="">
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Body className="p-0">
                                    <div className="row g-0">
                                        {Hrmcards.map((idx, index) => (
                                            <Col xl={6} key={index}>
                                                <SpkHrmCard cardClass={idx.cardClass} hrm={idx} />
                                            </Col>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <h6 className="fw-semibold mb-3">Employees Status</h6>
                                    <div className="progress-stacked progress-xl mb-3">
                                        <div className="progress-bar" role="progressbar" style={{ width: "25%" }}
                                            aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>25%</div>
                                        <div className="progress-bar bg-success" role="progressbar" style={{ width: "35%" }}
                                            aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>35%</div>
                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: "25%" }}
                                            aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>25%</div>
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ width: "15%" }}
                                            aria-valuenow={15} aria-valuemin={0} aria-valuemax={100}>15%</div>
                                    </div>
                                    <Row className="gy-2">
                                        <Col xl={6}>
                                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                                <div className="employee-status-marker remote">Remote :</div>
                                                <div className="fw-semibold">4,075</div>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                                <div className="employee-status-marker probation">Probation :</div>
                                                <div className="fw-semibold">5,775</div>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                                <div className="employee-status-marker contract">Contract :</div>
                                                <div className="fw-semibold">3,976</div>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                                <div className="employee-status-marker work-home">Work From Home :</div>
                                                <div className="fw-semibold">1,675</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={5} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Candidate Statistics
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="row g-0 border-bottom border-block-end-dashed">
                                <Col xl={6} className="border-end">
                                    <div className="text-center p-3">
                                        <span className="d-block text-muted mb-1">Total Candidates Hired</span>
                                        <h5 className="fw-semibold mb-0">576</h5>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <div className="text-center p-3">
                                        <span className="d-block text-muted mb-1">Total Responses</span>
                                        <h5 className="fw-semibold mb-0">1,854</h5>
                                    </div>
                                </Col>
                            </div>
                            <div id="candidate-statistics" className="p-3">
                                <Spkapexcharts height={305} type={"line"} width={"100%"} chartOptions={CandidateOptions} chartSeries={CandidateSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Attendance Overview
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="attendance-overview">
                                <Spkapexcharts height={260} type={"donut"} width={"100%"} chartOptions={AttendanceOptions} chartSeries={AttendanceSeries} />
                            </div>
                            <ul className="list-unstyled my-4 hrm-attendance-overview-list">
                                {AttendanceData.map((attendance, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center justify-content-between gap-2">
                                            <div className={`attendance-type ${attendance.className}`}>{attendance.type}</div>
                                            <div className="fw-semibold">{attendance.count}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="d-grid">
                                <SpkButton Buttonvariant="" Customclass="btn btn-light btn-lg">View Complete Statistics <i className="ti ti-arrow-narrow-right ms-1"></i></SpkButton>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Employees By Department
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="employee-department">
                                <Spkapexcharts height={367} type={"bar"} width={"100%"} chartOptions={EmployeeOptions} chartSeries={EmployeeSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={4}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Employees List
                            </div>
                            <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled hrm-employee-list">
                                {Employees.map((employee, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <Image src={employee.image} alt={employee.name} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">
                                                    {employee.name}
                                                    <SpkBadge variant="" Customclass={`bg-${employee.badgeColor}-transparent ms-2`}>
                                                        {employee.department}
                                                    </SpkBadge>
                                                </span>
                                                <span className="text-muted fs-13">{employee.role}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-medium">{employee.joinDate}</span>
                                                <span className="d-block fs-12 mt-1 text-muted">Joined</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={4}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Today's Attendance
                            </div>
                            <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="fs-12 text-muted no-caret" Toggletext="Sort By" Arrowicon={true}>
                                <Dropdown.Item >This Week</Dropdown.Item>
                                <Dropdown.Item >This Month</Dropdown.Item>
                                <Dropdown.Item >This Year</Dropdown.Item>
                            </SpkDropdown>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap table-hover" header={[{ title: 'Name' }, { title: 'Time In' }, { title: 'Status' }]}>
                                    {AttendancesToday.map((attendance, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-md bg-light p-1 avatar-rounded">
                                                        <Image width={40} height={40} src={attendance.image} alt={attendance.name} />
                                                    </span>
                                                    <div>
                                                        <p className="fw-medium mb-0">{attendance.name}</p>
                                                        <span className="text-muted fs-12">{attendance.role}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{attendance.time}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`bg-${attendance.badgeColor}-transparent rounded-pill min-w-badge`}>
                                                    {attendance.status}
                                                </SpkBadge>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
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
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Applicant Details
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Id="dropdownMenuButton1" toggleas="a" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass=" btn-primary btn-sm btn-wave waves-effect waves-light no-caret btn" Arrowicon={true}>
                                    <Dropdown.Item as="li" >New</Dropdown.Item>
                                    <Dropdown.Item as="li" >Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" >Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" showCheckbox={true} header={[{ title: 'Application ID' }, { title: 'Applicant Name' }, { title: 'Position Applied' }, { title: 'Date Of Application' }, { title: 'Email' }, { title: 'Work Experience' }, { title: 'Status' }, { title: 'Action' }]}>
                                    {Applicants.map((applicant, index) => (
                                        <tr key={index}>
                                            <th scope="row">
                                                <input className="form-check-input" type="checkbox" id={`checkboxNoLabel${index}`} defaultValue="" defaultChecked={applicant.id == 2 || applicant.id == 4 || applicant.id == 5} aria-label="..." />
                                            </th>
                                            <td>{applicant.application}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span className="avatar avatar-sm me-2 avatar-rounded">
                                                        <Image src={applicant.image} alt="img" />
                                                    </span>
                                                    {applicant.name}
                                                </div>
                                            </td>
                                            <td>{applicant.role}</td>
                                            <td>{applicant.dateApplied}</td>
                                            <td>{applicant.email}</td>
                                            <td>{applicant.experience}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`bg-${applicant.status === 'New' ? 'primary' : applicant.status === 'Interviewed' ? 'success' : applicant.status === 'Hired' ? 'info' : applicant.status === 'Under Review' ? 'secondary' : 'danger'}-transparent`}>
                                                    {applicant.status}
                                                </SpkBadge>
                                            </td>
                                            <td>
                                                <div className="hstack gap-2 fs-15">
                                                    <Link  aria-label="anchor" to="#!" className="btn btn-icon waves-effect waves-light btn-sm btn-success-light rounded-circle">
                                                        <i className="ri-phone-line"></i>
                                                    </Link>
                                                    <Link  aria-label="anchor" to="#!" className="btn btn-icon waves-effect waves-light btn-sm btn-primary-light rounded-circle">
                                                        <i className="ri-edit-line"></i>
                                                    </Link>
                                                    <Link  aria-label="anchor" to="#!" className="btn btn-icon btn-wave waves-effect waves-light btn-sm btn-danger-light rounded-circle">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <div className="d-flex align-items-center">
                                <div> Showing 5 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
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
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
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

export default Hrm;