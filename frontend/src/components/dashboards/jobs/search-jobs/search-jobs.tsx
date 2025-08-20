
import React, { Fragment, useState } from "react";
import { ButtonGroup, Card, Col, Collapse, Dropdown, Form, Pagination, Row } from "react-bootstrap";
import { connect } from "react-redux";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import LabeledTwoThumbs1, { JobTable } from "../../../../shared/data/dashboards/jobs/searchjobdata";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";

interface SearchJobsProps { }

const SearchJobs: React.FC<SearchJobsProps> = ({ local_varaiable }: any) => {

    const [open, setOpen] = useState(false);

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Search Jobs" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Search Jobs" activepage="Search Jobs" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                <Col xxl={3} xl={3} className="">
                    <Card className="custom-card products-navigation-card">
                        <Card.Body className="p-0">
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Categories</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="c-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-1">
                                            Software Engineer
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">2,712</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="c-2" />
                                        <label className="form-check-label" htmlFor="c-2">
                                            Data Analyst
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">536</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="c-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-3">
                                            Product Manager
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">18,289</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="c-4" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-4">
                                            UI/UX Designer
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">3,453</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="c-5" />
                                        <label className="form-check-label" htmlFor="c-5">
                                            Marketing 
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">7,165</SpkBadge>
                                    </div>
                                    <Collapse in={open}>
                                        <div className="" id="category-more">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="c-6" />
                                                <label className="form-check-label" htmlFor="c-6">
                                                    HR Manager
                                                </label>
                                                <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">5,964</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="c-7" />
                                                <label className="form-check-label" htmlFor="c-7">
                                                    FullStack
                                                </label>
                                                <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">2,123</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="c-8" />
                                                <label className="form-check-label" htmlFor="c-8">
                                                    Administrator
                                                </label>
                                                <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">2,123</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="c-9" />
                                                <label className="form-check-label" htmlFor="c-9">
                                                    Sales Manager
                                                </label>
                                                <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">2,123</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="c-10" />
                                                <label className="form-check-label" htmlFor="c-10">
                                                    Support Lead
                                                </label>
                                                <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">2,123</SpkBadge>
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Link  className="ecommerce-more-link badge bg-primary-transparent" data-bs-toggle="collapse" to="#category-more" role="button" aria-expanded={open} onClick={() => setOpen(!open)} aria-controls="category-more">More</Link>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Shift Type</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="j-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-1">
                                            Day Shift
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">512</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="j-2" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-2">
                                            Night Shift
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="j-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-3">
                                            Flexible
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">734</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="j-4" />
                                        <label className="form-check-label" htmlFor="j-4">
                                            Rotational
                                        </label>
                                        <SpkBadge variant="" Customclass="badge bg-light text-default fw-500 float-end">16</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Salary Range</h6>
                                <div className="py-3 pb-0">
                                    <div id="nonlinear">
                                        <LabeledTwoThumbs1 rtl={local_varaiable.dir == 'rtl'} />
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3 border-bottom">
                                <h6 className="fw-medium mb-0">Qualification</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-1" />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-1">
                                            Computer Science
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">16,563</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-2" defaultChecked />
                                        <label className="form-check-label" htmlFor="q-2">
                                            Marketing
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">15,234</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-3" />
                                        <label className="form-check-label" htmlFor="q-3">
                                            Design
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">6,278</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-4" defaultChecked />
                                        <label className="form-check-label" htmlFor="q-4">
                                            Business
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">4,531</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-5" />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-5">
                                            HR Management
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">2,405</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-6" />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-6">
                                            Product Management
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">453</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-7" />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-7">
                                            Web Development
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">123</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-8" />
                                        <label className="form-check-label" htmlFor="q-8">
                                            IT
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">422</span>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="q-9" />
                                        <label className="form-check-label" htmlFor="q-9">
                                            Customer Service
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">256</span>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-sm-4 p-3">
                                <h6 className="fw-medium mb-0">Experience</h6>
                                <div className="py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="e-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="e-1">
                                            1-3 years
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">156</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="e-2" />
                                        <label className="form-check-label" htmlFor="e-2">
                                            2-4 years
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">632</span>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="e-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="e-3">
                                            3-5 years
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">32</span>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="e-4" defaultChecked />
                                        <label className="form-check-label" htmlFor="e-4">
                                            4-6 years
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">54</span>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="e-5" defaultChecked />
                                        <label className="form-check-label" htmlFor="e-5">
                                            5+ years
                                        </label>
                                        <span className="badge bg-light text-default fw-500 float-end">44</span>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9} xl={9} className="">
                    <Row>
                        <Col lg={12}>
                            <div className="input-group companies-search-input mb-4">
                                <Form.Control type="text" className="form-control-lg w-25" aria-label="Text input with segmented dropdown button" placeholder="Enter your keyword here" />
                                <Form.Control type="text" className="form-control-lg w-25" aria-label="Text input with segmented dropdown button" placeholder="Search by location" />
                                <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="btn z-0"><i className="ri-search-line"></i></SpkButton>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body className="p-3">
                                    <Row className="align-items-center">
                                        <Col sm={8}>
                                            <div className="d-flex">
                                                <h5 className="fw-medium mb-0"><span className="fw-normal">Showing</span> 3456 Jobs</h5>
                                            </div>
                                        </Col>
                                        <Col sm={4} className="text-sm-end mt-3 mt-sm-0">
                                            <SpkDropdown as={ButtonGroup} Toggletext="Sort By" Togglevariant="btn btn-outline-light border dropdown-toggle no-caret" Arrowicon={true}>
                                                <Dropdown.Item as="li" >Featured</Dropdown.Item>
                                                <Dropdown.Item as="li" >Newest</Dropdown.Item>
                                                <Dropdown.Item as="li" >Most Relevant</Dropdown.Item>
                                                <Dropdown.Item as="li" >Best Rated</Dropdown.Item>
                                            </SpkDropdown>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap">
                                            {JobTable.map((job, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="lh-1">
                                                                <span className={`avatar avatar-xl bg-${job.avatarColor}-transparent svg-${job.avatarColor}`}>
                                                                    {job.svgIcon}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h6 className="fw-semibold mb-1">{job.title}</h6>
                                                                <span className="d-block fw-medium">{job.company}</span>
                                                                <span className="d-block text-muted fs-13">{job.location}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="fs-13 d-block text-muted mb-1">Job Vacancies</span>
                                                            <span className="fw-semibold">{job.jobVacancies}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="fs-13 d-block text-muted mb-1">Qualification</span>
                                                            <span className="fw-semibold">{job.qualification}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="fs-13 d-block text-muted mb-1">Experience</span>
                                                            <span className="fw-semibold">{job.experience}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="fs-13 d-block text-muted mb-1">Shift</span>
                                                            <SpkBadge variant="" Customclass={`${job.shift === 'Day Shift' ? 'bg-primary-transparent' : 'bg-warning-transparent'}`}>{job.shift}</SpkBadge>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-center">
                                                            <span className="fs-13 d-block text-muted mb-1">Salary</span>
                                                            <span className="fw-semibold">{job.salaryRange}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="mb-2">
                                                            <SpkTooltips placement="top" title="Featured Jobs">
                                                                <Link  to="#!" className="btn btn-icon btn-warning-light rounded-circle btn-sm">
                                                                    <span><i className="ti ti-star-filled align-middle"></i></span>
                                                                </Link>
                                                            </SpkTooltips>
                                                        </div>
                                                        <Link  to="#!" className="text-primary fw-medium d-inline-flex">
                                                            Apply Now <i className="ti ti-arrow-narrow-right ms-2 lh-base rtl-rotate"></i>
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
                        <Pagination.Prev disabled>
                            Prev
                        </Pagination.Prev>
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Next className="text-primary">
                            Next
                        </Pagination.Next>
                    </Pagination>
                </Col>
            </Row>

            {/* <!-- End::row-2 --></div> */}

        </Fragment>
    )
};

const mapStateToProps = (state: any) => ({
    local_varaiable: state
});
export default connect(mapStateToProps,)(SearchJobs);