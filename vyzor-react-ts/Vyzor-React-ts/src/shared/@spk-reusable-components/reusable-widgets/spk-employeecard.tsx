
import React from 'react';
import { Card } from 'react-bootstrap';

interface Types {
  title?: string;
  value?: number | string;
  iconClass?: string;
  badgeText?: string;
  percentChange?: string;
  color?: string;
  percentageColorClass?:string;
  badge?:boolean;
  crmbadge?:boolean;
  crmicon?:string;
  cardColor?:string
  valueClass?:string
  endText?:string
  divClass?:string
  crmiconColor?:string;
  crmpercentChange?:string;
};

interface EmployeeStatCardProps {
   widget :Types;
  };

const SpkEmployeeStatCard: React.FC<EmployeeStatCardProps> = ({widget}) => {
  return (
    <div className="col">
      <Card className={`custom-card widget-card-style1 ${widget.cardColor}`}>
        <Card.Body>
          <div className={`d-flex align-items-start gap-3 flex-wrap ${widget.divClass}`}>
            <div className="lh-1">
              <span className={`avatar avatar-md bg-${widget.color}`}>
                <i className={`${widget.iconClass} fs-5`}></i>
              </span>
            </div>
            <div className="flex-fill">
              <span className="d-block">{widget.title}</span>
              <h5 className={`fw-semibold ${widget.valueClass}`}>{widget.value}</h5>
              {widget.badge && 
                <span className={`badge bg-${widget.color}-transparent`}>
                  {widget.badgeText}
                </span>
              }
            </div>
              <div className={`${widget.endText}`}>
                  {widget.crmbadge && 
                    <div className={`fw-semibold text-${widget.crmiconColor}`}>
                      <i className={`ti ti-arrow-narrow-${widget.crmicon} me-1`}></i>{widget.crmpercentChange}
                    </div>
                  }
              <div className={`${widget.percentageColorClass}`}>{widget.percentChange}</div>
              {widget.crmbadge && 
               <div className="text-muted fs-12">This Year</div>
              }
              </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SpkEmployeeStatCard;
