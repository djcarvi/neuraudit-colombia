
import React, { useEffect, useRef, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle, Form, Image, ListGroup, Modal } from 'react-bootstrap';
import { MENUITEMS } from '../sidebar/nav';
import { getState, setState } from '../services/switcherServices';
import { Link, useNavigate } from 'react-router-dom';
import logo1 from "../../../assets/images/brand-logos/logo_epsfamiliar_blanco.png";
import logo2 from "../../../assets/images/brand-logos/logo_toggle_epsfamiliar_blanco.png";
import logo3 from "../../../assets/images/brand-logos/logo_epsfamiliar_blanco.png";
import logo4 from "../../../assets/images/brand-logos/logo_toggle_epsfamiliar_blanco.png";
import face12 from "../../../assets/images/faces/12.jpg";
import SpkButton from '../../@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons';
import authService from '../../../services/neuraudit/authService';
const Header = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);

    let [variable, _setVariable] = useState(getState());

    // Fetch current user data on component mount
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // MenuClose Function

    function menuClose() {
        const theme = getState();

        if (window.innerWidth <= 992) {
            const newState = {
                toggled: "close"
            }
            setState(newState);
        }

        if (window.innerWidth >= 992) {
            const local_varaiable = theme;
            const newToggledValue = local_varaiable.toggled ? local_varaiable.toggled : '';

            setState({ toggled: newToggledValue });
        }
    }

    // Sidebar Toggle Function

    const overlayRef = useRef<HTMLDivElement | null>(null);
    const Query = (selector: any) => document.querySelector(selector)

    const toggleSidebar = () => {
        const theme = getState();
        const sidemenuType = theme.dataNavLayout;
        if (window.innerWidth >= 992) {
            if (sidemenuType === "vertical") {
                const verticalStyle = theme.dataVerticalStyle;
                const navStyle = theme.dataNavStyle;
                switch (verticalStyle) {
                    case "closed":
                        // Toggle between open/close state for "closed" vertical style
                        setState({
                            dataNavStyle: "",
                            toggled: theme.toggled === "close-menu-close" ? "" : "close-menu-close"
                        });
                        break;
                    case "overlay":
                        // Handle icon-overlay state with window width check
                        setState({
                            dataNavStyle: "",
                            toggled: theme.toggled === "icon-overlay-close" ? "" : "icon-overlay-close",
                            iconOverlay: ""
                        });

                        if (theme.toggled !== "icon-overlay-close" && window.innerWidth >= 992) {
                            setState({
                                toggled: "icon-overlay-close",
                                iconOverlay: "",
                            });
                        }
                        break;
                    case "icontext":
                        // Handle icon-text state
                        setState({
                            dataNavStyle: "",
                            toggled: theme.toggled === "icon-text-close" ? "" : "icon-text-close"
                        });
                        break;
                    case "doublemenu":
                        // Handle double menu state
                        setState({ dataNavStyle: "" });
                        if (theme.toggled === "double-menu-open") {
                            setState({ toggled: "double-menu-close" });
                        } else {
                            // Toggle the active double menu item
                            const sidemenu = Query(".side-menu__item.active");
                            if (sidemenu) {
                                setState({ toggled: "double-menu-open" });
                                if (sidemenu.nextElementSibling) {
                                    sidemenu.nextElementSibling.classList.add("double-menu-active");
                                } else {
                                    setState({ toggled: "double-menu-close" });
                                }
                            }
                        }
                        break;
                    case "detached":
                        // Handle detached menu state
                        setState({
                            toggled: theme.toggled === "detached-close" ? "" : "detached-close",
                            iconOverlay: ""
                        });
                        break;
                    default:
                        // Handle default menu toggle
                        setState({ 
                            toggled: theme.toggled === "icon-overlay-close" ? "" : "icon-overlay-close" 
                        });
                        break;
                }

                // Handle navStyle changes
                switch (navStyle) {
                    case "menu-click":
                        setState({
                            toggled: theme.toggled === "menu-click-closed" ? "" : "menu-click-closed"
                        });
                        break;
                    case "menu-hover":
                        setState({
                            toggled: theme.toggled === "menu-hover-closed" ? "" : "menu-hover-closed"
                        });
                        break;
                    case "icon-click":
                        setState({
                            toggled: theme.toggled === "icon-click-closed" ? "" : "icon-click-closed"
                        });
                        break;
                    case "icon-hover":
                        setState({
                            toggled: theme.toggled === "icon-hover-closed" ? "" : "icon-hover-closed"
                        });
                        break;
                }
            }
        } else {
            // For mobile view (screen width < 992px)
            if (theme.toggled === "close") {
                setState({ toggled: "open" });

                setTimeout(() => {
                    if (theme.toggled === "open") {
                        const overlay = overlayRef.current
                        if (overlay) {
                            overlay.classList.add("active");
                            overlay.addEventListener("click", () => {
                                const overlay = overlayRef.current
                                if (overlay) {
                                    overlay.classList.remove("active");
                                    menuClose();
                                }
                            });
                        }
                    }
                    window.addEventListener("resize", () => {
                        if (window.innerWidth >= 992) {
                            const overlay = Query("#responsive-overlay");
                            if (overlay) {
                                overlay.classList.remove("active");
                            }
                        }
                    });
                }, 100);
            } else {
                setState({ toggled: "close" });
            }
        }
    };
    // Fullscreen Function

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };
    useEffect(() => {
        const fullscreenChangeHandler = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", fullscreenChangeHandler);
        return () => {
            document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
        };
    }, []);

    // Theme Toggle Function

    const toggleTheme = () => {
        const currentTheme = getState();
        const newState = {
          dataThemeMode: currentTheme.dataThemeMode === 'dark' ? 'light' : 'dark',
          dataHeaderStyles: currentTheme.dataThemeMode === 'transparent' ? 'light' : 'transparent',
          dataMenuStyles: currentTheme.dataThemeMode === 'transparent' ? 'light' : 'transparent',
        }
        setState(newState)
        if (newState.dataThemeMode != 'dark') {
          const newState = {
            bodyBg: '',
            lightRgb: '',
            bodyBg2: '',
            inputBorder: '',
            formControlBg: '',
            gray: '',
          }
          setState(newState)
          localStorage.setItem("vyzorlightTheme", "light");
          localStorage.removeItem("vyzordarkTheme");
          localStorage.removeItem("vyzormenu");
          localStorage.removeItem("vyzorheader");
          localStorage.removeItem("bodyBg");
          localStorage.removeItem("bodyBg2");
          localStorage.removeItem("bgImg");
        }
        else {
          localStorage.setItem("vyzordarkTheme", "dark");
          localStorage.removeItem("vyzorlightTheme");
          localStorage.removeItem("vyzormenu");
          localStorage.removeItem("vyzorheader");
          localStorage.removeItem("bodyBg");
          localStorage.removeItem("bodyBg2");
          localStorage.removeItem("inputBorder");
          localStorage.removeItem("lightRgb");
          localStorage.removeItem("formControlBg");
          localStorage.removeItem("gray");
        }
      }

    // Logout Function
    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error durante logout:', error);
            // Force logout even if backend fails
            authService.clearAuthData();
            navigate('/');
        }
    };


    //Search Functionality

    const searchRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: MouseEvent) => {
        const searchInput = searchRef.current;
        const container = containerRef.current;

        if (searchInput && container && !searchInput.contains(event.target as Node) && !container.contains(event.target as Node)) {
            container.classList.remove("searchdrop");
        } else if (searchInput && container && (searchInput === event.target || searchInput.contains(event.target as Node))) {
            container.classList.add("searchdrop");
        }
    };

    useEffect(() => {
        document.body.addEventListener("click", handleClick);

        return () => {
            document.body.removeEventListener("click", handleClick);
        };
    }, []);

    const searchResultRef = useRef<HTMLDivElement | null>(null);
    const [showa, setShowa] = useState(false);
    const [InputValue, setInputValue] = useState("");
    const [show2, setShow2] = useState(false);
    const [searchcolor, setsearchcolor] = useState("text-dark");
    const [searchval, setsearchval] = useState("Type something");
    const [NavData, setNavData] = useState([]);

    useEffect(() => {
        const clickHandler = (event: any) => {
            if (searchResultRef.current && !searchResultRef.current.contains(event.target)) {
                searchResultRef.current.classList.add("d-none");
            }
        };

        document.addEventListener("click", clickHandler);

        return () => {
            document.removeEventListener("click", clickHandler);
        };
    }, []);

    const myfunction = (inputvalue: string) => {

        if (searchResultRef.current) {
            searchResultRef.current.classList.remove("d-none");
        }

        const i: any = [];
        const allElement2: any = [];
        MENUITEMS.forEach((mainLevel: any) => {
            if (mainLevel.children) {
                setShowa(true);
                mainLevel.children.forEach((subLevel: any) => {
                    i.push(subLevel);
                    if (subLevel.children) {
                        subLevel.children.forEach((subLevel1: any) => {
                            i.push(subLevel1);
                            if (subLevel1.children) {
                                subLevel1.children.forEach((subLevel2: any) => {
                                    i.push(subLevel2);
                                });
                            }
                        });
                    }
                });
            }
        });
        for (const allElement of i) {
            if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
                if (
                    allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
                ) {
                    setShow2(true);
                    if (
                        allElement.path &&
                        !allElement2.some((el: any) => el.title === allElement.title)
                    ) {
                        allElement2.push(allElement);
                    }
                }
            }
        }

        if (!allElement2.length || inputvalue === "") {
            if (inputvalue === "") {
                setShow2(false);
                setsearchval("Type something");
                setsearchcolor("text-dark");
            }
            if (!allElement2.length) {
                setShow2(false);
                setsearchcolor("text-danger");
                setsearchval("There is no component with this name");
            }
        }
        setNavData(allElement2);
    };

    //Responsive Search
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);


    useEffect(() => {
        const navbar = document?.querySelector(".app-header");
        const navbar1 = document?.querySelector(".app-sidebar");
        const sticky: any = navbar?.clientHeight;
        // const sticky1 = navbar1.clientHeight;

        function stickyFn() {
            if (window.pageYOffset >= sticky) {
                navbar?.classList.add("sticky-pin");
                navbar1?.classList.add("sticky-pin");
            } else {
                navbar?.classList.remove("sticky-pin");
                navbar1?.classList.remove("sticky-pin");
            }
        }

        window.addEventListener("scroll", stickyFn);
        window.addEventListener("DOMContentLoaded", stickyFn);

        // Cleanup event listeners when the component unmounts
        return () => {
            window.removeEventListener("scroll", stickyFn);
            window.removeEventListener("DOMContentLoaded", stickyFn);
        };
    }, []);

    return (
        <div>
            <header className="app-header sticky" id="header">

                {/* <!-- Start::main-header-container --> */}

                <div className="main-header-container container-fluid">

                    {variable.toggled === "open" && (
                        <div ref={overlayRef} id="responsive-overlay"></div>
                    )}

                    {/* <!-- Start::header-content-left --> */}

                    <div className="header-content-left">

                        {/* <!-- Start::header-element --> */}

                        <div className="header-element">
                            <div className="horizontal-logo">
                                <Link to={`${import.meta.env.BASE_URL}dashboards/sales/`} className="header-logo">
                                    <Image src={logo1} alt="logo" className="desktop-logo" />
                                    <Image src={logo2} alt="logo" className="toggle-dark" />
                                    <Image src={logo3} alt="logo" className="desktop-dark" />
                                    <Image src={logo4} alt="logo" className="toggle-logo" /> </Link>
                            </div>
                        </div>

                        {/* <!-- End::header-element --> */}

                        {/* <!-- Start::header-element --> */}

                        <div className="header-element mx-lg-0 mx-2">
                            <Link aria-label="Hide Sidebar" onClick={toggleSidebar} className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle" data-bs-toggle="sidebar" to="#!"><span></span></Link>
                        </div>

                        {/* <!-- End::header-element --> */}

                        <div ref={containerRef} className="header-element header-search d-md-block d-none my-auto auto-complete-search">

                            {/* <!-- Start::header-link --> */}

                            <div className='autoComplete_wrapper'>

                                <input type="text" className="header-search-bar form-control" onClick={() => { }} ref={searchRef} defaultValue={InputValue} onChange={(ele => { myfunction(ele.target.value); setInputValue(ele.target.value); })} id="header-search" placeholder="Search" spellCheck={false} autoComplete="off" autoCapitalize="off" />
                            </div>
                            <Link to="#!;" className="header-search-icon border-0">
                                <i className="bi bi-search fs-12"></i>
                            </Link>
                            {showa ?
                                <div className="card custom-card search-result position-absolute z-index-9 search-fix  border" ref={searchResultRef}>
                                    <div className="card-header p-2">
                                        <div className="card-title mb-0 text-break">Search result of {InputValue}</div>
                                    </div>
                                    <div className='card-body overflow-auto p-2'>
                                        <ListGroup className='m-2 header-searchdropdown'>
                                            {show2 ?
                                                NavData.map((e: any) =>
                                                    <ListGroup.Item key={Math.random()} className="">
                                                        <Link to={`${e.path}/`} className='search-result-item' onClick={() => { setShowa(false), setInputValue(""); }}>{e.title}</Link>
                                                    </ListGroup.Item>
                                                )
                                                : <b className={`${searchcolor} `}>{searchval}</b>}
                                        </ListGroup>
                                    </div>
                                </div>
                                : ""}

                            {/* <!-- End::header-link --> */}

                        </div>

                    </div>

                    {/* <!-- End::header-content-left --> */}

                    {/* <!-- Start::header-content-right --> */}

                    <ul className="header-content-right">

                        {/* <!-- Start::header-element --> */}

                        <li className="header-element d-md-none d-block">
                            <Link to="#!" className="header-link" onClick={handleShow1} data-bs-toggle="modal" data-bs-target="#header-responsive-search">

                                {/* <!-- Start::header-link-icon --> */}

                                <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="112" cy="112" r="80" opacity="0.2" /><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>

                                {/* <!-- End::header-link-icon --> */}

                            </Link>
                        </li>

                        {/* <!-- End::header-element --> */}


                        {/* <!-- Start::header-element --> */}

                        <li className="header-element header-theme-mode">

                            {/* <!-- Start::header-link|layout-setting --> */}

                            <Link to="#!" className="header-link layout-setting" onClick={toggleTheme}>
                                <span className="light-layout">

                                    {/* <!-- Start::header-link-icon --> */}

                                    <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" opacity="0.2" /><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>

                                    {/* <!-- End::header-link-icon --> */}

                                </span>
                                <span className="dark-layout">

                                    {/* <!-- Start::header-link-icon --> */}

                                    <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="56" opacity="0.2" /><line x1="128" y1="40" x2="128" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="64" y1="64" x2="56" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="64" y1="192" x2="56" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="192" y1="64" x2="200" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="192" y1="192" x2="200" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="40" y1="128" x2="32" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="128" y1="216" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="216" y1="128" x2="224" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>

                                    {/* <!-- End::header-link-icon --> */}

                                </span>
                            </Link>

                            {/* <!-- End::header-link|layout-setting --> */}

                        </li>

                        {/* <!-- End::header-element --> */}



                        {/* <!-- Start::header-element --> */}

                        <li className="header-element header-fullscreen">

                            {/* <!-- Start::header-link --> */}

                            <Link to="#!" className="header-link" onClick={toggleFullscreen}>
                                {isFullscreen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="full-screen-close header-link-icon d-block" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="32" y="32" width="192" height="192" rx="16" opacity="0.2"></rect><polyline points="160 48 208 48 208 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="208" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><polyline points="96 208 48 208 48 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="112" y1="144" x2="48" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="full-screen-open header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="48" y="48" width="160" height="160" opacity="0.2"></rect><polyline points="168 48 208 48 208 88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><polyline points="88 208 48 208 48 168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><polyline points="208 168 208 208 168 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><polyline points="48 88 48 48 88 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                                )}
                            </Link>

                            {/* <!-- End::header-link --> */}

                        </li>

                        {/* <!-- End::header-element --> */}

                        {/* <!-- Start::header-element --> */}

                        <Dropdown className="header-element dropdown">

                            {/* <!-- Start::header-link|dropdown-toggle --> */}

                            <Dropdown.Toggle as="a" variant=''  className="header-link dropdown-toggle" id="mainHeaderProfile" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                <div>
                                    <Image src={face12} alt="img" className="header-link-icon" />
                                </div>
                            </Dropdown.Toggle>

                            {/* <!-- End::header-link|dropdown-toggle --> */}

                            <Dropdown.Menu className="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end" aria-labelledby="mainHeaderProfile" style={{ minWidth: currentUser?.email ? Math.max(280, currentUser.email.length * 8) + 'px' : '280px' }}>
                                <div className="p-3 bg-primary text-fixed-white">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="mb-0 fs-16">Perfil</p>
                                        <Link to="#!" className="text-fixed-white"><i className="ti ti-settings-cog"></i></Link>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="p-3">
                                    <div className="d-flex align-items-start gap-2">
                                        <div className="lh-1">
                                            <span className="avatar avatar-sm bg-primary-transparent avatar-rounded">
                                                <Image src={face12} alt="" />
                                            </span>
                                        </div>
                                        <div className="text-truncate">
                                            <span className="d-block fw-semibold lh-1">{currentUser?.fullName || currentUser?.username || 'Usuario'}</span>
                                            <span className="d-block text-muted fs-12">{currentUser?.email || ''}</span>
                                            {currentUser && (
                                                <span className="d-block text-muted fs-11">
                                                    {currentUser.userType === 'pss' ? currentUser.pssName : 'EPS Familiar de Colombia'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <ul className="list-unstyled mb-0 sub-list">
                                            <li>
                                                <Link className="dropdown-item d-flex align-items-center" to={`${import.meta.env.BASE_URL}pages/profile`}><i className="ti ti-user-circle me-2 fs-18"></i>Mi Perfil</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item d-flex align-items-center" to={`${import.meta.env.BASE_URL}pages/profile-settings`}><i className="ti ti-settings-cog me-2 fs-18"></i>Configuración</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul className="list-unstyled mb-0 sub-list">
                                            <li>
                                                <Link className="dropdown-item d-flex align-items-center" to={`${import.meta.env.BASE_URL}pages/faqs/`}><i className="ti ti-lifebuoy me-2 fs-18"></i>Soporte</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item d-flex align-items-center" to={`${import.meta.env.BASE_URL}pages/timeline/`}><i className="ti ti-bolt me-2 fs-18"></i>Registro de Actividad</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item d-flex align-items-center" to={`${import.meta.env.BASE_URL}applications/full-calendar/`}><i className="ti ti-calendar me-2 fs-18"></i>Eventos</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link 
                                            className="dropdown-item d-flex align-items-center" 
                                            to="#!"
                                            onClick={handleLogout}
                                        >
                                            <i className="ti ti-logout me-2 fs-18"></i>Cerrar Sesión
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* <!-- End::header-element --> */}


                    </ul>

                    {/* <!-- End::header-content-right --> */}

                </div>

                {/* <!-- End::main-header-container --> */}

            </header>
            <Modal show={show1} onHide={handleClose1} className="fade" id="header-responsive-search" tabIndex={-1} aria-labelledby="header-responsive-search">
                {/* <div className="modal-content"> */}
                    <Modal.Body>
                        <div className="input-group">
                            <Form.Control type="text" className="border-end-0" placeholder="Search Anything ..."
                                aria-label="Search Anything ..." aria-describedby="button-addon2" />
                            <SpkButton Buttonvariant='primary' Buttontype="button"
                                Id="button-addon2"><i className="bi bi-search"></i></SpkButton>
                        </div>
                    </Modal.Body>
                {/* </div> */}
            </Modal>
        </div>
    )
}

export default Header
