import { Fragment } from "react";
import { Card } from "react-bootstrap";
import SpkButton from "../general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";

export interface PriceCardData {
    badge?: boolean;
    color: string;
    svgIcon: React.ReactNode;
    title: string;
    description: string;
    price: string;
    user: string;
    features: (string | { label: string; value: string })[];
    btnColor: string;
}

interface SpkPriceCardProps {
    price: PriceCardData;
    cardClass?: string;
}

const SpkPriceCard: React.FC<SpkPriceCardProps> = ({ price, cardClass }) => {
    return (
        <Fragment>
            <Card className={`custom-card dashboard-main-card pricing-card pricing-${price.color} ${cardClass}`}>
                <Card.Body className="p-4">
                    {price.badge && (
                        <SpkBadge variant="" Customclass="bg-dark text-white pricing-recommended-badge">
                            Recommended
                        </SpkBadge>
                    )}
                    <div className="lh-1 mb-3">
                        <span className={`avatar avatar-lg avatar-rounded bg-${price.color}-transparent svg-${price.color}`}>
                            {price.svgIcon}
                        </span>
                    </div>
                    <h5 className="fw-semibold">{price.title}</h5>
                    <p className="text-muted">{price.description}</p>
                    <div className="pricing-count">
                        <span className="fs-13 d-block mb-1">Start at</span>
                        <div className="d-flex align-items-end gap-2">
                            <h2 className="fw-semibold mb-0 lh-1">{price.price}</h2>
                            <span className="fs-13">/ {price.user} per user</span>
                        </div>
                    </div>

                    <hr className="section-devider my-4" />

                    <ul className="list-unstyled pricing-features-list">
                        {price.features.map((item, index) => (
                            <li key={index}>
                                {typeof item === "string" ? (
                                    item
                                ) : (
                                    <>
                                        <span className="fw-medium">{item.label}</span> {item.value}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="d-grid mt-4">
                        <SpkButton Buttonvariant="" Customclass={`btn btn-lg btn-${price.btnColor}`}>
                            Get Started
                        </SpkButton>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default SpkPriceCard;
