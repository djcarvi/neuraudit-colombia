
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { CategoryListData, CourseCards, CourseListData, Coursesdata, CoursesOverview, Instructors, PayoutOptions, PayoutSeries, ProgressData, StudentOptions, StudentSeries } from "../../../shared/data/dashboards/coursedata";
import SpkCourseCard from "../../../shared/@spk-reusable-components/dashboards-reusable/spk-coursecard";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Link } from "react-router-dom";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";

interface CoursesProps { }

const Courses: React.FC<CoursesProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Courses" />

            <Pageheader title="Dashboards" currentpage="Courses" activepage="Courses" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row className="row-cols-xxl-5">
                {CourseCards.map((idx, index) => (
                    <div className="col" key={index}>
                        <SpkCourseCard cardClass={idx.cardClass} course={idx} />
                    </div>
                ))}
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Students Analysis
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="students-analysis">
                                <Spkapexcharts height={365} type={"line"} width={"100%"} chartOptions={StudentOptions} chartSeries={StudentSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Courses List
                            </div>
                            <Link to="#!" className="text-muted">View All <i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush">
                                {CourseListData.map((course, index) => (
                                    <ListGroup.Item className="" key={index}>
                                        <div className="d-flex align-items-start flex-wrap gap-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-xl">
                                                    <Image  src={course.image} alt="img" />
                                                </span>
                                            </div>
                                            <div className="flex-fill fw-medium">
                                                <Link to="#!" className="text-muted d-block mb-1 fs-10" title="Category">
                                                    <i className="ti ti-tag fs-11 align-middle"></i>&nbsp;{course.category}
                                                </Link>
                                                <Link to="#!" className="d-block mb-2 fs-14">{course.title}</Link>
                                                <div className="d-flex align-items-center flex-wrap gap-3">
                                                    <div className="d-flex align-items-center">
                                                        <Link to="#!" className="me-2 lh-1">
                                                            <span className="avatar avatar-xs avatar-rounded">
                                                                <Image width={20} height={20} src={course.instructor.avatar} alt="img" />
                                                            </span>
                                                        </Link>
                                                        <Link to="#!" className="flex-fill fs-12">{course.instructor.name}</Link>
                                                    </div>
                                                    <div className="fs-12">
                                                        <span className="me-2">{course.views}</span>
                                                        <span className="d-inline-flex align-items-center">
                                                            <i className="ri-star-fill fs-16 text-warning me-1"></i>({course.rating})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Top Course Categories
                            </div>
                            <Link to="#!" className="text-muted">View All <i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled top-course-categories-list">
                                {CategoryListData.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md bg-${item.color}-transparent`}>
                                                    {item.initials}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="fw-semibold d-block">{item.title}</span>
                                                <span className="fs-12">{item.courseCount}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-semibold">{item.studentCount}</span>
                                                <span className="d-block text-muted">Students</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xxl={3} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Top Instructors
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled top-instructors-list">
                                {Instructors.map((instructor, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md online avatar-rounded">
                                                    <Image width={40} height={40} src={instructor.image} alt={instructor.name} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="d-flex align-items-center gap-2 lh-1 mb-1">
                                                    <span className="fw-semibold d-block">{instructor.name}</span>
                                                    <div className="vr"></div>
                                                    <div className="d-inline-flex align-items-center">
                                                        {instructor.rating}
                                                        <i className="ti ti-star-filled ms-1 text-warning"></i>
                                                    </div>
                                                </div>
                                                <span className="text-muted fs-13">{instructor.students}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-semibold d-block">{instructor.earnings}</span>
                                                <span className="fw-semibold fs-13 text-muted">Earnings</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Upcoming Schedules
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled upcoming-schedules-list">
                                {Coursesdata.map((course, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center justify-content-between gap-1">
                                            <div className="w-50">
                                                <div className="mb-1 fw-semibold text-truncate">
                                                    {course.title}
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xs avatar-rounded">
                                                            <Image width={20} height={20} src={course.image} alt={course.instructor} />
                                                        </span>
                                                    </div>
                                                    <div>{course.instructor}</div>
                                                </div>
                                            </div>
                                            <div className="text-end w-50">
                                                <div className="mb-1">{course.dateRange}</div>
                                                <span className="d-block fs-12 text-muted">{course.time}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Payout Report
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-4 mb-5">
                                <div className="col">
                                    <div className="d-flex align-items-center p-2 border border-dashed rounded">
                                        <div className="me-3">
                                            <span className="avatar radius-5 bg-primary-transparent text-primary"><i className="ti ti-cash fs-5"></i></span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="fs-12 text-muted">Paid</span>
                                            <span className="fs-16 fw-semibold d-flex align-items-center">$68,400</span>
                                            <span className="text-success fs-12"><i className="ti ti-arrow-up me-1"></i>4.26%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="d-flex align-items-center p-2 border border-dashed rounded">
                                        <div className="me-3">
                                            <span className="avatar radius-5 bg-secondary-transparent text-secondary"><i className="ti ti-x fs-5"></i></span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="fs-12 text-muted">Unpaid</span>
                                            <span className="fs-16 fw-semibold d-flex align-items-center">$21,300</span>
                                            <span className="text-danger fs-12"><i className="ti ti-arrow-down me-1"></i>0.86%</span>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <div id="payout-Report">
                                <Spkapexcharts height={212} type={"line"} width={"100%"} chartOptions={PayoutOptions} chartSeries={PayoutSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="flex-between justify-content-between">
                            <div className="card-title">Ongoing Courses</div>
                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="View All" Customtoggleclass=" border-0 p-0 text-muted no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" >Today</Dropdown.Item>
                                    <Dropdown.Item as="li" >This Weak</Dropdown.Item>
                                    <Dropdown.Item as="li" >Last Weak</Dropdown.Item>
                                </SpkDropdown>

                         
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled ongoing-courses-list">
                                {ProgressData.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            <div>
                                                <span className={`avatar avatar-md ${item.avatarClass}`}>
                                                    <i className={`${item.iconClass} fs-5`}></i>
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="d-flex justify-content-between mb-1 flex-wrap">
                                                    <span className="fw-semibold d-block w-75 text-truncate">
                                                        {item.title}
                                                    </span>
                                                    <div>
                                                        <p className="mb-0 fs-13 text-muted">
                                                            <i className="ti ti-arrow-up align-middle me-1 text-success"></i>
                                                            {item.progress}.0%
                                                        </p>
                                                    </div>
                                                </div>
                                                <SpkProgress variant={item.progressClass} mainClass="progress-xs" animated striped now={item.progress} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
                                Courses Overview
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-primary  btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" >New</Dropdown.Item>
                                    <Dropdown.Item as="li" >Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" >Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" showCheckbox={true} header={[{ title: 'Course Name' }, { title: 'Instructor' }, { title: 'Start Date' }, { title: 'Total Enrolled' }, { title: 'Average Rating' }, { title: 'Status' }, { title: 'Revenue' }, { title: 'Actions' }]}>
                                    {CoursesOverview.map((course) => (
                                        <tr key={course.id}>
                                            <td>
                                                <input className="form-check-input" type="checkbox" id={course.id} aria-label="..." />
                                            </td>
                                            <td>{course.title}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xs avatar-rounded">
                                                            <Image width={20} height={20} src={course.avatar} alt="" />
                                                        </span>
                                                    </div>
                                                    <div>{course.instructorName}</div>
                                                </div>
                                            </td>
                                            <td>{course.date}</td>
                                            <td>{course.students}</td>
                                            <td>
                                                <div className="d-inline-flex align-items-center">
                                                    {course.rating}
                                                    <i className="ti ti-star-filled text-warning ms-1"></i>
                                                </div>
                                            </td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`${course.statusClass}`}>{course.status}</SpkBadge>
                                            </td>
                                            <td>{course.earnings}</td>
                                            <td>
                                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon btn-sm border no-caret">
                                                    <Dropdown.Item as="li"><i className="ri-eye-line me-2"></i>View</Dropdown.Item>
                                                    <Dropdown.Item as="li"><i className="ri-pencil-line me-2"></i>Edit</Dropdown.Item>
                                                    <Dropdown.Item as="li"><i className="ri-delete-bin-line me-2"></i>Delete</Dropdown.Item>
                                                </SpkDropdown>
                                            </td>
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
            </Row>

            {/* <!-- End:: row-4 --> */}

        </Fragment>
    )
};

export default Courses;