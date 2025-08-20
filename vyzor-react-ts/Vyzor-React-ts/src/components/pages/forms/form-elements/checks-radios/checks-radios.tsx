
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { radio1, radio10, radio11, radio12, radio13, radio14, radio15, radio16, radio17, radio18, radio19, radio2, radio20, radio21, radio22, radio23, radio24, radio3, radio4, radio5, radio6, radio7, radio8, radio9 } from "../../../../../shared/data/prism-code/forms-prism";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

interface ChecksRadiosProps { }

const ChecksRadios: React.FC<ChecksRadiosProps> = () => {

    const Checkdata1 = [
        { id: "1", class1: "mb-2", class2: "", text: "Primary" },
        { id: "2", class1: "mb-2", class2: "secondary", text: "Secondary" },
        { id: "3", class1: "mb-2", class2: "warning", text: "Warning" },
        { id: "4", class1: "mb-2", class2: "info", text: "Info" },
        { id: "5", class1: "mb-2", class2: "success", text: "Success" },
        { id: "6", class1: "mb-2", class2: "danger", text: "Danger" },
        { id: "7", class1: "mb-0", class2: "dark", text: "Dark" }
    ];

    const [secondary1, setsecondary1] = useState("on");
    const [success1, setsuccess1] = useState("on");
    const [dark1, setdark1] = useState("on");
    const [primary1, setprimary1] = useState("on");
    const [warning1, setwarning1] = useState("on");
    const [info1, setinfo1] = useState("on");
    const [danger1, setdanger1] = useState("on");
    const [light1, setlight1] = useState("on");

    //sizes 
    const [primary2, setprimary2] = useState("on");
    const [secondary2, setsecondary2] = useState("on");
    const [success2, setsuccess2] = useState("on");

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Checks & Radios" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Checks & Radios" activepage="Checks & Radios" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={6} lg={6} md={6} sm={12} className="">
                    <ShowCode title="Checks" customCardClass="custom-card" customCardBodyClass="" reactCode={radio1}>
                        <Form.Check label="Default checkbox" />
                        <Form.Check defaultChecked label="Checked checkbox" />
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} className="">
                    <ShowCode title="Disabled" customCardClass="custom-card" customCardBodyClass="" reactCode={radio2}>
                        <Form.Check disabled label="Disabled checkbox" />
                        <Form.Check disabled defaultChecked label="Disabled checked checkbox" />
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} className="">
                    <ShowCode title="Radios" customCardClass="custom-card" customCardBodyClass="" reactCode={radio3}>
                        <Form.Check type="radio" label="Default radio" name="example-radios1" />
                        <Form.Check type="radio" defaultChecked label="Default checked radio" name="example-radios1" />
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} className="">
                    <ShowCode title="Disabled" customCardClass="custom-card" customCardBodyClass="" reactCode={radio4}>
                        <Form.Check type="radio" disabled label="Disabled radio" />
                        <Form.Check type="radio" disabled defaultChecked label="Disabled checked radio" />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title="Default (stacked)" customCardClass="custom-card" customCardBodyClass="" reactCode={radio5}>
                        <Form.Check label="Default checkbox" />
                        <Form.Check disabled label="Disabled checkbox" />
                        <Form.Check type="radio" defaultChecked label="Default radio" />
                        <Form.Check type="radio" disabled label="Disabled radio" />
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title="Switches" customCardClass="custom-card" customCardBodyClass="" reactCode={radio6}>
                        <Form.Check type="switch" label="Default switch checkbox input" />
                        <Form.Check type="switch" defaultChecked label="Checked switch checkbox input" />
                        <Form.Check type="switch" disabled label="Disabled switch checkbox input" />
                        <Form.Check type="switch" disabled defaultChecked label="Disabled checked switch checkbox input" />
                    </ShowCode>
                </Col>

            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Checkbox Sizes" customCardClass="custom-card" customCardBodyClass="d-sm-flex align-items-center justify-content-between" reactCode={radio13}>
                        <Form.Check type="checkbox" defaultChecked label="Default" />
                        <Form.Check className="form-check-md d-flex align-items-center"
                            type="checkbox" defaultChecked id="checkebox-md" label="Medium" />
                        <Form.Check className="form-check-lg d-flex align-items-center"
                            type="checkbox" defaultChecked id="checkebox-lg" label="Large" />
                    </ShowCode>
                </Col>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Radio Sizes" customCardClass="custom-card" customCardBodyClass="d-sm-flex align-items-center justify-content-between" reactCode={radio14}>
                        <Form.Check type="radio" label="Default" name="example-radios" />
                        <Form.Check type="radio" className="form-check-md" id="Radio-md" name="example-radios" label="Medium" />
                        <Form.Check type="radio" className="form-check-lg" name="example-radios"
                            defaultChecked id="Radio-lg" label="Large" />
                    </ShowCode>
                </Col>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Switch Sizes" customCardClass="custom-card" customCardBodyClass="d-sm-flex align-item-center justify-content-between" reactCode={radio15}>
                        <Form.Check type="switch" label="Default" />
                        <Form.Check type="switch" className="form-check-md form-switch" id="switch-md" label="Medium" />
                        <Form.Check type="switch" className="form-check-lg form-switch" id="switch-lg" label="Large" />
                    </ShowCode>
                </Col>

            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>

                <Col xl={6} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Inline" customCardClass="custom-card" customCardBodyClass="" reactCode={radio9}>
                        <Form.Check className="form-check-inline" type="checkbox" label="1" />
                        <Form.Check className="form-check-inline" type="checkbox" label="2" />
                        <Form.Check className="form-check-inline" disabled type="checkbox" label="3 (disabled)" />
                        <Form.Check className="form-check-inline" type="radio" label="1" name='radio1' />
                        <Form.Check className="form-check-inline" type="radio" label="2" name='radio1' />
                        <Form.Check className="form-check-inline" disabled type="radio" label="3 (disabled)" />
                    </ShowCode>
                    <ShowCode title="Without labels" customCardClass="custom-card" customCardBodyClass="" reactCode={radio10}>
                        <div className="d-flex">
                            <Form.Check className="me-4" type="checkbox" />
                            <Form.Check className="" type="radio" />
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={3} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Reverse" customCardClass="custom-card" customCardBodyClass="" reactCode={radio11}>
                        <Form.Check className="form-check-reverse mb-3" type="checkbox" label="Reverse checkbox" />
                        <Form.Check className="form-check-reverse mb-3" type="checkbox" disabled label="Disabled reverse checkbox" />
                        <Form.Check className="form-check-reverse mb-3" type="switch" label="Reverse switch checkbox input" />
                    </ShowCode>
                </Col>
                <Col xl={3} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Outlined styles" customCardClass="custom-card" customCardBodyClass="" reactCode={radio12}>
                        <Form.Control type="checkbox" className="btn-check" id="btn-check-outlined" />
                        <SpkButton Buttonvariant='outline-primary' Customclass="mb-3">Single toggle</SpkButton><br />
                        <input type="checkbox" className="btn-check" id="btn-check-2-outlined" defaultChecked />
                        <label className="btn btn-outline-secondary mb-3" htmlFor="btn-check-2-outlined">Checked</label>
                        <br />
                        <input type="radio" className="btn-check" name="options-outlined" id="success-outlined" defaultChecked />
                        <label className="btn btn-outline-success m-1" htmlFor="success-outlined">Checked success radio</label>
                        <input type="radio" className="btn-check" name="options-outlined" id="danger-outlined" />
                        <label className="btn btn-outline-danger m-1" htmlFor="danger-outlined">Danger radio</label>
                    </ShowCode>
                </Col>

            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={6} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Radio toggle buttons" customCardClass="custom-card" customCardBodyClass="" reactCode={radio7}>
                        <Form.Check type="radio" className="btn-check" name="options" id="option1" defaultChecked />
                        <SpkButton Buttonvariant="primary" Customclass="m-1">Checked</SpkButton>
                        <Form.Check type="radio" className="btn-check" name="options" id="option2" />
                        <SpkButton Buttonvariant="primary" Customclass="m-1">Radio</SpkButton>
                        <Form.Check type="radio" className="btn-check" name="options" id="option3" disabled />
                        <SpkButton Disabled={true} Buttonvariant="primary" Customclass="m-1">Disabled</SpkButton>
                        <Form.Check type="radio" className="btn-check" name="options" id="option4" />
                        <SpkButton Buttonvariant="" Customclass="btn btn-primary m-1">Radio</SpkButton>
                    </ShowCode>
                </Col>
                <Col xl={6} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Checkbox toggle buttons" customCardClass="custom-card" customCardBodyClass="" reactCode={radio8}>
                        <Form.Check type="checkbox" className="btn-check" id="btn-check" />
                        <SpkButton Buttonvariant="primary" Customclass="m-1">Single toggle</SpkButton>
                        <Form.Check type="checkbox" className="btn-check" id="btn-check-2" defaultChecked />
                        <SpkButton Buttonvariant="primary" Customclass="m-1">Checked</SpkButton>
                        <Form.Check type="checkbox" className="btn-check" id="btn-check-3" disabled />
                        <SpkButton Disabled={true} Buttonvariant="primary" Customclass="m-1">Disabled</SpkButton>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row className="row-cols-12">
                <Col md={6} lg={6} className="col col-xl">
                    <ShowCode title="Colored Checkboxes" customCardClass="custom-card" customCardBodyClass="" reactCode={radio20}>
                        {Checkdata1.map((idx, index) => (
                            <div className={`form-check ${idx.class1}`} key={index}>
                                <input id={idx.id} className={`form-check-input form-checked-${idx.class2}`}
                                    type="checkbox" defaultChecked />
                                <label className=''>{idx.text}</label>
                            </div>
                        ))}
                    </ShowCode>
                </Col>
                <Col md={6} lg={6} className="col col-xl">
                    <ShowCode title="Outline Checkboxes" customCardClass="custom-card" customCardBodyClass="" reactCode={radio21}>
                        {Checkdata1.map((idx, index) => (
                            <div className={`form-check ${idx.class1}`} key={index}>
                                <input id={idx.id} className={`form-check-input form-checked-outline form-checked-${idx.class2}`}
                                    type="checkbox" defaultChecked />
                                <label className=''>{idx.text}</label>
                            </div>
                        ))}
                    </ShowCode>
                </Col>
                <Col md={12} className="col col-lg col-xl">
                    <ShowCode title="Colored Radios" customCardClass="custom-card" customCardBodyClass="" reactCode={radio22}>
                        {Checkdata1.map((idx, index) => (
                            <div className={`form-check ${idx.class1}`} key={index}>
                                <input className={`form-check-input form-checked form-checked-${idx.class2}`}
                                    type="radio" defaultChecked />
                                <label className=''>{idx.text}</label>
                            </div>
                        ))}
                    </ShowCode>
                </Col>
                <Col sm={6} className="col col-lg">
                    <ShowCode title="Outline Radios" customCardClass="custom-card" customCardBodyClass="" reactCode={radio23}>
                        {Checkdata1.map((idx, index) => (
                            <div className={`form-check ${idx.class1}`} key={index}>
                                <input className={`form-check-input form-checked-outline form-checked-${idx.class2}`}
                                    type="radio" defaultChecked />
                                <label className=''>{idx.text}</label>
                            </div>
                        ))}
                    </ShowCode>
                </Col>
                <Col sm={6} className="col col-lg">
                    <ShowCode title="Switches Colors" customCardClass="custom-card" customCardBodyClass="" reactCode={radio24}>
                        {Checkdata1.map((idx, index) => (
                            <div className={`form-check form-switch ${idx.class1}`} key={index}>
                                <input className={`form-check-input form-checked-${idx.class2}`}
                                    type="checkbox" defaultChecked />
                                <label className=''>{idx.text}</label>
                            </div>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

            {/* <!-- Start:: row-7 --> */}

            <Row>
                <Col xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Toggle Switches Style-1" customCardClass="custom-card" customCardBodyClass="" reactCode={radio16}>
                        <Row className="row gy-1">
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle  ${primary1}`} onClick={() => { primary1 == "on" ? setprimary1("off") : setprimary1("on"); }}>
                                        <span></span>
                                    </div>
                                    Primary
                                </div>
                            </Col>

                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle mb-3  toggle-secondary ${secondary1}`} onClick={() => { secondary1 == "on" ? setsecondary1("off") : setsecondary1("on"); }}>
                                        <span></span>
                                    </div>
                                    Secondary
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle mb-3  toggle-warning ${warning1}`} onClick={() => { warning1 == "on" ? setwarning1("off") : setwarning1("on"); }} >
                                        <span></span>
                                    </div>
                                    Warning
                                </div>

                            </Col>
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle mb-3  toggle-info ${info1}`} onClick={() => { info1 == "on" ? setinfo1("off") : setinfo1("on"); }} >
                                        <span></span>
                                    </div>
                                    Info
                                </div>


                            </Col>
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle mb-3  toggle-success ${success1}`} onClick={() => { success1 == "on" ? setsuccess1("off") : setsuccess1("on"); }} >
                                        <span></span>
                                    </div>
                                    Success
                                </div>


                            </Col>
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle mb-3  toggle-danger ${danger1}`} onClick={() => { danger1 == "on" ? setdanger1("off") : setdanger1("on"); }} >
                                        <span></span>
                                    </div>
                                    Danger
                                </div>

                            </Col>
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle mb-3  toggle-light ${light1}`} onClick={() => { light1 == "on" ? setlight1("off") : setlight1("on"); }} >
                                        <span></span>
                                    </div>
                                    Light
                                </div>

                            </Col>
                            <Col xl={4}>
                                <div className="d-flex gap-2">
                                    <div className={`toggle ms-sm-2  toggle-dark ${dark1}`} onClick={() => { dark1 == "on" ? setdark1("off") : setdark1("on"); }}>
                                        <span></span>
                                    </div>
                                    Dark
                                </div>

                            </Col>
                        </Row>
                    </ShowCode>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Toggle Switches Style-2" customCardClass="custom-card" customCardBodyClass="" reactCode={radio17}>
                        <div className="row gy-1">
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchPrimary" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchPrimary" className="m-0 label-primary"></Form.Label><span className="ms-3">Primary</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchSecondary" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchSecondary" className="m-0 label-secondary"></Form.Label><span className="ms-3">Secondary</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchWarning" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchWarning" className="m-0 label-warning"></Form.Label><span className="ms-3">Warning</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchInfo" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchInfo" className="m-0 label-info"></Form.Label><span className="ms-3">Info</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchSuccess" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchSuccess" className="m-0 label-success"></Form.Label><span className="ms-3">Success</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchDanger" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchDanger" className="m-0 label-danger"></Form.Label><span className="ms-3">Danger</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchLight" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchLight" className="m-0 label-light"></Form.Label><span className="ms-3">Light</span>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="custom-toggle-switch d-flex align-items-center mb-4">
                                    <Form.Control id="toggleswitchDark" name="toggleswitch001" type="checkbox" defaultChecked />
                                    <Form.Label htmlFor="toggleswitchDark" className="m-0 label-dark"></Form.Label><span className="ms-3">Dark</span>
                                </div>
                            </Col>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-7 --> */}

            {/* <!-- Start:: row-8 --> */}

            <Row>
                <Col xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Toggle Switch-1 Sizes" customCardClass="custom-card" customCardBodyClass="" reactCode={radio18}>
                        <div className="d-flex align-items-center flex-wrap mb-3">
                            <div className=""> <p className="text-muted m-0">Small size toggle switch <code>toggle-sm</code></p></div>

                            <div className={`toggle  toggle-sm mb-0 ${primary2}`} onClick={() => { primary2 == "on" ? setprimary2("off") : setprimary2("on"); }}>
                                <span></span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap mb-3">
                            <div className=""> <p className="text-muted m-0">Default toggle switch <code></code></p></div>

                            <div className={`toggle mb-0  toggle-secondary ${secondary2}`} onClick={() => { secondary2 == "on" ? setsecondary2("off") : setsecondary2("on"); }}>
                                <span></span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                            <div className=""> <p className="text-muted m-0">Large size toggle switch <code>toggle-lg</code></p></div>

                            <div className={`toggle toggle-lg mb-0  toggle-success ${success2}`} onClick={() => { success2 == "on" ? setsuccess2("off") : setsuccess2("on"); }} >
                                <span></span>
                            </div>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} className="">
                    <ShowCode title="Toggle Switch-2 Sizes" customCardClass="custom-card" customCardBodyClass="" reactCode={radio19}>
                        <div className="d-flex align-items-center flex-wrap mb-4">
                            <div className=""><p className="text-muted m-0">Small size toggle switch <code>toggle-sm</code></p></div>
                            <div className="custom-toggle-switch toggle-sm ms-2">
                                <Form.Control id="size-sm" name="toggleswitchsize" type="checkbox" defaultChecked />
                                <Form.Label htmlFor="size-sm" className="label-primary m-0"></Form.Label>
                            </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap mb-4">
                            <div className=""><p className="text-muted m-0">Default toggle switch</p></div>
                            <div className="custom-toggle-switch ms-2">
                                <Form.Control id="size-default" name="toggleswitchsize" type="checkbox" defaultChecked />
                                <Form.Label htmlFor="size-default" className="label-secondary mb-1"></Form.Label>
                            </div>
                        </div>
                        <div className="d-sm-flex d-block align-items-center flex-wrap">
                            <div className="mb-sm-0 mb-2"><p className="text-muted m-0">Large size toggle switch <code>toggle-lg</code></p></div>
                            <div className="custom-toggle-switch toggle-lg ms-sm-2 ms-0">
                                <Form.Control id="size-lg" name="toggleswitchsize" type="checkbox" defaultChecked />
                                <Form.Label htmlFor="size-lg" className="label-success mb-2"></Form.Label>
                            </div>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-8 --> */}

        </Fragment>
    )
};

export default ChecksRadios;