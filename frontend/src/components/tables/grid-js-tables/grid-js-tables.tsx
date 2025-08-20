
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkGridjstables from "../../../shared/@spk-reusable-components/reusable-plugins/spk-gridjstables";
import { Columns, Data, Data1, Data2, Data3 } from "../../../shared/data/tables/gridjstablesdata";

interface GridJsTablesProps { }

const GridJsTables: React.FC<GridJsTablesProps> = () => {

    return (

        <Fragment>

            <Seo title="GridJs Tables" />

            <Pageheader title="Tables" currentpage="Grid Js Tables" activepage="Grid Js Tables" />

            {/* <!--Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Basic Table
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-example1">
                                <SpkGridjstables Data={Data} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!--Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Table With Pagination
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-pagination">
                                <SpkGridjstables Data={Data} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]} Pagination={{ limit: 5 }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!--Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Table With Search
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-search">
                                <SpkGridjstables Search={true} Data={Data} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]} Pagination={{ limit: 5 }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End:: row-3 --> */}

            {/* <!--Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Table Sorting
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-sorting">
                                <SpkGridjstables Sort={true} Search={true} Data={Data} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]}  />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End:: row-4 --> */}

            {/* <!--Start:: row-5 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Table Loading
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-loading">
                                <SpkGridjstables Sort={true} Search={true} Data={Data1} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]} Pagination={{ limit: 5 }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End:: row-5 --> */}

            {/* <!--Start:: row-6 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Wide Table
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-wide">
                                <SpkGridjstables reSizable={true} Sort={true} Search={true} Data={Data2} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]}  />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End:: row-6 --> */}

            {/* <!--Start:: row-7 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Fixed Header
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-header-fixed">
                                <SpkGridjstables fixedHeader={true} Height="350px" Sort={true} Search={true} Data={Data3} Columns={["Date", "Name", "Email", "Id", "Price", "Quantity", "Total"]} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End:: row-7 --> */}

            {/* <!--    Start:: row-8 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Hidden Columns
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="grid-hidden-column">
                                <SpkGridjstables Sort={true} Search={true} Data={Data} Columns={Columns}  />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-8 --> */}

        </Fragment>

    )

};

export default GridJsTables;