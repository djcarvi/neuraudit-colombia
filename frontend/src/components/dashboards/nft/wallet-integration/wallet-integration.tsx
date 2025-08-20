
import React, { Fragment } from "react";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import nft19 from '../../../../assets/images/nft-images/19.png';
import nft20 from '../../../../assets/images/nft-images/20.png';
import nft22 from '../../../../assets/images/nft-images/22.png';
import nft23 from '../../../../assets/images/nft-images/23.png';
import nft24 from '../../../../assets/images/nft-images/24.png';
import nft27 from '../../../../assets/images/nft-images/27.png';
import nft28 from '../../../../assets/images/nft-images/28.png';
import nft29 from '../../../../assets/images/nft-images/29.png';
import nft30 from '../../../../assets/images/nft-images/30.png';
import nft32 from '../../../../assets/images/nft-images/32.png';
import nft33 from '../../../../assets/images/nft-images/33.png';
import nft34 from '../../../../assets/images/nft-images/34.png';

interface WalletIntegrationProps { }

const WalletIntegration: React.FC<WalletIntegrationProps> = () => {

    const WalletList = [
        { name: "Etherium", image: nft34 },
        { name: "Binance", image: nft33 },
        { name: "Solana", image: nft32 },
        { name: "Tezos", image: nft28 },
        { name: "Avalanche", image: nft30 },
        { name: "Cardano", image: nft29 },
    ];
    interface Wallet {
        name: string;
        image: string;
        active?: boolean;
        avatarClass: string;
    };

    const WalletCards: Wallet[] = [
        { name: "MetaMask", image: nft22, active: true, avatarClass: 'p-2' },
        { name: "Enjin Wallet", image: nft23, avatarClass: 'p-2' },
        { name: "Trust Wallet", image: nft20, avatarClass: '' },
        { name: "Coinbase Wallet", image: nft24, avatarClass: 'p-2' },
        { name: "Lido", image: nft19, avatarClass: 'p-2' },
        { name: "Huobi Wallet", image: nft27, avatarClass: '' },
    ];

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Wallet Integration" />

            <Pageheader title="Dashboards" subtitle="NFT" currentpage="Wallet Integration" activepage="Wallet Integration" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Choose Network
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup as="ul" className="list-group-flush nft-list">
                                {WalletList.map((crypto, index) => (
                                    <ListGroup.Item as="li" className="" key={index}>
                                        <Link to="#!" className="stretched-link"></Link>
                                        <div className="d-flex align-items-center gap-2">
                                            <div>
                                                <span className="avatar avatar-rounded avatar-sm bg-light p-1">
                                                    <Image  src={crypto.image} alt={crypto.name} />
                                                </span>
                                            </div>
                                            <div className="fs-14 fw-medium">{crypto.name}</div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={9}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Choose Wallet
                            </div>
                            <div>
                                <SpkButton Buttonvariant="secondary" Customclass="btn btn-wave">Add New Wallet</SpkButton>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="justify-content-center">
                                {WalletCards.map((wallet, index) => (
                                    <Col xxl={3} key={index}>
                                        <Card className={`custom-card nft-wallet ${wallet.active ? "active" : ""}`}>
                                            <Card.Body className="p-3">
                                                <Link to="#!" className="stretched-link"></Link>
                                                <div className="d-flex align-items-center justify-content-center gap-3">
                                                    <div className="lh-1">
                                                        <span className={`avatar avatar-rounded bg-light ${wallet.avatarClass}`}>
                                                            <Image width={42} height={42} src={wallet.image} alt={wallet.name} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-medium mb-0">{wallet.name}</h6>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <div>
                                <SpkButton Buttonvariant="success" Customclass="btn float-end btn-wave">Connect</SpkButton>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default WalletIntegration;