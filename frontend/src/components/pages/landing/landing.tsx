
import { Link } from 'react-router-dom'
import SpkAccordions from '../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-accordions'
import SpkButton from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons'
import SpkBasicPriceCard from '../../../shared/@spk-reusable-components/reusable-pages/spk-basicpricecard'
import SpkTeamCard from '../../../shared/@spk-reusable-components/reusable-pages/spk-teamcard'
import SpkSwiperJs from '../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs'
import { LandingFaqs, LandingFeatures, laningSwiper, ServiceCards, WorkflowCards } from '../../../shared/data/pages/landingdata'
import { BasicPricing1data, BasicPricingdata } from '../../../shared/data/pages/pricingdata'
import { TeamMembersLanding } from '../../../shared/data/pages/teamdata'
import { CustomReviewdata } from '../../../shared/data/pages/testimonialsdata'
import { data$, getState, setState } from '../../../shared/layouts-components/services/switcherServices'
import LandingSwitcher from '../../../shared/layouts-components/switcher/landing-switcher'
import  { Fragment, useEffect, useRef, useState } from 'react'
import { Card, Col, Form, Image, Nav, Row, Tab } from 'react-bootstrap'
import logo1 from '../../../assets/images/brand-logos/desktop-dark.png';
import logo2 from '../../../assets/images/brand-logos/desktop-logo.png';
import logo3 from '../../../assets/images/brand-logos/toggle-logo.png';
import logo4 from '../../../assets/images/brand-logos/toggle-dark.png';
import BG1 from '../../../assets/images/media/backgrounds/1.png';
import BG2 from '../../../assets/images/media/backgrounds/2.png';
import BG5 from '../../../assets/images/media/backgrounds/5.png';
import BG7 from '../../../assets/images/media/backgrounds/7.png';
import media67 from '../../../assets/images/media/media-67.png';
const Landing = () => {

    const breakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        640: {
            slidesPerView: 1,
            spaceBetween: 5,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 5,
        },
        1024: {
            slidesPerView: 5,
            spaceBetween: 20,
        }
    }

    const breakpoints1 = {
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1112: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1300: {
            slidesPerView: 2,
            spaceBetween: 30,
          }
    }

    let [variable, setVariable] = useState(getState());

    useEffect(() => {
        const subscription = data$.subscribe((e) => {
            setVariable(e);
        });

        return () => subscription.unsubscribe();
    }, []);

    //MenuClose Function
    const overlayElementRef: any = useRef(null);

    function menuClose() {
        if (window.innerWidth <= 992) {
            const newState = {
                toggled: "close"
            }
            setState(newState);
        }
        if (overlayElementRef.current) {
            overlayElementRef.current?.classList.remove("active");
        }
    }
    //ToggleNavigation Function

    const Datawidth = window.innerWidth
    function toggleNavigation() {
        if (Datawidth <= 992) {
            const currentToggled = variable
            const newState = {
                toggled: currentToggled === 'open' ? 'close' : 'open',
                dataNavLayout: "horizontal",
            };
            setState(newState);
        }
    }

    useEffect(() => {
        window.addEventListener('resize', toggleNavigation);
        return () => {
            window.removeEventListener('resize', toggleNavigation);
        };
    }, []);

    useEffect(() => {

        const newState = {
            dataNavStyle: "menu-click",
            dataNavLayout: "horizontal",
            dataMenuStyles: "",
            dataVerticalStyle: "",
            dataWidth: "",
            dataHeaderStyles: '',
            bodyBg:'',
            bodyBg2:'',
        }
        setState(newState);

        return () => {
            const newState = {
                dataNavStyle: "",
                dataVerticalStyle: "doublemenu",
                dataNavLayout: `${localStorage.rixzoLayout == "horizontal" ? "horizontal" : "vertical"}`,
                dataMenuStyles: 'transparent',
                dataHeaderStyles: 'transparent',
                toggled: 'double-menu-open'
            }
            setState(newState)
        }

    }, [])

    useEffect(() => {
        window.addEventListener('resize', menuClose);
        return () => {
            window.removeEventListener('resize', menuClose);
        };
    }, []);

    //Handle Function
    useEffect(() => {
        function handleResize() {


            if (window.innerWidth <= 992) {
                const newState = {
                    toggled: 'close',
                    dataNavLayout: 'horizontal'
                }
                setState(newState)
            }
            else {
                const newState = {
                    toggled: 'open',
                    dataNavLayout: 'horizontal'
                }
                setState(newState)
                console.log(newState, "newState")
            }
        }

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const landingpages = () => {
            if (window.scrollY > 30 && documentSelector(".app-sidebar")) {
                let Scolls = document?.querySelectorAll(".sticky");
                Scolls.forEach((e) => {
                    e.classList.add("sticky-pin");
                });
            } else {
                let Scolls = document?.querySelectorAll(".sticky");
                Scolls.forEach((e) => {
                    e.classList.remove("sticky-pin");
                });
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", landingpages);
        }
    });

    function handleClick1() {
        setExpande(false);
        setExpande1(false);
        setExpande2(false);
        const newState = {
            toggled: 'close',
            dataNavLayout: 'horizontal'
        }
        setState(newState)
    }

    // State hooks for menu expansion
    const [expande, setExpande] = useState(false);
    const [expande1, setExpande1] = useState(false);
    const [expande2, setExpande2] = useState(false);
    const [isActive, _setIsActive] = useState(false);

    const documentSelector = (selector: string) => document.querySelector<HTMLElement>(selector);
    const documentSelectors = (selector: string) => document.querySelectorAll<HTMLElement>(selector);


    useEffect(() => {
        // Check localStorage for initial state
        if (localStorage.getItem('data-menu-styles') === 'light') {
            documentSelector('html')?.setAttribute('data-menu-styles', 'light');
        }
    }, []);

    const toggleExpand = () => {
        setExpande(!expande);
        // Ensure you're only setting light theme once
        if (localStorage.getItem('data-menu-styles') === 'light') {
            documentSelector('html')?.setAttribute('data-menu-styles', 'light');
        }
    };

    const handleSubMenuToggle1 = () => setExpande1(!expande1);
    const handleSubMenuToggle2 = () => setExpande2(!expande2);

    //  switcher offcanvas

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleClick = (e: any) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute("href");
        const location = document.getElementById(target.substring(1))?.offsetTop;
        if (location !== undefined) {
            window.scrollTo({
                left: 0,
                top: location - 64,
                behavior: "smooth",
            });
        }
    };


    useEffect(() => {
        const pageLinks = documentSelectors(".side-menu__item");
        pageLinks.forEach((elem) => {
            elem.addEventListener("click", handleClick);
        });

        return () => {
            pageLinks.forEach((elem) => {
                elem.removeEventListener("click", handleClick);
            });
        };
    }, []);

    const onScroll = () => {
        const sections = documentSelectors(".side-menu__item");
        const scrollPos =
            window.scrollY ||
            document.documentElement.scrollTop ||
            (documentSelector("body")?.scrollTop || 0);

        sections.forEach((elem) => {
            const value = elem.getAttribute("href") ?? "";
            const fragmentIndex = value.indexOf("#");
            const fragment = fragmentIndex !== -1 ? value.substring(fragmentIndex + 1) : "";

            if (fragment) {
                const refElement = document.getElementById(fragment);

                if (refElement) {
                    const scrollTopMinus = scrollPos + 73;
                    if (
                        refElement.offsetTop <= scrollTopMinus &&
                        refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
                    ) {
                        elem.classList.add("active");
                    } else {
                        elem.classList.remove("active");
                    }
                }
            }
        });
    };
    useEffect(() => {
        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <Fragment>

            {/* <!-- app-header --> */}

            <header className="app-header">

                {/* <!-- Start::main-header-container --> */}

                <div className="main-header-container container-fluid">

                    {/* <!-- Start::header-content-left --> */}

                    <div className="header-content-left">

                        {/* <!-- Start::header-element --> */}

                        <div className="header-element">
                            <div className="horizontal-logo">
                                <Link to={`${import.meta.env.BASE_URL}dashboards/sales`} className="header-logo">
                                    <Image  src={logo3} alt="logo" className="toggle-logo" />
                                    <Image  src={logo4} alt="logo" className="toggle-dark" />
                                </Link>
                            </div>
                        </div>

                        {/* <!-- End::header-element --> */}

                        {/* <!-- Start::header-element --> */}

                        <div className="header-element">

                            {/* <!-- Start::header-link --> */}

                            <Link to="#!" className="sidemenu-toggle header-link" data-bs-toggle="sidebar" onClick={() => toggleNavigation()}>
                                <span className="open-toggle">
                                    <i className="ri-menu-3-line fs-20"></i>
                                </span>
                            </Link>

                            {/* <!-- End::header-link --> */}

                        </div>

                        {/* <!-- End::header-element --> */}

                    </div>

                    {/* <!-- End::header-content-left --> */}

                    {/* <!-- Start::header-content-right --> */}

                    <div className="header-content-right">

                        {/* <!-- Start::header-element --> */}

                        <div className="header-element align-items-center">

                            {/* <!-- Start::header-link|switcher-icon --> */}

                            <div className="btn-list d-lg-none d-flex">
                                <Link to={`${import.meta.env.BASE_URL}pages/authentication/sign-up/basic`} className="btn btn-success-light">
                                    Sign Up
                                </Link>
                                <SpkButton Buttonvariant='primary' onClickfunc={handleShow} Customclass="btn-icon switcher-icon d-flex align-items-center justify-content-center rounded-circle" data-bs-toggle="offcanvas"
                                    data-bs-target="#switcher-canvas">
                                    <i className="ri-settings-3-line"></i>
                                </SpkButton>
                                <LandingSwitcher show={show} handleClose={handleClose} />
                            </div>

                            {/* <!-- End::header-link|switcher-icon --> */}

                        </div>

                        {/* <!-- End::header-element --> */}

                    </div>

                    {/* <!-- End::header-content-right --> */}

                </div>

                {/* <!-- End::main-header-container --> */}

            </header>

            {/* <!-- /app-header --> */}

            <div id="responsive-overlay" ref={overlayElementRef} onClick={() => menuClose()}></div>

            <aside className="app-sidebar sticky" id="sidebar">

                <div className="container px-0">

                    {/* <!-- Start::main-sidebar --> */}

                    <div className="main-sidebar shadow-none">

                        {/* <!-- Start::nav --> */}

                        <nav className="main-menu-container nav nav-pills sub-open">
                            <div className="landing-logo-container">
                                <div className="horizontal-logo">
                                    <Link to={`${import.meta.env.BASE_URL}dashboards/sales`} className="header-logo">
                                        <Image  src={logo2} alt="logo"
                                            className="desktop-logo" />
                                        <Image  src={logo1} alt="logo"
                                            className="desktop-dark" />
                                    </Link>
                                </div>
                            </div>
                            <div className="slide-left" id="slide-left"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191"
                                width="24" height="24" viewBox="0 0 24 24">
                                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                            </svg></div>
                            <ul className="main-menu flex-fill justify-content-center">

                                {/* <!-- Start::slide --> */}

                                <li className="slide">
                                    <a href="#home" className="side-menu__item">
                                        <span className="side-menu__label">Home</span>
                                    </a>
                                </li>

                                {/* <!-- End::slide --> */}

                                {/* <!-- Start::slide --> */}

                                <li className="slide">
                                    <a href="#feature" className="side-menu__item">
                                        <span className="side-menu__label">Features</span>
                                    </a>
                                </li>
                                <li className="slide">
                                    <a href="#service" className="side-menu__item">
                                        <span className="side-menu__label">Services</span>
                                    </a>
                                </li>

                                {/* <!-- End::slide -->

                    <!-- Start::slide --> */}
                                {/* <!-- End::slide --> */}

                                <li className={`slide has-sub ${expande ? 'open' : ''} `}>
                                    <a href="#!" className={`side-menu__item ${expande ? 'active' : ''} ${isActive ? 'active' : ''}`} onClick={toggleExpand} >
                                        <span className="side-menu__label">Pages</span>
                                        <i className="fe fe-chevron-down side-menu__angle op-8 me-2"></i>
                                    </a>
                                    <ul className={`slide-menu child1 ${expande ? 'active' : ''}`}
                                        style={{ display: expande ? 'block' : 'none' }}
                                    >
                                        <li className="slide">
                                            <a href="#!" className="side-menu__item">About Us</a>
                                        </li>
                                        <li className="slide">
                                            <a href="#!" className="side-menu__item">Terms & Conditions</a>
                                        </li>
                                        <li className="slide">
                                            <a href="#!" className="side-menu__item">Privacy Policy</a>
                                        </li>
                                        <li className={`slide has-sub ${expande1 ? 'open' : ''}`}>
                                            <a href="#!" className="side-menu__item" onClick={handleSubMenuToggle1} >Level-2
                                                <i className="fe fe-chevron-right side-menu__angle"></i></a>
                                            <ul className={`slide-menu child2 ${expande1 ? 'active' : ''}`}
                                                style={{ display: expande1 ? 'block' : 'none' }}>
                                                <li className="slide">
                                                    <a href="#!" className="side-menu__item">Level-2-1</a>
                                                </li>
                                                <li className={`slide has-sub ${expande2 ? 'open' : ''}`}>
                                                    <a href="#!" className="side-menu__item" onClick={handleSubMenuToggle2} >Level-2-2
                                                        <i className="fe fe-chevron-right side-menu__angle"></i></a>
                                                    <ul className={`slide-menu child3 ${expande2 ? 'active' : ''}`}
                                                        style={{ display: expande2 ? 'block' : 'none' }}>
                                                        <li className="slide">
                                                            <a href="#!"
                                                                className="side-menu__item">Level-2-2-1</a>
                                                        </li>
                                                        <li className="slide has-sub">
                                                            <a href="#"
                                                                className="side-menu__item">Level-2-2-2</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>

                                {/* <!-- Start::slide --> */}

                                <li className="slide">
                                    <a href="#price" className="side-menu__item">
                                        <span className="side-menu__label">Subscription</span>
                                    </a>
                                </li>

                                {/* <!-- End::slide -->

                    <!-- Start::slide --> */}

                                <li className="slide">
                                    <a href="#contactus" className="side-menu__item">
                                        <span className="side-menu__label">Contact Us</span>
                                    </a>
                                </li>
                                {/* <!-- End::slide --> */}

                            </ul>
                            <div className="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191"
                                width="24" height="24" viewBox="0 0 24 24">
                                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z">
                                </path>
                            </svg></div>
                            <div className="d-lg-flex d-none align-items-center">
                                <div className="btn-list d-xl-flex d-none">
                                    <Link to={`${import.meta.env.BASE_URL}pages/authentication/sign-up/basic`} className="btn btn-wave btn-primary border">
                                        Login / Register
                                    </Link>
                                </div>

                                <Link to="#!" className="btn btn-icon btn-primary-light switcher-icon" onClick={handleShow} data-bs-toggle="offcanvas" data-bs-target="#switcher-canvas">
                                    <i className="ti ti-settings"></i>
                                </Link>
                            </div>
                        </nav>

                        {/* <!-- End::nav --> */}

                    </div>

                    {/* <!-- End::main-sidebar --> */}

                </div>

            </aside>

            <div className="main-content landing-main px-0" onClick={handleClick1}>

                {/* <!-- Start:: Landing Banner --> */}

                <div className="landing-banner">
                    <div className="banner-image-container grid-cards ">
                        <Image  src={BG5} alt="" />
                    </div>
                    <div className="container" id="home">
                        <Row>
                            <Col xl={6} className="my-auto">
                                <div className="d-inline-flex align-items-center gap-2 text-default badge bg-white border fs-13 rounded-pill"><span className="avatar avatar-xs avatar-rounded bg-warning"><i className="ri-flashlight-fill fs-14"></i></span>Seamless Integration</div>
                                <h1 className="fw-semibold mt-3 landing-banner-heading">Track key metrics <br /> and <span className="text-primary">optimize</span> your business</h1>
                                <span className="d-block fs-18">Keep track of important business metrics and optimize processes to drive growth and improve efficiency.</span>
                                <div className="btn-list banner-buttons">
                                    <Link to={`${import.meta.env.BASE_URL}dashboards/sales`} className="btn btn-primary btn-lg rounded-pill btn-w-lg">Get Started for free</Link>
                                    <Link  className="btn btn-lg btn-light border rounded-pill btn-w-lg" to="#!">View Demo</Link>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <div className="banner-main-img text-end d-xl-block d-none grid-cards">
                                    <Image  src={BG7} alt="" className="img-fluid" />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* <!-- End:: Landing Banner --> */}

                {/* <!-- Start:: Section-1 --> */}

                <section className="section">
                    <div className="container custom-lan">
                        <div className="heading-section">
                            <div className="heading-subtitle">Clients</div>
                            <div className="heading-title">Trusted by Leading Companies Worldwide</div>
                            <div className="heading-description">
                                Thousands of businesses trust our solutions <br /> to optimize their operations and drive growth.
                            </div>
                        </div>
                        <SpkSwiperJs slides={laningSwiper} breakpoint={breakpoints} loop={true} slidesPerView={5} spaceBetween={30} centeredSlides={true} autoplay={true} className="mySwiper swiper trusted-clients" />
                    </div>
                </section>

                {/* <!-- End:: Section-1 --> */}

                {/* <!-- Start:: Section-2 --> */}

                <section className="section" id="feature">
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">Features</div>
                            <div className="heading-title">Powerful Features to Streamline Your Workflow</div>
                            <div className="heading-description">
                                Boost productivity and simplify management with our powerful, real-time features.
                            </div>
                        </div>
                        <Row className="">
                            {LandingFeatures.map((feature, index) => (
                                <Col xl={4} md={6} key={index}>
                                    <Card className="custom-card">
                                        <Card.Body>
                                            <div className="lh-1 mb-3">
                                                <span className={`avatar avatar-lg avatar-rounded ${feature.bgClass} ${feature.svgClass}`}>
                                                    {feature.svgIcon}
                                                </span>
                                            </div>
                                            <h5 className="fw-semibold">{feature.title}</h5>
                                            <span className="fs-15 text-muted">{feature.description}</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* <!-- End:: Section-2 --> */}

                {/* <!-- Start:: Section-3 --> */}

                <section className="section" id="service">
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">Services</div>
                            <div className="heading-title">Comprehensive Solutions for Your Business Needs</div>
                            <div className="heading-description">
                                Discover our services to streamline operations, boost productivity, <br /> and drive growth, from analytics to automation.
                            </div>
                        </div>
                        <Row>
                            <Col xl={7}>
                                <Row>
                                    {ServiceCards.map((card, index) => (
                                        <Col lg={6} key={index}>
                                            <Card className={`custom-card landing-services-card ${card.cardClass}`}>
                                                <Card.Body>
                                                    <div className="d-flex align-items-start gap-3">
                                                        <div className="lh-1">
                                                            <span className={`avatar avatar-lg avatar-rounded ${card.iconBgClass} ${card.iconColorClass}`}>
                                                                {card.icon}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h6 className="d-block fw-semibold">{card.title}</h6>
                                                            <span className="d-block text-muted">{card.description}</span>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                            <Col xl={5} className="my-auto">
                                <div className="services-image-container text-end d-xl-block d-none">
                                    <Image  src={media67} alt="" className="img-fluid" />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* <!-- End:: Section-3 --> */}

                {/* <!-- Start:: Buy Now Section --> */}

                <section className="section section-md section-primary text-fixed-white py-5 buy-now-section overflow-hidden">
                    <div className="testimonials-background-container grid-cards">
                        <Image  src={BG1} alt="" />
                    </div>
                    <div className="container">
                        <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap">
                            <div>
                                <h4 className="fw-semibold text-fixed-white">Transform Your Workflow Today</h4>
                                <span className="d-block fs-16 op-8">Unlock all the powerful features of our admin template. <br /> Purchase now or try the demo to see it in action!</span>
                            </div>
                            <div className="btn-list">
                                <Link to={`${import.meta.env.BASE_URL}dashboards/sales/`} className="btn btn-danger btn-lg btn-w-md d-inline-flex align-items-center">View Demo<i className="ti ti-arrow-narrow-right ms-2"></i></Link>
                                <button className="btn btn-success btn-lg btn-w-md d-inline-flex align-items-center">Buy Now<i className="ti ti-shopping-cart ms-2"></i></button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- End:: Buy Now Section --> */}

                {/* <!-- Start:: Section-4 --> */}

                <section className="section" id="price">
                    <div className="container">
                        <Tab.Container defaultActiveKey={"monthly"}>
                            <div className="heading-section">
                                <div className="heading-subtitle">Our Pricing</div>
                                <div className="heading-title">Choose the Plan That Fits Your Needs</div>
                                <div className="heading-description mb-3">
                                    Select the right fit and enjoy seamless access to all features.
                                </div>
                                <div className="tab-style-1 border bg-white rounded-0 d-inline-block">
                                    <Nav className="nav nav-pills" role="tablist">
                                        <Nav.Item className="" role="presentation">
                                            <Nav.Link eventKey={"monthly"} type="button" className="rounded-0 fw-medium" data-bs-toggle="pill" data-bs-target="#pricing1-monthly" aria-selected="true" role="tab">Monthly</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="" role="presentation">
                                            <Nav.Link eventKey={"yearly"} type="button" className="rounded-0 fw-medium" data-bs-toggle="pill" data-bs-target="#pricing1-yearly" aria-selected="false" role="tab" tabIndex={-1}>Yearly</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                            </div>
                            <Tab.Content>
                                <Tab.Pane eventKey={"monthly"} className="p-0 border-0" id="pricing1-monthly" role="tabpanel">
                                    <Row>
                                        {BasicPricingdata.map((card, index) => (
                                            <Col xxl={4} key={index}>
                                                <SpkBasicPriceCard cardClass={card.cardClass} price={card} />
                                            </Col>
                                        ))}
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey={"yearly"} className="p-0 border-0" id="pricing1-yearly" role="tabpanel">
                                    <Row>
                                        {BasicPricing1data.map((card, index) => (
                                            <Col xxl={4} key={index}>
                                                <SpkBasicPriceCard cardClass={card.cardClass} price={card} />
                                            </Col>
                                        ))}
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </section>

                {/* <!-- End:: Section-4 --> */}

                {/* <!-- Start:: Section-5 --> */}

                <section className="section">
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">FAQ's</div>
                            <div className="heading-title">Need Help? Find Your Answers Here</div>
                            <div className="heading-description">
                                Browse through common questions to get quick solutions. We're here to help!
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12">
                                <SpkAccordions bodyClass="" items={LandingFaqs} defaultActiveKey={1} accordionClass="accordion faq-accordion accordions-items-seperate " />
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- End:: Section-5 --> */}

                {/* <!-- Start:: Section-6 --> */}

                <section className="section section-primary testimonials-section">
                    <div className="testimonials-background-container">
                        <img src={BG2} alt="" />
                    </div>
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">Testimonials</div>
                            <div className="heading-title">See What Our Customers Say</div>
                            <div className="heading-description">
                                Read real testimonials from customers who’ve <br /> improved their business with our platform.
                            </div>
                        </div>
                        <SpkSwiperJs slides={CustomReviewdata} loop={true} pagination={{ dynamicBullets: true, clickable: true }} breakpoint={breakpoints1} slidesPerView={2} spaceBetween={30}  autoplay={true} className="mySwiper swiper testimonial-style-2-card" />
                    </div>
                </section>

                {/* <!-- End:: Section-6 --> */}

                {/* <!-- Start:: Setion-7 --> */}

                <section className="section bg-light py-5">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-lg-3 col-6">
                                <div className="text-center stats-point one">
                                    <h4 className="fw-semibold mb-1">12,345</h4>
                                    <div className="text-muted fs-16">Customers</div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="text-center stats-point two">
                                    <h4 className="fw-semibold mb-1">56,789</h4>
                                    <div className="text-muted fs-16">Products Sold</div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="text-center stats-point three">
                                    <h4 className="fw-semibold mb-1">1,234</h4>
                                    <div className="text-muted fs-16">Projects</div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="text-center stats-point four">
                                    <h4 className="fw-semibold mb-1">98%</h4>
                                    <div className="text-muted fs-16">Client Satisfaction Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- End:: Setion-7 --> */}

                {/* <!-- Start:: Section-8 --> */}

                <section className="section">
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">Workflow</div>
                            <div className="heading-title">Streamlined Workflow for Efficient Results</div>
                            <div className="heading-description">
                                Discover how our structured workflow drives productivity, <br /> ensuring seamless execution from start to finish.
                            </div>
                        </div>
                        <Row className="justify-content-between">
                            {WorkflowCards.map((card, index) => (
                                <Col lg={3} key={index}>
                                    <Card className="custom-card border-0 shadow-none">
                                        <Card.Body className="p-4 text-center">
                                            {card.imgSrc && (
                                                <div className="step-arrow-container d-lg-block d-none">
                                                    <Image  src={card.imgSrc} alt={card.title} className="img-fluid" />
                                                </div>
                                            )}
                                            <div className="lh-1 mb-3">
                                                <span className={`avatar avatar-lg ${card.iconClass} workflow-icon-container`}>
                                                    {card.icon}
                                                </span>
                                            </div>
                                            <h5 className="fw-semibold">{card.title}</h5>
                                            <span className="d-block text-muted">{card.description}</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>
                {/* <!-- End:: Section-8 --> */}

                {/* <!-- Start:: Section-9 --> */}
                <section className="section our-team-section">
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">Our Team</div>
                            <div className="heading-title">Meet Our Expert Team</div>
                            <div className="heading-description">
                                Get to know the talented individuals behind our success, <br /> working together to deliver exceptional results.
                            </div>
                        </div>
                        <Row>
                            {TeamMembersLanding.slice(0, 4).map((idx, index) => (
                                <Col lg={3} md={6} key={index}>
                                    <SpkTeamCard member={idx} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* <!-- End:: Section-9 --> */}

                {/* <!-- Start:: Section-10 --> */}

                <section className="section" id="contactus">
                    <div className="container">
                        <div className="heading-section">
                            <div className="heading-subtitle">Contact Us</div>
                            <div className="heading-title">Get in Touch With Us</div>
                            <div className="heading-description">
                                Have questions or need assistance? Our team is here to help. <br /> Reach out to us anytime for support or inquiries.
                            </div>
                        </div>
                        <Row className="gy-4 justify-content-between">
                            <Col xl={6}>
                                <h6 className="fw-semibold mb-4">Get In Touch !</h6>
                                <Row className="gy-3">
                                    <Col xl={6}>
                                        <label htmlFor="contact-address-firstname" className="form-label">First Name</label>
                                        <Form.Control type="text" className="" id="contact-address-firstname" placeholder="Enter Name" />
                                    </Col>
                                    <Col xl={6}>
                                        <label htmlFor="contact-address-lastname" className="form-label">Last Name</label>
                                        <Form.Control type="text" className="" id="contact-address-lastname" placeholder="Enter Name" />
                                    </Col>
                                    <Col xl={12}>
                                        <label htmlFor="contact-address-email" className="form-label">Email Id</label>
                                        <Form.Control type="email" className="" id="contact-address-email" placeholder="Enter Email Id" />
                                    </Col>
                                    <Col xl={12}>
                                        <label htmlFor="contact-address-phone" className="form-label">Phone No</label>
                                        <Form.Control type="text" className="" id="contact-address-phone" placeholder="Enter Phone No" />
                                    </Col>
                                    <Col xl={12}>
                                        <label htmlFor="contact-mail-message" className="form-label">Message</label>
                                        <Form.Control as="textarea" className="form-control" id="contact-mail-message" rows={4} placeholder="Enter Your Query ?" />
                                    </Col>
                                </Row>
                                <div className="d-grid mt-3">
                                    <SpkButton Buttonvariant='primary' Customclass="btn">Submit<i className="ti ti-arrow-narrow-right ms-1 align-middle"></i></SpkButton>
                                </div>
                            </Col>
                            <Col xl={5}>
                                <div className="row gy-5">
                                    <Col xl={12}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div>
                                                <span className="avatar avatar-lg bg-primary-transparent svg-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="fs-13 text-muted text-uppercase">Address :</h5>
                                                <span className="d-block fs-12 text-muted mb-2">Visit us in person From Mon-Fri 9:00am - 6:00pm</span>
                                                <div className="fw-semibold">123 Health Street, Suite 456
                                                    <br />Wellness City, HC 78910<br />
                                                    Country Name</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div>
                                                <span className="avatar avatar-lg bg-primary-transparent svg-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"></path><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"></path></svg>
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="fs-13 text-muted text-uppercase">Phone Number :</h5>
                                                <span className="d-block fs-12 text-muted mb-2">Call our team Mon-Fri 9:00am - 6:00pm</span>
                                                <div className="fw-semibold">+1 (555) 123-4567</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div>
                                                <span className="avatar avatar-lg bg-primary-transparent svg-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"></path><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="fs-13 text-muted text-uppercase">Email ID :</h5>
                                                <div className="fw-semibold lh-1">contact@healthclinic.com</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div>
                                                <span className="avatar avatar-lg bg-primary-transparent svg-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.516 5 6.934V22l5.34-4.004C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8zm-2.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="fs-13 text-muted text-uppercase">Chat With Us :</h5>
                                                <div className="fw-semibold lh-1 chat-platforms">
                                                    <a href="https://www.facebook.com" target="_blank" className="d-block">
                                                        Chat on Facebook
                                                    </a>
                                                    <a href="https://www.twitter.com" target="_blank" className="d-block">
                                                        Message Us On Twitter
                                                    </a>
                                                    <a href="javascript:void(0);" target="_blank">
                                                        Start a Live Chat
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* <!-- End:: Section-10 --> */}

                {/* <!-- Start:: Buy Now Section --> */}

                <section className="section section-md section-primary text-fixed-white py-5 buy-now-section">
                    <div className="testimonials-background-container">
                        <Image  src={BG1} alt="" />
                    </div>
                    <div className="container">
                        <div className="d-flex align-items-center gap-2 justify-content-between">
                            <div>
                                <h4 className="fw-semibold text-fixed-white">Build and Manage with Ease</h4>
                                <span className="d-block fs-16 op-8">Create, manage, and optimize effortlessly with our admin template.</span>
                            </div>
                            <SpkButton Buttonvariant='secondary' Customclass="btn btn-lg btn-w-md d-inline-flex align-items-center">Buy Now<i className="ti ti-shopping-cart ms-2"></i></SpkButton>
                        </div>
                    </div>
                </section>

                {/* <!-- End:: Buy Now Section --> */}

            </div>

            {/* <!-- End:: app - content-- > */}

            {/* // < !--Start:: Footer-- > */}

            <section className="section landing-footer text-fixed-white">
                <div className="container">
                    <Row className="my-auto justify-content-between align-items-center mb-5 pb-5 newsletter-area gap-3">
                        <Col lg={6} className="">
                            <h3 className="mb-2 text-fixed-white">Subscribe to our News Letter</h3>
                            <div className="op-6">Stay up-to-date with the latest news and updates on our
                                products and services</div>
                        </Col>
                        <Col lg={4}>
                            <div className="form mb-0">
                                <div className="form-group custom-form-group mx-auto custom-lan">
                                    <Form.Control type="text" className="shadow-none" placeholder="Enter Your Email Address..." />
                                    <SpkButton Buttonvariant='primary' Customclass="custom-form-btn btn bg-primary border-0 right-0 shadow-none" Buttontype="button">Subscribe</SpkButton>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center gy-3">
                        <Col xl={4}>
                            <p className="fw-semibold mb-3 brand-image"><Link to={`${import.meta.env.BASE_URL}dashboards/sales`}><Image  src={logo1} alt="" /></Link></p>
                            <p className="mb-2 op-6 fw-normal">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit et magnam, fuga est mollitia eius, quo illum illo inventore optio aut quas omnis rem. Dolores accusantium aspernatur minus ea incidunt.
                            </p>
                            <p className="mb-0 op-6 fw-normal">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem ea esse ad</p>
                        </Col>
                        <Col sm={3} xl={2} className="col-6">
                            <h6 className="fw-semibold mb-3 text-fixed-white">Product</h6>
                            <ul className="list-unstyled fw-normal landing-footer-list mb-0">
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Services</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Product Tour</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Integrations</Link>
                                </li>
                                <li>
                                    <Link to={`${import.meta.env.BASE_URL}pages/pricing`} className="text-fixed-white op-6">Pricing</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col sm={3} xl={2} className="col-6">
                            <h6 className="fw-semibold mb-3 text-fixed-white">Support</h6>
                            <ul className="list-unstyled fw-normal landing-footer-list mb-0">
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Contact Us</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Technical Support</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Documentation</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Support</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col sm={3} xl={2} className="col-6">
                            <h6 className="fw-semibold mb-3 text-fixed-white">Other</h6>
                            <ul className="list-unstyled fw-normal landing-footer-list mb-0">
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Market Place</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Social Integrations</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col sm={3} xl={2} className="col-6">
                            <h6 className="fw-semibold mb-3 text-fixed-white">About</h6>
                            <ul className="list-unstyled fw-normal landing-footer-list mb-0">
                                <li>
                                    <Link to={`${import.meta.env.BASE_URL}pages/blog/blog`} className="text-fixed-white op-6">Blog</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">About Us</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Customers</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-6">Jobs</Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </section>
            <div className="py-3 landing-payment-gateways">
                <div className="container">
                    <Row className="align-items-center justify-content-center">
                        <Col xl={7} lg={9}>
                            <div className="d-md-flex align-items-center justify-content-center">
                                <p className="mb-0 me-3 text-fixed-white op-6 fw-normal">Payments We Accept :</p>
                                <div className="d-flex align-items-center gap-2 justify-content-center flex-wrap">
                                    <div className="me-2 mb-2 mb-sm-0 payment-cards">
                                        <Link to="#!">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 64 64"><g data-name="Paypal card"><path fill="#fff" d="M47 25.23a2.91 2.91 0 0 0-1-1.1 4.63 4.63 0 0 0-1.63-.59 12.57 12.57 0 0 0-2.19-.17H38.3a1 1 0 0 0-.88.71L34.8 35.47a.56.56 0 0 0 .57.71h1.86a1 1 0 0 0 .89-.7l.63-2.77a1 1 0 0 1 .9-.7h.53a8.9 8.9 0 0 0 5.32-1.4 4.41 4.41 0 0 0 1.88-3.69 3.67 3.67 0 0 0-.38-1.69ZM43 29a4 4 0 0 1-2.35.61h-.45a.57.57 0 0 1-.57-.71l.57-2.41a1 1 0 0 1 .89-.71h.6a3 3 0 0 1 1.62.36 1.26 1.26 0 0 1 .55 1.11A2.09 2.09 0 0 1 43 29Zm19.4-5.49h-1.65A1 1 0 0 0 60 24l-.09.15-.08.37-2.38 10.61-.08.33a.53.53 0 0 0 .46.67h1.77a.93.93 0 0 0 .8-.57l.1-.14L63 24.17a.54.54 0 0 0-.58-.7ZM56 26.82a7.12 7.12 0 0 0-3.32-.59 14.22 14.22 0 0 0-2.25.18c-.56.08-.61.1-1 .17a1.08 1.08 0 0 0-.81.87l-.23.93c-.13.59.21.57.37.52a9.45 9.45 0 0 1 1.1-.32 8.23 8.23 0 0 1 1.75-.24 4.66 4.66 0 0 1 1.69.24.86.86 0 0 1 .56.84v.27l-.27.16a33.3 33.3 0 0 0-2.74.3 9 9 0 0 0-2.37.65 3.73 3.73 0 0 0-1.6 1.26 3.5 3.5 0 0 0-.52 1.94 2.33 2.33 0 0 0 .76 1.78 2.89 2.89 0 0 0 2 .66 5.12 5.12 0 0 0 1.17-.1l.9-.31.77-.42.69-.47-.06.3a.54.54 0 0 0 .49.7h1.76a1 1 0 0 0 .79-.7L57 29.59l.07-.48v-.45A2 2 0 0 0 56 26.82Zm-3 6.61-.3.39-.72.37a2.66 2.66 0 0 1-1 .21 2.19 2.19 0 0 1-1-.2l-.37-.69a1.44 1.44 0 0 1 .27-.92 1.84 1.84 0 0 1 .8-.53 6.5 6.5 0 0 1 1.22-.28c.42-.05 1.27-.15 1.37-.15l.13.23c-.04.14-.28 1.14-.4 1.57Z"></path><path fill="#fff" d="M34.86 26.37h-2.23a1.63 1.63 0 0 0-1.18.7s-2.66 4.58-2.92 5h-.31l-.83-5a1 1 0 0 0-1-.73h-1.68a.54.54 0 0 0-.55.71s1.26 7.2 1.51 8.9c.12.94 0 1.1 0 1.1L24 40c-.24.39-.11.71.29.71h1.93a1.55 1.55 0 0 0 1.16-.7l7.42-12.59s.72-1.07.06-1.05Zm-12.65.45a7 7 0 0 0-3.32-.59 14.42 14.42 0 0 0-2.26.17 8.18 8.18 0 0 0-.95.18 1.08 1.08 0 0 0-.82.86l-.22.93c-.13.6.22.58.35.52a10.88 10.88 0 0 1 1.12-.32 7.58 7.58 0 0 1 1.74-.23 4.47 4.47 0 0 1 1.7.24.83.83 0 0 1 .55.84v.26l-.27.17a27 27 0 0 0-2.74.3 8.7 8.7 0 0 0-2.36.64 3.63 3.63 0 0 0-1.6 1.27 3.38 3.38 0 0 0-.57 1.94 2.28 2.28 0 0 0 .77 1.77 2.83 2.83 0 0 0 2 .67 4.87 4.87 0 0 0 1.16-.11l.91-.31.76-.42.7-.47-.06.29a.55.55 0 0 0 .5.69H21a1 1 0 0 0 .8-.69l1.36-5.88.07-.47v-.45a2 2 0 0 0-1.02-1.8Zm-3 6.6-.3.38-.73.38a2.62 2.62 0 0 1-1 .21 2.17 2.17 0 0 1-1.06-.2l-.36-.7a1.4 1.4 0 0 1 .27-.9l.79-.54a7.54 7.54 0 0 1 1.23-.28c.42-.05 1.26-.15 1.38-.15l.12.22c.02.16-.22 1.16-.33 1.58Zm-6-8.23a2.71 2.71 0 0 0-1-1.09 4.54 4.54 0 0 0-1.62-.6 13.86 13.86 0 0 0-2.2-.17H4.53a1 1 0 0 0-.9.71L1 35.42a.55.55 0 0 0 .56.71h1.88a.94.94 0 0 0 .89-.71L5 32.66a.93.93 0 0 1 .88-.7h.52a8.88 8.88 0 0 0 5.3-1.4 4.38 4.38 0 0 0 1.9-3.69 3.42 3.42 0 0 0-.36-1.68Zm-4 3.72a3.91 3.91 0 0 1-2.35.62h-.44a.55.55 0 0 1-.56-.71l.56-2.42a1 1 0 0 1 .89-.71h.6a3 3 0 0 1 1.62.36 1.24 1.24 0 0 1 .54 1.11 2 2 0 0 1-.84 1.75Z"></path></g></svg>
                                        </Link>
                                    </div>
                                    <div className="me-2 mb-2 mb-sm-0 payment-cards">
                                        <Link to="#!">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" enableBackground="new 0 0 48 48" viewBox="0 0 48 48"><polygon fill="#fff" points="17.202 32.269 21.087 32.269 23.584 16.732 19.422 16.732"></polygon><path fill="#fff" d="M13.873 16.454l-3.607 11.098-.681-3.126c-1.942-4.717-5.272-6.659-5.272-6.659l3.456 14.224h4.162l5.827-15.538H13.873zM44.948 16.454h-4.162l-6.382 15.538h3.884l.832-2.22h4.994l.555 2.22H48L44.948 16.454zM39.954 26.997l2.22-5.826 1.11 5.826H39.954zM28.855 20.893c0-.832.555-1.665 2.497-1.665 1.387 0 2.775 1.11 2.775 1.11l.832-3.329c0 0-1.942-.832-3.607-.832-4.162 0-6.104 2.22-6.104 4.717 0 4.994 5.549 4.162 5.549 6.659 0 .555-.277 1.387-2.497 1.387s-3.884-.832-3.884-.832l-.555 3.329c0 0 1.387.832 4.162.832 2.497.277 6.382-1.942 6.382-5.272C34.405 23.113 28.855 22.836 28.855 20.893z"></path><path fill="#fff" d="M9.711,25.055l-1.387-6.936c0,0-0.555-1.387-2.22-1.387c-1.665,0-6.104,0-6.104,0
                                            S8.046,19.229,9.711,25.055z"></path></svg>
                                        </Link>
                                    </div>
                                    <div className="me-2 mb-2 mb-sm-0 payment-cards">
                                        <Link to="#!">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 24 24"><path fill="#FF5F00" d="M15.245 17.831h-6.49V6.168h6.49v11.663z"></path><path fill="#EB001B" d="M9.167 12A7.404 7.404 0 0 1 12 6.169 7.417 7.417 0 0 0 0 12a7.417 7.417 0 0 0 11.999 5.831A7.406 7.406 0 0 1 9.167 12z"></path><path fill="#F79E1B" d="M24 12a7.417 7.417 0 0 1-12 5.831c1.725-1.358 2.833-3.465 2.833-5.831S13.725 7.527 12 6.169A7.417 7.417 0 0 1 24 12z"></path></svg>
                                        </Link>
                                    </div>
                                    <div className="me-2 mb-2 mb-sm-0 payment-cards">
                                        <Link to="#!">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" enableBackground="new 0 0 24 24" viewBox="0 0 24 24"><path fill="#fff" d="M3.093,14.964c1.18,0,2.55-0.431,2.79-1.711h-1.24c-0.213,0.625-0.85,0.923-1.568,0.923c-1.035,0-1.788-0.64-1.853-1.726h4.83v1.042c0,0.387-0.02,0.848-0.04,1.235h1.18c0.025-0.238,0.04-0.49,0.04-0.728c0.506,0.61,1.33,0.923,2.2,0.923c1.407,0,2.467-0.833,2.767-2.069c-0.022,0.12-0.037,0.253-0.037,0.402c0,0.908,0.792,1.682,2.272,1.682c1,0,1.717-0.224,2.32-0.952c0,0.253,0.016,0.506,0.046,0.759h1.114c-0.03-0.313-0.04-0.654-0.04-0.997v-2.44c0-0.372-0.07-0.67-0.2-0.923l2.33,4.345l-1.07,2.024h1.346L24,9.503h-1.243l-2.055,4.093l-2.055-4.092h-1.41l0.436,0.833c-0.42-0.744-1.351-1.012-2.415-1.012c-1.186,0-2.55,0.327-2.686,1.607h1.275c0.06-0.506,0.585-0.804,1.305-0.804c0.974,0,1.53,0.356,1.53,1.234v0.134c-0.465,0-1.05,0-1.56,0.018c-1.622,0.039-2.656,0.388-2.896,1.333c0.045-0.209,0.06-0.432,0.06-0.663c0-1.936-1.488-2.832-2.828-2.832c-0.8,0-1.612,0.201-2.202,0.899V7.25h-1.2v4.876c-0.01-1.904-1.252-2.783-2.94-2.783C0.982,9.343,0,10.49,0,12.23C0,13.808,0.95,14.985,3.093,14.964z M15.193,12.313l-0.002-0.002h-0.012c0.494-0.016,1.034-0.022,1.484-0.022v0.129c0,1.115-0.675,1.8-1.935,1.8c-0.945,0-1.305-0.501-1.305-0.962C13.423,12.544,14.098,12.346,15.193,12.313z M9.116,10.165c1.125,0,1.893,0.8,1.893,2.004c0,1.204-0.766,2.004-1.876,2.004H9.131h-0.03c-1.11,0-1.875-0.8-1.875-2.004C7.226,10.964,8.006,10.165,9.116,10.165z M3.058,10.145c0.871,0,1.681,0.418,1.725,1.534h-3.54C1.364,10.615,2.114,10.145,3.058,10.145z"></path></svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="landing-main-footer py-3">
                <div className="container">
                    <Row>
                        <div></div>
                    </Row>
                    <Row>
                        <Col lg={4} className="text-lg-start text-center">
                            <span className="text-fixed-white op-7 fs-14"> © Copyright <span id="year"> 2025 </span> <Link 
                                to="https://analiticaneuronal.com/" target="_blank" className="text-primary fs-15 fw-semibold">Analítica Neuronal </Link> .Todos los derechos reservados
                            </span>
                        </Col>
                        <Col lg={8} className="text-lg-end text-center mt-lg-0 mt-1">
                            <ul className="list-unstyled fw-normal landing-footer-list mb-0">
                                <li>
                                    <Link to="#!" className="text-fixed-white op-8">Terms Of Service</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-8">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-8">Legal</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-8">Contact</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-8">Blog</Link>
                                </li>
                                <li>
                                    <Link to="#!" className="text-fixed-white op-8">Licenses</Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* <!--End:: Footer-- > */}

        </Fragment >
    )
}

export default Landing
