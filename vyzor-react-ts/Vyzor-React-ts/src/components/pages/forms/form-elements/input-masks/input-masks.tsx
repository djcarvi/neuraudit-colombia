
import React, { type ChangeEvent, Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { InputMask } from "@react-input/mask";
import { NumericFormat } from "react-number-format";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";

interface InputMasksProps { }

const InputMasks: React.FC<InputMasksProps> = () => {

    const [licensePlate, setLicensePlate] = useState("");
    const handleLicensePlateChange = (e: ChangeEvent<HTMLInputElement>) => {
        let inputText = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        inputText = inputText.slice(0, 14);
        const formattedText = formatLicensePlate(inputText);
        setLicensePlate(formattedText);
    };

    const formatLicensePlate = (inputText: string): string => {
        const formattedText = inputText
            .split("")
            .map((char, index) => (index % 4 === 0 && index !== 0 ? ` ${char}` : char))
            .join("");
        return formattedText;
    };
    const [value1, setValue1] = useState("");

    function onChange1(event: { target: { value: React.SetStateAction<string>; }; }) {
        setValue1(event.target.value);
    }

    const [value2, setValue2] = useState("");

    function onChange2(event: { target: { value: React.SetStateAction<string>; }; }) {
        setValue2(event.target.value);
    }

    const [value3, setValue3] = useState("");

    function onChange3(event: { target: { value: React.SetStateAction<string>; }; }) {
        setValue3(event.target.value);
    }

    const [value4, setValue4] = useState("");

    function onChange4(event: { target: { value: React.SetStateAction<string>; }; }) {
        setValue4(event.target.value);
    }

    const [value5, setValue5] = useState("");

    function onChange5(event: { target: { value: React.SetStateAction<string>; }; }) {
        setValue5(event.target.value);
    }

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Inputmasks" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Input Masks" activepage="Input Masks" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Date Format-1
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <InputMask className="form-control date-format" mask="dd-mm-yyyy" replacement={{ d: /\d/, m: /\d/, y: /\d/ }} placeholder="DD-MM-YYYY" separate value={value1} onChange={onChange1} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Date Format-2
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <InputMask className="form-control date-format1" mask="dd-mm" replacement={{ d: /\d/, m: /\d/, y: /\d/ }} placeholder="DD-MM" value={value2} onChange={onChange2} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Date Format-3
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <InputMask className="form-control date-format" mask="dd-yy" replacement={{ d: /\d/, y: /\d/ }} placeholder="MM-YY" value={value3} onChange={onChange3} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Number Formatting
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <NumericFormat className='form-control'  allowLeadingZeros thousandsGroupStyle="lakh" thousandSeparator=","  placeholder="Number Here"/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Time Format-1
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <InputMask className="form-control date-format" mask="99:99:99" replacement={{ 9: /\d/ }} placeholder="hh:mm:ss" value={value4} onChange={onChange4} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Time Format-2
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <InputMask className="form-control date-format" mask="99:99" replacement={{ 9: /\d/ }} placeholder="hh:mm" value={value5} onChange={onChange5} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Formatting Into Blocks
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Control className="form-control formatting-blocks" id="licensePlate" value={licensePlate} onChange={handleLicensePlateChange} placeholder="ABCD EFG HIJ KLMN" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default InputMasks;