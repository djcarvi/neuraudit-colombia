
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { MarketData, MartketTable, PortfolioData } from "../../../../shared/data/dashboards/crypto/marketdata";
import SpkMarketCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/crypto-reusable/spk-marketcard";
import { Link } from "react-router-dom";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";

interface MarketCapProps { }

const Marketcap: React.FC<MarketCapProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Market Cap" />

            <Pageheader title="Dashboards" subtitle="Crypto" currentpage="Market Cap" activepage="Market Cap" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                {MarketData.map((market, index) => (
                    <Col key={index} xxl={3} xl={6} lg={12} className="">
                        <SpkMarketCard cardClass="overflow-hidden" market={market} />
                    </Col>
                ))}
                <Col xxl={3} xl={6} lg={12}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                My Top Currencies
                            </div>
                            <div>
                                <Link to="#!" className="fw-medium text-success fs-13 text-decoration-underline">View All</Link>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup className="list-group list-group-flush">
                                {PortfolioData.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div>
                                                    <span className="avatar avatar-sm p-1 bg-light">
                                                        <Image src={item.imgSrc} alt={item.name} width={28} height={28} />
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="d-block fw-medium">{item.name}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="fw-medium d-block">{item.quantity}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-medium d-block">{item.value}</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start::row-2  --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Crypto MarketCap
                            </div>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <div>
                                    <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Customtoggleclass="btn btn-primary btn-sm btn-wave waves-effect waves-light no-caret" Toggletext="Sort By" Arrowicon={true}>
                                    <li><Dropdown.Item href="#!">Market Cap</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Price</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Trading Volume</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Price Change (24h)</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Rank</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">A - Z</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">All-Time High (ATH)</Dropdown.Item></li>
                                </SpkDropdown>
                                <div>
                                    <SpkButton Buttonvariant="" Customclass="btn btn-light btn-sm btn-wave border">View All</SpkButton>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: "" }, { title: '#', headerClassname: 'fw-medium' }, { title: 'Crypto Name' }, { title: 'MarketCap' }, { title: "Price (USD)" }, { title: '1h Change' }, { title: '24h Change' }, { title: 'Volume (24h)' }, { title: 'Circulating Supply' }, { title: 'last 1Week' }, { title: 'Trade' }]}>
                                    {MartketTable.map((crypto) => (
                                        <tr key={crypto.rank}>
                                            <td className="text-center">
                                                <Link to="#!">
                                                    <i className="ri-star-line fs-16 text-muted"></i>
                                                </Link>
                                            </td>
                                            <td>{crypto.rank}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xs avatar-rounded">
                                                            <Image src={`${crypto.imgsrc}`} alt={crypto.name} />
                                                        </span>
                                                    </div>
                                                    <div className="fw-medium">
                                                        <Link to="#!">{`${crypto.name} (${crypto.symbol})`}</Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="fw-medium">{crypto.marketCap}</span>
                                            </td>
                                            <td>
                                                <span className="fw-medium">
                                                    <Link to="#!">{crypto.price}</Link>
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`fw-medium text-${crypto.priceChangeColor}`}>
                                                    <i className={`ti ti-arrow-narrow-${crypto.priceIcon} fs-15 fw-medium`}></i>
                                                    {crypto.priceChange1h}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`fw-medium text-${crypto.priceChange24hColor}`}>
                                                    <i className={`ti ti-arrow-narrow-${crypto.priceIcons} fs-15 fw-medium`}></i>
                                                    {crypto.priceChange24h}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to="#!">
                                                    <span className="d-block fw-medium">{crypto.volume}</span>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to="#!">
                                                    <span className="fw-medium d-block">{crypto.circulatingSupply}</span>
                                                </Link>
                                            </td>
                                            <td>
                                                <div id={crypto.chartId}>
                                                    <Spkapexcharts height={30} width={120} type={"line"} chartOptions={crypto.chartOptions} chartSeries={crypto.chartSeries} />
                                                </div>
                                            </td>
                                            <td>
                                                <SpkButton Buttonvariant="" Customclass="btn btn-success-light btn-sm">Trade</SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <nav aria-label="Page navigation" className="pagination-style-2">
                                <Pagination className="mb-0 flex-wrap justify-content-end">
                                    <Pagination.Prev disabled>Prev</Pagination.Prev>
                                    <Pagination.Item active>{1}</Pagination.Item>
                                    <Pagination.Item>{2}</Pagination.Item>
                                    <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                    <Pagination.Item>{17}</Pagination.Item>
                                    <Pagination.Next className="text-primary">Next</Pagination.Next>
                                </Pagination>
                            </nav>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-2  --> */}

        </Fragment>
    )
};

export default Marketcap;