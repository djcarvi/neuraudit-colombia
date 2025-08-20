
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import CustomerList, { CustomerSelect, StatusSelect } from "../../../../shared/data/dashboards/ecommerce/customersdata";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";

interface CustomersListProps { }

const CustomersList: React.FC<CustomersListProps> = () => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false)

    const [selectedDate, setSelectedDate] = React.useState(null);
    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Customers List" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Customers List" activepage="Customers List" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <div className="card-header justify-content-between border-bottom-0">

                            {/* <!-- Search Bar --> */}

                            <div className="w-sm-25">
                                <Form.Control className="" type="search" id="search-input" placeholder="Search Customer" aria-label="search-customer" />
                            </div>

                            {/* <!-- Filters Section --> */}

                            <div className="d-flex gap-4 flex-wrap w-sm-50 justify-content-start justify-content-sm-end">

                                {/* <!-- Stock Filter --> */}

                                <div className="custom-list-select">
                                    <SpkSelect option={CustomerSelect} classNameprefix="Select2" placeholder="Customer Status" />
                                </div>
                                <div className="">
                                    <SpkDropdown Customclass="d-grid" Customtoggleclass="btn btn-primary-light" Togglevariant="" iconPosition='before' Icon={true} IconClass="ri-upload-2-line me-1" Toggletext="Export">
                                        <Dropdown.Item><i className="bi bi-file-earmark-excel me-2"></i>Excel</Dropdown.Item>
                                        <Dropdown.Item><i className="bi bi-file-earmark-excel me-2"></i>Csv</Dropdown.Item>
                                        <Dropdown.Item><i className="bi bi-filetype-pdf me-2"></i>PDF</Dropdown.Item>
                                        <Dropdown.Item><i className="bi bi-file-zip me-2"></i>Zip</Dropdown.Item>
                                    </SpkDropdown>
                                  
                                </div>

                                {/* <!-- Sort By Filter --> */}

                                <div className=" d-grid">
                                    <SpkButton Buttonvariant="primary" onClickfunc={handleShow} Customclass="btn" data-bs-toggle="modal" data-bs-target="#addtask"><i className="ri ri-add-line me-1"></i>Add Customer</SpkButton>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Table inside the card-body --> */}

                        <Card.Body className="p-0">
                            <div id="customers-list" className="grid-card-table">
                                <CustomerList />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: Add new customer modal --> */}

            <Modal show={show} className="fade" id="addtask" centered tabIndex={-1} aria-hidden="true">
                <Modal.Header>
                    <h6 className="modal-title" id="mail-ComposeLabel">Add Customer</h6>
                    <SpkButton Buttontype="button" Buttonvariant="" onClickfunc={handleClose} Customclass="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></SpkButton>
                </Modal.Header>
                <Modal.Body className="px-4">
                    <div className="row gy-2">
                        <Col xl={12}>
                            <Form.Label htmlFor="customer-name" className="">Customer Name</Form.Label>
                            <Form.Control type="text" className="" id="customer-name" placeholder="Customer Name" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="customer-email" className="">Customer Email</Form.Label>
                            <Form.Control type="email" className="" id="customer-email" placeholder="Customer Email" />
                        </Col>
                        <Col xl={12}>
                            <label className="form-label">Joined Date</label>
                            <div className="form-group">
                                <div className="input-group custom-customer">
                                    <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                    <SpkDatepickr className="form-control" selected={selectedDate} onChange={handleDateChange} Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" placeholderText='Choose date with time' showTimeInput />
                                </div>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <label className="form-label">Status</label>
                            <SpkSelect option={StatusSelect} classNameprefix="Select2" placeholder="Select" />
                        </Col>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" onClickfunc={handleClose} Buttontype="button" Customclass="btn"
                        data-bs-dismiss="modal">Cancel</SpkButton>
                    <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="btn">Add Customer</SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- End:: Add new customer modal --> */}

        </Fragment>
    )
};

export default CustomersList;