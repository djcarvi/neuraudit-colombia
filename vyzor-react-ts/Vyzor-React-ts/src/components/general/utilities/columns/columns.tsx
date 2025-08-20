
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import media40 from '../../../../assets/images/media/media-40.jpg';

interface ColumnsProps { }

const Columns: React.FC<ColumnsProps> = () => {

    return (

        <Fragment>

            <Seo title={"Columns"} />

            <Pageheader title="Utilities" currentpage="Columns" activepage="Columns" />

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Row>
                        <Col xl={12}>
                        
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Vertical alignment
                                    </div>
                                </Card.Header>
                                <Card.Body className="bd-example-row bd-example-row-flex-cols">
                                    <div className="container">
                                        <div className="row align-items-start mb-3">
                                            <div className="col">One of three columns</div>
                                            <div className="col">One of three columns</div>
                                            <div className="col">One of three columns</div>
                                        </div>
                                        <div className="row align-items-center mb-3">
                                            <div className="col">One of three columns</div>
                                            <div className="col">One of three columns</div>
                                            <div className="col">One of three columns</div>
                                        </div>
                                        <div className="row align-items-end mb-3">
                                            <div className="col">One of three columns</div>
                                            <div className="col">One of three columns</div>
                                            <div className="col">One of three columns</div>
                                        </div>
                                        <Row>
                                            <div className="col align-self-start">One of three columns</div>
                                            <div className="col align-self-center">One of three columns</div>
                                            <div className="col align-self-end">One of three columns</div>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Column wrapping
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-row">
                            <div className="container">
                                <Row>
                                    <div className="col-9">.col-9</div>
                                    <div className="col-4">.col-4<br />Since 9 + 4 = 13 &gt; 12, this
                                        4-column-wide
                                        div gets wrapped onto a new line as one contiguous unit.
                                    </div>
                                    <div className="col-6">.col-6<br />Subsequent columns continue
                                        along the new line.
                                    </div>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Margin utilities
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-row">
                            <p className="mb-4">With the move to flexbox in v4, you can use margin utilities like
                                <span className="text-danger me-1">.me-auto</span>to force sibling columns
                                away
                                from one
                                another.
                            </p>
                            <div className="container">
                                <div className="row mb-3">
                                    <div className="col-md-4">.col-md-4</div>
                                    <div className="col-md-4 ms-auto">.col-md-4 .ms-auto</div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-3 ms-md-auto">.col-md-3 .ms-md-auto</div>
                                    <div className="col-md-3 ms-md-auto">.col-md-3 .ms-md-auto</div>
                                </div>
                                <Row>
                                    <div className="col-auto me-auto">.col-auto .me-auto</div>
                                    <div className="col-auto">.col-auto</div>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Horizontal alignment
                                    </div>
                                </Card.Header>
                                <Card.Body className="bd-example-row">
                                    <div className="container">
                                        <div className="row justify-content-start mb-3">
                                            <div className="col-4">One of two columns</div>
                                            <div className="col-4">One of two columns</div>
                                        </div>
                                        <div className="row justify-content-center mb-3">
                                            <div className="col-4">One of two columns</div>
                                            <div className="col-4">One of two columns</div>
                                        </div>
                                        <div className="row justify-content-end mb-3">
                                            <div className="col-4">One of two columns</div>
                                            <div className="col-4">One of two columns</div>
                                        </div>
                                        <div className="row justify-content-around mb-3">
                                            <div className="col-4">One of two columns</div>
                                            <div className="col-4 mb-3">One of two columns</div>
                                        </div>
                                        <div className="row justify-content-between mb-3">
                                            <div className="col-4">One of two columns</div>
                                            <div className="col-4">One of two columns</div>
                                        </div>
                                        <div className="row justify-content-evenly">
                                            <div className="col-4">One of two columns</div>
                                            <div className="col-4">One of two columns</div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Column breaks
                                    </div>
                                </Card.Header>
                                <Card.Body className="bd-example-row">
                                    <div className="container mb-3">
                                        <Row>
                                            <div className="col-6 col-sm-3">.col-6 .col-sm-3</div>
                                            <div className="col-6 col-sm-3">.col-6 .col-sm-3</div>
                                            <div className="w-100"></div>
                                            <div className="col-6 col-sm-3">.col-6 .col-sm-3</div>
                                            <div className="col-6 col-sm-3">.col-6 .col-sm-3</div>
                                        </Row>
                                    </div>
                                    <p>You may also apply this break at specific breakpoints with our <span
                                        className="text-danger">responsive display utilities.</span></p>
                                    <div className="container">
                                        <Row>
                                            <div className="col-6 col-sm-4">.col-6 .col-sm-4</div>
                                            <div className="col-6 col-sm-4">.col-6 .col-sm-4</div>
                                            <div className="w-100 d-none d-md-block"></div>
                                            <div className="col-6 col-sm-4">.col-6 .col-sm-4</div>
                                            <div className="col-6 col-sm-4">.col-6 .col-sm-4</div>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Order classes
                                    </div>
                                </Card.Header>
                                <Card.Body className="bd-example-row">
                                    <div className="container">
                                        <div className="row mb-3">
                                            <div className="col">
                                                First in DOM, no order applied
                                            </div>
                                            <div className="col order-5">
                                                Second in DOM, with a larger order
                                            </div>
                                            <div className="col order-1">
                                                Third in DOM, with an order of 1
                                            </div>
                                        </div>
                                    </div>
                                    <p>There are also responsive <span className="text-danger">.order-first</span> and
                                        <span className="text-danger">.order-last</span> classes that change the
                                        order of an element by applying <span className="text-danger">order: -1 </span>
                                        and
                                        <span className="text-danger"> order: 6</span>, respectively. These
                                        classes can also be intermixed with the numbered .order-* classes as needed.
                                    </p>
                                    <div className="container">
                                        <Row>
                                            <div className="col order-last">
                                                First in DOM, ordered last
                                            </div>
                                            <div className="col bd-example-grid">
                                                Second in DOM, unordered
                                            </div>
                                            <div className="col order-first">
                                                Third in DOM, ordered first
                                            </div>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Standalone column classes
                                    </div>
                                </Card.Header>
                                <Card.Body className="">
                                    <p>The <span className="text-danger">.col-*</span> classes can also be used
                                        outside a
                                        <span className="text-danger">.row</span> to give an element a specific
                                        width. Whenever column classes are used as non direct children of a
                                        row,
                                        the
                                        paddings are omitted.
                                    </p>
                                    <div className="col-3 bg-light p-3 border">
                                        .col-3: width of 25%
                                    </div>
                                    <div className="col-sm-9 bg-light p-3 border">
                                        .col-sm-9: width of 75% above sm breakpoint
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <h6 className="mb-3">Offsetting Columns</h6>
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Offset classes
                            </div>
                        </Card.Header>
                        <Card.Body className="bd-example-row">
                            <div className="container mb-3">
                                <div className="row mb-3">
                                    <div className="col-md-4">.col-md-4</div>
                                    <div className="col-md-4 offset-md-4">.col-md-4 .offset-md-4
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-3 offset-md-3">.col-md-3 .offset-md-3
                                    </div>
                                    <div className="col-md-3 offset-md-3">.col-md-3 .offset-md-3
                                    </div>
                                </div>
                                <Row>
                                    <div className="col-md-6 offset-md-3">.col-md-6 .offset-md-3
                                    </div>
                                </Row>
                            </div>
                            <p>In addition to column clearing at responsive breakpoints, you may need to
                                reset
                                offsets.</p>
                            <div className="container">
                                <div className="row mb-3">
                                    <div className="col-sm-5 col-md-6">.col-sm-5 .col-md-6</div>
                                    <div className="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                                        .col-sm-5
                                        .offset-sm-2 .col-md-6 .offset-md-0
                                    </div>
                                </div>
                                <Row>
                                    <div className="col-sm-6 col-md-5 col-lg-6">.col-sm-6 .col-md-5
                                        .col-lg-6</div>
                                    <div className="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0">
                                        .col-sm-6
                                        .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0
                                    </div>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <div className="col-xl-6">
                    <Card className="custom-card">
                        <Card.Body className="">
                            <p>The classes can be used together with utilities to create responsive floated
                                images.
                                Make sure to wrap the content in a <span className="text-danger">.clearfix </span>
                                wrapper to clear the float if the text
                                is shorter.</p>
                            <div className="clearfix">
                                <img src={media40} className="bd-placeholder-img col-md-6 float-md-end mb-3 ms-md-3 rounded img-fluid" alt="..." />
                                <p>
                                    A paragraph of placeholder text. We're using it here to show the use of
                                    the
                                    clearfix class. We're adding quite a few meaningless phrases here to
                                    demonstrate
                                    how the columns interact here with the floated image.
                                </p>
                                <p>
                                    As you can see the paragraphs gracefully wrap around the floated image.
                                    Now
                                    imagine how this would look with some actual content in here, rather
                                    than
                                    just
                                    this boring placeholder text that goes on and on, but actually conveys
                                    no
                                    tangible information at. It simply takes up space and should not really
                                    be
                                    read.
                                </p>
                                <p>
                                    And yet, here you are, still persevering in reading this placeholder
                                    text,
                                    hoping for some more insights, or some hidden easter egg of content. A
                                    joke,
                                    perhaps. Unfortunately, there's none of that here.
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Columns;