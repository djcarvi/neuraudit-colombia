
import { Link } from "react-router-dom";
import HorizontalNonLinearStepper from "../../../../shared/data/pages/forms/forwizardata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";

interface FormWizardsProps { }

const FormWizards: React.FC<FormWizardsProps> = () => {

    const [key, setKey] = useState('first');
    const [key1, setKey1] = useState('first1');

    const handleTabSelect = (selectedKey: any) => {
        setKey(selectedKey);
    };
    const handleTabSelect1 = (selectedKey1: any) => {
        setKey1(selectedKey1);
    };
    const handleNext = () => {
        switch (key) {
            case 'first':
                setKey('second');
                break;
            case 'second':
                setKey('third');
                break;
            case 'third':
                setKey('fourth');
                break;
            default:
                break;
        }
    };
    const handleNext1 = () => {
        switch (key1) {
            case 'first1':
                setKey1('second1');
                break;
            case 'second1':
                setKey1('third1');
                break;
            case 'third1':
                setKey1('fourth1');
                break;
            default:
                break;
        }
    };

    const handlePrevious = () => {
        switch (key) {
            case 'second':
                setKey('first');
                break;
            case 'third':
                setKey('second');
                break;
            case 'fourth':
                setKey('third');
                break;
            default:
                break;
        }
    };
    const handlePrevious1 = () => {
        switch (key1) {
            case 'second1':
                setKey1('first1');
                break;
            case 'third1':
                setKey1('second1');
                break;
            case 'fourth1':
                setKey1('third1');
                break;
            default:
                break;
        }
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-FormWizards" />

            <Pageheader title="Forms" currentpage="Form Wizards" activepage="Form Wizards" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                FORM WIZARD
                            </div>
                        </Card.Header>
                        <div className="card-body p-0 form-wizard1">
                            <HorizontalNonLinearStepper />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                FORM WIZARD WITH VALIDATION
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="basicwizard">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" activeKey={key1} onSelect={handleTabSelect1}>
                                    <Nav className="nav nav-tabs nav-justified flex-md-row flex-column mb-4 tab-style-6 p-0">
                                        <Nav.Item data-target-form="#contactDetailForm">
                                            <Nav.Link eventKey="first1" className="icon-btn d-flex align-items-center justify-content-md-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#contactDetail"><span>Contact Detail</span></Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item data-target-form="#jobDetailForm">
                                            <Nav.Link eventKey="second1" className="icon-btn d-flex align-items-center justify-content-md-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#jobDetail"><span>Job Detail</span></Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item data-target-form="#educationDetailForm">
                                            <Nav.Link eventKey="third1" className="icon-btn d-flex align-items-center justify-content-md-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#educationDetail"><span>Education Detail</span></Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="fourth1" className="icon-btn d-flex align-items-center justify-content-md-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#finish"><span>Finish</span></Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="first1" className="show " id="contactDetail">
                                            <form id="contactForm" className="needs-validation" noValidate>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="fullName2">Full Name:</Form.Label>
                                                    <Form.Control type="text" id="fullName2" name="fullName2" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="email2">Email:</Form.Label>
                                                    <Form.Control type="email" id="email2" name="email2" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="phoneNumber2">Phone Number:</Form.Label>
                                                    <Form.Control type="tel" id="phoneNumber2" name="phoneNumber2" className="form-control" pattern="[0-9]{10}" placeholder="Enter 10-digit phone number" />
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second1" className="" id="jobDetail">
                                            <form id="jobForm" className="needs-validation" noValidate>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="jobTitle">Job Title:</Form.Label>
                                                    <Form.Control type="text" id="jobTitle" name="jobTitle" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="company">Company:</Form.Label>
                                                    <Form.Control type="text" id="company" name="company" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="location">Location:</Form.Label>
                                                    <Form.Control type="text" id="location" name="location" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="jobDescription">Job Description:</Form.Label>
                                                    <textarea id="jobDescription" name="jobDescription" className="form-control" rows={4} required></textarea>
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third1" className="" id="educationDetail">
                                            <form id="educationForm" className="needs-validation" noValidate>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="degree">Degree:</Form.Label>
                                                    <Form.Control type="text" id="degree" name="degree" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="institution">Institution:</Form.Label>
                                                    <Form.Control type="text" id="institution" name="institution" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="graduationYear">Graduation Year:</Form.Label>
                                                    <Form.Control type="number" id="graduationYear" name="graduationYear" className="form-control" min="1900" max="2100" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="fieldOfStudy">Field of Study:</Form.Label>
                                                    <Form.Control type="text" id="fieldOfStudy" name="fieldOfStudy" className="form-control" required />
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="fourth1" className="" id="finish">
                                            <div className="row d-flex justify-content-center">
                                                <div className="col-lg-10">
                                                    <div className="text-center p-4">
                                                        <span className="avatar avatar-xl avatar-rounded bg-success-transparent svg-success">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="96" opacity="0.2" /><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                                        </span>
                                                        <h3 className="mt-2">Successful <span className="fs-14 align-middle">&#127881;</span></h3>
                                                        <p>Nulla facilisi. Praesent euismod, ex in viverra ullamcorper, augue justo convallis urna, a sollicitudin quam libero et magna. Sed ac metus.</p>
                                                        <div className="mb-0">
                                                            <div className="form-check d-inline-block">
                                                                <input className="form-check-input" id="customCheck1" required type="checkbox" /> <label className="form-check-label" htmlFor="customCheck1" >I agree with the <Link  className="fw-medium text-decoration-underline" to={`${import.meta.env.BASE_URL}pages/terms-conditions/`}>Terms and Conditions.</Link></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <div className="d-flex wizard justify-content-between mt-3 flex-wrap gap-2">
                                            <div className="first">
                                                <Link to="#!" className="btn btn-light" onClick={() => setKey1('first1')}>
                                                    First
                                                </Link>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                <div className="previous me-2">
                                                    <Link to="#!" className={`btn icon-btn btn-primary ${key1 === 'first1' ? 'disabled' : ''}`} onClick={handlePrevious1}>
                                                        <i className="bx bx-left-arrow-alt me-2"></i>Back To Previous
                                                    </Link>
                                                </div>
                                                <div className="next">
                                                    <Link to="#!" className="btn icon-btn btn-secondary" onClick={handleNext1}>
                                                        Next Step<i className="bx bx-right-arrow-alt ms-2"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="last">
                                                <Link to="#!" className={`btn btn-success ${key1 === 'fourth1' ? 'disabled' : ''}`} onClick={() => setKey1('fourth1')}>
                                                    Finish
                                                </Link>
                                            </div>
                                        </div>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                WIZARD WITH PROGRESS
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="progresswizard">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" activeKey={key} onSelect={handleTabSelect}>
                                    <Nav className="nav nav-tabs nav-justified flex-sm-row flex-column mb-4 tab-style-8 scaleX p-0">
                                        <Nav.Item data-target-form="#progress-contactDetailForm">
                                            <Nav.Link eventKey="first" className="icon-btn d-flex align-items-center justify-content-sm-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#progress-contactDetail"><span>Contact Detail</span></Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item data-target-form="#progress-jobDetailForm">
                                            <Nav.Link eventKey="second" className="icon-btn d-flex align-items-center justify-content-sm-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#progress-jobDetail"><span>Job Detail</span></Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item data-target-form="#progress-educationDetailForm">
                                            <Nav.Link eventKey="third" className="icon-btn d-flex align-items-center justify-content-sm-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#progress-educationDetail"><span>Education Detail</span></Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="fourth" className="icon-btn d-flex align-items-center justify-content-sm-center gap-1" data-bs-toggle="tab" data-toggle="tab" href="#progress-finish"><span>Finish</span></Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content className="">
                                        <Tab.Pane eventKey="first" className=" show" id="progress-contactDetail">
                                            <Form id="contactForm2" className="needs-validation" noValidate>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="fullName" className="form-label">Full Name:</Form.Label>
                                                    <Form.Control type="text" id="fullName" name="fullName" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="email" className="form-label">Email:</Form.Label>
                                                    <Form.Control type="email" id="email" name="email" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="phoneNumber" className="form-label">Phone Number:</Form.Label>
                                                    <Form.Control type="tel" id="phoneNumber" name="phoneNumber" className="form-control" pattern="[0-9]{10}" placeholder="Enter 10-digit phone number" />
                                                </div>
                                            </Form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second" className="" id="progress-jobDetail">
                                            <Form id="jobForm2" className="needs-validation" noValidate>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="jobTitle2" className="form-label">Job Title:</Form.Label>
                                                    <Form.Control type="text" id="jobTitle2" name="jobTitle2" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="company2" className="form-label">Company:</Form.Label>
                                                    <Form.Control type="text" id="company2" name="company2" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="location2" className="form-label">Location:</Form.Label>
                                                    <Form.Control type="text" id="location2" name="location2" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="jobDescription2" className="form-label">Job Description:</Form.Label>
                                                    <Form.Control as="textarea" id="jobDescription2" name="jobDescription2" className="form-control" rows={4} required></Form.Control>
                                                </div>
                                            </Form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third" className="" id="progress-educationDetail">
                                            <form id="educationForm2" className="needs-validation" noValidate>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="degree2" className="form-label">Degree:</Form.Label>
                                                    <Form.Control type="text" id="degree2" name="degree2" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="institution2" className="form-label">Institution:</Form.Label>
                                                    <Form.Control type="text" id="institution2" name="institution2" className="form-control" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="graduationYear2" className="form-label">Graduation Year:</Form.Label>
                                                    <Form.Control type="number" id="graduationYear2" name="graduationYear2" className="form-control" min="1900" max="2100" required />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="fieldOfStudy2" className="form-label">Field of Study:</Form.Label>
                                                    <Form.Control type="text" id="fieldOfStudy2" name="fieldOfStudy2" className="form-control" required />
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="fourth" className="" id="progress-finish">
                                            <div className="row d-flex justify-content-center">
                                                <div className="col-lg-10">
                                                    <div className="text-center p-4">
                                                        <span className="avatar avatar-xl avatar-rounded bg-success-transparent svg-success">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="96" opacity="0.2" /><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                                        </span>
                                                        <h3 className="mt-2">Successful <span className="fs-14 align-middle">&#127881;</span></h3>
                                                        <p>Nulla facilisi. Praesent euismod, ex in viverra ullamcorper, augue justo convallis urna, a sollicitudin quam libero et magna. Sed ac metus.</p>
                                                        <div className="mb-0">
                                                            <div className="form-check d-inline-block">
                                                                <input className="form-check-input" id="customCheck2" required type="checkbox" /> <label className="form-check-label" htmlFor="customCheck2">I agree with the <Link className="fw-medium text-decoration-underline" to={`${import.meta.env.BASE_URL}pages/terms-conditions/`}>Terms and Conditions.</Link></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <div className="d-flex wizard justify-content-between mt-3 flex-wrap gap-2">
                                            <div className="first">
                                                <Link to="#!" className="btn btn-light" onClick={() => setKey('first')}>
                                                    First
                                                </Link>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                <div className="previous me-2">
                                                    <Link to="#!" className={`btn icon-btn btn-primary ${key === 'first' ? 'disabled' : ''}`} onClick={handlePrevious}>
                                                        <i className="bx bx-left-arrow-alt me-2"></i>Back To Previous
                                                    </Link>
                                                </div>
                                                <div className="next">
                                                    <Link to="#!" className="btn icon-btn btn-secondary" onClick={handleNext}>
                                                        Next Step<i className="bx bx-right-arrow-alt ms-2"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="last">
                                                <Link to="#!" className={`btn btn-success ${key === 'fourth' ? 'disabled' : ''}`} onClick={() => setKey('fourth')}>
                                                    Finish
                                                </Link>
                                            </div>
                                        </div>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default FormWizards;