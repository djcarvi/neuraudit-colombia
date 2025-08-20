
import React, { Fragment } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { CartData, PricingSummary } from "../../../../shared/data/dashboards/ecommerce/cartdata";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface CartProps { }

const Cart: React.FC<CartProps> = () => {

    function dec(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10);
        if (unit <= 0) {
            return false;
        } else {
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

            <Seo title="Dashboards-Cart" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Cart" activepage="Cart" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={9}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap">
                                    {CartData.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xxl">
                                                            <Image src={product.image} alt={product.name} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="d-block text-muted mb-1">{product.brand}</span>
                                                        <h6 className="fw-semibold">{product.name}</h6>
                                                        <div className="d-flex align-items-center gap-2 fs-13">
                                                            <div>Color : <span className="fw-medium text-muted">{product.color}</span></div>
                                                            <div className="vr"></div>
                                                            <div>Size : <span className="fw-medium text-muted">{product.size}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`${product.stockStatus === 'In Stock' ? 'bg-success-transparent' : 'bg-danger-transparent'} fs-13`}>
                                                    {product.stockStatus}
                                                </SpkBadge>
                                            </td>
                                            <td>
                                                <div className="fw-medium">${product.price.toFixed(2)}</div>
                                            </td>
                                            <td>
                                                <div className="d-inline-flex rounded align-items-center flex-nowrap order-qnt gap-2 p-1 bg-light">
                                                    <Link onClick={dec} to="#!" className="badge bg-white p-2 border text-muted fs-13 product-quantity-minus">
                                                        <i className="ri-subtract-line"></i>
                                                    </Link>
                                                    <Form.Control type="text" className="form-control-cart border-0 text-center w-100 shadow-none" aria-label="quantity" value={product.quantity} readOnly />
                                                    <Link onClick={inc} to="#!" className="badge bg-white p-2 border text-muted fs-13 product-quantity-plus">
                                                        <i className="ri-add-line"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-medium">${(product.price * product.quantity).toFixed(2)}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 lh-1">
                                                    <div><Link to="#!" className="text-muted d-inline-flex align-items-center justify-content-center"><i className="ti ti-trash me-1"></i>Delete</Link></div>
                                                    <div className="vr"></div>
                                                    <div><Link to="#!" className="text-muted d-inline-flex align-items-center justify-content-center"><i className="ti ti-heart me-1"></i>Save For Later</Link></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Order Summary
                            </div>
                            <div className="text-end">
                                <span className="text-muted fs-13">Estimated Delivery</span>
                                <span className="d-block fw-medium">13,Apr 2025</span>
                            </div>
                        </Card.Header>
                        <Card.Header>
                            <span className="d-block fs-14 fw-medium mb-1">Have a coupon?</span>
                            <div className="input-group mb-1">
                                <Form.Control type="text" className="form-control-sm" placeholder="Coupon Code" aria-label="coupon-code" aria-describedby="coupons" />
                                <SpkButton Buttonvariant="primary" Customclass="btn input-group-text">Apply</SpkButton>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled cart-order-summary-list">
                                {PricingSummary.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>{item.label}</div>
                                            <div className={`fw-medium ${item.isDiscount ? 'text-danger' : item.isFree ? 'text-success' : ''}`}>
                                                {item.value}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                        <Card.Footer className="d-grid">
                            <Link to={`${import.meta.env.BASE_URL}dashboards/ecommerce/checkout`} className="btn btn-primary d-inline-flex align-items-center justify-content-center">Proceed to checkout<i className="ti ti-arrow-narrow-right ms-1"></i></Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default Cart;