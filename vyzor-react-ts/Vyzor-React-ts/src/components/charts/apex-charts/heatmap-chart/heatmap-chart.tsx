
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Heatboptions, Heatbseries, Heatmultioptions, Heatmultiseries, Heatrangeoptions, Heatrangeseries, Heatshadeoptions, Heatshadeseries } from "../../../../shared/data/charts/apexcharts/heatmapdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface HeatmapChartProps { }

const HeatmapChart: React.FC<HeatmapChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Heatmap Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Heatmap Charts" activepage="Apex Heatmap Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Heatmap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="heatmap-basic">
                                <Spkapexcharts chartOptions={Heatboptions} chartSeries={Heatbseries} type="heatmap" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Multi Series Heatmap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="heatmap-multiseries">
                                <Spkapexcharts chartOptions={Heatmultioptions} chartSeries={Heatmultiseries} type="heatmap" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Color Range Heatmap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="heatmap-colorrange">
                                <Spkapexcharts chartOptions={Heatrangeoptions} chartSeries={Heatrangeseries} type="heatmap" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Heatmap Range Without Shades</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="heatmap-range">
                                <Spkapexcharts chartOptions={Heatshadeoptions} chartSeries={Heatshadeseries} type="heatmap" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default HeatmapChart;