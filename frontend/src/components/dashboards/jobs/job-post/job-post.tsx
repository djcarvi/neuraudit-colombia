
import React, { Fragment } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { CategoriesSelect, CountrySelect, Employeesname, Genderselect, JobSelect, Languagesselect, PrioritySelect, Qualificationselect, Salaryselect, Skillselect, Vacancieselect, WorkSelect } from "../../../../shared/data/dashboards/jobs/jobpostdata";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import { Link } from "react-router-dom";

interface PostJobProps { }

const PostJob: React.FC<PostJobProps> = () => {

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
  
    const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([today, nextWeek]);
    const [startDate, endDate] = dateRange;

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Job Post" />

            <Pageheader title="Dashboards" subtitle="Jobs" currentpage="Job Post" activepage="Job Post" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={3} xl={4} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Assign To Employer</div>
                        </Card.Header>
                        <Card.Body>
                            <Col xl={12}>
                            <Form.Label className="form-label">Employer Name</Form.Label>
                                <SpkSelect option={Employeesname} mainClass="" defaultvalue={[Employeesname[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                            </Col>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Company Details</div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col xl={12}>
                                    <Form.Label htmlFor="Company-Name" className="">Company Name</Form.Label>
                                    <Form.Control type="text" className="" id="Company-Name" placeholder="Company Name" defaultValue="Obligation Pvt.Ltd" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="Company-Website" className="">Company Website</Form.Label>
                                    <Form.Control type="text" className="" id="Company-Website" placeholder="Company Website" defaultValue="http//www.obligationpvtltd.com" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="">Country</Form.Label>
                                    <SpkSelect option={CountrySelect} mainClass="" defaultvalue={[CountrySelect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="Company-Address" className="">Address</Form.Label>
                                    <Form.Control type="text" className="" id="Company-Address" placeholder="Company Address" defaultValue="USA" />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9} xl={8} className="">
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Post New Job
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-4 mb-4">
                                <Col xl={6}>
                                    <Form.Label htmlFor="job-title" className="">Job Title</Form.Label>
                                    <Form.Control type="text" className="" id="job-title" placeholder="Job Title" defaultValue="Web Developer" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Job Category</Form.Label>
                                    <SpkSelect option={CategoriesSelect} mainClass="" defaultvalue={[CategoriesSelect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Working Experience</Form.Label>
                                    <SpkSelect option={WorkSelect} mainClass="" defaultvalue={[WorkSelect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Job Type</Form.Label>
                                    <SpkSelect option={JobSelect} mainClass="" defaultvalue={[JobSelect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Priority</Form.Label>
                                    <SpkSelect option={PrioritySelect} mainClass="" defaultvalue={[PrioritySelect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Vacancies</Form.Label>
                                    <SpkSelect option={Vacancieselect} mainClass="" defaultvalue={[Vacancieselect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Salary</Form.Label>
                                    <SpkSelect option={Salaryselect} mainClass="" defaultvalue={[Salaryselect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="skills" className="">Skills :</Form.Label>
                                    <SpkSelect option={Skillselect} multi mainClass="" defaultvalue={[Skillselect[1], Skillselect[0], Skillselect[2]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6} className="job-deadline-column">
                                    <Form.Label htmlFor="job-deadline" className="">Job Deadline</Form.Label>
                                    <SpkDatepickr className="form-control breadcrumb-input datepicker-input" placeholderText="Choose date" startDate={startDate} endDate={endDate} selectsRange={true} onChange={(update: any) => setDateRange(update)} />

                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Gender Requirement</Form.Label>
                                    <SpkSelect option={Genderselect} mainClass="" defaultvalue={[Genderselect[0]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="language" className="">Languages :</Form.Label>
                                    <SpkSelect option={Languagesselect} multi mainClass="" defaultvalue={[Languagesselect[0], Languagesselect[3]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="qualification" className="">Qualification :</Form.Label>
                                    <SpkSelect option={Qualificationselect} multi mainClass="" defaultvalue={[Qualificationselect[0], Qualificationselect[3], Qualificationselect[2]]} menuplacement='auto' classNameprefix="Select2" name="Category-select" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="job-description" className="">Job Description :</Form.Label>
                                    <Form.Control as="textarea" className="form-control" id="job-description" rows={4} defaultValue={"Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"} />
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-end">
                            <Link to="#!" className="btn btn-primary btn-wave waves-effect waves-light">
                                <i className="bi bi-plus-circle"></i> Post Job
                            </Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default PostJob;