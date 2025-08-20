import { Fragment, type ReactNode } from "react";
import { Card, Dropdown } from "react-bootstrap";
import SpkDropdown from "../general-reusable/reusable-uielements/spk-dropdown";

interface MediaData {
    svgColor?: string;
    svgIcon?: ReactNode;
    title?: string;
    value?: string | number;
    percent?: string;
    percentColor?: string;
}

interface SpkSocialCardProps {
    cardClass?: string;
    media: MediaData;
}

const SpkSocialCard: React.FC<SpkSocialCardProps> = ({ cardClass , media }) => {

    return (
        <Fragment>
            <Card className={`custom-card ${cardClass}`}>
                <Card.Body>
                    <div className="d-flex align-items-start gap-2 flex-wrap">
                        <div className="lh-1">
                            <span className={`avatar avatar-md avatar-rounded bg-${media.svgColor}-transparent svg-${media.svgColor}`}>
                                {media.svgIcon}
                            </span>
                        </div>
                        <div className="flex-fill">
                            <div className="d-flex align-items-end justify-content-between">
                                <span className="d-block mb-1">{media.title}</span>
                                <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-icon btn-sm rounded-circle btn-light no-caret" Icon={true} IconClass="ti ti-dots text-muted fs-5">
                                    <Dropdown.Item href="#!">Today</Dropdown.Item>
                                    <Dropdown.Item href="#!">This Week</Dropdown.Item>
                                    <Dropdown.Item href="#!">This Month</Dropdown.Item>
                                    <Dropdown.Item href="#!">This Year</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                            <div className="d-flex align-items-end justify-content-between">
                                <h4 className="fw-semibold mb-0">{media.value}</h4>
                                <div className={`text-${media.percentColor} fs-13`}>
                                <i className={`ti ti-arrow-${media.percentColor === 'success' ? 'up' : 'down'} me-1`}></i>{media.percent}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default SpkSocialCard;
