
import SpkToastify from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-toastify";
import SpkToast from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-toast";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { reusabletoast1, reusabletoast10, reusabletoast2, reusabletoast3, reusabletoast4, reusabletoast5, reusabletoast6, reusabletoast7, reusabletoast8, reusabletoast9, toast1, toast10, toast2, toast3, toast4, toast5, toast6, toast7, toast8, toast9 } from "../../../../shared/data/prism-code/uielements-prism";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment, useState } from "react";
import { Card, Col, Row, Toast, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import logo1 from "../../../../assets/images/brand-logos/toggle-logo.png";
import logo2 from "../../../../assets/images/brand-logos/toggle-dark.png";

interface ToastsProps { }

const Toasts: React.FC<ToastsProps> = () => {

    const [toasts, setToasts] = useState<{ [key: string]: boolean }>({});

    const addToast = (toastName: string) => {
        setToasts((prevToasts) => ({
            ...prevToasts,
            [toastName]: true,
        }));
    };

    const handleToasts = (toastName: string) => {
        setToasts((prevToasts) => ({ ...prevToasts, [toastName]: false }));
    };

    //js
    const notify = () => toast("I'm a toast message.");

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Uielements-Toasts" />

            <Pageheader title="Ui Elements" currentpage="Toasts" activepage="Toasts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Live example" customCardClass="custom-card" customCardBodyClass="" reactCode={toast2} reusableCode={reusabletoast2}>
                        <SpkButton Buttontype="button" Buttonvariant="primary" Id="liveToastBtn" onClickfunc={() => addToast('live')}>Show live
                            toast</SpkButton>
                        <ToastContainer className="toast-container position-fixed top-0 end-0 p-3">
                            <SpkToast show={toasts['live'] || false} onClose={() => handleToasts('live')} title="Vyzor" message="Hello, world! This is a toast message." timestamp="11 min ago" imgSrc={logo1} ToastHeader={true} toastClass="custom-toast" headerClass="text-default" imgClass="custom-img-class" autohide={false} />
                        </ToastContainer>
                    </ShowCode>
                    <ShowCode title=" Color schemes" customCardClass="custom-card" customCardBodyClass="" reactCode={toast4} reusableCode={reusabletoast4}>
                        <SpkToast toastClass="align-items-center text-bg-primary border-0 fade show mb-4" message="Hello, world! This is the Primary toast message. " btnClass="btn-close btn-close-white m-auto" show={toasts["primary"]} onClose={() => handleToasts('primary')} ToastBtn={true} ToastHeader={false} />
                        <SpkToast toastClass="align-items-center text-bg-secondary border-0 fade show mb-4" message="Hello, world! This is the Secondary toast. " btnClass="btn-close btn-close-white m-auto" show={toasts["secondary"]} onClose={() => handleToasts('secondary')} ToastBtn={true} ToastHeader={false} />
                        <SpkToast toastClass="align-items-center text-bg-success border-0 fade show mb-4" message="Hello, world! This is the Success toast message. " btnClass="btn-close btn-close-white m-auto" show={toasts["warning"]} onClose={() => handleToasts('warning')} ToastBtn={true} ToastHeader={false} />
                        <SpkToast toastClass="align-items-center text-bg-info border-0 fade show mb-4" message="Hello, world! This is the Info toast message. " btnClass="btn-close btn-close-white m-auto" show={toasts["info"]} onClose={() => handleToasts('info')} ToastBtn={true} ToastHeader={false} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Basic example" customCardClass="custom-card" customCardBodyClass="" reactCode={toast1} reusableCode={reusabletoast1}>
                        <SpkToast show={toasts['basic']} onClose={() => handleToasts('basic')} title="Vyzor" message="Hello, world! This is a toast message." timestamp="11 min ago" imgSrc={logo1} ToastHeader={true} toastClass="custom-toast" headerClass="text-default" imgClass="custom-img-class" autohide={false} />
                    </ShowCode>
                    <ShowCode title="Stacking" customCardClass="custom-card" customCardBodyClass="px-2 px-sm-4" reactCode={toast3} reusableCode={reusabletoast3}>
                        <ToastContainer className="toast-container position-static">

                            <SpkToast show={toasts["stack"]} onClose={() => handleToasts('stack')} ToastHeader={true} toastClass="fade show" headerClass="text-default" imgSrc={logo1} imgClass="me-2" title="Vyzor" timestamp="just now" message={"See? Just like this."} />
                            <SpkToast show={toasts["stack1"]} onClose={() => handleToasts('stack1')} ToastHeader={true} toastClass="fade show" headerClass="text-default" imgSrc={logo1} imgClass="me-2" title="Vyzor" timestamp="2 seconds ago" message={" Heads up, toasts will stack automatically"} />

                        </ToastContainer>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Translucent" customCardClass="custom-card" customCardBodyClass="" reactCode={toast7} reusableCode={reusabletoast7}>
                        <SpkToast ToastHeader={true} onClose={() => handleToasts('transColor')} show={toasts['transColor']} toastClass="show" headerClass="text-default" imgClass="me-2" imgSrc={logo1} title="Vyzor" timestamp="11 mins ago" message="Hello, world! This is a toast message." />
                    </ShowCode>
                    <ShowCode title="Custom content" customCardClass="custom-card" customCardBodyClass="" reactCode={toast8} reusableCode={reusabletoast8}>
                        <SpkToast ToastHeader={false} toastClass="lign-items-center fade show mb-3" ToastBtn={true} message="Hello, world! This is Primary toast message. " btnClass="btn-close me-2 m-auto" onClose={() => handleToasts('customColor')} show={toasts['customColor']} />
                        <div>
                            <span className="my-4 text-muted">
                                Alternatively, you can also add additional controls and components to
                                toasts.
                            </span>
                        </div>
                        <Toast className="toast fade show mt-2" role="alert" aria-live="assertive" show={toasts['customsColor']}>
                            <Toast.Body>
                                Hello, world! This is a toast message.
                                <div className="mt-2 pt-2 border-top">
                                    <SpkButton Buttontype="button" Buttonvariant="primary" Size="sm" Customclass="me-2">Take
                                        action</SpkButton>
                                    <SpkButton Buttontype="button" Size="sm" Buttonvariant="secondary" onClickfunc={() => handleToasts('customsColor')} >Close</SpkButton>
                                </div>
                            </Toast.Body>
                        </Toast>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Color Variants Live" customCardClass="custom-card" customCardBodyClass="" reactCode={toast6} reusableCode={reusabletoast6}>
                        <div className="btn-list">
                            <SpkButton Buttontype="button" Buttonvariant='primary-light' Customclass="btn me-2" Id="primaryToastBtn" onClickfunc={() => addToast('PrimaryColor')}>Primary</SpkButton>
                            <SpkButton Buttonvariant='secondary-light' Buttontype="button" Customclass="btn me-2" Id="secondaryToastBtn" onClickfunc={() => addToast('SecondaryColor')}>secondary</SpkButton>
                            <SpkButton Buttonvariant='info-light' Buttontype="button" Customclass="btn  me-2" Id="infoToastBtn" onClickfunc={() => addToast('InfoColor')}>info</SpkButton>
                            <SpkButton Buttonvariant='success-light' Buttontype="button" Customclass="btn  me-2" Id="successToastBtn" onClickfunc={() => addToast('SuccessColor')}>success</SpkButton>
                            <SpkButton Buttonvariant='danger-light' Buttontype="button" Customclass="btn me-2" Id="dangerToastBtn" onClickfunc={() => addToast('DangerColor')}>danger</SpkButton>
                            <SpkButton Buttonvariant='warning-light' Buttontype="button" Customclass="btn  me-2" Id="warningToastBtn" onClickfunc={() => addToast('WarningColor')}>warning</SpkButton>
                        </div>
                        <ToastContainer className="toast-container position-fixed top-0 end-0 p-3">
                            <SpkToast ToastHeader={true} bg="primary-transparent" toastClass="colored-toast" onClose={() => handleToasts('PrimaryColor')} show={toasts['PrimaryColor'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-primary" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} bg="secondary-transparent" toastClass="colored-toast" onClose={() => handleToasts('SecondaryColor')} show={toasts['SecondaryColor'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-secondary" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} bg="info-transparent" toastClass="colored-toast" onClose={() => handleToasts('InfoColor')} show={toasts['InfoColor'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-info" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} bg="success-transparent" toastClass="colored-toast" onClose={() => handleToasts('SuccessColor')} show={toasts['SuccessColor'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-success" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} bg="danger-transparent" toastClass="colored-toast" onClose={() => handleToasts('DangerColor')} show={toasts['DangerColor'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-danger" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} bg="warning-transparent" toastClass="colored-toast" onClose={() => handleToasts('WarningColor')} show={toasts['WarningColor'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-warning" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                        </ToastContainer>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Solid Background Toasts" customCardClass="custom-card" customCardBodyClass="" reactCode={toast5} reusableCode={reusabletoast5}>
                        <div className="btn-list">
                            <SpkButton Buttonvariant='primary' Buttontype="button" Customclass="me-2" Id="solidprimaryToastBtn" onClickfunc={() => addToast('solidPrimary')}>Primary</SpkButton>
                            <SpkButton Buttonvariant='secondary' Buttontype="button" Customclass="me-2" Id="solidsecondaryToastBtn" onClickfunc={() => addToast('solidSecondary')}>secondary</SpkButton>
                            <SpkButton Buttonvariant='info' Buttontype="button" Customclass="me-2" Id="solidinfoToastBtn" onClickfunc={() => addToast('solidInfo')}>info</SpkButton>
                            <SpkButton Buttonvariant='success' Buttontype="button" Customclass="me-2" Id="solidsuccessToastBtn" onClickfunc={() => addToast('solidSuccess')}>success</SpkButton>
                            <SpkButton Buttonvariant='danger' Buttontype="button" Customclass="me-2" Id="soliddangerToastBtn" onClickfunc={() => addToast('solidDanger')}>danger</SpkButton>
                            <SpkButton Buttonvariant='warning' Buttontype="button" Customclass="me-2" Id="solidwarningToastBtn" onClickfunc={() => addToast('solidWarning')}>warning</SpkButton>
                        </div>
                        <ToastContainer className="toast-container position-fixed top-0 end-0 p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary" bodyClass="text-fixed-white" onClose={() => handleToasts('solidPrimary')} show={toasts['solidPrimary'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-primary" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-secondary" bodyClass="text-fixed-white" onClose={() => handleToasts('solidSecondary')} show={toasts['solidSecondary'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-secondary" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-info" bodyClass="text-fixed-white" onClose={() => handleToasts('solidInfo')} show={toasts['solidInfo'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-info" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-success" bodyClass="text-fixed-white" onClose={() => handleToasts('solidSuccess')} show={toasts['solidSuccess'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-success" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-danger" bodyClass="text-fixed-white" onClose={() => handleToasts('solidDanger')} show={toasts['solidDanger'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-danger" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-warning" bodyClass="text-fixed-white" onClose={() => handleToasts('solidWarning')} show={toasts['solidWarning'] || false} delay={3000} autohide={true} headerClass="text-fixed-white bg-warning" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} message="Your,toast message here." title="Vyzor" />
                        </ToastContainer>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Toast Placements" customCardClass="custom-card" customCardBodyClass="" reactCode={toast10} reusableCode={reusabletoast10}>
                        <div className="btn-list">
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('topLeft')} Customclass="me-2" Id="topleftToastBtn">Top Left</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('topCenter')} Customclass="me-2" Id="topcenterToastBtn">Top Center</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('topRight')} Customclass="me-2" Id="toprightToastBtn">Top Right</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('middleLeft')} Customclass="me-2" Id="middleleftToastBtn">Middle Left</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('middleCenter')} Customclass="me-2" Id="middlecenterToastBtn">Middle Center</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('middleRight')} Customclass="me-2" Id="middlerightToastBtn">Middle Right</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('bottomLeft')} Customclass="me-2" Id="bottomleftToastBtn">Bottom Left</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('bottomCenter')} Customclass="me-2" Id="bottomcenterToastBtn">Bottom Center</SpkButton>
                            <SpkButton Buttonvariant='outline-primary' Buttontype="button" onClickfunc={() => addToast('bottomRight')} Customclass="me-2" Id="bottomrightToastBtn">Bottom Right</SpkButton>
                        </div>
                        <ToastContainer className="toast-container position-fixed top-0 start-0 p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('topLeft')} show={toasts['topLeft'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('topCenter')} show={toasts['topCenter'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed top-0 end-0 p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('topRight')} show={toasts['topRight'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed top-50 start-0 translate-middle-y p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('middleLeft')} show={toasts['middleLeft'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed top-50 start-50 translate-middle">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('middleCenter')} show={toasts['middleCenter'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed top-50 end-0 translate-middle-y p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('middleRight')} show={toasts['middleRight'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed bottom-0 start-0 p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('bottomLeft')} show={toasts['bottomLeft'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('bottomCenter')} show={toasts['bottomCenter'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                        <ToastContainer className="toast-container position-fixed bottom-0 end-0 p-3">
                            <SpkToast ToastHeader={true} toastClass="toast colored-toast bg-primary-transparent text-primary"
                                onClose={() => handleToasts('bottomRight')} show={toasts['bottomRight'] || false} delay={3000} autohide={true} headerClass="bg-primary text-fixed-white" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo2} title="Vyzor" message="Your,toast message here." />
                        </ToastContainer>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Aligning Toast Using Flexbox" customCardClass="custom-card" customCardBodyClass="px-1 px-sm-4" reactCode={toast9} reusableCode={reusabletoast9}>
                        <div className="bd-example bg-light bd-example-toasts d-flex p-0 px-3">
                            <div aria-live="polite" aria-atomic="true"
                                className="d-flex justify-content-center align-items-center w-100">
                                <SpkToast ToastHeader={true} show={toasts['alignColor']} onClose={() => handleToasts('alignColor')} toastClass="fade show shadow-lg" headerClass="text-default" imgClass="bd-placeholder-img rounded me-2" imgSrc={logo1} title="Vyzor" timestamp="11 mins ago" message="Hello, world! This is a toast message." />
                            </div>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                TOASTIFY JS
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <SpkButton Buttonvariant="primary" Id="toast-button" onClickfunc={notify}>Click For Live Toast</SpkButton>
                            <SpkToastify position="top-right" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

        </Fragment>
    )
};

export default Toasts;