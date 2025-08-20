
import React, { Fragment } from "react";
import { Card, Col, Form, Image, Nav, Tab } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { AccountSummary, Buycards, SellCrypto, SellCrypto1, Selloptions, SellSeries } from "../../../../shared/data/dashboards/crypto/buyselldata";
import SpkListCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Link } from "react-router-dom";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import bitcoinsvg from '../../../../assets/images/crypto-currencies/regular/Bitcoin.svg';
interface BuySellProps { }

const BuySell: React.FC<BuySellProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Buy & Sell" />

            <Pageheader title="Dashboards" subtitle="Crypto" currentpage="Buy & Sell" activepage="Buy & Sell" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <div className="row">
                {Buycards.map((idx, index) => (
                    <Col xl={4} key={index}>
                        <SpkListCard cardClass={idx.cardClass} listCard={true} titleClass="d-block text-muted mb-1" list={idx} />
                    </Col>
                ))}
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Buy & Sell Statistics
                            </div>
                            <div className="btn-group flex-wrap" role="group" aria-label="Basic example">
                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary btn-sm btn-wave waves-effect waves-light">1D</SpkButton>
                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1W</SpkButton>
                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1M</SpkButton>
                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">3M</SpkButton>
                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">6M</SpkButton>
                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1Y</SpkButton>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="d-flex flex-wrap align-items-center border-bottom border-block-end-dashed mb-3 p-4 gap-5 justify-content-sm-center">
                                {AccountSummary.map((item, index) => (
                                    <div key={index}>
                                        <span className="d-block fs-12">{item.label}</span>
                                        <span className={`d-block fw-medium fs-15 text-${item.color}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                                <div></div>
                            </div>
                            <div id="buy_sell-statistics" className="px-3">
                                <Spkapexcharts type={"bar"} height={370} width={"100%"} chartOptions={Selloptions} chartSeries={SellSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Quick Secure Transfer
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="tab-pane border-0 p-0" id="sell-crypto" role="tabpanel"
                                aria-labelledby="sell-crypto">
                                <div className="mb-3">
                                    <span className="form-label">Crypto Value :</span>
                                    <div className="position-relative">
                                        <Link to="#!" className="stretched-link"></Link>
                                        <div className="p-2 border rounded d-flex align-items-center flex-wrap justify-content-between gap-3 mt-1">
                                            <div className="gap-2 d-flex align-items-center">
                                                <div className="lh-1">
                                                    <span className="avatar bg-light p-2">
                                                        <Image src={bitcoinsvg} alt="" />
                                                    </span>
                                                </div>
                                                <div className="fw-medium">Bitcoin - BTC</div>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-medium d-block">0.374638535 BTC</span>
                                                <span className="text-muted">$5,364.65</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="form-label">Deposit To :</span>
                                    <div className="position-relative">
                                        <Link to="#!" className="stretched-link"></Link>
                                        <div className="p-2 border rounded d-flex align-items-center gap-2 mt-1">
                                            <div className="lh-1">
                                                <span className="avatar bg-light p-2">
                                                    <i className="ri-bank-line text-info fs-20"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="fw-medium d-block">Banking</span>
                                                <span className="text-muted">Checking ...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="d-block fw-medium">Amount :</span>
                                    <div className="d-flex align-items-center justify-content-between text-muted">
                                        <div>Weekly Bank Limit</div>
                                        <div>$10,000 remaining</div>
                                    </div>
                                </div>
                                <div className="input-group mb-3 flex-nowrap custom-crypto">
                                    <Form.Control type="text" className="" aria-label="crypto buy select" />
                                    <SpkSelect name="colors" option={SellCrypto1} mainClass="basic-multi-select buysell custom-buy-sell" placeholder="USD" menuplacement='auto' classNameprefix="Select2" />
                                </div>
                                <div>
                                    <div className="fs-14 py-2">
                                        <div className="d-inline-flex">
                                            <span className="fw-medium text-dark">Price:</span><span className="text-muted ms-2 fs-14">6.003435</span>
                                        </div>
                                        <span className="text-dark fw-medium float-end">BTC</span>
                                    </div>
                                    <div className="fs-14 py-2">
                                        <div className="d-inline-flex">
                                            <span className="fw-medium text-dark">Amount:</span><span className="text-muted ms-2 fs-14">2,34,4543.00</span>
                                        </div>
                                        <span className="text-dark fw-medium float-end">LTC</span>
                                    </div>
                                </div>
                                <div className="d-grid mt-4">
                                    <SpkButton Buttonvariant="success" Buttontype="button" Customclass="btn btn-wave btn-lg">Transfer</SpkButton>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Tab.Container defaultActiveKey={"buy"}>
                            <Card.Header className="justify-content-between pb-2">
                                <div className="card-title">
                                    Buy & Sell Crypto
                                </div>
                                <Nav className="nav-tabs tab-style-8 scaleX" id="myTab4" role="tablist">
                                    <Nav.Item role="presentation">
                                        <Nav.Link eventKey={"buy"} className="" id="buy-crypto-tab" data-bs-toggle="tab"
                                            data-bs-target="#buy-crypto-tab-pane" type="button" role="tab"
                                            aria-controls="buy-crypto-tab-pane" aria-selected="true">Buy</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item role="presentation">
                                        <Nav.Link eventKey={"sell"} className="" id="sell-crypto-tab" data-bs-toggle="tab"
                                            data-bs-target="#sell-crypto-tab-pane" type="button" role="tab"
                                            aria-controls="sell-crypto-tab-pane" aria-selected="false">Sell</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content className="" id="myTabContent3">
                                    <Tab.Pane eventKey={"buy"} className="overflow-hidden border-0 p-0" id="buy-crypto-tab-pane"
                                        role="tabpanel" aria-labelledby="buy-crypto-tab" tabIndex={0}>
                                        <div>
                                            <div className="input-group mb-3 flex-nowrap custom-crypto">
                                                <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="Enter Value" />
                                                <SpkSelect name="colors" option={SellCrypto} mainClass="basic-multi-select buysell custom-buy-sell" placeholder="BTC" menuplacement='auto' classNameprefix="Select2" />
                                            </div>
                                            <div className="input-group mb-3 flex-nowrap custom-crypto">
                                                <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="Amount Obtained" />
                                                <SpkSelect name="colors" option={SellCrypto1} mainClass="basic-multi-select buysell custom-buy-sell" placeholder="USD" menuplacement='auto' classNameprefix="Select2" />
                                            </div>
                                            <div>
                                                <div className="fs-14 py-2"><span className="fw-medium text-dark">Price:</span><span className="text-muted ms-2 fs-14 d-inline-block">6.003435</span><span className="text-dark fw-medium float-end">BTC</span></div>
                                                <div className="fs-14 py-2"><span className="fw-medium text-dark">Amount:</span><span className="text-muted ms-2 fs-14 d-inline-block">2,34,4543.00</span><span className="text-dark fw-medium float-end">LTC</span></div>
                                                <div className="fw-medium fs-14 py-2">Total: <span className="fs-14 d-inline-block">22.00 BTC</span></div>
                                                <div className="fs-12 text-success">Additional Charges: 0.32%(0.0001231 BTC)</div>
                                                <label className="fw-medium fs-12 mt-4 mb-3">SELECT PAYMENT METHOD :</label>
                                                <div className="row g-2">
                                                    <Col xl={6}>
                                                        <div className="p-2 border rounded">
                                                            <div className="form-check mb-0">
                                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                                                                <label className="form-check-label fs-12" htmlFor="flexRadioDefault1">
                                                                    Credit / Debit Cards
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="p-2 border rounded">
                                                            <div className="form-check mb-0">
                                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                                <label className="form-check-label fs-12" htmlFor="flexRadioDefault2">
                                                                    Paypal
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <div className="p-2 border rounded">
                                                            <div className="form-check mb-0">
                                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                                                <label className="form-check-label fs-12" htmlFor="flexRadioDefault3">
                                                                    Wallet
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </div>
                                            <div className="d-grid mt-3 pt-1">
                                                <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="btn btn-wave btn-lg">BUY CRYPTO</SpkButton>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"sell"} className="overflow-hidden border-0 p-0" id="sell-crypto-tab-pane" role="tabpanel"
                                        aria-labelledby="sell-crypto-tab" tabIndex={0}>
                                        <div className="input-group mb-3 flex-nowrap custom-crypto">
                                            <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="Select Value" />
                                            <SpkSelect name="colors" option={SellCrypto} mainClass="basic-multi-select buysell custom-buy-sell" placeholder="BTC" menuplacement='auto' classNameprefix="Select2" />
                                        </div>
                                        <div className="input-group mb-3 flex-nowrap custom-crypto">
                                            <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="" />
                                            <SpkSelect name="colors" option={SellCrypto1} mainClass="basic-multi-select buysell custom-buy-sell" placeholder="USD" menuplacement='auto' classNameprefix="Select2" />
                                        </div>
                                        <div className="mb-3">
                                            <span className="form-label">Crypto Value :</span>
                                            <div className="position-relative">
                                                <div className="p-2 border rounded d-flex align-items-center justify-content-between gap-3 mt-1 flex-wrap">
                                                    <div className="gap-2 d-flex align-items-center">
                                                        <div className="lh-1">
                                                            <span className="avatar bg-light p-2">
                                                                <Image src={bitcoinsvg} alt="" />
                                                            </span>
                                                        </div>
                                                        <div className="fw-medium">Bitcoin - BTC</div>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="fw-medium d-block">0.374638535 BTC</span>
                                                        <span className="text-muted">$5,364.65</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <span className="form-label">Deposit To :</span>
                                            <div className="position-relative">
                                                <div className="p-2 border rounded d-flex align-items-center gap-2 mt-1">
                                                    <div className="lh-1">
                                                        <span className="avatar bg-light p-2">
                                                            <i className="ri-bank-line text-info fs-20"></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="fw-medium d-block">Banking</span>
                                                        <span className="text-muted">Checking ...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="fs-14 py-2">
                                                <div className="d-inline-flex">
                                                    <span className="fw-medium text-dark">Price:</span><span className="text-muted ms-2 fs-14">6.003435</span>
                                                </div>
                                                <span className="text-dark fw-medium float-end">BTC</span>
                                            </div>
                                            <div className="fs-14 py-2">
                                                <div className="d-inline-flex">
                                                    <span className="fw-medium text-dark">Amount:</span><span className="text-muted ms-2 fs-14">2,34,4543.00</span>
                                                </div>
                                                <span className="text-dark fw-medium float-end">LTC</span>
                                            </div>
                                        </div>
                                        <div className="d-grid mt-3">
                                            <SpkButton Buttonvariant="danger" Buttontype="button" Customclass="btn btn-wave btn-lg">SELL CRYPTO</SpkButton>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </div>

            {/* <!-- End:: row-1 --> */}

        </Fragment>
    )
};

export default BuySell;