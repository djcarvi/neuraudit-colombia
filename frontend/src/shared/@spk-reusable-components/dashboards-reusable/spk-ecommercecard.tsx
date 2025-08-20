import { Fragment, type ReactNode } from "react";
import { Card } from "react-bootstrap";

interface EcommerceData {
    value: string | number;
    title: string;
    color: string;
    svgIcon: ReactNode;
}

interface SpkEcommerceCardProps {
    cardClass?: string;
    ecommerce: EcommerceData;
}

const SpkEcommerceCard: React.FC<SpkEcommerceCardProps> = ({ cardClass, ecommerce }) => {
    return (
        <Fragment>
            <Card className={`custom-card ${cardClass} ${ecommerce.color}`}>
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h5 className="fw-semibold">{ecommerce.value}</h5>
                            <span className="d-block fs-12 text-muted">{ecommerce.title}</span>
                        </div>
                        <div>
                            <span className={`avatar avatar-lg bg-${ecommerce.color}-transparent svg-${ecommerce.color}`}>
                                {ecommerce.svgIcon}
                            </span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default SpkEcommerceCard;
