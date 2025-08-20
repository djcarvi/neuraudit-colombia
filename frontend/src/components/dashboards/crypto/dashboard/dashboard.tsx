
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Nav, Pagination, Row, Tab } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Assetoptions, Assetseries, Coindata, CryptoCards, Cryptooptions, Cryptoseries, CryptoStats, CryptoTableRows, Currencydata, TransactionActivities, Transactions } from "../../../../shared/data/dashboards/crypto/cryptodata";
import SpkCryptoCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/crypto-reusable/spk-cryptocard";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Bitcoin from '../../../../assets/images/crypto-currencies/regular/Bitcoin.svg';
import bitcoin_btc_logo from '../../../../assets/images/crypto-currencies/crypto-icons/bitcoin-btc-logo.svg';

interface CryptoProps { }

const Crypto: React.FC<CryptoProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Crypto" />

            <Pageheader title="Dashboards" subtitle="Crypto" currentpage="Dashboard" activepage="Crypto" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        {CryptoCards.map((idx, index) => (
                            <Col xxl={3} xl={6} key={index}>
                                <SpkCryptoCard crypto={idx} />
                            </Col>
                        ))}
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Crypto Performance
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="p-3 d-flex align-items-center gap-4 border border-dashed rounded flex-wrap mb-2">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <span className="avatar avatar-sm">
                                                <Image  src={bitcoin_btc_logo} alt="" />
                                            </span>
                                            <div>
                                                <span className="fw-medium">Bitcoin</span> - <span className="text-muted">BTC</span>
                                            </div>
                                        </div>
                                        <h6 className="fw-medium mb-0">$42,761.32 USD<span className="text-success mx-2">0.14%</span>(24H)</h6>
                                        <div className="d-flex gap-4 align-items-center flex-wrap">
                                            <div>Open - <span className="text-success fw-medium">6612.98</span></div>
                                            <div>High - <span className="text-success fw-medium">6625.97</span></div>
                                            <div>Low - <span className="text-danger fw-medium">6612.34</span></div>
                                            <div>Close - <span className="text-success fw-medium">6623.45</span></div>
                                        </div>
                                    </div>
                                    <div id="coin-statistics">
                                        <Spkapexcharts height={400} type={"candlestick"} width={"100%"} chartOptions={Cryptooptions} chartSeries={Cryptoseries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Transactions History
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled crypto-transaction-history-list">
                                        {Transactions.map((tx, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className={`avatar avatar-md bg-light avatar-rounded p-2 border ${tx.title}`}>
                                                            <Image src={tx.icon} alt={tx.title} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-semibold d-block">{tx.title}</span>
                                                        <span className="fs-12 text-muted">{tx.date}</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="fw-semibold d-block">{tx.amount}</span>
                                                        <SpkBadge variant="" Customclass={`${tx.status === "Completed" ? "bg-success" : tx.status === "Pending" ? "bg-warning" : "bg-danger"}`}>
                                                            {tx.status}
                                                        </SpkBadge>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Recent Activity
                                    </div>
                                    <Link to="#!" className="fs-12 text-muted">View All <i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled recent-activity-crypto-list">
                                        {TransactionActivities.map((tx, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div>
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image src={tx.avatar} alt={tx.name} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-semibold">{tx.name}</span>
                                                        <p className="mb-0">
                                                            {tx.currency} - <span className="text-muted">({tx.amount})</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="fs-12 text-muted mb-1">{tx.date}</span>
                                                        <p className="mb-0">
                                                            <span className={`fs-11 fw-semibold ${tx.status === "Sent" ? "text-danger" : tx.status === "Received" ? "text-success" : "text-info"}`}>
                                                                {tx.status}
                                                            </span>{" "}
                                                            - {tx.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Coin Price Statistics
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ListGroup as="ul" className="list-group list-group-flush">
                                        {CryptoStats.map((item, index) => (
                                            <ListGroup.Item as="li" className="list-group-item" key={index}>
                                                <div className="d-flex w-100 justify-content-between align-items-center">
                                                    <p className="tx-14 mb-0 font-weight-semibold text-dark">
                                                        {item.label}
                                                        {item.badge && (
                                                            <SpkBadge variant="" Customclass={`ms-3 ${item.badge.className}`}>{item.badge.text}</SpkBadge>
                                                        )}
                                                    </p>
                                                    <p className={`${item.valueColor} mb-0 tx-15`}>
                                                        <span className="numberfont">{item.value}</span>
                                                    </p>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>

                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <p className="mb-1 text-muted">Your Balance</p>
                                            <h5 className="fw-semibold mb-1">$23,895.00</h5>
                                            <p className=" text-muted fs-12 mb-4">Total Value : 13.50234BTC</p>
                                        </div>
                                        <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="View All" Customtoggleclass="btn-outline-light btn btn-sm text-muted">
                                            <Dropdown.Item as="li" href="#!">Today</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">This Week</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Last Week</Dropdown.Item>
                                        </SpkDropdown>
                                    </div>
                                    <Row>
                                        <Col xl={6} sm={6} className="col-6">
                                            <div className="d-flex align-items-center flex-wrap gap-3">
                                                <div className="lh-1">
                                                    <div className="avatar bg-primary-transparent">
                                                        <i className="ti ti-arrow-big-up-lines fs-20"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-fill">
                                                    <span className="text-md mb-1 fw-semibold">$22,490.00</span>
                                                    <p className="mb-0 fs-12  text-muted">Invested</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xl={6} sm={6} className="col-6">
                                            <div className="d-flex align-items-center flex-wrap gap-3">
                                                <div className="lh-1">
                                                    <div className="avatar bg-primary-transparent">
                                                        <i className="ti ti-corner-up-right-double fs-20"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-fill">
                                                    <span className="text-md mb-1  fw-semibold">$22,490.00</span>
                                                    <p className="mb-0 fs-12  text-muted">Expenditure</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Buy & Sell Crypto
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Tab.Container defaultActiveKey={"buy"}>
                                        <Nav className="nav-tabs tab-style-1 d-sm-flex d-block nav-justified" role="tablist">
                                            <Nav.Item className=" me-sm-2 me-0" role="presentation">
                                                <Nav.Link eventKey={"buy"} className="" href="#buy-crypto" aria-selected="true" role="tab">Buy</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"sell"} className="" href="#sell-crypto" aria-selected="false" role="tab" tabIndex={-1}>Sell</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey={"buy"} className="border-0 p-0" id="buy-crypto" role="tabpanel" aria-labelledby="buy-crypto">
                                                <div>
                                                    <div className="input-group mb-3 flex-nowrap custom-crypto">
                                                        <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="Enter Value" />
                                                        <SpkSelect name="state" option={Coindata} mainClass="js-example-placeholder-multiple w-full js-states meter-select" defaultvalue={[Coindata[0]]} menuplacement='auto' classNameprefix="Select2" searchable />
                                                    </div>
                                                    <div className="input-group mb-3 flex-nowrap custom-crypto">
                                                        <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="Amount Obtained" />
                                                        <SpkSelect name="state" option={Currencydata} mainClass="js-example-placeholder-multiple w-full js-states meter-select" defaultvalue={[Currencydata[0]]} menuplacement='auto' classNameprefix="Select2" searchable />
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
                                            <Tab.Pane eventKey={"sell"} className="border-0 p-0" id="sell-crypto" role="tabpanel" aria-labelledby="sell-crypto">
                                                <div className="tab-pane border-0 p-0" id="sell-crypto1" role="tabpanel"
                                                    aria-labelledby="sell-crypto1">
                                                    <div className="input-group mb-3 flex-nowrap custom-crypto">
                                                        <Form.Control type="text" className="" aria-label="crypto buy select" placeholder="Select Currency" />
                                                        <SpkSelect name="state" option={Coindata} mainClass="js-example-placeholder-multiple w-full js-states meter-select" defaultvalue={[Coindata[0]]} menuplacement='auto' classNameprefix="Select2" searchable />
                                                    </div>
                                                    <div className="input-group mb-3 flex-nowrap custom-crypto">
                                                        <Form.Control type="text" className="" aria-label="crypto buy select" />
                                                        <SpkSelect name="state" option={Currencydata} mainClass="js-example-placeholder-multiple w-full js-states meter-select" defaultvalue={[Currencydata[0]]} menuplacement='auto' classNameprefix="Select2" searchable />
                                                    </div>
                                                    <div className="mb-3">
                                                        <span className="form-label">Crypto Value :</span>
                                                        <div className="position-relative">
                                                            <div className="p-2 border rounded d-flex align-items-center flex-wrap justify-content-between gap-3 mt-1">
                                                                <div className="gap-2 d-flex align-items-center">
                                                                    <div className="lh-1">
                                                                        <span className="avatar bg-light p-2">
                                                                            <Image src={Bitcoin} alt="" />
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
                                                            <div className="p-2 border rounded d-flex align-items-center flex-wrap gap-2 mt-1">
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
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Assets Overview
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div id="balanceAnalysis" className="p-3">
                                        <Spkapexcharts height={168} type={"radialBar"} width={"100%"} chartOptions={Assetoptions} chartSeries={Assetseries} />
                                    </div>
                                    <div className="border-top border-block-start-dashed p-3">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-sm bg-primary">
                                                    <i className="ri-wallet-3-line fs-16"></i>
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="fw-medium text-muted">Funding</div>
                                                <h6 className="mb-0">$54,784 USD</h6>
                                            </div>
                                            <div className="text-end">
                                                <span className="d-block text-muted fs-12">This Year</span>
                                                <span className="fw-medium text-success">
                                                    <i className="ri-arrow-down-s-fill me-1 align-middle"></i>1.05%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center gap-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-sm bg-secondary">
                                                    <i className="ri-arrow-up-down-line fs-16"></i>
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="fw-medium text-muted">Trading</div>
                                                <h6 className="mb-0">$23,489 USD</h6>
                                            </div>
                                            <div className="text-end">
                                                <span className="d-block text-muted fs-12">This Year</span>
                                                <span className="fw-medium text-danger">
                                                    <i className="ri-arrow-down-s-fill me-1 align-middle"></i>1.05%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Portfolio Overview
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Filters" Customtoggleclass="btn btn-outline-light btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                </SpkDropdown>
                                <div>
                                    <Form.Control className="" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap portfolio-overview-card" header={[{ title: 'Asset Type' }, { title: 'Current Balance (Crypto)' }, { title: 'Current Price (USD)' }, { title: 'Total Value (USD)' }, { title: '24h Change' }, { title: 'Total Gain/Loss (USD)' }, { title: '24h Volume (USD)' }, { title: 'Market Rank', headerClassname: 'text-center' }]}>
                                    {CryptoTableRows.map((crypto, index) => (
                                        <tr key={index} >
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image src={crypto.image} alt={crypto.name} />
                                                        </span>
                                                    </div>
                                                    <div>{crypto.name}</div>
                                                </div>
                                            </td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>{crypto.quantity}</td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>{crypto.price}</td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>{crypto.totalValue}</td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>
                                                <SpkBadge variant="" Customclass={`${crypto.changeColor}`}>{crypto.change}</SpkBadge>
                                            </td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>{crypto.profitLoss}</td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>{crypto.marketCap}</td>
                                            <td className={index === CryptoTableRows.length - 1 ? "border-bottom-0" : ""}>{crypto.rank}</td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <div className="card-footer">
                            <div className="d-flex align-items-center flex-wrap">
                                <div> Showing 6 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-2">
                                        <Pagination className="mb-0 flex-wrap">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item>1</Pagination.Item>
                                            <Pagination.Item active>2</Pagination.Item>
                                            <Pagination.Item><i className='bi bi-three-dots'></i></Pagination.Item>
                                            <Pagination.Item>17</Pagination.Item>
                                            <Pagination.Next className="text-primary">next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default Crypto;