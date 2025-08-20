
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import Spkapexcharts from "../reusable-plugins/spk-apexcharts";

interface StockCardProps {
  stock: {
    imgSrc: string;
    title: string;
    subtitle: string;
    percent: string;
    percentColor: string;
    value: string;
    chartId: string;
    chartOptions: any;
    chartSeries: any;
  };
  cardClass?: string;
}

const SpkStockCard: React.FC<StockCardProps> = ({ stock, cardClass = "" }) => {
  return (
    <Fragment>
      <Card className={`custom-card mb-0 ${cardClass}`}>
        <Card.Body>
          <div className="d-flex gap-2 flex-wrap align-items-center justify-content-between mb-3">
            <div className="d-flex flex-fill align-items-center">
              <div className="me-2 lh-1">
                <span className="avatar avatar-md">
                  <Image src={stock.imgSrc} alt="" className="invert-1"/>
                </span>
              </div>
              <div className="lh-1">
                <span className="d-block text-default fw-medium">
                  {stock.title}
                </span>
              </div>
            </div>
            <div className="fs-12 text-end">
              <span className="text-uppercase fw-semibold">{stock.subtitle}</span>
              <span className={`text-${stock.percentColor} d-block`}>
                {stock.percent}
                <i className="ti ti-arrow-bear-right"></i>
              </span>
            </div>
          </div>

          <div className="d-flex align-items-end justify-content-between">
            <div>
              <span className="d-block text-muted fs-12">Current value</span>
              <h6 className="fw-semibold mb-0">{stock.value}</h6>
            </div>
            <div id={stock.chartId}>
              <Spkapexcharts height={20} width={120} type={"area"} chartOptions={stock.chartOptions} chartSeries={stock.chartSeries}/>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkStockCard;
