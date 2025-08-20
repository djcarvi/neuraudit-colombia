import React, { Fragment, type JSX } from "react";
import { Card } from "react-bootstrap";

interface Project {
  title: string;
  price: string | number;
  svgColor: string;
  svgIcon: JSX.Element;
}

interface SpkDashboardCardProps {
  project: Project; 
  cardClass?: string;
  bodyClass?: string;
}

const SpkDashboardCard: React.FC<SpkDashboardCardProps> = ({ project, cardClass, bodyClass }) => {

  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="d-flex align-items-start gap-3">
            <div className="lh-1">
              <span className={`avatar avatar-md bg-${project.svgColor}-transparent svg-${project.svgColor}`}>
                {project.svgIcon}
              </span>
            </div>
            <div>
              <span className="d-block text-muted mb-1">{project.title}</span>
              <h5 className="fw-semibold mb-0">{project.price}</h5>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkDashboardCard;
