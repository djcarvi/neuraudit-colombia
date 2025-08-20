
import React, { Fragment } from "react";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { DetailsTable, OrderTimeline, PaymentDetails, UserInfoList } from "../../../../shared/data/dashboards/ecommerce/orderdetailsdata";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";

interface OrderDetailsProps { }

const OrderDetails: React.FC<OrderDetailsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Order Details" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Order Details" activepage="Order Details" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="nowrap text-nowrap" header={[{ title: 'Product' }, { title: 'SKU' }, { title: 'Quantity', headerClassname: 'text-center' }, { title: 'Price Per Unit' }, { title: 'Total', headerClassname: 'text-end' }]}>
                                            {DetailsTable.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xxl">
                                                                    <Image src={product.imageUrl} alt={product.name} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="d-block text-muted mb-1">{product.brand}</span>
                                                                <h6 className="fw-semibold">{product.name}</h6>
                                                                <div className="d-flex align-items-center gap-2 fs-13">
                                                                    <div>Color : <span className="fw-medium text-muted">  {product.color}</span></div>
                                                                    <div className="vr"></div>
                                                                    <div>Size : <span className="fw-medium text-muted">  {product.size}</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-muted">{product.id}</div>
                                                    </td>
                                                    <td className="product-quantity-container text-center">
                                                        {product.quantity}
                                                    </td>
                                                    <td>
                                                        ${product.price.toFixed(2)}
                                                    </td>
                                                    <td className="text-end">
                                                        ${(product.price * product.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={3} className="border-bottom-0"></td>
                                                <td colSpan={2} className="border-bottom-0">
                                                    <table className="table table-sm text-nowrap mb-0 table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <td scope="row">
                                                                    Sub Total :
                                                                </td>
                                                                <td className="text-end">
                                                                    <span className="mb-0 fw-medium">$419.97</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row">
                                                                    Avail Discount :
                                                                </td>
                                                                <td className="text-end">
                                                                    <span className="mb-0 fw-medium">-$30.00</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row">
                                                                    Coupon Discount :
                                                                </td>
                                                                <td className="text-end">
                                                                    <span className="mb-0 fw-medium">-$41.99</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row">
                                                                    Vat :
                                                                </td>
                                                                <td className="text-end">
                                                                    <span className="mb-0 fw-medium">$67.99</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row">
                                                                    Total :
                                                                </td>
                                                                <td className="text-end">
                                                                    <span className="mb-0 fw-medium fs-15">$415.97</span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={7}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Order Activity
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled order-activity-list">
                                        {OrderTimeline.map((item, index) => (
                                            <li key={index} className={item.isVisible ? '' : 'pending'}>
                                                <div className="d-flex align-items-start justify-content-between">
                                                    <div className="w-50">
                                                        <h6 className="fw-medium mb-1">{item.title}</h6>
                                                        <div className={`text-muted ${item.isVisible ? '' : 'd-none'}`}>{item.description}</div>
                                                    </div>
                                                    <div className={`fs-13 text-end ${item.isVisible ? '' : 'd-none'}`}>
                                                        <span className="d-block mb-1">{item.date}</span>
                                                        <span className="d-block text-muted">{item.time}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={5}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Billing Address
                                    </div>
                                    <Link to="#!" className="btn btn-primary-light btn-sm  d-inline-flex align-items-center justify-content-center"><i className="ti ti-edit me-1"></i>Edit</Link>
                                </Card.Header>
                                <Card.Body>
                                    <span className="d-block fw-medium mb-2">Tom Phillip</span>
                                    <ul className="list-unstyled order-address-list">
                                        <li>9876 Maple Avenue, Unit 12C</li>
                                        <li>New York, NY 10001</li>
                                        <li>United States</li>
                                        <li>(212) 555-0987</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">
                                        Shipping Address
                                    </div>
                                    <Link to="#!" className="btn btn-primary-light btn-sm  d-inline-flex align-items-center justify-content-center"><i className="ti ti-edit me-1"></i>Edit</Link>
                                </Card.Header>
                                <Card.Body>
                                    <span className="d-block fw-medium mb-2">Tom Phillip</span>
                                    <ul className="list-unstyled order-address-list mb-3">
                                        <li>9876 Maple Avenue, Unit 12C</li>
                                        <li>New York, NY 10001</li>
                                        <li>United States</li>
                                        <li>(212) 555-0987</li>
                                    </ul>
                                    <span className="d-block fw-medium mb-2">Visa Card</span>
                                    <span className="d-block">**** **** **** 1234</span>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <div className="card-title">Customer Details</div>
                                    <SpkBadge variant="" Customclass="bg-primary-transparent fs-13">18 Orders</SpkBadge>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ListGroup className="list-group-flush">
                                        {UserInfoList.map((item, index) => (
                                            <ListGroup.Item key={index} className="">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="fs-13 text-muted">
                                                        <i className={`${item.icon} me-2 fs-14`}></i>
                                                        {item.label}
                                                    </div>
                                                    {item.value}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Payment Details
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ListGroup className="list-group-flush">
                                        {PaymentDetails.map((item, index) => (
                                            <ListGroup.Item key={index} className="">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="fs-13 text-muted">{item.label}</div>
                                                    <div className="fw-medium">{item.value}</div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>

    )
};

export default OrderDetails;