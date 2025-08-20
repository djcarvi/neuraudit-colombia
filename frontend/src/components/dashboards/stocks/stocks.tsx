
import { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkSwiperJs from "../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import { PortfolioOptions, PortfolioSeries, Recentstocks, StockSwiper, StockTable, Trendingdata, Watchlistdata } from "../../../shared/data/dashboards/stocksdata";
import SpkButtongroup from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttongroup";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkTooltips from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import apple from '../../../assets/images/media/apps/apple.png';
const Stocks = () => {

    const breakpoints = {
        500: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        966: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1400: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        1600: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        1800: {
            slidesPerView: 5,
            spaceBetween: 20,
        },
    }

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Stocks" />

            <Pageheader title="Dashboards" currentpage="Stocks" activepage="Stocks" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <h6 className="fw-semibold mb-3">My Portfolio</h6>
                    <Card className="custom-card">
                        <Card.Body>
                            <SpkSwiperJs slides={StockSwiper} className="swiper-basic swiper-initialized swiper-horizontal swiper-backface-hidden" slidesPerView={1} spaceBetween={20} freemode={true} autoplay={true} breakpoint={breakpoints} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={9}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Portfolio Analysis
                            </div>
                            <SpkButtongroup>
                                <Link to="#!" className="btn btn-sm btn-primary-light">1H</Link>
                                <Link to="#!" className="btn btn-sm btn-primary-light">6H</Link>
                                <Link to="#!" className="btn btn-sm btn-primary-light">12H</Link>
                                <Link to="#!" className="btn btn-sm btn-primary">1D</Link>
                            </SpkButtongroup>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center gap-3 p-3 rounded border border-dashed flex-wrap">
                                <div>
                                    <span className="avatar avatar-lg avatar-rounded">
                                        <Image  src={apple} alt="" className="invert-1" />
                                    </span>
                                </div>
                                <div className="flex-fill">
                                    <span className="d-block fw-semibold">Apple Inc</span>
                                    <span className="fw-medium fs-13 text-muted">AAPL</span>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center mb-1 gap-2">
                                        <SpkBadge variant="" Customclass="bg-success rounded-pill"><i className="ti ti-arrow-narrow-up me-1"></i>0.54%</SpkBadge>
                                        <h4 className="fw-semibold mb-0">$1,63,340</h4>
                                    </div>
                                    <span className="fs-13 text-muted">Last Updated 12:24pm</span>
                                </div>
                            </div>
                            <div id="portfolio-analysis">
                                <Spkapexcharts height={382} type={"area"} width={"100%"} chartOptions={PortfolioOptions} chartSeries={PortfolioSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                My Watchlist
                            </div>
                            <Link to="#!" className="text-muted fs-13">View All</Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled stocks-watchlist">
                                {Watchlistdata.map((stock) => (
                                    <li key={stock.id}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md p-1">
                                                    <Image width={32} height={32} src={stock.image} alt={stock.name} className="invert-1" />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{stock.name}</span>
                                                <span className="fs-13 text-muted">{stock.symbol}</span>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-semibold d-block">{stock.price}</span>
                                                <SpkBadge variant="" Customclass={`bg-${stock.changeType}-transparent`}>
                                                    {stock.change}
                                                </SpkBadge>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <h6 className="fw-semibold mb-3">
                        Trending Stocks :
                    </h6>
                    <Row>
                        {Trendingdata.map((asset) => (
                            <Col xxl={2} xl={4} lg={6} md={6} sm={12} key={asset.id} className="">
                                <Card className="p-3 custom-card border bg-white rounded">
                                    <div className="d-flex gap-2 flex-wrap align-items-center justify-content-between mb-3">
                                        <div className="d-flex flex-fill align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-rounded bg-light p-2">
                                                    <i className={`bi ${asset.icon} ${asset.iconColor} fs-18`}></i>
                                                </span>
                                            </div>
                                            <div className="lh-1">
                                                <span className="fw-semibold d-block mb-2 text-default">{asset.name}</span>
                                                <span className="d-block text-muted fs-12">{asset.value}</span>
                                            </div>
                                        </div>
                                        <div className="text-success fs-12 text-end">
                                            <span className="d-block">
                                                {asset.percentChange}
                                                <i className="ti ti-arrow-bear-right"></i>
                                            </span>
                                            <span className="d-block">{asset.amountChange}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-sm btn-light flex-fill">Short</SpkButton>
                                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-sm btn-primary-light flex-fill">Buy</SpkButton>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xxl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Recent Activities
                            </div>
                            <Link to="#!" className="fs-12 text-muted py-1 tag-link"> View All<i
                                className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled stocks-recent-activities-list">
                                {Recentstocks.map((stock) => (
                                    <li key={stock.id}>
                                        <div className="d-flex gap-2 flex-wrap align-items-start justify-content-between mb-2">
                                            <div className="d-flex flex-fill align-items-center">
                                                <div className="me-2">
                                                    <span className="avatar avatar-md p-1">
                                                        <Image width={40} height={40} src={stock.logo} alt={stock.name} className="invert-1" />
                                                    </span>
                                                </div>
                                                <div className="lh-1">
                                                    <span className="fw-semibold d-block mb-2 text-default">
                                                        {stock.name}
                                                    </span>
                                                    <span className="text-muted">{stock.symbol}</span>
                                                </div>
                                            </div>
                                            <div className="fw-medium fs-14 text-end">
                                                <span className="d-block">{stock.valueChange}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <SpkProgress variant={stock.progressColor} mainClass="progress-xs" animated striped now={stock.progressBarWidth} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                My Stocks
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="form-control-sm" type="text"
                                        placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-sm btn-primary  btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                    <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                    <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'Name' }, { title: 'Price' }, { title: 'Date Invested' }, { title: 'Market Cap' }, { title: 'Price Change' }, { title: 'Volume' }, { title: 'Actions' }]}>
                                    {StockTable.map((stock) => (
                                        <tr key={stock.id}>
                                            <td>{stock.id}</td>
                                            <td>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm">
                                                            <Image width={28} height={28} src={stock.logo} alt={stock.name} className="invert-1" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill lh-1">
                                                        <Link to="#!" className="d-block mb-1 fs-14 fw-medium">
                                                            {stock.name}
                                                        </Link>
                                                        <span className="d-block fs-12 text-muted">{stock.symbol}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{stock.price}</td>
                                            <td>
                                                <span className="text-muted">{stock.date}</span>
                                            </td>
                                            <td>{stock.marketCap}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`badge ${stock.change.includes("-") ? "bg-danger-transparent text-danger" : "bg-success-transparent text-success"}`}>
                                                    {stock.change}
                                                </SpkBadge>
                                            </td>
                                            <td>{stock.volume}</td>
                                            <td>
                                                <div className="btn-list">
                                                    <SpkTooltips placement="top" title="Edit">
                                                        <Link to="#!" className="btn btn-icon btn-primary-light btn-sm">
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Link>
                                                    </SpkTooltips>
                                                    <SpkTooltips placement="top" title="Delete">
                                                        <Link to="#!" className="btn btn-icon btn-danger-light btn-sm">
                                                            <i className="bi bi-trash"></i>
                                                        </Link>
                                                    </SpkTooltips>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <div className="d-flex align-items-center">
                                <div> Showing 6 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <Pagination className="mb-0">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item active>{1}</Pagination.Item>
                                            <Pagination.Item>{2}</Pagination.Item>
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

        </Fragment>
    )
};

export default Stocks;