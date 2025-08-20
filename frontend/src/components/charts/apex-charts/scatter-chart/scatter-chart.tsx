
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Scatterboptions, Scatterbseries, Scatterdateoptions, Scatterdateseries, Scatterfilloptions, Scatterfillseries } from "../../../../shared/data/charts/apexcharts/scatterchartdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface ScatterChartProps { }

const ScatterChart: React.FC<ScatterChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Scatter Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Scatter Charts" activepage="Apex Scatter Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="scatter-basic">
                                <Spkapexcharts chartOptions={Scatterboptions} chartSeries={Scatterbseries} type="scatter" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Datetime Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="scatter-datetime">
                                <Spkapexcharts chartOptions={Scatterdateoptions} chartSeries={Scatterdateseries} type="scatter" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Image Fill Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="scatter-image">
                                <Spkapexcharts chartOptions={Scatterfilloptions} chartSeries={Scatterfillseries} type="scatter" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ScatterChart;