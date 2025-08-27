
import React, { Fragment } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import ProductTable, { StockProduct,CategoriesProduct, FilterProduct, ProductCards, StatusProduct, } from "../../../../shared/data/dashboards/ecommerce/productsdata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkListCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";

interface ProductsProps { }

const Products: React.FC<ProductsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Products" />

            <Pageheader title="Dashboards" subtitle="Ecommerce" currentpage="Products" activepage="Products" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row className="row-cols-xxl-5 row-cols-md-3 row-cols-1">
                {ProductCards.map((idx, index) => (
                    <div className="col" key={index}>
                        <SpkListCard listCard={true} cardClass={`dashboard-main-card ${idx.priceColor}`} list={idx} />
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

                            <Row className="gy-2 w-sm-50">

                                {/* <!-- Category Filter --> */}

                                <div className="col custom-products-select">
                                    <SpkSelect option={CategoriesProduct} placeholder="Categories" name="choices-single-default" id="category-filter" classNameprefix="Select2" />
                                </div>

                                {/* <!-- Status Filter --> */}

                                <div className="col custom-products-select">
                                    <SpkSelect option={StatusProduct} placeholder="Status" name="choices-single-default" id="status-filter" classNameprefix="Select2" />
                                </div>

                                {/* <!-- Stock Filter --> */}

                                <div className="col custom-products-select">
                                    <SpkSelect option={StockProduct} placeholder="Stock" name="choices-single-default" id="stock-filter" classNameprefix="Select2" />
                                </div>

                                {/* <!-- Sort By Filter -->/ */}

                                <div className="col custom-products-select">
                                    <SpkSelect option={FilterProduct} placeholder="Sort By" name="choices-single-default" id="sort-filter" classNameprefix="Select2" />
                                </div>
                            </Row>
                        </Card.Header>

                        {/* <!-- Table inside the card-body --> */}

                        <Card.Body className="p-0">
                            <div id="product-table" className="grid-card-table">
                                <ProductTable />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End::row-2 --> */}

        </Fragment>
    )
};

export default Products;