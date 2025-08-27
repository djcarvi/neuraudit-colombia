
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Row, Table } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import { Badges, Filedocument, Tasks, TimelineMessages, TodoItems } from "../../../../shared/data/dashboards/projects/projectoverviewdata";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import face2 from '../../../../assets/images/faces/2.jpg';
import face5 from '../../../../assets/images/faces/5.jpg';
import face8 from '../../../../assets/images/faces/8.jpg';
import face10 from '../../../../assets/images/faces/10.jpg';
import face11 from '../../../../assets/images/faces/11.jpg';
import face15 from '../../../../assets/images/faces/15.jpg';
import { ReactSortable } from "react-sortablejs";
interface ProjectsOverviewProps { }

const ProjectsOverview: React.FC<ProjectsOverviewProps> = () => {
    const [data, setData] = useState(TodoItems);
    const [selectedTasks, setSelectedTasks] = useState(
        TodoItems.map((_, index) => index === 2 || index === 4)
    );
    const handleCheckboxChange = (index: number) => {
        const updatedSelectedTasks = [...selectedTasks];
        updatedSelectedTasks[index] = !updatedSelectedTasks[index];
        setSelectedTasks(updatedSelectedTasks);
    };
    const handleSelectAll = () => {
        const areAllSelected = selectedTasks.every((selected) => selected);
        setSelectedTasks(TodoItems.map(() => !areAllSelected));
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Projects-Projects Overview" />

            <Pageheader title="Dashboards" subtitle="Projects" currentpage="Projects Overview" activepage="Projects Overview" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Project Details
                            </div>
                            <div className="btn-list">
                                <Link to={`${import.meta.env.BASE_URL}dashboards/projects/create-project`} className="btn btn-sm btn-primary btn-wave"><i className="ri-add-line align-middle me-1 fw-medium"></i>Create Project</Link>
                                <Link to="#!" className="btn btn-sm btn-secondary btn-wave"><i className="ri-share-line align-middle fw-medium me-1"></i>Share</Link>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center mb-4 gap-2 flex-wrap">
                                <div className="lh-1">
                                    <span className="avatar avatar-lg me-1 bg-primary"><i className="ri-stack-line fs-24 lh-1"></i></span>
                                </div>
                                <div>
                                    <h6 className="fw-medium mb-2">
                                        E-commerce Platform
                                    </h6>
                                    <SpkBadge variant="" Customclass="badge bg-success-transparent"> In progress</SpkBadge>
                                    <span className="text-muted fs-12"><i className="ri-circle-fill text-success mx-2 fs-9"></i>Last Updated 1 Day Ago</span>
                                </div>
                                <div className="ms-auto align-self-start">
                                    <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-icon btn-sm btn-primary-light no-caret" Toggletext="" Icon={true} IconClass="fe fe-more-vertical">
                                        <Dropdown.Item href="#!"><i className="ri-eye-line align-middle me-1 d-inline-block"></i>View</Dropdown.Item>
                                        <Dropdown.Item href="#!"><i className="ri-edit-line align-middle me-1 d-inline-block"></i>Edit</Dropdown.Item>
                                        <Dropdown.Item href="#!"><i className="ri-delete-bin-line me-1 align-middle d-inline-block"></i>Delete</Dropdown.Item>
                                    </SpkDropdown>
                                </div>
                            </div>
                            <div className="fs-15 fw-medium mb-2">Project Description :</div>
                            <p className="text-muted mb-4">The Customer Feedback Dashboard Development project aims to create a comprehensive dashboard that aggregates and visualizes customer feedback data. This will enable our team to gain actionable insights and improve customer satisfaction.</p>
                            <div className="d-flex gap-5 mb-4 flex-wrap">
                                <div className="d-flex align-items-center gap-2 me-3">
                                    <span className="avatar avatar-md avatar-rounded me-1 bg-success"><i className="ri-calendar-event-line fs-18 lh-1 align-middle"></i></span>
                                    <div>
                                        <div className="fw-medium mb-0">
                                            Start Date
                                        </div>
                                        <span className="fs-12 text-muted">March 1, 2025</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 me-3">
                                    <span className="avatar avatar-md avatar-rounded me-1 bg-info"><i className="ri-time-line fs-18 lh-1 align-middle"></i></span>
                                    <div>
                                        <div className="fw-medium mb-0">
                                            End Date
                                        </div>
                                        <span className="fs-12 text-muted">July 15, 2025</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="avatar avatar-md avatar-rounded me-1"><Image width={40} height={40} src={face11} alt="" /></span>
                                    <div>
                                        <span className="d-block fs-14 fw-medium">John Smith</span>
                                        <span className="fs-12 text-muted">Project Manager</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="row gy-3">
                                    <div className="col-xl-12">
                                        <div className="fs-15 fw-medium mb-2">Key tasks :</div>
                                        <ul className="task-details-key-tasks mb-0">
                                            <li>Initial planning phase of the project including scoping and goal setting.</li>
                                            <li>Designing the product layout, wireframes, and UI elements.</li>
                                            <li>Coding and development of the website interface, functionality, and integration.</li>
                                            <li>Testing the product and website for bugs and quality assurance checks.</li>
                                            <li>Deploy the final product to the live server.</li>
                                            <li>Perform usability testing and iterate based on feedback.</li>
                                        </ul>
                                    </div>
                                    <Col xl={12}>
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="fs-15 fw-medium">Sub Tasks :</div>
                                            <Link to="#!" className="btn btn-primary-light btn-wave btn-sm">See More</Link>
                                        </div>
                                        <ListGroup>
                                            {Tasks.map(task => (
                                                <ListGroup.Item key={task.id} className="list-group-item">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-2">
                                                            <i className="ri-link fs-15 lh-1 p-1 bg-primary-transparent rounded-circle"></i>
                                                        </div>
                                                        <div className="fw-medium">{task.title}</div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                </div>
                            </div>
                            <div className="fs-15 fw-medium mb-2">Skills :</div>
                            <div className="d-flex gap-2 flex-wrap">
                                {Badges.map((badge, index) => (
                                    <SpkBadge variant="" key={index} Customclass={`badge ${badge.className}`}>
                                        {badge.label}
                                    </SpkBadge>
                                ))}
                            </div>
                        </Card.Body>
                        <div className="card-footer">
                            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                <div className="d-flex gap-3 align-items-center">
                                    <span className="fs-12">Assigned To :</span>
                                    <div className="avatar-list-stacked">
                                        <SpkTooltips placement="top" title="John" tooltipClass="tooltip-primary">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face2} alt="img" />
                                            </span>
                                        </SpkTooltips>
                                        <SpkTooltips placement="top" title="Emily" tooltipClass="tooltip-primary">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face8} alt="img" />
                                            </span>
                                        </SpkTooltips>
                                        <SpkTooltips placement="top" title="Liam" tooltipClass="tooltip-primary">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face5} alt="img" />
                                            </span>
                                        </SpkTooltips>
                                        <SpkTooltips placement="top" title="Sophia" tooltipClass="tooltip-primary">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face10} alt="img" />
                                            </span>
                                        </SpkTooltips>
                                        <SpkTooltips placement="top" title="Charlotte" tooltipClass="tooltip-primary">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face15} alt="img" />
                                            </span>
                                        </SpkTooltips>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 align-items-center">
                                    <span className="fs-12">Status :</span>
                                    <span className="d-block"><SpkBadge variant="info" Customclass="badge">On going</SpkBadge></span>
                                </div>
                                <div className="d-flex gap-3 align-items-center">
                                    <span className="fs-12">Priority :</span>
                                    <span className="d-block fs-14 fw-medium"><SpkBadge variant="secondary" Customclass="badge">Medium</SpkBadge></span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Project Documents
                            </div>
                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="View All" Customtoggleclass="btn btn-light btn-full btn-sm no-caret" IconClass="ti ti-chevron-down ms-1" Icon={true}>
                                <Dropdown.Item as="li" href="#!">Download</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Import</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Export</Dropdown.Item>
                            </SpkDropdown>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group-flush">
                                {Filedocument.map((file) => (
                                    <ListGroup.Item key={file.id} className="">
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md avatar-rounded ${file.avatarClass} bg-light lh-1`}>
                                                    <Image src={file.img} alt={file.name} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <Link to="#!">
                                                    <span className="d-block fw-medium">{file.name}</span>
                                                </Link>
                                                <span className="d-block text-muted fs-12 fw-normal">{file.size}</span>
                                            </div>
                                            <div className="btn-list">
                                                <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-info-light btn-wave">
                                                    <i className="ri-edit-line"></i>
                                                </SpkButton>
                                                <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-danger-light btn-wave">
                                                    <i className="ri-delete-bin-line"></i>
                                                </SpkButton>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card justify-content-between">
                        <Card.Header>
                            <div className="card-title">Project Discussions</div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled project-timeline">
                                {TimelineMessages.map((msg) => (
                                    <li key={msg.id}>
                                        <div>
                                            <span className="avatar avatar-sm avatar-rounded project-timeline-avatar">
                                                <Image width={28} height={28} src={msg.avatar} alt={msg.name} />
                                            </span>
                                            <div className="mb-2 d-flex align-items-start gap-2 flex-wrap">
                                                <div>
                                                    <span className="fw-medium">{`${msg.name} (${msg.role})`}</span>
                                                </div>
                                                <span className="ms-auto bg-light text-default badge">{msg.time}</span>
                                            </div>
                                            <p className="text-muted mb-2">{msg.message}</p>
                                            {msg.attachment && (
                                                <p className="project-activity-media mb-0">
                                                    <Link to="#!">
                                                        <Image width={64} height={64} src={msg.attachment.img} alt="attachment" className="img-fluid bg-light" />
                                                    </Link>
                                                    <span className="fs-11 text-muted ms-2">{msg.attachment.size}</span>
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-sm-flex align-items-center lh-1">
                                <div className="me-sm-2 mb-2 mb-sm-0 p-1 rounded-circle bg-primary-transparent d-inline-block">
                                    <Image width={28} height={28} src={face5} alt="" className="avatar avatar-sm avatar-rounded" />
                                </div>
                                <div className="flex-fill">
                                    <div className="input-group flex-nowrap">
                                        <Form.Control type="text" className="w-sm-50 border shadow-none" placeholder="Share your thoughts" aria-label="Recipient's username with two button addons" />
                                        <SpkButton Buttonvariant="" Customclass="btn-primary-light btn-sm btn-wave wave-effect waves-light" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                        <SpkButton Buttonvariant="" Customclass="btn-primary-light btn-sm btn-wave wave-effect waves-light" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                        <SpkButton Buttonvariant="" Customclass="btn-primary-light btn-sm btn-wave wave-effect waves-light" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                        <SpkButton Buttonvariant="" Customclass="btn-primary btn-wave text-nowrap  wave-effect waves-light" Buttontype="button">Post</SpkButton>
                                    </div>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">To Do Tasks</div>
                            <div className="btn btn-sm btn-primary-light btn-wave"><i className="ri-add-line align-middle me-1 fw-medium"></i>Add Task</div>
                        </Card.Header>
                        <Card.Body className="p-0 position-relative" id="todo-content">
                            <div>
                                <div className="table-responsive">
                                    <Table className="table text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input className="form-check-input check-all" type="checkbox" checked={selectedTasks.every((selected) => selected)} onChange={handleSelectAll} id="all-tasks" value="" aria-label="..." />
                                                </th>
                                                <th className="todolist-handle-drag"></th>
                                                <th scope="col">Task Title</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">End Date</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <ReactSortable
                                            list={data}
                                            setList={setData}
                                            className="sortable-table"
                                            animation={150} // Adjust the animation speed
                                            handle=".todo-handle" // This makes only the drag handle element draggable
                                            tag='tbody'
                                        >
                                            {data.map((item, index) => (
                                                <tr className="todo-box" key={item.id}>

                                                    <td className={`task-checkbox ${index === TodoItems.length - 1 ? 'border-bottom-0' : ''}`}>
                                                        <input className="form-check-input" checked={selectedTasks[index]} onChange={() => handleCheckboxChange(index)} aria-label={`Task ${item.id}`} type="checkbox" />
                                                    </td>

                                                    <td className={index === TodoItems.length - 1 ? 'border-bottom-0' : ''}>
                                                        <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-sm btn-wave btn-light todo-handle">: :</SpkButton>
                                                    </td>
                                                    <td className={index === TodoItems.length - 1 ? 'border-bottom-0' : ''}>
                                                        <div className="fw-medium todo-task-title">{item.title}</div>
                                                    </td>
                                                    <td className={index === TodoItems.length - 1 ? 'border-bottom-0' : ''}>
                                                        <SpkBadge variant="" Customclass={`badge ${item.badgeClass}`}>
                                                            <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle"></i>
                                                            {item.status}
                                                        </SpkBadge>
                                                    </td>
                                                    <td className={index === TodoItems.length - 1 ? 'border-bottom-0' : ''}>
                                                        {item.date}
                                                    </td>
                                                    <td className={`text-end ${index === TodoItems.length - 1 ? 'border-bottom-0' : ''}`}>
                                                        <div className="d-flex gap-2">
                                                            <Link to="#!" className="btn btn-icon btn-sm btn-info-light btn-wave">
                                                                <i className="ri-edit-line"></i>
                                                            </Link>
                                                            <Link to="#!" className="btn btn-icon btn-sm btn-danger-light btn-wave">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </ReactSortable>
                                    </Table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ProjectsOverview;