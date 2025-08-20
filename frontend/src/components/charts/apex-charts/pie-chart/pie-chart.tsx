
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Basicpieoptions, Basicpieseries, Donutoptions, Donutseries, Piechartoptions, Piechartseries, Piegardientoptions, Piegradientseries, Pieimgoptions, Pieimgseries, Piemonooptions, Piemonoseries, Updatedoptions, Updatedseries } from "../../../../shared/data/charts/apexcharts/piechartdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface PieChartProps { }

const PieChart: React.FC<PieChartProps> = () => {

    const [state, setState] = useState({ series: Updatedseries });

    const appendData = () => {
        const newSeries = [...state.series, Math.floor(Math.random() * 100) + 1];
        setState({ series: newSeries });
    };

    const removeData = () => {
        if (state.series.length > 1) {
            const newSeries = state.series.slice(0, -1);
            setState({ series: newSeries });
        }
    };

    const randomize = () => {
        const newSeries = state.series.map(() => Math.floor(Math.random() * 100) + 1);
        setState({ series: newSeries });
    };

    const reset = () => {
        setState({ series: Updatedseries });
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Pie Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Pie Charts" activepage="Apex Pie Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Pie Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="pie-basic">
                                <Spkapexcharts chartOptions={Basicpieoptions} chartSeries={Basicpieseries} type="pie" width={"100%"} height={300} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Simple Donut Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="donut-simple">
                                <Spkapexcharts chartOptions={Donutoptions} chartSeries={Donutseries} type="donut" width={"100%"} height={300} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Updating Donut Chart</Card.Title>
                        </Card.Header>
                        <div className="card-body mx-auto">
                            <div id="donut-update">
                                <Spkapexcharts chartOptions={Updatedoptions} chartSeries={state.series} type="donut" width={"100%"} height={250} />
                                <div className="text-center mt-4">
                                    <SpkButton Size="sm" Buttonvariant="primary" Customclass="m-1" onClickfunc={appendData}>
                                        + ADD
                                    </SpkButton>
                                    &nbsp;
                                    <SpkButton Size="sm" Buttonvariant="primary" Customclass="m-1" onClickfunc={removeData}>
                                        - REMOVE
                                    </SpkButton>
                                    &nbsp;
                                    <SpkButton Size="sm" Buttonvariant="primary" Customclass="m-1" onClickfunc={randomize}>
                                        RANDOMIZE
                                    </SpkButton>
                                    &nbsp;
                                    <SpkButton Size="sm" Buttonvariant="primary" Customclass="m-1" onClickfunc={reset}>
                                        RESET
                                    </SpkButton>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Monochrome Pie Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="pie-monochrome">
                                <Spkapexcharts chartOptions={Piemonooptions} chartSeries={Piemonoseries} type="pie" width={"100%"} height={310} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Gradient Donut Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="donut-gradient">
                                <Spkapexcharts chartOptions={Piegardientoptions} chartSeries={Piegradientseries} type="donut" width={"100%"} height={300} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Donut Chart With Patterns</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            <div id="donut-pattern">
                                <Spkapexcharts chartOptions={Piechartoptions} chartSeries={Piechartseries} type="donut" width={"100%"} height={250} />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Image Filled Pie Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="pie-image">
                                <Spkapexcharts chartOptions={Pieimgoptions} chartSeries={Pieimgseries} type="pie" width={"100%"} height={300} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default PieChart;