
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface TermsConditionsProps { }

const TermsConditions: React.FC<TermsConditionsProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Terms & Conditions" />

            <Pageheader title="Pages" currentpage="Terms & Conditions" activepage="Terms & Conditions" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row className="justify-content-center">
                <Col xl={8}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Body className="p-5">
                            <div className="mb-4">
                                <h2 className="fw-semibold mb-1">Terms & Conditions</h2>
                                <span className="d-block fw-medium text-gradient">Last Updated - 21,May 2024</span>
                            </div>
                            <div className="p-3 rounded terms_conditions_welcome mb-4">
                                <h5 className="fw-semibold mb-2 text-fixed-black">Hey There,Welcome to Spruko &#9996;</h5>
                                <span className="text-fixed-black">By accessing and using this application, you agree to comply with these Terms and Conditions,The application reserves the right to update or modify these terms at any time.</span>
                            </div>
                            <ul className="terms-list list-unstyled mb-0">
                                <li><h6 className="fw-semibold">Acceptable Use</h6> Users must not engage in activities that harm the platform, other users, or violate any laws,Spamming, hacking, or distributing malware is strictly prohibited,Any attempt to reverse engineer or modify the application is not allowed.</li>

                                <li><h6 className="fw-semibold">User Accounts & Responsibilities</h6> Users must provide accurate and up-to-date information when creating an account,The security of account credentials is the sole responsibility of the user,Any unauthorized use of the account must be reported immediately.</li>

                                <li><h6 className="fw-semibold">Payments & Subscriptions</h6> All transactions processed through the application are final and non-refundable unless stated otherwise,Users must ensure timely payments to maintain access to premium features,Subscription plans may be modified, renewed, or canceled by users as per the policy.</li>

                                <li><h6 className="fw-semibold">Privacy & Data Protection</h6>Personal data collected through the application will be handled in accordance with our Privacy Policy,The platform takes appropriate measures to secure user information, but users should also follow best security practices.</li>

                                <li><h6 className="fw-semibold">Content Ownership & Intellectual Property</h6> The application and its content are protected by copyright and intellectual property laws,Users may not reproduce, modify, or distribute any content without permission,Any user-generated content must not infringe on the rights of others.</li>

                                <li><h6 className="fw-semibold">Limitation of Liability</h6> The application is provided "as is" without warranties of any kind,The platform is not liable for any loss, damages, or disruptions caused by the use of the application.
                                </li>

                                <li><h6 className="fw-semibold">Termination & Suspension</h6> The platform reserves the right to terminate or suspend user accounts for any violation of these terms,Users may delete their accounts if they no longer wish to use the service.</li>

                                <li><h6 className="fw-semibold">Governing Law</h6> These terms shall be governed by and interpreted in accordance with the applicable laws,Any legal disputes shall be resolved under the jurisdiction of the designated legal authority.
                                </li>

                                <li><h6 className="fw-semibold">Contact Information</h6> If you have any questions regarding these terms, please contact us at support@example.com.</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default TermsConditions;