
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import { avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatardata1, avatardata2, avatardata3, avatardata4, avatardata5, avatardata6, avatardata7, avatardata8 } from "../../../../shared/data/prism-code/utilities-prism";
import { Avatardata, Avataricon, Avatarinitial, Avatarnumber, Avataroffline, Avataronline, Avatarsize, Avatarstack } from "../../../../shared/data/general/utilities/avatarsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

interface AvatarsProps { }

const Avatars: React.FC<AvatarsProps> = () => {

    return (

        <Fragment>

            <Seo title={"Avatars"} />

            <Pageheader title="Utilities" currentpage="Avatars" activepage="Avatars" />

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title="Avatars" customCardClass="custom-card" customCardBodyClass="py-4" reactCode={avatar1} dataCode={avatardata1}>
                        {Avatardata.map((idx, index) => (
                            <span className={`avatar me-2 ${idx.class}`} key={index}>
                                <Image  src={idx.src} alt="img" />
                            </span>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title=" Avatar Sizes <p class='subtitle text-muted fs-12 fw-normal'>  Avatars of different sizes </p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar2} dataCode={avatardata2} >
                        {Avatarsize.map((idx, index) => (
                            <span key={index} className={`avatar avatar-${idx.class} me-2`}>
                                <Image  src={idx.src} alt="img" />
                            </span>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title="Avatar With Icons<p class='subtitle text-muted fs-12 fw-normal'>  Avatar contains icons to perform respective action.</p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar3} dataCode={avatardata3}>
                        {Avataricon.map((idx, index) => (
                            <span key={index} className={`avatar avatar-${idx.class} me-2 avatar-rounded`}>
                                <Image  src={idx.src} alt="img" />
                                <Link to="#!"  className={`badge bg-${idx.class1} rounded-pill avatar-badge`}><i className={`fe fe-${idx.icon}`}></i></Link>
                            </span>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title=" Avatar With Online Status Indicators<p class='subtitle text-muted fs-12 fw-normal'>  avatars having online status indicator.</p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar4} dataCode={avatardata4}>
                        {Avataronline.map((idx, index) => (
                            <span key={index} className={`avatar avatar-${idx.class} me-2 avatar-rounded`}>
                                <Image  src={idx.src} alt="img" />
                            </span>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title="  Avatar With Offline Status Indicators<p class='subtitle text-muted fs-12 fw-normal'> avatars having a offline status indicator.</p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar5} dataCode={avatardata5}>
                        {Avataroffline.map((idx, index) => (
                            <span key={index} className={`avatar avatar-${idx.class} me-2 avatar-rounded`}>
                                <Image  src={idx.src} alt="img" />
                            </span>
                        ))}
                    </ShowCode>
                </Col>
                <Col xl={6} lg={6} md={12} sm={12} className="">
                    <ShowCode title=" Avatars With Number Badges<p class='subtitle text-muted fs-12 fw-normal'>   Avatar numbers indicates the no. of unread notififactions/messages. </p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar6} dataCode={avatardata6}>
                        {Avatarnumber.map((idx, index) => (
                            <span key={index} className={`avatar avatar-${idx.class} me-2 avatar-rounded`}>
                                <Image  src={idx.src} alt="img" />
                                <SpkBadge Customclass={`rounded-pill bg-${idx.class1} avatar-badge`}>{idx.data}</SpkBadge>
                            </span>
                        ))}
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-1 --> */}

            {/* <!-- Start::row-3 --> */}

            <Row>
                <Col xl={12} lg={6} md={12} sm={12} className="">
                    <ShowCode title=" Avatar With Initials <p class='subtitle text-muted fs-12 fw-normal'> Avatar contains intials when user profile doesn't exist.</p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar7} dataCode={avatardata7}>
                        {Avatarinitial.map((idx, index) => (
                            <span key={index} className={`avatar avatar-${idx.data} m-2 bg-${idx.color}`}>
                                {idx.data1}
                            </span>
                        ))}

                    </ShowCode>
                </Col>
                <Col xl={12} lg={6} md={12} sm={12} className="">
                    <ShowCode title="Stacked Avatars<p class='subtitle text-muted fs-12 fw-normal'> Group of avatars stacked together.</p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar8} dataCode={avatardata8}>
                        <div className="avatar-list-stacked">
                            {Avatarstack.map((idx, index) => (
                                <span key={index} className="avatar">
                                    <Image  src={idx.src} alt="img" />
                                </span>
                            ))}
                            <Link  className="avatar bg-primary text-fixed-white" to="#!">
                                +8
                            </Link>
                        </div>
                    </ShowCode>
                </Col>
                <Col xl={12} lg={6} md={12} sm={12} className="">
                    <ShowCode title="Rounded Stacked Avatars<p class='subtitle text-muted fs-12 fw-normal'> Group of avatars stacked together.</p>" customCardClass="custom-card" customCardBodyClass="" reactCode={avatar9} dataCode={avatardata8}>
                        <div className="avatar-list-stacked">
                            {Avatarstack.map((idx, index) => (
                                <span key={index} className="avatar avatar-rounded">
                                    <Image  src={idx.src} alt="img" />
                                </span>
                            ))}
                            <Link  className="avatar bg-primary avatar-rounded text-fixed-white" to="#!">
                                +8
                            </Link>
                        </div>
                    </ShowCode>
                </Col>
            </Row>

            {/* <!-- End::row-3 --> */}

        </Fragment>
    )
};

export default Avatars;