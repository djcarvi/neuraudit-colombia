
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import SpkButton from "../../general-reusable/reusable-uielements/spk-buttons";

import SpkBadge from "../../general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import ethereum_eth_logo from '../../../../assets/images/crypto-currencies/crypto-icons/ethereum-eth-logo.svg';

interface Nft {
    title: string;
    author: string;
    image: string;
    likes: string;
    currentBid: string;
    bidAmount: string;
    time:string;
}

interface SpkNftCardProps {
    nft: Nft;
}

const SpkNftCard: React.FC<SpkNftCardProps> = ({ nft }) => {
    return (
        <Fragment>
            <Card className="custom-card">
                <div className="d-flex align-items-center justify-content-between nft-like-section w-100 px-3">
                    <div className="flex-fill">
                        <SpkButton Buttonvariant="danger" Customclass="btn btn-sm btn-icon rounded-pill btn-wave">
                            <i className="ri-heart-fill"></i>
                        </SpkButton>
                    </div>
                    <div>
                        <SpkBadge variant="" Customclass="nft-like-badge text-default">
                            <i className="ri-heart-fill me-1 text-danger align-middle d-inline-block"></i>
                            {nft.likes}
                        </SpkBadge>
                    </div>
                    <p className="mb-0 nft-auction-time">{nft.time}</p>
                </div>
                <div className="card-body p-2 grid-cards">
                    <Image  src={nft.image} className="card-img mb-3" alt={nft.title} />
                    <div className="p-2">
                        <div className="mb-3">
                            <Link to={`${import.meta.env.BASE_URL}dashboards/nft/nft-details`}>
                                <h6 className="fw-semibold mb-1 text-truncate">{nft.title}</h6>
                            </Link>
                            <Link to="#!">
                                <span className="fs-13 text-muted fw-medium">{nft.author}</span>
                            </Link>
                        </div>
                        <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
                            <div className="flex-fill">
                                <span className="text-muted fs-12 d-block mb-1">Current Bid</span>
                                <div className="d-flex align-items-center gap-2 fw-semibold">
                                    <div className="lh-1">
                                        <span className="avatar avatar-xs avatar-rounded">
                                            <Image width={20} height={20} src={ethereum_eth_logo} alt="ETH" />
                                        </span>
                                    </div>
                                    <div>{nft.currentBid}</div>
                                </div>
                            </div>
                            <div>
                                <SpkButton Buttonvariant="primary" Customclass="btn">{nft.bidAmount}</SpkButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Fragment>
    );
};

export default SpkNftCard;
