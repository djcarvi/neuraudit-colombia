

import SpkAccordions from "../../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-accordions";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Basicdata, Customdata, Flushdata } from "../../../../shared/data/general/adavanec-ui/accordionsdata";
import { accordion1, accordion10, accordion11, accordion12, accordion13, accordion14, accordion15, accordion16, accordion2, accordion3, accordion4, accordion5, accordion6, accordion7, accordion8, accordion9, reusableaccordion1, reusableaccordion10, reusableaccordion11, reusableaccordion12, reusableaccordion13, reusableaccordion2, reusableaccordion3, reusableaccordion4, reusableaccordion5, reusableaccordion6, reusableaccordion7, reusableaccordion8, reusableaccordion9 } from "../../../../shared/data/prism-code/advanced-ui-prism";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment, useState } from "react";
import { Card, Col, Collapse, Row } from "react-bootstrap";

interface AccordionsCollapseProps { }

const AccordionsCollapse: React.FC<AccordionsCollapseProps> = () => {

    const [isFirstCollapsed, setisFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setisSecondCollapsed] = useState(false);

    const first = () => {
        if (isFirstCollapsed === false) {
            setisFirstCollapsed(true);
        }
        else if (isFirstCollapsed === true) {
            setisFirstCollapsed(false);
        }
    };

    const second = () => {

        if (isSecondCollapsed === true) {
            setisSecondCollapsed(false);
        }
        else if (isSecondCollapsed === false) {
            setisSecondCollapsed(true);
        }
    };

    const both = () => {
        if (isSecondCollapsed === true) {
            setisSecondCollapsed(false);
        }
        else if (isSecondCollapsed === false) {
            setisSecondCollapsed(true);
        }
        if (isFirstCollapsed === true) {
            setisFirstCollapsed(false);
        }
        else if (isFirstCollapsed === false) {
            setisFirstCollapsed(true);
        }
    };

    const [open, setOpen] = useState(false);

    const [opens, setOpens] = useState(false);

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Accordions & Collapse" />

            <Pageheader title="Advanced Ui" currentpage="Accordions & Collapse" activepage="Accordions & Collapse" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Basic Accordion" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion1} reusableCode={reusableaccordion1}>
                        <SpkAccordions items={Basicdata} defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Always Open Accordion <p class='text-muted subtitle fs-12 fw-normal'>Omit the <code>data-bs-parent</code>
                        attribute on each
                        <code>.accordion-collapse</code>
                        to make accordion items stay open when another item is opened.
                    </p>" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion2} reusableCode={reusableaccordion2}>
                        <SpkAccordions alwaysopen={true} items={Basicdata} defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Flush Accordion <p class='subtitle text-muted fs-12 fw-normal'> Add <code>.accordion-flush</code> to remove the default <code>background-color</code>, some borders, and some rounded corners to render accordions edge-to-edge with their parent container. </p>" customCardClass="custom-card" customCardBodyClass="p-0" reactCode={accordion3} reusableCode={reusableaccordion3}>
                        <SpkAccordions items={Flushdata} flush={true} closeAll={true} accordionClass="accordion-flush" />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <h6 className="mb-3">Light Colors:</h6>
            <Row>
                <Col xl={12}>
                    <ShowCode title="Primary" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion6} reusableCode={reusableaccordion6}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-primary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Secondary" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion7} reusableCode={reusableaccordion7}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-secondary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-5 --> */}

            <h6 className="mb-3">Solid Colors:</h6>
            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Primary" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion4} reusableCode={reusableaccordion4}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-solid-primary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Secondary" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion5} reusableCode={reusableaccordion5}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-solid-secondary" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-4 --> */}

            <h6 className="mb-3">Colored Borders:</h6>
            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Primary" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion10} reusableCode={reusableaccordion10}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-border-primary accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Success" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion11} reusableCode={reusableaccordion11}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-border-success accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-7 --> */}

            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Example" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion14}>
                        <p className="mb-0">
                            <SpkButton Customclass="collapsed m-1" Buttonvariant="primary" aria-controls="example-collapse-text" Buttontoggle="collapse" onClickfunc={() => setOpens(!opens)}
                                Navigate="#collapseExample">
                                Link with href
                            </SpkButton>
                            <SpkButton Buttonvariant="secondary" Customclass="collapsed m-1" Buttontype="button" onClickfunc={() => setOpens(!opens)} aria-controls="example-collapse-text" Expand={opens}
                                Buttontoggle="collapse" Buttontarget="#collapseExample">
                                Button with data-bs-target
                            </SpkButton>
                        </p>
                        <Collapse in={opens}>
                            <div className="card card-body mb-0">
                                Some placeholder content for the collapse component. This panel
                                is
                                hidden by default but revealed when the user activates the
                                relevant
                                trigger.
                            </div>
                        </Collapse>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Targets Collapse" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion15}>
                        <p className="mb-0">
                            <SpkButton Buttonvariant='primary' Customclass="m-1" Buttontoggle="collapse" onClickfunc={() => { first(); }}
                                Navigate="#!" Expand={false} Buttoncontrols="">Toggle first element</SpkButton>
                            <SpkButton Buttonvariant='success' Customclass="m-1" Buttontype="button" Buttontoggle="collapse" onClickfunc={() => { second(); }} Expand={false} Buttontarget="#multiCollapseExample2"
                                Buttoncontrols="multiCollapseExample2">Toggle second
                                element</SpkButton>
                            <SpkButton Buttonvariant='danger' Customclass="m-1" Buttontype="button" Buttontoggle="collapse" onClickfunc={() => { both(); }} Expand={false} Buttonlabel=".multi-collapse"
                                Buttoncontrols=" multiCollapseExample2" >Toggle
                                both elements</SpkButton>
                        </p>
                        <Row>
                            <div className="col m-1">
                                {isFirstCollapsed ? (
                                    <div className="multi-collapse" id="multiCollapseExample1">
                                        <div className="card card-body mb-0">
                                            Some placeholder content for the first collapse
                                            component of
                                            this multi-collapse example. This panel is hidden by
                                            default
                                            but revealed when the user activates the relevant
                                            trigger.
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="col m-1">
                                {isSecondCollapsed ? (
                                    <div className=" multi-collapse" id="multiCollapseExample2">
                                        <div className="card card-body mb-0">
                                            Some placeholder content for the second collapse
                                            component
                                            of this multi-collapse example. This panel is hidden by
                                            default but revealed when the user activates the
                                            relevant
                                            trigger.
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </Row>
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-7 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Custom Icon Accordion" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion8} reusableCode={reusableaccordion8}>
                        <SpkAccordions items={Basicdata} accordionClass="accordion-customicon1 accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Custom Accordion" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion9} reusableCode={reusableaccordion9}>
                        <SpkAccordions items={Customdata} accordionClass="customized-accordion accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

            {/* <!-- Start:: row-9 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Left Aligned Icons" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion12} reusableCode={reusableaccordion12}>
                        <SpkAccordions items={Basicdata} accordionClass="accordionicon-left accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Without Icon" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion13} reusableCode={reusableaccordion13}>
                        <SpkAccordions items={Basicdata} accordionClass="accordionicon-none accordions-items-seperate" defaultActiveKey={1} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-9 --> */}

            {/* <!-- Start:: row-7 --> */}

            <div className="row">
                <Col xl={12}>
                    <ShowCode title="Horizontal Collapse" customCardClass="custom-card" customCardBodyClass="" reactCode={accordion16}>
                        <p>
                            <SpkButton Buttonvariant='primary' Buttontype="button" Buttontoggle="collapse" onClickfunc={() => setOpen(!open)} Buttoncontrols="example-collapse-text" Expand={open}
                                Buttontarget="#collapseWidthExample" >
                                Toggle width collapse
                            </SpkButton>
                        </p>
                        <div style={{ minHeight: "120px" }}>
                            <Collapse in={open} dimension="width">
                                <div id="example-collapse-text">
                                    <Card body style={{ width: "230px" }}>This is some placeholder content for a horizontal collapse. It's
                                        hidden by default and shown when triggered.
                                    </Card>
                                </div>
                            </Collapse>
                        </div>
                    </ShowCode>
                </Col>
            </div>

            {/* <!-- End:: row-7 --> */}

        </Fragment>
    )
};

export default AccordionsCollapse;