
import { Link } from 'react-router-dom'
import SpkButton from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons'
import SpkSelect from '../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect'
import { Languagedata, timeZoneOptions } from '../../../shared/data/pages/profilesettingdata'
import Pageheader from '../../../shared/layouts-components/pageheader/pageheader'
import Seo from '../../../shared/layouts-components/seo/seo'
import React, { Fragment, useState } from 'react'
import { Card, Col, Form, Image, Row } from 'react-bootstrap'
import face9 from '../../../assets/images/faces/9.jpg';
interface ProfileSettingsProps { }

const ProfileSettings: React.FC<ProfileSettingsProps> = () => {

  const [toggles, setToggles] = useState<{ [key: string]: string }>({});

  const toggle = (toggleKey: string) => {
    setToggles((prevState) => ({
      ...prevState,
      [toggleKey]: prevState[toggleKey] === 'on' ? 'off' : 'on',
    }));
  };

  return (

    <Fragment>

      {/* <!-- Page Header --> */}

      <Seo title="Profile Settings" />

      <Pageheader title="Pages" currentpage="Profile Settings" activepage="Profile Settings" />

      {/* <!-- Page Header Close --> */}

      {/* <!-- Start::row-1 --> */}

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Account
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="gy-3">
                <Col xl={12}>
                  <div className="d-flex align-items-start flex-wrap gap-3">
                    <div>
                      <span className="avatar avatar-xxl">
                        <Image src={face9} alt="" />
                      </span>
                    </div>
                    <div>
                      <span className="fw-medium d-block mb-2">Profile Picture</span>
                      <div className="btn-list mb-1">
                        <SpkButton Buttonvariant='primary' Customclass="btn btn-sm btn-wave"><i className="ri-upload-2-line me-1"></i>Change Image</SpkButton>
                        <SpkButton Buttonvariant='light' Customclass="btn btn-sm btn-wave"><i className="ri-delete-bin-line me-1"></i>Remove</SpkButton>
                      </div>
                      <span className="d-block fs-12 text-muted">Use JPEG, PNG, or GIF. Best size: 200x200 pixels. Keep it under 5MB</span>
                    </div>
                  </div>
                </Col>
                <Col xl={6}>
                  <Form.Label htmlFor="profile-user-name" className="">User Name :</Form.Label>
                  <Form.Control type="text" className="" id="profile-user-name" defaultValue="" placeholder="Enter Name" />
                </Col>
                <Col xl={6}>
                  <Form.Label htmlFor="profile-email" className="">Email :</Form.Label>
                  <Form.Control type="email" className="" id="profile-email" defaultValue="" placeholder="Enter Email" />
                </Col>
                <Col xl={6}>
                  <Form.Label htmlFor="profile-phn-no" className="">Phone No :</Form.Label>
                  <Form.Control type="text" className="" id="profile-phn-no" defaultValue="" placeholder="Enter Number" />
                </Col>
                <Col xl={3}>
                  <Form.Label htmlFor="profile-age" className="">Age :</Form.Label>
                  <Form.Control type="number" className="" id="profile-age" defaultValue="" placeholder="Enter Age" />
                </Col>
                <Col xl={3}>
                  <Form.Label htmlFor="profile-designation" className="">Designation :</Form.Label>
                  <Form.Control type="text" className="" id="profile-designation" defaultValue="" placeholder="Enter Designation" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="profile-address" className="">Address :</Form.Label>
                  <Form.Control as="textarea" className="" id="profile-address" rows={3} />
                </Col>
                <Col xl={6}>
                  <Form.Label htmlFor="profile-language" className="">Language :</Form.Label>
                  <SpkSelect searchable name="colors" option={Languagedata} menuplacement='auto' classNameprefix="Select2" defaultvalue={[Languagedata[3]]} />
                </Col>
                <Col xl={6}>
                  <Form.Label htmlFor="profile-timezone" className="">Timezone :</Form.Label>
                  <SpkSelect searchable name="colors" option={timeZoneOptions} menuplacement='auto' classNameprefix="Select2" defaultvalue={[timeZoneOptions[3]]} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Change Password
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="gy-3">
                <Col xl={6}>
                  <Form.Label htmlFor="Password" className="">New Password</Form.Label>
                  <Form.Control type="text" className="" id="Password" defaultValue="" placeholder="Enter Password" />
                </Col>
                <Col xl={6}>
                  <Form.Label htmlFor="confirm-password" className="">Confirm Password</Form.Label>
                  <Form.Control type="text" className="" id="confirm-password" defaultValue="" placeholder="Confirm Password" />
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <SpkButton Buttonvariant='primary' Customclass="btn float-end">Save Changes</SpkButton>
            </Card.Footer>
          </Card>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Security Settings
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-sm-flex d-block align-items-top justify-content-between">
                <div className="w-50">
                  <p className="fs-14 mb-1 fw-medium">Login Verification</p>
                  <p className="fs-12 mb-0 text-muted">This helps protect accounts from unauthorized access, even if a password is compromised.</p>
                </div>
                <Link to="#!" className="link-primary text-decoration-underline">Set Up Verification</Link>
              </div>
              <div className="d-sm-flex d-block align-items-top justify-content-between mt-3">
                <div className="w-50">
                  <p className="fs-14 mb-1 fw-medium">Password Verification</p>
                  <p className="fs-12 mb-0 text-muted">This additional step helps ensure that the person attempting to modify account details is the legitimate account owner.</p>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="personal-details" />
                  <label className="form-check-label" htmlFor="personal-details">
                    Require Personal Details
                  </label>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="btn-list float-end">
                <SpkButton Buttonvariant='danger' Customclass="btn btn-wave">Deactivate Account</SpkButton>
                <SpkButton Buttonvariant='light' Customclass="btn btn-wave">Restore Defaults</SpkButton>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="">
              <div className="card-title">
                Notifications
              </div>
            </Card.Header>
            <Card.Body className="">
              <div className="row gx-5 gy-3">
                <Col xl={12}>
                  <p className="fs-14 mb-1 fw-medium">Configure Notifications</p>
                  <p className="fs-12 mb-0 text-muted">By configuring notifications, users can tailor their experience to receive alerts for the types of events that matter to them.</p>
                </Col>
                <Col xl={12}>
                  <div className="d-flex align-items-top justify-content-between mt-sm-0 mt-3">
                    <div className="mail-notification-settings">
                      <p className="fs-14 mb-1 fw-medium">In-App Notifications</p>
                      <p className="fs-12 mb-0 text-muted">Alerts that appear within the application interface.</p>
                    </div>
                    <div className={`toggle mb-0 float-sm-end toggle-success ${toggles['app'] === 'off' || !toggles['app'] ? 'on' : ''}`} onClick={() => toggle('app')} >
                      <span></span>
                    </div>

                  </div>
                  <div className="d-flex align-items-top justify-content-between mt-3">
                    <div className="mail-notification-settings">
                      <p className="fs-14 mb-1 fw-medium">Email Notifications</p>
                      <p className="fs-12 mb-0 text-muted">Messages sent to the user's email address.</p>
                    </div>
                    <div className={`toggle mb-0 float-sm-end toggle-success ${toggles['email'] === 'off' || !toggles['email'] ? 'on' : ''}`} onClick={() => toggle('email')} >
                      <span></span>
                    </div>
                    
                  </div>
                  <div className="d-flex align-items-top justify-content-between mt-3">
                    <div className="mail-notification-settings">
                      <p className="fs-14 mb-1 fw-medium">Push Notifications</p>
                      <p className="fs-12 mb-0 text-muted">Alerts sent to the user's mobile device or desktop.</p>
                    </div>
                    <div className={`toggle mb-0 float-sm-end  toggle-success ${toggles['receive'] === "on" ? 'on' : ''}`} onClick={() => toggle('receive')} >
                      <span></span>
                    </div>
                  </div>
                  <div className="d-flex align-items-top justify-content-between mt-3">
                    <div className="mail-notification-settings">
                      <p className="fs-14 mb-1 fw-medium">SMS Notifications</p>
                      <p className="fs-12 mb-0 text-muted">Text messages sent to the user's mobile phone.</p>
                    </div>
                    <div className={`toggle mb-0 float-sm-end toggle-success ${toggles['sms'] === 'off' || !toggles['sms'] ? 'on' : ''}`} onClick={() => toggle('sms')} >
                      <span></span>
                    </div>
                  
                  </div>
                </Col>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <!--End::row-1 --> */}

    </Fragment>
  )
}

export default ProfileSettings;
