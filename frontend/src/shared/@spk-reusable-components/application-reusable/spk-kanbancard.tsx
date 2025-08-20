import React, { Fragment } from "react";
import { Card, Dropdown, Image } from "react-bootstrap";
import SpkDropdown from "../general-reusable/reusable-uielements/spk-dropdown";
import { Link } from "react-router-dom";

interface Types {
    createdDate: string;
    daysLeft: string;
    tags: string[];
    description?: string;
    title?: string;
    comments: string;
    likes: string;
    avatars: string[];
    Content?: boolean;
    imgSrc?: boolean;
    src?: any;
}

interface SpkKanbanCardProps {
    kanban: Types;
    cardClass?: string;
}

const SpkKanbanCard: React.FC<SpkKanbanCardProps> = ({ kanban, cardClass }) => {
    return (
        <Fragment>
            <Card className={`custom-card ${cardClass || ""}`}>
                <Card.Body className="p-0">
                    <div className="p-3 kanban-board-head">
                        <div className="d-flex text-muted justify-content-between mb-1 fs-12 fw-medium">
                            <div>
                                <i className="ri-time-line me-1 align-middle d-inline-block"></i>
                                Created - {kanban.createdDate}
                            </div>
                            <div>{kanban.daysLeft}</div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                            <div className="task-badges">
                                {kanban.tags.map((tag, index) => (
                                    <span key={index} className={`badge ${index !== 0 ? "ms-1" : ""}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-sm btn-light btn-white no-caret" IconClass="ri-more-2-fill" Icon={true}>
                                <li className=""><Dropdown.Item href="#!"><i className="ri-eye-line me-1 align-middle d-inline-block"></i>View</Dropdown.Item></li>
                                <li className=""><Dropdown.Item href="#!"><i className="ri-delete-bin-line me-1 align-middle d-inline-block"></i>Edit</Dropdown.Item></li>
                                <li><Dropdown.Item href="#!"><i className="ri-edit-line me-1 align-middle d-inline-block"></i>Delete</Dropdown.Item></li>
                            </SpkDropdown>
                        </div>
                        {kanban.Content &&
                            <div className="kanban-content mt-2">
                                <h6 className="fw-medium mb-1 fs-15">{kanban.title}</h6>
                                <div className="kanban-task-description">{kanban.description}</div>
                            </div>
                        }
                        {kanban.imgSrc &&
                            <div className="kanban-content mt-2">
                                <div className="task-image mt-2">
                                    <Image  src={kanban.src} className="img-fluid rounded kanban-image" alt="" />
                                </div>
                                <h6 className="fw-medium mt-2 mb-0">{kanban.title}</h6>
                            </div>
                        }
                    </div>

                    <div className="p-3 border-top border-block-start-dashed">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <Link to="#!" className="me-2 text-primary">
                                    <span className="me-1"><i className="ri-thumb-up-fill align-middle fw-normal"></i></span><span className="fw-medium fs-12">{kanban.likes}</span>
                                </Link>
                                <Link to="#!" className="text-muted">
                                    <span className="me-1"><i className="ri-message-2-line align-middle fw-normal"></i></span><span className="fw-medium fs-12">{kanban.comments}</span>
                                </Link>
                            </div>
                            <div className="avatar-list-stacked">
                                {kanban.avatars.map((src, index) => (
                                    <span key={index} className="avatar avatar-sm avatar-rounded">
                                        <Image src={src} alt={`avatar-${index}`} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default SpkKanbanCard;
