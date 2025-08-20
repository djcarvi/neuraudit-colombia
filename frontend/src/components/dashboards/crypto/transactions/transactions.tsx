
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import { TransactionCard, TransactionsTable } from "../../../../shared/data/dashboards/crypto/transactiondata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkListCard from "../../../../shared/@spk-reusable-components/application-reusable/spk-listcard";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";

interface TransactionsProps { }

const Transactions: React.FC<TransactionsProps> = () => {

    const [allData, setAllData] = useState(TransactionsTable);
    const handleRemove = (id: string) => {
        const newList = allData.filter((idx) => idx.id !== id)
        setAllData(newList)
    }

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Transactions" />

            <Pageheader title="Dashboards" subtitle="Crypto" currentpage="Transactions" activepage="Transactions" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                {TransactionCard.map((idx, index) => (
                    <Col xxl={3} lg={6} key={index}>
                        <SpkListCard titleClass="mb-2 fs-12" listCard={true} cardClass={idx.cardClass} list={idx} />
                    </Col>
                ))}
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Transaction History
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div>
                                    <Form.Control className="" type="search" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-primary btn-wave waves-effect waves-light no-caret" Toggletext="Sort By" Arrowicon={true}>
                                    <Dropdown.Item href="#!">This Week</Dropdown.Item>
                                    <Dropdown.Item href="#!">This Month</Dropdown.Item>
                                    <Dropdown.Item href="#!">This Year</Dropdown.Item>
                                </SpkDropdown>
                                <div>
                                    <SpkButton Buttonvariant="secondary" Customclass="btn btn-wave">View All</SpkButton>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap transaction-history-table" header={[{ title: '' }, { title: 'Sender' }, { title: 'Transaction Hash' }, { title: 'Coin' }, { title: 'Date' }, { title: 'Amount' }, { title: 'Receiver' }, { title: 'Status' }, { title: 'Actions' }]}>
                                    {allData.map((txn, index) => (
                                        <tr key={index}>
                                            <td>
                                                <span className={`avatar avatar-sm avatar-rounded ${txn.direction === 'up' ? 'bg-success-transparent' : 'bg-danger-transparent'}`}>
                                                    <i className={`ti ti-arrow-narrow-${txn.direction} text-${txn.direction === 'up' ? 'success' : 'danger'} fw-medium fs-16`}></i>
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-xs avatar-rounded">
                                                        <Image  src={txn.user.avatar} alt={txn.user.name} />
                                                    </span>
                                                    <div className="fw-medium">{txn.user.name}</div>
                                                </div>
                                            </td>
                                            <td><span>{txn.id}</span></td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-xs avatar-rounded">
                                                        <Image  src={txn.crypto.icon} alt={txn.crypto.name} />
                                                    </span>
                                                    <div className="fw-medium">{txn.crypto.name}</div>
                                                </div>
                                            </td>
                                            <td><span>{txn.date}</span></td>
                                            <td><span>{txn.amount}</span></td>
                                            <td><span>{txn.recipient}</span></td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`bg-${txn.statusColor}-transparent`}>{txn.status}</SpkBadge>
                                            </td>
                                            <td>
                                                <SpkTooltips title="Download" placement="top">
                                                <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-sm btn-primary-light me-1">
                                                    <i className="ri-download-2-line"></i>
                                                </SpkButton>
                                                </SpkTooltips>
                                                <SpkTooltips title="Delete" placement="top">
                                                <SpkButton Buttonvariant="" onClickfunc={() => handleRemove(txn.id)} Customclass="btn btn-danger-light btn-icon ms-1 btn-sm task-delete-btn">
                                                    <i className="ri-delete-bin-5-line"></i>
                                                </SpkButton>
                                                </SpkTooltips>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="border-top-0">
                            <nav aria-label="Page navigation" className="pagination-style-2">
                                <Pagination className="mb-0 flex-wrap justify-content-end">
                                    <Pagination.Prev disabled>Prev</Pagination.Prev>
                                    <Pagination.Item>1</Pagination.Item>
                                    <Pagination.Item active>2</Pagination.Item>
                                     <Pagination.Item><i className="bi bi-three-dots"></i></Pagination.Item>
                                    <Pagination.Item>17</Pagination.Item>
                                    <Pagination.Next className="text-primary">next</Pagination.Next>
                                </Pagination>
                            </nav>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default Transactions;