
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Image, ListGroup, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { ListItems, MediaCards, PodcastCategeries, Podcasters, PodcastTable, RecentlyMedia } from "../../../shared/data/dashboards/podcastdata";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import BG6 from '../../../assets/images/media/backgrounds/6.png';
import media70 from '../../../assets/images/media/media-70.png';
import media78 from '../../../assets/images/media/media-78.jpg';

interface PodcastProps { }

const Podcast: React.FC<PodcastProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Podcast" />

            <Pageheader title="Dashboards" currentpage="Podcast" activepage="Podcast" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        <Col xxl={8}>
                            <Row>
                                <Col xl={12}>
                                    <Card className="custom-card podcast-banner-card border-0 shadow-none">
                                        <Card.Body>
                                            <div className="podcast-banner-card-background grid-cards">
                                                <Image  src={BG6} alt="" />
                                            </div>
                                            <Row>
                                                <Col xl={8}>
                                                    <span className="badge bg-primary rounded-pill">Featured Track</span>
                                                    <h2 className="fw-semibold mt-2">Echoes of Tomorrow</h2>
                                                    <p className="fs-16 mb-3">
                                                        Tune in to 'Echoes of Tomorrow'—exclusive insights and an <br /> artist interview, only on our podcast.
                                                    </p>
                                                    <div className="fw-medium text-primary mb-4"><i className="ti ti-music mx-1"></i>30 + Eps <span className="ms-2 text-default fs-12 op-8"><i className="ri-play-circle-line fs-13 mx-1"></i>260.517/ Monthly Listenders</span>  </div>
                                                    <div className="btn-list">
                                                        <SpkButton Buttonvariant="" Customclass="btn btn-lg btn-primary btn-w-lg me-2">
                                                            Listen Now
                                                        </SpkButton>
                                                        <SpkButton Buttonvariant="" Customclass="btn btn-lg btn-primary-ghost btn-w-lg">
                                                            Try Premium
                                                        </SpkButton>
                                                    </div>
                                                </Col>
                                                <Col xl={4}>
                                                    <Image  src={media70} alt="" className="podcast-banner-img img-fluid d-md-block d-none" />
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={12}>
                                    <div className="mb-4 d-flex align-items-center justify-content-between">
                                        <h6 className="fw-medium mb-0">Categories :</h6>
                                        <span className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
                                        {PodcastCategeries.map((tag) => (
                                            <div key={tag.id} className={`nft-tag ${tag.className}`}>
                                                <Link to="#!" className="stretched-link"></Link>
                                                <span className="nft-tag-icon">
                                                    <i className={`${tag.icon} fs-16`}></i>
                                                </span>
                                                <span className="nft-tag-text podcast-category-text">{tag.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xxl={4}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Top Podcasters
                                    </div>
                                    <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1 align-middle"></i></Link>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled top-podcasters-list">
                                        {Podcasters.map((user, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-rounded">
                                                            <Image  src={user.avatar} alt={user.name} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-semibold">{user.name}</span>
                                                        <span className="fs-13 d-block text-muted">{user.title}</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <SpkBadge variant="" Customclass={`${user.badgeClass}`}>{user.category}</SpkBadge>
                                                        <span className="fs-13 d-block mt-1">{user.followers}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Row>
                                <div className="mb-4 d-flex align-items-center justify-content-between">
                                    <h6 className="fw-medium mb-0">Recommendations :</h6>
                                    <Link to="#!" className="fs-12 text-muted"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                </div>
                                {MediaCards.map((card) => (
                                    <Col xxl={4} xl={4} lg={6} md={6} sm={12} key={card.id} className="col-12">
                                        <Card className="custom-card">
                                            <Row className="g-0">
                                                <div className="col-3">
                                                    <Image  src={card.image} className="img-fluid rounded-start h-100 w-100" alt={card.title} />
                                                </div>
                                                <div className="col-9">
                                                    <Card.Body className="p-4">
                                                        <div className="d-flex align-items-center justify-content-between mt-1">
                                                            <div>
                                                                <Link to="#!">
                                                                    <h6 className="fw-medium mb-0">{card.title}</h6>
                                                                </Link>
                                                                <span className="text-muted fs-12">By {card.author}</span>
                                                            </div>
                                                            <div>
                                                                <SpkButton Buttonvariant="" Customclass="btn btn-primary-light btn-icon btn-wave">
                                                                    <i className="ri-play-fill"></i>
                                                                </SpkButton>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </div>
                                            </Row>
                                        </Card>
                                    </Col>
                                ))}
                                <div className="mb-4 d-flex align-items-center justify-content-between">
                                    <h6 className="fw-medium mb-0">Recently Played :</h6>
                                    <Link to="#!" className="fs-12 text-muted"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                </div>
                                <Col xl={12}>
                                    <Row className="row-cols-xxl-5">
                                        {RecentlyMedia.map((card) => (
                                            <div key={card.id} className="col">
                                                <Card className="custom-card">
                                                    <Link to="#!" className="card-anchor"></Link>
                                                    <Image src={card.image} className="card-img-top" alt={card.title} />
                                                    <Card.Body>
                                                        <h6 className="card-title fw-medium mb-0">{card.title}</h6>
                                                        <span className="fs-13 text-muted">By {card.author}</span>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <h6 className="fw-semibold mb-3">Now Playing</h6>
                            <Card className="custom-card">
                                <Card.Body className="p-4">
                                    <div className="text-center mb-4">
                                        <span className="avatar mb-3 podcast-playing-now-avatar shadow">
                                            <Image src={media78} alt="" />
                                        </span>
                                        <Link to="#!"><h6 className="fw-medium mb-1">Echoes of Tomorrow</h6></Link>
                                        <span className="fs-12">By Alice Mumbleton</span>
                                    </div>
                                    <Row className="justify-content-center">
                                        <Col xl={9}>
                                            <div className="d-flex gap-3 align-items-center mb-4">
                                                <div className="fs-12">12.25</div>
                                                <div className="progress progress-xs progress-custom progress-animate podcast-playing-progress bg-light" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                                                    <div className="progress-bar bg-success" style={{width: "50%"}}>
                                                    </div>
                                                </div>
                                                <div className="fs-12">23.45</div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 lh-1 p-3 bg-light rounded">
                                                <Link to="#!">
                                                    <i className="ri-repeat-2-fill fs-5  text-muted"></i>
                                                </Link>
                                                <Link to="#!">
                                                    <i className="ri-skip-back-fill fs-5  text-muted"></i>
                                                </Link>
                                                <Link to="#!" className="btn btn-primary btn-icon rounded-circle">
                                                    <i className="ri-play-fill"></i>
                                                </Link>
                                                <Link to="#!">
                                                    <i className="ri-skip-forward-fill fs-5  text-muted"></i>
                                                </Link>
                                                <Link to="#!">
                                                    <i className="ri-shuffle-fill fs-5  text-muted"></i>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header>
                                    <div className="card-title">
                                        Top Charts Today
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ListGroup className="list-group-flush">
                                        {ListItems.map((item) => (
                                            <ListGroup.Item key={item.id} className="">
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <div className="me-3">{item.id}</div>
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-md avatar-rounded">
                                                            <Image width={40} height={40} src={item.image} alt={item.title} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <span className="fw-semibold">{item.title}</span>
                                                        <span className="d-block text-muted fs-13">By {item.author}</span>
                                                    </div>
                                                    <div className="d-block fw-medium d-flex align-items-center gap-2 justify-content-end">
                                                        {item.likes} <i className="ti ti-heart-filled text-danger"></i>
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

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Podcast Analytics
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
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
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'Podcast Name' }, { title: 'Genre' }, { title: 'Episodes' }, { title: 'Total Listeners' }, { title: 'Avg. Play Time' }, { title: 'Likes' }, { title: 'Comments' }, { title: 'Shares' }, { title: 'Rating' }, { title: 'Status' }]}>
                                    {PodcastTable.map((item) => (
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
                                                        <span className="text-muted fs-13">By {item.author}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.category}</td>
                                            <td>{item.episodes}</td>
                                            <td>{item.views}</td>
                                            <td>{item.duration}</td>
                                            <td>{item.comments}</td>
                                            <td>{item.likes}</td>
                                            <td>{item.shares}</td>
                                            <td>
                                                <div className="d-inline-flex align-items-center">
                                                    {item.rating}
                                                    <i className="ti ti-star-filled ms-1 text-warning"></i>
                                                </div>
                                            </td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`badge ${item.status === 'Active' ? 'bg-success-transparent' : 'bg-danger-transparent'}`}>
                                                    {item.status}
                                                </SpkBadge>
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
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item>1</Pagination.Item>
                                            <Pagination.Item active>2</Pagination.Item>
                                            <Pagination.Item><i className='bi bi-three-dots'></i></Pagination.Item>
                                            <Pagination.Item>17</Pagination.Item>
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default Podcast;