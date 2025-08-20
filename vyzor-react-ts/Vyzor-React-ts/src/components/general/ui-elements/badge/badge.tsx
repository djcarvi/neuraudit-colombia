
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import * as uielementsprism from "../../../../shared/data/prism-code/uielements-prism"
import { Badgesdata, Outlinebadgesdata, badges1 } from "../../../../shared/data/general/ui-elements/badgesdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Image, Row } from "react-bootstrap";
import face2 from '../../../../assets/images/faces/2.jpg';
import face10 from '../../../../assets/images/faces/10.jpg';
import face15 from '../../../../assets/images/faces/15.jpg';
interface BadgePrps { }

const Badge: React.FC<BadgePrps> = () => {

    return (
        <Fragment>

            <Seo title="Badge" />

            <Pageheader title="Ui Elements" currentpage="Badge" activepage="Badge" />

            {/* <!-- Start::row-2 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Basicbadge} dataCode={uielementsprism.Basicbadgedata} reusableCode={uielementsprism.Basicreusebadge}>
                        {Badgesdata.map((badge, index) => (
                            <SpkBadge key={index} variant={badge.color} Customclass={`bg-${badge.color} ${badge.class}`}>{badge.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Light Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Lightbadge} dataCode={uielementsprism.Lightbadgedata} reusableCode={uielementsprism.Lightreusebadge}>
                        {Outlinebadgesdata.map((badge, index) => (
                            <SpkBadge key={index} variant={badge.color} Customclass={`bg-${badge.color}-transparent ${badge.class}`}>{badge.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-2 --> */}

            {/* <!-- Start::row-6 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Pill badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Pillbadge} dataCode={uielementsprism.Pillbadgedata} reusableCode={uielementsprism.Pillreusebadge}>
                        {Badgesdata.map((badge, index) => (
                            <SpkBadge key={index} variant={badge.color} Pill={true} Customclass={badge.class}>{badge.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Light Pill Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Lightpill} dataCode={uielementsprism.Lightpilldata} reusableCode={uielementsprism.Lightpillreuse}>
                        {Outlinebadgesdata.map((badge, index) => (
                            <SpkBadge key={index} variant={badge.color} Pill={true} Customclass={`bg-${badge.color}-transparent ${badge.class}`}>{badge.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-6 --> */}

            {/* <!-- Start::row-4 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Gradient Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Gradientbadge} dataCode={uielementsprism.Gradientdata} reusableCode={uielementsprism.Gradientreuse}>
                        {badges1.map((badge1, index) => (
                            <SpkBadge key={index} Customclass={` bg-${badge1.color}-gradient`}>{badge1.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Gradient Pill Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Gradientpill} dataCode={uielementsprism.Gradientdata} reusableCode={uielementsprism.Gradientpillreuse}>
                        {badges1.map((badge1, index) => (
                            <SpkBadge key={index} Customclass={`bg-${badge1.color}-gradient`} Pill={true}>{badge1.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-4 --> */}

            {/* <!-- Start::row-5 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Outline Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Outlinebadge} dataCode={uielementsprism.Outlinebadgedata} reusableCode={uielementsprism.Outlinereusebadge}>
                        {Outlinebadgesdata.map((badge, index) => (
                            <SpkBadge key={index} variant={`outline-${badge.color}`} Customclass={badge.class}>{badge.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Outline Pill Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Badgepill} dataCode={uielementsprism.Outlinebadgedata} reusableCode={uielementsprism.Badgepillreuse}>
                        {Outlinebadgesdata.map((badge, index) => (
                            <SpkBadge key={index} variant={`outline-${badge.color}`} Pill={true} Customclass={badge.class}>{badge.heading}</SpkBadge>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-5 --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <ShowCode title="Buttons With Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Buttonbadge} reusableCode={uielementsprism.Buttonbadgereuse}>
                        <SpkButton Buttonvariant='primary' Buttontype="button" Customclass="my-1 me-2">
                            Notifications <SpkBadge variant="secondary" Customclass=" ms-2 text-fixed-white">4</SpkBadge>
                        </SpkButton>
                        <SpkButton Buttonvariant='secondary' Buttontype="button" Customclass="my-1 me-2">
                            Notifications <SpkBadge variant="primary" Customclass=" ms-2 text-fixed-white">7</SpkBadge>
                        </SpkButton>
                        <SpkButton Buttonvariant='success' Buttontype="button" Customclass="my-1 me-2">
                            Notifications <SpkBadge variant="danger" Customclass=" ms-2 text-fixed-white">12</SpkBadge>
                        </SpkButton>
                        <SpkButton Buttonvariant='info' Buttontype="button" Customclass="my-1 me-2">
                            Notifications <SpkBadge variant="warning" Customclass=" ms-2 text-fixed-white">32</SpkBadge>
                        </SpkButton>
                    </ShowCode>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Outline Button Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-2" reactCode={uielementsprism.Buttonoulinebadge} reusableCode={uielementsprism.Buttonbadgereuse}>
                        <SpkButton Buttonvariant='outline-primary' Buttontype="button" Customclass="btn  my-1 me-2">
                            Notifications <SpkBadge variant="" Customclass="ms-2">4</SpkBadge>
                        </SpkButton>
                        <SpkButton Buttonvariant='outline-secondary' Buttontype="button" Customclass="btn  my-1 me-2">
                            Notifications <SpkBadge variant="" Customclass="ms-2">7</SpkBadge>
                        </SpkButton>
                        <SpkButton Buttonvariant='outline-success' Buttontype="button" Customclass="btn  my-1 me-2">
                            Notifications <SpkBadge variant="" Customclass="ms-2">12</SpkBadge>
                        </SpkButton>
                        <SpkButton Buttonvariant='outline-info' Buttontype="button" Customclass="btn  my-1 me-2">
                            Notifications <SpkBadge variant="" Customclass="ms-2">32</SpkBadge>
                        </SpkButton>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-1 --> */}

            {/* <!-- Start::row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Row>
                        <Col xl={12}>
                            <ShowCode title="Positioned Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap gap-4" reactCode={uielementsprism.Positionbadge} reusableCode={uielementsprism.Positionreusebadge}>
                                <SpkButton Buttonvariant='primary' Buttontype="button" Customclass="position-relative">
                                    Inbox
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-fixed-white">
                                        99+
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </SpkButton>
                                <SpkButton Buttonvariant='secondary' Buttontype="button" Customclass="position-relative">
                                    Profile
                                    <span className="position-absolute top-80 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                </SpkButton>
                                <span className="avatar">
                                    <Image  src={face2} alt="img" />
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                </span>
                                <span className="avatar avatar-rounded">
                                    <Image  src={face15} alt="img" />
                                    <span className="position-absolute top-80 start-100 translate-middle p-1 bg-success border border-light  rounded-pill">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                </span>
                                <span className="avatar avatar-rounded">
                                    <Image  src={face10} alt="img" />
                                    <span className="position-absolute top-0 start-100 translate-middle badge bg-secondary rounded-pill shadow-lg">1000+
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                </span>
                            </ShowCode>
                        </Col>
                        <Col xl={12}>
                            <ShowCode title="Custom Badges" customCardClass="custom-card" customCardBodyClass="d-flex flex-wrap align-items-center" reactCode={uielementsprism.Custombadges} reusableCode={uielementsprism.Custombadgesreuse}>
                                <p className="mb-xxl-0 badge bg-outline-secondary custom-badge fs-15 me-5">
                                    <i className="ti ti-flame me-1 me-1 d-inline-flex"></i>Hot</p>
                                <p className="mb-xxl-0 icon-badge me-5">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                                    <SpkBadge variant="success" Customclass="rounded-pill">14</SpkBadge>
                                </p>
                                <p className="mb-xxl-0 badge border bg-light text-default custom-badge me-5"><i className="fe fe-eye me-1 d-inline-flex"></i>13.2k</p>
                                <p className="mb-xxl-0 text-badge me-5">
                                    <span className="text fs-18">Inbox</span>
                                    <SpkBadge variant="success" Pill={true}>32</SpkBadge>
                                </p>
                            </ShowCode>
                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <ShowCode title="Headings" customCardClass="custom-card" customCardBodyClass="" reactCode={uielementsprism.Headingbadge} reusableCode={uielementsprism.Headingbadgereuse}>
                        <h1>Example heading <SpkBadge variant="primary">New</SpkBadge></h1>
                        <h2>Example heading <SpkBadge variant="primary">New</SpkBadge></h2>
                        <h3>Example heading <SpkBadge variant="primary">New</SpkBadge></h3>
                        <h4>Example heading <SpkBadge variant="primary">New</SpkBadge></h4>
                        <h5>Example heading <SpkBadge variant="primary">New</SpkBadge></h5>
                        <h6>Example heading <SpkBadge variant="primary">New</SpkBadge></h6>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-3 --> */}

        </Fragment>
    )
};

export default Badge;