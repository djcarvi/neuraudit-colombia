
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkSwiperJs from "../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import { CustomReviewdata, Reviewsdata, TestimonialCards, TestimonialSlider } from "../../../shared/data/pages/testimonialsdata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";

interface TestimonialsProps { }

const Testimonials: React.FC<TestimonialsProps> = () => {

    const breakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: 5,
        },
        640: {
            slidesPerView: 1,
            spaceBetween: 5,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 20,
        }
    }

    const breakpoints1 = {
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        640: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1400: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
    }
    const breakpoints2 = {
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        480: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        1112: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        1300: {
            slidesPerView: 4,
            spaceBetween: 30,
        }
    }
    const breakpoints3 = {
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        480: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        1112: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        1300: {
            slidesPerView: 3,
            spaceBetween: 30,
        }
    }

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Testimonials" />

            <Pageheader title="Pages" currentpage="Testimonials" activepage="Testimonials" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row className="gy-5">
                <Col xl={12}>
                    <div className="testimonials-heading-section text-center mb-5">
                        <SpkBadge variant="" Customclass="bg-primary-transparent rounded-pill">
                            Testimonials Style 1
                        </SpkBadge>
                        <h2 className="fw-semibold mt-2 mb-1">What Our Clients Say</h2>
                        <span className="d-block text-muted fs-16 mb-3">Real feedback from customers who trust our services.</span>
                    </div>
                    <SpkSwiperJs slides={Reviewsdata} breakpoint={breakpoints} loop={true} slidesPerView={1} spaceBetween={30} autoplay={true} className="mySwiper testimonialSwiperService1 testimonial-style1" />
                </Col>
                <Col xl={12}>
                    <div className="testimonials-heading-section text-center mb-5">
                        <SpkBadge variant="" Customclass="bg-primary-transparent rounded-pill">
                            Testimonials Style 2
                        </SpkBadge>
                        <h2 className="fw-semibold mt-2 mb-1">Customer Testimonials</h2>
                        <span className="d-block text-muted fs-16 mb-3">Hear how we've made a difference in our clients’ lives.</span>
                    </div>
                    <SpkSwiperJs slides={CustomReviewdata} pagination={{ dynamicBullets: true, clickable: true }} breakpoint={breakpoints1} loop={true} slidesPerView={3} spaceBetween={30}  autoplay={true} className="mySwiper testimonials-swiper-2 testimonial-style-2-card" />
                </Col>
                <Col xl={12}>
                    <div className="testimonials-heading-section text-center mb-5">
                        <SpkBadge variant="" Customclass="bg-primary-transparent rounded-pill">
                            Testimonials Style 3
                        </SpkBadge>
                        <h2 className="fw-semibold mt-2 mb-1">Client Feedback</h2>
                        <span className="d-block text-muted fs-16 mb-3">Discover why our clients choose us time and again.</span>
                    </div>
                    <SpkSwiperJs slides={TestimonialCards} breakpoint={breakpoints2} loop={true} slidesPerView={4} spaceBetween={30} autoplay={true} className="mySwiper testimonialSwiper3" />
                </Col>
                <Col xl={12}>
                    <div className="testimonials-heading-section text-center mb-5">
                        <SpkBadge variant="" Customclass="bg-primary-transparent rounded-pill">
                            Testimonials Style 4
                        </SpkBadge>
                        <h2 className="fw-semibold mt-2 mb-1">Real Stories from Real Clients</h2>
                        <span className="d-block text-muted fs-16 mb-3">Authentic testimonials from customers sharing their success.</span>
                    </div>
                    <SpkSwiperJs slides={TestimonialSlider} breakpoint={breakpoints3} loop={true} slidesPerView={3} spaceBetween={30} centeredSlides={true} autoplay={true} className="mySwiper testimonialSwiper1 testimonial-style4" />
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default Testimonials;