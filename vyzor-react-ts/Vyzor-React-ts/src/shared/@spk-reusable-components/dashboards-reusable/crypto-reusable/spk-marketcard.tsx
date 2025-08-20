
import { Fragment, type JSX } from "react";
import { Card, Image, ListGroup } from "react-bootstrap";
import Spkapexcharts from "../../reusable-plugins/spk-apexcharts";

interface MarketData {
  imgSrc: string;
  title: string;
  subtitle?: string;
  price?: string;
  value?: string;
  percent?: string;
  chartOptions: any;
  chartSeries: any[];
  height?: number | string;
  width?: number | string;
  todayPrice?: string;
  badge?: JSX.Element | string;
  id?:string;
}

interface SpkMarketCardProps {
  market: MarketData;
  cardClass?: string;
  bodyClass?: string;
}

const SpkMarketCard: React.FC<SpkMarketCardProps> = ({ market, cardClass = "", bodyClass = "" }) => {
  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="d-flex align-items-center mb-4 flex-wrap">
            <div className="d-flex align-items-center">
              <div className="me-2">
                <span className="avatar avatar-md avatar-rounded bg-light p-2">
                  <Image src={market.imgSrc} alt={market.title} />
                </span>
              </div>
              <div className="mb-0 fw-medium">
                {market.title}
              </div>
            </div>
            <div className="ms-auto">
              <div id="bitcoin-chart">
                <Spkapexcharts chartOptions={market.chartOptions} chartSeries={market.chartSeries} height={market.height} width={market.width} type="bar"/>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-end">
            <div>
              <p className="mb-1">{market.subtitle}</p>
              <p className="fs-20 mb-0 fw-medium lh-1 text-primary">{market.price}</p>
            </div>
            <div className="ms-auto text-end">
              <p className="mb-0">{market.value}</p>
              <p className="mb-0 text-muted"><span className="text-muted">Vol:</span> {market.percent}</p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="p-0">
          <ListGroup className="border-0 list-group-flush">
            <ListGroup.Item>
              <div className="d-flex w-100 justify-content-between align-items-center">
                <p className="mb-0 font-weight-semibold text-dark">
                  Price Change <span className="badge bg-primary-transparent ms-3 text-primary">Increased</span>
                </p>
                <p className="text-success mb-0 font-weight-normal fs-13">
                  <span className="numberfont">{market.todayPrice}</span> today
                </p>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-flex w-100 justify-content-between align-items-center">
                <p className="mb-0 font-weight-semibold text-dark">Market Rank {market.badge}</p>
                <p className="text-dark mb-0 fs-15">
                  <span className="numberfont">{market.id}</span>
                </p>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Footer>
      </Card>
    </Fragment>
  );
};

export default SpkMarketCard;
