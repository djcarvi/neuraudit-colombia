
import SpkButtongroup from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttongroup";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import { datadropdown19, datadropdown2, datadropdown28, datadropdown29, datadropdown3, datadropdown5, datadropdown6, datadropdown9, reactdropdown1, reactdropdown10, reactdropdown11, reactdropdown12, reactdropdown13, reactdropdown14, reactdropdown15, reactdropdown16, reactdropdown17, reactdropdown18, reactdropdown19, reactdropdown2, reactdropdown20, reactdropdown21, reactdropdown22, reactdropdown23, reactdropdown24, reactdropdown25, reactdropdown26, reactdropdown27, reactdropdown28, reactdropdown29, reactdropdown3, reactdropdown4, reactdropdown5, reactdropdown6, reactdropdown7, reactdropdown8, reactdropdown9, reusedropdown1, reusedropdown10, reusedropdown11, reusedropdown12, reusedropdown13, reusedropdown14, reusedropdown15, reusedropdown16, reusedropdown17, reusedropdown18, reusedropdown19, reusedropdown2, reusedropdown20, reusedropdown21, reusedropdown22, reusedropdown23, reusedropdown24, reusedropdown25, reusedropdown26, reusedropdown27, reusedropdown28, reusedropdown29, reusedropdown3, reusedropdown4, reusedropdown5, reusedropdown6, reusedropdown7, reusedropdown8, reusedropdown9 } from "../../../../shared/data/prism-code/uielements-prism";
import { AlignmentButtons, AutocloseButtons, CustomButtons, GhostButtons, OutlineButtons, SingleButtons, SplitButtonsdata } from "../../../../shared/data/general/ui-elements/dropdownsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { ButtonGroup, Col, Dropdown, Form, Row, SplitButton } from "react-bootstrap";
import { Link } from "react-router-dom";
interface DropdownsProps { }

