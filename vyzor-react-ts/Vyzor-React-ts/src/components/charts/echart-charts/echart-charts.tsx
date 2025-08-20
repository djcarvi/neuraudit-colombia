
import SpkEcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-echarts";
import * as echartsdata from "../../../shared/data/charts/echartsdata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface EchartChartsProps { }

const EchartCharts: React.FC<EchartChartsProps> = () => {

    return (

        <Fragment>

            <Seo title={"Echarts"} />

            <Pageheader title="Charts" currentpage="Echart Charts" activepage="Echart Charts" />

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Lineoption} chartSeries={echartsdata.Lineseries} id="echart-basic-line" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Smoothed Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Smoothoption} chartSeries={echartsdata.Smoothseries} id="echart-smoothed-line" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>
                                Basic Area Chart
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Basicoption} chartSeries={echartsdata.Basicseries} id="echart-area-line" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Stacked Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Stackoption} chartSeries={echartsdata.Stackseries} id="echart-stacked-line" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Stacked Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Stackareaoption} chartSeries={echartsdata.Stackareaseries} id="echart-stacked-area" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Step Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Stepoption} chartSeries={echartsdata.Stepseries} id="echart-step-line" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Bar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Baroption} chartSeries={echartsdata.Barseries} id="echart-bar-basic" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Bar With Background Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Backoption} chartSeries={echartsdata.Backseries} id="echart-bar-background" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Style For a Single Bar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Styleoption} chartSeries={echartsdata.Styleseries} id="echart-bar-single" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Water Fall Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Wateroption} chartSeries={echartsdata.Waterseries} id="echart-waterfall" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Bar With Negative Values Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Negativeoption} chartSeries={echartsdata.Negativeseries} id="echart-negative-values" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Horizontal Bar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Horizontaloption} chartSeries={echartsdata.Horizontalseries} id="echart-bar-horizontal" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Horizontal Stacked Bar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.HoriStackoption} chartSeries={echartsdata.HoriStackseries} id="echart-stacked-horizontal" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Pie Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Pieoption} chartSeries={echartsdata.Pieseries} id="echart-pie" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Doughnut Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Doughnutoption} chartSeries={echartsdata.Doughnutseries} id="echart-doughnut" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Scattoption} chartSeries={echartsdata.Scattseries} id="echart-scatter" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Bubble Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Bubbleoption} chartSeries={echartsdata.Bubbleseries} id="echart-bubble" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Candlestick Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Candleoption} chartSeries={echartsdata.Candleseries} id="echart-candlestick" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Radar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Radaroption} chartSeries={echartsdata.Radarseries} id="echart-basic-radar" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Heatmap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Heatoption} chartSeries={echartsdata.Heatseries} id="echart-heatmap" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Treemap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Treeoption} chartSeries={echartsdata.Treeseries} id="echart-treemap" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Funnel Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Funneloption} chartSeries={echartsdata.Funnelseries} id="echart-funnel" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Gauge Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Gaugeoption} chartSeries={echartsdata.Gaugeseries} id="echart-gauge-basic" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Simple Graph Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SpkEcharts chartOptions={echartsdata.Graphoption} chartSeries={echartsdata.Graphseries} id="echart-simple-graph" mainClass="echart-charts" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default EchartCharts;