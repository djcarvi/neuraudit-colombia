import { Fragment } from "react";
import { Card } from "react-bootstrap";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";

interface SpkHrmCardProps {
  cardClass?: string;
  bodyClass?: string;
  hrm: {
    svgColor?: string;
    svgIcon?: React.ReactNode;
    title?: string;
    value?: string;
    iconColor?: string;
    iconClass?: string;
    percent?: string;
    year?: string;
  };
}

const SpkHrmCard: React.FC<SpkHrmCardProps> = ({ cardClass, bodyClass, hrm }) => {

  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="mb-3">
            <span className={`avatar avatar-lg avatar-rounded bg-${hrm.svgColor}-transparent svg-${hrm.svgColor}`}>
              {hrm.svgIcon}
            </span>
          </div>
          <div className="text-muted mb-2">
            {hrm.title}
          </div>
          <div className="d-flex align-items-end gap-2 flex-wrap">
            <h5 className="fw-semibold mb-0 lh-1">{hrm.value}</h5>
            <div>
              <SpkBadge variant="" Customclass={`badge bg-${hrm.iconColor}-transparent rounded-pill`}>
                <i className={hrm.iconClass}></i>{hrm.percent}
              </SpkBadge>
              <span className="text-muted fs-12">  {hrm.year}</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};
export default SpkHrmCard;
