
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import * as timelinedata from "../../../../shared/data/charts/apexcharts/timelinechartdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface TimelineChartProps { }

const TimelineChart: React.FC<TimelineChartProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Apex Timeline Charts"} />

            <Pageheader title="Apex Charts" subtitle="Apex Charts" currentpage="Apex Timeline Charts" activepage="Apex Timeline Charts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Basic Timeline Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-basic">
                                <Spkapexcharts chartOptions={timelinedata.Timelineoptions} chartSeries={timelinedata.Timelineseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Multiple Colored Timeline Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-colors">
                                <Spkapexcharts chartOptions={timelinedata.Timecoloroptions} chartSeries={timelinedata.Timecolorseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Multi Series Timeline Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-multi">
                                <Spkapexcharts chartOptions={timelinedata.Timemultioptions} chartSeries={timelinedata.Timemultiseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Advanced Timeline Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-advanced">
                                <Spkapexcharts chartOptions={timelinedata.Timeadvanceoptions} chartSeries={timelinedata.Timeadvanceseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Timeline-Grouped Rows</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-grouped">
                                <Spkapexcharts chartOptions={timelinedata.Timegroupoptions} chartSeries={timelinedata.Timegroupseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Dumbbell Chart</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="dumbbell-chart">
                                <Spkapexcharts chartOptions={timelinedata.Timedumbeloptions} chartSeries={timelinedata.Timedumbelseries} type="rangeBar" width={"100%"} height={320} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default TimelineChart;