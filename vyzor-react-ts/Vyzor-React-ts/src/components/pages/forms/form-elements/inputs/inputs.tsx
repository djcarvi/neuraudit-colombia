
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { input1, input2, input3, input4, input5, input6, input7, input8 } from "../../../../../shared/data/prism-code/forms-prism";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Form, Row } from "react-bootstrap";

interface InputsProps { }

const Inputs: React.FC<InputsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Inputs" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Inputs" activepage="Inputs" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Input Types" customCardClass="custom-card" customCardBodyClass="" reactCode={input1}>
                        <Row className="gy-4">
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-label" class="form-label">Basic Input:</Form.Label>
                                <Form.Control type="text" id="input" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-label">Form Input With Label</Form.Label>
                                <Form.Control type="text" id="input-label" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-placeholder">Form Input With Placeholder</Form.Label>
                                <Form.Control type="text" id="input-placeholder" placeholder="Placeholder" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-text">Type Text</Form.Label>
                                <Form.Control type="text" id="input-text" placeholder="Text" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-number">Type Number</Form.Label>
                                <Form.Control type="number" id="input-number" placeholder="Number" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-password">Type Password</Form.Label>
                                <Form.Control type="password" id="input-password" placeholder="Password" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-email">Type Email</Form.Label>
                                <Form.Control type="email" id="input-email" placeholder="Email@xyz.com" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-tel">Type Tel</Form.Label>
                                <Form.Control type="tel" id="input-tel" placeholder="+1100-2031-1233" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-submit">Type Submit</Form.Label>
                                <Form.Control type="submit" id="input-submit" defaultValue="Submit" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-reset">Type Reset</Form.Label>
                                <Form.Control type="reset" id="input-reset" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-button">Type Button</Form.Label>
                                <Form.Control type="button" className="form-control btn btn-primary" id="input-button" defaultValue="Button" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Row>
                                    <Col xl={3}>
                                        <Form.Label>Type Color</Form.Label>
                                        <Form.Control className="form-control form-input-color m-0" type="color" defaultValue="#136bd0" />
                                    </Col>
                                    <Col xl={5}>
                                        <div className="ps-0">
                                            <p className="mb-3 px-0 text-muted">Type Checkbox</p>
                                            <Form.Check className="ms-2" type="checkbox"
                                                defaultValue="" defaultChecked />
                                        </div>

                                    </Col>
                                    <Col xl={4}>
                                        <div className="ps-0">
                                            <p className="mb-3 px-0 text-muted">Type Radio</p>
                                            <Form.Check
                                                className="ms-2" type="radio" defaultChecked />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-file">Type File</Form.Label>
                                <Form.Control type="file" id="input-file" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label>Type Url</Form.Label>
                                <Form.Control type="url" name="website" placeholder="http://example.com" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-disabled">Type Disabled</Form.Label>
                                <Form.Control type="text" id="input-disabled" placeholder="Disabled input" disabled />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-readonlytext">Input Readonly Text</Form.Label>
                                <Form.Control type="text" readOnly className="form-control-plaintext border-0" id="input-readonlytext" defaultValue="email@example.com" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="disabled-readonlytext">Disabled Readonly Input</Form.Label>
                                <Form.Control type="text" defaultValue="Disabled readonly input" id="disabled-readonlytext" aria-label="Disabled input example" disabled readOnly />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label>Type Readonly Input</Form.Label>
                                <Form.Control type="text" defaultValue="Readonly input here..." aria-label="readonly input example" readOnly />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="text-area">Textarea</Form.Label>
                                <Form.Control as="textarea" id="text-area" rows={1} />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-DataList">Datalist example</Form.Label>
                                <Form.Control list="datalistOptions" id="input-DataList" placeholder="Type to search..." />
                                <datalist id="datalistOptions">
                                    <option defaultValue="San Francisco">
                                    </option>
                                    <option defaultValue="New York">
                                    </option>
                                    <option defaultValue="Seattle">
                                    </option>
                                    <option defaultValue="Los Angeles">
                                    </option>
                                    <option defaultValue="Chicago">
                                    </option>
                                </datalist>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-date">Type Date</Form.Label>
                                <Form.Control type="date" id="input-date" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-week">Type Week</Form.Label>
                                <Form.Control type="week" className="form-control" id="input-week" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-month">Type Month</Form.Label>
                                <Form.Control type="month" id="input-month" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-time">Type Time</Form.Label>
                                <Form.Control type="time" id="input-time" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-datetime-local">Type datetime-local</Form.Label>
                                <Form.Control type="datetime-local" id="input-datetime-local" />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12}>
                                <Form.Label htmlFor="input-search">Type Search</Form.Label>
                                <Form.Control type="search" id="input-search" placeholder="Search" />
                            </Col>
                        </Row>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Input shapes" customCardClass="custom-card" customCardBodyClass="" reactCode={input2}>
                        <div className="row gy-3">
                            <Col xl={12}>
                                <Form.Label htmlFor="input-noradius">Input With No Radius</Form.Label>
                                <Form.Control type="text" className="form-control rounded-0" id="input-noradius" placeholder="No Radius" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="input-rounded">Input With Radius</Form.Label>
                                <Form.Control type="text" id="input-rounded" placeholder="Default Radius" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="input-rounded-pill">Rounded Input</Form.Label>
                                <Form.Control type="text" className="form-control rounded-pill" id="input-rounded-pill" placeholder="Rounded" />
                            </Col>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Input border Styles" customCardClass="custom-card" customCardBodyClass="" reactCode={input3}>
                        <div className="row gy-3">
                            <Col xl={12}>
                                <Form.Label htmlFor="input-rounded1">Default</Form.Label>
                                <Form.Control type="text" id="input-rounded1" placeholder="Default" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="input-rounded2">Dotted Input</Form.Label>
                                <Form.Control type="text" className="form-control border-dotted" id="input-rounded2" placeholder="Dotted" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="input-rounded3">Dashed Input</Form.Label>
                                <Form.Control type="text" className="form-control border-dashed" id="input-rounded3" placeholder="Dashed" />
                            </Col>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Input Sizing" customCardClass="custom-card" customCardBodyClass="" reactCode={input4}>
                        <Form.Control className="form-control-sm mb-3" type="text" placeholder=".form-control-sm" aria-label=".form-control-sm example" />
                        <Form.Control className="mb-3" type="text" placeholder="Default input" aria-label="default input example" />
                        <Form.Control className="form-control-lg" type="text" placeholder=".form-control-lg" aria-label=".form-control-lg example" />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!--Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Overview" customCardClass="custom-card" customCardBodyClass="" reactCode={input5}>
                        <Form>
                            <div className="mb-3">
                                <Form.Label htmlFor="exampleInputEmail1">Email address</Form.Label>
                                <Form.Control type="email" id="exampleInputEmail1/" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll
                                    never share your email
                                    with
                                    anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <Form.Label htmlFor="exampleInputPassword1">Password</Form.Label>
                                <Form.Control type="password" id="exampleInputPassword1" />
                            </div>
                            <div className="mb-3">
                                <Form.Check type="checkbox" label="Check me out" className="" id="exampleCheck1" />
                            </div>
                            <SpkButton Buttonvariant='primary' Buttontype="submit">Submit</SpkButton>
                        </Form>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <Row>
                        <Col xl={12}>
                            <ShowCode title="Form text" customCardClass="custom-card" customCardBodyClass="" reactCode={input6}>
                                <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                                <Form.Control type="password" id="inputPassword5" className="form-control/"
                                    aria-describedby="passwordHelpBlock" />
                                <div id="passwordHelpBlock" className="form-text">
                                    Your password must be 8-20 characters long, contain letters and
                                    numbers,
                                    and
                                    must not contain spaces, special characters, or emoji.
                                </div>
                            </ShowCode>
                        </Col>
                        <Col xl={12}>
                            <ShowCode title=" Inline text can use any typical inline HTML element with nothing more
                                                than
                                                the <span class='text-danger'>.form-text</span> class." customCardClass="custom-card" customCardBodyClass="" reactCode={input7}>
                                <div className="row g-3 align-items-center">
                                    <div className="col-auto">
                                        <Form.Label htmlFor="inputPassword6" className="col-form-label">Password</Form.Label>
                                    </div>
                                    <div className="col-auto">
                                        <Form.Control type="password" id="inputPassword6"
                                            aria-describedby="passwordHelpInline" />
                                    </div>
                                    <div className="col-auto">
                                        <span id="passwordHelpInline" className="form-text">
                                            Must be 8-20 characters long.
                                        </span>
                                    </div>
                                </div>
                            </ShowCode>
                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Disabled forms" customCardClass="custom-card" customCardBodyClass="" reactCode={input8}>
                        <Form>
                            <fieldset disabled>
                                <legend>Disabled fieldset example</legend>
                                <div className="mb-3">
                                    <Form.Label htmlFor="disabledTextInput">Disabled input</Form.Label>
                                    <Form.Control type="text" id="disabledTextInput" placeholder="Disabled input" />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="disabledSelect">Disabled select menu</Form.Label>
                                    <select id="disabledSelect" className="form-select">
                                        <option>Disabled select</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <div className="">
                                        <Form.Check type="checkbox" label="Can't check this" />
                                    </div>
                                </div>
                                <SpkButton Buttonvariant='primary' Buttontype="submit">Submit</SpkButton>
                            </fieldset>
                        </Form>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!--End:: row-4 --> */}

        </Fragment>
    )
};

export default Inputs;