
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Areaoptions, Areaseries, Monooptions, Monoseries } from "../../../../shared/data/charts/apexcharts/polarareadata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface PolarareaChartProps { }

const PolarareaChart: React.FC<PolarareaChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Apex Polar Area Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Polar Area Charts" activepage="Apex Polar Area Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Polar Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="polararea-basic">
                                <Spkapexcharts chartOptions={Areaoptions} chartSeries={Areaseries} type="polarArea" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Polar Area Monochrome Chart</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="polararea-monochrome">
                                <Spkapexcharts chartOptions={Monooptions} chartSeries={Monoseries} type="polarArea" width={"100%"} height={320} />

                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default PolarareaChart;