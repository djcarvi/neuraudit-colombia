

import { Fragment, type ReactNode } from "react";
import { Card } from "react-bootstrap";
import SpkBadge from "../../general-reusable/reusable-uielements/spk-badge";
import CountUp from "react-countup";

interface SpkInvoiceListItem {
  cardClass?: string;
  title: string;
  price: any;
  value: string;
  color: string;
  dollar?: string;
  kelvin?: string;
  arrow: string;
  percent: string;
  percentColor: string;
  svgIcon: ReactNode;
}

interface SpkInvoiceListCardProps {
  list: SpkInvoiceListItem;
}

const SpkInvoiceListCard: React.FC<SpkInvoiceListCardProps> = ({ list }) => {
  return (
    <Fragment>
      <Card className={`custom-card dashboard-main-card ${list.cardClass || ""}`}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-start gap-3">
            <div className="flex-fill">
              <h6 className="mb-2 fs-12">{list.title}</h6>
              <div className="pb-0 mt-0">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h4 className="fw-medium mb-0">
                      {list.dollar}
                      <CountUp className="count-up" end={list.price} />
                      {list.kelvin}
                    </h4>
                    <SpkBadge variant="" Customclass={`bg-${list.color}`}>{list.value}</SpkBadge>
                  </div>
                  <p className="text-muted fs-12 mb-0 lh-1">
                    <span className={`text-${list.percentColor} me-1 fw-medium`}>
                      <i className={`ri-arrow-${list.arrow}-s-line me-1 align-middle`}></i>
                      {list.percent}
                    </span>
                    <span>  this month</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={`avatar avatar-lg bg-${list.color}-transparent svg-${list.color}`}>
              {list.svgIcon}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkInvoiceListCard;
