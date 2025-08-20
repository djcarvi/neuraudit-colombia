
import React, { Fragment } from "react";
import { connect } from "react-redux";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import RangeSlider from "react-range-slider-input";
import { Card, Col, Form, Row } from "react-bootstrap";
import ShowCode from "../../../../../shared/layouts-components/showcode/showcode";
import { rangeslider1, rangeslider2, rangeslider3, rangeslider4 } from "../../../../../shared/data/prism-code/forms-prism";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";
import LabeledTwoThumbs, { Marks } from "../../../../../shared/data/pages/forms/rangesliderdata";

const AirbnbSlider = styled(Slider)(({ theme }) => ({
    color: "var(--primaru-color)",
    height: 3,
    padding: "13px 0",
    "& .MuiSlider-thumb": {
        height: 27,
        width: 27,
        backgroundColor: "var(--custom-white)",
        border: "1px solid var(--primary-color)",
        "&:hover": {
            boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
        },
        "& .airbnb-bar": {
            height: 9,
            width: 1,
            backgroundColor: "var(--primary-color)",
            marginLeft: 1,
            marginRight: 1,
        },
    },
    "& .MuiSlider-track": {
        height: 3,
    },
    "& .MuiSlider-rail": {
        color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
        backgroundColor: "var(--default-background)",
        opacity: theme.palette.mode === "dark" ? undefined : 1,
        height: 3,
    },
}));

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> { }
function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <span className="airbnb-bar" />
            <span className="airbnb-bar" />
            <span className="airbnb-bar" />
        </SliderThumb>
    );
}

interface RangeSlidersProps { }

const RangeSliders: React.FC<RangeSlidersProps> = ({ local_varaiable }: any) => {

    function valuetext(value: number) {
        return `${value}°C`;
    }

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Range Slider" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Range Slider" activepage="Range Slider" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <h6 className="mb-3">Default:</h6>
            <Row>
                <Col xl={6}>
                    <ShowCode title="Default Range" customCardClass="custom-card" customCardBodyClass="" reactCode={rangeslider1}>
                        <Form.Range className="" id="customRange1" />
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Range With Min and Max Values" customCardClass="custom-card" customCardBodyClass="" reactCode={rangeslider3}>
                        <Form.Range className="" min="0" max="5" id="customRange2" />
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Disabled Range" customCardClass="custom-card" customCardBodyClass="" reactCode={rangeslider2}>
                        <Form.Range className="" id="disabledRange" disabled />
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Range With Steps" customCardClass="custom-card" customCardBodyClass="" reactCode={rangeslider4}>
                        <Form.Range className="" min="0" max="5" step="0.5" id="customRange3" />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <h6 className="mb-3">noUiSlider:</h6>
            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Default-Styling
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="slider">
                                <Box sx={{ m: 3 }} />
                                <AirbnbSlider slots={{ thumb: AirbnbThumbComponent }} getAriaLabel={(index) => (index === 0 ? "Minimum price" : "Maximum price")} defaultValue={[10, 90]} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Rounded Styling
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="slider-round" className="m-4">
                                <RangeSlider className="single-thumb" defaultValue={[0, 50]} thumbsDisabled={[true, false]} rangeSlideDisabled={true} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Fit Handles
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="slider-fit">
                                <AirbnbSlider slots={{ thumb: AirbnbThumbComponent }} getAriaLabel={(index) => (index === 0 ? "Minimum price" : "Maximum price")} defaultValue={[10, 90]} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Square Styling
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="slider-square" className="m-3">
                                <RangeSlider className="square-thumb" defaultValue={[0, 50]} thumbsDisabled={[true, false]} rangeSlideDisabled={true} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Soft Limits</div>
                        </Card.Header>
                        <Card.Body className="pb-5">
                            <div id="soft">
                                <Marks rtl={local_varaiable.dir == "rtl"} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Toggle Movement By Clicking Pips</div>
                        </Card.Header>
                        <Card.Body className="pb-5">
                            <div id="slider-pips">
                                <LabeledTwoThumbs rtl={local_varaiable.dir == "rtl"} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <h6 className="mb-3">noUiSlider Colors:</h6>
            <Row>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Primary
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="primary-colored-slider">
                                <Slider aria-label="Temperature" defaultValue={30} getAriaValueText={valuetext} style={{ color: "var(--primary-color)" }} className='' /></div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Secondary
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="secondary-colored-slider">
                                <Slider aria-label="Temperature" defaultValue={30} getAriaValueText={valuetext} style={{ color: "rgb(var(--secondary-rgb))" }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Warning
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="warning-colored-slider">
                                <Slider aria-label="Temperature" defaultValue={30} getAriaValueText={valuetext} style={{ color: "rgb(var(--warning-rgb))" }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Info
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="info-colored-slider">
                                <Slider aria-label="Temperature" defaultValue={30} getAriaValueText={valuetext} style={{ color: "rgb(var(--info-rgb))" }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Success
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="success-colored-slider">
                                <Slider aria-label="Temperature" defaultValue={30} getAriaValueText={valuetext} style={{ color: "rgb(var(--success-rgb))" }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Danger
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="danger-colored-slider">
                                <Slider aria-label="Temperature" defaultValue={30} getAriaValueText={valuetext} style={{ color: "rgb(var(--danger-rgb))" }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

        </Fragment>
    )
};

const mapStateToProps = (state: any) => ({
    local_varaiable: state
});

export default connect(mapStateToProps, {})(RangeSliders);