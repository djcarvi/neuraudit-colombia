
import React, { Fragment } from "react";
import { Col, Image, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Activedata, Basictable, Borderdata, Bordertable, Captiondata, ColorTables, Groupdata, Hoverable, Hoverabledata, Primaryhead, Primarytable, Responsivedata, Smalltables, Strippedtable, Successtable, Tablefoot, Topcaptuiondata, VerticalTables, Warninghead, Warningtable, tablePrimary } from "../../../shared/data/tables/basictablesdata";
import {BasicTable5, basicTable1, basicTable10, basicTable11, basicTable12, basicTable13, basicTable14, basicTable15, basicTable16, basicTable17, basicTable18, basicTable19, basicTable2, basicTable20, basicTable21, basicTable22, basicTable23, basicTable24, basicTable25, basicTable26, basicTable27, basicTable28, basicTable29, basicTable3, basicTable30, basicTable31, basicTable32, basicTable4, basicTable6, basicTable7, basicTable8, basicTable9, loopTable10, loopTable16, loopTable17, loopTable18, loopTable19, loopTable2, loopTable24, loopTable25, loopTable26, loopTable27, loopTable28, loopTable29, loopTable3, loopTable31, loopTable32, loopTable4, loopTable5, loopTable6, loopTable7, loopTable8, reusableTable1, reusableTable11, reusableTable12, reusableTable13, reusableTable14, reusableTable15, reusableTable16, reusableTable17, reusableTable18, reusableTable19, reusableTable2, reusableTable20, reusableTable21, reusableTable22, reusableTable23, reusableTable24, reusableTable25, reusableTable26, reusableTable27, reusableTable28, reusableTable29, reusableTable3, reusableTable30, reusableTable31, reusableTable32, reusableTable4, reusableTable5, reusableTable6, reusableTable7, reusableTable8, reusableTable9, reusabletable10 } from "../../../shared/data/prism-code/tables-prism";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import ShowCode from "../../../shared/layouts-components/showcode/showcode";

interface TablesProps { }

