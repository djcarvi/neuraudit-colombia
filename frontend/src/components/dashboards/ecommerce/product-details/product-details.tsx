
import { AssuranceCards, CareInstructions, ProductDetailsdata, ProductDetailsSwiper, ProductDetailsSwiperthumb, ProductFeatures, Ratings } from "../../../../shared/data/dashboards/ecommerce/productdetailsdata";
import React, { Fragment, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkSwiperJs from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import face15 from '../../../../assets/images/faces/15.jpg';
import ecommercejpg1 from '../../../../assets/images/ecommerce/jpg/1.jpg';
import ecommercejpg2 from '../../../../assets/images/ecommerce/jpg/2.jpg';
interface ProductDetailsProps { }

const ProductDetails: React.FC<ProductDetailsProps> = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    function dec(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10)
        if (unit <= 0) {
            return false
        }
        else {
            el.currentTarget.parentElement.querySelector("input").value = unit - 1;
        }
    }
    function inc(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10)
        el.currentTarget.parentElement.querySelector("input").value = unit + 1;
    }
    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Product Details" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Product Details" activepage="Product Details" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Container>
                <Row>
                    <Col xl={12}>
                        <Card className="custom-card">
                            <Card.Body>
                                <Row className="g-5">
                                    <Col xl={6}>
                                        <SpkSwiperJs slides={ProductDetailsSwiper} spaceBetween={30} navigation={true} centeredSlides={true} autoplay={true} thumb={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                            className="mySwiper swiper-preview-details bg-light product-details-page" />
                                        <SpkSwiperJs slides={ProductDetailsSwiperthumb} onswiper={setThumbsSwiper} autoplay={true} spaceBetween={10} slidesPerView={6} freemode={true} watchslide={true}
                                            className="swiper swiper-view-details mt-2" />
                                    </Col>
                                    <Col xl={6}>
                                        <div>
                                            <h4 className="fw-semibold">Nike Air Max 2025 Sneakers</h4>
                                            <div className="d-flex align-items-center mb-4 flex-wrap">
                                                <div className="text-warning">
                                                    <i className="ti ti-star-filled me-1"></i>
                                                    <i className="ti ti-star-filled me-1"></i>
                                                    <i className="ti ti-star-filled me-1"></i>
                                                    <i className="ti ti-star-filled me-1"></i>
                                                    <i className="ti ti-star-half-filled"></i>
                                                </div>
                                                <span className="text-muted ms-1 fs-13">4.5 (2.4k Reviews)</span>
                                            </div>
                                            <div className="mb-4">
                                                <p className="mb-1 lh-1 fs-11 text-success fw-semibold">Special Offer</p>
                                                <div className="mb-1 d-flex align-items-center"><span className="h3 fw-semibold mb-0"><sup className="fs-14">$</sup>129.99</span><SpkBadge variant="" Customclass="ms-3 bg-danger-transparent">50% Off</SpkBadge></div>
                                                <p className="mb-0 text-muted">M.R.P : <s>$259.99</s></p>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="fw-semibold mb-3">Description :</h6>
                                                <p className="text-muted mb-0">
                                                    These stylish Nike Air Max 2025 sneakers are designed for ultimate comfort and durability. Featuring a sleek, breathable mesh upper, the shoe’s advanced Air Max cushioning system ensures you stay comfortable on your feet all day long. Whether you're running errands or running a marathon, these sneakers will give you the support you need. Available in multiple colors.
                                                </p>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="fw-semibold mb-3">Colors :</h6>
                                                <div className="mb-0 d-flex flex-wrap gap-1">
                                                    <Link  className="color-1 product-colors selected" to="#!">
                                                        <i className="ri-checkbox-blank-circle-fill"></i>
                                                    </Link>
                                                    <Link  className="color-2 product-colors" to="#!">
                                                        <i className="ri-checkbox-blank-circle-fill"></i>
                                                    </Link>
                                                    <Link  className="color-3 product-colors" to="#!">
                                                        <i className="ri-checkbox-blank-circle-fill"></i>
                                                    </Link>
                                                    <Link  className="color-4 product-colors" to="#!">
                                                        <i className="ri-checkbox-blank-circle-fill"></i>
                                                    </Link>
                                                    <Link  className="color-5 product-colors" to="#!">
                                                        <i className="ri-checkbox-blank-circle-fill"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="fw-semibold mb-3">Size:</h6>
                                                <div className="mb-0 d-flex flex-wrap gap-1">
                                                    <Link  className="product-sizes selected" to="#!">
                                                        6
                                                    </Link>
                                                    <Link className="product-sizes" to="#!">
                                                        7
                                                    </Link>
                                                    <Link className="product-sizes" to="#!">
                                                        8
                                                    </Link>
                                                    <Link className="product-sizes" to="#!">
                                                        9
                                                    </Link>
                                                    <Link className="product-sizes" to="#!">
                                                        10
                                                    </Link>
                                                    <Link className="product-sizes" to="#!">
                                                        11
                                                    </Link>
                                                    <Link className="product-sizes" to="#!">
                                                        12
                                                    </Link>
                                                </div>
                                            </div>
                                            <div>
                                                <h6 className="fw-semibold mb-3">Quantity:</h6>
                                                <div className="d-inline-flex rounded align-items-center flex-nowrap order-qnt gap-2 p-1 bg-light">
                                                    <Link to="#!" onClick={dec} className="badge bg-white p-2 border text-muted fs-13 product-quantity-minus">
                                                        <i className="ri-subtract-line"></i>
                                                    </Link>
                                                    <input type="text" className="form-control form-control-cart border-0 text-center w-100 shadow-none" aria-label="quantity" id="product-qty1" defaultValue={1} />
                                                    <Link to="#!" onClick={inc} className="badge bg-white p-2 border text-muted fs-13 product-quantity-plus">
                                                        <i className="ri-add-line"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center gap-2 mt-5 flex-wrap">
                                            <Link to={`${import.meta.env.BASE_URL}dashboards/ecommerce/cart`} className="btn btn-primary btn-lg btn-w-lg  border"><i className="ti ti-shopping-cart me-1"></i>Add To Cart</Link>
                                            <Link to={`${import.meta.env.BASE_URL}dashboards/ecommerce/checkout`} className="btn btn-primary btn-lg btn-w-lg border">Buy Now</Link>
                                        </div>
                                    </Col>
                                    <Col xxl={12} xl={12} className="">
                                        <Row className="justify-content-center mb-4">
                                            {AssuranceCards.map((card, index) => (
                                                <Col xxl={4} xl={4} lg={12} md={12} sm={12} className="col-12 mt-sm-0 mt-3" key={index}>
                                                    <div className="ecommerce-assurance p-5 text-center">
                                                        <div className="lh-1 mb-3">
                                                            <span className="avatar avatar-md avatar-rounded bg-success svg-white">
                                                                {card.icon}
                                                            </span>
                                                        </div>
                                                        <h6 className="fw-semibold">{card.title}</h6>
                                                        <span className="d-block text-muted">{card.description}</span>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                        <div className="mb-4">
                                            <Row className="g-5">
                                                <Col xl={6}>
                                                    <h6 className="fw-semibold mb-3">Product Details :</h6>
                                                    <div className="table-responsive">
                                                        <SpkTables tableClass="table-bordered text-lg-wrap product-details-table" headerClass="d-none">
                                                            {ProductDetailsdata.map((detail, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row" className="fw-semibold">
                                                                        {detail.label}
                                                                    </th>
                                                                    <td>{detail.value}</td>
                                                                </tr>
                                                            ))}
                                                        </SpkTables>
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <div className="mb-4">
                                                        <h6 className="fw-semibold mb-3">Features :</h6>
                                                        <ul className="list-unstyled product-details-features-list">
                                                            {ProductFeatures.map((feature, index) => (
                                                                <li key={index}>{feature}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="fw-semibold mb-3">Care Instructions :</h6>
                                                        <ul className="list-unstyled product-details-features-list">
                                                            {CareInstructions.map((instruction, index) => (
                                                                <li key={index}>{instruction}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="mb-0">
                                            <p className="fs-15 fw-semibold mb-3">Reviews & Ratings :</p>
                                            <Row>
                                                <Col xxl={4} xl={12} lg={12} md={12} sm={12} className="">
                                                    <div className="d-flex align-items-top mb-3">
                                                        <div className="me-2 lh-1">
                                                            <i className="ri-star-fill fs-25 text-warning"></i>
                                                        </div>
                                                        <div className="lh-1">
                                                            <p className="mb-1">4.2 out of 5</p>
                                                            <p className="mb-0 text-muted fs-11">Based on (23,435) ratings</p>
                                                        </div>
                                                    </div>
                                                    {Ratings.map((rating, index) => (
                                                        <div className="d-flex align-items-center mb-3" key={index}>
                                                            <div className="fs-12 me-2 fw-semibold">
                                                                {rating.stars} <i className="ri-star-fill fs-10"></i>
                                                            </div>
                                                            <div className="progress progress-xs flex-fill">
                                                                <div className={`progress-bar ${rating.color}`} role="progressbar" style={{ width: `${rating.percentage}%` }} aria-valuenow={rating.percentage} aria-valuemin={0} aria-valuemax={100} />
                                                            </div>
                                                            <div className="text-muted ms-2 fs-12">({rating.count})</div>
                                                        </div>
                                                    ))}
                                                </Col>
                                                <Col xxl={8} xl={12} lg={12} md={12} sm={12} className="mt-xxl-0 mt-3">
                                                    <div className="border p-3">
                                                        <div className="d-sm-flex d-block align-items-top mb-3">
                                                            <div className="d-flex flex-fill align-items-start gap-3">
                                                                <div>
                                                                    <span className="avatar avatar-md avatar-rounded">
                                                                        <Image  src={face15} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div className="lh-1 me-2">
                                                                    <p className="mb-1 fw-semibold fs-14">John Doe</p>
                                                                    <div className="mb-1 d-flex align-items-center gap-1">
                                                                        <i className="ri-star-s-fill text-warning align-middle fs-12"></i>
                                                                        <i className="ri-star-s-fill text-warning align-middle fs-12"></i>
                                                                        <i className="ri-star-s-fill text-warning align-middle fs-12"></i>
                                                                        <i className="ri-star-s-fill text-warning align-middle fs-12"></i>
                                                                        <i className="ri-star-s-line text-warning align-middle fs-12"></i>
                                                                    </div>
                                                                    <div className="fs-11 text-muted">
                                                                        Reviewed on 24 May,2025
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ps-sm-0 mt-sm-0 mt-3 ps-sm-0 ps-2">
                                                                <SpkBadge variant="" Customclass="bg-success">Verified Purchase</SpkBadge>
                                                            </div>
                                                        </div>
                                                        <div className="ps-sm-3 ps-0 mb-3">
                                                            <p className="fw-semibold mb-1 ps-2">Wonderful product&#128512;</p>
                                                            <p className="mb-0 text-muted ps-2">The comfort is unmatched! I love the sleek design, and the Air Max cushioning is fantastic.</p>
                                                        </div>
                                                        <div className="product-images ps-sm-4 ps-0">
                                                            <Row>
                                                                <Col xl={6}>
                                                                    <div className="products-review-images">
                                                                        <Link to="#!">
                                                                            <Image width={56} height={56} className="" src={ecommercejpg1} alt="" />
                                                                        </Link>
                                                                        <Link to="#!">
                                                                            <Image width={56} height={56} className="" src={ecommercejpg2} alt="" />
                                                                        </Link>
                                                                    </div>
                                                                </Col>
                                                                <Col xl={6} className="d-flex align-items-end justify-content-sm-end mt-sm-0 mt-2 flex-wrap gap-2">
                                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-warning-light me-2">Report abuse</SpkButton>
                                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-success-light me-2">
                                                                        <i className="ri-thumb-up-line"></i>
                                                                    </SpkButton>
                                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-danger-light">
                                                                        <i className="ri-thumb-down-line"></i>
                                                                    </SpkButton>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default ProductDetails;