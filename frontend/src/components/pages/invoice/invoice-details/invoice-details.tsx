
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import logo1 from '../../../../assets/images/brand-logos/desktop-dark.png';
import logo2 from '../../../../assets/images/brand-logos/desktop-logo.png';
import { Link } from "react-router-dom";
interface InvoiceDetailsProps { }

const InvoiceDetails: React.FC<InvoiceDetailsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Invoice-Details" />

            <Pageheader title="Pages" subtitle="Invoice" currentpage="Invoice-Details" activepage="Invoice-Details" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card invoice-card">
                        <Card.Body>
                            <div className="row gy-3">
                                <Col xl={12}>
                                    <Image  src={logo2} alt="" className="img-fluid desktop-logo" />
                                    <Image  src={logo1} alt="" className="img-fluid desktop-dark" />
                                </Col>
                                <Col xl={12}>
                                    <Row>
                                        <Col xl={4} lg={4} md={6} sm={6} className="">
                                            <p className="text-muted mb-2">
                                                Billing From :
                                            </p>
                                            <p className="fw-bold mb-1">
                                                Spruko Technologies
                                            </p>
                                            <p className="mb-1 text-muted">
                                                Mig-1-11,Manroe street
                                            </p>
                                            <p className="mb-1 text-muted">
                                                Georgetown,Washington D.C,USA,200071
                                            </p>
                                            <p className="mb-1 text-muted">
                                                sprukotrust.VYZOR@gmail.com
                                            </p>
                                            <p className="mb-1 text-muted">
                                                (555) 555-1234
                                            </p>
                                            <p className="text-muted">For more information check for <Link to="#!" className="text-primary fw-medium"><u>GSTIN</u></Link> Details.</p>
                                        </Col>
                                        <Col xl={4} lg={4} md={6} sm={6} className="ms-auto mt-sm-0 mt-3">
                                            <p className="text-muted mb-2">
                                                Billing To :
                                            </p>
                                            <p className="fw-bold mb-1">
                                                Jack Miller
                                            </p>
                                            <p className="text-muted mb-1">
                                                Lig-22-1,20 Covington Place
                                            </p>
                                            <p className="text-muted mb-1">
                                                New Castle,de, United States,19320
                                            </p>
                                            <p className="text-muted mb-1">
                                                jackmiller2134@gmail.com
                                            </p>
                                            <p className="text-muted">
                                                +1 202-918-2132
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Invoice ID :</p>
                                    <p className="fs-15 mb-1">#SPK120219890</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Date Issued :</p>
                                    <p className="fs-15 mb-1">29,Nov 2025 - <span className="text-muted fs-12">12:42PM</span></p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Due Date :</p>
                                    <p className="fs-15 mb-1">29,Dec 2025</p>
                                </Col>
                                <Col xl={3}>
                                    <p className="fw-medium text-muted mb-1">Due Amount :</p>
                                    <p className="fs-16 mb-1 fw-medium">$2,570.42</p>
                                </Col>
                                <Col xl={12}>
                                    <div className="table-responsive">
                                        <SpkTables tableClass="nowrap text-nowrap table-borderless border mt-4" header={[{ title: 'Brand Name' }, { title: 'Description' }, { title: 'Quantity' }, { title: 'Price Per Unit' }, { title: 'Total' }]}>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        TechFusion
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Wireless Bluetooth Earbuds
                                                    </div>
                                                </td>
                                                <td className="product-quantity-container">
                                                    15
                                                </td>
                                                <td>
                                                    $49.99
                                                </td>
                                                <td>
                                                    $749.85
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        HomeEase
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Memory Foam Pillow
                                                    </div>
                                                </td>
                                                <td className="product-quantity-container">
                                                    20
                                                </td>
                                                <td>
                                                    $19.99
                                                </td>
                                                <td>
                                                    $399.80
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        GizmoWorks
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Smartwatch with Fitness Tracker
                                                    </div>
                                                </td>
                                                <td className="product-quantity-container">
                                                    10
                                                </td>
                                                <td>
                                                    $129.99
                                                </td>
                                                <td>
                                                    $1,299.90
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        PureLux
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        LED Desk Lamp with USB Charging Port
                                                    </div>
                                                </td>
                                                <td className="product-quantity-container">
                                                    30
                                                </td>
                                                <td>
                                                    $24.99
                                                </td>
                                                <td>
                                                    $749.70
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="fw-medium">
                                                        EcoVibe
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        Stainless Steel Water Bottle
                                                    </div>
                                                </td>
                                                <td className="product-quantity-container">
                                                    50
                                                </td>
                                                <td>
                                                    $14.99
                                                </td>
                                                <td>
                                                    $749.50
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}></td>
                                                <td colSpan={2}>
                                                    <table className="table table-sm text-nowrap mb-0 table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Sub Total :</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">$3,999.75</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Avail Discount :</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">$49.99</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Coupon Discount <span className="text-success">(10%)</span> :</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">$399.98</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Vat <span className="text-danger">(20%)</span> :</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">$799.95</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0">Due Till Date :</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-15">$0</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row" className="w-60">
                                                                    <p className="mb-0 fs-14">Total :</p>
                                                                </th>
                                                                <td>
                                                                    <p className="mb-0 fw-medium fs-16 text-success">$4,349.73</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </SpkTables>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <Card className="custom-card">
                                        <Card.Body>
                                            <h6 className="fw-semibold mb-4">
                                                Mode Of Payment :
                                            </h6>
                                            <div className="row">
                                                <Col xl={12}>
                                                    <p className="fs-14 fw-medium">
                                                        Credit/Debit Card
                                                    </p>
                                                    <p>
                                                        <span className="fw-medium text-muted fs-12">Name On Card :</span> Jack Miller
                                                    </p>
                                                    <p>
                                                        <span className="fw-medium text-muted fs-12">Card Number :</span> 1234 5678 9087 XXXX
                                                    </p>
                                                    <p>
                                                        <span className="fw-medium text-muted fs-12">Due Date :</span> 29,Dec 2025 - <span className="text-danger fs-12 fw-medium">30 days due</span>
                                                    </p>
                                                    <p className="mb-0">
                                                        <span className="fw-medium text-muted fs-12">Invoice Status : <span className="badge bg-warning-transparent">Pending</span></span>
                                                    </p>
                                                </Col>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={12}>
                                    <div>
                                        <label htmlFor="invoice-note" className="form-label">Note:</label>
                                        <Form.Control as="textarea" className="" id="invoice-note" rows={3} defaultValue={"Once the invoice has been verified by the accounts payable team and recorded, the only task left is to send it for approval before releasing the payment"} />
                                    </div>
                                </Col>
                            </div>
                        </Card.Body>
                        <div className="card-footer text-end">
                            <SpkButton Buttonvariant="warning" Customclass="btn m-1">Save As PDF<i className="ri-file-pdf-line ms-1 align-middle d-inline-block"></i></SpkButton>
                            <SpkButton Buttonvariant="success" Customclass="btn m-1">Download Invoice<i className="ri-download-2-line ms-1 d-inline-block"></i></SpkButton>
                            <SpkButton Buttonvariant="primary" Customclass="btn m-1">Send Invoice <i className="ri-send-plane-2-line ms-1 align-middle d-inline-block"></i></SpkButton>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default InvoiceDetails;