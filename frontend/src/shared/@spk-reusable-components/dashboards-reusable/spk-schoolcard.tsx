
import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";

interface SchoolCardProps {
  cardClass?: string;
  bodyClass?: string;
  school: {
    title: string;
    value: string | number;
    percent: string;
    badgeColor: string;
    svgColor: string;
    svgIcon: React.ReactNode;
    icon?:string;
  };
}

const SpkSchoolCard: React.FC<SchoolCardProps> = ({ cardClass, bodyClass, school }) => {
  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="d-flex align-items-center gap-2 justify-content-between">
            <div>
              <span className="d-block mb-1">{school.title}</span>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="fw-semibold mb-0">{school.value}</h5>
                <div className="fs-12 text-muted">
                  <SpkBadge variant="" Customclass={`bg-${school.badgeColor}-transparent rounded-pill d-inline-flex align-items-center`}>
                    <i className={`ti ti-trending-${school.icon} me-1 align-middle`}></i>{school.percent}
                  </SpkBadge>   This Year
                </div>
              </div>
            </div>
            <div className="lh-1">
              <span className={`avatar avatar-lg bg-${school.svgColor}-transparent svg-${school.svgColor}`}>
                {school.svgIcon}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkSchoolCard;
