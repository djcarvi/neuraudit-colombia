
import React, { Fragment, useState } from "react";
import { ButtonGroup, Card, Col, Collapse, Dropdown, Form, Image, Pagination, Row } from "react-bootstrap";
import { connect } from "react-redux";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { Link } from "react-router-dom";
import LabeledTwoThumbs1 from "../../../../shared/data/dashboards/jobs/searchjobdata";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { CandidateSelect, Peopletable, SearchSelect } from "../../../../shared/data/dashboards/jobs/searchcandidatedata";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";

interface SearchCandidateProps { }

const SearchCandidate: React.FC<SearchCandidateProps> = ({ local_varaiable }: any) => {

    const [open, setOpen] = useState(false);
    const [opens, setOpens] = useState(false);

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Search Candidate" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Search Candidate" activepage="Search Candidate" />

            {/* <!-- Page Header Close --> */}


            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={3} className="">
                    <Card className="custom-card products-navigation-card">
                        <Card.Body className="p-0">
                            <div className="px-2 py-4 px-sm-4 border-bottom">
                                <h6 className="fw-medium mb-0">Categories</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-1">
                                            Software Engineer
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">2,712</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-2" />
                                        <label className="form-check-label" htmlFor="c-2">
                                            Data Analyst
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">536</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-3">
                                            Product Manager
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">18,289</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-4" defaultChecked />
                                        <label className="form-check-label" htmlFor="c-4">
                                            UI/UX Designer
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">3,453</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-5" />
                                        <label className="form-check-label" htmlFor="c-5">
                                            HR Manager
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">7,165</SpkBadge>
                                    </div>
                                    <Collapse in={open}>
                                        <div className="" id="category-more">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-6" />
                                                <label className="form-check-label" htmlFor="c-6">
                                                    Marketing Specialist
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">5,964</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-7" />
                                                <label className="form-check-label" htmlFor="c-7">
                                                    Sales Manager
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">2,123</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-8" />
                                                <label className="form-check-label" htmlFor="c-8">
                                                    Customer Support Lead
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">1,645</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-9" />
                                                <label className="form-check-label" htmlFor="c-9">
                                                    Full Stack Developer
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">1,432</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="c-10" />
                                                <label className="form-check-label" htmlFor="c-10">
                                                    Network Administrator
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">1,231</SpkBadge>
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Link className="badge bg-primary-transparent" data-bs-toggle="collapse" to="#category-more" role="button" aria-expanded={open} onClick={() => setOpen(!open)} aria-controls="category-more">More</Link>
                                </div>
                            </div>
                            <div className="px-2 py-4 px-sm-4 border-bottom">
                                <h6 className="fw-medium mb-0">Notice Period</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="available-1">
                                            Immediate
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">512</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-2" />
                                        <label className="form-check-label" htmlFor="available-2">
                                            1 Week
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-3" />
                                        <label className="form-check-label" htmlFor="available-3">
                                            2 Weeks
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">734</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-4" />
                                        <label className="form-check-label" htmlFor="available-4">
                                            1 Month
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">734</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-5" />
                                        <label className="form-check-label" htmlFor="available-5">
                                            2 Months
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">734</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="available-6" />
                                        <label className="form-check-label" htmlFor="available-6">
                                            3+ Months
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">734</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 py-4 px-sm-4 border-bottom">
                                <h6 className="fw-medium mb-0">Job Type</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-1">
                                            Full Time
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">512</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-2" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-2">
                                            Part Time
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-3" defaultChecked />
                                        <label className="form-check-label" htmlFor="j-3">
                                            Internship
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">734</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-4" />
                                        <label className="form-check-label" htmlFor="j-4">
                                            Freelancer
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">16</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="j-5" />
                                        <label className="form-check-label" htmlFor="j-5">
                                            Remote Job
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">1,432</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 py-4 px-sm-4 border-bottom">
                                <h6 className="fw-medium mb-0">Salary Range</h6>
                                <div className="py-3 pb-0">
                                    <div id="nonlinear">
                                        <LabeledTwoThumbs1 rtl={local_varaiable.dir == 'rtl'} />
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 py-4 px-sm-4 border-bottom">
                                <h6 className="fw-medium mb-0">Qualification</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="q-1" />
                                        <label className="form-check-label" htmlFor="q-1">
                                            High School
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">16,563</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="q-2" defaultChecked />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-2">
                                            Associate Degree
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">15,234</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="q-3" />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-3">
                                            Bachelor’s Degree
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">6,278</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="q-4" defaultChecked />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-4">
                                            Master’s Degree
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">4,531</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="q-5" />
                                        <label className="form-check-label" htmlFor="q-5">
                                            PhD
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">2,405</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="q-6" />
                                        <label className="form-check-label w-50 text-truncate" htmlFor="q-6">
                                            Diploma/Certification
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">2,142</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 py-4 px-sm-4">
                                <h6 className="fw-medium mb-0">Skills</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="s-1">
                                            JavaScript
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">23,156</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-2" defaultChecked />
                                        <label className="form-check-label" htmlFor="s-2">
                                            Python
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">15,632</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-3" />
                                        <label className="form-check-label" htmlFor="s-3">
                                            React
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">15,032</SpkBadge>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-4" defaultChecked />
                                        <label className="form-check-label" htmlFor="s-4">
                                            Node.js
                                        </label>
                                        <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">7,154</SpkBadge>
                                    </div>
                                    <Collapse in={opens}>
                                        <div className="collapse" id="sizes-more">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-5" />
                                                <label className="form-check-label" htmlFor="s-5">
                                                    SQL
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">5,946</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-6" />
                                                <label className="form-check-label w-50 text-truncate" htmlFor="s-6">
                                                    Product Management
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">3,267</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-7" />
                                                <label className="form-check-label" htmlFor="s-7">
                                                    Agile/Scrum
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">578</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-8" />
                                                <label className="form-check-label" htmlFor="s-8">
                                                    Data Analysis
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">142</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-9" />
                                                <label className="form-check-label w-50 text-truncate" htmlFor="s-9">
                                                    Digital Marketing
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">633</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-10" />
                                                <label className="form-check-label" htmlFor="s-10">
                                                    UX/UI Design
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">452</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-11" />
                                                <label className="form-check-label" htmlFor="s-11">
                                                    Networking
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">32</SpkBadge>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input me-2" type="checkbox" defaultValue="" id="s-12" />
                                                <label className="form-check-label" htmlFor="s-12">
                                                    CRM Software
                                                </label>
                                                <SpkBadge variant="" Customclass="bg-light text-default fw-500 float-end">12</SpkBadge>
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Link className="badge bg-primary-transparent" data-bs-toggle="collapse" to="#sizes-more" role="button" aria-expanded={opens} onClick={() => setOpens(!opens)} aria-controls="sizes-more">More</Link>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9} className="">
                    <Row className="align-items-center">
                        <Col lg={12}>
                            <Card className="custom-card border-0 shadow-none">
                                <Card.Body className="p-md-0">
                                    <div className="input-group companies-search-input flex-nowrap">
                                        <Form.Control type="text" className="form-control-lg w-25" aria-label="Text input with segmented dropdown button" placeholder="Enter your keyword here" />
                                        <SpkSelect name="state" option={SearchSelect} mainClass="basic-multi-select " searchable menuplacement='auto' classNameprefix="Select2" defaultvalue={[SearchSelect[0]]} />
                                        <Form.Control type="text" className="form-control-lg w-25" aria-label="Text input with segmented dropdown button" placeholder="Search by location" />
                                        <SpkSelect name="state" option={CandidateSelect} mainClass="basic-multi-select custom-select-searchcompany" searchable menuplacement='auto' classNameprefix="Select2" defaultvalue={[CandidateSelect[0]]} />
                                        <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="btn btn-lg"><i className="ri-search-line"></i></SpkButton>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        <h5 className="fw-medium mb-0 flex-grow-1">1287 <span className="fw-normal fs-18">Candidates match your search</span> </h5>
                                        <SpkDropdown as={ButtonGroup} Customclass="" Togglevariant="" Toggletext="Sort By" Customtoggleclass="btn btn-outline-light border"
                                            Menualign="end" Menuclass="dropdown-menu-end">
                                            <Dropdown.Item as="li" >Premium</Dropdown.Item>
                                            <Dropdown.Item as="li" >Newest</Dropdown.Item>
                                            <Dropdown.Item as="li" >Most Relevant</Dropdown.Item>
                                            <Dropdown.Item as="li" >Fresher</Dropdown.Item>
                                            <Dropdown.Item as="li" >Experienced</Dropdown.Item>
                                            <Dropdown.Item as="li" >Flexible Shift</Dropdown.Item>
                                            <Dropdown.Item as="li" >Day Shift</Dropdown.Item>
                                        </SpkDropdown>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <SpkTables tableClass="text-nowrap" header={[{ title: 'Details' }, { title: 'Education' }, { title: 'Skills' }, { title: 'Job Type' }, { title: 'Salary Expectation' }, { title: 'Notice Period' }, { title: 'Actions', headerClassname: 'text-center' }]}>
                                            {Peopletable.map((person, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div>
                                                            <div className="d-flex align-items-start gap-3">
                                                                <div className="lh-1">
                                                                    <span className="avatar avatar-lg">
                                                                        <Image src={person.imageUrl} alt={person.name} />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="fw-semibold d-block">{person.name}</span>
                                                                    <span>{person.role}</span>
                                                                    <span className="text-muted fs-13 d-block mb-1">{person.location}</span>
                                                                    <SpkBadge variant="" Customclass="badge-md rounded-pill bg-primary-transparent">
                                                                        <i className="bi bi-briefcase me-1 align-middle"></i>Exp : {person.experience}
                                                                    </SpkBadge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{person.education}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1 skills-container flex-wrap">
                                                            {person.skills.map((skill, skillIndex) => (
                                                                <span key={skillIndex} className={`badge bg-${skill.color}-transparent`}>
                                                                    {skill.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td>{person.employmentType}</td>
                                                    <td>
                                                        <span className="fw-medium">{person.salaryRange}</span>
                                                    </td>
                                                    <td>{person.noticePeriod}</td>
                                                    <td className="text-center">
                                                        <SpkDropdown Customclass="" Togglevariant="" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon btn-sm btn-light border no-caret" Menualign="end" Menuclass="dropdown-menu-end">
                                                            <Dropdown.Item className=""><i className="ti ti-file-text me-2 d-inline-block"></i>Download CV</Dropdown.Item>
                                                            <Dropdown.Item className=""><i className="ti ti-eye me-2 d-inline-block"></i>View</Dropdown.Item>
                                                            <Dropdown.Item className=""><i className="ti ti-checklist me-2 d-inline-block"></i>Shortlist</Dropdown.Item>
                                                        </SpkDropdown>
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
            </Row >

            {/* <!--End::row-1 --> */}

        </Fragment >
    )
};

const mapStateToProps = (state: any) => ({
    local_varaiable: state
});
export default connect(mapStateToProps,)(SearchCandidate);