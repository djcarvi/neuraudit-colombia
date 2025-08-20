
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Mixedareaoptions, Mixedareaseries, Mixedaxisoptions, Mixedaxisseries, Mixedcolumnoptions, Mixedcolumnseries, Mixedlineoptions, Mixedlineseries } from "../../../../shared/data/charts/apexcharts/mixedchartsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface MixedChartProps { }

const MixedChart: React.FC<MixedChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Apex Mixed Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Mixed Charts" activepage="Apex Mixed Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Line & Column Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="mixed-linecolumn">
                                <Spkapexcharts chartOptions={Mixedlineoptions} chartSeries={Mixedlineseries} type="line" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Multiple Y-Axis Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="mixed-multiple-y">
                                <Spkapexcharts chartOptions={Mixedaxisoptions} chartSeries={Mixedaxisseries} type="line" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Line & Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="mixed-linearea">
                                <Spkapexcharts chartOptions={Mixedareaoptions} chartSeries={Mixedareaseries} type="line" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Line,Column & Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="mixed-all">
                                <Spkapexcharts chartOptions={Mixedcolumnoptions} chartSeries={Mixedcolumnseries} type="line" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default MixedChart;