const Tables: React.FC<TablesProps> = () => {

    return (

        <Fragment>

            <Seo title="Tables" />

            <Pageheader title="Tables" currentpage="Tables" activepage="Tables" />

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Basic Tables" customCardBodyClass="" reactCode={basicTable1} reusableCode={reusableTable1}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" header={[{ title: 'Name' }, { title: 'Created On' }, { title: 'Number' }, { title: 'Status' }]}>
                                {Basictable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.date}</td>
                                        <td>{idx.number}</td>
                                        <td><SpkBadge variant="" Customclass={`bg-outline-${idx.color}`}>{idx.status}</SpkBadge></td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Bordered Tables" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable2} dataCode={loopTable2} reusableCode={reusableTable2}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-bordered" header={[{ title: 'User' }, { title: 'Status' }, { title: 'Email' }, { title: 'Action' }]}>
                                {Bordertable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                    <Image width={20} height={20} src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </th>
                                        <td><SpkBadge variant={idx.color} Customclass={`${idx.class}`}>{idx.text}</SpkBadge></td>
                                        <td>{idx.mail}</td>
                                        <td>
                                            <div className="hstack gap-2 flex-wrap">
                                                <Link to="#!" className="text-info fs-14 lh-1">
                                                    <i className="ri-edit-line"></i>
                                                </Link>
                                                <Link to="#!" className="text-danger fs-14 lh-1">
                                                    <i className="ri-delete-bin-5-line"></i>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={4}>
                    <ShowCode title=" Bordered Primary" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable3} dataCode={loopTable3} reusableCode={reusableTable3}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-bordered border-primary" header={[{ title: 'Order' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Action' }]}>
                                {Primarytable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            {idx.order}
                                        </th>
                                        <td>
                                            <SpkBadge variant="light" Customclass="text-dark">{idx.date}</SpkBadge>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                    <Image width={20} height={20} src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </td>
                                        <td><SpkBadge variant="primary-transparent">Booked</SpkBadge></td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Bordered Success" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable4} dataCode={loopTable4} reusableCode={reusableTable4}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-bordered border-success" header={[{ title: 'Order' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Status' }]}>
                                {Successtable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            {idx.order}
                                        </th>
                                        <td>
                                            <SpkBadge variant="light" Customclass=" text-dark">{idx.date}</SpkBadge>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                    <Image width={20} height={20} src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </td>
                                        <td><SpkBadge variant="success-transparent">Delivered</SpkBadge></td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Bordered warning" customCardClass="custom-card" customCardBodyClass="" reactCode={BasicTable5} dataCode={loopTable5} reusableCode={reusableTable5}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-bordered border-warning" header={[{ title: 'Order' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Status' }]}>
                                {Warningtable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            {idx.order}
                                        </th>
                                        <td>
                                            <SpkBadge variant="light" Customclass="text-dark">{idx.date}</SpkBadge>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                    <Image width={20} height={20} src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </td>
                                        <td><SpkBadge variant="warning-transparent">Accepted</SpkBadge></td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Table Without Borders" customCardClass="custom-card" customCardBodyClass="" dataCode={loopTable6} reactCode={basicTable6} reusableCode={reusableTable6}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-borderless" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Borderdata.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.transactionid}</td>
                                        <td>{idx.date}</td>
                                        <td><SpkBadge variant="" Customclass={`bg-${idx.color}`}>{idx.status}</SpkBadge></td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Table Group Divideres" customCardClass="custom-card" customCardBodyClass="" dataCode={loopTable7} reactCode={basicTable7} reusableCode={reusableTable7}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" tBodyClass="table-group-divider" header={[{ title: 'Product' }, { title: 'Seller' }, { title: 'Sale Percentage' }, { title: 'Quantity Sold' }]}>
                                {Groupdata.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.product}</th>
                                        <td>{idx.seller}</td>
                                        <td><Link to="#!" className={`text-${idx.color}`}>{idx.percent}<i
                                            className={`ri-arrow-${idx.icon}-fill ms-1`}></i></Link></td>
                                        <td>{idx.sold}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Striped rows" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable8} dataCode={loopTable8} reusableCode={reusableTable8}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-striped" header={[{ title: 'ID' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Action' }]}>
                                {Strippedtable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.order}</th>
                                        <td>{idx.date}</td>
                                        <td>{idx.name}</td>
                                        <td>
                                            <SpkButton Buttonvariant="success" Size="sm" Customclass="waves-effect waves-light"> <i className="ri-download-2-line align-middle me-2 d-inline-block"></i>Download </SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Striped columns" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable9} dataCode={loopTable8} reusableCode={reusableTable9}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-striped-columns" header={[{ title: 'ID' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Action' }]}>
                                {Strippedtable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.order}</th>
                                        <td>{idx.date}</td>
                                        <td>{idx.name}</td>
                                        <td>
                                            <SpkButton Buttonvariant="danger" Size="sm" Customclass="waves-effect waves-light"> <i className="ri-delete-bin-line align-middle me-2 d-inline-block"></i>Delete </SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={4}>
                    <ShowCode title="Primary Table" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable10} dataCode={loopTable10} reusableCode={reusabletable10}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-primary" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                {tablePrimary.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.text1}</td>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Secondary Table" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable11} dataCode={loopTable10} reusableCode={reusableTable11}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-secondary" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                {tablePrimary.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.text1}</td>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Warning Table" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable12} dataCode={loopTable10} reusableCode={reusableTable12}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-warning" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                {tablePrimary.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.text1}</td>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Danger Table" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable13} dataCode={loopTable10} reusableCode={reusableTable13}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-danger" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                {tablePrimary.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.text1}</td>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Dark Table" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable14} dataCode={loopTable10} reusableCode={reusableTable14}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-dark" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                {tablePrimary.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.text1}</td>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Success Table With Striped Rows" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable15} dataCode={loopTable10} reusableCode={reusableTable15}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-success table-striped" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                {tablePrimary.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.text1}</td>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

            {/* <!-- Start:: row-6 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Hoverable Rows" customCardClass="custom-card custom-table-tasks" reactCode={basicTable16} reusableCode={reusableTable16} dataCode={loopTable16} >
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-hover" header={[{ title: 'Product Manager' }, { title: 'Category' }, { title: 'Team' }, { title: 'Status' }]}>
                                {Hoverabledata.map((idx, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar avatar-sm me-2 avatar-rounded">
                                                    <Image  src={idx.src} alt="img" />
                                                </div>
                                                <div>
                                                    <div className="lh-1">
                                                        <span>{idx.product}</span>
                                                    </div>
                                                    <div className="lh-1">
                                                        <span
                                                            className="fs-11 text-muted">{idx.mail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><SpkBadge Customclass={`bg-${idx.color}-transparent`}>{idx.category}</SpkBadge></td>
                                        <td>
                                            {idx.team}
                                        </td>
                                        <td>
                                            <SpkProgress variant='primary' mainClass='progress-xs' now={idx.status} animated />
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title=" Hoverable rows With striped rows" customCardClass="custom-card" reactCode={basicTable17} dataCode={loopTable17} reusableCode={reusableTable17}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-striped table-hover" header={[{ title: 'Invoice' }, { title: 'Customer' }, { title: 'Status' }, { title: 'Date' }]}>
                                {Hoverable.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.text1}</th>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar avatar-sm me-2 avatar-rounded">
                                                    <Image  src={idx.src} alt="img" />
                                                </div>
                                                <div>
                                                    <div className="lh-1">
                                                        <span>{idx.name}</span>
                                                    </div>
                                                    <div className="lh-1">
                                                        <span
                                                            className="fs-11 text-muted">{idx.mail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><SpkBadge variant={idx.color} Customclass={idx.class}><i
                                            className={`ri-${idx.icon} align-middle me-1`}></i>{idx.text2}</SpkBadge></td>
                                        <td>{idx.date}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-6 --> */}

            {/* <!-- Start:: row-7 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Table Head Primary" customCardClass="custom-card" reactCode={basicTable18} dataCode={loopTable18} reusableCode={reusableTable18}>
                        <div className="table-responsive">
                            <SpkTables headerClass="table-primary" tableClass="text-nowrap" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Primaryhead.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <div className="hstack gap-2 fs-15">
                                                <Link to="#!" className="btn btn-icon btn-sm btn-success-light rounded-pill"><i className="ri-download-2-line"></i></Link>
                                                <Link to="#!" className="btn btn-icon btn-sm btn-info-light rounded-pill"><i className="ri-edit-line"></i></Link>
                                                <Link to="#!" className="btn btn-icon btn-sm btn-danger-light rounded-pill"><i className="ri-delete-bin-line"></i></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Table Head warning" customCardClass="custom-card" reactCode={basicTable19} dataCode={loopTable19} reusableCode={reusableTable19}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" headerClass="table-warning" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Warninghead.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <SpkButton Buttonvariant={idx.color} Size="sm">{idx.btn}</SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Table Head Success" customCardClass="custom-card" reactCode={basicTable20} dataCode={loopTable19} reusableCode={reusableTable20} >
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" headerClass="table-success" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Warninghead.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <SpkButton Buttonvariant={idx.color} Size="sm">{idx.btn}</SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Table Head Info" customCardClass="custom-card" reactCode={basicTable21} dataCode={loopTable19} reusableCode={reusableTable21}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" headerClass="table-info" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Warninghead.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <SpkButton Buttonvariant={idx.color} Size="sm">{idx.btn}</SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Table Head Secondary" customCardClass="custom-card" reactCode={basicTable22} dataCode={loopTable19} reusableCode={reusableTable22}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" headerClass="table-secondary" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Warninghead.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <SpkButton Buttonvariant={idx.color} Size="sm">{idx.btn}</SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Table Head Danger" customCardClass="custom-card" reactCode={basicTable23} dataCode={loopTable19} reusableCode={reusableTable23}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" headerClass="table-danger" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Warninghead.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <SpkButton Buttonvariant={idx.color} Size="sm">{idx.btn}</SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-7 --> */}

            {/* <!-- Start:: row-8 --> */}

            <Row>
                <Col xl={4}>
                    <ShowCode title="Table Foot" customCardClass="custom-card" reactCode={basicTable24} dataCode={loopTable24} reusableCode={reusableTable24}>
                        <div className="table-responsive">
                            <SpkTables footerClass="table-primary" headerClass="table-primary" tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'Team' }, { title: 'Matches Won' }, { title: 'Win Ratio' }]}>
                                {Tablefoot.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            {idx.text1}
                                        </th>
                                        <td>{idx.text2}</td>
                                        <td>{idx.text3}</td>
                                        <td><SpkBadge variant="primary">{idx.text4}</SpkBadge></td>
                                    </tr>
                                ))}
                                <tr className="table-primary">
                                    <th scope="row">
                                        Total
                                    </th>
                                    <td>United States</td>
                                    <td>558</td>
                                    <td><SpkBadge variant="primary">56%</SpkBadge></td>
                                </tr>
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Table With Caption" customCardClass="custom-card" reactCode={basicTable25} dataCode={loopTable25} reusableCode={reusableTable25}>
                        <div className="table-responsive">
                            <SpkTables headerContent={<caption className='px-3 border-top'>Top 3 Countries</caption>} tableClass="text-nowrap" header={[{ title: 'S.No' }, { title: 'Country' }, { title: 'Medals Won' }, { title: 'No Of Athletes' }]}>
                                {Captiondata.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">0{idx.id}</th>
                                        <td>{idx.country}</td>
                                        <td>{idx.won}<i className="ri-medal-line mx-2"></i></td>
                                        <td>{idx.athletes}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={4}>
                    <ShowCode title="Table With Top Caption" customCardClass="custom-card" reactCode={basicTable26} reusableCode={reusableTable26} dataCode={loopTable26} >
                        <div className="table-responsive">
                            <SpkTables headerContent={<caption className="px-2">Top IT Companies</caption>} tableClass="text-nowrap caption-top" header={[{ title: 'S.No' }, { title: 'Name' }, { title: 'Revenue' }, { title: 'Country' }]}>
                                {Topcaptuiondata.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">{idx.id}</th>
                                        <td>{idx.name}</td>
                                        <td>{idx.revenue}</td>
                                        <td>{idx.country}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-8 --> */}

            {/* <!-- Start:: row-9 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Active Tables" customCardClass="custom-card" reactCode={basicTable27} reusableCode={reusableTable27} dataCode={loopTable27} >
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" header={[{ title: 'Name' }, { title: 'Created On' }, { title: 'Number' }, { title: 'Status' }]}>
                                {Activedata.map((idx, index) => (
                                    <tr key={index} className={idx.class}>
                                        <th scope="row">{idx.name}</th>
                                        <td>{idx.create}</td>
                                        <td className={idx.tdclass}>{idx.number}</td>
                                        <td><SpkBadge Customclass={`bg-${idx.color}`}>{idx.status}</SpkBadge></td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Small Tables" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable28} dataCode={loopTable28} reusableCode={reusableTable28}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-sm" header={[{ title: 'Invoice' }, { title: 'Created Date' }, { title: 'Status' }, { title: 'Action' }]}>
                                {Smalltables.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            <div className="form-check">
                                                <input id={idx.id} defaultChecked={idx.checked === 'defaultChecked'} className="form-check-input" type="checkbox" value="" />
                                                <div className="form-check-label">
                                                    {idx.name}
                                                </div>
                                            </div>
                                        </th>
                                        <td>{idx.date}</td>
                                        <td><SpkBadge variant={idx.class} Customclass="bg-success-transparent">{idx.text}</SpkBadge></td>
                                        <td>
                                            <div className="hstack gap-2 fs-15">
                                                <Link to="#!" className="btn btn-icon btn-sm btn-light"><i className="ri-download-2-line"></i></Link>
                                                <Link to="#!" className="btn btn-icon btn-sm btn-light"><i className="ri-edit-line"></i></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-9 --> */}

            {/* <!-- Start:: row-10 --> */}

            <Row>
                <Col xl={6}>
                    <ShowCode title="Color variants tables" customCardClass="custom-card" reactCode={basicTable29} dataCode={loopTable29} reusableCode={reusableTable29}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" header={[{ title: 'Color' }, { title: 'Client' }, { title: 'State' }, { title: 'Quantity' }, { title: 'Total Price' }]}>
                                {ColorTables.map((idx, index) => (
                                    <tr key={index} className={idx.bgcolor}>
                                        <th scope="row">{idx.text}</th>
                                        <td>{idx.name}</td>
                                        <td><SpkBadge variant={idx.color} Customclass={idx.class2}>Processed</SpkBadge></td>
                                        <td>{idx.quantity}</td>
                                        <td>{idx.price}</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={6}>
                    <ShowCode title="Nesting" customCardClass="custom-card" customCardBodyClass="" reactCode={basicTable30} reusableCode={reusableTable30}>
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap table-striped table-bordered" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>
                                        <table className="table text-nowrap mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Alphabets</th>
                                                    <th scope="col">Users</th>
                                                    <th scope="col">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">A</th>
                                                    <td>Dino King</td>
                                                    <td>dinoking231@gmail.com</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">B</th>
                                                    <td>Poppins sams</td>
                                                    <td>pops@gmail.com</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">C</th>
                                                    <td>Brian Shaw</td>
                                                    <td>swanbrian@gmail.com</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                                <tr>
                                    <th scope="row">4</th>
                                    <td>Jimmy</td>
                                    <td>the Ostrich</td>
                                    <td>Dummy Text</td>
                                </tr>
                                <tr>
                                    <th scope="row">5</th>
                                    <td>Cobra Kai</td>
                                    <td>the Snake</td>
                                    <td>Another Name</td>
                                </tr>
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-10 --> */}

            {/* <!-- Start:: row-11 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Always responsive" customCardClass="custom-card" reactCode={basicTable31} reusableCode={reusableTable31} dataCode={loopTable31} >
                        <div className="table-responsive">
                            <SpkTables tableClass="text-nowrap" showCheckbox={true} header={[{ title: 'Team Head' }, { title: 'Category' }, { title: 'Role' }, { title: 'Gmail' }, { title: 'Team' }, { title: 'Work Progress' }, { title: 'Revenue' }, { title: 'Action' }]}>
                                {Responsivedata.map((idx, index) => (
                                    <tr key={index}>
                                        <th scope="row"><input className="form-check-input" type="checkbox" id="checkboxNoLabel1" value="" aria-label="..." /></th>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                    <Image src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </td>
                                        <td>{idx.category}</td>
                                        <td><SpkBadge variant="primary-transparent" Customclass={`bg-${idx.color}-transparent`}>{idx.role}</SpkBadge></td>
                                        <td>{idx.mail}</td>
                                        <td>
                                            {idx.team}
                                        </td>
                                        <td>
                                            <SpkProgress mainClass="progress progress-xs" variant='primary' now={idx.progress} />
                                        </td>
                                        <td>{idx.revenue}</td>

                                        <td>
                                            <div className="hstack gap-2 fs-15">
                                                <Link to="#!" className="btn btn-icon btn-sm btn-success"><i className="ri-download-2-line"></i></Link>
                                                <Link to="#!" className="btn btn-icon btn-sm btn-info"><i className="ri-edit-line"></i></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-11 --> */}

            {/* <!-- Start:: row-12 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Vertical alignment" customCardClass="custom-card vertical-alignment-table" reactCode={basicTable32} dataCode={loopTable32} reusableCode={reusableTable32}>
                        <div className="table-responsive">
                            <SpkTables tableClass="align-middle" header={[{ title: 'Heading 1', headerClassname: 'w-25' }, { title: 'Heading 2', headerClassname: 'w-25' }, { title: 'Heading 3', headerClassname: 'w-25' }, { title: 'Heading 4', headerClassname: 'w-25' }]}>
                                {VerticalTables.map((idx, index) => (
                                    <tr key={index} className={idx.class1}>
                                        <td>{idx.text1} <code>{idx.code1}</code> {idx.text2}</td>
                                        <td>{idx.text1} <code>{idx.code1}</code> {idx.text2}</td>
                                        <td className={idx.class2}>{idx.text3} <code>{idx.code2}</code> {idx.text4}</td>
                                        <td>This here is some placeholder text, intended to take up
                                            quite a
                                            bit of vertical space, to demonstrate how the vertical
                                            alignment
                                            works in the preceding cells.</td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-12 --> */}

        </Fragment>
    )
};

export default Tables;  