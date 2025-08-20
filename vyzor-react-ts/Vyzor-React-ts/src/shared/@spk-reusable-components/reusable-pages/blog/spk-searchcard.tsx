
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import React from "react";
import SpkTooltips from "../../general-reusable/reusable-uielements/spk-tooltips";
import { Link } from "react-router-dom";

interface SearchCardProps {
    search: {
        imgSrc: string;
        title: string;
        subTitle: string;
        bgColor: string;
        date: string;
        tags: string[];
    };
    cardClass?: string;
}

const SpkSearchCard: React.FC<SearchCardProps> = ({ search, cardClass = "" }) => {
    return (
        <Fragment>
            <Card className={`custom-card shadow-none ${cardClass}`}>
                <Card.Body>
                    <div className="d-flex align-items-start flex-wrap gap-3 justify-content-between">
                        <div className="d-flex align-items-center">
                            <div>
                                <span className={`avatar avatar-lg avatar-rounded bg-${search.bgColor} bg-opacity-10 border`}>
                                    <Image  src={search.imgSrc} alt="" />
                                </span>
                            </div>
                            <div className="ms-2">
                                <h6 className="fw-medium mb-0 d-flex align-items-center">
                                    <Link to="#!">{search.title}</Link>
                                </h6>
                                <Link to="#!">{search.subTitle}</Link>
                            </div>
                        </div>
                        <div className="btn-list">
                            <SpkTooltips placement="top" title="Add to favourite">
                            <Link to="#!" className="btn btn-sm btn-icon btn-light">
                                <span>
                                    <i className="ri-heart-3-fill align-middle text-muted"></i>
                                </span>
                            </Link>
                            </SpkTooltips>
                            <SpkTooltips placement="top" title="Featured Book">
                            <Link to="#!" className="btn btn-sm btn-icon btn-warning-light">
                                <span>
                                    <i className="ri-star-fill"></i>
                                </span>
                            </Link>
                            </SpkTooltips>
                        </div>
                    </div>
                    <div className="popular-tags my-3">
                        {search.tags.map((tag, index) => (
                            <Link key={index} to="#!" className="badge rounded-pill bg-light text-default me-1">
                                {tag}
                            </Link>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div>
                            <span className="text-muted">Published On</span> -{" "}
                            <span className="fw-medium mb-0">{search.date}</span>
                        </div>
                        <Link to="#!" className="text-primary fw-semibold fs-14">
                            Preview <i className="fe fe-arrow-right"></i>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default SpkSearchCard;
