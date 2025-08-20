
import React, { Fragment } from "react";
import { Card, Col, Nav, Pagination, Row, Tab } from "react-bootstrap";
import { MartketPlaceItems, MartketPlaceItems1 } from "../../../../shared/data/dashboards/nft/marketplacedata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkNftCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/nft/spk-nftcard";

interface MarketPlaceProps { }

const MarketPlace: React.FC<MarketPlaceProps> = () => {

    const Market = MartketPlaceItems.slice(0, 2)
    const MarketDomain = MartketPlaceItems.filter(items => [2].includes(items.id))
    const MarketMusic = MartketPlaceItems.filter(items => [3].includes(items.id))
    const MarketReal = MartketPlaceItems.filter(items => [4].includes(items.id))
    const MarketSports = MartketPlaceItems.filter(items => [5].includes(items.id))
    const MarketFashion = MartketPlaceItems.filter(items => [6].includes(items.id))
    const MarketAvatars = MartketPlaceItems.filter(items => [7].includes(items.id))
    const MarketMemes = MartketPlaceItems.filter(items => [8].includes(items.id))

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Market Place" />

            <Pageheader title="Dashboards" subtitle="NFT" currentpage="Market Place" activepage="Market Place" />

            {/* <!-- Page Header Close --> */}

            <Tab.Container defaultActiveKey={"all"}>

                {/* <!-- Start::row-1 --> */}

                <Row>
                    <Col xl={12}>
                        <Card className="custom-card">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div>
                                        <Nav className="nav-tabs nav-tabs-header mb-0" role="tablist">
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"all"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-all" aria-selected="true">All</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"art"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-art" aria-selected="false" tabIndex={-1}>Art</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"gaming"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-gaming" aria-selected="false" tabIndex={-1}>Gaming</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"domain"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-domain" aria-selected="false" tabIndex={-1}>Domain</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"music"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-music" aria-selected="false" tabIndex={-1}>Music</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"realestate"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-realestate" aria-selected="false" tabIndex={-1}>Real Estate</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"sports"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-sports" aria-selected="false" tabIndex={-1}>Sports</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"fashion"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-fashion" aria-selected="false" tabIndex={-1}>Fashion</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"avatars"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-avatars" aria-selected="false" tabIndex={-1}>Avatars</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="" role="presentation">
                                                <Nav.Link eventKey={"memes"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#nft-memes" aria-selected="false" tabIndex={-1}>Memes</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <SpkButton Buttonvariant="secondary" Buttontype="button" Customclass="btn btn-sm btn-wave">Filters</SpkButton>
                                        <SpkDropdown Customtoggleclass="btn btn-sm btn-wave waves-effect waves-light no-caret" Togglevariant="primary" Arrowicon={true} Toggletext="Sort By">
                                            <li className="dropdown-item">New Collection</li>
                                            <li className="dropdown-item">High - Low</li>
                                            <li className="dropdown-item">Low - High</li>
                                        </SpkDropdown>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* <!--End::row-1 --> */}

                {/* <!-- Start:: row-2 --> */}

                <Row>
                    <Col xl={12}>
                        <Tab.Content>
                            <Tab.Pane eventKey={"all"} className="p-0 border-0" id="nft-all" role="tabpanel">
                                <div className="row">
                                    {MartketPlaceItems.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                    <nav aria-label="Page navigation">
                                        <Pagination className="justify-content-end mb-4">
                                            <Pagination.Prev disabled> Previous</Pagination.Prev>
                                            <Pagination.Item active>1</Pagination.Item>
                                            <Pagination.Item>2</Pagination.Item>
                                            <Pagination.Next>Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"art"} className="p-0 border-0" id="nft-art" role="tabpanel">
                                <Row>
                                    {MartketPlaceItems1.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"gaming"} className="p-0 border-0" id="nft-gaming" role="tabpanel">
                                <Row>
                                    {Market.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"domain"} className="p-0 border-0" id="nft-domain" role="tabpanel">
                                <Row>
                                    {MarketDomain.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"music"} className="p-0 border-0" id="nft-music" role="tabpanel">
                                <Row>
                                    {MarketMusic.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"realestate"} className="p-0 border-0" id="nft-realestate" role="tabpanel">
                                <Row>
                                    {MarketReal.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"sports"} className="p-0 border-0" id="nft-sports" role="tabpanel">
                                <Row>
                                    {MarketSports.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"fashion"} className="p-0 border-0" id="nft-fashion" role="tabpanel">
                                <Row>
                                    {MarketFashion.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"avatars"} className="p-0 border-0" id="nft-avatars" role="tabpanel">
                                <Row>
                                    {MarketAvatars.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"memes"} className="p-0 border-0" id="nft-memes" role="tabpanel">
                                <Row>
                                    {MarketMemes.map((card) => (
                                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="col-12" key={card.id}>
                                            <SpkNftCard nft={card} />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>

                {/* <!-- End:: row-2 --> */}

            </Tab.Container>
        </Fragment>
    )
};

export default MarketPlace;