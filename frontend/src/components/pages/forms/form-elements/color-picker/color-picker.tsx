
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { ColorPicker, useColor } from "react-color-palette";

import { ChromePicker } from 'react-color';
import ShowCode from "../../../../../shared/layouts-components/showcode/showcode";
import { Colorpicker } from "../../../../../shared/data/prism-code/forms-prism";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface ColorPickersProps { }

const ColorPickers: React.FC<ColorPickersProps> = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    //color picker
    const [color, setColor] = useColor("#561ecb");

    //color picker
    const [color2, setColor2] = useState<any>("#6c5ffc");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const handleChangeComplete = (color: any) => {
        console.log(color);
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Color Pickers" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Color Pickers" activepage="Color Pickers" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Classic
                            </div>
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-between flex-wrap">
                            <Col xl={3}  md={4} className="mt-2">
                                <SpkButton Buttonvariant="primary" onClickfunc={toggleVisibility} Customclass='btn !py-1 !px-2 mb-2 !text-[0.75rem] !m-0 !gap-0 !font-medium'>
                                    <i className="ri-palette-line"></i>
                                </SpkButton>
                                {isVisible && (
                                    <ColorPicker color={color} onChange={setColor} hideInput={["hex", "hsv"]} />
                                )}
                            </Col>
                            <Col  xl={6} className="mt-2">
                                <SpkButton Buttonvariant="primary" Customclass='pcr-button btn-md mb-3' onClickfunc={() => setShowColorPicker(showColorPicker => !showColorPicker)}>{showColorPicker ? "Close Picker" : "Pick Color"}</SpkButton>
                                {showColorPicker && (<ChromePicker disableAlpha={true} color={color2} onChange={(updatedColor: { hex: any; }) => setColor2(updatedColor.hex)} onChangeComplete={handleChangeComplete} />
                                )}
                            </Col>

                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={12}>
                    <ShowCode title="Bootstrap Color Picker" customCardClass="custom-card" customCardBodyClass="" reactCode={Colorpicker}>
                        <Form.Control type="color" className="form-control-color border-0" id="exampleColorInput" defaultValue="#136ad0" title="Choose your color" />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ColorPickers;