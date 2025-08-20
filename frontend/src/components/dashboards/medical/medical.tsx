
import SimpleBar from 'simplebar-react';
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Nav, Pagination, Row, Tab } from "react-bootstrap";
import Seo from '../../../shared/layouts-components/seo/seo';
import Pageheader from '../../../shared/layouts-components/pageheader/pageheader';
import { Appointments, DepartmentOptions, Departments, DepartmentSeries, Doctors, DoctorSchedules, GenderData, MedicalCards, MedicalOptions, MedicalSeries, PatientRecords, PatientsOptions, PatientsSeries, TestRecords } from '../../../shared/data/dashboards/medicaldata';
import SpkMedicalCard from '../../../shared/@spk-reusable-components/dashboards-reusable/spk-medicalcard';
import SpkButton from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons';
import Spkapexcharts from '../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts';
import { Link } from 'react-router-dom';
import SpkTables from '../../../shared/@spk-reusable-components/reusable-tables/spk-tables';
import SpkBadge from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge';
import SpkDropdown from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown';

interface MedicalProps { }

const Medical: React.FC<MedicalProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboard-Medical" />

            <Pageheader title="Dashboards" currentpage="Medical" activepage="Medical" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={5}>
                    <Row>
                        {MedicalCards.map((item, index) => (
                            <Col xl={6} key={index}>
                                <SpkMedicalCard cardClass={item.cardClass} bodyClass={item.bodyClass} medical={item.medical} />
                            </Col>
                        ))}
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Patient Statistics
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary btn-sm btn-wave waves-effect waves-light">1D</SpkButton>
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1W</SpkButton>
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1M</SpkButton>
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">6M</SpkButton>
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1Y</SpkButton>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div id="patients-statistics">
                                        <Spkapexcharts height={260} type={"bar"} width={"100%"} chartOptions={MedicalOptions} chartSeries={MedicalSeries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={7}>
                    <div className="row">
                        <Col xl={12}>
                            <Card className="custom-card available-treatments-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Available Treatments
                                    </div>
                                    <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                                </Card.Header>
                                <Card.Body>
                                <Row className="gy-sm-0 gy-3 gx-3">
                                        {Departments.map((dept, index) => (
                                            <Col xxl={2} xl={2} lg={3} md={3} sm={3} key={index} className="col text-center">
                                                <Link  aria-label="anchor" to="#!" className={`btn ${dept.btnClass} btn-icon`}>
                                                    <i className={dept.iconClass}></i>
                                                </Link>
                                                <Link  to="#!" className="d-block mt-3 fw-medium">
                                                    {dept.label}
                                                </Link>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={7}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Today's Appointments
                                    </div>
                                    <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap appointments-table">
                                            {Appointments.map((appt, index) => (
                                                <tr key={index}>
                                                    <td className={index === Appointments.length - 1 ? 'border-bottom-0' : ''}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-sm avatar-rounded">
                                                                    <Image  src={appt.imageUrl} alt={appt.name} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="fw-semibold d-block">{appt.name}</span>
                                                                <span className="fs-13 text-muted">{`${appt.gender},${appt.age}Yrs`}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={index === Appointments.length - 1 ? 'border-bottom-0' : ''}>
                                                        <SpkBadge variant="" Customclass={`badge ${appt.badgeClass}`}>{appt.department}</SpkBadge>
                                                    </td>
                                                    <td className={index === Appointments.length - 1 ? 'border-bottom-0' : ''}>
                                                        {appt.time}
                                                    </td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={5}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Available Doctors
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Tab.Container defaultActiveKey={"thu"}>
                                        <Nav className="nav-style-1 nav-pills mb-4 nav-justified" role="tablist">
                                            <Nav.Link eventKey={"tue"} className="nav-link px-2"  aria-selected="false" tabIndex={-1}>
                                                <span className="d-block mb-1">22</span>
                                                <span className="op-6 fs-12">Sat</span>
                                            </Nav.Link>
                                            <Nav.Link eventKey={"wed"} className="nav-link px-2"  aria-selected="false" tabIndex={-1}>
                                                <span className="d-block mb-1">23</span>
                                                <span className="op-6 fs-12">Sun</span>
                                            </Nav.Link>
                                            <Nav.Link eventKey={"thu"} className="nav-link px-2" data-bs-toggle="tab" aria-current="page" role="tab"  aria-selected="true" tabIndex={-1}>
                                                <span className="d-block mb-1">24</span>
                                                <span className="op-6 fs-12">Mon</span>
                                            </Nav.Link>
                                            <Nav.Link eventKey={"fri"} className="nav-link px-2" aria-selected="false" tabIndex={-1}>
                                                <span className="d-block mb-1">25</span>
                                                <span className="op-6 fs-12">Tue</span>
                                            </Nav.Link>
                                            <Nav.Link eventKey={"sat"} className="nav-link px-2"  aria-selected="false" tabIndex={-1}>
                                                <span className="d-block mb-1">26</span>
                                                <span className="op-6 fs-12">Wed</span>
                                            </Nav.Link>
                                        </Nav>
                                        <ul className="list-unstyled availabe-doctors-list" id="available-doctors">
                                            <SimpleBar style={{height:'250px'}}>
                                            {DoctorSchedules.map((doctor, index) => (
                                                <li key={index} className="">
                                                    <div className="d-flex align-items-start gap-2 mb-3">
                                                        <div className="flex-fill">
                                                            <span className="d-block fw-semibold">{doctor.name}</span>
                                                            <span className={`fs-13 ${doctor.departmentClass}`}>{doctor.department}</span>
                                                        </div>
                                                        <div className="fs-13 text-muted d-flex align-items-center gap-1">
                                                            <i className="ti ti-clock-hour-3"></i>
                                                            {doctor.time}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                            </SimpleBar>
                                        </ul>
                                    </Tab.Container>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={3} xl={6} className="">
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Patients Visits
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="patients-visits">
                                <Spkapexcharts height={238} type={"radialBar"} width={"100%"} chartOptions={PatientsOptions} chartSeries={PatientsSeries} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <ListGroup className="list-group-flush">
                                {GenderData.map((item, index) => (
                                    <ListGroup.Item className="" key={index}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md avatar-rounded ${item.avatarBgClass}`}>
                                                    <i className={item.iconClass}></i>
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="fw-semibold d-block">{item.label}</span>
                                                <span className="fs-13 d-block text-muted">
                                                    <span className={`${item.trendColorClass} me-2 d-inline-flex align-items-center`}>
                                                        <i className={item.trendIconClass}></i>{item.trendText}
                                                    </span>
                                                    {item.trendLabel}
                                                </span>
                                            </div>
                                            <div className={`fw-semibold text-${item.trendColor}`}>{item.percentage}</div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl={3} xl={6} className="">
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Top Doctors 
                            </div>
                            <Link to="#!" className="fs-13 text-muted">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush">
                                {Doctors.map((doctor, index) => (
                                    <ListGroup.Item className="" key={index}>
                                        <Link to="#!" className="stretched-link"></Link>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md avatar-rounded bg-light">
                                                    <Image width={40} height={40} src={doctor.image} alt={doctor.name} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{doctor.name}</span>
                                                <span className="d-block fs-13 text-muted">{doctor.specialization}</span>
                                            </div>
                                            <div className="text-end">
                                                <div>
                                                    <span className="d-inline-flex align-items-center">
                                                        {doctor.rating}
                                                        <i className="ti ti-star-filled ms-1 text-warning"></i>
                                                    </span>
                                                </div>
                                                <span className="fs-13 text-muted">{doctor.experience}</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6} className="">
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Patients Reports
                            </div>
                            <Link to="#!" className="fs-13 text-muted">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled patients-reports-list">
                                {TestRecords.map((record, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md ${record.bgClass} avatar-rounded`}>
                                                    <i className={record.iconClass}></i>
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{record.name}</span>
                                                <span className="d-block fs-13 text-muted">{record.testType}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="d-flex align-items-center gap-1">
                                                    <i className={`${record.statusIcon} ${record.statusColor} fs-20`}></i>
                                                    {record.statusText}
                                                </span>
                                                <span className="fs-13 text-muted">{record.date}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Top Departments
                            </div>
                        </Card.Header>
                        <Card.Body className="py-0">
                            <div id="top-departments">
                                <Spkapexcharts height={358} type={"bar"} chartOptions={DepartmentOptions} chartSeries={DepartmentSeries} />
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
                                Patient Records
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
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Patient ID' }, { title: 'Name' }, { title: 'Age' }, { title: 'Gender' }, { title: 'Consultation Type' }, { title: 'Doctor' }, { title: 'Status' }, { title: 'Appointment Date' }, { title: 'Time' }, { title: 'Actions' }]}>
                                    {PatientRecords.map((appt, index) => (
                                        <tr key={index}>
                                            <td>{appt.id}</td>
                                            <td>{appt.name}</td>
                                            <td>{appt.age}</td>
                                            <td>{appt.gender}</td>
                                            <td>{appt.department}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded bg-light">
                                                            <Image width={28} height={28} src={appt.doctorImage} alt={appt.doctorName} />
                                                        </span>
                                                    </div>
                                                    <div>{appt.doctorName}</div>
                                                </div>
                                            </td>
                                            <th>
                                                <SpkBadge variant="" Customclass={`badge ${appt.statusBadgeClass}`}>{appt.status}</SpkBadge>
                                            </th>
                                            <th>{appt.date}</th>
                                            <th>{appt.time}</th>
                                            <th>
                                                <SpkDropdown Icon={true} IconClass="ti ti-dots-vertical" Togglevariant="" Customtoggleclass="btn btn-icon btn-sm btn-light no-caret">
                                                    <Dropdown.Item><i className="ti ti-eye me-2 d-inline-block"></i>View</Dropdown.Item>
                                                    <Dropdown.Item><i className="ti ti-edit me-2 d-inline-block"></i>Edit</Dropdown.Item>
                                                    <Dropdown.Item><i className="ti ti-trash me-2 d-inline-block"></i>Delete</Dropdown.Item>
                                                </SpkDropdown>
                                            </th>
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
                                            <Pagination.Prev disabled> Prev </Pagination.Prev>
                                            <Pagination.Item>{1}</Pagination.Item>
                                            <Pagination.Item active>{2}</Pagination.Item>
                                            <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                            <Pagination.Item>{17}</Pagination.Item>
                                            <Pagination.Next className="text-primary"> Next </Pagination.Next>
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

export default Medical;