const Dropdowns: React.FC<DropdownsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dropdowns" />

            <Pageheader title="Ui Elements" currentpage="Dropdowns" activepage="Dropdowns" />

            {/* <!-- Page Header Close --> */}

            {/* <!--Start:: row-1--> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Dropdowns" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown1} reusableCode={reusedropdown1}>
                        <div className="btn-list d-flex align-items-center flex-wrap" >
                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="primary" Menulabel="dropdownMenuButton1" Toggletext="Dropdown button">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            </SpkDropdown>
                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="secondary" Navigate="#!" Menulabel="dropdownMenuLink" Toggletext="Dropdown link">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            </SpkDropdown>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!--End:: row-1--> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Single dropdown buttons" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown3} dataCode={datadropdown3} reusableCode={reusedropdown3}>
                        <div className="btn-list">
                            {SingleButtons.map((idx, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Togglevariant={idx.class} Navigate="#!" Toggletext="Action" Menuas="ul">
                                        <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                        <li><hr className="dropdown-divider" /></li>
                                        <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Rounded Button Dropdowns" customCardClass="custom-card" customCardBodyClass="" dataCode={datadropdown5} reactCode={reactdropdown5} reusableCode={reusedropdown5}>
                        <div className="btn-list">
                            {SingleButtons.map((idx, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Togglevariant={idx.class} Customtoggleclass="rounded-pill" Toggletext="Action" Menuas="ul">
                                        <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                        <li><hr className="dropdown-divider" /></li>
                                        <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>

                    <ShowCode title="Outline Button Dropdowns" customCardClass="custom-card" customCardBodyClass="" dataCode={datadropdown2} reactCode={reactdropdown2} reusableCode={reusedropdown2}>
                        <div className="btn-list">
                            {OutlineButtons.map((idx, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Togglevariant={idx.class} Navigate="#!" Toggletext="Action" Menuas="ul">
                                        <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                        <li><hr className="dropdown-divider" /></li>
                                        <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Rounded Outline Dropdowns" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown4} dataCode={datadropdown2} reusableCode={reusedropdown4}>
                        <div className="btn-list">
                            {OutlineButtons.map((idx, index) => (
                                <SpkButtongroup Customclass="me-0" key={index}>
                                    <SpkDropdown Togglevariant={idx.class} Customtoggleclass="rounded-pill" Toggletext="Action" Menuas="ul">
                                        <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                        <Dropdown.Divider className="dropdown-divider" />
                                        <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Split buttons" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown6} dataCode={datadropdown6} reusableCode={reusedropdown6}>
                        {SplitButtonsdata.map((idx, index) => (
                            <SplitButton key={index} className='me-2 my-1' variant={idx.class} title="Action">
                                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                                <Dropdown.Item eventKey="3" active> Active Item</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                            </SplitButton>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Dropdown Sizing" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown7} reusableCode={reusedropdown7}>
                        <SpkButtongroup Customclass="my-1 me-2">
                            <SpkDropdown Togglevariant="primary" Size="lg" Toggletext="Large button" Menuas="ul">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                        <SpkButtongroup Customclass="my-1 me-2">
                            <SpkDropdown as={ButtonGroup} Buttontag={true} Buttonposition="before" Buttontext="Large split button" color="light" Togglevariant="light" Split={true}
                                Customtoggleclass="btn-lg" Menuas="ul" Id="dropdown-split-basic">
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                        <SpkButtongroup Customclass="my-1 me-2">
                            <SpkDropdown as={ButtonGroup} Togglevariant="primary" Size="sm" Menuas="ul" Toggletext="Small button">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                        <SpkButtongroup Customclass="my-1 me-2">
                            <SpkDropdown as={ButtonGroup} Buttontag={true} Buttontext="Small split button" Buttonposition="before" Id="dropdown-split-basic"
                                Togglevariant="light" color="light" Size="sm" Menuas="ul" Split={true} >
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-7 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Dropup" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown15} reusableCode={reusedropdown15}>
                        <SpkDropdown as={ButtonGroup} Drop="up" Toggletext="Dropup" Customclass="my-1 me-2"
                            Togglevariant="primary" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            <Dropdown.Divider className="dropdown-divider" />
                            <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                        </SpkDropdown>
                        <SpkDropdown as={ButtonGroup} Drop="up" Buttontag={true} Buttontext="Split dropup" Buttonposition="before" Customclass="my-1" color="info" Split={true}
                            Togglevariant="info" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            <Dropdown.Divider className="dropdown-divider" />
                            <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropup right" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown16} reusableCode={reusedropdown16}>
                        <SpkDropdown as={ButtonGroup} Drop="end" Toggletext="Dropright" Customclass="my-1 me-2" Togglevariant="primary" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            <Dropdown.Divider className="dropdown-divider" />
                            <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                        </SpkDropdown>
                        <SpkDropdown as={ButtonGroup} Drop="end" Buttontag={true} Buttontext="Split dropend" Buttonposition="before" Customclass="my-1" color="info" Split={true}
                            Togglevariant="info" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            <Dropdown.Divider className="dropdown-divider" />
                            <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Active" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown17} reusableCode={reusedropdown17}>
                        <SpkDropdown Toggletext="Dropstart" Togglevariant="primary" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Regular link</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item active" href="#!" aria-current="true">Active
                                link
                            </Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another link</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropup left" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown18} reusableCode={reusedropdown18}>
                        <SpkDropdown as={ButtonGroup} Drop="start" Toggletext="Dropleft" Customclass="my-1 me-2" Togglevariant="primary" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            <Dropdown.Divider className="dropdown-divider" />
                            <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                        </SpkDropdown>
                        <SpkButtongroup>
                            <SpkDropdown as={ButtonGroup} Drop="start" Customclass="my-1" Split={true} Buttontag={true} Buttonposition="after" Buttontext="Split dropstart" color="info" Togglevariant="info" Menuas="ul">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-7 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={3}>
                    <ShowCode title="Disabled" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown8} reusableCode={reusedropdown8}>
                        <SpkDropdown Toggletext="Dropstart" Togglevariant="primary" Menuas="ul">
                            <Dropdown.Item as="li" href="#!">Regular link</Dropdown.Item>
                            <Dropdown.Item className="dropdown-item disabled" href="#!" aria-current="true">Active
                                link</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Another link</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Auto close behavior" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown9} dataCode={datadropdown9} reusableCode={reusedropdown9}>
                        <div className="btn-list">
                            {AutocloseButtons.map((idx, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Toggletext={idx.text} Togglevariant={idx.class} Menuas="ul" Id="defaultDropdown">
                                        <Dropdown.Item as="li" href="#!">Menu item</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Menu item</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Menu item</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={3}>
                    <ShowCode title="dropdowns with Forms" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown10} reusableCode={reusedropdown10}>
                        <SpkDropdown Toggletext="Dropdown" Togglevariant="secondary" Menuas="ul" Id="dropdownMenu2">
                            <Form className="px-4 py-3">
                                <div className="mb-3">
                                    <Form.Label htmlFor="exampleDropdownFormEmail1" className="form-label">Email
                                        address</Form.Label>
                                    <Form.Control type="email" className="form-control" id="exampleDropdownFormEmail1"
                                        placeholder="email@example.com" />
                                </div>
                                <div className="mb-3">
                                    <Form.Label htmlFor="exampleDropdownFormPassword1"
                                        className="form-label">Password</Form.Label>
                                    <Form.Control type="password" className="form-control"
                                        id="exampleDropdownFormPassword1" placeholder="Password" />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="dropdownCheck" />
                                        <label className="form-check-label" htmlFor="dropdownCheck">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <SpkButton Buttonvariant='primary' Buttontype="submit">Sign in</SpkButton>
                            </Form>
                            <div className="dropdown-divider"></div>
                            <Dropdown.Item as="li" href="#!">New around here? Sign up</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Forgot password?</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6--> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Dropdown menu centered" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown11} reusableCode={reusedropdown11}>
                        <p className="card-title mb-3">Use <code>.dropdown-center</code> on the parent element.
                        </p>
                        <SpkDropdown Drop="down-centered" Toggletext="Centered dropdown" Togglevariant="primary" Menuas="ul" Id="dropdownCenterBtn" Menulabel="dropdownCenterBtn">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Action two</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Action three</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropup centered" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown12} reusableCode={reusedropdown12}>
                        <p className="card-title mb-3">Use <code>.dropup-center</code>
                            on the parent element.
                        </p>
                        <SpkDropdown Drop="up-centered" Toggletext="Centered dropup" Togglevariant="secondary" Menuas="ul" Id="dropupCenterBtn" Menulabel="dropupCenterBtn">
                            <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Action two</Dropdown.Item>
                            <Dropdown.Item as="li" href="#!">Action three</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Menu items" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown13} reusableCode={reusedropdown13}>
                        <p className="card-title mb-3">You can use <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> as
                            dropdown items.</p>
                        <SpkDropdown Toggletext="Dropdown" Togglevariant="info" Menuas="ul" Id="dropdownMenu1" Menulabel="dropdownMenu1">
                            <Dropdown.Item as="li">Action</Dropdown.Item>
                            <Dropdown.Item as="li">Another action
                            </Dropdown.Item>
                            <Dropdown.Item as="li">Something else here</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropdowns options" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown14} reusableCode={reusedropdown14}>
                        <p className="card-title mb-3">Use <code>data-bs-offset</code> or <code>data-bs-reference</code> to change
                            the location of the dropdown.</p>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                        <SpkDropdown Toggletext="Offset" Customclass="me-1" Togglevariant="primary" Menuas="ul" Id="dropdownMenuOffset" Menulabel="dropdownMenuOffset">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                            </SpkDropdown>

                            <SpkDropdown as={ButtonGroup} Buttontag={true} Buttonposition="before" Buttontext="Reference" color="info" Customtoggleclass="dropdown-toggle-split" Customclass=""
                                Togglevariant="info" Split={true} Menuas="ul">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </SpkDropdown>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-6--> */}

            {/* <!-- Start:: row-8 --> */}

            <Row>
                <Col xl={9}>
                    <ShowCode title="Alignment options" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown19} dataCode={datadropdown19} reusableCode={reusedropdown19}>
                        <div className="btn-list">
                            {AlignmentButtons.map((idx: any, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Drop={idx.dir} Customclass="mb-0" Togglevariant={idx.class} Toggletext={idx.text} Menuas="ul" Id="dropdownMenuButton" Menulabel="dropdownMenuButton">
                                        <Dropdown.Item as="li" href="#!">Menu item</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Menu item</Dropdown.Item>
                                        <Dropdown.Item as="li" href="#!">Menu item</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={3}>
                    <ShowCode title="Dark Dropdowns" customCardClass="custom-card" customCardBodyClass="custom-dark-drop" reactCode={reactdropdown20} reusableCode={reusedropdown20}>
                        <SpkDropdown Togglevariant="dark" Toggletext="Dropdown button" Menuas="ul" Menuclass="dropdown-menu-dark" Id="dropdownMenuButton3" Menulabel="dropdownMenuButton3">
                            <Dropdown.Item as="li"><Link to="#!">Action</Link></Dropdown.Item>
                            <Dropdown.Item as="li"><Link to="#!">Another action</Link></Dropdown.Item>
                            <Dropdown.Item as="li"><Link to="#!">Something else here</Link></Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-8 --> */}

            {/* <!-- Start:: row-10 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Menu alignment" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown25} reusableCode={reusedropdown25}>
                        <SpkDropdown Menualign="end" Toggletext="Right-aligned menu example" Customclass="d-inline-block" Togglevariant="primary" Customtoggleclass="d-inline-block text-wrap" Menuas="ul">
                            <Dropdown.Item as="li">Action</Dropdown.Item>
                            <Dropdown.Item as="li">Another	action</Dropdown.Item>
                            <Dropdown.Item as="li">Something else here</Dropdown.Item>
                        </SpkDropdown>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Responsive alignment end" customCardClass="custom-card responsive-button" customCardBodyClass="" reactCode={reactdropdown26} reusableCode={reusedropdown26}>
                        <SpkButtongroup>
                            <SpkDropdown as={ButtonGroup} Align={{ lg: "end" }} Toggletext="Left-aligned but right aligned when large screen" Id="dropdown-menu-align-responsive-1" Customtoggleclass="text-wrap" Customclass="text-wrap" Togglevariant="secondary" Menuas="ul">
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Responsive alignment left" customCardClass="custom-card responsive-button" customCardBodyClass="" reactCode={reactdropdown27} reusableCode={reusedropdown27}>
                        <SpkButtongroup>
                            <SpkDropdown as={ButtonGroup} Toggletext="Left-aligned but right aligned when large screen" Id="dropdown-menu-align-responsive-1"  Customtoggleclass="text-wrap" Customclass="text-wrap" Togglevariant="info" Menuas="ul">
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                            </SpkDropdown>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-10 --> */}

            {/* <!-- Start:: row-11 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Custom Dropdown Menu's" customCardClass="custom-card" customCardBodyClass="" dataCode={datadropdown28} reactCode={reactdropdown28} reusableCode={reusedropdown28}>
                        <div className="btn-list">
                            {CustomButtons.map((idx, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Togglevariant={idx.class} Toggletext={idx.text} Menuas="ul" Menuclass={idx.class1}>
                                        <li><Dropdown.Item as="a" className="dropdown-item" href="#!">Action</Dropdown.Item></li>
                                        <li><Dropdown.Item as="a" className="dropdown-item" href="#!">Another action</Dropdown.Item></li>
                                        <li><Dropdown.Item as="a" className="dropdown-item" href="#!">Something else here</Dropdown.Item></li>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Ghost Button Dropdowns" customCardClass="custom-card" customCardBodyClass="" dataCode={datadropdown29} reactCode={reactdropdown29} reusableCode={reusedropdown29}>
                        <div className="btn-list">
                            {GhostButtons.map((idx, index) => (
                                <SpkButtongroup key={index}>
                                    <SpkDropdown Togglevariant={idx.class} Toggletext={idx.text} Menuas="ul">
                                        <Dropdown.Item className="dropdown-item" href="#!">Action</Dropdown.Item>
                                        <Dropdown.Item className="dropdown-item" href="#!">Another action</Dropdown.Item>
                                        <Dropdown.Item className="dropdown-item" href="#!">Something else here</Dropdown.Item>
                                        <Dropdown.Divider className="dropdown-divider" />
                                        <Dropdown.Item className="dropdown-item" href="#!">Separated link</Dropdown.Item>
                                    </SpkDropdown>
                                </SpkButtongroup>
                            ))}
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-11 --> */}

            {/* <!-- Start:: row-9 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="non-interactive dropdown items" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown21} reusableCode={reusedropdown21}>
                        <p className="card-title mb-3">Use <code>.dropdown-item-text.</code> to create non-interactive dropdown items.</p>
                        <div className="bd-example">
                            <Dropdown.Menu className="dropdown-menu" show>
                                <Dropdown.Item as="li"><span className="dropdown-item-text px-0">Dropdown item text</span>
                                </Dropdown.Item>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropdown Headers" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown22} reusableCode={reusedropdown22}>
                        <p className="card-titlte mb-3">Add a <code>.dropdown-header</code> to label sections of actions in any dropdown menu.</p>
                        <div className="bd-example">
                            <Dropdown.Menu show>
                                <Dropdown.Header>
                                    <h6 className="dropdown-header px-0">Dropdown header</h6>
                                </Dropdown.Header>
                                <Dropdown.Item className="dropdown-item" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item" href="#!">Something else here</Dropdown.Item>
                            </Dropdown.Menu>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropdown Dividers" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown23} reusableCode={reusedropdown23}>
                        <div className="bd-example">
                            <Dropdown.Menu className="dropdown-menu" show>
                                <Dropdown.Header>Heading</Dropdown.Header>
                                <Dropdown.Item className="dropdown-item" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item" href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider className="dropdown-divider" />
                                <Dropdown.Item className="dropdown-item" href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Dropdown Menu Text" customCardClass="custom-card" customCardBodyClass="" reactCode={reactdropdown24} reusableCode={reusedropdown24}>
                        <div className="bd-example">
                            <Dropdown.Menu show className="dropdown-menu p-4 text-muted" style={{ maxWidth: 200 }}>
                                <p>
                                    Some example text that's free-flowing within the dropdown menu.
                                </p>
                                <p className="mb-0">
                                    And this is more example text.
                                </p>
                            </Dropdown.Menu>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-9 --> */}

        </Fragment>
    )
};

export default Dropdowns;