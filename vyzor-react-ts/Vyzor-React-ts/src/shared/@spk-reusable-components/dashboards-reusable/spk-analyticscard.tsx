

import { Fragment } from "react";
import { Card } from "react-bootstrap";

interface AnalyticProps {
  svgIcon: React.ReactNode;
  svgColor: string;
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  percent: string;
  year: string;
}

interface SpkAnalyticsCardProps {
  analytic: AnalyticProps;
  cardClass?: string;
  bodyClass?: string;
}

const SpkAnalyticsCard: React.FC<SpkAnalyticsCardProps> = ({analytic, cardClass, bodyClass}) => {
  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="d-flex align-items-start gap-3">
            <div>
              <span className={`avatar avatar-md bg-${analytic.svgColor} svg-white`}>
                {analytic.svgIcon}
              </span>
            </div>
            <div>
              <span className="d-block text-muted">{analytic.title}</span>
              <h5 className="fw-semibold mb-1">{analytic.value}</h5>
              <div className="text-muted fs-12">
                <span className={`text-${analytic.iconColor}`}>
                  <i className={analytic.icon}></i> {analytic.percent}
                </span>{" "}
                {analytic.year}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkAnalyticsCard;
