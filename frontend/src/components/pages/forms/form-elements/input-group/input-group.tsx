
import SpkButton from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import { inputgroup1, inputgroup10, inputgroup11, inputgroup2, inputgroup3, inputgroup4, inputgroup5, inputgroup6, inputgroup7, inputgroup8, inputgroup9 } from "../../../../../shared/data/prism-code/forms-prism";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";

interface InputGroupsProps { }

const InputGroups: React.FC<InputGroupsProps> = () => {

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title="Forms-inputgroup" />

			<Pageheader title="Forms" subtitle="Form Elements" currentpage="Input Group" activepage="Input Group" />

			{/* <!-- Page Header Close --> */}

			{/* <!-- Start:: row-1 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Input Groups" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup1}>
						<InputGroup className="mb-3">
							<InputGroup.Text className="" id="basic-addon1">@</InputGroup.Text>
							<Form.Control type="text" className="" placeholder="Username"
								aria-label="Username" aria-describedby="basic-addon1" />
						</InputGroup>
						<InputGroup className="mb-3">
							<Form.Control type="text" className="" placeholder="Recipient's username"
								aria-label="Recipient's username" aria-describedby="basic-addon2" />
							<InputGroup.Text className="" id="basic-addon2">@example.com</InputGroup.Text>
						</InputGroup>
						<Form.Label htmlFor="basic-url" className="form-label">Your vanity URL</Form.Label>
						<InputGroup className="mb-3">
							<InputGroup.Text className=""
								id="basic-addon3">https://example.com/</InputGroup.Text>
							<Form.Control type="text" className="" id="basic-url"
								aria-describedby="basic-addon3" />
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Text className="">$</InputGroup.Text>
							<Form.Control type="text" className=""
								aria-label="Amount (to the nearest dollar)" />
							<InputGroup.Text className="">.00</InputGroup.Text>
						</InputGroup>
						<InputGroup className="mb-3">
							<Form.Control type="text" className="" placeholder="Username"
								aria-label="Username" />
							<InputGroup.Text className="">@</InputGroup.Text>
							<Form.Control type="text" className="" placeholder="Server"
								aria-label="Server" />
						</InputGroup>
						<InputGroup>
							<InputGroup.Text className="">With textarea</InputGroup.Text>
							<Form.Control as="textarea" className="" aria-label="With textarea" />
						</InputGroup>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-1 --> */}

			{/* <!-- Start:: row-2 --> */}

			<Row>
				<Col xl={12}>
					<Row>
						<Col xl={12}>
							<ShowCode title="Multiple inputs" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup6}>
								<InputGroup>
									<InputGroup.Text className="custom-multi-input">First and last name</InputGroup.Text>
									<Form.Control type="text" aria-label="First name" className="" />
									<Form.Control type="text" aria-label="Last name" className="" />
								</InputGroup>
							</ShowCode>
						</Col>
						<Col xl={12}>
							<ShowCode title="Checkboxes and radios" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup7}>
								<InputGroup className="mb-3">
									<InputGroup.Text className="">
										<Form.Check className=" mt-0" type="checkbox" value=""
											aria-label="Checkbox for following text input" />
									</InputGroup.Text>
									<Form.Control type="text" className=""
										aria-label="Text input with checkbox" />
								</InputGroup>
								<InputGroup>
									<InputGroup.Text className="">
										<Form.Check className=" mt-0" type="radio" value=""
											aria-label="Radio button for following text input" />
									</InputGroup.Text>
									<Form.Control type="text" className=""
										aria-label="Text input with radio button" />
								</InputGroup>
							</ShowCode>
						</Col>
						<Col xl={12}>
							<ShowCode title="Multiple addons" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup8}>
								<InputGroup className="mb-3">
									<InputGroup.Text className="">
										<Form.Check className="mt-0" type="checkbox" value=""
											aria-label="Checkbox for following text input" />
									</InputGroup.Text>
									<Form.Control type="text" className=""
										aria-label="Text input with checkbox" />
								</InputGroup>
								<InputGroup>
									<InputGroup.Text className="">
										<Form.Check className="mt-0" type="radio" value=""
											aria-label="Radio button for following text input" />
									</InputGroup.Text>
									<Form.Control type="text" className=""
										aria-label="Text input with radio button" />
								</InputGroup>
							</ShowCode>
						</Col>
						<Col xl={12}>
							<ShowCode title="Segmented buttons" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup9}>
								<div className="input-group mb-3 segmented-custom">
									<SpkButton Buttontype="button" Buttonvariant="primary" >Action</SpkButton>
									<SpkDropdown toggleas="a" Togglevariant="" Navigate="#!" Customtoggleclass="btn btn btn-primary dropdown-toggle dropdown-toggle-split no-caret dropdown-toggle fs-14 rounded-0"
										Arrowicon={true} Menuclass="dropdown-menu" Align="start">
										<Dropdown.Item href="#">Action</Dropdown.Item>
										<Dropdown.Item href="#">Another action</Dropdown.Item>
										<Dropdown.Item href="#">Something else here</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item href="#">Separated link</Dropdown.Item>
									</SpkDropdown>
									<input type="text" className="form-control" aria-label="Text input with segmented dropdown button" />
								</div>
								<InputGroup>
									<Form.Control type="text" className=""
										aria-label="Text input with segmented dropdown button" />
									<SpkButton Buttontype="button" Buttonvariant="primary" >Action</SpkButton>
									<SpkDropdown toggleas="a" Togglevariant="" Navigate="#!" Customtoggleclass="btn btn-primary dropdown-toggle dropdown-toggle-split no-caret"
										Arrowicon={true} Menuclass="dropdown-menu-end" Align="end">
										<Dropdown.Item href="#">Action</Dropdown.Item>
										<Dropdown.Item href="#">Another action</Dropdown.Item>
										<Dropdown.Item href="#">Something else here</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item href="#">Separated link</Dropdown.Item>
									</SpkDropdown>
								</InputGroup>
							</ShowCode>
						</Col>
						<Col xl={12}>
							<ShowCode title="Custom select" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup10}>
								<InputGroup className="mb-3">
									<label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
									<Form.Select className="form-select" id="inputGroupSelect03" aria-label="Example select with button addon">
										<option>Choose...</option>
										<option value="1">One</option>
										<option value="2">Two</option>
										<option value="3">Three</option>
									</Form.Select>
								</InputGroup>
								<InputGroup className="mb-3">
									<Form.Select className="form-select" id="inputGroupSelect02">
										<option >Choose...</option>
										<option value="1">One</option>
										<option value="2">Two</option>
										<option value="3">Three</option>
									</Form.Select>
									<label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
								</InputGroup>
								<InputGroup className="mb-3">
									<SpkButton Buttonvariant='primary' Buttontype="button">Button</SpkButton>
									<Form.Select className="form-select" id="inputGroupSelect03" aria-label="Example select with button addon">
										<option>Choose...</option>
										<option value="1">One</option>
										<option value="2">Two</option>
										<option value="3">Three</option>
									</Form.Select>
								</InputGroup>
								<InputGroup>
									<Form.Select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
										<option>Choose...</option>
										<option value="1">One</option>
										<option value="2">Two</option>
										<option value="3">Three</option>
									</Form.Select>
									<SpkButton Buttonvariant='primary' Buttontype="button">Button</SpkButton>
								</InputGroup>
							</ShowCode>
						</Col>
					</Row>
				</Col>
			</Row>

			{/* <!-- End:: row-2 --> */}

			{/* <!-- Start:: row-3 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Sizing" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup2}>
						<InputGroup className="input-group-sm mb-3">
							<InputGroup.Text className="" id="inputGroup-sizing-sm">Small</InputGroup.Text>
							<Form.Control type="text" className="form-control"
								aria-label="Sizing example input"
								aria-describedby="inputGroup-sizing-sm" />
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Text className=""
								id="inputGroup-sizing-default">Default</InputGroup.Text>
							<Form.Control type="text" className="form-control"
								aria-label="Sizing example input"
								aria-describedby="inputGroup-sizing-default" />
						</InputGroup>
						<InputGroup className="input-group-lg">
							<InputGroup.Text className="" id="inputGroup-sizing-lg">Large</InputGroup.Text>
							<Form.Control type="text" className="form-control"
								aria-label="Sizing example input"
								aria-describedby="inputGroup-sizing-lg" />
						</InputGroup>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Buttons addons" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup3}>
						<InputGroup className="mb-3">
							<SpkButton Buttonvariant='primary' Buttontype="button"
								Id="button-addon1">Button</SpkButton>
							<Form.Control type="text" placeholder=""
								aria-label="Example text with button addon"
								aria-describedby="button-addon1" />
						</InputGroup>
						<InputGroup className="mb-3">
							<SpkButton Buttonvariant='primary' Buttontype="button"
								Id="button-addon2">Button</SpkButton>
							<Form.Control type="text" placeholder="Recipient's username"
								aria-label="Recipient's username" aria-describedby="button-addon2" />
						</InputGroup>
						<InputGroup className="mb-3">
							<SpkButton Buttonvariant='primary' Buttontype="button" Customclass="custom-multi-input">Button</SpkButton>
							<SpkButton Buttonvariant='primary' Buttontype="button"  Customclass="custom-multi-input">Button</SpkButton>
							<Form.Control type="text" placeholder=""
								aria-label="Example text with two button addons" />
						</InputGroup>
						<InputGroup>
							<Form.Control type="text" placeholder="Recipient's username"
								aria-label="Recipient's username with two button addons" />
							<SpkButton Buttonvariant='primary' Buttontype="button"  Customclass="custom-multi-input">Button</SpkButton>
							<SpkButton Buttonvariant='primary' Buttontype="button"  Customclass="custom-multi-input">Button</SpkButton>
						</InputGroup>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Buttons with dropdowns" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup4}>
						<InputGroup className="mb-3">
							<SpkDropdown Togglevariant="" Customtoggleclass="btn btn-primary dropdown-toggle" Toggletext="Dropdown">
								<Dropdown.Item href="#!">Action</Dropdown.Item>
								<Dropdown.Item href="#!">Another action</Dropdown.Item>
								<Dropdown.Item href="#!">Something else here</Dropdown.Item>
								<Dropdown.Divider>
								</Dropdown.Divider>
								<Dropdown.Item href="#">Separated link</Dropdown.Item>
							</SpkDropdown>
							<Form.Control type="text" className="form-control"
								aria-label="Text input with dropdown button" />
						</InputGroup>
						<InputGroup className="mb-3">
							<Form.Control type="text" className="form-control"
								aria-label="Text input with dropdown button" />
								<div className="dropdown">
								<SpkDropdown Togglevariant="" Customtoggleclass="btn btn-outline-primary dropdown-toggle rounded-0 rounded-end-1 " Toggletext="Dropdown">
								<Dropdown.Item href="#!">Action</Dropdown.Item>
								<Dropdown.Item href="#!">Another action</Dropdown.Item>
								<Dropdown.Item href="#!">Something else here</Dropdown.Item>
								<Dropdown.Divider>
								</Dropdown.Divider>
								<Dropdown.Item href="#!">Separated link</Dropdown.Item>
							</SpkDropdown>
								</div>
							
						</InputGroup>
						<InputGroup>
							<SpkDropdown Togglevariant="" Arrowicon={true} Customtoggleclass="btn btn-primary-transparent dropdown-toggle no-caret custom-form-group" Toggletext="Dropdown">
								<Dropdown.Item href="#!">Action</Dropdown.Item>
								<Dropdown.Item href="#!">Another action</Dropdown.Item>
								<Dropdown.Item href="#!">Something else here</Dropdown.Item>
								<Dropdown.Divider>
								</Dropdown.Divider>
								<Dropdown.Item href="#!">Separated link</Dropdown.Item>
							</SpkDropdown>
							<Form.Control type="text" className="custom-input-group"
								aria-label="Text input with 2 dropdown buttons " />
							<div className="dropdown ">
								<SpkDropdown Togglevariant="" Arrowicon={true} Customtoggleclass="btn btn-primary-transparent dropdown-toggle rounded-0 rounded-end-1 no-caret custom-form-group" Toggletext="Dropdown" >
									<Dropdown.Item href="#!">Action</Dropdown.Item>
									<Dropdown.Item href="#!">Another action</Dropdown.Item>
									<Dropdown.Item href="#!">Something else here</Dropdown.Item>
									<Dropdown.Divider>
									</Dropdown.Divider>
									<Dropdown.Item href="#!">Separated link</Dropdown.Item>
								</SpkDropdown>
							</div>
						</InputGroup>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Custom file input" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup5}>
						<InputGroup className="mb-3">
							<label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
							<Form.Control type="file" className="form-control" id="inputGroupFile01" />
						</InputGroup>

						<InputGroup className="mb-3">
							<Form.Control type="file" className="form-control" id="inputGroupFile02" />
							<label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
						</InputGroup>

						<InputGroup className="mb-3">
							<SpkButton Buttonvariant='primary' Buttontype="button"
								Id="inputGroupFileAddon03">Button</SpkButton>
							<Form.Control type="file" className="form-control" id="inputGroupFile03"
								aria-describedby="inputGroupFileAddon03" aria-label="Upload" />
						</InputGroup>

						<InputGroup>
							<Form.Control type="file" className="form-control" id="inputGroupFile04"
								aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
							<SpkButton Buttonvariant='primary' Buttontype="button"
								Id="inputGroupFileAddon04">Button</SpkButton>
						</InputGroup>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Wrapping" customCardClass="custom-card" customCardBodyClass="" reactCode={inputgroup11}>
						<InputGroup className="flex-nowrap">
							<InputGroup.Text className="" id="addon-wrapping">@</InputGroup.Text>
							<Form.Control type="text" className="" placeholder="Username"
								aria-label="Username" aria-describedby="addon-wrapping" />
						</InputGroup>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-3 --> */}

		</Fragment>
	)
};

export default InputGroups;