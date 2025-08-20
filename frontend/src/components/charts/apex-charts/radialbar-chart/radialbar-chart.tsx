
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import * as radialdata from "../../../../shared/data/charts/apexcharts/radialbardata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface RadialbarChartProps { }

const RadialbarChart: React.FC<RadialbarChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Radialbar Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Radialbar Charts" activepage="Apex Radialbar Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Basic Pie Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="radialbar-basic">
                                <Spkapexcharts chartOptions={radialdata.Pieoptions} chartSeries={radialdata.Pieseries} type="radialBar" width={"100%"} height={300} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Multiple Radialbar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="radialbar-multiple">
                                <Spkapexcharts chartOptions={radialdata.Multiroptions} chartSeries={radialdata.Multirseries} type="radialBar" width={"100%"} height={300} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Circle Chart - Custom Angle</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="circle-custom">
                                <Spkapexcharts chartOptions={radialdata.Customoptions} chartSeries={radialdata.Customseries} type="radialBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Gradient Circle Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="gradient-circle">
                                <Spkapexcharts chartOptions={radialdata.Gradientoptions} chartSeries={radialdata.Gradientseries} type="radialBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Stroked Circular Gauge</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="circular-stroked">
                                <Spkapexcharts chartOptions={radialdata.Strokeoptions} chartSeries={radialdata.Storkeseries} type="radialBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Circle Chart With Image</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="circle-image">
                                <Spkapexcharts chartOptions={radialdata.Circleoptions} chartSeries={radialdata.Circleseries} type="radialBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Semi Circular Gauge</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="circular-semi">
                                <Spkapexcharts chartOptions={radialdata.Gaugeoptions} chartSeries={radialdata.Gaugeseries} type="radialBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default RadialbarChart;