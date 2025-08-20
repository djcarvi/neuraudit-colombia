
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import * as barchartdata from "../../../../shared/data/charts/apexcharts/barchartdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface BarChartProps { }

const BarChart: React.FC<BarChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Bar Charts"} />

            <Pageheader title="Charts" currentpage="Apex Bar Charts" subtitle="Apex Charts" activepage="Apex Bar Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Basic Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-basic">
                                <Spkapexcharts chartOptions={barchartdata.Barbasicoptions} chartSeries={barchartdata.Barbasicseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Grouped Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-group">
                                <Spkapexcharts chartOptions={barchartdata.Bargroupoptions} chartSeries={barchartdata.Bargroupseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Stacked Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-stacked">
                                <Spkapexcharts chartOptions={barchartdata.Barstackoptions} chartSeries={barchartdata.Barstackseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">100% Stacked Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-full">
                                <Spkapexcharts chartOptions={barchartdata.Barstack1options} chartSeries={barchartdata.Barstck1series} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Bar Chart With Negative Values</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-negative">
                                <Spkapexcharts chartOptions={barchartdata.Barchartoptions} chartSeries={barchartdata.Barchartseries} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Bar Chart With Markers</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-markers">
                                <Spkapexcharts chartOptions={barchartdata.Barmakeroptions} chartSeries={barchartdata.Barmakerseries} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Reversed Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-reversed">
                                <Spkapexcharts chartOptions={barchartdata.Barreverseoptions} chartSeries={barchartdata.Barreverseseries} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Bar With Category DataLabels</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-categories">
                                <Spkapexcharts chartOptions={barchartdata.Barlableoptions} chartSeries={barchartdata.Barlabelseries} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Patterned Bar Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-pattern">
                                <Spkapexcharts chartOptions={barchartdata.Barpatternoptions} chartSeries={barchartdata.Barpatternseries} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Bar With Image Fill</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="bar-image">
                                <Spkapexcharts chartOptions={barchartdata.Barimgoptions} chartSeries={barchartdata.Barimgseries} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default BarChart;