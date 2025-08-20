
import React, { Fragment } from "react";
import { Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import OrdersTable, { DeliveryStatus, OrdersCard, PaymenntStatus } from "../../../../shared/data/dashboards/ecommerce/ordersdata";
import SpkListCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";

interface OrdersProps { }

const Orders: React.FC<OrdersProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Orders" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Orders" activepage="Orders" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row className="row-cols-xxl-5 row-cols-sm-2">
                {OrdersCard.map((idx, index) => (
                    <div className="col-12" key={index}>
                        <SpkListCard list={idx} listCard={true} cardClass={`dashboard-main-card orders-main-cards ${idx.priceColor}`} />
                    </div>
                ))}
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between border-bottom-0">

                            {/* <!-- Search Bar --> */}

                            <div className="w-sm-25">
                                <Form.Control className="" type="search" id="search-input" placeholder="Search Product" aria-label="search-product" />
                            </div>

                            {/* <!-- Filters Section --> */}

                            <div className="d-flex gap-4 flex-wrap w-sm-50 justify-content-end">

                                {/* <!-- Category Filter --> */}

                                <div>
                                <SpkDropdown Customclass="d-grid" Customtoggleclass="btn btn-primary-light" Togglevariant="" iconPosition='before' Icon={true} IconClass="ri-upload-2-line me-1" Toggletext="Export">
                                <Dropdown.Item as="li" className=""><i className="bi bi-file-earmark-excel me-2"></i>Excel</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-file-earmark-excel me-2"></i>Csv</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-filetype-pdf me-2"></i>PDF</Dropdown.Item>
                                        <Dropdown.Item as="li" className=""><i className="bi bi-file-zip me-2"></i>Zip</Dropdown.Item>
                                    </SpkDropdown>
                                </div>

                                {/* <!-- Status Filter --> */}

                                <div className="custom-list-select">
                                    <SpkSelect option={PaymenntStatus} placeholder="Payment Status" classNameprefix="Select2" />
                                </div>

                                {/* <!-- Stock Filter --> */}

                                <div className="custom-list-select">
                                    <SpkSelect option={DeliveryStatus} placeholder="Delivery Status" classNameprefix="Select2" />

                                </div>
                            </div>
                        </Card.Header>

                        {/* <!-- Table inside the card-body --> */}

                        <Card.Body className="p-0">
                            <div id="orders-table" className="grid-card-table">
                                <OrdersTable />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-2 --> */}

        </Fragment>
    )
};

export default Orders;