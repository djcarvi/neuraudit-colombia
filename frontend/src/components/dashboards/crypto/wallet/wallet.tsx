
import React, { Fragment } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { WalletAddresses, Wallets } from "../../../../shared/data/dashboards/crypto/walletdata";
import SpkWalletCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/crypto-reusable/spk-walletcard";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface WalletProps { }

const Wallet: React.FC<WalletProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Wallet" />

            <Pageheader title="Dashboards" subtitle="Crypto" currentpage="Wallet" activepage="Wallet" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                {Wallets.map((idx, index) => (
                    <Col xxl={3} xl={6} key={index}>
                        <SpkWalletCard wallet={idx} />
                    </Col>
                ))}
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                {WalletAddresses.map((wallet) => (
                    <Col xxl={4} key={wallet.id}>
                        <Card className="custom-card">
                            <Card.Header className="justify-content-between d-flex">
                                <div className="card-title">{wallet.title}</div>
                                <SpkButton Buttonvariant="" Customclass="btn btn-primary-ghost btn-wave">Connect</SpkButton>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex align-items-center flex-wrap justify-content-between gap-4 mb-3">
                                    <div className="flex-fill">
                                        <label htmlFor={wallet.id} className="form-label">Wallet Address</label>
                                        <div className="input-group">
                                            <Form.Control type="text" className="" id={wallet.id} defaultValue={wallet.walletAddress} placeholder="Placeholder" />
                                            <SpkButton Buttonvariant="primary" Customclass="btn">Copy</SpkButton>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="avatar avatar-xxl border">
                                            <Image src={wallet.imageSrc} className="p-1 qr-image" alt={`${wallet.currency} QR`} />
                                        </span>
                                    </div>
                                </div>
                                <Row className="gy-3">
                                    <Col xl={6}>
                                        <div className="rounded p-3 border border-dashed">
                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                <span className="avatar bg-success">
                                                    <i className="ti ti-arrow-narrow-down fs-20"></i>
                                                </span>
                                                <div>
                                                    <span className="d-block text-muted">Received</span>
                                                    <span className="d-block fw-medium">
                                                        {wallet.received} <span className="fs-12 text-muted fw-normal">{wallet.currency}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={6}>
                                        <div className="rounded p-3 border border-dashed">
                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                <span className="avatar bg-danger">
                                                    <i className="ti ti-caret-up fs-20"></i>
                                                </span>
                                                <div>
                                                    <span className="d-block text-muted">Sent</span>
                                                    <span className="d-block fw-medium">
                                                        {wallet.sent} <span className="fs-12 text-muted fw-normal">{wallet.currency}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <div className="rounded p-3 border border-dashed">
                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                <span className="avatar bg-warning">
                                                    <i className="ti ti-wallet fs-20"></i>
                                                </span>
                                                <div>
                                                    <span className="d-block text-muted">Wallet Balance</span>
                                                    <span className="d-block fw-medium">
                                                        {wallet.balance} <span className="fs-12 text-muted fw-normal">{wallet.currency}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* <!--End::row-2 --> */}

        </Fragment>
    )
};

export default Wallet;