
import * as chartjsdata from "../../../shared/data/charts/chartjsdata";
import React, { Fragment } from "react";
import Seo from "../../../shared/layouts-components/seo/seo";
import { Card, Col, Row } from "react-bootstrap";
import SpkChartJs from "../../../shared/@spk-reusable-components/reusable-plugins/spk-chartjs";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";

interface ChartjsChartsProps { }

const ChartjsCharts: React.FC<ChartjsChartsProps> = () => {

    return (

        <Fragment>

            <Seo title={"Chartjs Charts"} />

            <Pageheader title="Charts" currentpage="ChartJs Charts" activepage="ChartJs Charts" />

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Line Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="line" chartOptions={chartjsdata.Option} chartSeries={chartjsdata.Data} height='300px' />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="bar" chartOptions={chartjsdata.Option1} chartSeries={chartjsdata.Data1} height='300px' />

                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Pie Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="pie" chartOptions={chartjsdata.Option2} chartSeries={chartjsdata.Data2} height='300px' />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Doughnut Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="doughnut" chartOptions={chartjsdata.Option3} chartSeries={chartjsdata.Data3} height='300px' />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Polar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="polarArea" chartOptions={chartjsdata.Option5} chartSeries={chartjsdata.Data5} height='300px' />

                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Radial Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="radar" chartOptions={chartjsdata.Option6} chartSeries={chartjsdata.Data6} height='300px' />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Scatter Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="scatter" chartOptions={chartjsdata.Option7} chartSeries={chartjsdata.Data7} height='300px' />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Chartjs Bubble Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <SpkChartJs id="chartjs-charts" type="bubble" chartOptions={chartjsdata.Option8} chartSeries={chartjsdata.Data8} height='300px' />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ChartjsCharts;