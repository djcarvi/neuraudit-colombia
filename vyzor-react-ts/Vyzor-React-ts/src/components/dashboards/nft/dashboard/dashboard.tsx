
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { BalanceOptions, BalanceSeries, Followers, NftCards, NftOptions, NftSales, NftSeries, NftSwiper, NftTableData, NftTags, StatItems } from "../../../../shared/data/dashboards/nft/nftdashvoarddata";
import SpkNftCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/nft/spk-nftcard";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkSwiperJs from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import nft1 from '../../../../assets/images/nft-images/1.png';

interface NftProps { }

const Nft: React.FC<NftProps> = () => {
    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="NFT-Dashboard" />

            <Pageheader title="Dashboards" subtitle="NFT" currentpage="Dashboard" activepage="NFT" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <div className="row">
                <div className="col-xxl-9">
                    <div className="row">
                        <Col xl={12}>
                            <Card className="custom-card nft-main-banner-card border-0">
                                <Card.Body>
                                    <div className="nft-main-bannr-background grid-cards">
                                        <Image  src={nft1} alt="" className="d-md-block d-none" />
                                    </div>
                                    <h2 className="text-fixed-white">Discover, buy, and sell unique NFTs</h2>
                                    <p className="fs-16 op-8 mb-4">Immerse yourself in a world where digital creativity <br /> meets blockchain technology</p>
                                    <div className="btn-list">
                                        <SpkButton Buttonvariant="" Customclass="btn btn-lg btn-light me-2">Explore</SpkButton>
                                        <SpkButton Buttonvariant="" Customclass="btn btn-lg btn-outline-light text-fixed-white">Sell Artwork</SpkButton>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <div className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <h6 className="fw-medium mb-0">Trending NFT'S :</h6>
                            <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn btn-primary btn-sm btn-wave waves-effect waves-light">1D</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1W</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1M</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn btn-primary-light btn-sm btn-wave waves-effect waves-light">1Y</SpkButton>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
                            {NftTags.map((tag, index) => (
                                <div key={index} className={`nft-tag ${tag.className} ${tag.isActive ? 'active' : ''}`}>
                                    <Link to="#!" className="stretched-link"></Link>
                                    <span className="nft-tag-text">{tag.label}</span>
                                </div>
                            ))}
                        </div>
                        {NftCards.map((card) => (
                            <Col xxl={4} xl={4} lg={4} md={4} sm={6} className="col-12" key={card.id}>
                                <SpkNftCard nft={card} />
                            </Col>
                        ))}
                    </div>
                </div>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="d-flex align-items-start gap-3 mb-2">
                                        <div className="lh-1">
                                            <span className="avatar avatar-md bg-primary-transparent svg-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z"></path><circle cx="16" cy="12" r="1.5"></circle></svg>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="d-block fs-13">Your Balance</span>
                                            <h4 className="fw-semibold mb-1">162.87ETH</h4>
                                            <span className="text-muted fs-12 d-inline-flex align-items-center"><span className="text-success me-2"><i className="ti ti-arrow-narrow-up me-1"></i>2.55%</span>This Year</span>
                                        </div>
                                    </div>
                                    <div id="nft-balance-chart">
                                        <Spkapexcharts height={60} type={"area"} chartOptions={BalanceOptions} chartSeries={BalanceSeries} />
                                    </div>
                                    <div className="d-grid mt-3">
                                        <SpkButton Buttonvariant="primary" Customclass="btn d-inline-flex align-items-center justify-content-center"><i className="ti ti-circle-plus me-1 align-middle fs-14"></i>Top Up Balance</SpkButton>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Top Creators
                                    </div>
                                    <Link to="#!" className="text-muted fs-13">View All <i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled nft-top-collectors-list">
                                        {Followers.map((follower) => (
                                            <li key={follower.id}>
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-md avatar-rounded">
                                                            <Image width={40} height={40} src={follower.image} alt={follower.name} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-semibold d-block">
                                                            {follower.name}
                                                            <i className="bi bi-patch-check-fill text-primary align-middle ms-2"></i>
                                                        </span>
                                                        <span className="text-muted fs-13">{follower.handle}</span>
                                                    </div>
                                                    <div>
                                                        <SpkButton Buttonvariant="" Customclass={`btn rounded-pill ${follower.isFollowing ? 'btn-primary' : 'btn-light'}`}>
                                                            {follower.isFollowing ? 'Following' : 'Follow'}
                                                        </SpkButton>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </div>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                NFT Statistics
                            </div>
                        </Card.Header>
                        <Card.Body className="pb-2">
                            <div className="p-3 border border-dashed rounded mb-4">
                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-5">
                                    {StatItems.map((item, index) => (
                                        <div key={index}>
                                            <div className="mb-2">
                                                {item.title}
                                                <SpkBadge variant="" Customclass={`badge bg-${item.badgeColor} ms-2`}>
                                                    <i className={`${item.badgeIcon} me-1`}></i>
                                                    {item.badge}
                                                </SpkBadge>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="fs-13 text-muted">{item.label}</div>
                                                <h5 className="fw-semibold mb-0">{item.value}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="nft-statistics">
                                <Spkapexcharts height={280} type={"bar"} width={"100%"} chartOptions={NftOptions} chartSeries={NftSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Top Drops
                            </div>
                            <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled nft-top-drops-list">
                                {NftSales.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <Image width={40} height={40} src={item.image} alt={item.title} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <span className="d-block fw-semibold">{item.title}</span>
                                                <span className="fs-13 text-muted">By {item.author}</span>
                                            </div>
                                            <div className="text-end">
                                                <div className="d-flex align-items-center gap-1">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xs">
                                                            <Image width={20} height={20} src={item.avatar} alt="ETH" />
                                                        </span>
                                                    </div>
                                                    <span className="fw-semibold">{item.price}</span>
                                                </div>
                                                <span className="fs-13 text-muted d-block">Sold At</span>
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
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Featured Authors
                            </div>
                            <Link to="#!" className="text-muted fs-13">View All <i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <SpkSwiperJs slides={NftSwiper} autoplay={true} pagination={false} mainClass="pagination-dynamic text-start featured-collections" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                NFT Collection Overview
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <SpkDropdown Togglevariant="" Customtoggleclass="btn btn-outline-light btn-wave waves-effect waves-light no-caret" Arrowicon={true} Toggletext="Price">
                                    <Dropdown.Item>All</Dropdown.Item>
                                    <Dropdown.Item>Under 5 ETH</Dropdown.Item>
                                    <Dropdown.Item>5 ETH - 10 ETH</Dropdown.Item>
                                    <Dropdown.Item>10 ETH - 20 ETH</Dropdown.Item>
                                    <Dropdown.Item>Above 20 ETH</Dropdown.Item>
                                </SpkDropdown>
                                <div>
                                    <Form.Control className="" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'NFT Name' }, { title: 'Creator' }, { title: 'Release Date' }, { title: 'Price' }, { title: 'Status' }, { title: 'Category' }, { title: 'Blockchain' }, { title: 'Ownership' }, { title: 'Volume (ETH)' }]}>
                                    {NftTableData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-md avatar-rounded">
                                                            <Image width={40} height={40} src={item.image} alt={item.title} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="fw-semibold d-block">{item.title}</span>
                                                        <span className="fs-13 text-muted">{item.handle}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.creator}</td>
                                            <td>{item.date}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                <span className={`badge ${item.statusClass}`}>{item.status}</span>
                                            </td>
                                            <td>{item.category}</td>
                                            <td>{item.chain}</td>
                                            <td>{item.edition}</td>
                                            <td>{item.volume}</td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <div className="card-footer">
                            <div className="d-flex align-items-center">
                                <div> Showing 6 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-2">
                                        <Pagination className="mb-0 flex-wrap">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item>{1}</Pagination.Item>
                                            <Pagination.Item active>{2}</Pagination.Item>
                                            <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                            <Pagination.Item>{17}</Pagination.Item>
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Nft;