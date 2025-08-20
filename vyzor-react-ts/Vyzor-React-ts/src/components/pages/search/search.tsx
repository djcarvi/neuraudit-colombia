
import { Link } from "react-router-dom";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkSearchCard from "../../../shared/@spk-reusable-components/reusable-pages/blog/spk-searchcard";
import { SearchGallerylist } from "../../../shared/data/pages/search-gallerydata";
import { Books, News, VideoData } from "../../../shared/data/pages/searchdata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Image, Nav, Pagination, Row, Tab } from "react-bootstrap";
import comppanyLogo1 from '../../../assets/images/company-logos/1.png';
import comppanyLogo2 from '../../../assets/images/company-logos/2.png';
import comppanyLogo3 from '../../../assets/images/company-logos/3.png';
import comppanyLogo4 from '../../../assets/images/company-logos/4.png';
import comppanyLogo5 from '../../../assets/images/company-logos/5.png';
import comppanyLogo6 from '../../../assets/images/company-logos/6.png';
import media59 from '../../../assets/images/media/media-59.jpg';
import media60 from '../../../assets/images/media/media-60.jpg';
import media61 from '../../../assets/images/media/media-61.jpg';
interface SearchProps { }

const Search: React.FC<SearchProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Search" />

            <Pageheader title="Pages" currentpage="Search" activepage="Search" />

            {/* <!-- Page Header Close --> */}

            <Tab.Container defaultActiveKey={"all"}>

                {/* <!-- Start::row-1 --> */}

                <Row>
                    <Col xl={7}>
                        <div className="input-group p-3">
                            <Form.Control type="text" className="form-control-lg rounded-pill search-results-input" placeholder="Search Here ..."
                                aria-label="Search Here ..." aria-describedby="button-addon1" defaultValue="Best Web Development Frameworks 2025" />
                            <div className="other-search-types">
                                <Link to="#!"><i className="bx bx-microphone"></i></Link>
                                <Link to="#!"><i className="bx bx-image"></i></Link>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 px-3 pb-0 border-bottom">
                            <Nav className="nav-tabs tab-style-8 scaleX" role="tablist">
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"all"} className="fw-medium text-muted" href="#search-all" aria-selected="true">All</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"images"} className="fw-medium text-muted" href="#search-images" aria-selected="false" tabIndex={-1}>Images</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"books"} className="fw-medium text-muted" href="#search-books" aria-selected="false" tabIndex={-1}>Books</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"news"} className="fw-medium text-muted" href="#search-news" aria-selected="false" tabIndex={-1}>News</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="" role="presentation">
                                    <Nav.Link eventKey={"videos"} className="fw-medium text-muted" href="#search-videos" aria-selected="false" tabIndex={-1}>Videos</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div className="text-muted p-2">About 12,400,000 results (0.68 seconds)</div>
                        </div>
                    </Col>
                </Row>

                {/* <!--End::row-1 --> */}

                {/* <!-- Start:: row-2 --> */}

                <Row className="mt-4">
                    <Col xl={12}>
                        <Tab.Content className="p-3">
                            <Tab.Pane eventKey={"all"} className="p-0 border-0" id="search-all" role="tabpanel">
                                <Row>
                                    <Col xl={7}>
                                        <ul className="list-unstyled search-results-list">
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <div className="position-relative">
                                                            <Link to="#!" className="stretched-link"></Link>
                                                            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-md avatar-rounded bg-light border">
                                                                        <Image  src={comppanyLogo1} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="d-block fw-medium lh-1"><Link to="#!">Developer.com</Link></span>
                                                                    <span className="fs-12 text-muted"> www.developer.com/top-10-web-frameworks</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6 className="fw-medium mb-1"><Link to="#!" className="searched-item-main-link">Top 10 Web Development Frameworks to Use in 2025</Link></h6>
                                                            <span className="d-block text-muted">January 4, 2025 - Web development frameworks are evolving, and 2025 brings exciting new trends in the tech industry. Learn which frameworks are shaping the future of front-end and back-end development.</span>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Open</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Save</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Share</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <div className="position-relative">
                                                            <Link to="#!" className="stretched-link"></Link>
                                                            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-md avatar-rounded bg-light border">
                                                                        <Image src={comppanyLogo5} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="d-block fw-medium lh-1"><Link to="#!">WebDevHub</Link></span>
                                                                    <span className="fs-12 text-muted">www.webdevhub.com/react-best-framework</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6 className="fw-medium mb-1"><Link to="#!" className="searched-item-main-link">Why React is Still the Best Framework for Web Development in 2025</Link></h6>
                                                            <span className="d-block text-muted">February 8, 2025 - React remains a dominant force in the world of JavaScript frameworks. Find out what makes React so powerful and how it simplifies the development process for developers in 2025.</span>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Open</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Save</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Share</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <h6 className=""><Link to="#!" className="fw-medium">Search Related Images :</Link></h6>
                                                        <div className="d-flex align-items-start gap-3 flex-wrap">
                                                            <div>
                                                                <figure className="figure mb-0">
                                                                    <Link className="avatar avatar-search" to="#!">
                                                                        <Image  className="img-fluid rounded card-img" src={media59} alt="..." />
                                                                    </Link>
                                                                    <Link to="#!" className="d-block">
                                                                        Natural Serenity
                                                                    </Link>
                                                                </figure>
                                                            </div>
                                                            <div>
                                                                <figure className="figure mb-0">
                                                                    <Link className="avatar avatar-search" to="#!">
                                                                        <Image  className="img-fluid rounded card-img" src={media60} alt="..." />
                                                                    </Link>
                                                                    <Link to="#!" className="d-block">
                                                                        Active Living
                                                                    </Link>
                                                                </figure>
                                                            </div>
                                                            <div>
                                                                <figure className="figure mb-0">
                                                                    <Link className="avatar avatar-search" to="#!">
                                                                        <Image  className="img-fluid rounded card-img" src={media61} alt="..." />
                                                                    </Link>
                                                                    <Link to="#!" className="d-block">
                                                                        Creative Elegance
                                                                    </Link>
                                                                </figure>
                                                            </div>
                                                            <div>
                                                                <figure className="figure mb-0">
                                                                    <Link to="#!" className="avatar px-4 avatar-search fw-medium bg-primary-transparent">
                                                                        View All <i className="ti ti-arrow-narrow-right ms-2"></i>
                                                                    </Link>
                                                                </figure>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Week</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Day</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Year</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <div className="position-relative">
                                                            <Link to="#!" className="stretched-link"></Link>
                                                            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-md avatar-rounded bg-light border">
                                                                        <Image  src={comppanyLogo6} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="d-block fw-medium lh-1"><Link to="#!">CodeAcademy</Link></span>
                                                                    <span className="fs-12 text-muted">www.codeacademy.com/vuejs-2025</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6 className="fw-medium mb-1"><Link to="#!" className="searched-item-main-link">Vue.js: The Framework You Should Learn in 2025</Link></h6>
                                                            <span className="d-block text-muted">January 18, 2025 - Vue.js has become a favorite for developers looking for an easy-to-learn and flexible framework for building modern web applications. Get a head start by diving into Vue.js in 2025.</span>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Open</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Save</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Share</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <div className="position-relative">
                                                            <Link to="#!" className="stretched-link"></Link>
                                                            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-md avatar-rounded bg-light border">
                                                                        <Image  src={comppanyLogo2} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="d-block fw-medium lh-1"><Link to="#!">DeveloperFuture</Link></span>
                                                                    <span className="fs-12 text-muted">www.developerfuture.com</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6 className="fw-medium mb-1"><Link to="#!" className="searched-item-main-link">What’s Next for 2025?</Link></h6>
                                                            <span className="d-block text-muted">In the world of web development, frameworks evolve quickly. Let’s look ahead at what new frameworks will emerge and how existing ones will adapt in 2025.</span>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Open</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Save</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Share</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <div className="position-relative">
                                                            <Link to="#!" className="stretched-link"></Link>
                                                            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-md avatar-rounded bg-light border">
                                                                        <Image  src={comppanyLogo4} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="d-block fw-medium lh-1"><Link to="#!">DevStack</Link></span>
                                                                    <span className="fs-12 text-muted">www.devstack.com/fullstack-frameworks-2025</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6 className="fw-medium mb-1"><Link to="#!" className="searched-item-main-link">Best Full-Stack Development Frameworks for 2025</Link></h6>
                                                            <span className="d-block text-muted">February 20, 2025 - From MERN to MEAN, full-stack frameworks enable developers to create dynamic web applications. Here are the top full-stack frameworks for 2025.</span>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Open</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Save</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Share</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-start justify-content-between flex-wrap flex-sm-nowrap">
                                                    <div>
                                                        <div className="position-relative">
                                                            <Link to="#!" className="stretched-link"></Link>
                                                            <div className="d-flex align-items-center gap-2 mb-2 position-relative">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-md avatar-rounded bg-light border">
                                                                        <Image  src={comppanyLogo3} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="d-block fw-medium lh-1"><Link to="#!">WebDevDebate</Link></span>
                                                                    <span className="fs-12 text-muted">www.webdevdebate.com</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6 className="fw-medium mb-1"><Link to="#!" className="searched-item-main-link">Which is Better for Web Development in 2025?</Link></h6>
                                                            <span className="d-block text-muted">In this article, we compare two of the biggest web development frameworks: Angular and React. Each has its strengths and weaknesses, but which one will come out on top in 2025?</span>
                                                        </div>
                                                    </div>
                                                    <SpkDropdown Id="dropdownMenuButton1" Icon={true} IconClass="ri-more-2-fill fs-5 text-muted" Customclass="ms-auto" Togglevariant="" Menulabel="dropdownMenuButton1" Toggletext="" Customtoggleclass="no-caret border-0 btn-icon">
                                                        <Dropdown.Item as="li" href="#!">Open</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Save</Dropdown.Item>
                                                        <Dropdown.Item as="li" href="#!">Share</Dropdown.Item>
                                                    </SpkDropdown>
                                                </div>
                                            </li>
                                            <li>
                                                <h5 className="fw-medium mb-3"><span className="fw-normal">Related Searches for</span> Best Web Development Frameworks 2025</h5>
                                                <div className="row gy-3">
                                                    <Col xl={6}>
                                                        <div className="rounded-pill related-search-container">
                                                            <Link to="#!">Top web development frameworks in 2025</Link>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="rounded-pill related-search-container">
                                                            <Link to="#!">Best JavaScript frameworks for developers</Link>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="rounded-pill related-search-container">
                                                            <Link to="#!">React vs Angular vs Vue comparison 2025</Link>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="rounded-pill related-search-container">
                                                            <Link to="#!">Future of web development frameworks</Link>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="rounded-pill related-search-container">
                                                            <Link to="#!">How to choose the right framework for your project</Link>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="rounded-pill related-search-container">
                                                            <Link to="#!">Svelte vs React performance comparison 2025</Link>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </li>
                                        </ul>
                                        <nav aria-label="Page navigation" className="pagination-style-2 mt-5 d-flex justify-content-center">
                                            <Pagination className="mb-0 flex-wrap">
                                                <Pagination.Prev disabled>Prev</Pagination.Prev>
                                                <Pagination.Item active>{1}</Pagination.Item>
                                                <Pagination.Item>{2}</Pagination.Item>
                                                <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                                <Pagination.Item>{17}</Pagination.Item>
                                                <Pagination.Next className="text-primary">Next</Pagination.Next>
                                            </Pagination>
                                        </nav>
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"images"} className="border-0 p-0" id="search-images" role="tabpanel">
                            <SearchGallerylist/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"books"} className="border-0 p-0" id="search-books" role="tabpanel">
                                <div className="row">
                                    {Books.map((idx, index) => (
                                        <Col xl={6} key={index}>
                                            <SpkSearchCard search={idx} />
                                        </Col>
                                    ))}
                                    <Col xl={12}>
                                        <SpkButton Buttonvariant="" Customclass="btn btn-info-light btn-loader mx-auto">
                                            <span className="me-2">Loading</span>
                                            <span className="loading"><i className="ri-loader-4-line fs-16"></i></span>
                                        </SpkButton>
                                    </Col>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"news"} className="border-0 p-0" id="search-news" role="tabpanel">
                                <Row>
                                    <Col xl={7}>
                                        <Card className="custom-card">
                                            <Card.Body className="p-0">
                                                <ul className="list-group list-group-flush">
                                                    {News.map((post, index) => (
                                                        <li className="list-group-item" key={index}>
                                                            <Link to={post.href} className="stretched-link" />
                                                            <div className="mb-1">
                                                                <span className="h6 fw-semibold text-primary">{post.title}</span>
                                                            </div>
                                                            <span className="text-muted">{post.description}</span>
                                                            <span className="d-block mt-2">{post.dateTime}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                        <nav aria-label="Page navigation" className="pagination-style-2 mt-5">
                                        <Pagination className="pagination-style-2 mt-5 justify-content-center flex-wrap mb-0">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item active>{1}</Pagination.Item>
                                            <Pagination.Item>{2}</Pagination.Item>
                                            <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                            <Pagination.Item>{17}</Pagination.Item>
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                        </nav>
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"videos"} className="border-0 p-0" id="search-videos" role="tabpanel">
                                <Row className="gy-4">
                                    {VideoData.map((video, index) => (
                                        <Col xl={3} lg={6} md={6} sm={6} key={index} className="col-12">
                                            <div className="ratio ratio-16x9">
                                                <iframe src={video.videoUrl} title={`YouTube video player ${index}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                            </div>
                                            <div className="p-2">
                                                <div className="d-flex align-items-center gap-1">
                                                    <div className="figure-caption fs-13 fw-medium text-default text-truncate">
                                                        {video.title}
                                                    </div>
                                                </div>
                                                <Link to={video.linkUrl} target="_blank" rel="noreferrer" className="fs-12 link-primary text-decoration-underline">
                                                    {video.linkText}
                                                </Link>
                                            </div>
                                        </Col>
                                    ))}
                                    <Col xl={12} className="my-4">
                                        <SpkButton Customclass="btn btn-info-light btn-loader mx-auto">
                                            <span className="me-2">Loading</span>
                                            <span className="loading"><i className="ri-loader-4-line fs-16"></i></span>
                                        </SpkButton>
                                    </Col>
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

export default Search;