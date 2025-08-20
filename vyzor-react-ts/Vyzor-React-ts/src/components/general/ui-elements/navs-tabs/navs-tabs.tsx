
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Image, Nav, NavDropdown, Row, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import jpg3 from '../../../../assets/images/ecommerce/jpg/3.jpg';
import jpg4 from '../../../../assets/images/ecommerce/jpg/4.jpg';
import jpg6 from '../../../../assets/images/ecommerce/jpg/6.jpg';
import face9 from '../../../../assets/images/faces/9.jpg';

interface NavsTabsProps { }

const NavsTabs: React.FC<NavsTabsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Ui Elements-Navs & Tabs" />

            <Pageheader title="Ui Elements" currentpage="Navs & Tabs" activepage="Navs & Tabs" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Static Tabs
                            </div>
                        </Card.Header>
                        <Card.Body className="">
                            <Nav className=" nav-tabs border-0 gap-sm-0 gap-1">
                                <Nav.Item>
                                    <Nav.Link eventKey="1" className="active" aria-current="page" href="#!">Active</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="2" className="" href="#!">Link</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="3" className="" href="#!">Link</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="4" className=" disabled">Disabled</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Static Pills
                            </div>
                        </Card.Header>
                        <Card.Body className="">
                            <Nav className="nav-pills gap-sm-0 gap-1" defaultActiveKey="4">
                                <Nav.Item>
                                    <Nav.Link eventKey="4" className="active" aria-current="page" >Active</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link className="nav-link"  to="#!">Link</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link className="nav-link"  to="#!">Link</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="7" className=" disabled">Disabled</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Default Nav Tabs
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="home">
                            <Card.Body className="">
                                <Nav className="nav-tabs mb-3 border-0" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="home" className="" data-bs-toggle="tab" role="tab" href="#home1"
                                            aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="about" className="" data-bs-toggle="tab" role="tab" href="#about1"
                                            aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="service" className="" data-bs-toggle="tab" role="tab" href="#service1"
                                            aria-selected="false">Services</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="license" className="" data-bs-toggle="tab" role="tab" href="#license1"
                                            aria-selected="false">License</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="home" className="text-muted" id="home1" role="tabpanel">
                                        <b>Lorem Ipsum is simply dummy</b> text of the printing and typesetting
                                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to make a
                                        type specimen book. It has survived not only five centuries.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="about" className=" text-muted" id="about1" role="tabpanel">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                                        in a piece of classical Latin literature from 45 BC, <b>Making it over 2000
                                            years old</b>. Richard McClintock, a Latin professor at Hampden-Sydney
                                        College in Virginia, looked up one of the more obscure Latin words, consectetur.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="service" className=" text-muted" id="service1" role="tabpanel">
                                        There are many variations of passages of <b>Lorem Ipsum available</b>, but the
                                        majority have suffered alteration in some form, by injected humour, or
                                        randomised words which don't look even slightly believable. If you are going to
                                        use a passage of Lorem Ipsum, you need to be sure there isn't anything.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="license" className=" text-muted" id="license1" role="tabpanel">
                                        It is a long established fact that a reader will be distracted by the
                                        <b><i>Readable content</i></b> of a page when looking at its layout. The point
                                        of using Lorem Ipsum is that it has a more-or-less normal distribution of
                                        letters, as opposed to using 'Content here, content here', making it look like
                                        readable English.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Justified Nav Tabs
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="service1">
                            <Card.Body className="">
                                <Nav className=" nav-tabs mb-3 nav-justified nav-style-1 d-sm-flex d-block" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="home1" className="" data-bs-toggle="tab" role="tab" href="#home1-justified"
                                            aria-selected="false">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="about1" className="" data-bs-toggle="tab" role="tab" href="#about1-justified"
                                            aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="">
                                        <Nav.Link eventKey="service1" className="" data-bs-toggle="tab" role="tab"
                                            href="#service1-justified" aria-selected="true">Services</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="license1" className="" data-bs-toggle="tab" role="tab" href="#license1-justified"
                                            aria-selected="false">License</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="home1" className=" text-muted" id="home1-justified" role="tabpanel">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                                        in a piece of classical Latin literature from 45 BC, <b>Making it over 2000
                                            years old</b>. Richard McClintock, a Latin professor at Hampden-Sydney
                                        College in Virginia, looked up one of the more obscure Latin words, consectetur.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="about1" className=" text-muted" id="about1-justified" role="tabpanel">
                                        <b>Lorem Ipsum is simply dummy</b> text of the printing and typesetting
                                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to make a
                                        type specimen book. It has survived not only five centuries.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="service1" className="text-muted" id="service1-justified"
                                        role="tabpanel">
                                        There are many variations of passages of <b>Lorem Ipsum available</b>, but the
                                        majority have suffered alteration in some form, by injected humour, or
                                        randomised words which don't look even slightly believable. If you are going to
                                        use a passage of Lorem Ipsum, you need to be sure there isn't anything.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="license1" className=" text-muted" id="license1-justified" role="tabpanel">
                                        It is a long established fact that a reader will be distracted by the
                                        <b><i>Readable content</i></b> of a page when looking at its layout. The point
                                        of using Lorem Ipsum is that it has a more-or-less normal distribution of
                                        letters, as opposed to using 'Content here, content here', making it look like
                                        readable English.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Basic Pill Tabs With Links
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="cart">
                            <Card.Body className="">
                                <Nav className="nav nav-style-1 nav-pills mb-3" role="tablist">
                                    <Nav.Link eventKey="products" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                        href="#nav-products" aria-selected="false">Products</Nav.Link>
                                    <Nav.Link eventKey="cart" className="" data-bs-toggle="tab" role="tab" href="#nav-cart"
                                        aria-selected="true">Cart <SpkBadge variant="secondary"
                                            Customclass="ms-1 rounded-pill">32</SpkBadge></Nav.Link>
                                    <Nav.Link eventKey="orders" className="" data-bs-toggle="tab" role="tab" href="#nav-orders"
                                        aria-selected="false">Orders <SpkBadge variant="success"
                                            Customclass="ms-1 rounded-pill">4</SpkBadge></Nav.Link>
                                    <Nav.Link eventKey="offers" className="" data-bs-toggle="tab" role="tab" href="#nav-offers"
                                        aria-selected="false">Offers</Nav.Link>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="products" className=" text-muted" id="nav-products" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals. 11 ways cheapest flights can find you the
                                        love of your life. The complete beginner's guide to mission trips. If you read
                                        one article about cultural notes read this one. Why you shouldn't eat vacation
                                        package in bed.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="cart" className="text-muted" id="nav-cart" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises  </b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it. How
                                        not knowing family trip ideas makes you a rookie. What everyone is saying about
                                        daily deals. How twitter can teach you about carnival cruises. How to start
                                        using cultural solutions.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="orders" className=" text-muted" id="nav-orders" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick. The complete beginner's guide to cooking
                                        healthy food. Unbelievable food stamp success stories. How whole foods markets
                                        are making the world a better place. 16 things that won't happen in dish
                                        reviews.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="offers" className=" text-muted" id="nav-offers" role="tabpanel">
                                        Why delicious magazines are killing you. Why our world would end if restaurants
                                        disappeared. Why restaurants are on crack about restaurants. How restaurants are
                                        making the world a better place. 8 great articles about minute meals. Why our
                                        world would end if healthy snacks disappeared. Why the world would end without
                                        mexican food. The evolution of chef uniforms. How not knowing food processors
                                        makes you a rookie. Why whole foods markets beat peanut butter on pancakes.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Justified Pill Tabs With Links
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="cart1">
                            <Card.Body className="">
                                <Nav className="nav-style-6 nav-pills mb-3 nav-justified d-sm-flex d-block" role="tablist">
                                    <Nav.Link eventKey="products1" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                        href="#nav-products-justified" aria-selected="false">Products</Nav.Link>
                                    <Nav.Link eventKey="cart1" className="" data-bs-toggle="tab" role="tab"
                                        href="#nav-cart-justified" aria-selected="true">Cart <SpkBadge variant="info-transparent"
                                            Customclass="ms-1">Full</SpkBadge></Nav.Link>
                                    <Nav.Link eventKey="orders1" className="" data-bs-toggle="tab" role="tab" href="#nav-orders-justified"
                                        aria-selected="false">Orders </Nav.Link>
                                    <Nav.Link eventKey="offers1" className="" data-bs-toggle="tab" role="tab" href="#nav-offers-justified"
                                        aria-selected="false">Offers <SpkBadge variant="warning-transparent"
                                            Customclass="ms-1">7</SpkBadge></Nav.Link>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="products1" className=" text-muted" id="nav-products-justified" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it. How
                                        not knowing family trip ideas makes you a rookie. What everyone is saying about
                                        daily deals. How twitter can teach you about carnival cruises. How to start
                                        using cultural solutions.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="cart1" className="text-muted" id="nav-cart-justified"
                                        role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals. 11 ways cheapest flights can find you the
                                        love of your life. The complete beginner's guide to mission trips. If you read
                                        one article about cultural notes read this one. Why you shouldn't eat vacation
                                        package in bed.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="orders1" className=" text-muted" id="nav-orders-justified" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick. The complete beginner's guide to cooking
                                        healthy food. Unbelievable food stamp success stories. How whole foods markets
                                        are making the world a better place. 16 things that won't happen in dish
                                        reviews.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="offers1" className=" text-muted" id="nav-offers-justified" role="tabpanel">
                                        Why delicious magazines are killing you. Why our world would end if restaurants
                                        disappeared. Why restaurants are on crack about restaurants. How restaurants are
                                        making the world a better place. 8 great articles about minute meals. Why our
                                        world would end if healthy snacks disappeared. Why the world would end without
                                        mexican food. The evolution of chef uniforms. How not knowing food processors
                                        makes you a rookie. Why whole foods markets beat peanut butter on pancakes.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vertical alignment with lists
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="vertical1">
                            <Card.Body className="">
                                <Row>
                                    <Col xl={3}>
                                        <Nav className=" nav-tabs flex-column nav-style-4" role="tablist">
                                            <Nav.Item>
                                                <Nav.Link eventKey="vertical1" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#home-vertical"
                                                    aria-selected="true">Home</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="vertical2" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#about-vertical"
                                                    aria-selected="true">About</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="vertical3" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#services-vertical"
                                                    aria-selected="true">Services</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="vertical4" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#contacts-vertical"
                                                    aria-selected="true">Contacts</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col xl={9}>
                                        <Tab.Content className=" mt-2 mt-xl-0">
                                            <Tab.Pane eventKey="vertical1" className="text-muted" id="home-vertical"
                                                role="tabpanel">
                                                How hotel deals can help you live a better life. <b>How celebrity
                                                    cruises</b> aren't as bad as you think. How cultural solutions
                                                can help you predict the future. How to cheat at dog friendly hotels
                                                and get away with it. 17 problems with summer activities. How to
                                                cheat at travel agents and get away with it. How not knowing family
                                                trip ideas makes you a rookie. What everyone is saying about daily
                                                deals.
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="vertical2" className=" text-muted" id="about-vertical"
                                                role="tabpanel">
                                                How travel coupons make you a better lover. Why cultural solutions
                                                are the new black. Why mom was right about travel insurances. How
                                                family trip ideas can help you predict the future. <b>How carnival
                                                    cruises make you a better lover</b>. Why you'll never succeed at
                                                daily deals. 11 ways cheapest flights can find you the love of your
                                                life. The complete beginner's guide to mission trips.
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="vertical3" className=" text-muted" id="services-vertical"
                                                role="tabpanel">
                                                Unbelievable healthy snack success stories. 12 facts about safe food
                                                handling tips that will impress your friends. Restaurant weeks by
                                                the numbers. Will mexican food ever rule the world? The 10 best thai
                                                restaurant youtube videos. How restaurant weeks can make you sick.
                                                The complete beginner's guide to cooking healthy food. Unbelievable
                                                food stamp success stories.
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="vertical4" className=" text-muted" id="contacts-vertical"
                                                role="tabpanel">
                                                Why delicious magazines are killing you. Why our world would end if
                                                restaurants disappeared. Why restaurants are on crack about
                                                restaurants. How restaurants are making the world a better place. 8
                                                great articles about minute meals. Why our world would end if
                                                healthy snacks disappeared. Why the world would end without mexican
                                                food. The evolution of chef uniforms.
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vertical alignment with links
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="tab3">
                            <Card.Body className="">
                                <Row>
                                    <div className="col-xl-3">
                                        <Nav className="nav-tabs flex-column nav-style-5" role="tablist">
                                            <Nav.Item>
                                                <Nav.Link eventKey="tab1" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#home-vertical-link" aria-selected="false"><i
                                                        className="ri-home-smile-line me-2 align-middle d-inline-block"></i>Home</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="tab2" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#about-vertical-link" aria-selected="false"><i
                                                        className="ri-archive-drawer-line me-2 align-middle d-inline-block"></i>About</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="tab3" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#services-vertical-link" aria-selected="true"><i
                                                        className="ri-bank-line me-2 align-middle d-inline-block"></i>Services</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="tab4" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#contacts-vertical-link" aria-selected="false"><i
                                                        className="ri-contacts-book-2-line me-2 align-middle d-inline-block"></i>Contacts</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <div className="col-xl-9">
                                        <Tab.Content className=" mt-2 mt-xl-0">
                                            <Tab.Pane eventKey="tab1" className=" text-muted" id="home-vertical-link"
                                                role="tabpanel">
                                                How hotel deals can help you live a better life. <b>How celebrity
                                                    cruises</b> aren't as bad as you think. How cultural solutions
                                                can help you predict the future. How to cheat at dog friendly hotels
                                                and get away with it. 17 problems with summer activities. How to
                                                cheat at travel agents and get away with it. How not knowing family
                                                trip ideas makes you a rookie. What everyone is saying about daily
                                                deals.
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="tab2" className=" text-muted" id="about-vertical-link"
                                                role="tabpanel">
                                                How travel coupons make you a better lover. Why cultural solutions
                                                are the new black. Why mom was right about travel insurances. How
                                                family trip ideas can help you predict the future. <b>How carnival
                                                    cruises make you a better lover</b>. Why you'll never succeed at
                                                daily deals. 11 ways cheapest flights can find you the love of your
                                                life. The complete beginner's guide to mission trips.
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="tab3" className="text-muted" id="services-vertical-link"
                                                role="tabpanel">
                                                Unbelievable healthy snack success stories. 12 facts about safe food
                                                handling tips that will impress your friends. Restaurant weeks by
                                                the numbers. <b><i>Will mexican food ever rule the world? The 10 best thai
                                                    restaurant youtube videos</i></b>. How restaurant weeks can make you sick.
                                                The complete beginner's guide to cooking healthy food. Unbelievable
                                                food stamp success stories.
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="tab4" className=" text-muted" id="contacts-vertical-link"
                                                role="tabpanel">
                                                Why delicious magazines are killing you. Why our world would end if
                                                restaurants disappeared. Why restaurants are on crack about
                                                restaurants. How restaurants are making the world a better place. 8
                                                great articles about minute meals. Why our world would end if
                                                healthy snacks disappeared. Why the world would end without mexican
                                                food. The evolution of chef uniforms.
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Center Aligned Nav
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="tabs1">
                            <Card.Body className="">
                                <Nav className=" nav-pills justify-content-center nav-style-2 mb-3" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="tabs1" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#home-center" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="tabs2" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#about-center" aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="tabs3" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#services-center" aria-selected="false">Services</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="tabs4" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#contacts-center" aria-selected="false">Contacts</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="tabs1" className="text-muted" id="home-center" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals. 11 ways cheapest flights can find you the
                                        love of your life. The complete beginner's guide to mission trips. If you read
                                        one article about cultural notes read this one. Why you shouldn't eat vacation
                                        package in bed.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="tabs2" className=" text-muted" id="about-center" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it. How
                                        not knowing family trip ideas makes you a rookie. What everyone is saying about
                                        daily deals. How twitter can teach you about carnival cruises. How to start
                                        using cultural solutions.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="tabs3" className=" text-muted" id="services-center" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick. The complete beginner's guide to cooking
                                        healthy food. Unbelievable food stamp success stories. How whole foods markets
                                        are making the world a better place. 16 things that won't happen in dish
                                        reviews.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="tabs4" className=" text-muted" id="contacts-center" role="tabpanel">
                                        Why delicious magazines are killing you. Why our world would end if restaurants
                                        disappeared. Why restaurants are on crack about restaurants. How restaurants are
                                        making the world a better place. 8 great articles about minute meals. Why our
                                        world would end if healthy snacks disappeared. Why the world would end without
                                        mexican food. The evolution of chef uniforms. How not knowing food processors
                                        makes you a rookie. Why whole foods markets beat peanut butter on pancakes.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Right Aligned Nav
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="right1">
                            <Card.Body className="">
                                <Nav className=" nav-pills justify-content-end nav-style-3 mb-3" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="right1" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#home-right" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="right2" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#about-right" aria-selected="true">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="right3" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#services-right" aria-selected="true">Services</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="right4" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#contacts-right" aria-selected="true">Contacts</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="right1" className=" text-muted" id="home-right" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals. 11 ways cheapest flights can find you the
                                        love of your life. The complete beginner's guide to mission trips. If you read
                                        one article about cultural notes read this one. Why you shouldn't eat vacation
                                        package in bed.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="right2" className=" text-muted" id="about-right" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it. How
                                        not knowing family trip ideas makes you a rookie. What everyone is saying about
                                        daily deals. How twitter can teach you about carnival cruises. How to start
                                        using cultural solutions.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="right3" className=" text-muted" id="services-right" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick. The complete beginner's guide to cooking
                                        healthy food. Unbelievable food stamp success stories. How whole foods markets
                                        are making the world a better place. 16 things that won't happen in dish
                                        reviews.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="right4" className=" text-muted" id="contacts-right" role="tabpanel">
                                        Why delicious magazines are killing you. Why our world would end if restaurants
                                        disappeared. Why restaurants are on crack about restaurants. How restaurants are
                                        making the world a better place. 8 great articles about minute meals. Why our
                                        world would end if healthy snacks disappeared. Why the world would end without
                                        mexican food. The evolution of chef uniforms. How not knowing food processors
                                        makes you a rookie. Why whole foods markets beat peanut butter on pancakes.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <Col xl={12}>
                    <Tab.Container defaultActiveKey="header1">
                        <Card className="custom-card">
                            <div className="card-header justify-content-between">
                                <div className="card-title">
                                    Header Tabs
                                </div>
                                <div>
                                    <Nav className=" nav-tabs justify-content-end nav-tabs-header mb-0" role="tablist">
                                        <Nav.Item>
                                            <Nav.Link eventKey="header1" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                                href="#home-header" aria-selected="true">Home</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="header2" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                                href="#about-header" aria-selected="true">About</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="header3" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                                href="#services-header" aria-selected="true">Services</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                            </div>
                            <Card.Body className="">
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="header1" className="text-muted" id="home-header"
                                        role="tabpanel">
                                        <ul className="mb-0">
                                            <li className="mb-2">
                                                How hotel deals can help you live a better life. <b>How celebrity
                                                    cruises</b> aren't as bad as you think. How cultural solutions
                                                can help you predict the future. How to cheat at dog friendly hotels
                                                and get away with it. 17 problems with summer activities. How to
                                                cheat at travel agents and get away with it. How not knowing family
                                                trip ideas makes you a rookie. What everyone is saying about daily
                                                deals.
                                            </li>
                                            <li>
                                                How travel coupons make you a better lover. Why cultural solutions
                                                are the new black. Why mom was header about travel insurances. How
                                                family trip ideas can help you predict the future. <b>How carnival
                                                    cruises make you a better lover</b>. Why you'll never succeed at
                                                daily deals. 11 ways cheapest flights can find you the love of your
                                                life. The complete beginner's guide to mission trips.
                                            </li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="header2" className=" text-muted" id="about-header"
                                        role="tabpanel">
                                        <ul className="mb-0">
                                            <li className="mb-2">
                                                How travel coupons make you a better lover. Why cultural solutions
                                                are the new black. Why mom was header about travel insurances. How
                                                family trip ideas can help you predict the future. <b>How carnival
                                                    cruises make you a better lover</b>. Why you'll never succeed at
                                                daily deals. 11 ways cheapest flights can find you the love of your
                                                life. The complete beginner's guide to mission trips.
                                            </li>
                                            <li>
                                                How hotel deals can help you live a better life. <b>How celebrity
                                                    cruises</b> aren't as bad as you think. How cultural solutions
                                                can help you predict the future. How to cheat at dog friendly hotels
                                                and get away with it. 17 problems with summer activities. How to
                                                cheat at travel agents and get away with it. How not knowing family
                                                trip ideas makes you a rookie. What everyone is saying about daily
                                                deals.
                                            </li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="header3" className=" text-muted" id="services-header"
                                        role="tabpanel">
                                        <ul className="mb-0">
                                            <li className="mb-2">
                                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.
                                            </li>
                                            <li>
                                                How travel coupons make you a better lover. Why cultural solutions
                                                are the new black. Why mom was header about travel insurances. How
                                                family trip ideas can help you predict the future. <b>How carnival
                                                    cruises make you a better lover</b>. Why you'll never succeed at
                                                daily deals. 11 ways cheapest flights can find you the love of your
                                                life. The complete beginner's guide to mission trips.
                                            </li>
                                        </ul>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Footer Tabs
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="footer1">
                            <Card.Body className="">
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="footer1" className="text-muted" id="home-footer" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals. 11 ways cheapest flights can find you the
                                        love of your life. The complete beginner's guide to mission trips. If you read
                                        one article about cultural notes read this one. Why you shouldn't eat vacation
                                        package in bed.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="footer2" className=" text-muted" id="about-footer" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it. How
                                        not knowing family trip ideas makes you a rookie. What everyone is saying about
                                        daily deals. How twitter can teach you about carnival cruises. How to start
                                        using cultural solutions.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="footer3" className=" text-muted" id="services-footer" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick. The complete beginner's guide to cooking
                                        healthy food. Unbelievable food stamp success stories. How whole foods markets
                                        are making the world a better place. 16 things that won't happen in dish
                                        reviews.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                            <div className="card-footer">
                                <Nav className=" nav-tabs justify-content-end nav-tabs-footer mb-0" role="tablist">
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey="footer1" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#home-footer" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey="footer2" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#about-footer" aria-selected="true">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey="footer3" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#services-footer" aria-selected="true">Services</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

            {/* <!-- Start:: row-7 --> */}

            <Row>
                <Col xxl={12} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab Style-1
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="orders1">
                            <Card.Body className="">
                                <Nav className=" nav-tabs tab-style-1 d-sm-flex d-block" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="orders1" className="" data-bs-toggle="tab" data-bs-target="#orders"
                                            aria-current="page" href="#orders">Orders</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="orders2" className="" data-bs-toggle="tab" data-bs-target="#accepted"
                                            href="#accepted">Accepted</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="orders3" className="" data-bs-toggle="tab" data-bs-target="#declined"
                                            href="#declined">Declined</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="orders1" className="" id="orders" role="tabpanel">
                                        <div className="text-muted"><b>Lorem Ipsum is simply dummy text of the
                                            printing</b> and typesetting industry. Lorem Ipsum has been the
                                            industry's standard dummy text ever since the 1500s, when an unknown
                                            printer took a galley of type and scrambled.</div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="orders2" className="" id="accepted" role="tabpanel">
                                        <div className="text-muted">Many desktop publishing packages and web page
                                            editors now use Lorem Ipsum as their default model text, and a search
                                            for <b>'lorem ipsum'</b> will uncover many web sites still in their
                                            infancy. Various versions have evolved over the years.</div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="orders3" className="" id="declined" role="tabpanel">
                                        <div className="text-muted">There are many variations of passages of Lorem
                                            Ipsum available, but the majority have suffered alteration in some form,
                                            <b>by injected humour</b>, or randomised words which don't look even
                                            slightly believable
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xxl={12} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab Style-2
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="ordertab2">
                            <Card.Body className="">
                                <Nav className=" nav-tabs tab-style-2 nav-justified mb-3 d-sm-flex d-block" id="myTab1" role="tablist">
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="ordertab1" className="" id="order-tab" data-bs-toggle="tab"
                                            data-bs-target="#order-tab-pane" type="button" role="tab"
                                            aria-controls="home-tab-pane" aria-selected="true"><i
                                                className="ri-gift-line me-1 align-middle"></i>Ordered</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="ordertab2" className="" id="confirmed-tab" data-bs-toggle="tab"
                                            data-bs-target="#confirm-tab-pane" type="button" role="tab"
                                            aria-controls="profile-tab-pane" aria-selected="false"><i
                                                className="ri-check-double-line me-1 align-middle"></i>Confirmed</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="ordertab3" className="" id="shipped-tab" data-bs-toggle="tab"
                                            data-bs-target="#shipped-tab-pane" type="button" role="tab"
                                            aria-controls="contact-tab-pane" aria-selected="false"><i
                                                className="ri-shopping-bag-3-line me-1 align-middle"></i>Shipped</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="ordertab4" className="" id="delivered-tab" data-bs-toggle="tab"
                                            data-bs-target="#delivered-tab-pane" type="button" role="tab" aria-selected="false"><i
                                                className="ri-truck-line me-1 align-middle"></i>Delivery</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="" id="myTabContent">
                                    <Tab.Pane eventKey="ordertab1" className=" fade text-muted" id="order-tab-pane" role="tabpanel"
                                        aria-labelledby="home-tab" tabIndex={0}>
                                        <ul className="ps-3 mb-0">
                                            <li>Contrary to popular belief, Lorem Ipsum is not simply random text. It
                                                has roots in a piece of classical Latin literature from 45 BC, making it
                                                over 2000 years old. Richard McClintock.</li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ordertab2" className=" fade text-muted" id="confirm-tab-pane"
                                        role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>
                                        <ul className="ps-3 mb-0">
                                            <li>As opposed to using 'Content here, content here', making it look like
                                                readable English. Many desktop publishing packages and web page editors
                                                now use Lorem Ipsum as their default model text, and a search.</li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ordertab3" className=" fade text-muted" id="shipped-tab-pane" role="tabpanel"
                                        aria-labelledby="contact-tab" tabIndex={0}>
                                        <ul className="ps-3 mb-0">
                                            <li>but also the leap into electronic typesetting, remaining essentially
                                                unchanged. It was popularised in the 1960s with the release of Letraset
                                                sheets containing Lorem Ipsum passages, and more recently.</li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ordertab4" className=" fade text-muted" id="delivered-tab-pane" role="tabpanel" tabIndex={0}>
                                        <ul className="list-unstyled mb-0">
                                            <li>A Latin professor at Hampden-Sydney College in Virginia, looked up one
                                                of the more obscure Latin words, consectetur, from a Lorem Ipsum
                                                passage, and going through the cites of the word in classical
                                                literature.</li>
                                        </ul>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xxl={12} xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab-Style-3
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="hometab">
                            <Card.Body className="px-0">
                                <Nav className=" nav-tabs justify-content-center mb-5 tab-style-3" id="myTab2"
                                    role="tablist">
                                    <Nav.Item className=" me-0" role="presentation">
                                        <Nav.Link eventKey="hometab" className=" home py-1" id="home-tab" data-bs-toggle="tab"
                                            data-bs-target="#home-tab-pane" type="button" role="tab"
                                            aria-controls="home-tab-pane" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className=" me-0" role="presentation">
                                        <Nav.Link eventKey="profiletab" className=" about py-1" id="profile-tab" data-bs-toggle="tab"
                                            data-bs-target="#profile-tab-pane" type="button" role="tab"
                                            aria-controls="profile-tab-pane" aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className=" me-0" role="presentation">
                                        <Nav.Link eventKey="contacttab" className=" services py-1" id="contact-tab" data-bs-toggle="tab"
                                            data-bs-target="#contact-tab-pane" type="button" role="tab"
                                            aria-controls="contact-tab-pane" aria-selected="false">Services</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="px-3" id="myTabContent1">
                                    <Tab.Pane eventKey="hometab" className=" fade text-muted" id="home-tab-pane"
                                        role="tabpanel" aria-labelledby="home-tab" tabIndex={0}><b>Lorem Ipsum is
                                            simply dummy text of the printing</b> and typesetting industry. Lorem
                                        Ipsum has been the industry's.</Tab.Pane>
                                    <Tab.Pane eventKey="profiletab" className=" fade text-muted" id="profile-tab-pane"
                                        role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>Many desktop
                                        publishing packages as their default model text, and a search for <b>'lorem ipsum'</b> will over the
                                        years.</Tab.Pane>
                                    <Tab.Pane eventKey="contacttab" className=" fade text-muted" id="contact-tab-pane"
                                        role="tabpanel" aria-labelledby="contact-tab" tabIndex={0}>There, <b>by injected humour</b>, or randomised
                                        words which don't look even slightly believable.</Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-7 --> */}

            {/* <!-- Start:: row-8 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab Style-4
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="hometab1">
                            <Card.Body className=" px-1">
                                <nav>
                                    <Nav className="nav-tabs nav-justified tab-style-4 d-flex" id="nav-tab" role="tablist">
                                        <Nav.Link eventKey="hometab1" className="" id="nav-home-tab" data-bs-toggle="tab"
                                            data-bs-target="#nav-home1" type="button" role="tab" aria-selected="true">Home</Nav.Link>
                                        <Nav.Link eventKey="profiletab1" className="" id="nav-profile-tab" data-bs-toggle="tab"
                                            data-bs-target="#nav-profile1" type="button" role="tab" aria-selected="false">Profile</Nav.Link>
                                        <Nav.Link eventKey="contacttab1" className="" id="nav-contact-tab" data-bs-toggle="tab"
                                            data-bs-target="#nav-contact1" type="button" role="tab" aria-selected="false">About</Nav.Link>
                                    </Nav>
                                </nav>
                                <Tab.Content className="px-3" id="tab-style-4">
                                    <Tab.Pane eventKey="hometab1" className="" id="nav-home1" role="tabpanel"
                                        aria-labelledby="nav-home-tab" tabIndex={0}>
                                        <b>Lorem Ipsum is simply dummy</b> text of the printing and typesetting
                                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to make a
                                        type specimen book. It has survived not only five centuries, but also the leap
                                        into electronic typesetting, remaining essentially unchanged. It was popularised
                                        in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                        passages, and more recently with desktop publishing software like Aldus
                                        PageMaker including versions of Lorem Ipsum.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="profiletab1" className="" id="nav-profile1" role="tabpanel"
                                        aria-labelledby="nav-profile-tab" tabIndex={0}>
                                        It is a long established fact that a reader will be distracted by the readable
                                        content of a page when looking at its layout. The point of using Lorem Ipsum is
                                        that it has a more-or-less normal distribution of letters, as opposed to using
                                        'Content here, content here', making it look like readable English. <b>Many
                                            desktop publishing</b> packages and web page editors now use Lorem Ipsum as
                                        their default model text, and a search for 'lorem ipsum' will uncover many web
                                        sites still in their infancy. Various versions have evolved over the years,
                                        sometimes by accident, sometimes on purpos, remaining essentially unchanged.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contacttab1" className="" id="nav-contact1" role="tabpanel"
                                        aria-labelledby="nav-contact-tab" tabIndex={0}>
                                        There are many variations of passages of Lorem Ipsum available, but the majority
                                        have suffered alteration in some form, by injected humour, or randomised words
                                        which don't look even slightly believable. <b>If you are going</b> to use a
                                        passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing
                                        hidden in the middle of text. All the Lorem Ipsum generators on the Internet
                                        tend to repeat predefined chunks as necessary, making this the first true
                                        generator on the Internet. It uses a dictionary of over 200 Latin words,
                                        combined with a handful of model sentence structures.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab Style-5
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="pillhome">
                            <Card.Body className="">
                                <Nav className=" nav-pills mb-3 nav-justified tab-style-5 d-sm-flex d-block" id="pills-tab" role="tablist">
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="pillhome" className="" id="pills-home-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-home" type="button" role="tab"
                                            aria-controls="pills-home" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="pillprofile" className="" id="pills-profile-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-profile" type="button" role="tab"
                                            aria-controls="pills-profile" aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="pillcontact" className="" id="pills-contact-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-contact" type="button" role="tab"
                                            aria-controls="pills-contact" aria-selected="false">Services</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="pilldisable" className="" id="pills-disabled-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-disabled" type="button" role="tab"
                                            aria-controls="pills-disabled" aria-selected="false">Contacts</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="" id="pills-tabContent">
                                    <Tab.Pane eventKey="pillhome" className="text-muted" id="pills-home" role="tabpanel"
                                        aria-labelledby="pills-home-tab" tabIndex={0}>
                                        It is a long established fact that a reader will be distracted by the readable
                                        content of a page when looking at its layout. The point of using Lorem Ipsum is
                                        that it has a more-or-less normal distribution of letters, as opposed to using
                                        'Content here, content here', making it look like readable English. <b>Many
                                            desktop publishing</b> packages and web page editors now use Lorem Ipsum as
                                        their default model text, and a search for 'lorem ipsum' will uncover many web
                                        sites still in their infancy.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="pillprofile" className=" text-muted" id="pills-profile" role="tabpanel"
                                        aria-labelledby="pills-profile-tab" tabIndex={0}>
                                        <b>Lorem Ipsum is simply dummy</b> text of the printing and typesetting
                                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to make a
                                        type specimen book. It has survived not only five centuries, but also the leap
                                        into electronic typesetting, remaining essentially unchanged. It was popularised
                                        in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                        passages.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="pillcontact" className=" text-muted" id="pills-contact" role="tabpanel"
                                        aria-labelledby="pills-contact-tab" tabIndex={0}>
                                        There are many variations of passages of Lorem Ipsum available, but the majority
                                        have suffered alteration in some form, by injected humour, or randomised words
                                        which don't look even slightly believable. <b>If you are going</b> to use a
                                        passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing
                                        hidden in the middle of text. All the Lorem Ipsum generators on the Internet
                                        tend to repeat predefined chunks as necessary, making this the first true
                                        generator on the Internet.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="pilldisable" className=" text-muted" id="pills-disabled" role="tabpanel"
                                        aria-labelledby="pills-disabled-tab" tabIndex={0}>
                                        <b>Contrary to popular belief</b>, Contrary to popular belief, Lorem Ipsum is
                                        not simply random text. It has roots in a piece of classical Latin literature
                                        from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor
                                        at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
                                        words, consectetur, from a Lorem Ipsum passage, and going through the cites of
                                        the word in classical literature, discovered the undoubtable source. Lorem Ipsum
                                        comes from sections.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-8 --> */}

            {/* <!-- Start:: row-9 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab Style-6
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="a">
                            <Card.Body className="custom-nav-tab">
                                <Nav className=" nav-tabs mb-3 tab-style-6" id="myTab3" role="tablist">
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="a" className="" id="products-tab" data-bs-toggle="tab"
                                            data-bs-target="#products-tab-pane" type="button" role="tab"
                                            aria-controls="products-tab-pane" aria-selected="true"><i
                                                className="ri-gift-line me-1 align-middle d-inline-block"></i>Products</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="b" className="" id="sales-tab" data-bs-toggle="tab"
                                            data-bs-target="#sales-tab-pane" type="button" role="tab"
                                            aria-controls="sales-tab-pane" aria-selected="false"><i
                                                className="ri-bill-line me-1 align-middle d-inline-block"></i>Sales</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="c" className="" id="profit-tab" data-bs-toggle="tab"
                                            data-bs-target="#profit-tab-pane" type="button" role="tab"
                                            aria-controls="profit-tab-pane" aria-selected="false"><i
                                                className="ri-money-dollar-box-line me-1 align-middle d-inline-block"></i>Profit</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="d" className="" id="expenses-tab" data-bs-toggle="tab"
                                            data-bs-target="#expenses-tab-pane" type="button" role="tab"
                                            aria-controls="expenses-tab-pane" aria-selected="false"><i
                                                className="ri-exchange-box-line me-1 align-middle d-inline-block"></i>Expenses</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="" id="myTabContent2">
                                    <Tab.Pane eventKey="a" className=" fade p-0 border-bottom-0 overflow-hidden" id="products-tab-pane"
                                        role="tabpanel" aria-labelledby="products-tab" tabIndex={0}>
                                        <div className="table-responsive">
                                            <SpkTables tableClass="mb-0" header={[{ title: 'Product' }, { title: 'Name' }, { title: 'Category' }, { title: 'Price' }]} >
                                                <tr>
                                                    <th scope="row">
                                                        <span className="avatar avatar-sm">
                                                            <Image  src={jpg3} alt="img" />
                                                        </span>
                                                    </th>
                                                    <td>Shoes</td>
                                                    <td>Footwear</td>
                                                    <td>$1,299.00</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <span className="avatar avatar-sm">
                                                            <Image  src={jpg4} alt="img" />
                                                        </span>
                                                    </th>
                                                    <td>Casual Shoes</td>
                                                    <td>Casual Wear</td>
                                                    <td>$7,249.29</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <span className="avatar avatar-sm">
                                                            <Image  src={jpg6} alt="img" />
                                                        </span>
                                                    </th>
                                                    <td>Sport Shoes</td>
                                                    <td>Footwear</td>
                                                    <td>$799.00</td>
                                                </tr>
                                            </SpkTables>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="b" className=" fade overflow-hidden" id="sales-tab-pane" role="tabpanel"
                                        aria-labelledby="sales-tab" tabIndex={0}>
                                        <ul className="list-unstyled mb-1">
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Clothing
                                                    </div>
                                                    <div className="fs-14 fw-medium">32,138</div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Furniture
                                                    </div>
                                                    <div className="fs-14 fw-medium">12,123</div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        electronics
                                                    </div>
                                                    <div className="fs-14 fw-medium">9,238</div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        food Products
                                                    </div>
                                                    <div className="fs-14 fw-medium">14,234</div>
                                                </div>
                                            </li>
                                            <li className="mb-0">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Home Appliances
                                                    </div>
                                                    <div className="fs-14 fw-medium">10,249</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="c" className=" fade overflow-hidden" id="profit-tab-pane" role="tabpanel"
                                        aria-labelledby="profit-tab" tabIndex={0}>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Clothing
                                                    </div>
                                                    <div className="fs-14 fw-medium text-success"><i
                                                        className="ri-arrow-up-s-fill me-1 align-middle"></i>22.75%
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        electronics
                                                    </div>
                                                    <div className="fs-14 fw-medium text-success"><i
                                                        className="ri-arrow-up-s-fill me-1 align-middle"></i>42.24%
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Furniture
                                                    </div>
                                                    <div className="fs-14 fw-medium text-success"><i
                                                        className="ri-arrow-up-s-fill me-1 align-middle"></i>15.23%
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Home Appliances
                                                    </div>
                                                    <div className="fs-14 fw-medium text-success"><i
                                                        className="ri-arrow-up-s-fill me-1 align-middle"></i>15.14%
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="mb-0">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        food Products
                                                    </div>
                                                    <div className="fs-14 fw-medium text-success"><i
                                                        className="ri-arrow-up-s-fill me-1 align-middle"></i>31.64%
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="d" className=" fade overflow-hidden" id="expenses-tab-pane" role="tabpanel"
                                        aria-labelledby="expenses-tab" tabIndex={0}>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Clothing
                                                    </div>
                                                    <div className="fs-14 fw-medium text-danger">-$31,134</div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        electronics
                                                    </div>
                                                    <div className="fs-14 fw-medium text-danger">-$15,256</div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Furniture
                                                    </div>
                                                    <div className="fs-14 fw-medium text-danger">-$24,156</div>
                                                </div>
                                            </li>
                                            <li className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        Home Appliances
                                                    </div>
                                                    <div className="fs-14 fw-medium text-danger">-$18,245</div>
                                                </div>
                                            </li>
                                            <li className="mb-0">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        food Products
                                                    </div>
                                                    <div className="fs-14 fw-medium text-danger">-$18,478</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tab Style-8
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="homestyle">
                            <Card.Body className="">
                                <Nav className=" nav-tabs mb-3 tab-style-8 scaleX" id="myTab4" role="tablist">
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="homestyle" className="" id="home-style8-tab" data-bs-toggle="tab"
                                            data-bs-target="#home-style8-tab-pane" type="button" role="tab"
                                            aria-controls="home-style8-tab-pane" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="aboutstyle" className="" id="about-style8-tab" data-bs-toggle="tab"
                                            data-bs-target="#about-style8-tab-pane" type="button" role="tab"
                                            aria-controls="about-style8-tab-pane" aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="" role="presentation">
                                        <Nav.Link eventKey="servicestyle" className="" id="services-style8-tab" data-bs-toggle="tab"
                                            data-bs-target="#services-style8-tab-pane" type="button" role="tab"
                                            aria-controls="services-style8-tab-pane" aria-selected="false">Services</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="" id="myTabContent3">
                                    <Tab.Pane eventKey="homestyle" className="overflow-hidden" id="home-style8-tab-pane"
                                        role="tabpanel" aria-labelledby="home-style8-tab" tabIndex={0}>
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="aboutstyle" className=" overflow-hidden" id="about-style8-tab-pane" role="tabpanel"
                                        aria-labelledby="about-style8-tab" tabIndex={0}>
                                        The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="servicestyle" className=" overflow-hidden" id="services-style8-tab-pane" role="tabpanel"
                                        aria-labelledby="services-style8-tab" tabIndex={0}>
                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vertical Tab Style-1
                            </div>
                        </Card.Header>
                        <Card.Body className="">
                            <Tab.Container defaultActiveKey="mainprofile">
                                <Row>
                                    <div className="col-md-2">
                                        <Nav className="flex-column nav-pills me-3 tab-style-7" id="v-pills-tab"
                                            role="tablist" aria-orientation="vertical">
                                            <Nav.Item>
                                                <Nav.Link eventKey="mainprofile" className=" text-start" id="main-profile-tab" data-bs-toggle="pill"
                                                    data-bs-target="#main-profile" type="button" role="tab"
                                                    aria-controls="main-profile" aria-selected="true"><i
                                                        className="ri-shield-user-line me-1 align-middle d-inline-block"></i>Profile</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="mainpassword" className=" text-start" id="man-password-tab" data-bs-toggle="pill"
                                                    data-bs-target="#man-password" type="button" role="tab"
                                                    aria-controls="man-password" aria-selected="false"><i
                                                        className="ri-u-disk-line me-1 align-middle d-inline-block"></i>Password</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="mainteam" className=" text-start" id="main-team-tab" data-bs-toggle="pill"
                                                    data-bs-target="#main-team" type="button" role="tab"
                                                    aria-controls="main-team" aria-selected="false"><i
                                                        className="ri-group-line me-1 align-middle d-inline-block"></i>Team</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="mainbilling" className=" text-start" id="main-billing-tab" data-bs-toggle="pill"
                                                    data-bs-target="#main-billing" type="button" role="tab"
                                                    aria-controls="main-billing" aria-selected="false"><i
                                                        className="ri-bill-line me-1 align-middle d-inline-block"></i>Billing</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="mainemail" className=" text-start mb-1" id="main-email-tab" data-bs-toggle="pill"
                                                    data-bs-target="#main-email" type="button" role="tab"
                                                    aria-controls="main-email" aria-selected="false"><i
                                                        className="ri-mail-line me-1 align-middle d-inline-block"></i>Email</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <Col md={10}>
                                        <Tab.Content className="" id="v-pills-tabContent">
                                            <Tab.Pane eventKey="mainprofile" className="" id="main-profile" role="tabpanel" tabIndex={0}>
                                                <div className="d-sm-flex">
                                                    <div className="me-3">
                                                        <span className="avatar avatar-xxl">
                                                            <Image  src={face9} alt="img" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="my-md-auto mt-4 ms-md-3">
                                                            <h5 className="font-weight-semibold ms-2 mb-1 pb-0">Gatin Leo</h5>
                                                            <p className="text-muted ms-0 mb-2 pb-2 "> <span className="me-3">Ui/Ux
                                                                Developer</span> <span className="me-3">West
                                                                    fransisco,Alabama</span> <span>New Jersey</span> </p>
                                                            <p className="text-muted ms-0 mb-2"><span><i
                                                                className="fe fe-phone me-2"></i></span><span
                                                                    className="font-weight-semibold me-2">Phone:</span><span>+94
                                                                        12345 6789</span> </p>
                                                            <p className="text-muted ms-0 mb-2"><span><i
                                                                className="fe fe-mail me-2"></i></span><span
                                                                    className="font-weight-semibold me-2">Email:</span><span>spruko.space@gmail. com</span>
                                                            </p>
                                                            <p className="text-muted ms-0 mb-2"><span><i
                                                                className="fe fe-globe me-2"></i></span><span
                                                                    className="font-weight-semibold me-2">Website:</span><span>sprukotechnologies</span>
                                                            </p>
                                                            <p className="text-muted mb-0 ms-2"><b>Lorem Ipsum</b> is simply
                                                                dummy text of the printing and typesetting industry. Lorem
                                                                Ipsum has been standard.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="mainpassword" className="" id="man-password" role="tabpanel" tabIndex={0}>
                                                <ul className="list-unstyled text-muted mb-0">
                                                    <li className="mb-2">
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting
                                                        industry. Lorem Ipsum has been the industry's <b>standard dummy text
                                                            ever since the 1500s</b>, when an unknown printer took a galley
                                                        of type and scrambled it to make a type specimen book. It has
                                                        survived not only five centuries, but also the leap into electronic
                                                        typesetting, remaining essentially unchanged. It was popularised in
                                                        the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                                        passages, and more recently with desktop publishing software like
                                                        Aldus PageMaker including versions of Lorem Ipsum.
                                                    </li>
                                                    <li className="mb-2">Contrary to popular belief, Lorem Ipsum is not simply
                                                        random text. It has roots in a piece of classical Latin literature
                                                        from 45 BC, making it over 2000 years old. Richard McClintock, a
                                                        Latin professor at Hampden-Sydney College in Virginia,</li>
                                                    <li className="mb-0">There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in some form.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="mainteam" className="" id="main-team" role="tabpanel"
                                                aria-labelledby="main-team-tab" tabIndex={0}>
                                                <ul className="list-unstyled text-muted mb-0">
                                                    <li className="mb-2">Contrary to popular belief, Lorem Ipsum is not simply
                                                        random text. It has roots in a piece of classical Latin literature
                                                        from 45 BC, making it over 2000 years old. Richard McClintock, a
                                                        Latin professor at Hampden-Sydney College in Virginia,</li>
                                                    <li className="mb-2">There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in some form.
                                                    </li>
                                                    <li className="mb-0">
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting
                                                        industry. Lorem Ipsum has been the industry's <b>standard dummy text
                                                            ever since the 1500s</b>, when an unknown printer took a galley
                                                        of type and scrambled it to make a type specimen book. It has
                                                        survived not only five centuries, but also the leap into electronic
                                                        typesetting, remaining essentially unchanged. It was popularised in
                                                        the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                                        passages, and more recently with desktop publishing software like
                                                        Aldus PageMaker including versions of Lorem Ipsum.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="mainbilling" className="" id="main-billing" role="tabpanel"
                                                aria-labelledby="main-billing-tab" tabIndex={0}>
                                                <ul className="list-unstyled text-muted mb-0">
                                                    <li className="mb-2">Contrary to popular belief, Lorem Ipsum is not simply
                                                        random text. It has roots in a piece of classical Latin literature
                                                        from 45 BC, making it over 2000 years old. Richard McClintock, a
                                                        Latin professor at Hampden-Sydney College in Virginia,</li>
                                                    <li className="mb-2">
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting
                                                        industry. Lorem Ipsum has been the industry's <b>standard dummy text
                                                            ever since the 1500s</b>, when an unknown printer took a galley
                                                        of type and scrambled it to make a type specimen book. It has
                                                        survived not only five centuries, but also the leap into electronic
                                                        typesetting, remaining essentially unchanged. It was popularised in
                                                        the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                                        passages, and more recently with desktop publishing software like
                                                        Aldus PageMaker including versions of Lorem Ipsum.
                                                    </li>
                                                    <li className="mb-0">There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in some form.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="mainemail" className="" id="main-email" role="tabpanel"
                                                aria-labelledby="main-email-tab" tabIndex={0}>
                                                <ul className="list-unstyled text-muted mb-0">
                                                    <li className="mb-2">Contrary to popular belief, Lorem Ipsum is not simply
                                                        random text. It has roots in a piece of classical Latin literature
                                                        from 45 BC, making it over 2000 years old. Richard McClintock, a
                                                        Latin professor at Hampden-Sydney College in Virginia,</li>
                                                    <li className="mb-2">There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in some form.
                                                    </li>
                                                    <li className="mb-0">
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting
                                                        industry. Lorem Ipsum has been the industry's <b>standard dummy text
                                                            ever since the 1500s</b>, when an unknown printer took a galley
                                                        of type and scrambled it to make a type specimen book. It has
                                                        survived not only five centuries, but also the leap into electronic
                                                        typesetting, remaining essentially unchanged. It was popularised in
                                                        the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                                        passages, and more recently with desktop publishing software like
                                                        Aldus PageMaker including versions of Lorem Ipsum.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-9 --> */}

            {/* <!-- Start:: row-10 --> */}

            <Row>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vertical Tab Style-2
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="customhome">
                            <Card.Body className="">
                                <Row>
                                    <div className="col-md-3">
                                        <Nav className=" nav-tabs flex-column vertical-tabs-2" role="tablist">
                                            <Nav.Item>
                                                <Nav.Link eventKey="customhome" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#home-vertical-custom"
                                                    aria-selected="true">
                                                    <p className="mb-1"><i className="ri-home-4-line"></i></p>
                                                    <p className="mb-0 text-break">Home</p>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="customabout" className="" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#about-vertical-custom"
                                                    aria-selected="true">
                                                    <p className="mb-1"><i className="ri-phone-line"></i></p>
                                                    <p className="mb-0 text-break">About</p></Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="customservice" className=" mb-0" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#services-vertical-custom"
                                                    aria-selected="true">
                                                    <p className="mb-1"><i className="ri-customer-service-line"></i></p>
                                                    <p className="mb-0 text-break">Services</p>
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <div className="col-md-9">
                                        <Tab.Content className="">
                                            <Tab.Pane eventKey="customhome" className="text-muted" id="home-vertical-custom"
                                                role="tabpanel">
                                                <ul className="mb-0">
                                                    <li className="mb-2">
                                                        How hotel deals can help you live a better life. <b>How celebrity
                                                            cruises</b> aren't as bad as you think. How cultural solutions
                                                        can help you predict the future. How to cheat at dog friendly hotels
                                                        and get away with it. 17 problems with summer activities. How to
                                                        cheat at travel agents and get away with it. How not knowing family
                                                        trip ideas makes you a rookie. What everyone is saying about daily
                                                        deals.
                                                    </li>
                                                    <li>
                                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="customabout" className=" text-muted" id="about-vertical-custom"
                                                role="tabpanel">
                                                <ul className="mb-0">
                                                    <li className="mb-2">
                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham,How hotel deals can help you live a better life. <b>How celebrity
                                                            cruises</b>
                                                    </li>
                                                    <li>
                                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="customservice" className=" text-muted" id="services-vertical-custom"
                                                role="tabpanel">
                                                <ul className="mb-0">
                                                    <li className="mb-2">
                                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.
                                                    </li>
                                                    <li>
                                                        How hotel deals can help you live a better life. <b>How celebrity
                                                            cruises</b> aren't as bad as you think. How cultural solutions
                                                        can help you predict the future. How to cheat at dog friendly hotels
                                                        and get away with it. 17 problems with summer activities. How to
                                                        cheat at travel agents and get away with it. How not knowing family
                                                        trip ideas makes you a rookie. What everyone is saying about daily
                                                        deals.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vertical Tabs Style-3
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="employee">
                            <Card.Body className="">
                                <Row>
                                    <div className="col-md-4">
                                        <Nav className=" nav-tabs flex-column vertical-tabs-3" role="tablist">
                                            <Nav.Item>
                                                <Nav.Link eventKey="employee" className="text-break" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#employee-vertical"
                                                    aria-selected="true">
                                                    <i className="ri-map-pin-user-line me-2 align-middle d-inline-block"></i>Employees
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="customers" className=" text-break" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#customers-vertical"
                                                    aria-selected="true">
                                                    <i className="ri-group-line me-2 align-middle d-inline-block"></i>Customers
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="products" className=" text-break mb-2" data-bs-toggle="tab" role="tab"
                                                    aria-current="page" href="#products-vertical"
                                                    aria-selected="true">
                                                    <i className="ri-gift-line me-2 align-middle d-inline-block"></i>Products
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <div className="col-md-8">
                                        <Tab.Content className="">
                                            <Tab.Pane eventKey="employee" className="text-muted" id="employee-vertical"
                                                role="tabpanel">
                                                <ul className="mb-0">
                                                    <li className="mb-2">
                                                        How hotel deals can help you live a better life. <b>How celebrity
                                                            cruises</b> aren't as bad as you think. How cultural solutions
                                                        can help you predict the future. How to cheat at dog friendly hotels
                                                        and get away with it. 17 problems with summer activities. How to
                                                        cheat at travel agents and get away with it. How not knowing family
                                                        trip ideas makes you a rookie. What everyone is saying about daily
                                                        deals.
                                                    </li>
                                                    <li>
                                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="customers" className=" text-muted" id="customers-vertical"
                                                role="tabpanel">
                                                <ul className="mb-0">
                                                    <li className="mb-2">
                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham,How hotel deals can help you live a better life. <b>How celebrity
                                                            cruises</b>
                                                    </li>
                                                    <li>
                                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="products" className=" text-muted" id="products-vertical"
                                                role="tabpanel">
                                                <ul className="mb-0">
                                                    <li className="mb-2">
                                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.
                                                    </li>
                                                    <li>
                                                        How hotel deals can help you live a better life. <b>How celebrity
                                                            cruises</b> aren't as bad as you think. How cultural solutions
                                                        can help you predict the future. How to cheat at dog friendly hotels
                                                        and get away with it. 17 problems with summer activities. How to
                                                        cheat at travel agents.
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-10 --> */}

            {/* <!-- Start:: row-11 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Tabs with dropdowns
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="drophome">
                            <Card.Body className="">
                                <Nav className=" nav-tabs mb-3 border-0 gap-sm-0 gap-1" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="drophome" className="" data-bs-toggle="tab" role="tab" href="#tab"
                                            aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <NavDropdown title="Cart" className="">
                                        <NavDropdown.Item eventKey="drophome1">About</NavDropdown.Item>
                                        <NavDropdown.Item >Another action</NavDropdown.Item>
                                        <NavDropdown.Item >Something else here</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item >Separated link</NavDropdown.Item>
                                    </NavDropdown>
                                    
                                    <Nav.Item>
                                        <Nav.Link eventKey="drophome2" className="" data-bs-toggle="tab" role="tab" href="#tab"
                                            aria-selected="false">Products</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="drophome3" className=" disabled">Services</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="drophome" className="text-muted" id="hometab-dropdown" role="tabpanel">
                                        <b>Lorem Ipsum is simply dummy</b> text of the printing and typesetting
                                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to make a
                                        type specimen book. It has survived not only five centuries.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="drophome1" className=" text-muted" id="homeabout-dropdown" role="tabpanel">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                                        in a piece of classical Latin literature from 45 BC, <b>Making it over 2000
                                            years old</b>. Richard McClintock, a Latin professor at Hampden-Sydney
                                        College in Virginia, looked up one of the more obscure Latin words, consectetur.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="drophome2" className=" text-muted" id="homeproducts-dropdown" role="tabpanel">
                                        There are many variations of passages of <b>Lorem Ipsum available</b>, but the
                                        majority have suffered alteration in some form, by injected humour, or
                                        randomised words which don't look even slightly believable. If you are going to
                                        use a passage of Lorem Ipsum, you need to be sure there isn't anything.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Pills with dropdowns
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="pillproduct">
                            <Card.Body className="">
                            <Nav className=" nav-pills mb-3" role="tablist">
                                <Nav.Item>
                                    <Nav.Link eventKey="pillproduct" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                        href="#pill-products" aria-selected="true">Products</Nav.Link>
                                </Nav.Item>
                                <NavDropdown title="Cart" className="">
                                        <NavDropdown.Item eventKey="pillwishlist">Wishlist</NavDropdown.Item>
                                        <NavDropdown.Item >Liked</NavDropdown.Item>
                                        <NavDropdown.Item >Save For Later</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item >Recently Viewed</NavDropdown.Item>
                                    </NavDropdown>
                                <Nav.Item>
                                    <Nav.Link eventKey="pillorders" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                        href="#pill-orders" aria-selected="false">Orders</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="" className=" disabled">Offers</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content className="">
                                <Tab.Pane eventKey="pillproduct" className="text-muted" id="pill-products" role="tabpanel">
                                    How travel coupons make you a better lover. Why cultural solutions are the new
                                    black. Why mom was right about travel insurances. How family trip ideas can help
                                    you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                    you'll never succeed at daily deals.
                                </Tab.Pane>
                                <Tab.Pane eventKey="dropdown" className="text-muted" id="pill-products" role="tabpanel">
                                    How travel coupons make you a better lover. Why cultural solutions are the new
                                    black. Why mom was right about travel insurances. How family trip ideas can help
                                    you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                    you'll never succeed at daily deals.
                                </Tab.Pane>
                                <Tab.Pane eventKey="pillwishlist" className=" text-muted" id="pill-wishlist" role="tabpanel">
                                    How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                    aren't as bad as you think. How cultural solutions can help you predict the
                                    future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                    with summer activities. How to cheat at travel agents and get away with it.
                                </Tab.Pane>
                                <Tab.Pane eventKey="pillorders" className=" text-muted" id="pill-orders" role="tabpanel">
                                    Unbelievable healthy snack success stories. 12 facts about safe food handling
                                    tips that will impress your friends. Restaurant weeks by the numbers. Will
                                    mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                    How restaurant weeks can make you sick.
                                </Tab.Pane>
                            </Tab.Content>
                            </Card.Body>
                        </Tab.Container>

                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-11 --> */}

            {/* <!-- Start:: row-13 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                FIll Pills
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="fillhome">
                            <Card.Body className="">
                                <Nav className=" nav-pills nav-fill mb-3" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="fillhome" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#fill-pill-home" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fillabout" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#fill-pill-about" aria-selected="false">Customer-ratings</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fillservice" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#fill-pill-services" aria-selected="false">Services</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="" className=" disabled">Disabled</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="fillhome" className="text-muted" id="fill-pill-home" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fillabout" className=" text-muted" id="fill-pill-about" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fillservice" className=" text-muted" id="fill-pill-services" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                justified Pills
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="justhome">
                            <Card.Body className="">
                                <Nav className=" nav-pills nav-justified mb-3 d-sm-flex d-block" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="justhome" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#justified-pill-home" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="justdetail" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#justified-pill-details" aria-selected="true">Company Details</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="justproduct" className="" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#justified-pill-products" aria-selected="true">Products</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="" className=" disabled">Disabled</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="justhome" className="text-muted" id="justified-pill-home" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="justdetail" className=" text-muted" id="justified-pill-details" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="justproduct" className=" text-muted" id="justified-pill-products" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-13 --> */}

            {/* <!-- Start:: row-12 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Working with flex utilities
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="flexhome">
                            <Card.Body className="">
                                <Nav className="nav-pills flex-column flex-sm-row mb-3" role="tablist">
                                    <Nav.Item className="flex-fill">
                                        <Nav.Link eventKey="flexhome" className="flex-sm-fill text-sm-center" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#pill-flex-home" aria-selected="true">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="flex-fill">
                                        <Nav.Link eventKey="flexbig" className="flex-sm-fill text-sm-center" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#pill-flex-big" aria-selected="false">More Data More The Tab Size</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="flex-fill">
                                        <Nav.Link eventKey="flexabout" className="flex-sm-fill text-sm-center" data-bs-toggle="tab" role="tab" aria-current="page"
                                            href="#pill-flex-about" aria-selected="false">About</Nav.Link>
                                    </Nav.Item>
                                    <a className="flex-sm-fill text-sm-center nav-link disabled">Services</a>
                                </Nav>
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="flexhome" className="text-muted" id="pill-flex-home" role="tabpanel">
                                        How travel coupons make you a better lover. Why cultural solutions are the new
                                        black. Why mom was right about travel insurances. How family trip ideas can help
                                        you predict the future. <b>How carnival cruises make you a better lover</b>. Why
                                        you'll never succeed at daily deals. 11 ways cheapest flights can find you the
                                        love of your life. The complete beginner's guide to mission trips. If you read
                                        one article about cultural notes read this one. Why you shouldn't eat vacation
                                        package in bed.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="flexbig" className=" text-muted" id="pill-flex-big" role="tabpanel">
                                        How hotel deals can help you live a better life. <b>How celebrity cruises</b>
                                        aren't as bad as you think. How cultural solutions can help you predict the
                                        future. How to cheat at dog friendly hotels and get away with it. 17 problems
                                        with summer activities. How to cheat at travel agents and get away with it. How
                                        not knowing family trip ideas makes you a rookie. What everyone is saying about
                                        daily deals. How twitter can teach you about carnival cruises. How to start
                                        using cultural solutions.
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="flexabout" className=" text-muted" id="pill-flex-about" role="tabpanel">
                                        Unbelievable healthy snack success stories. 12 facts about safe food handling
                                        tips that will impress your friends. Restaurant weeks by the numbers. Will
                                        mexican food ever rule the world? The 10 best thai restaurant youtube videos.
                                        How restaurant weeks can make you sick. The complete beginner's guide to cooking
                                        healthy food. Unbelievable food stamp success stories. How whole foods markets
                                        are making the world a better place. 16 things that won't happen in dish
                                        reviews.
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-12 --> */}

        </Fragment>
    )
};

export default NavsTabs;