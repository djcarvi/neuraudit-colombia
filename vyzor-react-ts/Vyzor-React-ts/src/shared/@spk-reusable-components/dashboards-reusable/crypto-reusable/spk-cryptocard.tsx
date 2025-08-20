
import { Fragment } from "react"
import { Card, Image } from "react-bootstrap";
import Spkapexcharts from "../../reusable-plugins/spk-apexcharts";

export interface CryptoCardProps {
    crypto: {
      imgSrc: string;
      value: string;
      iconColor: string;
      icon: string;
      percent: string;
      id: string;
      chartoptions: any;
      chartseries: any;
      type:string
    };
  }

const SpkCryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
    return (
        <Fragment>
            <Card className="custom-card">
                <Card.Body>
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                        <div>
                            <span className="avatar avatar-md">
                                <Image src={crypto.imgSrc} alt="crypto-icon" />
                            </span>
                        </div>
                        <div className="flex-fill">
                            <h5 className="fw-semibold">{crypto.value}</h5>
                            <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap">
                                <div className={`text-${crypto.iconColor} fw-medium fs-12`}>
                                    <i className={crypto.icon}></i>  {crypto.percent}
                                </div>
                                <div id={crypto.id}>
                                    <Spkapexcharts chartOptions={crypto.chartoptions} chartSeries={crypto.chartseries} width={100} height={20} type={crypto.type} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )
};

export default SpkCryptoCard;
