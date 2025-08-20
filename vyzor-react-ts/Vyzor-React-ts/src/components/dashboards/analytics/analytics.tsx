
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { AnalyticData, Audienceoptions, Audienceseries, Averageoptions, Averageseries, BrowsersData, CountryData, Devices, Engagementdata, InfluencerData, ListItemsData, Sessionoptions, Sessionseries, Timeoptions, Timeseries } from "../../../shared/data/dashboards/analyticsdata";
import SpkAnalyticsCard from "../../../shared/@spk-reusable-components/dashboards-reusable/spk-analyticscard";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTooltips from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import Seo from "../../../shared/layouts-components/seo/seo";

interface AnalyticsProps { }

const Analytics: React.FC<AnalyticsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Dashboards-Analytics" />
            <Pageheader title="Dashboards" currentpage="Analytics" activepage="Analytics" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        {AnalyticData.map((idx, index) => (
                            <Col xxl={3} lg={6} key={index}>
                                <SpkAnalyticsCard analytic={idx} />
                            </Col>
                        ))}
                        <Col xxl={4}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between custom-analytics">
                                    <div className="card-title">
                                        Sessions By Device
                                    </div>
                                    <SpkDropdown Id="dropdownMenuButton1" toggleas="a" Togglevariant="" Menulabel="dropdownMe nuButton1" Toggletext="View All" Customtoggleclass="p-0 fs-12 text-muted no-caret" Arrowicon={true}>
                                        <Dropdown.Item as="li" href="#!">Day</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Month</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Year</Dropdown.Item>
                                    </SpkDropdown>
                                </Card.Header>
                                <Card.Body>
                                    <div id="sessions-device">
                                        <Spkapexcharts height={258} type={"donut"} width={"100%"} chartOptions={Sessionoptions} chartSeries={Sessionseries} />
                                    </div>
                                </Card.Body>
                                <Card.Footer className="p-0">
                                    <div className="row">
                                        {Devices.map((device, index) => (
                                            <div key={index} className="col">
                                                <div className={`p-3 text-center ${device.border ? "border-sm-end" : ""}`}>
                                                    <h5 className="fw-semibold mb-1">{device.percentage}</h5>
                                                    <span className="fs-12 d-block">{device.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col xxl={8}>
                            <Card className=" custom-card">
                                <Card.Header className="">
                                    <div className="card-title">
                                        Audience Metrics
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div id="audience-metrics">
                                        <Spkapexcharts height={330} type={"line"} width={"100%"} chartOptions={Audienceoptions} chartSeries={Audienceseries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xxl={4} lg={6}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Visitors By Countries
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-wrap visitors-countries-table" header={[{ title: 'S.No' }, { title: 'Country' }, { title: 'Visitors' }]}>
                                            {CountryData.map((data, index) => (
                                                <tr key={index}>
                                                    <td className="border-bottom-0">{data.rank}</td>
                                                    <td className="border-bottom-0">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xs">
                                                                    <Image src={data.flagUrl} alt={data.country} />
                                                                </span>
                                                            </div>
                                                            <div className="fw-semibold">{data.country}</div>
                                                        </div>
                                                    </td>
                                                    <td className="border-bottom-0 text-end">
                                                        <span className="fs-12 text-muted me-2">
                                                            (
                                                            <i className={`ti ti-arrow-${data.percentageChange.startsWith("-") ? "down text-danger" : "up text-success"} fs-16 align-middle`}></i>
                                                            {data.percentageChange})
                                                        </span>
                                                        {data.count.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xxl={8} lg={6}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Top Campaigns
                                    </div>
                                    <SpkDropdown Togglevariant="" toggleas="a" Customtoggleclass="p-0 fs-12 text-muted tag-link no-caret" Toggletext="View All" Arrowicon={true}>
                                        <Dropdown.Item>Download</Dropdown.Item>
                                        <Dropdown.Item>Import</Dropdown.Item>
                                        <Dropdown.Item>Export</Dropdown.Item>
                                    </SpkDropdown>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive campaigntable">
                                        <SpkTables tableClass="text-nowrap" header={[{ title: 'Provider' }, { title: 'Sales' }, { title: 'Goal' }, { title: 'Status' }, { title: 'Action' }]}>
                                            {InfluencerData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center lh-1">
                                                            <span className="avatar avatar-sm p-1 bg-light me-2">
                                                                <Image src={data.avatarUrl} alt={data.name} />
                                                            </span>
                                                            <div>
                                                                <p className="fw-medium mb-1">{data.name}</p>
                                                                <span className="fs-12 text-muted">{data.role}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{data.earnings}</td>
                                                    <td>
                                                        <span className={`text-${data.percentageColor}`}>
                                                            {data.percentage}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass={`${data.status === "Achieved" ? "bg-success-transparent" : "bg-info-transparent"}`}>
                                                            {data.status}
                                                        </SpkBadge>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="btn-list">
                                                            <SpkTooltips placement="top" title="Edit">
                                                                <Link to="#!" className="btn btn-light btn-icon btn-sm">
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </Link>
                                                            </SpkTooltips>
                                                            <SpkTooltips placement="top" title="Delete">
                                                                <Link to="#!" className="btn btn-light btn-icon btn-sm me-0">
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
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Engagement Metrics
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div>
                                            <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                        </div>
                                        <SpkDropdown Id="dropdownMenuButton1" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn btn-primary btn-sm btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                            <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                        </SpkDropdown>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap" header={[{ title: 'S.No', headerClassname: 'text-center' }, { title: 'User' }, { title: 'Sessions' }, { title: 'Country' }, { title: 'Page Views' }, { title: 'Bounce Rate' }, { title: 'Conversion Rate', headerClassname: 'text-center' }]}>
                                            {Engagementdata.map((user) => (
                                                <tr key={user.rank}>
                                                    <td className="text-center">{user.rank}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-sm avatar-rounded">
                                                                    <Image  src={user.avatarUrl} alt={user.name} />
                                                                </span>
                                                            </div>
                                                            <div>{user.name}</div>
                                                        </div>
                                                    </td>
                                                    <td>{user.clicks}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xs avatar-rounded">
                                                                    <Image  src={user.countryFlagUrl} alt={user.country} />
                                                                </span>
                                                            </div>
                                                            <div>{user.country}</div>
                                                        </div>
                                                    </td>
                                                    <td className="">{user.views}</td>
                                                    <td className="">{user.conversionRate}</td>
                                                    <td className="text-center">{user.percentage}</td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div> Showing 5 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
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
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Browser Insights
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled browser-insights-list">
                                        {BrowsersData.map((browser, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            <Image src={browser.imageUrl} alt={browser.name} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-medium">{browser.name}</span>
                                                        <span className="d-block text-muted fs-12">{browser.company}</span>
                                                    </div>
                                                    <div className="text-end w-25">
                                                        <span className="d-block mb-1 fw-semibold">{browser.downloads}</span>
                                                        <SpkProgress variant={browser.progressColor} animated striped mainClass="progress-xs w-75 ms-auto" now={browser.progress} />
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Users By Time Of Week
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div id="users-by-time">
                                        <Spkapexcharts height={262} type={"heatmap"} width={"100%"} chartOptions={Timeoptions} chartSeries={Timeseries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Top Referral Pages
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3 flex-wrap">
                                        <h4 className="fw-bold mb-0">4,289</h4>
                                        <div className="ms-2">
                                            <SpkBadge variant="" Customclass="badge bg-success-transparent">1.02<i className="ri-arrow-up-s-fill align-mmiddle ms-1"></i></SpkBadge>
                                            <span className="text-muted ms-1 text-nowrap">compared to last week</span>
                                        </div>
                                    </div>
                                    <div className="progress-stacked progress-animate progress-sm mb-4">
                                        <div className="progress-bar" role="progressbar" style={{ width: "21%" }} aria-valuenow={21} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-info" role="progressbar" style={{ width: "26%" }} aria-valuenow={26} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: "35%" }} aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-success" role="progressbar" style={{ width: "18%" }} aria-valuenow={18} aria-valuemin={0} aria-valuemax={100}></div>
                                    </div>
                                    <ul className="list-unstyled mb-0 pt-2 top-referral-pages">
                                        {ListItemsData.map((item, index) => (
                                            <li key={index} className={item.className}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>{item.path}</div>
                                                    <div className="fs-12 text-muted">{item.views}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Average Sessions
                                    </div>
                                </Card.Header>
                                <Card.Body className="pb-0">
                                    <div className="d-flex gap-3 flex-wrap align-items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" className="text-primary bg-primary-transparent rounded-1 px-1" viewBox="0 0 24 24"><g fill="currentColor"><path fillOpacity="0.5" d="M8 13h6v4H8z"></path><path d="M6 6H4v12h2zm14 1H8v4h12z"></path></g></svg> <div>
                                            <h6 className="fw-medium mb-0">3m 45s</h6>
                                        </div>
                                        <div className="ms-auto text-muted fs-11 text-end">
                                            <div className="fw-medium">From Last Week</div>
                                            <span className="text-success fw-semibold"> 1.25% <i className="ri-arrow-up-line lh-1 align-center fs-14 fw-normal"></i></span>
                                        </div>
                                    </div>
                                    <div id="analytics-avgsession">
                                        <Spkapexcharts height={285} type={"bar"} width={"100%"} chartOptions={Averageoptions} chartSeries={Averageseries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

        </Fragment>
    )
};

export default Analytics;