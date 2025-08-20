
import { Categories, Listviewassigneddata, Prioritydata, Statusdata, TodoCategories, Todotables } from "../../../shared/data/applications/todolistdata";
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Modal, Pagination, Row, Table } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkDatepickr from "../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import media66 from '../../../assets/images/media/media-66.png';
import { ReactSortable } from "react-sortablejs";
interface ToDoListProps { }

const ToDoList: React.FC<ToDoListProps> = () => {
    const [data, setData] = useState(Todotables);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedTasks, setSelectedTasks] = useState(
        Todotables.map((_, index) => index === 2 || index === 4)
    );
    const handleCheckboxChange = (index: number) => {
        const updatedSelectedTasks = [...selectedTasks];
        updatedSelectedTasks[index] = !updatedSelectedTasks[index];
        setSelectedTasks(updatedSelectedTasks);
    };
    const handleSelectAll = () => {
        const areAllSelected = selectedTasks.every((selected) => selected);
        setSelectedTasks(Todotables.map(() => !areAllSelected));
    };

    const [dates, setDates] = useState<{ [key: string]: Date | string | null }>({});
    const handleDateChange = (key: string, date: Date | null) => {
        if (date) {
            setDates((prevDates) => ({
                ...prevDates,
                [key]: date,
            }));
        } else {
            setDates((prevDates) => {
                const { [key]: removedKey, ...rest } = prevDates;
                return rest;
            });
        }
    };

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Apps-To Do List" />

            <Pageheader title="Applications" currentpage="To Do List" activepage="To Do List" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Card.Body className="p-0">
                            <div className="p-3 task-navigation border-bottom border-block-end-dashed">
                                <div className="d-grid">
                                    <SpkButton Buttonvariant="" onClickfunc={handleShow} Customclass="btn btn-primary rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#addtask">
                                        <i className="ri-add-circle-line fs-16 align-middle me-1"></i>Create New Task
                                    </SpkButton>
                                </div>
                                <ul className="list-unstyled task-main-nav mb-0 mt-3">
                                    <li className="px-0 pt-0">
                                        <span className="fs-11 text-muted op-7 fw-medium">Tasks</span>
                                    </li>
                                    {TodoCategories.map((category) => (
                                        <li key={category.id} className={category.active ? 'active' : ''}>
                                            <Link to="#!">
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2 lh-1 todo-menu-icon">{category.icon}</span>
                                                    <span className="flex-fill text-nowrap">{category.name}</span>
                                                    {category.badgeCount && (
                                                        <SpkBadge variant="" Customclass="bg-success rounded-pill">{category.badgeCount}</SpkBadge>
                                                    )}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="px-0 pt-2">
                                        <span className="fs-11 text-muted op-7 fw-medium">Categories</span>
                                    </li>
                                    {Categories.map((category) => (
                                        <li key={category.id}>
                                            <Link to="#!">
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <span className="me-2 lh-1">
                                                        <i className={`${category.iconClass} ${category.textColor}`}></i>
                                                    </span>
                                                    <span className="flex-fill text-nowrap">{category.name}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-3 text-center">
                                <Image src={media66} alt="" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={9}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div>
                                <input className="form-control" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-primary btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
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
                                                <th scope="col">Assigned To</th>
                                                <th scope="col">Priority</th>
                                                <th scope="col">Due Date</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Created On</th>
                                                <th scope="col" className="todolist-progress">Progress</th>
                                                <th scope="col" className="text-end">Action</th>
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
                                            {data.map((task, index) => (
                                                <tr className="todo-box" key={index}>
                                                    <td className="task-checkbox">
                                                        <input className="form-check-input" checked={selectedTasks[index]} onChange={() => handleCheckboxChange(index)} aria-label={`Task ${task.id}`} type="checkbox" />
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-icon btn-sm btn-wave btn-light todo-handle">: :</button>
                                                    </td>
                                                    <td>
                                                        <Link to="#!" className="fw-medium">{task.title}</Link>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xs avatar-rounded">
                                                                    <Image width={20} height={20} src={task.assignee.avatar} alt={task.assignee.name} />
                                                                </span>
                                                            </div>
                                                            <div className="fw-medium">{task.assignee.name}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`fw-medium text-${task.priorityColor}`}>
                                                            <i className="ri-circle-line fw-semibold fs-7 me-2 lh-1 align-middle"></i>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td>{task.dueDate}</td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass={`badge bg-${task.statusColor}-transparent`}>
                                                            {task.status}
                                                        </SpkBadge>
                                                    </td>
                                                    <td>{task.createdDate}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <SpkProgress variant="primary" mainClass="progress-xs w-100" striped animated now={task.progress} />
                                                            <div className="ms-2">{task.progress}%</div>
                                                        </div>
                                                    </td>
                                                    <td className="text-end">
                                                        <SpkDropdown Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill text-muted" Customtoggleclass="btn btn-icon btn-sm btn-wave no-caret">
                                                            <Dropdown.Item as="li" href="#!"><i className="ri-edit-line me-2"></i> Edit</Dropdown.Item>
                                                            <Dropdown.Item as="li" href="#!"><i className="ri-delete-bin-5-line me-2"></i> Delete</Dropdown.Item>
                                                        </SpkDropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                        </ReactSortable>
                                    </Table>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div> Showing 10 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                <div>
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <Pagination className="mb-0">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item active>{1}</Pagination.Item>
                                            <Pagination.Item>{2}</Pagination.Item>
                                            <Pagination.Next>Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: Add new task modal --> */}

            <Modal show={show} onHide={handleClose} centered className="fade" id="create-task" tabIndex={-1}>
                <Modal.Header>
                    <h6 className="modal-title">Create Task</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn-close" Buttondismiss="modal" onClickfunc={handleClose}
                        Buttonlabel="Close"></SpkButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="row gy-2">
                        <Col xl={12}>
                            <Form.Label htmlFor="task-name" className="">Task Name</Form.Label>
                            <Form.Control type="text" className="" id="task-name" placeholder="Task Name" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label>Assigned To</Form.Label>
                            <SpkSelect multi name="state" option={Listviewassigneddata} mainClass="js-example-placeholder-multiple w-full js-states" menuplacement='auto' classNameprefix="Select2" defaultvalue={[Listviewassigneddata[0]]} />
                        </Col>
                        <Col xl={6}>
                            <Form.Label className="">Assigned Date</Form.Label>
                            <div className="form-group">
                                <div className="input-group custom-input-group flex-nowrap">
                                    <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                    <SpkDatepickr className="form-control" selected={dates["assigned"] ? new Date(dates["assigned"]) : null} onChange={(date: Date | null) => handleDateChange("assigned", date)} Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" showTimeInput placeholderText='Choose date and time' />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Form.Label className="">Target Date</Form.Label>
                            <div className="form-group">
                                <div className="input-group custom-input-group flex-nowrap">
                                    <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                    <SpkDatepickr className="form-control" selected={dates["basicDate"] ? new Date(dates["basicDate"]) : null} onChange={(date: Date | null) => handleDateChange("basicDate", date)} Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" showTimeInput placeholderText='Choose date and time' />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Form.Label>Status</Form.Label>
                            <SpkSelect name="state" option={Statusdata} mainClass="js-example-placeholder-multiple w-full js-states" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                        </Col>
                        <Col xl={6}>
                            <Form.Label>Priority</Form.Label>
                            <SpkSelect name="state" option={Prioritydata} mainClass="js-example-placeholder-multiple w-full js-states" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                        </Col>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" Buttontype="button" onClickfunc={handleClose}
                        Buttondismiss="modal">Cancel</SpkButton>
                    <SpkButton Buttonvariant="primary" Buttontype="button">Create</SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- End:: Add new task modal --> */}

        </Fragment>
    )
};

export default ToDoList;