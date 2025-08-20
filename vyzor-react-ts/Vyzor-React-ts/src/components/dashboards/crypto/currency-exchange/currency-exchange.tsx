
import React, { Fragment } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { Bitciondata, CurrencyCards, UsdData } from "../../../../shared/data/dashboards/crypto/currencydata";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkCurrencyCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/crypto-reusable/spk-currencycard";
import media65 from '../../../../assets/images/media/media-65.png';

interface CurrencyExchangeProps { }

const CurrencyExchange: React.FC<CurrencyExchangeProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Currency Exchange" />

            <Pageheader title="Dashboards" subtitle="Crypto" currentpage="Currency Exchange" activepage="Currency Exchange" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card currency-exchange-card border-0">
                        <Card.Body className="p-sm-5 d-flex align-items-center justify-content-center">
                            <div className="crypto-currency-exchange-background grid-cards">
                                <Image src={media65} alt="" />
                            </div>
                            <div className="container">
                                <h3 className="text-center">Buy and Sell Coins without additional fees</h3>
                                <span className="d-block fs-16 text-center text-muted mb-4">
                                    Buy now and get +50% extra bonus Minimum pre-sale amount 100 Crypto Coin. We accept BTC crypto-currency..
                                </span>
                                <div className="p-3 mb-4 rounded currency-exchange-area">
                                    <Row className="gy-3">
                                        <Col xxl={3} className="col-12">
                                            <Form.Control type="text" className="" defaultValue="0.0453" placeholder="Enter Amount" />
                                        </Col>
                                        <Col xxl={2} className="col-12">
                                            <div className="custom-currency">
                                                <SpkSelect name="colors" option={Bitciondata} placeholder="Bitcoin" classNameprefix='Select2' mainClass="multi-select" defaultvalue={[Bitciondata[0]]} menuplacement='auto' />
                                            </div>
                                        </Col>
                                        <Col xxl={2} className="col-12">
                                            <div className="fs-2 text-fixed-white text-center op-8 lh-1 mt-1">
                                                =
                                            </div>
                                        </Col>
                                        <Col xxl={3} className="col-12">
                                            <Form.Control type="text" className="" defaultValue="1350.93" placeholder="Exchange Amount" />
                                        </Col>
                                        <Col xxl={2} className="col-12">
                                            <div className="custom-currency">
                                                <SpkSelect name="colors" option={UsdData} mainClass="basic-multi-select " defaultvalue={[UsdData[0]]} menuplacement='auto' classNameprefix="Select2" />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="text-center">
                                    <SpkButton Buttonvariant="danger" Customclass="btn btn-wave">Exchange Now</SpkButton>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}
            <Row className="justify-content-center">
                {CurrencyCards.map((idx, index) => (
                    <Col xl={3} lg={6} className="" key={index}>
                        <SpkCurrencyCard cardClass="overflow-hidden" currency={idx} />
                    </Col>
                ))}
                <Col xl={12} className="">
                    <div className="text-center my-4">
                        <SpkButton Buttonvariant="" Customclass="btn btn-primary-light" Buttontype="button" Disabled>
                            <span className="spinner-border spinner-border-sm align-middle me-2" role="status"
                                aria-hidden="true"></span>
                            Loading...
                        </SpkButton>
                    </div>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default CurrencyExchange;