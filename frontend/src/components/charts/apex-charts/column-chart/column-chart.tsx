
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import * as columndata from "../../../../shared/data/charts/apexcharts/columnchartdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface ColumnChartProps { }

const ColumnChart: React.FC<ColumnChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Apex Column Charts"} />

            <Pageheader title="Apex Charts" currentpage="Apex Column Charts" subtitle="Apex Charts" activepage="Apex Column Charts" />


            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Basic Column Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-basic">
                                <Spkapexcharts chartOptions={columndata.Columnbasicoptions} chartSeries={columndata.Columnbasicseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Column Chart With Datalabels</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-datalabels">
                                <Spkapexcharts chartOptions={columndata.Columnchartoptions} chartSeries={columndata.Columnchartseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Stacked Column Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-stacked">
                                <Spkapexcharts chartOptions={columndata.Stackcolumnoptions} chartSeries={columndata.Stackcolumnseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">100% Stacked Column Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-stacked-full">
                                <Spkapexcharts chartOptions={columndata.Columnstack1options} chartSeries={columndata.Columnstack1series} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Column Chart With Markers</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-markers">
                                <Spkapexcharts chartOptions={columndata.Columnmakeroptions} chartSeries={columndata.Columnmakerseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Column Chart With Rotated Labels</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-rotated-labels">
                                <Spkapexcharts chartOptions={columndata.Columnrotateoptions} chartSeries={columndata.Columnrotateseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Column Chart With Negative Values</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-negative">
                                <Spkapexcharts chartOptions={columndata.Columnvalueoptions} chartSeries={columndata.Columnvalueseries} type="bar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Range Column Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-range">
                                <Spkapexcharts chartOptions={columndata.Columnoptions} chartSeries={columndata.Columnseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Distributed Columns Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="columns-distributed">
                                <Spkapexcharts chartOptions={columndata.Column1options} chartSeries={columndata.Column1series} type="bar" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ColumnChart;