
import { Listviewassigneddata, Prioritydata, Statusdata, taskData, Taskstable } from "../../../../shared/data/applications/task/listviewdata";
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Modal,  Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkListCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";

interface TaskListViewProps { }

const TaskListView: React.FC<TaskListViewProps> = () => {

    function getStatusColor(status: string): string {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'orange';
            case 'Pending':
                return 'info';
            default:
                return 'secondary';
        }
    }

    function getPriorityClass(priority: string): string {
        switch (priority) {
            case 'High':
                return 'bg-danger-transparent';
            case 'Medium':
                return 'bg-warning-transparent';
            case 'Low':
                return 'bg-teal-transparent';
            default:
                return 'bg-secondary';
        }
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [dates, setDates] = useState<{ [key: string]: Date | string }>({});
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

    const [allData, setAllData] = useState(Taskstable)

    const handleRemove = (id: string) => {
        const newList = allData.filter((idx) => idx.id !== id)
        setAllData(newList)
    }
const [selectedTasks, setSelectedTasks] = useState(
    Taskstable.map((_, index) => index === 1 || index === 4 || index === 5 || index === 7)
    );
    const handleCheckboxChange = (index: number) => {
        const updatedSelectedTasks = [...selectedTasks];
        updatedSelectedTasks[index] = !updatedSelectedTasks[index];
        setSelectedTasks(updatedSelectedTasks);
    };
    const handleSelectAll = () => {
        const areAllSelected = selectedTasks.every((selected) => selected);
        setSelectedTasks(Taskstable.map(() => !areAllSelected));
    };
    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Tasks-List View" />

            <Pageheader title="Applications" subtitle="Tasks" currentpage="List View" activepage="List View" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Row>
                        {taskData.map((idx, index) => (
                            <Col xl={3} lg={6} key={index}>
                                <SpkListCard titleClass="mb-2 fs-12" listCard={true} cardClass={idx.cardClass} list={idx} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Col xxl={12} xl={12} className="">
                <Card className="custom-card">
                    <Card.Header className="justify-content-between">
                        <div className="card-title">
                            Total Tasks
                        </div>
                        <div className="d-flex">
                            <SpkButton Buttonvariant="primary" onClickfunc={handleShow} Customclass="btn btn-sm btn-wave waves-light me-1" data-bs-toggle="modal" data-bs-target="#create-task"><i className="ri-add-line fw-medium align-middle me-1"></i> Create Task</SpkButton>
                            <Modal show={show} onHide={handleClose} className="modal fade" id="create-task" tabIndex={-1} centered>
                                <Modal.Header>
                                    <h6 className="modal-title">Add Task</h6>
                                    <button  type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row className=" gy-2">
                                        <Col xl={6}>
                                            <Form.Label htmlFor="task-name" className="">Task Name</Form.Label>
                                            <Form.Control type="text" className="" id="task-name" placeholder="Task Name" />
                                        </Col>
                                        <Col xl={6}>
                                            <Form.Label htmlFor="task-id" className="">Task ID</Form.Label>
                                            <Form.Control type="text" className="" id="task-id" placeholder="Task ID" />
                                        </Col>
                                        <Col xl={6}>
                                            <Form.Label className="">Assigned Date</Form.Label>
                                            <div className="form-group">
                                                <div className="input-group flex-nowrap">
                                                    <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                                    <SpkDatepickr className="form-control" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" selected={dates["startDate"] ? new Date(dates["startDate"]) : null} onChange={(date: Date | null) => handleDateChange("startDate", date)} placeholderText='Choose date and time' showTimeInput />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <Form.Label>Due Date</Form.Label>
                                            <div className="form-group">
                                                <div className="input-group flex-nowrap">
                                                    <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                                    <SpkDatepickr className="form-control" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" selected={dates["dueDate"] ? new Date(dates["dueDate"]) : null} onChange={(date: Date | null) => handleDateChange("dueDate", date)} placeholderText='Choose date and time' showTimeInput />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <Form.Label>Status</Form.Label>
                                            <SpkSelect name="state" option={Statusdata} mainClass="js-example-placeholder-multiple w-full js-states" menuplacement='auto' classNameprefix="Select2" defaultvalue={[Statusdata[0]]} />
                                        </Col>
                                        <Col xl={6}>
                                            <Form.Label>Priority</Form.Label>
                                            <SpkSelect name="state" option={Prioritydata} mainClass="js-example-placeholder-multiple w-full js-states" menuplacement='auto' classNameprefix="Select2" defaultvalue={[Prioritydata[0]]} />
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Label>Assigned To</Form.Label>
                                            <SpkSelect multi name="state" option={Listviewassigneddata} mainClass="js-example-placeholder-multiple w-full js-states"
                                                menuplacement='auto' classNameprefix="Select2" />
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <div className="modal-footer">
                                    <SpkButton Buttontype="button" onClickfunc={handleClose} Buttonvariant="light" Customclass="" Buttondismiss="modal">
                                        Cancel
                                    </SpkButton>
                                    <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="" >
                                        Add Task
                                    </SpkButton>
                                </div>
                                {/* </div> */}
                            </Modal>
                            <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-icon btn-secondary-light btn-sm btn-wave waves-light no-caret" IconClass="ti ti-dots-vertical" Icon={true}>
                                <li><Dropdown.Item >New Tasks</Dropdown.Item></li>
                                <li><Dropdown.Item >Pending Tasks</Dropdown.Item></li>
                                <li><Dropdown.Item >Completed Tasks</Dropdown.Item></li>
                                <li><Dropdown.Item >Inprogress Tasks</Dropdown.Item></li>
                            </SpkDropdown>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" headerClass="table-light" checked={selectedTasks.every((selected) => selected)} onChange={handleSelectAll} showCheckbox={true} header={[{ title: 'Task' }, { title: 'Task ID' }, { title: 'Assigned Date' }, { title: 'Status' }, { title: 'Due Date' }, { title: 'Priority' }, { title: 'Assigned To' }, { title: 'Action' }]} >
                                {allData.map((task,index) => (
                                    <tr className="task-list" key={task.id}>
                                        <td className="task-checkbox">
                                            <input className="form-check-input" type="checkbox" aria-label="..." checked={selectedTasks[index]} onChange={() => handleCheckboxChange(index)}  />
                                        </td>
                                        <td>
                                            <Link to="#!" className="fw-medium" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                {task.title}
                                            </Link>
                                        </td>
                                        <td><span className="fw-medium">{task.code}</span></td>
                                        <td>{task.startDate}</td>
                                        <td>
                                            <span className={`fw-medium text-${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td>{task.dueDate}</td>
                                        <td>
                                            <SpkBadge variant="" Customclass={`badge ${getPriorityClass(task.priority)}`}>
                                                {task.priority}
                                            </SpkBadge>
                                        </td>
                                        <td>
                                            <div className="avatar-list-stacked">
                                                {task.avatars.map((src, idx) => (
                                                    <span className="avatar avatar-sm avatar-rounded" key={idx}>
                                                        <Image  src={src} alt="img" />
                                                    </span>
                                                ))}
                                                {task.extraMembers > 0 && (
                                                    <Link  className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white" to="#!">
                                                        +{task.extraMembers}
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <SpkTooltips placement="top" title="Edit">
                                                <SpkButton Buttonvariant="" Customclass="btn btn-primary-light btn-icon btn-sm">
                                                    <i className="ri-edit-line"></i>
                                                </SpkButton>
                                            </SpkTooltips>
                                            <SpkButton Buttonvariant="" onClickfunc={() => handleRemove(task.id)} Customclass="btn btn-danger-light btn-icon ms-1 btn-sm task-delete-btn">
                                                <i className="ri-delete-bin-5-line"></i>
                                            </SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex align-items-center">
                            <div> Showing 10 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                            <div className="ms-auto">
                                <nav aria-label="Page navigation" className="pagination-style-2">
                                    <Pagination className="mb-0 flex-wrap">
                                        <Pagination.Prev disabled>Prev</Pagination.Prev>
                                        <Pagination.Item>1</Pagination.Item>
                                        <Pagination.Item active>2</Pagination.Item>
                                        <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                        <Pagination.Item>17</Pagination.Item>
                                        <Pagination.Next className="text-primary">Next</Pagination.Next>
                                    </Pagination>
                                </nav>
                            </div>
                        </div>
                    </Card.Footer>
                </Card>
            </Col>

            {/* <!--End:: row - 2 -- > */}

        </Fragment >
    )
};

export default TaskListView;