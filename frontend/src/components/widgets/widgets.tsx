

import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Image, Row } from "react-bootstrap";
import { Map } from 'pigeon-maps'
import Seo from "../../shared/layouts-components/seo/seo";
import Pageheader from "../../shared/layouts-components/pageheader/pageheader";
import { ActivityItems, Categoriesdataoptions, Categoriesdataseries, Categoriesoptions, Categoriesseries, CategoryData, CategoryItemsData, Countries, Employeesdata, Ordersdata, Productsdata, Recentoptions, Recentseries, Revenuesoptions, Revenuesseries, Salesdata, StatusData, Trafficoptions, Trafficseries, Transactionsdata, Visitorsoptions, Visitorsseries } from "../../shared/data/widgets/widgetsdata";
import SpkEmployeeStatCard from "../../shared/@spk-reusable-components/reusable-widgets/spk-employeecard";
import SpkSalesCard from "../../shared/@spk-reusable-components/reusable-widgets/spk-salescard";
import SpkProductscard from "../../shared/@spk-reusable-components/reusable-widgets/spk-productscard";
import { Link } from "react-router-dom";
import Spkapexcharts from "../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkProgress from "../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkDropdown from "../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";


interface WidgetsProps { }

const Widgets: React.FC<WidgetsProps> = () => {

 const [center, setCenter] = useState<[number, number]>([50.879, 4.6997])
     const [zoom, setZoom] = useState(11)

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Widgets"} />

            <Pageheader title="Widgets" currentpage="Widgets" activepage="Widgets" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <div className="row row-cols-xxl-5">
                {Employeesdata.map((idx, index) => (
                    <SpkEmployeeStatCard key={index} widget={idx} />
                ))}
            </div>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                {Salesdata.map((sales, index) => (
                    <SpkSalesCard key={index} sales={sales} />
                ))}
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <Row className="gy-4">
                                {Productsdata.map((products, index) => (
                                    <SpkProductscard key={index} products={products} />
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Top Categories
                            </div>
                            <Link to="#!" className="fs-12 text-muted"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                        </Card.Header>
                        <Card.Body>
                            <div id="top-categories">
                                <Spkapexcharts chartOptions={Categoriesoptions} chartSeries={Categoriesseries} type={"line"} height={155} width={"100%"} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <ul className="list-group list-group-flush">
                                {CategoryData.map((category, index) => (
                                    <li key={index} className="list-group-item">
                                        <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                                            <div className={`top-category-type ${index === 0 ? "one" : index === 1 ? "two" : "three"}`}>
                                                <div className="fw-medium">{category.title}</div>
                                                <span className="fs-13 text-muted">
                                                    {category.percentageChange} <span className={`text-${category.percentageColor} ms-1 fw-medium d-inline-block`}>{category.percentage}</span>
                                                </span>
                                            </div>
                                            <div className="text-end">
                                                <span className="d-block fs-13 text-muted">Sales</span>
                                                <span className="d-block fw-semibold mb-0">{category.sales}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Top Country Sales
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="sales-locations">
                                 <Map  center={center} zoom={zoom} onBoundsChanged={({ center, zoom }) => { setCenter(center); setZoom(zoom) }} />
                            </div>
                            <div className="mt-4">
                                <ul className="list-unstyled sales-locations-list">
                                    {Countries.map((country) => (
                                        <li key={country.id}>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <div className="lh-1">
                                                    <span className="avatar avatar-xs avatar-rounded">
                                                        <Image src={country.flag} alt={country.name} />
                                                    </span>
                                                </div>
                                                <div className="flex-fill">{country.name}</div>
                                                <div>{country.population.toLocaleString()}</div>
                                            </div>
                                            <SpkProgress variant="primary" mainClass="progress-xs" animated striped now={country.now} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Sales Revenue</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="salesOverview">
                                <Spkapexcharts chartOptions={Revenuesoptions} chartSeries={Revenuesseries} type={"bar"} height={365} width={"100%"} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xxl={4} xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Top Categories
                            </div>
                            <SpkDropdown Togglevariant="" Customtoggleclass="btn-primary-light btn-sm no-caret" Arrowicon={true} Toggletext="This Week">
                                <Dropdown.Item>Today</Dropdown.Item>
                                <Dropdown.Item active>This Week</Dropdown.Item>
                                <Dropdown.Item>Last Week</Dropdown.Item>
                            </SpkDropdown>
                        </Card.Header>
                        <Card.Body className="">
                            <div className="row align-items-center justify-content-center my-2">
                                <div className="col">
                                    <div className="text-center mx-auto">
                                        <div id="top-categories1" className="py-3 text-center mx-auto">
                                            <Spkapexcharts chartOptions={Categoriesdataoptions} chartSeries={Categoriesdataseries} type={"donut"} height={212} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <ul className="list-unstyled top-categories-list1 gy-1">
                                        {CategoryItemsData.map((category, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className={`ri-circle-fill fs-10 ${category.colorClass}`} />
                                                        {category.name}
                                                    </div>
                                                    <div className={`fw-semibold ${category.colorClass}`}>{category.percentage}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <div className="col border-end border-inline-end-dashed">
                                    <div className="text-center">
                                        <span className="text-muted">Last Month</span>
                                        <h4 className="fw-semibold mb-0">13,965</h4>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="text-center">
                                        <span className="d-block text-muted mb-1">This Month</span>
                                        <h4 className="fw-semibold mb-0">15,367</h4>
                                    </div>
                                </div>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl={5} xl={6}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Recent Orders
                            </div>
                            <Link to="#!" className="link-primary fw-semibold">View All Orders<i className="ri-arrow-right-s-line ms-1 align-middle"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Order ID' }, { title: 'Payment Mode' }, { title: 'Status' }, { title: 'Amount Paid' }, { title: "Action" }]} >
                                    {Ordersdata.map((txn, index) => (
                                        <tr key={index}>
                                            <td><span className="fw-semibold">{txn.id}</span></td>
                                            <td>
                                                <div>
                                                    <span className="d-block fw-semibold">{txn.method}</span>
                                                    <span className="d-block fs-12 text-muted">{txn.methodDetails}</span>
                                                </div>
                                            </td>
                                            <td><SpkBadge variant="" Customclass={`bg-${txn.statusColor}`}>{txn.status}</SpkBadge></td>
                                            <td>
                                                <div>
                                                    <span className="d-block fw-semibold">{txn.amount}</span>
                                                    <span className="d-block fs-12 text-muted">{txn.date}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-outline-light btn-wave waves-effect waves-light">
                                                    <i className="fe fe-eye text-muted align-middle me-2 d-inline-block"></i>
                                                    View
                                                </SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Social Visitors
                            </div>
                        </Card.Header>
                        <Card.Body className="py-0">
                            <div id="social-visitors">
                                <Spkapexcharts chartOptions={Visitorsoptions} chartSeries={Visitorsseries} height={392} type={"bar"} width={"100%"} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Social Traffic
                            </div>
                        </Card.Header>
                        <Card.Body className="pb-0 px-0">
                            <div id="social-traffic1">
                                <Spkapexcharts chartOptions={Trafficoptions} chartSeries={Trafficseries} height={315} type={"bar"} width={"100%"} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Recent Orders
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="recent-orders">
                                <Spkapexcharts chartOptions={Recentoptions} chartSeries={Recentseries} height={260} type={"donut"} width={"100%"} />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Row className="gy-4">
                                {StatusData.map((item, index) => (
                                    <Col xl={6} className="" key={index}>
                                        <div className="d-flex align-items-start gap-3 flex-wrap">
                                            <div>
                                                <span className={`avatar avatar-rounded ${item.colorClass}`}>
                                                    {item.svg}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="d-block text-muted fs-13">{item.label}</span>
                                                <span className="d-block fw-semibold fs-16">{item.count}</span>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Recent Transactions
                            </div>
                            <Link to="#!" className="fs-12 text-muted fw-medium"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled widgets-transactions-list">
                                {Transactionsdata.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md avatar-rounded ${item.bgClass}`}>
                                                    {item.svg}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{item.name}</span>
                                                <span className="d-block text-muted fs-12">{item.time}</span>
                                            </div>
                                            <div className="text-end">
                                                <SpkBadge variant="" Customclass={`${item.badgeClass}`}>{item.status}</SpkBadge>
                                                <span className="d-block mt-1">{item.amount}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Recent Activity</div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled mb-0 ecommerce-recent-activity">
                                {ActivityItems.map((item, index) => (
                                    <li key={index} className="ecommerce-recent-activity-content">
                                        <div className="d-flex align-items-start">
                                            <div className="me-3">
                                                <span className={`avatar avatar-sm avatar-rounded bg-light ${item.avatarTextClass} fw-semibold`}>
                                                    <i className={item.iconClass}></i>
                                                </span>
                                            </div>
                                            <div className="activity-content">
                                                <span className="d-block fw-medium">{item.title}</span>
                                                <span className="d-block fs-12 text-muted">{item.subtitle}</span>
                                            </div>
                                            <div className="flex-fill text-end">
                                                <span className={`d-block ${item.timeColorClass} fs-11 op-7`}>{item.time}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

        </Fragment>
    )
};

export default Widgets;