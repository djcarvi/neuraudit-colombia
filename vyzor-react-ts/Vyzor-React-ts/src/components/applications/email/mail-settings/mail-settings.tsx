
import React, { type ChangeEvent, Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Nav, Row, Tab } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { Accountoptions, Categories, CountrySelect, Devices, LanguageSelect, MailCategories, Maximumoptions, MaxLimitoptions } from "../../../../shared/data/applications/email/mailsettingsdata";
import { Link } from "react-router-dom";
import face9 from '../../../../assets/images/faces/9.jpg';
interface MailSettingsProps { }

const MailSettings: React.FC<MailSettingsProps> = () => {

    const [toggles, setToggles] = useState<{ [key: string]: string }>({});

    const toggle = (toggleKey: string) => {
        setToggles((prevState) => ({
            ...prevState,
            [toggleKey]: prevState[toggleKey] === 'on' ? 'off' : 'on',
        }));
    };

    const [_images, setImages] = useState<File[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setSelectedImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
            setImages((prev) => [...prev, file]);
        }
    };
    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Email-Mail Settings" />

            <Pageheader title="Applications" subtitle="Email" currentpage="Mail Settings" activepage="Mail Settings" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row className="mb-5">
                <Tab.Container defaultActiveKey={"personal-info"}>
                    <Col xl={3}>
                        <Card className="custom-card">
                            <Card.Body className="text-center p-4">
                                <span className="avatar avatar-xxl avatar-rounded mail-settingavatar">
                                    <Image  src={selectedImage || face9} alt="Profile" id="profile-img" />
                                    <SpkBadge variant="primary" Customclass="rounded-pill avatar-badge">
                                        <input type="file" name="photo" accept="image/*" className="position-absolute w-100 h-100 op-0" id="profile-change" onChange={handleFileChange} />
                                        <i className="fe fe-camera"></i>
                                    </SpkBadge>
                                </span>
                                <h6 className="fw-semibold mt-3 mb-1">Jhon Doe</h6>
                                <span className="d-block fs-13 tex-muted">jhondoe3125@gmail.com</span>
                                <div className="btn-list mt-3">
                                    <SpkButton Buttonvariant="primary" Customclass="btn btn-sm btn-w-sm">Edit</SpkButton>
                                    <SpkButton Buttonvariant="danger" Customclass="btn btn-sm btn-w-sm">Delete</SpkButton>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="custom-card">
                            <Card.Body>
                                <Nav className="nav-tabs flex-column nav-tabs-header mb-0 mail-sesttings-tab" role="tablist">
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey={"personal-info"} className=""
                                             aria-selected="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M216,48H40a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V56A8,8,0,0,0,216,48ZM96,144a24,24,0,1,1,24-24A24,24,0,0,1,96,144Z" opacity="0.2" /><line x1="152" y1="112" x2="192" y2="112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="152" y1="144" x2="192" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="96" cy="120" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M64,168c3.55-13.8,17.09-24,32-24s28.46,10.19,32,24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                            Personal Information</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey={"account-settings"} className=""
                                             aria-selected="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M207.86,123.18l16.78-21a99.14,99.14,0,0,0-10.07-24.29l-26.7-3a81,81,0,0,0-6.81-6.81l-3-26.71a99.43,99.43,0,0,0-24.3-10l-21,16.77a81.59,81.59,0,0,0-9.64,0l-21-16.78A99.14,99.14,0,0,0,77.91,41.43l-3,26.7a81,81,0,0,0-6.81,6.81l-26.71,3a99.43,99.43,0,0,0-10,24.3l16.77,21a81.59,81.59,0,0,0,0,9.64l-16.78,21a99.14,99.14,0,0,0,10.07,24.29l26.7,3a81,81,0,0,0,6.81,6.81l3,26.71a99.43,99.43,0,0,0,24.3,10l21-16.77a81.59,81.59,0,0,0,9.64,0l21,16.78a99.14,99.14,0,0,0,24.29-10.07l3-26.7a81,81,0,0,0,6.81-6.81l26.71-3a99.43,99.43,0,0,0,10-24.3l-16.77-21A81.59,81.59,0,0,0,207.86,123.18ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" opacity="0.2" /><circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M41.43,178.09A99.14,99.14,0,0,1,31.36,153.8l16.78-21a81.59,81.59,0,0,1,0-9.64l-16.77-21a99.43,99.43,0,0,1,10.05-24.3l26.71-3a81,81,0,0,1,6.81-6.81l3-26.7A99.14,99.14,0,0,1,102.2,31.36l21,16.78a81.59,81.59,0,0,1,9.64,0l21-16.77a99.43,99.43,0,0,1,24.3,10.05l3,26.71a81,81,0,0,1,6.81,6.81l26.7,3a99.14,99.14,0,0,1,10.07,24.29l-16.78,21a81.59,81.59,0,0,1,0,9.64l16.77,21a99.43,99.43,0,0,1-10,24.3l-26.71,3a81,81,0,0,1-6.81,6.81l-3,26.7a99.14,99.14,0,0,1-24.29,10.07l-21-16.78a81.59,81.59,0,0,1-9.64,0l-21,16.77a99.43,99.43,0,0,1-24.3-10l-3-26.71a81,81,0,0,1-6.81-6.81Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                            Account Settings</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey={"email-settings"} className=""
                                             aria-selected="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polygon points="224 56 128 144 32 56 224 56" opacity="0.2" /><path d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="224 56 128 144 32 56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                            Email</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey={"labels"} className=""
                                             aria-selected="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32a8,8,0,0,1,0,11.31L153,237.66a8,8,0,0,1-11.31,0Z" opacity="0.2" /><path d="M42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32a8,8,0,0,1,0,11.31L153,237.66a8,8,0,0,1-11.31,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="84" cy="84" r="12" /></svg>
                                            Labels</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey={"notification"} className=""
                                             aria-selected="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M56,104a72,72,0,0,1,144,0c0,35.82,8.3,64.6,14.9,76A8,8,0,0,1,208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,139.81,56,104Z" opacity="0.2" /><path d="M96,192a32,32,0,0,0,64,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M56,104a72,72,0,0,1,144,0c0,35.82,8.3,64.6,14.9,76A8,8,0,0,1,208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,139.81,56,104Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                            Notifications</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="m-1">
                                        <Nav.Link eventKey={"security"} className=""
                                             aria-selected="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><rect x="40" y="88" width="176" height="128" rx="8" opacity="0.2" /><rect x="40" y="88" width="176" height="128" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="152" r="12" /><path d="M88,88V56a40,40,0,0,1,80,0V88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                            Security</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={9}>
                        <Card className="custom-card">
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey={"personal-info"} className="p-0 border-0" id="personal-info"
                                        role="tabpanel">
                                        <div>
                                            <h6 className="fw-medium mb-3">
                                                Profile :
                                            </h6>
                                            <div className="row gy-4 mb-4">
                                                <Col xl={6}>
                                                    <label htmlFor="first-name" className="form-label">First Name</label>
                                                    <Form.Control type="text" className="" id="first-name" placeholder="First Name" />
                                                </Col>
                                                <Col xl={6}>
                                                    <label htmlFor="last-name" className="form-label">Last Name</label>
                                                    <Form.Control type="text" className="" id="last-name" placeholder="Last Name" />
                                                </Col>
                                                <Col xl={12}>
                                                    <label className="form-label">User Name</label>
                                                    <div className="input-group mb-3">
                                                        <span className="input-group-text" id="basic-addon3">user2413@gmail.com</span>
                                                        <Form.Control type="text" className="" id="basic-url" aria-describedby="basic-addon3" />
                                                    </div>
                                                </Col>
                                            </div>
                                            <h6 className="fw-medium mb-3">
                                                Personal information :
                                            </h6>
                                            <div className="row gy-4">
                                                <Col xl={6}>
                                                    <label htmlFor="email-address" className="form-label">Email Address :</label>
                                                    <Form.Control type="text" className="" id="email-address" placeholder="xyz@gmail.com" />
                                                </Col>
                                                <Col xl={6}>
                                                    <label htmlFor="phone-no" className="form-label">Phone No :</label>
                                                    <Form.Control type="text" className="" id="phone-no" placeholder="Enter Phone No" />
                                                </Col>
                                                <Col xl={6}>
                                                    <label htmlFor="language" className="form-label">Language :</label>
                                                    <SpkSelect name="state" multi option={LanguageSelect} mainClass="basic-multi-select " menuplacement='auto' classNameprefix="Select2" defaultvalue={[LanguageSelect[0]]} />
                                                </Col>
                                                <Col xl={6}>
                                                    <label className="form-label">Country :</label>
                                                    <SpkSelect name="state" option={CountrySelect} mainClass="basic-multi-select " menuplacement='auto' classNameprefix="Select2" defaultvalue={[CountrySelect[0]]} />
                                                </Col>
                                                <Col xl={12}>
                                                    <label htmlFor="bio" className="form-label">Bio :</label>
                                                    <Form.Control as="textarea" className="" id="bio" rows={5} defaultValue={"Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"} />
                                                </Col>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"account-settings"} className="border-0 p-0"
                                        role="tabpanel" >
                                        <div className="row gy-3" id="account-settings">
                                            <div className="col-xxl-7">
                                                <div className="card custom-card shadow-none mb-0 border">
                                                    <div className="card-body">
                                                        <div className="d-sm-flex d-block align-items-top mb-4 justify-content-between">
                                                            <div className="w-75">
                                                                <p className="fs-14 mb-1 fw-medium">Two Step Verification</p>
                                                                <p className="fs-13 text-muted mb-0">Two step verificatoin is very secured and restricts in happening faulty practices.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 toggle-primary ${toggles['notification3'] === 'off' || !toggles['notification3'] ? 'on' : ''}`} onClick={() => toggle('notification3')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top mb-4 justify-content-between">
                                                            <div className="mb-sm-0 mb-2 w-75">
                                                                <p className="fs-14 mb-2 fw-medium">Authentication</p>
                                                                <div className="mb-0 authentication-btn-group">
                                                                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" defaultChecked />
                                                                        <label className="btn btn-outline-light" htmlFor="btnradio1"><i className="ri-lock-unlock-line me-2 d-inline-block"></i>Pin</label>
                                                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" />
                                                                        <label className="btn btn-outline-light" htmlFor="btnradio2"><i className="ri-lock-password-line me-2 d-inline-block"></i>Password</label>
                                                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" />
                                                                        <label className="btn btn-outline-light" htmlFor="btnradio3"><i className="ri-fingerprint-line me-2 d-inline-block"></i>Finger Print</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-primary ${toggles['notification2'] === 'off' || !toggles['notification2'] ? 'on' : ''}`} onClick={() => toggle('notification2')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top mb-4 justify-content-between">
                                                            <div className="w-75">
                                                                <p className="fs-14 mb-1 fw-medium">Recovery Mail</p>
                                                                <p className="fs-13 text-muted mb-0">Incase of forgetting password mails are sent to  heifo@gmail.com</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-primary ${toggles['notification'] === 'off' || !toggles['notification'] ? 'on' : ''}`} onClick={() => toggle('notification')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top mb-4 justify-content-between">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">SMS Recovery</p>
                                                                <p className="fs-13 text-muted mb-0">SMS are sent to 9102312xx in case of recovery</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-primary ${toggles['notification4'] === 'off' || !toggles['notification4'] ? 'on' : ''}`} onClick={() => toggle('notification4')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">Reset Password</p>
                                                                <p className="fs-13 text-muted">Password should be min of <b className="text-success">8 digits<sup>*</sup></b>,atleast <b className="text-success">One Capital letter<sup>*</sup></b> and <b className="text-success">One Special Character<sup>*</sup></b> included.</p>
                                                                <div className="mb-2">
                                                                    <label htmlFor="current-password" className="form-label">Current Password</label>
                                                                    <Form.Control type="text" className="   " id="current-password" placeholder="Current Password" />
                                                                </div>
                                                                <div className="mb-2">
                                                                    <label htmlFor="new-password" className="form-label">New Password</label>
                                                                    <Form.Control type="text" className="   " id="new-password" placeholder="New Password" />
                                                                </div>
                                                                <div className="mb-0">
                                                                    <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                                                                    <Form.Control type="text" className="   " id="confirm-password" placeholder="Confirm Password" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Col xxl={5}>
                                                <Card className="custom-card shadow-none mb-0 border">
                                                    <Card.Header className="justify-content-between d-sm-flex d-block">
                                                        <div className="card-title">Registered Devices</div>
                                                        <div className="mt-sm-0 mt-2">
                                                            <SpkButton Buttonvariant="primary" Customclass="btn btn-sm">Signout from all devices</SpkButton>
                                                        </div>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <ul className="list-group">
                                                            {Devices.map((device, index) => (
                                                                <li className="list-group-item" key={index}>
                                                                    <div className="d-sm-flex d-block align-items-top">
                                                                        <div className="lh-1 mb-sm-0 mb-2">
                                                                            <i className={`bi ${device.icon} me-3 fs-16 align-middle text-muted`}></i>
                                                                        </div>
                                                                        <div className="lh-1 flex-fill">
                                                                            <p className="mb-1">
                                                                                <span className="fw-medium">{device.name}</span>
                                                                            </p>
                                                                            <p className="mb-0">
                                                                                <span className="text-muted fs-13">{device.locationDate}</span>
                                                                            </p>
                                                                        </div>
                                                                        <SpkDropdown Togglevariant="" Customtoggleclass="btn-icon btn-sm btn-light no-caret" Icon={true} IconClass="fe fe-more-vertical" Customclass="mt-sm-0 mt-2">
                                                                            <li><Dropdown.Item >Action</Dropdown.Item></li>
                                                                            <li><Dropdown.Item >Another action</Dropdown.Item></li>
                                                                            <li><Dropdown.Item >Something else here</Dropdown.Item></li>
                                                                        </SpkDropdown>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"email-settings"} className="p-0" id="email-settings"
                                        role="tabpanel">
                                        <ListGroup className="list-group list-group-flush rounded">
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3} lg={3} md={3} sm={12} className="">
                                                        <span className="fs-14 fw-medium mb-0">Menu View :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                                Default View
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                Advanced View
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end toggle-danger ${toggles['email'] === 'off' || !toggles['email'] ? 'on' : ''}`} onClick={() => toggle('email')} >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-3 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Language :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <label htmlFor="mail-language" className="form-label">Languages :</label>
                                                        <SpkSelect name="state" multi option={LanguageSelect} mainClass="basic-multi-select " menuplacement='auto' classNameprefix="Select2" defaultvalue={[LanguageSelect[0], LanguageSelect[2]]} />
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['language'] === 'on' ? 'on' : ''}`} onClick={() => toggle('language')} >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Images :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="images-open" id="images-open1" />
                                                            <label className="form-check-label" htmlFor="images-open1">
                                                                Always Open Images
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="images-open" id="images-hide2" defaultChecked />
                                                            <label className="form-check-label" htmlFor="images-hide2">
                                                                Ask For Permission
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['email1'] === 'on' ? 'on' : ''}`} onClick={() => toggle('email1')} >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Keyboard Shortcuts :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="keyboard-enable" id="keyboard-enable1" />
                                                            <label className="form-check-label" htmlFor="keyboard-enable1">
                                                                Keyboard Shortcuts Enable
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="keyboard-enable" id="keyboard-disable2" defaultChecked />
                                                            <label className="form-check-label" htmlFor="keyboard-disable2">
                                                                Keyboard Shortcuts Disable
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['key'] === 'on' ? 'on' : ''}`} onClick={() => toggle('key')}  >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Notifications :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue="" id="desktop-notifications" defaultChecked />
                                                            <label className="form-check-label" htmlFor="desktop-notifications">
                                                                Desktop Notifications
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue="" id="mobile-notifications" />
                                                            <label className="form-check-label" htmlFor="mobile-notifications">
                                                                Mobile Notifications
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className="float-sm-end">
                                                            <Link to="#!" className="btn btn-success-ghost btn-sm">Learn-more</Link>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-3 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Maximum Mails Per Page :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <SpkSelect name="colors" option={Maximumoptions} mainClass="basic-multi-select"
                                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Maximumoptions[0]]}
                                                        />
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['max'] === 'on' ? 'on' : ''}`} onClick={() => toggle('max')} >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Mail Composer :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="mail-composer" id="mail-composeron1" />
                                                            <label className="form-check-label" htmlFor="mail-composeron1">
                                                                Mail Composer On
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="mail-composer" id="mail-composeroff2" defaultChecked />
                                                            <label className="form-check-label" htmlFor="mail-composeroff2">
                                                                Mail Composer Off
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['compose'] === 'on' ? 'on' : ''}`} onClick={() => toggle('compose')} >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Auto Correct :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="auto-correct" id="auto-correcton1" />
                                                            <label className="form-check-label" htmlFor="auto-correcton1">
                                                                Auto Correct On
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="auto-correct" id="auto-correctoff2" defaultChecked />
                                                            <label className="form-check-label" htmlFor="auto-correctoff2">
                                                                Auto Correct Off
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['auto'] === 'on' ? 'on' : ''}`} onClick={() => toggle('auto')} >
                                                            <span></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gy-2 d-sm-flex align-items-center justify-content-between">
                                                    <Col xl={3}>
                                                        <span className="fs-14 fw-medium mb-0">Mail Send Action :</span>
                                                    </Col>
                                                    <Col xl={4}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue="" id="on-keyboard" defaultChecked />
                                                            <label className="form-check-label" htmlFor="on-keyboard">
                                                                On Keyboard Action
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue="" id="on-buttonclick" />
                                                            <label className="form-check-label" htmlFor="on-buttonclick">
                                                                On Button Click
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xl={5}>
                                                        <div className="float-sm-end">
                                                            <Link to="#!" className="btn btn-success-ghost btn-sm">Learn-more</Link>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"labels"} className="" id="labels"
                                        role="tabpanel">
                                        <p className="fs-14 fw-medium mb-3">Mail Labels :</p>
                                        <Row className="gy-2">
                                            {MailCategories.map((category) => (
                                                <Col xxl={3} xl={6} lg={4} md={4} sm={6} className="col-12" key={category.id}>
                                                    <Card className="custom-card shadow-none">
                                                        <Card.Body className="card-body d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                            <label className="form-check-label" htmlFor={category.id}>{category.label}</label>
                                                            <div className="form-check form-check-md form-switch mb-0">
                                                                <input className="form-check-input" type="checkbox" role="switch" id={category.id} defaultChecked={category.defaultChecked} />
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                        <p className="fs-14 fw-medium mb-3">Settings :</p>
                                        <Row className="gy-2">
                                            <Col xxl={3} xl={6} lg={4} md={4} sm={6} className="col-12">
                                                <Card className="custom-card shadow-none">
                                                    <Card.Body className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                        <label className="form-check-label" htmlFor="label-settings">Settings</label>
                                                        <div className="form-check form-check-md form-switch mb-0">
                                                            <input className="form-check-input" type="checkbox" role="switch" id="label-settings" defaultChecked />
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <p className="fs-14 fw-medium mb-3">Custom Labels :</p>
                                        <Row className="gy-2">
                                            {Categories.map((category) => (
                                                <Col xxl={3} xl={6} lg={4} md={4} sm={6} className="col-12" key={category.id}>
                                                    <Card className="custom-card shadow-none">
                                                        <Card.Body className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                            <label className="form-check-label" htmlFor={category.id}>
                                                                {category.label}
                                                            </label>
                                                            <div className="form-check form-check-md form-switch mb-0">
                                                                <input className="form-check-input" type="checkbox" role="switch" id={category.id} defaultChecked={category.defaultChecked} />
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"notification"} className="p-0" id="notification-settings"
                                        role="tabpanel">
                                        <ListGroup className="list-group-flush list-unstyled rounded">
                                            <ListGroup.Item className="px-sm-3 px-2">
                                                <Row className="gy-3">
                                                    <Col xl={5}>
                                                        <p className="fs-16 mb-1 fw-medium">Email Notifications</p>
                                                        <p className="fs-13 mb-0 text-muted">Email notifications are the notifications you will receeive when you are offline, you can customize them by enabling or disabling them.</p>
                                                    </Col>
                                                    <Col xl={7}>
                                                        <div className="d-flex align-items-top justify-content-between mt-sm-0 mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Updates & Features</p>
                                                                <p className="fs-13 mb-0 text-muted">Notifications about new updates and their features.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['noti'] === 'off' || !toggles['noti'] ? 'on' : ''}`} onClick={() => toggle('noti')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Early Access</p>
                                                                <p className="fs-13 mb-0 text-muted">Users are selected for beta testing of new update,notifications relating or participate in any of paid product promotion.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['early'] === 'on' ? 'on' : ''}`} onClick={() => toggle('early')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Email Shortcuts</p>
                                                                <p className="fs-13 mb-0 text-muted">Shortcut notifications for email.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['notification4'] === 'off' || !toggles['notification4'] ? 'on' : ''}`} onClick={() => toggle('notification4')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">New Mails</p>
                                                                <p className="fs-13 mb-0 text-muted">Notifications related to new mails received.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['received'] === 'off' || !toggles['received'] ? 'on' : ''}`} onClick={() => toggle('received')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Mail Chat Messages</p>
                                                                <p className="fs-13 mb-0 text-muted">Any of new messages are received will be updated through notifications.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['message'] === 'off' || !toggles['message'] ? 'on' : ''}`} onClick={() => toggle('message')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="px-sm-3 px-2">
                                                <div className="row gy-3">
                                                    <div className="col-xl-5">
                                                        <p className="fs-16 mb-1 fw-medium">Push Notifications</p>
                                                        <p className="fs-13 mb-0 text-muted">Push notifications are recieved when you are online, you can customize them by enabling or disabling them.</p>
                                                    </div>
                                                    <div className="col-xl-7">
                                                        <div className="d-flex align-items-top justify-content-between mt-sm-0 mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">New Mails</p>
                                                                <p className="fs-13 mb-0 text-muted">Notifications related to new mails received.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['new'] === 'off' || !toggles['new'] ? 'on' : ''}`} onClick={() => toggle('new')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Mail Chat Messages</p>
                                                                <p className="fs-13 mb-0 text-muted">Any of new messages are received will be updated through notifications.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['mailon'] === 'off' || !toggles['mailon'] ? 'on' : ''}`} onClick={() => toggle('mailon')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-top justify-content-between mt-3">
                                                            <div className="mail-notification-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Mail Extensions</p>
                                                                <p className="fs-13 mb-0 text-muted">Notifications related to the extensions received by new emails and thier propertied also been displayed.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['extensions'] === 'on' ? 'on' : ''}`} onClick={() => toggle('extensions')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={"security"} className="p-0" id="security"
                                        role="tabpanel">
                                        <ListGroup className="list-group-flush list-unstyled rounded">
                                            <ListGroup.Item>
                                                <Row className="gx-5 gy-3">
                                                    <Col xl={4}>
                                                        <p className="fs-16 mb-1 fw-medium">Logging In</p>
                                                        <p className="fs-13 mb-0 text-muted">Security settings related to logging into our email account and taking down account if any mischevious action happended.</p>
                                                    </Col>
                                                    <Col xl={8}>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-sm-0 mt-3 gap-2">
                                                            <div className="mail-security-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Max Limit for login attempts</p>
                                                                <p className="fs-13 mb-0 text-muted mb-sm-0 mb-2">Account will freeze for 24hrs while attempt to login with wrong credentials for selected number of times</p>
                                                            </div>
                                                            <div className="project-list-main">
                                                                <SpkSelect name="colors" option={MaxLimitoptions} mainClass="basic-multi-select security-select"
                                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[MaxLimitoptions[0]]}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-3">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">Account Freeze time management</p>
                                                                <p className="fs-13 mb-0 text-muted mb-sm-0 mb-2">You can change the time for the account freeze when attempts for </p>
                                                            </div>
                                                            <div className="custom-mail-security">
                                                                <SpkSelect name="colors" option={Accountoptions} mainClass="basic-multi-select security-select-date"
                                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Accountoptions[0]]}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gx-5 gy-3">
                                                    <Col xl={4}>
                                                        <p className="fs-16 mb-1 fw-medium">Password Requirements</p>
                                                        <p className="fs-13 mb-0 text-muted">Security settings related to password strength.</p>
                                                    </Col>
                                                    <Col xl={8}>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-sm-0 mt-3 gap-2">
                                                            <div className="mail-security-settings">
                                                                <p className="fs-14 mb-1 fw-medium">Minimum number of characters in the password</p>
                                                                <p className="fs-13 mb-0 text-muted">There should be a minimum number of characters for a password to be validated that shouls be set here.</p>
                                                            </div>
                                                            <div>
                                                                <Form.Control type="text" className="" defaultValue="8" />
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-3">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">Contain A Number</p>
                                                                <p className="fs-13 mb-0 text-muted">Password should contain a number.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['number'] === 'off' || !toggles['number'] ? 'on' : ''}`} onClick={() => toggle('number')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-3">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">Contain A Special Character</p>
                                                                <p className="fs-13 mb-0 text-muted">Password should contain a special Character.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 ms-0 mt-sm-0 mt-2 toggle-success ${toggles['pass'] === 'off' || !toggles['pass'] ? 'on' : ''}`} onClick={() => toggle('pass')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-3">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">Atleast One Capital Letter</p>
                                                                <p className="fs-13 mb-0 text-muted">Password should contain atleast one capital letter.</p>
                                                            </div>
                                                            <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['capital'] === 'on' ? 'on' : ''}`} onClick={() => toggle('capital')} >
                                                                <span></span>
                                                            </div>
                                                        </div>
                                                        <div className="d-sm-flex d-block align-items-top justify-content-between mt-3">
                                                            <div>
                                                                <p className="fs-14 mb-1 fw-medium">Maximum Password Length</p>
                                                                <p className="fs-13 mb-0 text-muted">Maximum password lenth should be selected here.</p>
                                                            </div>
                                                            <div>
                                                                <Form.Control type="text" className="" defaultValue="16" />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row className="gx-5 gy-3">
                                                    <Col xl={4}>
                                                        <p className="fs-16 mb-1 fw-medium">Unknown Chats</p>
                                                        <p className="fs-13 mb-0 text-muted">Security settings related to unknown chats.</p>
                                                    </Col>
                                                    <Col xl={8}>
                                                        <div className="btn-group float-sm-end" role="group" aria-label="Basic radio toggle button group">
                                                            <input type="radio" className="btn-check" name="btnunknownchats" id="unknown-chats-show" defaultChecked />
                                                            <label className="btn btn-outline-light" htmlFor="unknown-chats-show">Show</label>
                                                            <input type="radio" className="btn-check" name="btnunknownchats" id="unknown-chats-hide" />
                                                            <label className="btn btn-outline-light" htmlFor="unknown-chats-hide">Hide</label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                            <Card.Footer>
                                <div className="float-end">
                                    <SpkButton Buttonvariant="light" Customclass="btn m-1">
                                        Restore Defaults
                                    </SpkButton>
                                    <SpkButton Buttonvariant="primary" Customclass="btn m-1">
                                        Save Changes
                                    </SpkButton>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Tab.Container>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default MailSettings;