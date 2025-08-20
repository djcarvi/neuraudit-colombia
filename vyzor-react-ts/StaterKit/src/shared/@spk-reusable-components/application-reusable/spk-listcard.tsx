
import { Fragment, type ReactNode } from "react";
import { Card } from "react-bootstrap";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";
import CountUp from 'react-countup';
interface ListData {
  title?: string;
  count?: any;
  price?: string;
  priceColor?: string;
  iconColor?: string;
  icon?: string;
  smallText?: string;
  avatarClass?: string;
  ValueClass?: string;
  ValueClass1?: string;
  flexClass?: string;
  percent?: string;
  svgIcon?: ReactNode;
  percentColor?:string;
  titles?:string;
  decimals?: number;
}

interface SpkListCardProps {
  cardClass?: string;
  bodyClass?: string;
  list: ListData;
  listCard?: boolean;
  titleClass?: string;
  jobsCard?: boolean
  ListCard?: boolean
 
}

const SpkListCard: React.FC<SpkListCardProps> = ({ cardClass="", bodyClass="", list, listCard, titleClass="", jobsCard }) => {
  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className={`d-flex align-items-start gap-3 flex-wrap ${list.flexClass}`}>
            <div className="flex-fill">
              <span className={titleClass}>{list.title}</span>
              <div className="pb-0 mt-0">
                {listCard &&
                  <div>
                      <span className="fs-13 fw-medium">{list.titles}</span>
                    <div className={`d-flex align-items-center gap-2 mb-2 ${list.ValueClass1}`}>
                      <h4 className={`fw-medium mb-0 ${list.ValueClass}`}>
                      {list.count === "46658" ? "$" : ""}
                      {list.count === "1250450" ? "$" : ""}
                      <CountUp className="count-up" decimals={list.decimals} end={list.count} />
                      {list.count === 33 ? "k" : ""}
                      </h4>
                      {listCard &&
                        <SpkBadge variant="" Customclass={`bg-${list.priceColor}`}>
                          {list.price}
                        </SpkBadge>
                      }
                    </div>
                    <p className={`text-muted fs-12 mb-0 lh-1 ${list.smallText}`}>
                      <span className={`text-${list.iconColor} me-1 d-inline-block ${list.percentColor}`}>
                        <i className={list.icon}></i>
                        {list.percent}
                      </span>
                      <span className="monthly-percent fs-11">this month</span>
                    </p>
                  </div>
                }
                {jobsCard &&
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="fw-semibold mb-0">{list.count}</h3>
                    <span className={`text-${list.iconColor}`}><i className={list.icon}></i>{list.percent}</span>
                  </div>
                }
              </div>
            </div>
            <div className={`avatar avatar-md ${list.avatarClass} bg-${list.priceColor}-transparent mb-2 svg-${list.priceColor}`}>
              {list.svgIcon}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkListCard;
