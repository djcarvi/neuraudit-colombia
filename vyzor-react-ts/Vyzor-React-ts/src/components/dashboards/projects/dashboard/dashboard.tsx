
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { dashboardCards, ProjectOptions, ProjectSeries, ProjectsSummary, Recentupdates, TaskList, TaskOptions, TaskSeries, Transactions, UrgentTasks } from "../../../../shared/data/dashboards/projects/projectdashboardata";
import SpkDashboardCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/projects/spk-dashboardcard";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface ProjectsProps { }

const Projects: React.FC<ProjectsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Projects-Dashboard" />

            <Pageheader title="Dashboards" subtitle="Projects" currentpage="Dashboard" activepage="Projects" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        {dashboardCards.map((idx, index) => (
                            <Col xl={3} key={index}>
                                <SpkDashboardCard cardClass={idx.cardClass} project={idx} />
                            </Col>
                        ))}
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Projects Overview
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div id="projects-overview">
                                        <Spkapexcharts chartOptions={ProjectOptions} chartSeries={ProjectSeries} type={"area"} width={"100%"} height={408} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Task Activity
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="task-activity">
                                <Spkapexcharts chartOptions={TaskOptions} chartSeries={TaskSeries} type={"radialBar"} width={"100%"} height={235} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <ListGroup as="ul" className="list-group-flush project-task-activity-list">
                                {TaskList.map((task, index) => (
                                    <ListGroup.Item as="li" key={index}>
                                        <div className="d-flex align-items-start gap-2">
                                            <div className="flex-fill">
                                                <span className={`d-block fw-semibold task-type ${task.className}`}>
                                                    {task.type}
                                                </span>
                                                <span className="fs-12 text-muted">
                                                    {task.trend === "increase" ? "Increased" : "Decreased"} by{" "}
                                                    <span className={`mx-1 ${task.trend === "increase" ? "text-success" : "text-danger"}`}>
                                                        {task.percentage}
                                                    </span>
                                                    This year
                                                </span>
                                            </div>
                                            <div className="fw-semibold">{task.count}</div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Footer>
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
                                Recent Activity
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled projects-recent-activity-list">
                                {Recentupdates.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div>
                                                <span className={`avatar avatar-md avatar-rounded ${item.status}`}>
                                                    <Image  src={item.avatar} alt={item.name} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="d-flex align-items-start justify-content-between mb-1 flex-wrap">
                                                    <div className="d-block fw-semibold">{item.name}</div>
                                                    <SpkBadge variant="" Customclass="bg-light text-muted border">{item.date}</SpkBadge>
                                                </div>
                                                <div className="descrption mb-1">{item.description}</div>
                                                {item.file && (
                                                    <div className="p-1 border border-dotted rounded position-relative">
                                                        <Link to="#!" className="stretched-link" />
                                                        <div className="d-flex align-items-center gap-2">
                                                            <SpkBadge variant="" Customclass="bg-success">{item.file.type}</SpkBadge>
                                                            <span className="fs-11">{item.file.name}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card overflow-hidden custom-table-tasks">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Urgent Tasks
                            </div>
                            <SpkDropdown toggleas="a" Togglevariant="" Customtoggleclass="fs-12 text-muted no-caret" Arrowicon={true} Toggletext="Today">
                                <Dropdown.Item>Week</Dropdown.Item>
                                <Dropdown.Item>Month</Dropdown.Item>
                                <Dropdown.Item>Year</Dropdown.Item>
                            </SpkDropdown>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Task' }, { title: 'Deadline' }, { title: 'Assigned To' }, { title: 'Priority' }, { title: 'Status' }]}>
                                    {UrgentTasks.map((task, index) => (
                                        <tr key={index}>
                                            <td className={index === UrgentTasks.length - 1 ? "border-bottom-0" : ""}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="form-check mb-0">
                                                        <input className="form-check-input" type="checkbox" id={task.id} />
                                                    </div>
                                                    <Link to="#!" className="urgent-task-title">{task.title}</Link>
                                                </div>
                                            </td>
                                            <td className={index === UrgentTasks.length - 1 ? "border-bottom-0" : ""}>
                                                {task.dueDate}
                                            </td>
                                            <td className={index === UrgentTasks.length - 1 ? "border-bottom-0" : ""}>
                                                <div className="avatar-list-stacked mb-0">
                                                    {task.avatars.map((imgSrc, i) => (
                                                        <span key={i} className="avatar avatar-xs avatar-rounded">
                                                            <Image width={20} height={20} src={imgSrc} alt="img" />
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className={index === UrgentTasks.length - 1 ? "border-bottom-0" : ""}>
                                                {task.priority}
                                            </td>
                                            <td className={index === UrgentTasks.length - 1 ? "border-bottom-0" : ""}>
                                                <SpkBadge variant="" Customclass={`${task.statusClass}`}>
                                                    {task.status}
                                                </SpkBadge>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer>
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
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Recent Transactions
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled projects-recent-transactions-list">
                                {Transactions.map((tx, idx) => (
                                    <li key={idx}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md avatar-rounded bg-${tx.avatarColor}-transparent`}>
                                                    {tx.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{tx.name}</span>
                                                <span className="fs-13 text-muted">{tx.dateTime}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="d-block fw-semibold">{tx.amount}</span>
                                                <span className={`fw-medium fs-13 ${tx.status === "Completed" ? "text-success" : tx.status === "Pending" ? "text-warning" : "text-danger"}`}>
                                                    {tx.status}
                                                </span>
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
                <Col xl={12}>
                    <Card className="custom-card custom-table-tasks">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Projects Summary
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn-primary btn-wave waves-effect waves-light">
                                    <Dropdown.Item>New</Dropdown.Item>
                                    <Dropdown.Item>Popular</Dropdown.Item>
                                    <Dropdown.Item>Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" showCheckbox={true} header={[{ title: 'Project Name' }, { title: 'Start Date' }, { title: 'End Date' }, { title: 'Status' }, { title: 'Progress' }, { title: 'Team' }, { title: 'Budget' }, { title: 'Actions' }]}>
                                    {ProjectsSummary.map((project, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input className="form-check-input" type="checkbox" id={project.id} aria-label="..." />
                                            </td>
                                            <td>{project.name}</td>
                                            <td>{project.startDate}</td>
                                            <td>{project.endDate}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`bg-${project.status === "Completed" ? "success" : "primary"}-transparent`}>
                                                    {project.status}
                                                </SpkBadge>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="progress progress-animate progress-xs w-100" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100}>
                                                        <div className={`progress-bar progress-bar-striped progress-bar-animated bg-${project.progressColor}`}
                                                            style={{ width: `${project.progress}%` }} />
                                                    </div>
                                                    <div className="ms-2">{project.progress}%</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="avatar-list-stacked">
                                                    {project.avatars.map((avatar, i) => (
                                                        <span key={i} className="avatar avatar-xs avatar-rounded">
                                                            <Image className=""  src={`${avatar}`} alt="avatar" />
                                                        </span>
                                                    ))}
                                                    {project.moreAvatars && (
                                                        <Link className="avatar avatar-xs bg-primary avatar-rounded text-fixed-white" to="#!">
                                                            +{project.moreAvatars}
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{project.amount}</td>
                                            <td>
                                                <div className="btn-list">
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-primary-light btn-wave">
                                                        <i className="ri-edit-line"></i>
                                                    </SpkButton>
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-danger-light btn-wave">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer>
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

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Projects;