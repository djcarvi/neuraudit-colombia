
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import { ColoredButtons, DefaultButtons, GhostButtons, GradientButtons, LightButtons, OutlineButtons, SocialIconButtons } from "../../../../shared/data/general/ui-elements/buttonsdata";
import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { dataButton1, dataButton17, dataButton21, dataButton22, dataButton3, dataButton5, dataButton7, dataButton8, dataButton9, reactButton1, reactButton10, reactButton11, reactButton12, reactButton13, reactButton14, reactButton15, reactButton16, reactButton17, reactButton18, reactButton19, reactButton2, reactButton20, reactButton21, reactButton22, reactButton23, reactButton24, reactButton25, reactButton3, reactButton5, reactButton6, reactButton7, reactButton8, reactButton9, reactbutton1, reuseButton1, reuseButton10, reuseButton11, reuseButton12, reuseButton13, reuseButton14, reuseButton15, reuseButton16, reuseButton17, reuseButton18, reuseButton19, reuseButton2, reuseButton20, reuseButton21, reuseButton22, reuseButton23, reuseButton24, reuseButton25, reuseButton3, reuseButton5, reuseButton6, reuseButton7, reuseButton8, reuseButton9, reusebutton1, } from "../../../../shared/data/prism-code/uielements-prism";

interface ButtonsProps { }

