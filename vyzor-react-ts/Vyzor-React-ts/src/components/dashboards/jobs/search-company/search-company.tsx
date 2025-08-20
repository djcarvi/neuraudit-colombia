
import React, { Fragment, useState } from "react";
import { ButtonGroup, Card, Col, Collapse, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import { CompaniesTable, Developerdata } from "../../../../shared/data/dashboards/jobs/searchcompanydata";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";

interface SearchCompanyProps { }

const SearchCompany: React.FC<SearchCompanyProps> = () => {

    const [open, setOpen] = useState(false);
    const [opens, setOpens] = useState(false);

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Search Company" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Search Company" activepage="Search Company" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={3}>
                    <Card className="custom-card products-navigation-card">
                        <Card.Body className="p-0">
                            <div className="p-4 border-bottom">
                                <h6 className="fw-medium mb-0">Industry Type</h6>
                                <div className="px-0 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-1">
                                            R & D
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">2,712</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-2" />
                                        <label className="form-check-label" htmlFor="c-2">
                                            Accounting
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">536</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-3">
                                            Business Process
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">18,289</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-4" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-4">
                                            Consulting
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">3,453</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-5" />
                                        <label className="form-check-label" htmlFor="c-5">
                                            Administrative
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">7,165</SpkBadge>
                                    </div>
                                    <Collapse in={open}>
                                        <div id="category-more">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="cc-6" />
                                                <label className="form-check-label" htmlFor="cc-6">
                                                    HR
                                                </label>
                                                <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">5,964</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="cc-7" />
                                                <label className="form-check-label" htmlFor="cc-7">
                                                    Marketing
                                                </label>
                                                <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">2,123</SpkBadge>
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Link  className="ecommerce-more-link badge bg-primary-transparent" aria-expanded={open} onClick={() => setOpen(!open)} data-bs-toggle="collapse" to="#category-more" role="button" aria-controls="category-more">More</Link>
                                </div>
                            </div>
                            <div className="p-4 border-bottom">
                                <h6 className="fw-medium mb-0">Location</h6>
                                <div className="px-0 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="available-1">
                                            Hyderabad
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">512</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-2" />
                                        <label className="form-check-label" htmlFor="available-2">
                                            Banglore
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-3" />
                                        <label className="form-check-label" htmlFor="available-3">
                                            Chennai
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">734</SpkBadge>
                                    </div>
                                    <Collapse in={opens}>
                                        <div id="location-more">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-6" />
                                                <label className="form-check-label" htmlFor="c-6">
                                                    Pune
                                                </label>
                                                <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">5,964</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-7" />
                                                <label className="form-check-label" htmlFor="c-7">
                                                    USA
                                                </label>
                                                <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">2,123</SpkBadge>
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Link  className="ecommerce-more-link badge bg-primary-transparent" data-bs-toggle="collapse" to="#location-more" role="button" aria-expanded={opens} onClick={() => setOpens(!opens)} aria-controls="location-more">More</Link>
                                </div>
                            </div>
                            <div className="p-4 border-bottom">
                                <h6 className="fw-medium mb-0">Company Size</h6>
                                <div className="px-0 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="bond-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="bond-1">
                                            0-50
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">145</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="bond-2" />
                                        <label className="form-check-label" htmlFor="bond-2">
                                            50 - 100
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">432</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="bond-3" />
                                        <label className="form-check-label" htmlFor="bond-3">
                                            100 - 150
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">123</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-bottom">
                                <h6 className="fw-medium mb-0">Recruiter Type</h6>
                                <div className="px-0 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="Recruiter-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="Recruiter-1">
                                            Direct Company
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">13</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="Recruiter-2" />
                                        <label className="form-check-label" htmlFor="Recruiter-2">
                                            Agency
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">67</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-bottom">
                                <h6 className="fw-medium mb-0">Job Vacancies</h6>
                                <div className="px-0 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="vacancies-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="vacancies-1">
                                            0 -10
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">13</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="vacancies-2" />
                                        <label className="form-check-label" htmlFor="vacancies-2">
                                            10 - 20
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">67</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="vacancies-3" />
                                        <label className="form-check-label" htmlFor="vacancies-3">
                                            20 +above
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">67</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h6 className="fw-medium mb-0">Type of Employement</h6>
                                <div className="px-0 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-1">
                                            Full Time
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">512</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-2" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-2">
                                            Part Time
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-3">
                                            Internship
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">734</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-4" />
                                        <label className="form-check-label" htmlFor="j-4">
                                            Freelancer
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">16</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-5" />
                                        <label className="form-check-label" htmlFor="j-5">
                                            Remote Job
                                        </label>
                                        <SpkBadge variant="light" Customclass="badge text-default  float-end ms-auto">1,432</SpkBadge>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9}>
                    <Row className="align-items-center mb-4">
                        <Col lg={12}>
                            <div className="input-group companies-search-input ">
                                <Form.Control type="text" className="form-control-lg w-25" aria-label="Text input with segmented dropdown button" placeholder="Enter your keyword here" />
                                <SpkSelect classNameprefix="Select2" mainClass='rounded-0 custom-select' name="form-field-name" option={Developerdata} placeholder="All categories" />
                                <Form.Control type="text" className="form-control-lg w-25" aria-label="Text input with segmented dropdown button" placeholder="Search by location" />
                                <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="btn z-0"><i className="ri-search-line"></i></SpkButton>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <h5 className="fw-medium mb-0 flex-grow-1">1287 <span className="fw-normal fs-18">Companies match for your search</span> </h5>
                                        <SpkDropdown as={ButtonGroup} Togglevariant="outline-light" Customtoggleclass="border no-caret" Toggletext="Sort By" Menuclass="dropdown-position" Menualign="end" Icon={true}
                                            IconClass="ri-arrow-down-s-line align-middle ms-1 d-inline-block">
                                            <Dropdown.Item>Premium</Dropdown.Item>
                                            <Dropdown.Item>Newest</Dropdown.Item>
                                            <Dropdown.Item>Most Relevant</Dropdown.Item>
                                            <Dropdown.Item>Fresher</Dropdown.Item>
                                            <Dropdown.Item>Experienced</Dropdown.Item>
                                            <Dropdown.Item>Bond Agreement</Dropdown.Item>
                                            <Dropdown.Item>Flexible Shift</Dropdown.Item>
                                            <Dropdown.Item>Day Shift</Dropdown.Item>
                                        </SpkDropdown>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden ">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="tex-nowrap company-search-table">
                                            {CompaniesTable.map((company, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-xl bg-light">
                                                                    <Image width={64} height={64} src={company.logo} alt={company.name} />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <h6 className="fw-semibold mb-0">{company.name}</h6>
                                                                <span className="text-muted fs-13 d-block">{company.location}</span>
                                                                <SpkBadge variant="" Customclass={`bg-${company.color}-transparent`}>{company.industry}</SpkBadge>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="d-block text-muted fs-13 mb-1">Established</span>
                                                            <span className="fw-semibold">{company.established}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="d-block text-muted fs-13 mb-1">Rating</span>
                                                            <span className="fw-semibold">
                                                                {company.rating}
                                                                <i className="ti ti-star-filled text-warning ms-1"></i>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="d-block text-muted fs-13 mb-1">Employees</span>
                                                            <span className="fw-semibold">{company.employees}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="d-block text-muted fs-13 mb-1">Job Vacancies</span>
                                                            <span className="fw-semibold">{company.jobVacancies}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-end">
                                                        <Link  to="#!" className="btn btn-primary-light d-inline-flex align-items-center">
                                                            Website<i className="ti ti-arrow-narrow-right ms-2"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </SpkTables>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Pagination className="mb-4 justify-content-end">
                        <Pagination.Prev disabled>Prev</Pagination.Prev>
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Next linkClassName="text-primary">Next</Pagination.Next>
                    </Pagination>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --></div> */}

        </Fragment>
    )
};

export default SearchCompany;