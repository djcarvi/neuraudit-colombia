import { Fragment } from "react";
import { Card } from "react-bootstrap";
import SpkButton from "../general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";

export type BasicFeatureItem = string | { value: string };

export interface SpkBasicPriceCardProps {
  price: {
    title?: string;
    price?: string;
    year?: string;
    percent?: string;
    btnColor?: string;
    priceColor?: string;
    badgeColor?: string;
    features: BasicFeatureItem[];
    titleColor?:string
  };
  cardClass?: string;
}

const SpkBasicPriceCard = ({ price, cardClass = "" }: SpkBasicPriceCardProps) => {
  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className="p-4 text-center">
          <h5 className={`fw-semibold mb-3 ${price.titleColor}`}>{price.title}</h5>
          <div className="d-flex align-items-end justify-content-center gap-1 mb-4">
            <h2 className={`fw-semibold mb-0 lh-1 text-${price.priceColor}`}>{price.price}</h2>
            <span className="fs-13">/ {price.year}</span>
          </div>
          <ul className="list-unstyled pricing-features-list-1 mx-5 text-start mb-4">
            {price.features.map((item, index) => (
              <li key={index}>
                {typeof item === "string" ? item : item.value}
              </li>
            ))}
          </ul>
          <div>
            <SpkBadge variant="" Customclass={`bg-${price.badgeColor}-transparent py-1 px-3 fs-13 rounded-pill fw-normal`}> {price.percent} Off</SpkBadge>
            <div className="d-grid mt-3">
              <SpkButton Buttonvariant={price.btnColor} Customclass="btn btn-lg">Choose Plan</SpkButton>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkBasicPriceCard;
