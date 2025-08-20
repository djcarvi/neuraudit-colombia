import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";

interface Course {
    svgIcon?: React.ReactNode;
    svgColor?: string;
    title?: string;
    value?: string | number;
    percent?: string | number;
    icon?: string;
};

interface SpkCourseCardProps {
    course: Course;
    cardClass?: string;
};

const SpkCourseCard: React.FC<SpkCourseCardProps> = ({ course, cardClass = "" }) => {
    return (
        <Fragment>
            <Card className={`custom-card ${cardClass}`}>
                <Card.Body>
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                        <div className="lh-1">
                            <span className={`avatar avatar-lg avatar-rounded bg-${course.svgColor} svg-white`}>
                                {course.svgIcon}
                            </span>
                        </div>
                        <div>
                            <span className="d-block mb-1">
                                {course.title}
                            </span>
                            <div className="d-flex align-items-center gap-2">
                                <h5 className="fw-semibold mb-0">{course.value}</h5>
                                <SpkBadge variant="" Customclass={`bg-${course.svgColor}-transparent rounded-pill`}>
                                    <i className={course.icon}></i> {course.percent}
                                </SpkBadge>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default SpkCourseCard;
