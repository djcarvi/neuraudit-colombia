
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import Spkapexcharts from "../../reusable-plugins/spk-apexcharts";
import SpkBadge from "../../general-reusable/reusable-uielements/spk-badge";

interface CurrencyData {
  imgSrc: string;
  title: string;
  percent: string;
  inc: string;
  hcount: string;
  value: string;
  price: string;
  color: string;
  id: string;
  chartOptions: any;
  chartSeries: any;
  height: number | string;
  width?: number;
  type?: "line" | "bar" | "area" | "donut" | "radialBar" | "scatter" | string;
}

interface SpkCurrencyCardProps {
  currency: CurrencyData;
  cardClass?: string;
}

const SpkCurrencyCard: React.FC<SpkCurrencyCardProps> = ({ currency, cardClass = "" }) => {

  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className="mb-3">
          <div className="d-flex align-items-top justify-content-between mb-3 flex-wrap">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="lh-1">
                  <span className="avatar avatar-rounded avatar-xs">
                    <Image src={currency.imgSrc} alt="" />
                  </span>
                </div>
                <h6 className="fw-medium mb-0">{currency.title}</h6>
              </div>
              <span className="fs-25 d-flex align-items-center">
                {currency.percent}
                <span className="fs-12 text-warning op-7 ms-2">
                  {currency.inc}
                  <i className="ti ti-arrow-big-up-line ms-1 d-inline-flex"></i>
                </span>
                <SpkBadge variant="" Customclass="badge bg-success-transparent fs-10 ms-2">{currency.hcount}</SpkBadge>
              </span>
            </div>
            <div className="text-end">
              <span className={`d-block fs-14 mb-1 text-${currency.color}`}>{currency.value}</span>
              <span className="d-block text-success fw-medium">{currency.price}</span>
            </div>
          </div>
        </Card.Body>
        <div id={currency.id} className="mt-1 w-100">
          <Spkapexcharts chartOptions={currency.chartOptions} chartSeries={currency.chartSeries} type={"area"} height={currency.height} width={currency.width}/>
        </div>
      </Card>
    </Fragment>
  );
};

export default SpkCurrencyCard;
