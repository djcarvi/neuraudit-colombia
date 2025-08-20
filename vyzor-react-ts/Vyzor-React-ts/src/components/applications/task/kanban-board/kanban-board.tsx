
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { FilePond } from "react-filepond";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Link } from "react-router-dom";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import {  KanbanCards, kanbanCardsdanger, kanbanCardsinfo, kanbanCardswarning, Option1, kanbanCardsuccess, simpleItems1, cars } from "../../../../shared/data/applications/task/kanbandata";
import SpkKanbanCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-kanbancard";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import dragula from "dragula";
import face2 from '../../../../assets/images/faces/2.jpg';
import face8 from '../../../../assets/images/faces/8.jpg';
import face4 from '../../../../assets/images/faces/4.jpg';
import face10 from '../../../../assets/images/faces/10.jpg';
import face13 from '../../../../assets/images/faces/13.jpg';
interface KanbanBoardProps { }

const KanbanBoard: React.FC<KanbanBoardProps> = () => {

    const [files, setFiles] = useState<any>([]);
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

    const [show, setShow] = useState<{ [key: string]: boolean }>({});

    const handleShow = (offcanvasName: string) => {
        setShow((prevShow) => {
            if (prevShow[offcanvasName] !== true) {
                return { ...prevShow, [offcanvasName]: true };
            }
            return prevShow;
        });
    };

    const handleClose = (offcanvasName: string) => {
        setShow((prevShow) => {
            if (prevShow[offcanvasName] !== false) {
                return { ...prevShow, [offcanvasName]: false };
            }
            return prevShow;
        });
    };

    const leftContainerRef = useRef(null);
    const rightContainerRef = useRef(null);
    const topContainerRef = useRef(null);
    const bottomContainerRef = useRef(null);
    const lastContainerRef = useRef(null);

    useEffect(() => {
        if (leftContainerRef.current && rightContainerRef.current) {
            dragula([leftContainerRef.current, rightContainerRef.current, topContainerRef.current, bottomContainerRef.current, lastContainerRef.current]);
      
            if(document.querySelector('.firstdrag')?.classList.contains('task-Null'))
            {
                
                document.querySelector('.view-more-button')?.classList.add('d-none'); 
            }
          }
    }, []);

    const leftButtonRef = useRef(null);
    const rightButtonRef = useRef(null);
    const topButtonRef = useRef(null);
    const bottomButtonRef = useRef(null);
    const lastButtonRef = useRef(null);

    // Store all the refs in an array
    const elementsToModify = [
        { containerRef: leftContainerRef, buttonRef: leftButtonRef },
        { containerRef: rightContainerRef, buttonRef: rightButtonRef },
        { containerRef: topContainerRef, buttonRef: topButtonRef },
        { containerRef: bottomContainerRef, buttonRef: bottomButtonRef },
        { containerRef: lastContainerRef, buttonRef: lastButtonRef }
    ];

    const OnDivChange = () => {
        elementsToModify.forEach(({ containerRef, buttonRef }:any) => {
            const element = containerRef.current;
            const button = buttonRef.current;

            if (element?.children.length <= 0) {
                element?.classList.add("task-Null");
                if (button) {
                    button.classList.add("d-none");
                }
            } else {
                element?.classList.remove("task-Null");
                if (button) {
                    button.classList.remove("d-none");
                }
            }
        });
    };


    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Apps-Kanban Board" />

            <Pageheader title="Applications" subtitle="Task" currentpage="Kanban Board" activepage="Kanban Board" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="p-3">
                            <div className="d-sm-flex align-items-center flex-wrap gap-3 kanban-header justify-content-between">
                                <div className="d-sm-flex align-items-center flex-wrap gap-3 w-sm-50 mb-sm-0 mb-3">
                                    <div className="mb-sm-0 mb-3">
                                        <SpkButton Buttonvariant="primary" Customclass="btn me-2" onClickfunc={() => handleShow("addmodal")}><i className="ri-add-line me-1 fw-medium align-middle"></i>New Board</SpkButton>
                                    </div>
                                    <div>
                                        <div className="avatar-list-stacked">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face2} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face8} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face2} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face10} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face4} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face13} alt="img" />
                                            </span>
                                            <Link className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white" to="#!">
                                                +8
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center flex-wrap justify-content-end gap-3 custom-kanaban">
                                    <SpkSelect name="colors" option={Option1} mainClass="w-full !rounded-md"
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Option1[0]]} />
                                    <div className="d-flex mt-sm-0 mt-3" role="search">
                                        <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <SpkButton Buttonvariant="" Customclass="btn btn-light" Buttontype="submit">Search</SpkButton>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start::row-2 --> */}

            <div className="VYZOR-kanban-board">
                <div className="kanban-tasks-type new">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">New - 04</span>
                            <div>
                                <Link aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Add Task
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="new-tasks">
                        <div id="new-tasks-draggable" data-view-btn="new-tasks" ref={leftContainerRef} onMouseEnter={OnDivChange}>

                            {KanbanCards.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={leftButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-primary-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type todo">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">Todo - 36</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Add Task
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="todo-tasks">
                        <div id="todo-tasks-draggable" data-view-btn="todo-tasks" ref={rightContainerRef} onMouseEnter={OnDivChange}>

                            {kanbanCardswarning.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={rightButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-warning-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type in-progress">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">On Going - 25</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Add Task
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="inprogress-tasks">
                        <div id="inprogress-tasks-draggable" data-view-btn="inprogress-tasks" ref={topContainerRef} onMouseEnter={OnDivChange}>
                            {/*<div className="task-null-background" draggable="false">
                                <Image  src={media81} alt="" />
                            </div>*/}
                            {kanbanCardsinfo.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={topButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-info-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type inreview">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">In Review - 02</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Add Task
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="inreview-tasks">
                        <div id="inreview-tasks-draggable" data-view-btn="inreview-tasks" ref={bottomContainerRef} onMouseEnter={OnDivChange}>
                            {/*<div className="task-null-background" draggable="false">
                                <Image  src={media81} alt="" />
                            </div>*/}
                            {kanbanCardsdanger.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={bottomButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-danger-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type completed">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">Completed - 36</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Add Task
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="completed-tasks">
                        <div id="completed-tasks-draggable" data-view-btn="completed-tasks" ref={lastContainerRef} onMouseEnter={OnDivChange}>
                            {/*<div className="task-null-background" draggable="false">
                                <Image  src={media81} alt="" />
                            </div>*/}
                            {kanbanCardsuccess.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={lastButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-success-light btn-wave">View More</SpkButton>
                    </div>
                </div>
            </div>

            {/* <!--End::row-2 --> */}

            {/* Modal Code */}

            <Modal show={show["addmodal"] || false} onHide={() => handleClose("addmodal")} centered className="fade" id="add-board" tabIndex={-1} aria-hidden="true">
                <Modal.Header>
                    <h6 className="modal-title">Add Board</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose("addmodal")} Customclass="btn-close" Buttondismiss="modal" Buttonlabel="Close"></SpkButton>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xl={12}>
                            <label htmlFor="board-title" className="form-label">Task Board Title</label>
                            <Form.Control type="text" className="" id="board-title" placeholder="Board Title" />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" Buttontype="button" onClickfunc={() => handleClose("addmodal")} data-bs-dismiss="modal">
                        Cancel
                    </SpkButton>
                    <SpkButton Buttonvariant="primary" Buttontype="button">
                        Add Board
                    </SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- Start::add task modal --> */}

            <Modal show={show["taskmodal"] || false} onHide={() => handleClose("taskmodal")} centered className="fade" id="add-task" tabIndex={-1}>
                <div className="">
                    <div className="">
                        <Modal.Header>
                            <Modal.Title as="h6" >Add Task</Modal.Title>
                            <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn-close" data-bs-dismiss="modal"
                                aria-label="Close" onClickfunc={() => handleClose("taskmodal")} ></SpkButton>
                        </Modal.Header>
                        <Modal.Body className="px-4">
                            <Row className="gy-2">
                                <Col xl={6}>
                                    <Form.Label htmlFor="task-name" className="form-label">Task Name</Form.Label>
                                    <input type="text" className="form-control" id="task-name" placeholder="Task Name" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="task-id" className="form-label">Task ID</Form.Label>
                                    <input type="text" className="form-control" id="task-id" placeholder="Task ID" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="text-area" className="form-label">Task Description</Form.Label>
                                    <textarea className="form-control" id="text-area" rows={2}
                                        placeholder="Write Description"></textarea>
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="text-area" className="form-label">Task Images</Form.Label>
                                    <FilePond className="multiple-filepond" files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click' />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="form-label">Assigned To</Form.Label>
                                    <SpkSelect name="colors" multi={true} option={simpleItems1} mainClass="basic-multi-select" placeholder="Sort By" menuplacement='auto' classNameprefix="Select2" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label">Target Date</Form.Label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-text text-muted"> <i
                                                className="ri-calendar-line"></i> </div>
                                            <SpkDatepickr className="form-control" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" selected={dates["TargetDate"] ? new Date(dates["TargetDate"]) : null} onChange={(date: Date | null) => handleDateChange("TargetDate", date)} placeholderText='Choose date and time' showTimeInput />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label">Tags</Form.Label>
                                    <SpkSelect multi name="colors" option={cars} mainClass="w-full !rounded-md" menuplacement='top' classNameprefix="Select2" />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <SpkButton Buttonvariant="light" Buttontype="button" Customclass="btn btn-light" data-bs-dismiss="modal" onClickfunc={() => handleClose("taskmodal")} >Cancel</SpkButton>
                            <SpkButton Buttonvariant='primary' Buttontype="button" Customclass="btn btn-primary">Add Task</SpkButton>
                        </Modal.Footer>
                    </div>
                </div>
            </Modal>

            {/* <!-- End::add task modal --> */}

        </Fragment>
    )
};

export default KanbanBoard;