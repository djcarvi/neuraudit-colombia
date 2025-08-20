
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { AcivitySocial, Audiencedata, EngagementOptions, EngagementSeries, Insightsdata, MetricsOptions, MetricsSeries, SocialCards, SocialGenderoptions, SocialGenderseries, SocialMediaData, SocialMediaOptions, SocialMediaSeries, Suggestion } from "../../../shared/data/dashboards/socialmediadata";
import SpkSocialCard from "../../../shared/@spk-reusable-components/dashboards-reusable/spk-socialcard";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import { Link } from "react-router-dom";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface SocialMediaProps { }

const SocialMedia: React.FC<SocialMediaProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Social Media" />

            <Pageheader title="Dashboards" currentpage="Social Media" activepage="Social Media" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        {SocialCards.map((idx, index) => (
                            <Col xxl={3} md={6} key={index}>
                                <SpkSocialCard cardClass="dashboard-main-card" media={idx} />
                            </Col>
                        ))}
                        <Col xl={8}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Profile Visits
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div id="profile-analysis">
                                        <Spkapexcharts chartOptions={SocialMediaOptions} chartSeries={SocialMediaSeries} type={"line"} height={320} width={"100%"} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Audience By Gender
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div id="audience-by-gender">
                                        <Spkapexcharts chartOptions={SocialGenderoptions} chartSeries={SocialGenderseries} type={"radar"} height={280} width={"100%"} />
                                    </div>
                                    <div className="row mt-0">
                                        <div className="col-6 border-end border-inline-end-dashed text-center">
                                            <p className="text-muted mb-1 fs-12">Male</p>
                                            <h6 className="text-primary mb-0">12.34K</h6>
                                        </div>
                                        <div className="col-6 text-center">
                                            <p className="text-muted mb-1 fs-12">Female</p>
                                            <h6 className="text-secondary mb-0">10.19K</h6>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={6}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Top Audience Countries
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'Country' }, { title: 'Engagement' }, { title: 'Followers' }]}>
                                            {Audiencedata.map((row) => {
                                                const changeClass = row.change > 0 ? 'text-success' : 'text-danger';
                                                const icon = row.change > 0 ? 'ti ti-trending-up' : 'ti ti-trending-down';
                                                const percentageChange = `${Math.abs(row.change).toFixed(2)}%`;

                                                return (
                                                    <tr key={row.id}>
                                                        <td>{row.id}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="lh-1 flex-shrink-0">
                                                                    <span className="avatar avatar-sm">
                                                                        <Image  src={`${row.flag}`} alt={row.country} />
                                                                    </span>
                                                                </div>
                                                                <div className="fw-semibold text-wrap">{row.country}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="d-block">
                                                                {row.likes.toLocaleString()} <i className="ti ti-thumb-up text-muted fs-18"></i>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-block">
                                                                {row.count}
                                                                <span className={`fs-12 ${changeClass} ms-1 d-inline-flex`}>
                                                                    <i className={`${icon} me-1 align-middle`}></i>
                                                                    {percentageChange}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={6}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Post Insights
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap post-insight-table" header={[{ title: 'Post Name' }, { title: 'Posted' }, { title: 'Platform' }, { title: 'Views' }, { title: 'Action' }]} >
                                            {Insightsdata.map((row) => (
                                                <tr key={row.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-sm">
                                                                    <Image  src={`${row.image}`} alt={row.title} />
                                                                </span>
                                                            </div>
                                                            <span className="fw-medium">{row.title}</span>
                                                        </div>
                                                    </td>
                                                    <td>{row.date}</td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass={`bg-${row.platformColor}-transparent`}>{row.platform}</SpkBadge>
                                                    </td>
                                                    <td>{row.followers}</td>
                                                    <td className="text-end">
                                                        <SpkDropdown Id="dropdownMenuButton1" Togglevariant="primary-light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="ti ti-dots-vertical" Customtoggleclass="btn btn-icon btn-sm no-caret">
                                                            <Dropdown.Item className=""><i className="ti ti-edit me-2 d-inline-block"></i>Edit</Dropdown.Item>
                                                            <Dropdown.Item className=""><i className="ti ti-trash me-2 d-inline-block"></i>Delete</Dropdown.Item>
                                                        </SpkDropdown>
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
                                        Social Media Performance Overview
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div>
                                            <Form.Control className="form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                        </div>
                                        <SpkDropdown Id="dropdownMenuButton1" Togglevariant="primary" Menulabel="dropdownMenuButton1" Toggletext="Sort By" Customtoggleclass="btn  btn-sm btn-wave waves-effect waves-light no-caret" Arrowicon={true}>
                                            <Dropdown.Item as="li" href="#!">New</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Popular</Dropdown.Item>
                                            <Dropdown.Item as="li" href="#!">Relevant</Dropdown.Item>
                                        </SpkDropdown>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap" showCheckbox={true} header={[{ title: 'Platform' }, { title: 'Posts' }, { title: 'Likes' }, { title: 'Shares' }, { title: 'Comments' }, { title: 'Impressions' }, { title: 'Followers' }, { title: 'CTR (%)' }, { title: 'Actions' }]} >
                                            {SocialMediaData.map((data) => (
                                                <tr key={data.id}>
                                                    <td>
                                                        <input className="form-check-input" type="checkbox" id={data.id} value="" aria-label="..." defaultChecked={data.id == 1 || data.id == 4 || data.id == 5} />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lh-1">
                                                                <span className={`avatar avatar-sm bg-${data.color}-transparent`}>
                                                                    <i className={`ri ${data.avatar} fs-5`}></i>
                                                                </span>
                                                            </div>
                                                            <div>{data.platform}</div>
                                                        </div>
                                                    </td>
                                                    <td>{data.followers}</td>
                                                    <td>{data.impressions}</td>
                                                    <td>{data.clicks}</td>
                                                    <td>{data.conversions}</td>
                                                    <td>{data.conversionRate}%</td>
                                                    <td>{data.reach}</td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass={`bg-${data.badgeColor}-transparent`}>{data.growth}</SpkBadge>
                                                    </td>
                                                    <td>
                                                        <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-icon btn-sm btn-light no-caret" Toggletext="" IconClass="ti ti-dots-vertical" Icon={true}>
                                                            <Dropdown.Item href="#!"><i className="ti ti-eye me-2 d-inline-block"></i> View</Dropdown.Item>
                                                            <Dropdown.Item href="#!"><i className="ti ti-edit me-2 d-inline-block"></i> Edit</Dropdown.Item>
                                                            <Dropdown.Item href="#!"><i className="ti ti-trash me-2 d-inline-block"></i> Delete</Dropdown.Item>
                                                        </SpkDropdown>
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
                                            <nav aria-label="Page navigation" className="pagination-style-2">
                                                <Pagination className="mb-0 flex-wrap">
                                                    <Pagination.Prev disabled> Prev </Pagination.Prev>
                                                    <Pagination.Item>1</Pagination.Item>
                                                    <Pagination.Item active>2</Pagination.Item>
                                                    <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                                    <Pagination.Item>17</Pagination.Item>
                                                    <Pagination.Next className="text-primary"> Next </Pagination.Next>
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
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                    Recent Activity
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled social-recent-activity-list">
                                        {AcivitySocial.map((activity, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="lh-1">
                                                        <span className={`avatar avatar-md avatar-rounded ${activity.badgeColor}`}>
                                                            <i className={`fs-5 ${activity.icon}`}></i>
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <div className="d-flex align-items-start gap-2 justify-content-between mb-1">
                                                            <span className="fw-semibold d-block">{activity.platform}</span>
                                                            <SpkBadge variant="" Customclass={`${activity.badgeColor}`}>{activity.time}</SpkBadge>
                                                        </div>
                                                        <div className="fs-13 text-muted social-activity">{activity.activity}</div>
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
                                <Card.Header>
                                    <div className="card-title">
                                        Audience Age Metrics
                                    </div>
                                </Card.Header>
                                <Card.Body className="py-0">
                                    <div id="audience-age-metrics">
                                        <Spkapexcharts height={375} type={"bar"} width={"100%"} chartOptions={MetricsOptions} chartSeries={MetricsSeries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Suggestions
                                    </div>
                                    <Link to="#!" className="text-muted">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled social-suggestions-list">
                                        {Suggestion.map((user, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-md">
                                                            <Image  src={user.imageSrc} alt={user.name} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-semibold d-block">{user.name}</span>
                                                        <span className="text-muted d-block">{user.mutualFriends}</span>
                                                    </div>
                                                    <div>
                                                        <SpkButton Buttonvariant="light" aria-label="button" Buttontype="button" Customclass="btn btn-sm btn-icon border">
                                                            <i className="ri-user-add-line"></i>
                                                        </SpkButton>
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
                                    <div className="card-title">Engagement</div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fs-12 text-success"><i className="ti ti-arrow-up"></i>2.45%</span>
                                        <h5 className="fw-semibold mb-0">231,232</h5>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div id="social-engagement">
                                        <Spkapexcharts type={"heatmap"} height={200} width={"100%"} chartOptions={EngagementOptions} chartSeries={EngagementSeries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment >
    )
};

export default SocialMedia;