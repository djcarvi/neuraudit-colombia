
import React, { Fragment } from "react";
import { Card } from "react-bootstrap";

interface MedicalCardData {
  title: string;
  value: string | number;
  month: string;
  percent: string;
  percentColor: string;
  svgColor: string;
  svgIcon: React.ReactNode;
  icon:string;
}

interface SpkMedicalCardProps {
  cardClass?: string;
  bodyClass?: string;
  medical: MedicalCardData;
}

const SpkMedicalCard: React.FC<SpkMedicalCardProps> = ({ cardClass, bodyClass, medical}) => {

  return (
    
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="d-flex align-items-start justify-content-between mb-2">
            <div className="flex-fill">
              <div className="mb-2">{medical.title}</div>
              <h4 className={`fw-semibold text-${medical.svgColor} mb-0`}>{medical.value}</h4>
            </div>
            <div>
              <span className={`avatar avatar-md bg-${medical.svgColor}-transparent svg-${medical.svgColor}`}>
                {medical.svgIcon}
              </span>
            </div>
          </div>
          <div className="d-flex fs-13 align-items-center justify-content-between">
            <div className="text-muted">{medical.month}</div>
            <div className={`text-${medical.percentColor} fw-medium d-inline-flex`}>
              <i className={medical.icon}></i>
              {medical.percent}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkMedicalCard;
