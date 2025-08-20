
import { Link } from "react-router-dom";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkFriendscard from "../../../shared/@spk-reusable-components/reusable-pages/spk-friendscard";
import SpkProfileCard from "../../../shared/@spk-reusable-components/reusable-pages/spk-profilecard";
import { FriendsList, ProfileGallery, Profiles } from "../../../shared/data/pages/profiledata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Nav, Row, Tab } from "react-bootstrap";
import { FilePond } from "react-filepond";
import face2 from '../../../assets/images/faces/2.jpg';
import face3 from '../../../assets/images/faces/3.jpg';
import face4 from '../../../assets/images/faces/4.jpg';
import face5 from '../../../assets/images/faces/5.jpg';
import face6 from '../../../assets/images/faces/6.jpg';
import face8 from '../../../assets/images/faces/8.jpg';
import face10 from '../../../assets/images/faces/10.jpg';
import face12 from '../../../assets/images/faces/12.jpg';
import face13 from '../../../assets/images/faces/13.jpg';
import face14 from '../../../assets/images/faces/14.jpg';
import face15 from '../../../assets/images/faces/15.jpg';

import media3 from '../../../assets/images/media/media-3.jpg';
import media10 from '../../../assets/images/media/media-10.jpg';
import media23 from '../../../assets/images/media/media-23.jpg';
interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {

    const [files, setFiles] = useState<any>([]);

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Profile" />

            <Pageheader title="Pages" currentpage="Profile" activepage="Profile" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row className="justify-content-center">
                <Col xl={10}>
                    <Row>
                        <Tab.Container defaultActiveKey={"profile"} >
                            <Col xl={12}>
                                <Card className="custom-card profile-card">
                                    <div className="profile-banner-image profile-img">
                                        <Image  src={media3} className="card-img-top" alt="..." />
                                    </div>
                                    <Card.Body className="p-4 pb-0 position-relative">
                                        <div className="d-flex align-items-end justify-content-between flex-wrap">
                                            <div>
                                                <span className="avatar avatar-xxl avatar-rounded bg-info online">
                                                    <Image  src={face12} alt="" />
                                                </span>
                                                <div className="mt-4 mb-3 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                                                    <div>
                                                        <h5 className="fw-semibold mb-1">Tom Phillip</h5>
                                                        <span className="d-block fw-medium text-muted mb-1">Senior Product Manager</span>
                                                        <p className="fs-12 mb-0 fw-medium text-muted"> <span className="me-3 d-inline-block"><i className="ri-building-line me-1 align-middle d-inline-block"></i>New York, USA</span> <span><i className="ri-phone-line me-1 align-middle d-inline-block"></i>+1 (123) 456-7890</span> </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Nav className="nav-tabs mb-0 tab-style-8 scaleX" id="myTab" role="tablist">
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"profile"} className="" id="profile-about-tab" data-bs-toggle="tab"
                                                            data-bs-target="#profile-about-tab-pane" type="button" role="tab"
                                                            aria-controls="profile-about-tab-pane" aria-selected="true">About</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"gallery"} className="" id="gallery-tab" data-bs-toggle="tab"
                                                            data-bs-target="#gallery-tab-pane" type="button" role="tab"
                                                            aria-controls="gallery-tab-pane" aria-selected="false">Gallery</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"followers"} className="" id="followers-tab" data-bs-toggle="tab"
                                                            data-bs-target="#followers-tab-pane" type="button" role="tab"
                                                            aria-controls="followers-tab-pane" aria-selected="false">Followers</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item className="" role="presentation">
                                                        <Nav.Link eventKey={"friends"} className="" id="friends-tab" data-bs-toggle="tab"
                                                            data-bs-target="#friends-tab-pane" type="button" role="tab"
                                                            aria-controls="friends-tab-pane" aria-selected="false">Friends</Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={12}>
                                <Tab.Content id="profile-tabs">
                                    <Tab.Pane eventKey={"profile"} className="p-0 border-0" id="profile-about-tab-pane" role="tabpanel" aria-labelledby="profile-about-tab" tabIndex={0}>
                                        <Row>
                                            <Col xxl={4}>
                                                <Row>
                                                    <Col xl={12}>
                                                        <Card className="custom-card">
                                                            <Card.Body>
                                                                <div className="d-flex align-items-center justify-content-center gap-4">
                                                                    <div className="text-center">
                                                                        <h3 className="fw-semibold mb-1">
                                                                            13,264
                                                                        </h3>
                                                                        <span className="d-block text-muted">Followers</span>
                                                                    </div>
                                                                    <div className="vr"></div>
                                                                    <div className="text-center">
                                                                        <h3 className="fw-semibold mb-1">
                                                                            7,238
                                                                        </h3>
                                                                        <span className="d-block text-muted">Following</span>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Card className="custom-card">
                                                            <Card.Header>
                                                                <div className="card-title">
                                                                    About
                                                                </div>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <p className="text-muted">Experienced pereson passionate about delivering user-centered solutions, leading cross-functional teams, and driving product success.</p>
                                                                <div className="text-muted">
                                                                    <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-mail-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Email : </span> your.email@example.com
                                                                    </div>
                                                                    <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-phone-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Phone : </span> +1 (555) 123-4567
                                                                    </div>
                                                                    <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-map-pin-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Website : </span> www.yourwebsite.com
                                                                    </div>
                                                                    <div className="mb-0 d-flex align-items-center gap-1">
                                                                        <span className="avatar avatar-sm avatar-rounded text-default">
                                                                            <i className="ri-building-line align-middle fs-15"></i>
                                                                        </span>
                                                                        <span className="fw-medium text-default">Location : </span> City, Country
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <Card className="custom-card overflow-hidden">
                                                            <Card.Header>
                                                                <div className="card-title">
                                                                    Social Media
                                                                </div>
                                                            </Card.Header>
                                                            <Card.Body className="p-0">
                                                                <ul className="list-group list-group-flush social-media-list">
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-primary-transparent"><i className="ri-facebook-circle-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Facebook</span>
                                                                                <Link to="#!" className="text-muted">https://www.facebook.com/johndoe</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-secondary-transparent"><i className="ri-twitter-x-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Twitter</span>
                                                                                <Link to="#!" className="text-muted">https://twitter.com/johndoe</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-success-transparent"><i className="ri-linkedin-box-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Linkedin</span>
                                                                                <Link to="#!" className="text-muted">https://www.linkedin.com/in/johndoe</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="list-group-item">
                                                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                            <div>
                                                                                <span className="avatar avatar-md bg-orange-transparent"><i className="ri-instagram-fill fs-4"></i></span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="d-block fw-medium">Instagram</span>
                                                                                <Link to="#!" className="text-muted">https://www.instagram.com/johndoe</Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xxl={8}>
                                                <Card className="custom-card">
                                                    <Tab.Container defaultActiveKey={"status"}>
                                                        <Card.Header className="p-0">
                                                            <Nav className="nav-tabs tab-style-8 scaleX justify-content-end" id="myTab4" role="tablist">
                                                                <Nav.Item role="presentation">
                                                                    <Nav.Link eventKey={"status"} className="" id="status-tab" data-bs-toggle="tab" data-bs-target="#status-tab-pane" type="button" role="tab" aria-controls="status-tab-pane" aria-selected="true"><i className="ri-radio-button-line lh-1 me-1"></i>Status</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item role="presentation">
                                                                    <Nav.Link eventKey={"media"} className="" id="media-tab" data-bs-toggle="tab" data-bs-target="#media-tab-pane" type="button" role="tab" aria-controls="media-tab-pane" aria-selected="false" tabIndex={2}><i className="ri-video-line lh-1 me-1"></i>Image/Video</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item role="presentation">
                                                                    <Nav.Link eventKey={"stream"} className="" id="live-stream-tab" data-bs-toggle="tab" data-bs-target="#live-stream-tab-pane" type="button" role="tab" aria-controls="live-stream-tab-pane" aria-selected="false" tabIndex={1}><i className="ri-tv-line lh-1 me-1"></i>Live Stream</Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                        </Card.Header>
                                                        <Card.Body className="">
                                                            <Tab.Content id="myTabContent3">
                                                                <Tab.Pane eventKey={"status"} className="overflow-hidden p-0 border-0" id="status-tab-pane" role="tabpanel" aria-labelledby="status-tab" tabIndex={0}>
                                                                    <Form.Control as="textarea" className="form-control" id="text-area" rows={4} placeholder="What's on your mind?" />
                                                                    <div className="mt-2">
                                                                        <SpkButton Buttonvariant="primary" Customclass="btn float-end">Post <i className="ri-send-plane-2-line ms-1"></i></SpkButton>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey={"media"} className="overflow-hidden border-0 p-0" id="media-tab-pane" role="tabpanel" aria-labelledby="media-tab" tabIndex={0}>
                                                                    <Form.Control as="textarea" className="form-control" id="text-area" rows={2} placeholder="What's on your mind?" />
                                                                    <FilePond className="multiple-filepond mt-2" files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click ' />
                                                                    <div className="mt-2">
                                                                        <SpkButton Buttonvariant="success" Customclass="btn float-end">Upload <i className="ri-upload-2-line ms-1"></i></SpkButton>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey={"stream"} className="overflow-hidden border-0 p-0" id="live-stream-tab-pane" role="tabpanel" aria-labelledby="live-stream-tab" tabIndex={0}>
                                                                    <Form.Control as="textarea" className="form-control" id="text-area" rows={4} placeholder="What's on your mind?" />
                                                                    <div className="mt-2">
                                                                        <SpkButton Buttonvariant="warning" Customclass="btn float-end">Start Streaming <i className="ri-tv-2-line ms-1"></i></SpkButton>
                                                                    </div>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Card.Body>
                                                    </Tab.Container>
                                                </Card>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-rounded avatar-md">
                                                                    <Image  src={face12} alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <span className="d-block fw-semibold">Tom Phillip</span>
                                                                <span className="text-muted fs-13">14 hrs ago</span>
                                                            </div>
                                                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                                                                <Dropdown.Item as="li" href="#!"><i className="ri-edit-line me-2"></i>Edit</Dropdown.Item>
                                                                <Dropdown.Item as="li" href="#!"><i className="ri-delete-bin-line me-2"></i>Delete</Dropdown.Item>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className="my-3">Captured the serene beauty of the blue sky as the sun sets.</div>
                                                        <div className="profile-img">
                                                            <Image  src={media23} className="card-img" alt="..." />
                                                        </div>
                                                    </Card.Body>
                                                    <div className="card-footer">
                                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="avatar-list-stacked">
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face2} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face8} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face2} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face10} alt="img" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                and 8 others <i className="ri-heart-3-fill text-danger"></i> this post
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <Link to="#!" className="p-1 px-2 bg-primary-transparent rounded"><i className="ri-message-3-line me-1"></i>Comment</Link>
                                                                <Link to="#!" className="p-1 px-2 bg-info-transparent rounded"><i className="ri-share-forward-line me-1"></i>Share</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer">
                                                        <ul className="list-unstyled post-comments-list">
                                                            <li>
                                                                <div className="d-flex align-items-start gap-3">
                                                                    <div className="lh-1">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face4} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill p-3 rounded bg-light">
                                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                            <div className="fw-semibold">Emily_Smith</div>
                                                                            <div className="text-muted fs-13">2 hours ago</div>
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Wow, what a peaceful view! Nature at its best &#x1F60D;.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="d-flex align-items-start gap-3">
                                                                    <div className="lh-1">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face14} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill p-3 rounded bg-light">
                                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                            <div className="fw-semibold">JohnDoe</div>
                                                                            <div className="text-muted fs-13">1 hours ago</div>
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Absolutely stunning! The colors are just perfect &#x1F305;&#x1F499;.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="d-flex align-items-center lh-1 gap-3 flex-wrap">
                                                                    <div className="">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face12} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill">
                                                                        <div className="input-group">
                                                                            <Form.Control type="text" className="" placeholder="Write a comment" aria-label="comment" />
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-primary" Buttontype="button">Post</SpkButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </Card>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-rounded avatar-md">
                                                                    <Image  src={face12} alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <span className="d-block fw-semibold">Tom Phillip</span>
                                                                <span className="text-muted fs-13">2 days ago</span>
                                                            </div>
                                                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                                                                <Dropdown.Item as="li" href="#!">Edit</Dropdown.Item>
                                                                <Dropdown.Item as="li" href="#!">Delete</Dropdown.Item>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className="my-3">Success is not final, failure is not fatal: It is the courage to continue that counts. Keep pushing forward! <Link to="#!">&#128170; #MotivationMonday</Link></div>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="avatar-list-stacked">
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face12} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face3} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face15} alt="img" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                and 2 others <i className="ri-heart-3-fill text-danger"></i> this post
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <Link to="#!" className="p-1 px-2 bg-primary-transparent rounded"><i className="ri-message-3-line me-1"></i>Comment</Link>
                                                                <Link to="#!" className="p-1 px-2 bg-info-transparent rounded"><i className="ri-share-forward-line me-1"></i>Share</Link>
                                                            </div>
                                                        </div>
                                                    </Card.Footer>
                                                    <Card.Footer>
                                                        <ul className="list-unstyled post-comments-list">
                                                            <li>
                                                                <div className="d-flex align-items-center lh-1 gap-3 flex-wrap">
                                                                    <div className="">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face12} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill">
                                                                        <div className="input-group">
                                                                            <Form.Control type="text" className="" placeholder="Write a comment" aria-label="comment" />
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-primary" Buttontype="button">Post</SpkButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </Card.Footer>
                                                </Card>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                            <div className="lh-1">
                                                                <span className="avatar avatar-rounded avatar-md">
                                                                    <Image  src={face12} alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                <span className="d-block fw-semibold">Tom Phillip</span>
                                                                <span className="text-muted fs-13">14 hrs ago</span>
                                                            </div>
                                                            <SpkDropdown Id="dropdownMenuButton1" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                                                                <Dropdown.Item as="li" href="#!">Edit</Dropdown.Item>
                                                                <Dropdown.Item as="li" href="#!">Delete</Dropdown.Item>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className="my-3">The serene beauty of the evening beach with the soft waves and the sky painted in shades of orange and pink is a perfect way to unwind after a long day. &#x1F305; &#127754; <Link to="#!">#BeachVibes</Link> <Link to="#!">#EveningSunset</Link> <Link to="#!">#Relaxing</Link></div>
                                                        <div className="profile-img">
                                                            <Image  src={media10} className="card-img" alt="..." />
                                                        </div>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="avatar-list-stacked">
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face13} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face3} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face4} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face14} alt="img" />
                                                                </span>
                                                                <span className="avatar avatar-rounded">
                                                                    <Image  src={face5} alt="img" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-fill">
                                                                and 25 others <i className="ri-heart-3-fill text-danger"></i> this post
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <Link to="#!" className="p-1 px-2 bg-primary-transparent rounded"><i className="ri-message-3-line me-1"></i>Comment</Link>
                                                                <Link to="#!" className="p-1 px-2 bg-info-transparent rounded"><i className="ri-share-forward-line me-1"></i>Share</Link>
                                                            </div>
                                                        </div>
                                                    </Card.Footer>
                                                    <Card.Footer>
                                                        <ul className="list-unstyled post-comments-list">
                                                            <li>
                                                                <div className="d-flex align-items-start gap-3">
                                                                    <div className="lh-1">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face6} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill p-3 rounded bg-light">
                                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                            <div className="fw-semibold">Emma Watson</div>
                                                                            <div className="text-muted fs-13">2 hours ago</div>
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Such a peaceful moment at the beach! Perfect way to end the day.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="d-flex align-items-center lh-1 gap-3 flex-wrap">
                                                                    <div className="">
                                                                        <span className="avatar avatar-md avatar-rounded">
                                                                            <Image  src={face12} alt="" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-fill">
                                                                        <div className="input-group">
                                                                            <Form.Control type="text" className="" placeholder="Write a comment" aria-label="comment" />
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-emoji-smile"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-paperclip"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-light border px-2 px-md-3" Buttontype="button"><i className="bi bi-camera"></i></SpkButton>
                                                                            <SpkButton Buttonvariant="" Customclass="btn btn-primary" Buttontype="button">Post</SpkButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={'gallery'} className="tab-pane p-0 border-0" id="gallery-tab-pane" role="tabpanel"
                                        aria-labelledby="gallery-tab" tabIndex={0}>
                                        <Row>
                                            <Col xl={12}>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <ProfileGallery />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"followers"} className="tab-pane p-0 border-0" id="followers-tab-pane" role="tabpanel"
                                        aria-labelledby="followers-tab" tabIndex={0}>
                                        <Row>
                                            {Profiles.map((idx, index) => (
                                                <Col xl={4} key={index}>
                                                    <SpkProfileCard profile={idx} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"friends"} className="tab-pane p-0 border-0" id="friends-tab-pane" role="tabpanel"
                                        aria-labelledby="friends-tab" tabIndex={0}>
                                        <Row>
                                            {FriendsList.map((idx, index) => (
                                                <Col xxl={3} xl={4} lg={6} key={index}>
                                                    <SpkFriendscard obj={idx} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Tab.Container>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

        </Fragment>

    )
};

export default Profile;