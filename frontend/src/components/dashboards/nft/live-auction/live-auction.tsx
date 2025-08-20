
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { AcuationTags, LiveList, NotificationsLive } from "../../../../shared/data/dashboards/nft/liveacuationdata";
import { Link } from "react-router-dom";
import SpkNftCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/nft/spk-nftcard";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import { MartketPlaceItems } from "../../../../shared/data/dashboards/nft/marketplacedata";
import ethereum_eth_logo from '../../../../assets/images/crypto-currencies/crypto-icons/ethereum-eth-logo.svg';

interface LiveAuctionProps { }

const LiveAuction: React.FC<LiveAuctionProps> = () => {

    const LiveAcuationItems = MartketPlaceItems.slice(0, 6)

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Live Auction" />

            <Pageheader title="Dashboards" subtitle="NFT" currentpage="Live Auction" activepage="Live Auction" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={9} xl={12} lg={12} className="">
                    <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
                        {AcuationTags.map((tag, index) => (
                            <div key={index} className={`nft-tag ${tag.className} ${tag.active ? "active" : ""}`}>
                                <Link to="#!" className="stretched-link"></Link>
                                <span className="nft-tag-text">{tag.text}</span>
                            </div>
                        ))}
                    </div>
                    <Row>
                        <h6 className="fw-medium mb-3">Live Auction:</h6>
                        {LiveAcuationItems.map((card) => (
                            <Col xxl={4} xl={4} lg={4} md={4} sm={6} className="col-12" key={card.id}>
                                <SpkNftCard nft={card} />
                            </Col>
                        ))}
                        <nav aria-label="Page navigation">
                            <Pagination className="justify-content-end mb-4">
                                <Pagination.Prev disabled > Previous </Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Next> Next </Pagination.Next>
                            </Pagination>
                        </nav>
                    </Row>
                </Col>
                <Col xxl={3} xl={12} lg={12} className="">
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Top Drops
                                    </div>
                                    <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled nft-top-drops-list">
                                        {LiveList.map((item, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-md avatar-rounded">
                                                            <Image src={item.image} alt={item.title} />
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
                                                                    <Image src={ethereum_eth_logo}
                                                                        alt="ETH" />
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
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Recent Activity
                                    </div>
                                    <SpkDropdown toggleas="a" Customtoggleclass="pe-2 fs-12 text-muted no-caret" Togglevariant="" Arrowicon={true} Toggletext="Today">
                                        <Dropdown.Item href="#!">Today</Dropdown.Item>
                                        <Dropdown.Item href="#!">This Week</Dropdown.Item>
                                        <Dropdown.Item href="#!">Last Week</Dropdown.Item>
                                    </SpkDropdown>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ListGroup className="list-group-flush">
                                        {NotificationsLive.map((item, index) => (
                                            <ListGroup.Item key={index} className="">
                                                <div className="d-flex gap-3 align-items-start">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-lg">
                                                            <Image width={48} height={48} src={item.image} alt={item.title} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="mb-1">
                                                            <span className="fw-medium">{item.title}</span>
                                                            <span className="fs-12 text-muted ms-2 d-inline-block">{item.time}</span>
                                                        </div>
                                                        <div className="fs-13" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default LiveAuction;