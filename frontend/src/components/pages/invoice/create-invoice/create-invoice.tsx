
import { Link } from "react-router-dom";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { FilePond } from "react-filepond";

interface CreateInvoiceProps { }

const CreateInvoice: React.FC<CreateInvoiceProps> = () => {

    const [files, setFiles] = useState<any>([]);

    const invoiceCurrencydata2 = [
        { value: 'USD - (United States Dollar)', label: 'USD - (United States Dollar)' },
        { value: 'BHD - (Bahraini Dinar)', label: 'BHD - (Bahraini Dinar)' },
        { value: 'KWD - (Kuwaiti Dinar)', label: 'KWD - (Kuwaiti Dinar)' },
        { value: 'CHF - (Swiss Franc)', label: 'CHF - (Swiss Franc)' },
    ];

    const Payapaldata = [
        { value: 'Credit/Debit Card', label: 'Credit/Debit Card' },
        { value: 'PayPal', label: 'PayPal' },
        { value: 'Stripe', label: 'Stripe' },
        { value: 'Apple Pay', label: 'Apple Pay' },
        { value: 'UPI', label: 'UPI' },
    ];


    function dec(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10);
        if (unit <= 0) {
            return false;
        } else {
            el.currentTarget.parentElement.querySelector("input").value = unit - 1
        }
    }
    function inc(el: any) {
        let unit = parseInt(el.currentTarget.parentElement.querySelector("input").value, 10);
        el.currentTarget.parentElement.querySelector("input").value = unit + 1
    }

    const [dates, setDates] = useState<{ [key: string]: Date | string }>({});
    const handleDateChange = (key: string, date: Date | null) => {
        if (date) {
            setDates((prevDates) => ({
                ...prevDates,
                [key]: date,
            }));
        } else {
            setDates((prevDates) => {
                const { [key]: removedKey, ...rest } = prevDates;
                return rest;
            });
        }
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Create-Invoice" />

            <Pageheader title="Pages" subtitle="Invoice" currentpage="Create-Invoice" activepage="Create-Invoice" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="row gy-3">
                                <Col xl={12}>
                                    <Row>
                                        <Col xl={12} className="invoice-company">
                                            <p className="fw-semibold mb-2">
                                                Company Logo :
                                            </p>
                                            <FilePond className="multiple-filepond" files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click ' />
                                        </Col>
                                        <Col xl={4} lg={4} md={6} sm={6} className="">
                                            <p className="fw-semibold mb-2">
                                                Billing From :
                                            </p>
                                            <div className="row gy-2">
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="Company-Name" placeholder="Company Name" defaultValue="SPRUKO TECHNOLOGIES" />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control as="textarea" className="" id="company-address" placeholder="Enter Address" rows={3} />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="company-mail" placeholder="Company Email" defaultValue="" />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="company-phone" placeholder="Phone Number" defaultValue="" />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control as="textarea" className="" id="invoice-subject" placeholder="Subject" rows={4} />
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col xl={4} lg={4} md={6} sm={6} className="ms-auto mt-sm-0 mt-3">
                                            <p className="fw-semibold mb-2">
                                                Billing To :
                                            </p>
                                            <div className="row gy-2">
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="customer-Name" placeholder="Customer Name" defaultValue="Jack Miller" />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control as="textarea" className="" id="customer-address" placeholder="Enter Address" rows={3} />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="customer-mail" placeholder="Customer Email" defaultValue="" />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="customer-phone" placeholder="Phone Number" defaultValue="" />
                                                </Col>
                                                <Col xl={12}>
                                                    <Form.Control type="text" className="" id="zip-code" placeholder="Zip Code" defaultValue="" />
                                                </Col>
                                                <Col xl={12}>
                                                    <p className="fw-semibold mb-2 mt-2">
                                                        Currency :
                                                    </p>
                                                    <SpkSelect name="colors" option={invoiceCurrencydata2} mainClass="basic-multi-select"
                                                        menuplacement='auto' classNameprefix="Select2" placeholder="Select Currency" />
                                                </Col>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={3}>
                                    <Form.Label htmlFor="invoice-number" className="">Invoice ID</Form.Label>
                                    <Form.Control type="text" className="" id="invoice-number" placeholder="Inv No" defaultValue="#SPK120219890" />
                                </Col>
                                <Col xl={3} className="custom-picker">
                                    <Form.Label htmlFor="invoice-date-issued" className="">Date Issued</Form.Label>
                                    <SpkDatepickr className="form-control" dateFormat="yy/MM/dd" selected={dates["startDate"] ? new Date(dates["startDate"]) : null} onChange={(date: Date | null) => handleDateChange("startDate", date)} placeholderText='Choose date' />
                                </Col>
                                <Col xl={3} className="custom-picker">
                                    <Form.Label htmlFor="invoice-date-due" className="">Due Date</Form.Label>
                                    <SpkDatepickr className="form-control" dateFormat="yy/MM/dd" selected={dates["dueDate"] ? new Date(dates["dueDate"]) : null} onChange={(date: Date | null) => handleDateChange("dueDate", date)} placeholderText='Choose date' />
                                </Col>
                                <Col xl={3}>
                                    <Form.Label htmlFor="invoice-due-amount" className="">Due Amount</Form.Label>
                                    <Form.Control type="text" className="" id="invoice-due-amount" placeholder="Enter Amount" defaultValue="$12,983.78" />
                                </Col>
                                <Col xl={12}>
                                    <div className="table-responsive">
                                        <SpkTables tableClass="nowrap text-nowrap table-borderless border mt-3" header={[{ title: 'Product Name' }, { title: 'Description' }, { title: 'Quantity' }, { title: 'Price Per Unit' }, { title: 'Total' }, { title: 'Action' }]} >
                                            <tr>
                                                <td>
                                                    <Form.Control type="text" className="" placeholder="Enter Product Name" />
                                                </td>
                                                <td>
                                                    <Form.Control as="textarea" rows={1} className="" placeholder="Enter Description" />
                                                </td>
                                                <td className="invoice-quantity-container">
                                                    <div className="input-group border rounded flex-nowrap">
                                                        <SpkButton Buttonvariant="primary" onClickfunc={dec} Customclass="btn btn-icon input-group-text flex-fill product-quantity-minus"><i className="ri-subtract-line"></i></SpkButton>
                                                        <Form.Control type="text" className=" form-control-sm border-0 text-center w-100" aria-label="quantity" id="product-quantity4" defaultValue="1" />
                                                        <SpkButton Buttonvariant="primary" onClickfunc={inc} Customclass="btn btn-icon input-group-text flex-fill product-quantity-plus"><i className="ri-add-line"></i></SpkButton>
                                                    </div>
                                                </td>
                                                <td><Form.Control className="" placeholder="" type="text" defaultValue="$60.00" /></td>
                                                <td><Form.Control className="" placeholder="" type="text" defaultValue="$120.00" /></td>
                                                <td>
                                                    <SpkButton Customclass="btn btn-sm btn-icon btn-danger-light"><i className="ri-delete-bin-5-line"></i></SpkButton>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Form.Control type="text" className="" placeholder="Enter Product Name" />
                                                </td>
                                                <td>
                                                    <Form.Control as="textarea" rows={1} className="" placeholder="Enter Description" />
                                                </td>
                                                <td className="invoice-quantity-container">
                                                    <div className="input-group border rounded flex-nowrap">
                                                        <SpkButton Buttonvariant="primary" onClickfunc={dec} Customclass="btn btn-icon input-group-text flex-fill product-quantity-minus"><i className="ri-subtract-line"></i></SpkButton>
                                                        <Form.Control type="text" className=" form-control-sm border-0 text-center w-100" aria-label="quantity" id="product-quantity5" defaultValue="1" />
                                                        <SpkButton Buttonvariant="primary" onClickfunc={inc} Customclass="btn btn-icon input-group-text flex-fill product-quantity-plus"><i className="ri-add-line"></i></SpkButton>
                                                    </div>
                                                </td>
                                                <td><Form.Control className="" placeholder="Enter Amount" type="text" /></td>
                                                <td><Form.Control className="" placeholder="Enter Amount" type="text" /></td>
                                                <td>
                                                    <SpkButton Customclass="btn btn-sm btn-icon btn-danger-light"><i className="ri-delete-bin-5-line"></i></SpkButton>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={6} className="border-bottom-0"><Link  className="btn btn-primary-light" to="#!"><i className="bi bi-plus-lg"></i> Add Product</Link></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4}></td>
                                                <td colSpan={2}>
                                                    <Table className="table-sm text-nowrap mb-0 table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">
                                                                    <div className="fw-medium">Sub Total :</div>
                                                                </th>
                                                                <td>
                                                                    <Form.Control type="text" className="invoice-amount-input" placeholder="Enter Amount" defaultValue="$1209.89" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">
                                                                    <div className="fw-medium">Avail Discount :</div>
                                                                </th>
                                                                <td>
                                                                    <Form.Control type="text" className="invoice-amount-input" placeholder="Enter Amount" defaultValue="$29.98" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">
                                                                    <div className="fw-medium">Coupon Discount <span className="text-success">(10%)</span> :</div>
                                                                </th>
                                                                <td>
                                                                    <Form.Control type="text" className="invoice-amount-input" placeholder="Enter Amount" defaultValue="$129.00" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">
                                                                    <div className="fw-medium">Vat <span className="text-danger">(20%)</span> :</div>
                                                                </th>
                                                                <td>
                                                                    <Form.Control type="text" className="invoice-amount-input" placeholder="Enter Amount" defaultValue="$258.00" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">
                                                                    <div className="fw-medium">Due Till Date :</div>
                                                                </th>
                                                                <td>
                                                                    <Form.Control type="text" className="invoice-amount-input" placeholder="Enter Amount" defaultValue="$0.00" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">
                                                                    <div className="fs-14 fw-medium">Total :</div>
                                                                </th>
                                                                <td>
                                                                    <Form.Control type="text" className="invoice-amount-input" placeholder="Enter Amount" defaultValue="$1,071.89" />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        </SpkTables>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="row gy-3">
                                        <Col xl={12}>
                                            <SpkSelect name="colors" option={Payapaldata} mainClass="basic-multi-select"
                                                menuplacement='auto' classNameprefix="Select2" placeholder="Select Currency" />
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Control type="text" className="" placeholder="Card Holder Name" />
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Control type="text" className="" id="invoice-payment-cardname" placeholder="Card Number" defaultValue="1234 5678 9087 XXXX" />
                                            <Form.Label htmlFor="invoice-payment-cardname" className="mb-0"><Link  className="text-danger fs-11" to="#!">Enter valid card number*</Link></Form.Label>
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Control type="text" className="" placeholder="Enter OTP" />
                                        </Col>
                                    </div>
                                </Col>
                                <Col xl={12}>
                                    <div>
                                        <Form.Label htmlFor="invoice-note" className="">Note:</Form.Label>
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

export default CreateInvoice;