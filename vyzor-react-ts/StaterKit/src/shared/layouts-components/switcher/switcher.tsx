
import { Fragment, useContext, useEffect, useState } from 'react'
import { Col, Form, Nav, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap'
import { data$, getState } from '../services/switcherServices'
import { Link } from 'react-router-dom'
import SpkButton from '../../@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons'
import SpkTooltips from '../../@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips'
import { ClosedMenu, DefaultMenu, DetachedFn, DoubletFn, iconOverlayFn, IconText, Reset, ThemeBackgroundColor, ThemePrimaryColor, setBgImage, setDirection, setPageStyle, setLayout, setMenuPosition, setHeaderPosition, setMenuStyle, setHeaderStyle, setPrimaryColor, updateTheme, updateLayout, updateNavStyle, updateBackgroundColor, LocalStorageBackup } from '../../data/switcherdata/switcherdata'
import { Initialload } from '../../../contextapi'

const Switcher = ({ show, handleClose }: any) => {

    let [variable, setVariable] = useState(getState());
    useEffect(() => {
        const subscription = data$.subscribe((e) => {
            setVariable(e);
        });

        return () => subscription.unsubscribe();
    }, []);
    const theme: any = useContext(Initialload);

    useEffect(() => {
        if (!theme.pageloading) {
          LocalStorageBackup(theme.setpageloading);
        }
      }, []);

    return (
        <Fragment>
            {/* <!-- Start Switcher --> */}
            <TabContainer defaultActiveKey={0}>
                <Offcanvas className="offcanvas-end" placement='end' show={show} onHide={handleClose} tabIndex="-1" id="switcher-canvas" aria-labelledby="offcanvasRightLabel">
                    <OffcanvasHeader className="border-bottom d-block p-0">
                        <div className="d-flex align-items-center justify-content-between p-3">
                            <OffcanvasTitle className="text-default" id="offcanvasRightLabel">Switcher</OffcanvasTitle>
                            <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn-close" onClickfunc={handleClose} data-bs-dismiss="offcanvas" aria-label="Close"></SpkButton>
                        </div>
                        <nav className="border-top border-block-start-dashed">
                            <Nav className="nav-tabs nav-justified" id="switcher-main-tab" role="tablist">
                                <Nav.Link as='button' eventKey={0} id="switcher-home-tab" data-bs-toggle="tab"
                                    data-bs-target="#switcher-home" type="button" role="tab" aria-controls="switcher-home"
                                    aria-selected="true">Theme Styles</Nav.Link>
                                <Nav.Link as='button' eventKey={1} id="switcher-profile-tab" data-bs-toggle="tab"
                                    data-bs-target="#switcher-profile" type="button" role="tab" aria-controls="switcher-profile"
                                    aria-selected="false">Theme Colors</Nav.Link>
                            </Nav>
                        </nav>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <TabContent id="nav-tabContent">
                            <TabPane eventKey={0} className="fade border-0 p-0 " id="switcher-home" role="tabpanel"
                                aria-labelledby="switcher-home-tab" tabIndex={0}>
                                <div className="">
                                    <p className="switcher-style-head">Theme Color Mode:</p>
                                    <Row className="switcher-style gx-0">
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-light-theme">
                                                    Light
                                                </Form.Check.Label>
                                                <Form.Check.Input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="theme-style"
                                                    id="switcher-light-theme"
                                                    checked={variable.dataThemeMode === 'light'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateTheme('light', 'clicked')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-dark-theme">
                                                    Dark
                                                </Form.Check.Label>
                                                <Form.Check.Input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="theme-style"
                                                    id="switcher-dark-theme"
                                                    checked={variable.dataThemeMode === 'dark'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateTheme('dark', 'clicked')}
                                                />
                                            </Form.Check>
                                        </Col>

                                    </Row>
                                </div>
                                <div className="">
                                    <p className="switcher-style-head">Directions:</p>
                                    <Row className="switcher-style gx-0">
                                        <Col className="col-4" >
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-ltr">
                                                    LTR
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="direction" id="switcher-ltr"
                                                    checked={variable.dir === 'ltr'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setDirection('ltr')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4" >
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-rtl">
                                                    RTL
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="direction" id="switcher-rtl"
                                                    checked={variable.dir === 'rtl'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setDirection('rtl')}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="">
                                    <p className="switcher-style-head">Navigation Styles:</p>
                                    <Row className="row switcher-style gx-0">
                                        <Col className="col-4" >
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-vertical">
                                                    Vertical
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="navigation-style"
                                                    id="switcher-vertical"
                                                    checked={variable.dataNavLayout === 'vertical'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateLayout('vertical')}

                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-horizontal">
                                                    Horizontal
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="navigation-style"
                                                    id="switcher-horizontal"
                                                    checked={variable.dataNavLayout === 'horizontal'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateLayout('horizontal')} />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="navigation-menu-styles">
                                    <p className="switcher-style-head">Vertical & Horizontal Menu Styles:</p>
                                    <Row className="row switcher-style gx-0 pb-2 gy-2">
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-menu-click">
                                                    Menu Click
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                    id="switcher-menu-click"
                                                    checked={variable.dataNavStyle === 'menu-click'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateNavStyle('menu-click', 'menu-click-closed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-menu-hover">
                                                    Menu Hover
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                    id="switcher-menu-hover"
                                                    checked={variable.dataNavStyle === 'menu-hover'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateNavStyle('menu-hover', 'menu-hover-closed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-icon-click">
                                                    Icon Click
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                    id="switcher-icon-click"
                                                    checked={variable.dataNavStyle === 'icon-click'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateNavStyle('icon-click', 'icon-click-closed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-icon-hover">
                                                    Icon Hover
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                    id="switcher-icon-hover"
                                                    checked={variable.dataNavStyle === 'icon-hover'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => updateNavStyle('icon-hover', 'icon-hover-closed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="sidemenu-layout-styles">
                                    <p className="switcher-style-head">Sidemenu Layout Styles:</p>
                                    <Row className="row switcher-style gx-0 pb-2 gy-2">
                                        <Col sm={6} className="col-sm-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-default-menu">
                                                    Default Menu
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-default-menu"
                                                    defaultChecked
                                                    onChange={(_e) => { }}
                                                    onClick={DefaultMenu}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col sm={6} className="col-sm-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-closed-menu">
                                                    Closed Menu
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-closed-menu"
                                                    checked={variable.dataVerticalStyle === 'closed'}
                                                    onChange={(_e) => { }}
                                                    onClick={ClosedMenu}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col sm={6} className="col-sm-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-icontext-menu">
                                                    Icon Text
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-icontext-menu"
                                                    checked={variable.toggled === 'icon-text-close'}
                                                    onChange={(_e) => { }}
                                                    onClick={IconText}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col sm={6} className="col-sm-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-icon-overlay">
                                                    Icon Overlay
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-icon-overlay"
                                                    checked={variable.toggled === 'icon-overlay-close'}
                                                    onChange={(_e) => { }}
                                                    onClick={iconOverlayFn}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col sm={6} className="col-sm-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-detached">
                                                    Detached
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-detached"
                                                    checked={variable.toggled === 'detached-close'}
                                                    onChange={(_e) => { }}
                                                    onClick={DetachedFn}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col sm={6} className="col-sm-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-double-menu">
                                                    Double Menu
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-double-menu"
                                                    checked={variable.dataVerticalStyle === 'doublemenu'}
                                                    onChange={(_e) => { }}
                                                    onClick={DoubletFn}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="">
                                    <p className="switcher-style-head">Page Styles:</p>
                                    <Row className="row switcher-style gx-0 ">
                                        <Col  xl={3}  className=" col-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-regular">
                                                    Regular
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="page-styles" id="switcher-regular"
                                                    checked={variable.dataPageStyle === 'regular'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setPageStyle('regular')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col xl={3} className=" col-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-classic">
                                                    Classic
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="page-styles" id="switcher-classic"
                                                    checked={variable.dataPageStyle === 'classic'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setPageStyle('classic')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col  xl={3} className=" col-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-modern">
                                                    Modern
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="page-styles" id="switcher-modern"
                                                    checked={variable.dataPageStyle === 'modern'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setPageStyle('modern')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col  xl={3}  className=" col-6">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-flat">
                                                    Flat
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="page-styles" id="switcher-flat"
                                                     checked={variable.dataPageStyle === 'flat'}
                                                    defaultChecked
                                                    onChange={(_e) => { }}
                                                    onClick={() => setPageStyle('flat')}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="">
                                    <p className="switcher-style-head">Layout Width Styles:</p>
                                    <Row className="row switcher-style gx-0">
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-default-width">
                                                    Default
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="layout-width"
                                                    id="switcher-default-width"
                                                    checked={variable.dataWidth === 'default'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setLayout('default')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-5">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-full-width">
                                                    Full Width
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="layout-width"
                                                    id="switcher-full-width"
                                                    checked={variable.dataWidth === 'fullwidth'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setLayout('fullwidth')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-3">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-boxed">
                                                    Boxed
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="layout-width" id="switcher-boxed"
                                                    checked={variable.dataWidth === 'boxed'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setLayout('boxed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="">
                                    <p className="switcher-style-head">Menu Positions:</p>
                                    <Row className="row switcher-style gx-0">
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-menu-fixed">
                                                    Fixed
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="menu-positions"
                                                    id="switcher-menu-fixed"
                                                    checked={variable.dataMenuPosition === 'fixed'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setMenuPosition('fixed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-menu-scroll">
                                                    Scrollable
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="menu-positions"
                                                    id="switcher-menu-scroll"
                                                    checked={variable.dataMenuPosition === 'scrollable'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setMenuPosition('scrollable')}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="">
                                    <p className="switcher-style-head">Header Positions:</p>
                                    <Row className="row switcher-style gx-0">
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-header-fixed">
                                                    Fixed
                                                </Form.Check.Label>
                                                <Form.Check.Input className="form-check-input" type="radio" name="header-positions"
                                                    id="switcher-header-fixed"
                                                    checked={variable.dataHeaderPosition === 'fixed'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setHeaderPosition('fixed')}
                                                />
                                            </Form.Check>
                                        </Col>
                                        <Col className="col-4">
                                            <Form.Check className="form-check switch-select">
                                                <Form.Check.Label className="form-check-label" htmlFor="switcher-header-scroll">
                                                    Scrollable
                                                </Form.Check.Label>
                                                < Form.Check.Input className="form-check-input" type="radio" name="header-positions"
                                                    id="switcher-header-scroll"
                                                    checked={variable.dataHeaderPosition === 'scrollable'}
                                                    onChange={(_e) => { }}
                                                    onClick={() => setHeaderPosition('scrollable')}
                                                />
                                            </Form.Check>
                                        </Col>
                                    </Row>
                                </div>
                            </TabPane>
                            <TabPane eventKey={1} className="fade border-0 p-0" id="switcher-profile" role="tabpanel"
                                aria-labelledby="switcher-profile-tab" tabIndex={1}>
                                <div>
                                    <div className="theme-colors">
                                        <p className="switcher-style-head">Menu Colors:</p>
                                        <div className="d-flex switcher-style pb-2">
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Light Menu'>
                                                    <Form.Check.Input className="form-check-input color-input color-white" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" title="Light Menu" type="radio" name="menu-colors"
                                                        id="switcher-menu-light"
                                                        checked={variable.dataMenuStyles === 'light'}
                                                        onChange={(_e) => { }}
                                                        onClick={() => setMenuStyle('light',)}
                                                    />
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Dark Menu' >
                                                    <Form.Check.Input className="form-check-input color-input color-dark" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" title="Dark Menu" type="radio" name="menu-colors"
                                                        id="switcher-menu-dark"
                                                        checked={variable.dataMenuStyles === 'dark'}
                                                        onChange={(_e) => { }}
                                                        onClick={() => setMenuStyle('dark')}
                                                    />
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Color Menu' >
                                                    <Form.Check.Input className="form-check-input color-input color-primary" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" title="Color Menu" type="radio" name="menu-colors"
                                                        id="switcher-menu-primary"
                                                        checked={variable.dataMenuStyles === 'color'}
                                                        onChange={(_e) => { }}
                                                        onClick={() => setMenuStyle('color')}
                                                    />
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Gradient Menu' >
                                                    <Form.Check.Input className="form-check-input color-input color-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Gradient Menu" type="radio" name="menu-colors" id="switcher-menu-gradient" checked={variable.dataMenuStyles === 'gradient'} onChange={(_e) => { }} onClick={() => setMenuStyle('gradient')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Transparent Menu' >
                                                    <Form.Check.Input className="form-check-input color-input color-transparent" data-bs-toggle="tooltip" data-bs-placement="top" title="Transparent Menu" type="radio" name="menu-colors" id="switcher-menu-transparent" checked={variable.dataMenuStyles === 'transparent'} onChange={(_e) => { }} onClick={() => setMenuStyle('transparent')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                        </div>
                                        <div className="px-4 pb-3 text-muted fs-11">Note:If you want to change color Menu dynamically change
                                            from below Theme Primary color picker</div>
                                    </div>
                                    <div className="theme-colors">
                                        <p className="switcher-style-head">Header Colors:</p>
                                        <div className="d-flex switcher-style pb-2">
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Light Header'>
                                                    <Form.Check.Input className="form-check-input color-input color-white" data-bs-toggle="tooltip" data-bs-placement="top"         title="Light Header" type="radio" name="header-colors" id="switcher-header-light" checked={variable.dataHeaderStyles === 'light'} onChange={(_e) => { }} onClick={() => setHeaderStyle('light')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Dark Header'>
                                                    <Form.Check.Input className="form-check-input color-input color-dark" data-bs-toggle="tooltip" data-bs-placement="top" title="Dark Header" type="radio" name="header-colors" id="switcher-header-dark" checked={variable.dataHeaderStyles === 'dark'}
                                                    onChange={(_e) => { }} onClick={() => setHeaderStyle('dark')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Color Header' >
                                                    <Form.Check.Input className="form-check-input color-input color-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Color Header" type="radio" name="header-colors" id="switcher-header-primary" checked={variable.dataHeaderStyles === 'color'} onChange={(_e) => { }} onClick={() => setHeaderStyle('color')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Gradient Header'>
                                                    <Form.Check.Input className="form-check-input color-input color-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Gradient Header" type="radio" name="header-colors" id="switcher-header-gradient" checked={variable.dataHeaderStyles === 'gradient'} onChange={(_e) => { }} onClick={() => setHeaderStyle('gradient')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <SpkTooltips placement='top' title='Transparent Header' >
                                                    <Form.Check.Input className="form-check-input color-input color-transparent" data-bs-toggle="tooltip" data-bs-placement="top" title="Transparent Header" type="radio" name="header-colors" id="switcher-header-transparent" checked={variable.dataHeaderStyles === 'transparent'} onChange={(_e) => { }} onClick={() => setHeaderStyle('transparent')}/>
                                                </SpkTooltips>
                                            </Form.Check>
                                        </div>
                                        <div className="px-4 pb-3 text-muted fs-11">Note:If you want to change color Header dynamically
                                            change from below Theme Primary color picker</div>
                                    </div>
                                    <div className="theme-colors">
                                        <p className="switcher-style-head">Theme Primary:</p>
                                        <div className="d-flex flex-wrap align-items-center switcher-style">
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-1" type="radio" name="theme-primary" id="switcher-primary"
                                                 checked={variable.colorPrimaryRgb === ' 42 ,16, 164'} onChange={(_e) => { }} onClick={() => setPrimaryColor(' 42 ,16, 164')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-2" type="radio" name="theme-primary" id="switcher-primary1"
                                                 checked={variable.colorPrimaryRgb === '125 ,0, 189'} onChange={(_e) => { }} onClick={() => setPrimaryColor('125 ,0, 189')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-3" type="radio" name="theme-primary" id="switcher-primary2"
                                                 checked={variable.colorPrimaryRgb === '4, 118, 141'} onChange={(_e) => { }} onClick={() => setPrimaryColor('4, 118, 141')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-4" type="radio" name="theme-primary" id="switcher-primary3"
                                                 checked={variable.colorPrimaryRgb === '138, 0, 32'} onChange={(_e) => { }} onClick={() => setPrimaryColor('138, 0, 32')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-5" type="radio" name="theme-primary" id="switcher-primary4"
                                                 checked={variable.colorPrimaryRgb === '9 ,124, 103'} onChange={(_e) => { }} onClick={() => setPrimaryColor('9 ,124, 103')} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select ps-0 mt-1 color-primary-light">
                                                <div className="theme-container-primary">
                                                    <SpkButton Customclass="">nano</SpkButton>
                                                </div>
                                                <div className="pickr-container-primary"  >
                                                    <div className='pickr'>
                                                        <SpkButton Customclass='pcr-button btn-primary' onClickfunc={(ele: any) => {
                                                            if (ele.target.querySelector("input")) {
                                                                ele.target.querySelector("input").click();
                                                            }
                                                        }}>
                                                            <ThemePrimaryColor />
                                                        </SpkButton>
                                                    </div>
                                                </div>
                                            </Form.Check>
                                        </div>
                                    </div>
                                    <div className="theme-colors">
                                        <p className="switcher-style-head">Theme Background:</p>
                                        <div className="d-flex flex-wrap align-items-center switcher-style">
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-bg-1" type="radio" name="theme-background" id="switcher-background"
                                                 checked={variable.bodyBg === '0,8,52'} onChange={(_e) => { }} onClick={() => updateBackgroundColor('0,8,52', ' 14,22,66','clicked')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-bg-2" type="radio" name="theme-background" id="switcher-background1"
                                                checked={variable.bodyBg === '58, 0, 109'} onChange={(_e) => { }} onClick={() => updateBackgroundColor('58, 0, 109', '72 ,14, 123','clicked')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-bg-3" type="radio" name="theme-background" id="switcher-background2"
                                                checked={variable.bodyBg === '0 ,59, 70'} onChange={(_e) => { }} onClick={() => updateBackgroundColor('0 ,59, 70', '14, 73, 84','clicked')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-bg-4" type="radio" name="theme-background" id="switcher-background3"
                                                    checked={variable.bodyBg === ' 65, 0, 0'} onChange={(_e) => { }} onClick={() => updateBackgroundColor(' 65, 0, 0', '79 ,14, 14','clicked')} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-bg-5" type="radio" name="theme-background" id="switcher-background4"
                                                    checked={variable.bodyBg === '1 ,77, 46'} onChange={(_e) => { }} onClick={() => updateBackgroundColor('1 ,77, 46', '15 ,91, 60','clicked')} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select ps-0 mt-1 tooltip-static-demo color-bg-transparent">
                                                <div className="theme-container-background">
                                                    <SpkButton>nano</SpkButton>
                                                </div>
                                                <div className="pickr-container-background">
                                                    <div className='pickr'>
                                                        <SpkButton Customclass='pcr-button btn-primary' onClickfunc={(ele: any) => {
                                                            if (ele.target.querySelector("input")) {
                                                                ele.target.querySelector("input").click();
                                                            }
                                                        }}>
                                                            <ThemeBackgroundColor />
                                                        </SpkButton>

                                                    </div>
                                                </div>
                                            </Form.Check>
                                        </div>
                                    </div>
                                    <div className="menu-image mb-3">
                                        <p className="switcher-style-head">Menu With Background Image:</p>
                                        <div className="d-flex flex-wrap align-items-center switcher-style">
                                            <Form.Check className="form-check switch-select m-2">
                                                <Form.Check.Input className="form-check-input bgimage-input bg-img1" type="radio" name="menu-background" id="switcher-bg-img" checked={variable.bgImg === 'bgimg1'} onChange={(_e) => { }} onClick={() => setBgImage(1)} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select m-2">
                                                <Form.Check.Input className="form-check-input bgimage-input bg-img2" type="radio" name="menu-background" id="switcher-bg-img1" checked={variable.bgImg === 'bgimg2'} onChange={(_e) => { }} onClick={() => setBgImage(2)} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select m-2">
                                                <Form.Check.Input className="form-check-input bgimage-input bg-img3" type="radio" name="menu-background" id="switcher-bg-img2" checked={variable.bgImg === 'bgimg3'} onChange={(_e) => { }} onClick={() => setBgImage(3)} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select m-2">
                                                <Form.Check.Input className="form-check-input bgimage-input bg-img4" type="radio" name="menu-background" id="switcher-bg-img3" checked={variable.bgImg === 'bgimg4'} onChange={(_e) => { }} onClick={() => setBgImage(4)} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select m-2">
                                                <Form.Check.Input className="form-check-input bgimage-input bg-img5" type="radio" name="menu-background" id="switcher-bg-img4" checked={variable.bgImg === 'bgimg5'} onChange={(_e) => { }} onClick={() => setBgImage(5)} />
                                            </Form.Check>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <div className="d-flex justify-content-md-between justify-content-start canvas-footer flex-wrap gap-3 "> 
                                <Link to="#!" id="reset-all" className="btn btn-danger w-100" onClick={Reset}>Reset</Link> 
                            </div>
                            
                        </TabContent>
                    </OffcanvasBody>
                </Offcanvas>
            </TabContainer>
            {/* <!-- End Switcher --> */}
        </Fragment>
    )
}

export default Switcher