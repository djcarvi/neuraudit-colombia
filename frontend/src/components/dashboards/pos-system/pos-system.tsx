
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import Isotope from "isotope-layout";
import SpkSwiperJs from "../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import { CartItems, PosCardsData, Systemcards } from "../../../shared/data/dashboards/pos-systemdata";
import { Link } from "react-router-dom";
import SpkTooltips from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";

import PosSystem20 from '../../../assets/images/pos-system/20.png';
import PosSystem1 from '../../../assets/images/pos-system/1.png';
import PosSystem2 from '../../../assets/images/pos-system/2.png';
import PosSystem3 from '../../../assets/images/pos-system/3.png';
import PosSystem4 from '../../../assets/images/pos-system/4.png';
import PosSystem5 from '../../../assets/images/pos-system/5.png';
import PosSystem6 from '../../../assets/images/pos-system/6.png';

interface PosSystemProps { }

const PosSystem: React.FC<PosSystemProps> = () => {

    const isotope = useRef<Isotope | null>(null);
    const grid = useRef<HTMLDivElement | null>(null);
    const [activeFilter, setActiveFilter] = useState("*");

    useEffect(() => {
        let IsotopeModule: any;
        const initializeIsotope = async () => {
            const module = await import("isotope-layout");
            IsotopeModule = module.default;
            if (grid.current) {
                isotope.current = new IsotopeModule(grid.current, {
                    itemSelector: ".card-item",
                    layoutMode: "masonry",
                    fitWidth: true,
                    percentPosition: true,
                });
            }
        };
        initializeIsotope();

        return () => {
            isotope.current?.destroy();
            isotope.current = null;
        };
    }, []);

    const handleTabClick = (filter: string) => {
        setActiveFilter(filter);
        isotope.current?.arrange({ filter });
    };

    const breakpoints = {
        500: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 2,
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
        1600: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1800: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
    }

    function dec(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10)
        if (unit <= 0) {
            return (false)
        }
        else {
            el.currentTarget.parentElement.querySelector("input").value = unit - 1;
        }
    }
    function inc(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10);
        el.currentTarget.parentElement.querySelector("input").value = unit + 1;
    }
    return (

        <Fragment>

           {/* <!-- Page Header --> */}

            <Seo title="Dashboard-POS System" />

            <Pageheader title="Dashboards" currentpage="POS System" activepage="POS System" />

            {/* <!-- Page Header Close --> */}
            
            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        <Col xl={12}>
                            <h5 className="fw-semibold mb-3 d-flex align-items-center">Orders<SpkBadge variant="" Customclass="badge bg-primary ms-2 rounded-pill">08</SpkBadge></h5>
                            <SpkSwiperJs className="pos-orders-swiper" slides={PosCardsData} navigation={true}  slidesPerView={1} spaceBetween={20} autoplay={true} breakpoint={breakpoints} />
                        </Col>
                        <Col xl={12}>
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                                <h5 className="fw-semibold mb-0 d-flex align-items-center">Categories<span className="badge bg-success ms-2 rounded-pill">07</span></h5>
                                <Link to="#!" className="text-muted fs-13">View All<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-4 flex-wrap pos-category pos-categories-list" id="filter">
                                <div className={`nft-tag nft-tag-primary ${activeFilter === "*" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter="*" key="frst" onClick={() => handleTabClick("*")}>
                                        <span className="nft-tag-icon ">
                                            <Image src={PosSystem20} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">All</span>
                                    </Link>
                                </div>
                                <div className={`nft-tag nft-tag-secondary ${activeFilter === ".Appetizers" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter=".Appetizers" key="sec" onClick={() => handleTabClick(".Appetizers")}>
                                        <span className={`nft-tag-icon `}>
                                            <Image src={PosSystem1} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">Appetizers</span>
                                    </Link>
                                </div>
                                <div className={`nft-tag nft-tag-info ${activeFilter === ".Main-Course" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter=".Main-Course" key="third" onClick={() => handleTabClick(".Main-Course")}>
                                        <span className={`nft-tag-icon `}>
                                            <Image src={PosSystem2} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">Main Course</span>
                                    </Link>
                                </div>
                                <div className={`nft-tag nft-tag-success ${activeFilter === ".Beverages" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter=".Beverages" key="fou" onClick={() => handleTabClick(".Beverages")}>
                                        <span className={`nft-tag-icon `}>
                                            <Image src={PosSystem3} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">Beverages</span>
                                    </Link>
                                </div>
                                <div className={`nft-tag nft-tag-danger ${activeFilter === ".Desserts" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter=".Desserts" key="five" onClick={() => handleTabClick(".Desserts")}>
                                        <span className={`nft-tag-icon `}>
                                            <Image src={PosSystem4} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">Desserts</span>
                                    </Link>
                                </div>
                                <div className={`nft-tag nft-tag-warning ${activeFilter === ".Soups" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter=".Soups" key="six" onClick={() => handleTabClick(".Soups")}>
                                        <span className={`nft-tag-icon `}>
                                            <Image src={PosSystem6} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">Soups</span>
                                    </Link>
                                </div>
                                <div className={`nft-tag nft-tag-purple ${activeFilter === ".Salads" ? "active" : ""}`}>
                                    <Link to="#!" className="stretched-link categories" data-filter=".Salads" key="seven" onClick={() => handleTabClick(".Salads")}>
                                        <span className={`nft-tag-icon `}>
                                            <Image src={PosSystem5} alt="" />
                                        </span>
                                        <span className="nft-tag-text podcast-category-text">Salads</span>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <Row className="list-wrapper" ref={grid}>
                                {Systemcards.map((item) => (
                                    <Col key={item.id} xxl={3} xl={4} lg={4} md={6} sm={6} className={`col-12 card-item ${item.category}`} data-category={item.category}>
                                        <Card className={`custom-card ${item.outOfStock ? 'out-of-stock' : ''}`}>
                                            <Image  src={item.image} className="card-img-top bg-light" alt={item.title} />
                                            <Card.Body>
                                                <div className="mb-1">
                                                    <Link to="#!" className="fw-medium fs-16">{item.title}</Link>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <h5 className="fw-semibold mb-0">${item.price.toFixed(2)}</h5>
                                                        <span className="text-muted fs-13 text-decoration-line-through">${item.originalPrice.toFixed(2)}</span>
                                                    </div>
                                                    <div>
                                                        <SpkTooltips placement="top" title="Add Item">
                                                            <SpkButton Buttonvariant="primary" Customclass="btn btn-sm btn-wave d-inline-flex align-items-center justify-content-center" Disabled={item.outOfStock}>
                                                                Add Item <i className="ti ti-plus ms-1"></i>
                                                            </SpkButton>
                                                        </SpkTooltips>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header className="card-header justify-content-between">
                            <div className="card-title">Orders Details</div>
                            <SpkBadge variant="" Customclass="badge bg-primary-transparent">4 Items</SpkBadge>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4">
                                <span className="fw-semibold d-block mb-0">Recepient: Jhon Doe</span>
                                <span className="d-block fs-13 text-muted mb-1">Mon - 24,Feb 2025 - 12:45PM</span>
                                <span className="d-block fs-12 text-muted">#SPK1236655</span>
                            </div>
                            <ul className="list-unstyled pos-system-orders-list">
                                {CartItems.map((item) => (
                                    <li key={item.id}>
                                        <div className="d-flex align-items-start gap-2 flex-wrap">
                                            <div className="lh-1">
                                                <span className="avatar avatar-lg bg-light border">
                                                    <Image width={48} height={48} src={item.image} alt={item.title} />
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-end mb-1 flex-wrap">
                                                    <span className="fw-semibold text-truncate flex-fill">
                                                        {item.title}
                                                    </span>
                                                    <div className="d-flex align-items-center order-qnt gap-2">
                                                        <Link to="#!" onClick={dec} className="badge bg-white p-1 border text-muted fs-13 product-quantity-minus">
                                                            <i className="ri-subtract-line"></i>
                                                        </Link>
                                                        <input type="text" className="form-control form-control-cart border-0 text-center w-100" aria-label="quantity" value={item.quantity} readOnly />
                                                        <Link to="#!" onClick={inc} className="badge bg-white p-1 border text-muted fs-13 product-quantity-plus">
                                                            <i className="ri-add-line"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                    <div className="flex-grow-1 mb-0 text-primary">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                    <div className="lh-1">
                                                        <Link to="#!" className="text-danger fs-12 text-decoration-underline">
                                                            Remove
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <div className="p-3 border-bottom border-bottom-dashed">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 fw-semibold mb-2">
                                    <span>Sub total</span>
                                    <span>$37.96</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2  text-muted">
                                    <span>Packaging Charges:</span>
                                    <span>+$5.00</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2  text-muted">
                                    <span>GST:</span>
                                    <span>$2.99</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 text-primary px-3 py-2 fw-semibold fs-18 border-bottom border-bottom-dashed">
                                <span>Total:</span>
                                <span>$45.00</span>
                            </div>
                            <div className="p-3">
                                <h6 className="fw-semibold mb-3">Payment Methods:</h6>
                                <div className="btn-group flex-wrap" role="group" aria-label="Basic radio toggle button group">
                                    <input type="radio" className="btn-check" name="btnradio" id="btnradio1"
                                        defaultChecked />
                                    <label className="btn btn-outline-primary btn-w-sm" htmlFor="btnradio1">
                                        <span className="d-block"><i className="ti ti-cash fs-5"></i></span>
                                        <span className="d-block">Cash</span>
                                    </label>

                                    <input type="radio" className="btn-check" name="btnradio" id="btnradio2" />
                                    <label className="btn btn-outline-primary btn-w-sm" htmlFor="btnradio2">
                                        <span className="d-block"><i className="ti ti-qrcode fs-5"></i></span>
                                        <span className="d-block">UPI</span>
                                    </label>

                                    <input type="radio" className="btn-check" name="btnradio" id="btnradio3" />
                                    <label className="btn btn-outline-primary" htmlFor="btnradio3">
                                        <span className="d-block"><i className="ti ti-credit-card fs-5"></i></span>
                                        <span className="d-block">Debit Card</span>
                                    </label>
                                </div>
                            </div>
                        </Card.Footer>
                        <Card.Footer className="d-grid">
                            <SpkButton Buttonvariant="primary" Customclass="btn btn-lg">Pay - $45.00</SpkButton>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )

}

export default PosSystem;