
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { validation1, validation2, validation3, validation4, validation5 } from "../../../../shared/data/prism-code/forms-prism";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface ValidationProps { }

const Validation: React.FC<ValidationProps> = () => {

    const { Formik } = formik;

    const schema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        username: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zip: yup.string().required(),
        file: yup.mixed().required(),
        terms: yup.bool().required().oneOf([true], "terms must be accepted"),
    });

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Validation" />

            <Pageheader title="Forms" currentpage="Validation" activepage="Validation" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Custom Validation" customCardClass="custom-card" customCardBodyClass="" reactCode={validation1}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} className="needs-validation">
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" id="validationCustom01">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" id="validationCustom02">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" id="validationCustomUsername">
                                    <Form.Label>Username</Form.Label>
                                    <InputGroup hasValidation className="custom-inputgrouptext">
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                        <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a username.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3 ">
                                <Form.Group as={Col} md="6" id="validationCustom03">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" placeholder="City" required />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid city.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="3" id="validationCustom04">
                                    <Form.Label>State</Form.Label>
                                    <Form.Select className="" id="validationCustom04" required defaultValue="Choose...">
                                        <option disabled>Choose...</option>
                                        <option>...</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a valid state.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="3" id="validationCustom05">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control type="text" placeholder="Zip" required />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid zip.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" required />
                                <label className="form-check-label" htmlFor="invalidCheck"> Agree to terms and conditions </label>
                                <div className="invalid-feedback"> You must agree before submitting. </div>
                            </div>
                            <SpkButton Buttontype="submit" Customclass="mt-3 btn-primary">Submit form</SpkButton>
                        </Form>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Browser default Validation" customCardClass="custom-card" customCardBodyClass="" reactCode={validation2}>
                        <Form className="row g-3">
                            <Col md={4}>
                                <Form.Label htmlFor="validationDefault01">First name</Form.Label>
                                <Form.Control type="text" id="validationDefault01"
                                    defaultValue="Mark" required />
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="validationDefault02">Last name</Form.Label>
                                <Form.Control type="text" id="validationDefault02"
                                    defaultValue="Otto" required />
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="validationDefaultUsername">Username</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="" id="inputGroupPrepend2">@</InputGroup.Text>
                                    <Form.Control type="text" id="validationDefaultUsername"
                                        aria-describedby="inputGroupPrepend2" required />
                                </InputGroup>
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="validationDefault03">City</Form.Label>
                                <Form.Control type="text" id="validationDefault03" required />
                            </Col>
                            <Col md={3}>
                                <Form.Label htmlFor="validationDefault04">State</Form.Label>
                                <Form.Select className="" id="validationDefault04" required defaultValue="Choose...">
                                    <option disabled >Choose...</option>
                                    <option>...</option>
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Label htmlFor="validationDefault05">Zip</Form.Label>
                                <Form.Control type="text" id="validationDefault05" required />
                            </Col>
                            <div className="col-12">
                                <Form.Check type="checkbox" label="Agree to terms and conditions" required />
                            </div>
                            <div className="col-12">
                                <SpkButton Buttonvariant='primary' Buttontype="submit">Submit form</SpkButton>
                            </div>
                        </Form>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Row>
                        <Col xl={12}>
                            <ShowCode title="Server side Validation" customCardClass="custom-card" customCardBodyClass="" reactCode={validation3}>
                                <Form className="row g-3">
                                    <Col md={4}>
                                        <Form.Label htmlFor="validationServer01">First
                                            name</Form.Label>
                                        <Form.Control type="text" className="form-control is-valid"
                                            id="validationServer01" defaultValue="Mark" required />
                                        <Form.Control.Feedback>
                                            Looks good!
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="validationServer02">Last
                                            name</Form.Label>
                                        <Form.Control type="text" className="form-control is-valid"
                                            id="validationServer02" defaultValue="Otto" required />
                                        <Form.Control.Feedback>
                                            Looks good!
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="validationServerUsername"
                                        >Username</Form.Label>
                                        <InputGroup className="has-validation">
                                            <InputGroup.Text className="input-group-text " id="inputGroupPrepend3">@</InputGroup.Text>
                                            <Form.Control type="text" className="form-control is-invalid"
                                                id="validationServerUsername"
                                                aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
                                                required />
                                        </InputGroup>
                                        <Form.Control.Feedback id="validationServerUsernameFeedback" className="invalid-feedback d-block">
                                            Please choose a username.
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label htmlFor="validationServer03">City</Form.Label>
                                        <Form.Control type="text" className="form-control is-invalid"
                                            id="validationServer03"
                                            aria-describedby="validationServer03Feedback" required />
                                        <Form.Control.Feedback id="validationServer03Feedback" className="invalid-feedback">
                                            Please provide a valid city.
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label htmlFor="validationServer04">State</Form.Label>
                                        <Form.Select className="form-select is-invalid" id="validationServer04" defaultValue="Choose..."
                                            aria-describedby="validationServer04Feedback" required>
                                            <option disabled >Choose...</option>
                                            <option>...</option>
                                        </Form.Select>
                                        <Form.Control.Feedback id="validationServer04Feedback" className="invalid-feedback">
                                            Please select a valid state.
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label htmlFor="validationServer05">Zip</Form.Label>
                                        <Form.Control type="text" className="form-control is-invalid"
                                            id="validationServer05"
                                            aria-describedby="validationServer05Feedback" required />
                                        <Form.Control.Feedback id="validationServer05Feedback" className="invalid-feedback">
                                            Please provide a valid zip.
                                        </Form.Control.Feedback>
                                    </Col>
                                    <div className="col-12">
                                        <Form.Check required isInvalid label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
                                    </div>
                                    <div className="col-12">
                                        <SpkButton Buttonvariant="primary" Buttontype="submit">Submit
                                            form</SpkButton>
                                    </div>
                                </Form>
                            </ShowCode>
                        </Col>
                        <Col xl={12}>
                            <ShowCode title="Tooltips" customCardClass="custom-card" customCardBodyClass="" reactCode={validation4}>
                                <Formik validationSchema={schema} onSubmit={console.log} initialValues={{ firstName: "Mark", lastName: "Otto", username: "", city: "", state: "", zip: "", file: null, terms: false, }}>
                                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                                        <Form noValidate onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} md="4" id="validationFormik101" className="position-relative">
                                                    <Form.Label>First name</Form.Label>
                                                    <Form.Control type="text" name="firstName" value={values.firstName} onChange={handleChange} isValid={touched.firstName && !errors.firstName} />
                                                    <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" id="validationFormik102" className="position-relative">
                                                    <Form.Label>Last name</Form.Label>
                                                    <Form.Control type="text" name="lastName" value={values.lastName} onChange={handleChange} isValid={touched.lastName && !errors.lastName} />
                                                    <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" id="validationFormikUsername2">
                                                    <Form.Label>Username</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text id="inputGroupPrepend" className="border-end-0">@</InputGroup.Text>
                                                        <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" name="username" value={values.username} onChange={handleChange} isInvalid={!!errors.username} />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.username}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3 ">
                                                <Form.Group as={Col} md="6" id="validationFormik103" className="position-relative">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control type="text" placeholder="City" name="city" value={values.city} onChange={handleChange} isInvalid={!!errors.city} />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.city}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="3" id="validationFormik104" className="position-relative">
                                                    <Form.Label htmlFor="validationTooltip04">State</Form.Label>
                                                    <Form.Select className="form-select" id="validationTooltip04" name="state" value={values.state} onChange={handleChange} isInvalid={!!errors.state} required>
                                                        <option disabled defaultValue="">Choose...</option>
                                                        <option>...</option>
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.state}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} md="3" id="validationFormik105" className="position-relative">
                                                    <Form.Label>Zip</Form.Label>
                                                    <Form.Control type="text" placeholder="Zip" name="zip" value={values.zip} onChange={handleChange} isInvalid={!!errors.zip} />

                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.zip}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <SpkButton Buttontype="submit" Customclass="btn-primary">Submit form</SpkButton>
                                        </Form>
                                    )}
                                </Formik>
                            </ShowCode>
                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Supported elements" customCardClass="custom-card" customCardBodyClass="" reactCode={validation5}>
                        <Form className="was-validated">
                            <div className="mb-3">
                                <Form.Label htmlFor="validationTextarea">Textarea</Form.Label>
                                <Form.Control as="textarea" isInvalid className="" id="validationTextarea"
                                    placeholder="Required example textarea" required></Form.Control>
                                <div className="invalid-feedback"> Please enter a message in the textarea. </div>
                                <Form.Control.Feedback>
                                    Please enter a message in the textarea.
                                </Form.Control.Feedback>
                            </div>
                            <Form.Check type="checkbox" className="form-check mb-3" id="validationFormCheck1"
                                required isInvalid label="Check this checkbox" feedback="Example invalid feedback text" feedbackType='invalid' />
                            <Form.Check type="radio" className="" id="validationFormCheck2" name="radio-stacked"
                                required isInvalid label="Toggle this radio" />
                            <Form.Check type="radio" className="form-check mb-3" id="validationFormCheck3" name="radio-stacked"
                                required isInvalid label="Or toggle this other radio" feedback="More example invalid feedback text" feedbackType='invalid' />
                            <Form.Group className="mb-3" >
                                <Form.Select className="form-select" required aria-label="select example" isInvalid>
                                    <option value="">Open this select menu</option>
                                    <option defaultValue="1">One</option>
                                    <option defaultValue="2">Two</option>
                                    <option defaultValue="3">Three</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Example invalid select feedback</Form.Control.Feedback>
                            </Form.Group>

                            <div className="mb-3">
                                <Form.Control type="file" aria-label="file example" isInvalid
                                    required />
                                <Form.Control.Feedback type="invalid">Example invalid form file feedback</Form.Control.Feedback>
                            </div>

                            <div className="mb-3">
                                <SpkButton Buttonvariant='primary' Buttontype="submit" Disabled={true}>Submit
                                    form</SpkButton>
                            </div>
                        </Form>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default Validation;