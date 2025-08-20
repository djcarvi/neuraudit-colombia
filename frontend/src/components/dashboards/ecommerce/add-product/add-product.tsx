
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { FilePond } from "react-filepond";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { Availableselect, Brandselect, Categoryselect, Colorselect, Genderselect, Productselect, Publishselect, Sizeselect } from "../../../../shared/data/dashboards/ecommerce/addproductsdata";
import SpkSunEditor from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-suneditor";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface AddProductProps { }

const AddProduct: React.FC<AddProductProps> = () => {

    const [files, setFiles] = useState<any>([]);
    const [files1, setFiles1] = useState<any>([]);

    const [dates, setDates] = useState<{ [key: string]: Date | string | null }>({});
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

            <Seo title="Dashboards-Add Products" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Add Product" activepage="Add Product" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Product Images
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <FilePond className="multiple-filepond" files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click' />
                            <label className="form-label text-muted mt-1 fs-13 mb-0 fw-normal">Upload 6 images, ensuring uniform size (max 2MB). Changes can be made after 24 hours. </label>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Product Details
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-2">
                                <Col xl={12} className="custom-picker">
                                    <Form.Label htmlFor="publish-date" className="">Publish Date</Form.Label>
                                    <SpkDatepickr className="form-control flatpickr-input" selected={dates["startDate"] ? new Date(dates["startDate"]) : null} onChange={(date: Date | null) => handleDateChange("startDate", date)}  placeholderText='Choose Date' />
                                </Col>
                                <Col xl={12} className="custom-picker">
                                    <Form.Label htmlFor="publish-time" className="">Publish Time</Form.Label>
                                    <SpkDatepickr className="form-control " selected={dates["limitPicker"] ? new Date(dates["limitPicker"]) : null} onChange={(date: Date | null) => handleDateChange("limitPicker", date)} showTimeSelect showTimeSelectOnly timeIntervals={15} Caption="Time" dateFormat="h:mm aa" placeholderText='Choose Time' />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="product-status-add" className="">Published Status</Form.Label>
                                    <SpkSelect name="colors" option={Publishselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="product-tags" className="">Product Tags</Form.Label>
                                    <SpkSelect multi name="colors" option={Productselect} defaultvalue={[Productselect[3], Productselect[0]]} mainClass="basic-multi-select" searchable menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="product-status-add1" className="">Availability</Form.Label>
                                    <SpkSelect name="colors" option={Availableselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Warrenty Documents
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <FilePond className="multiple-filepond" files={files1} onupdatefiles={setFiles1} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click' />
                            <Form.Label className="form-label text-muted mt-1 fs-13 fw-normal mb-0">Upload warranty document (PDF/DOC, max 5MB).</Form.Label>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={9}>
                    <Card className="custom-card shadow-none mb-0 border-0">
                        <Card.Body className="p-0">
                            <Row className="gy-3">
                                <Col xl={12}>
                                    <Form.Label htmlFor="product-name-add" className="">Product Name</Form.Label>
                                    <Form.Control type="text" className="" id="product-name-add" placeholder="Name" />
                                    <Form.Label htmlFor="product-name-add" className=" mt-1 fs-12 fw-normal text-muted mb-0">*Product Name should not exceed 30 characters</Form.Label>
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-category-add" className="">Category</Form.Label>
                                    <SpkSelect name="colors" option={Categoryselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Category" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-gender-add" className="">Gender</Form.Label>
                                    <SpkSelect name="colors" option={Genderselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                                <Col xl={6}>
                                    <label htmlFor="product-size-add" className="">Size</label>
                                    <SpkSelect name="colors" option={Sizeselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />

                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-brand-add" className="">Brand</Form.Label>
                                    <SpkSelect name="colors" option={Brandselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                                <Col xl={6} className="color-selection">
                                    <Form.Label htmlFor="product-color-add" className="">Colors</Form.Label>
                                    <SpkSelect multi name="colors" option={Colorselect} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-cost-add" className="">Enter Cost</Form.Label>
                                    <Form.Control type="text" className="" id="product-cost-add" placeholder="Cost" />
                                    <Form.Label htmlFor="product-cost-add" className="form-label mt-1 fs-12 op-5 text-muted mb-0">*Mention final price of the product</Form.Label>
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="product-description-add" className="">Product Description</Form.Label>
                                    <Form.Control as="textarea" className="" id="product-description-add" rows={2} />
                                    <Form.Label htmlFor="product-description-add" className=" form-label mt-1 fs-12 op-5 text-muted mb-0">*Description should not exceed 500 letters</Form.Label>
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="">Product Features</Form.Label>
                                    <div id="product-features">
                                        <SpkSunEditor height={'200px'} />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="product-actual-price" className="">Actual Price</Form.Label>
                                    <Form.Control type="text" className="" id="product-actual-price" placeholder="Actual Price" />
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="product-dealer-price" className="">Dealer Price</Form.Label>
                                    <Form.Control type="text" className="" id="product-dealer-price" placeholder="Dealer Price" />
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="product-discount" className="">Discount</Form.Label>
                                    <Form.Control type="text" className="" id="product-discount" placeholder="Discount in %" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-type" className="">Product Type</Form.Label>
                                    <Form.Control type="text" className="" id="product-type" placeholder="Type" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-discount" className="">Item Weight</Form.Label>
                                    <Form.Control type="text" className="" id="product-discount1" placeholder="Weight in gms" />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <div className="px-4 py-3 border-top border-block-start-dashed d-sm-flex justify-content-end mt-3">
                    <SpkButton Buttonvariant="primary-light" Customclass="me-2 mb-2 mb-sm-0">Add Product<i className="bi bi-plus-lg ms-2"></i></SpkButton>
                    <SpkButton Buttonvariant="success-light" Customclass="mb-2 mb-sm-0">Save Product<i className="bi bi-download ms-2"></i></SpkButton>
                </div>
            </Row>

            {/* <!-- End:: row-1 --> */}
            
        </Fragment>
    )
};

export default AddProduct;