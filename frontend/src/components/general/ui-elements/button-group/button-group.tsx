
import SpkButtongroup from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttongroup";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { btngroup1, btngroup10, btngroup11, btngroup2, btngroup3, btngroup4, btngroup5, btngroup6, btngroup7, btngroup8, btngroup9, datagroup10, reusebtngroup1, reusebtngroup10, reusebtngroup11, reusebtngroup2, reusebtngroup3, reusebtngroup4, reusebtngroup5, reusebtngroup6, reusebtngroup7, reusebtngroup8, reusebtngroup9 } from "../../../../shared/data/prism-code/uielements-prism";
import { SocialIconButtons } from "../../../../shared/data/general/ui-elements/buttonsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { ButtonGroup, ButtonToolbar, Col, Dropdown, DropdownButton, Form, InputGroup, Row } from "react-bootstrap";

interface ButtonGroupsProps { }

const ButtonGroups: React.FC<ButtonGroupsProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Uielements-Button Group" />

            <Pageheader title="Ui Elements" currentpage="Button Group" activepage="Button Group" />

            {/* <!-- Page Header Close --> */}

            {/* <!--ROW-START--> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Basic example" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup1} reusableCode={reusebtngroup1}>
                        <SpkButtongroup Buttongrplabel="Basic example">
                            <SpkButton Buttonvariant="info" Buttontype="button"><i className="bi bi-skip-backward"></i></SpkButton>
                            <SpkButton Buttonvariant="info" Buttontype="button"><i className="bi bi-pause"></i></SpkButton>
                            <SpkButton Buttonvariant="info" Buttontype="button"><i className="bi bi-skip-forward"></i></SpkButton>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Navigation" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup3} reusableCode={reusebtngroup3}>
                        <SpkButtongroup>
                            <SpkButton Buttonvariant='primary' Active={true} Navigate="#!" >Active link</SpkButton>
                            <SpkButton Buttonvariant='primary' Navigate="#!">Link</SpkButton>
                            <SpkButton Buttonvariant='primary' Navigate="#!" >Link</SpkButton>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Mixed Style" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup6} reusableCode={reusebtngroup6}>
                        <SpkButtongroup Buttongrplabel="Basic mixed styles example">
                            <SpkButton Buttonvariant="danger" Buttontype="button">Left</SpkButton>
                            <SpkButton Buttonvariant="warning" Buttontype="button">Middle</SpkButton>
                            <SpkButton Buttonvariant="success" Buttontype="button">Right</SpkButton>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Outline styled" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup4} reusableCode={reusebtngroup4}>
                        <SpkButtongroup Buttongrplabel="Basic outlined example">
                            <SpkButton Buttonvariant="outline-primary" Buttontype="button">Left</SpkButton>
                            <SpkButton Buttonvariant="outline-primary" Buttontype="button">Middle</SpkButton>
                            <SpkButton Buttonvariant="outline-primary" Buttontype="button">Right</SpkButton>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Checkbox button groups" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup2} reusableCode={reusebtngroup2}>

                        <SpkButtongroup Buttongrplabel="Basic checkbox toggle button group" Customclass="checkbox-toggle">
                            <input type="checkbox" className="btn-check" id="btncheck1" />
                            <label className="btn btn-outline-primary" htmlFor="btncheck1">Checkbox 1</label>

                            <input type="checkbox" className="btn-check" id="btncheck2" />
                            <label className="btn btn-outline-primary" htmlFor="btncheck2">Checkbox 2</label>

                            <input type="checkbox" className="btn-check" id="btncheck3" />
                            <label className="btn btn-outline-primary" htmlFor="btncheck3">Checkbox 3</label>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title=" Radio button groups" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup5} reusableCode={reusebtngroup5}>
                        <SpkButtongroup Buttongrplabel="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1"
                                defaultChecked />
                            <label className="btn btn-outline-primary" htmlFor="btnradio1">Radio 1</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2"
                            />
                            <label className="btn btn-outline-primary" htmlFor="btnradio2">Radio 2</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3"
                            />
                            <label className="btn btn-outline-primary" htmlFor="btnradio3">Radio 3</label>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Sizing" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup11} reusableCode={reusebtngroup11}>
                        <SpkButtongroup Size="lg" Customclass="my-1 me-3" Buttongrplabel="Large button group">
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Left</SpkButton>
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Middle</SpkButton>
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Right</SpkButton>
                        </SpkButtongroup>
                        <SpkButtongroup Customclass="my-1 me-3" Buttongrplabel="Default button group">
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Left</SpkButton>
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Middle</SpkButton>
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Right</SpkButton>
                        </SpkButtongroup>
                        <SpkButtongroup Size="sm" Customclass="my-1 me-1" Buttongrplabel="Small button group">
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Left</SpkButton>
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Middle</SpkButton>
                            <SpkButton Buttonvariant="outline-success" Buttontype="button">Right</SpkButton>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Button toolbar" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup8} reusableCode={reusebtngroup8}>
                        <ButtonToolbar className="mb-4" role="toolbar"
                            aria-label="Toolbar with button groups">
                            <SpkButtongroup Customclass="me-2 my-1" Buttongrplabel="First group">
                                <SpkButton Buttonvariant="primary" Buttontype="button">1</SpkButton>
                                <SpkButton Buttonvariant="primary" Buttontype="button">2</SpkButton>
                                <SpkButton Buttonvariant="primary" Buttontype="button">3</SpkButton>
                                <SpkButton Buttonvariant="primary" Buttontype="button">4</SpkButton>
                            </SpkButtongroup>
                            <SpkButtongroup Customclass="me-2 my-1" Buttongrplabel="Second group">
                                <SpkButton Buttonvariant="secondary" Buttontype="button">5</SpkButton>
                                <SpkButton Buttonvariant="secondary" Buttontype="button">6</SpkButton>
                                <SpkButton Buttonvariant="secondary" Buttontype="button">7</SpkButton>
                            </SpkButtongroup>
                            <SpkButtongroup Customclass="my-1" Buttongrplabel="Third group">
                                <SpkButton Buttonvariant="info" Buttontype="button">8</SpkButton>
                            </SpkButtongroup>
                        </ButtonToolbar>
                        <ButtonToolbar className="mb-3" role="toolbar"
                            aria-label="Toolbar with button groups">
                            <SpkButtongroup Customclass="me-2 my-1" Buttongrplabel="First group">
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">1</SpkButton>
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">2</SpkButton>
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">3</SpkButton>
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">4</SpkButton>
                            </SpkButtongroup>
                            <InputGroup>
                                <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>
                                <Form.Control type="text"
                                    placeholder="Input group example"
                                    aria-label="Input group example"
                                    aria-describedby="btnGroupAddon" />
                            </InputGroup>
                        </ButtonToolbar>
                        <ButtonToolbar className="justify-content-between" role="toolbar"
                            aria-label="Toolbar with button groups">
                            <SpkButtongroup Customclass="my-1" Buttongrplabel="First group">
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">1</SpkButton>
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">2</SpkButton>
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">3</SpkButton>
                                <SpkButton Buttonvariant="outline-secondary" Buttontype="button">4</SpkButton>
                            </SpkButtongroup>
                            <InputGroup>
                                <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
                                <Form.Control type="text"
                                    placeholder="Input group example"
                                    aria-label="Input group example"
                                    aria-describedby="btnGroupAddon2" />
                            </InputGroup>
                        </ButtonToolbar>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Nesting" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup9} reusableCode={reusebtngroup9}>
                        <SpkButtongroup Customclass="" Buttongrplabel="Button group with nested dropdown">
                            <SpkButton Buttonvariant="primary" Buttontype="button">1</SpkButton>
                            <SpkButton Buttonvariant="primary" Buttontype="button">2</SpkButton>

                            <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-nested-dropdown">
                                <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                            </DropdownButton>
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Vertical variation" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup7} reusableCode={reusebtngroup7}>
                        <div className="row gap-2">
                            <Col sm={3}>
                                <SpkButtongroup Vertical={true} Buttongrplabel="Vertical button group">
                                    <SpkButton Buttonvariant="primary" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="primary" Buttontype="button">Button</SpkButton>
                                    <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-vertical-dropdown-1">
                                        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                                    </DropdownButton>
                                    <SpkButton Buttonvariant="primary" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="primary" Buttontype="button">Button</SpkButton>
                                    <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-vertical-dropdown-1">
                                        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                                    </DropdownButton>
                                    <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-vertical-dropdown-1">
                                        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                                    </DropdownButton>
                                    <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-vertical-dropdown-1">
                                        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                                    </DropdownButton>
                                </SpkButtongroup>
                            </Col>
                            <Col sm={3}>
                                <SpkButtongroup Vertical={true} Buttongrplabel="Vertical button group">
                                    <SpkButton Buttonvariant="info" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="info" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="info" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="info" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="info" Buttontype="button">Button</SpkButton>
                                    <SpkButton Buttonvariant="info" Buttontype="button">Button</SpkButton>
                                </SpkButtongroup>
                            </Col>
                            <Col sm={3}>
                                <SpkButtongroup Vertical={true} Buttongrplabel="Vertical radio toggle button group">
                                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" defaultChecked />
                                    <label className="btn btn-outline-danger" htmlFor="vbtn-radio1">Radio 1</label>
                                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" />
                                    <label className="btn btn-outline-danger" htmlFor="vbtn-radio2">Radio 2</label>
                                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" />
                                    <label className="btn btn-outline-danger" htmlFor="vbtn-radio3">Radio 3</label>
                                </SpkButtongroup>
                            </Col>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Social Group Buttons" customCardClass="custom-card" customCardBodyClass="" reactCode={btngroup10} dataCode={datagroup10} reusableCode={reusebtngroup10}>
                        <SpkButtongroup Buttongrplabel="Basic example">
                            {SocialIconButtons.map((idx, index) => (
                                <SpkButton Buttonvariant={idx.class1} Customclass="btn-icon" key={index}>
                                    <i className={`ri-${idx.class}-line lh-1`}></i>
                                </SpkButton>
                            ))}
                        </SpkButtongroup>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!--ROW-END--> */}

        </Fragment>
    )
};

export default ButtonGroups;