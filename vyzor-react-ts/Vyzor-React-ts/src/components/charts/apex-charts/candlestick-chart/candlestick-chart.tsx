
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";

import { Candbasicoptions, Candbasicseries, CandeoptionsBar, Candlineoptions, Candlineseries, CandseriesBar, Candsyncedseries, Candsyncoptions } from "../../../../shared/data/charts/apexcharts/candlestickdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface CandlestickChartProps { }

const CandlestickChart: React.FC<CandlestickChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Apex Candlestick Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Candlestick Charts" activepage="Apex Candlestick Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Basic Candlestick Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="candlestick-basic">
                                <Spkapexcharts chartOptions={Candbasicoptions} chartSeries={Candbasicseries} type="candlestick" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Candlestick Synced With Brush Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="chart-candlestick">
                                <Spkapexcharts chartOptions={Candsyncoptions} chartSeries={Candsyncedseries} type="candlestick" width={"100%"} height={215} />
                            </div>
                            <div id="chart-bar">
                                <Spkapexcharts chartOptions={CandeoptionsBar} chartSeries={CandseriesBar} type="bar" width={"100%"} height={120} />
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
              
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Candlestick With Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="candlestick-line">
                                <Spkapexcharts chartOptions={Candlineoptions} chartSeries={Candlineseries} type="candlestick" width={"100%"} height={350} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )

};

export default CandlestickChart;