const Buttons: React.FC<ButtonsProps> = () => {

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title="Uielements" />

			<Pageheader title="Ui Elements" currentpage="Buttons" activepage="Buttons" />

			{/* <!-- Page Header Close --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Default Buttons" customCardBodyClass="" dataCode={dataButton1} reactCode={reactButton1} reusableCode={reuseButton1}>
						<div className="btn-list">
							{DefaultButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="waves-effect waves-light me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Rounded Buttons" customCardBodyClass="" dataCode={dataButton1} reactCode={reactButton2} reusableCode={reuseButton2}>
						<div className="btn-list">
							{DefaultButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="rounded-pill me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Light Buttons" customCardBodyClass="" reactCode={reactbutton1} reusableCode={reusebutton1}>
						<div className="btn-list">
							<SpkButton Buttontype="button" Buttonvariant="primary-light" Customclass="me-2">Primary</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="secondary-light" Customclass="me-2">Secondary</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="success-light" Customclass="me-2">Success</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="danger-light" Customclass="me-2">Danger</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="warning-light" Customclass="me-2">Warning</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="info-light" Customclass="me-2">Info</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="purple-light" Customclass="me-2">Purple</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="teal-light" Customclass="me-2">Teal</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="orange-light" Customclass="me-2">Orange</SpkButton>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Light Rounded Buttons" customCardBodyClass="" dataCode={dataButton3} reactCode={reactButton3} reusableCode={reuseButton3}>
						<div className="btn-list">
							{LightButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="rounded-pill me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Outline Buttons" customCardBodyClass="" dataCode={dataButton5} reactCode={reactButton5} reusableCode={reuseButton5}>
						<div className="btn-list">
							{OutlineButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Rounded Outline Buttons" customCardBodyClass="" dataCode={dataButton5} reactCode={reactButton6} reusableCode={reuseButton6}>
						<div className="btn-list">
							{OutlineButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass=" rounded-pill me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Gradient Buttons" customCardBodyClass="" dataCode={dataButton7} reactCode={reactButton7} reusableCode={reuseButton7}>
						<div className="btn-list">
							{GradientButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Rounded Gradient Buttons" customCardBodyClass="" dataCode={dataButton8} reactCode={reactButton8} reusableCode={reuseButton8}>
						<div className="btn-list">
							{GradientButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="rounded-pill me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Ghost Buttons" customCardBodyClass="" dataCode={dataButton9} reactCode={reactButton9} reusableCode={reuseButton9}>
						<div className="btn-list">
							{GhostButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="rounded-pill me-2" key={index}>{idx.text}</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Button tags" customCardBodyClass="" reactCode={reactButton10} reusableCode={reuseButton10}>
						<div className="btn-list">
							<SpkButton Buttontype="button" Buttonvariant="primary" Navigate={"#!"} >Link</SpkButton>
							<SpkButton Buttontype="submit" Buttonvariant="secondary" >Button</SpkButton>
							<SpkButton as="input" Buttontype="button" Buttonvariant="info" Value="Input" />
							<SpkButton as="input" Buttontype="submit" Buttonvariant="warning" />
							<SpkButton as="input" Buttontype="reset" Buttonvariant="success" />
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="disabled state with anchor tags" customCardBodyClass="" reactCode={reactButton11} reusableCode={reuseButton11}>
						<div className="btn-list">
							<div className="mb-4">
								<SpkButton Buttontype="button" Buttonvariant="primary" Disabled={true}> Primary Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary" Disabled={true}> Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="outline-primary" Disabled={true}>Primary Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="outline-secondary" Disabled={true}>Button</SpkButton>
							</div>

							<div>
								<SpkButton Buttontype="button" Buttonvariant="primary" Disabled={true}>Primary Link</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary" Disabled={true}>Link</SpkButton>
							</div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="button plugin toggle states" customCardBodyClass="" reactCode={reactButton12} reusableCode={reuseButton12}>
						<div className="btn-list">
							<div className="mb-4">
								<SpkButton Buttontype="button" Buttonvariant="primary">Toggle button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary">Active toggle button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="teal" Disabled={true}>Disabled toggle button</SpkButton>
							</div>
							<div>
								<SpkButton Buttontype="button" Buttonvariant="primary" Navigate={"#!"}>Toggle link</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary" Navigate={"#!"}>Active toggle link</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="teal" Disabled={true} Navigate={"#!"}>Disabled toggle link</SpkButton>
							</div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title=" Link functionally caveat" customCardBodyClass="" reactCode={reactButton13} reusableCode={reuseButton13}>
						<div className="btn-list">
							<SpkButton Buttontype="button" Buttonvariant="primary" Disabled={true}>Primary link</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="secondary" Disabled={true}>Link</SpkButton>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Loading Buttons" customCardBodyClass="" reactCode={reactButton14} reusableCode={reuseButton14}>
						<div className="btn-list d-md-flex flex-wrap">

							<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn-loader">
								<span className="me-2">Loading</span>
								<span className="loading"><i className="ri-loader-2-fill fs-16"></i></span>
							</SpkButton>

							<SpkButton Buttontype="button" Buttonvariant="outline-secondary" Customclass="btn-loader">
								<span className="me-2">Loading</span>
								<span className="loading"><i className="ri-loader-2-fill fs-16"></i></span>
							</SpkButton>

							<SpkButton Buttontype="button" Buttonvariant="info-transparent" Customclass="btn-loader">
								<span className="me-2">Loading</span>
								<span className="loading"><i className="ri-loader-4-line fs-16"></i></span>
							</SpkButton>

							<SpkButton Buttontype="button" Buttonvariant="warning-transparent" Customclass="btn-loader">
								<span className="me-2">Loading</span>
								<span className="loading"><i className="ri-loader-5-line fs-16"></i></span>
							</SpkButton>

							<SpkButton Buttontype="button" Buttonvariant="success" Customclass="btn-loader" Disabled={true}>
								<span className="me-2">Disabled</span>
								<span className="loading"><i className="ri-refresh-line fs-16"></i></span>
							</SpkButton>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Icon Buttons" customCardBodyClass="" reactCode={reactButton15} reusableCode={reuseButton15}>
						<div className="btn-list d-md-flex d-block">
							<div className="mb-md-0 mb-2">
								<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn-icon">
									<i className="ri-bank-fill"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="info" Customclass="btn-icon">
									<i className="ri-medal-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="danger" Customclass="btn-icon">
									<i className="ri-archive-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="warning" Customclass="btn-icon me-5">
									<i className="ri-calendar-2-line"></i>
								</SpkButton>
							</div>
							<div className="mb-md-0 mb-2">
								<SpkButton Buttontype="button" Buttonvariant="primary-transparent" Customclass="rounded-pill btn-icon">
									<i className="ri-home-smile-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary-transparent" Customclass="rounded-pill btn-icon">
									<i className="ri-delete-bin-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="success-transparent" Customclass="rounded-pill btn-icon">
									<i className="ri-notification-3-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="danger-transparent" Customclass="rounded-pill btn-icon me-5">
									<i className="ri-chat-settings-line"></i>
								</SpkButton>
							</div>
							<div className="">
								<SpkButton Buttontype="button" Buttonvariant="outline-primary" Customclass="rounded-pill btn-icon">
									<i className="ri-phone-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="outline-teal" Customclass="rounded-pill btn-icon">
									<i className="ri-customer-service-2-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="outline-success" Customclass="rounded-pill btn-icon">
									<i className="ri-live-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="outline-secondary" Customclass="rounded-pill btn-icon">
									<i className="ri-save-line"></i>
								</SpkButton>
							</div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Icon Button Sizes" reactCode={reactButton16} reusableCode={reuseButton16}>
						<div className="btn-list d-md-flex d-block gap-5">
							<div className="mb-md-0 mb-2">
								<SpkButton Size="sm" Buttontype="button" Buttonvariant="primary" Customclass="btn-icon">
									<i className="ri-bank-fill"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="info" Customclass="btn-icon">
									<i className="ri-medal-line"></i>
								</SpkButton>
								<SpkButton Size="lg" Buttontype="button" Buttonvariant="danger" Customclass="btn-icon">
									<i className="ri-archive-line"></i>
								</SpkButton>
							</div>
							<div className="mb-md-0 mb-2">
								<SpkButton Size="sm" Buttontype="button" Buttonvariant="primary-light" Customclass="rounded-pill btn-icon">
									<i className="ri-home-smile-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary-light" Customclass="rounded-pill btn-icon">
									<i className="ri-delete-bin-line"></i>
								</SpkButton>
								<SpkButton Size="lg" Buttontype="button" Buttonvariant="success-light" Customclass="rounded-pill btn-icon">
									<i className="ri-notification-3-line"></i>
								</SpkButton>
							</div>
							<div className="">
								<SpkButton Size="sm" Buttontype="button" Buttonvariant="outline-primary" Customclass="rounded-pill btn-icon">
									<i className="ri-phone-line"></i>
								</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="outline-teal" Customclass="rounded-pill btn-icon">
									<i className="ri-customer-service-2-line"></i>
								</SpkButton>
								<SpkButton Size="lg" Buttontype="button" Buttonvariant="outline-success" Customclass="rounded-pill btn-icon">
									<i className="ri-live-line"></i>
								</SpkButton>
							</div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title=" Social Buttons" customCardBodyClass="" dataCode={dataButton17} reactCode={reactButton17} reusableCode={reuseButton17}>
						{SocialIconButtons.map((idx, index) => (
							<SpkButton Buttontype="button" Buttonvariant={idx.class1} Customclass="waves-effect waves-light m-1 btn-icon" key={index}>
								<i className={`ri-${idx.class}-line`}></i>
							</SpkButton>
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<div className="row">
						<Col xl={12}>
							<ShowCode title="Sizes" customCardBodyClass="" reactCode={reactButton18} reusableCode={reuseButton18}>
								<div className="btn-list">
									<SpkButton Size="sm" Buttontype="button" Buttonvariant="primary" Customclass="">
										Small button
									</SpkButton>
									<SpkButton Buttontype="button" Buttonvariant="secondary" Customclass="">
										Default button
									</SpkButton>
									<SpkButton Size="lg" Buttontype="button" Buttonvariant="success" Customclass="">
										Large button
									</SpkButton>
								</div>
							</ShowCode>
						</Col>
					</div>
				</Col>
				<Col xl={12}>
					<div className="row">
						<Col xl={12}>
							<ShowCode title="Button Widths" customCardBodyClass="" reactCode={reactButton19} reusableCode={reuseButton19}>
								<div className="btn-list">
									<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="btn-w-xs">XS</SpkButton>
									<SpkButton Buttontype="button" Buttonvariant="secondary" Customclass="btn-w-sm">SM</SpkButton>
									<SpkButton Buttontype="button" Buttonvariant="warning" Customclass="btn-w-md">MD</SpkButton>
									<SpkButton Buttontype="button" Buttonvariant="info" Customclass="btn-w-lg">LG</SpkButton>
								</div>
							</ShowCode>
						</Col>
					</div>
				</Col>
				<Col xl={12}>
					<ShowCode title="Buttons With Different Shadows" customCardBodyClass="" reactCode={reactButton20} reusableCode={reuseButton20}>
						<div className="btn-list d-flex flex-wrap">
							<div className="me-5">
								<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="shadow-sm">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="shadow">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="shadow-lg">Button</SpkButton>
							</div>
							<div>

								<SpkButton Size="sm" Buttontype="button" Buttonvariant="secondary" Customclass="shadow-sm">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="info" Customclass="shadow">Button</SpkButton>
								<SpkButton Size="lg" Buttontype="button" Buttonvariant="success" Customclass="shadow-lg">Button</SpkButton>
							</div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Different Colored Buttons With Shadows" customCardBodyClass="" reactCode={reactButton21} dataCode={dataButton21} reusableCode={reuseButton21}>
						<div className="btn-list">
							{ColoredButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass={`shadow-${idx.class}`} key={index}>Button</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Raised Buttons" customCardBodyClass="" reactCode={reactButton22} dataCode={dataButton22} reusableCode={reuseButton22}>
						<div className="btn-list">
							{ColoredButtons.map((idx, index) => (
								<SpkButton Buttontype="button" Buttonvariant={idx.class} Customclass="btn-raised-shadow" key={index}>Button</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Label Buttons" customCardBodyClass="" reactCode={reactButton23} reusableCode={reuseButton23}>
						<div className="btn-list">
							<SpkButton Buttontype="button" Buttonvariant="primary" Customclass="label-btn">
								<i className="ri-chat-smile-line label-btn-icon me-2"></i>
								Primary
							</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="secondary" Customclass="label-btn">
								<i className="ri-settings-4-line label-btn-icon me-2"></i>
								Secondary
							</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="warning" Customclass="label-btn rounded-pill">
								<i className="ri-spam-2-line label-btn-icon me-2 rounded-pill"></i>
								Warning
							</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="info" Customclass="label-btn rounded-pill">
								<i className="ri-phone-line label-btn-icon me-2 rounded-pill"></i>
								Info
							</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="success" Customclass="label-btn label-end">
								<i className="ri-thumb-up-line label-btn-icon ms-2"></i>
								Success
							</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="danger" Customclass="label-btn label-end rounded-pill">
								<i className="ri-close-line label-btn-icon ms-2 rounded-pill"></i>
								Cancel
							</SpkButton>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Custom Buttons" customCardBodyClass="" reactCode={reactButton24} reusableCode={reuseButton24}>
						<div className="btn-list">
							<SpkButton Buttontype="button" Buttonvariant="info" Customclass="custom-button rounded-pill">
								<span className="custom-btn-icons"><i className="ri-twitter-x-line text-info"></i></span>
								Twitter
							</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="teal-light" Customclass="btn-border-down">Border</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="secondary-light" Customclass="btn-border-start">Border</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="purple-light" Customclass="btn-border-end">Border</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="warning-light" Customclass="btn-border-top">Border</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="secondary" Customclass="btn-glare"> Glare Border</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="danger" Customclass="btn-hover btn-hover-animate">Like</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="success" Customclass="btn-darken-down">Hover</SpkButton>
							<SpkButton Buttontype="button" Buttonvariant="orange" Customclass="btn-custom-down">Hover</SpkButton>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Block buttons" customCardBodyClass="" reactCode={reactButton25} reusableCode={reuseButton25}>
						<div className="btn-list">
							<div className="d-grid gap-2 mb-4">
								<SpkButton Buttontype="button" Buttonvariant="primary">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="secondary">Button</SpkButton>
							</div>
							<div className="d-grid gap-2 d-md-block">

								<SpkButton Buttontype="button" Buttonvariant="info">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="success">Button</SpkButton>
							</div>
							<div className="d-grid gap-2 col-6 mx-auto">

								<SpkButton Buttontype="button" Buttonvariant="danger">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="warning">Button</SpkButton>
							</div>
							<div className="d-grid gap-2 d-md-flex justify-content-md-end">

								<SpkButton Buttontype="button" Buttonvariant="teal">Button</SpkButton>
								<SpkButton Buttontype="button" Buttonvariant="purple">Button</SpkButton>
							</div>
						</div>
					</ShowCode>
				</Col>
			</Row>

		</Fragment>
	)
};

export default Buttons;