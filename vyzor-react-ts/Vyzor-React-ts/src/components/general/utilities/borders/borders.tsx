
import { border1, border2, border3, border4, border5, border6, border7, border8 } from "../../../../shared/data/prism-code/utilities-prism";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Image, Row } from "react-bootstrap";
import media58 from '../../../../assets/images/media/media-58.jpg';
interface BordersProps { }

const Borders: React.FC<BordersProps> = () => {

    return (
        <Fragment>

            <Seo title={"Borders"} />

            <Pageheader title="Utilities" currentpage="Borders" activepage="Borders" />

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Borders" customCardClass="custom-card" customCardBodyClass="" reactCode={border1}>
                        <span className="border border-container"></span>
                        <span className="border-top border-container"></span>
                        <span className="border-end border-container"></span>
                        <span className="border-bottom border-container"></span>
                        <span className="border-start border-container"></span>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Remove borders" customCardClass="custom-card" customCardBodyClass="" reactCode={border2}>
                        <span className="border-0 border-container"></span>
                        <span className="border border-top-0 border-container"></span>
                        <span className="border border-end-0 border-container"></span>
                        <span className="border border-bottom-0 border-container"></span>
                        <span className="border border-start-0 border-container"></span>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Border Widths" customCardClass="custom-card" customCardBodyClass="" reactCode={border3}>
                            <span className="border border-container border-1"></span> 
                            <span className="border border-container border-2"></span> 
                            <span className="border border-container border-3"></span> 
                            <span className="border border-container border-4"></span> 
                            <span className="border border-container border-5"></span> 
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Border colors" customCardClass="custom-card" customCardBodyClass="" reactCode={border4}>
                        <span className="border border-container border-primary"></span>
                        <span className="border border-container border-secondary"></span>
                        <span className="border border-container border-success"></span>
                        <span className="border border-container border-danger"></span>
                        <span className="border border-container border-warning"></span>
                        <span className="border border-container border-info"></span>
                        <span className="border border-container border-light"></span>
                        <span className="border border-container border-dark"></span>
                        <span className="border border-container border-white"></span>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Border color Styling" customCardClass="custom-card" customCardBodyClass="" reactCode={border5}>
                        <div className="mb-4">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Email
                                address</label>
                            <input type="email" className="form-control border-success"
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                        </div>
                        <div className="h4 pb-3 mb-4 text-danger border-bottom border-danger">
                            Below Shows Danger Border
                        </div>
                        <div
                            className="p-3 bg-info bg-opacity-10 border border-info border-start-0 rounded-end mb-1">
                            Customizing borders with background colors
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Border with opacity" customCardClass="custom-card" customCardBodyClass="" reactCode={border6}>
                        <div className="border border-success p-2 mb-2">This is default success border</div>
                        <div className="border border-success p-2 mb-2 border-opacity-75">This is 75%
                            opacity
                            success border
                        </div>
                        <div className="border border-success p-2 mb-2 border-opacity-50">This is 50%
                            opacity
                            success border
                        </div>
                        <div className="border border-success p-2 mb-2 border-opacity-25">This is 25%
                            opacity
                            success border
                        </div>
                        <div className="border border-success p-2 border-opacity-10">This is 10% opacity
                            success
                            border
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Border Radius" customCardClass="custom-card" customCardBodyClass="" reactCode={border7}>
                        <Image src={media58} className="bd-placeholder-img rounded" alt="..." />
                        <Image src={media58} className="bd-placeholder-img rounded-top" alt="..." />
                        <Image src={media58} className="bd-placeholder-img rounded-end" alt="..." />
                        <Image src={media58} className="bd-placeholder-img rounded-bottom" alt="..." />
                        <Image src={media58} className="bd-placeholder-img rounded-start" alt="..." />
                        <Image src={media58} className="bd-placeholder-img rounded-circle" alt="..." />
                        <Image src={media58} className="bd-placeholder-img  rounded-pill" alt="..." />
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Sizes" customCardClass="custom-card" customCardBodyClass="" reactCode={border8}>
                        <Image src={media58} className="bd-placeholder-img bd-placeholder-img rounded-0" alt="..." />
                        <Image src={media58} className="bd-placeholder-img bd-placeholder-img rounded-1" alt="..." />
                        <Image src={media58} className="bd-placeholder-img bd-placeholder-img rounded-2" alt="..." />
                        <Image src={media58} className="bd-placeholder-img bd-placeholder-img rounded-3" alt="..." />
                        <Image src={media58} className="bd-placeholder-img bd-placeholder-img rounded-4" alt="..." />
                        <Image src={media58} className="bd-placeholder-img bd-placeholder-img rounded-5" alt="..." />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Borders;