
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import SpkButton from "../../general-reusable/reusable-uielements/spk-buttons";

export interface Wallet {
    title: string;
    imgSrc: string;
    available: string;
    value: string;
    price: string;
  }

interface SpkWalletCardProps {
  wallet: Wallet;
}

const SpkWalletCard: React.FC<SpkWalletCardProps> = ({ wallet }) => {

  return (
    <Fragment>
      <Card className="custom-card">
        <Card.Header>
          <div className="card-title">{wallet.title}</div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <div className="lh-1">
                <span className="avatar avatar-rounded position-relative">
                  <Image src={wallet.imgSrc} alt={wallet.title} />
                </span>
              </div>
              <div>
                <span className="d-block text-muted fs-12 fw-normal">{wallet.available}</span>
                <span className="fw-medium">{wallet.value}</span>
              </div>
            </div>
            <div>
              <span className="fw-medium">{wallet.price}</span>
              <span className="d-block text-muted fs-12 fw-normal">In USD</span>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="btn-list text-center">
            <SpkButton Buttonvariant="primary" Customclass="btn btn-w-lg btn-wave"> Deposit </SpkButton>
            <SpkButton Buttonvariant="danger" Customclass="btn btn-w-lg btn-wave"> Withdraw </SpkButton>
          </div>
        </Card.Footer>
      </Card>
    </Fragment>
  );
};

export default SpkWalletCard;
