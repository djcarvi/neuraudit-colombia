
import SpkCarouselComponent from "../../../../shared/@spk-reusable-components/general-reusable/reusable-advancedui/spk-carousel";
import { Captioncarousel, Carouseldata, Crosscarousel, Darkcarousel, Disablecarousel, Indicatorcarousel, Individualcarousel, Slidecarousel } from "../../../../shared/data/general/adavanec-ui/carouseldata";
import { carousel1, carousel2, carousel3, carousel4, carousel5, carousel6, carousel7, carousel8, reusablecarousel1, reusablecarousel2, reusablecarousel3, reusablecarousel4, reusablecarousel5, reusablecarousel6, reusablecarousel7, reusablecarousel8 } from "../../../../shared/data/prism-code/advanced-ui-prism";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap"

interface CarouselProps { }

const Carousel: React.FC<CarouselProps> = () => {
    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Carousel"} />

            <Pageheader title="Advanced Ui" currentpage="Carousel" activepage="Carousel" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={4} lg={6} md={6} sm={12}>
                    <ShowCode title="Slides Only" customCardHeaderClass="" reactCode={carousel3} reusableCode={reusablecarousel3}>
                        <SpkCarouselComponent mainClass="custom-slide-carousel" items={Slidecarousel} />
                    </ShowCode>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                    <ShowCode title="With controls" customCardHeaderClass="" reactCode={carousel1} reusableCode={reusablecarousel1}>
                        <SpkCarouselComponent items={Carouseldata} />
                    </ShowCode>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                    <ShowCode title="With indicators" customCardHeaderClass="" reactCode={carousel2} reusableCode={reusablecarousel2}>
                        <SpkCarouselComponent items={Indicatorcarousel} mainClass="carousel slide" indicators={true} />
                    </ShowCode>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                    <ShowCode title="With captions" customCardHeaderClass="" reactCode={carousel4} reusableCode={reusablecarousel4}>
                        <SpkCarouselComponent items={Captioncarousel} mainClass="carousel slide" indicators={true} />
                    </ShowCode>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                    <ShowCode title="Crossfade" customCardHeaderClass="" reactCode={carousel6} reusableCode={reusablecarousel6}>
                        <SpkCarouselComponent items={Crosscarousel} fade={true} mainClass="carousel slide carousel-fade" indicators={false} />
                    </ShowCode>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                    <ShowCode title="Individual .carousel-item interval" customCardHeaderClass="" reactCode={carousel5} reusableCode={reusablecarousel5}>
                        <SpkCarouselComponent interval1={1000} items={Individualcarousel} mainClass="carousel slide" indicators={false} />
                    </ShowCode>
                </Col>
                <Col xxl={4} md={6}>
                    <ShowCode title="Disable touch swiping" customCardHeaderClass="" reactCode={carousel7} reusableCode={reusablecarousel7}>
                        <SpkCarouselComponent items={Disablecarousel} mainClass="carousel slide" indicators={false}
                            data-bs-interval="false" />
                    </ShowCode>
                </Col>
                <Col xxl={4} md={6}>
                    <ShowCode title="Dark variant" customCardHeaderClass="" reactCode={carousel8} reusableCode={reusablecarousel8}>
                        <SpkCarouselComponent items={Darkcarousel} mainClass="carousel slide " indicators={true} />
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

        </Fragment>
    )
};

export default Carousel;