
import { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { BlogCategory, Publish, Published } from "../../../../shared/data/pages/blog/createblogdata";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import SpkSunEditor from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-suneditor";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { FilePond } from "react-filepond";

const BlogCreate = () => {
 const [files, setFiles] = useState<any>([]);
    const [startDate, setStartDate] = useState();
    //Datepicker function
    const handleDateChange = (date: any) => {
        if (date) {
            setStartDate(date);
        }
    };
    const [startDateTime, setStartDateTime] = useState();
    //Datepicker function
    const handleDateChangeTime = (date: any) => {
        if (date) {
            setStartDateTime(date);
        }
    };

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Blog-Createblog" />

            <Pageheader title="Pages" subtitle="Blog" currentpage="Create Blog" activepage="Create Blog" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} className="">
                    <Card className="custom-card">
                        <Card.Header className="">
                            <div className="card-title">New Blog</div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row gy-3">
                                <Col xl={12}>
                                    <Form.Label htmlFor="blog-title" className="">Blog Title</Form.Label>
                                    <Form.Control type="text" className="" id="blog-title" placeholder="Blog Title" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="blog-category" className="">Blog Category</Form.Label>
                                    <SpkSelect name="colors" option={BlogCategory} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select Category" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="blog-author" className="">Blog Author</Form.Label>
                                    <Form.Control type="text" className="" id="blog-author" placeholder="Enter Name" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="blog-author-email" className="">Email</Form.Label>
                                    <Form.Control type="text" className="" id="blog-author-email" placeholder="Enter Email" />
                                </Col>
                                <Col xl={6} className="custom-picker">
                                    <Form.Label htmlFor="publish-date" className="">Publish Date</Form.Label>
                                    <SpkDatepickr className="form-control" selected={startDate} onChange={handleDateChange} Timeinput="Time:" dateFormat="yy/MM/dd" placeholderText='Choose date'  />
                                </Col>
                                <Col xl={6} className="custom-picker">
                                    <Form.Label htmlFor="publish-time" className="">Publish Time</Form.Label>
                                    <SpkDatepickr className="form-control" selected={startDateTime} onChange={handleDateChangeTime} showTimeSelect showTimeSelectOnly={true} timeIntervals={15} Caption="Time" placeholderText="Choose Time" dateFormat="h:mm aa" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="product-status-add" className="">Published Status</Form.Label>
                                    <SpkSelect name="colors" option={Published} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="blog-tags" className="">Blog Tags</Form.Label>
                                    <SpkSelect multi name="colors" option={Publish} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select Category" defaultvalue={[Publish[0], Publish[3]]} />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="">Blog Content</Form.Label>
                                    <div id="blog-content">
                                        <SpkSunEditor/>
                                    </div>
                                </Col>
                                <Col xl={12} className="blog-images-container">
                                    <Form.Label htmlFor="blog-author-email" className="">Blog Images</Form.Label>
                                    <FilePond className="multiple-filepond" files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click' />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="">Blog Type</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <div className="form-check me-3">
                                            <input className="form-check-input" type="radio" name="blog-type" id="blog-free1" defaultChecked />
                                            <label className="form-check-label" htmlFor="blog-free1">
                                                Free
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="blog-type" id="blog-paid1" />
                                            <label className="form-check-label" htmlFor="blog-paid1">
                                                Paid
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="btn-list text-end">
                                <SpkButton Buttontype="button" Buttonvariant="light" Customclass="btn btn-sm">Save As Draft</SpkButton>
                                <SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn btn-sm">Post Blog</SpkButton>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}
            
        </Fragment>
    )
};

export default BlogCreate;