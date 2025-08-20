
import { Link } from "react-router-dom";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Card, Col, Collapse, Container, Dropdown, Form, Image, InputGroup, Nav, NavDropdown, Navbar, Offcanvas, Row } from "react-bootstrap";
import logo1 from "../../../../assets/images/brand-logos/toggle-logo.png";
import logo2 from "../../../../assets/images/brand-logos/toggle-dark.png";
interface NavbarsProps { }

const Navbars: React.FC<NavbarsProps> = () => {

	const [open, setOpen] = useState(false);

	return (
		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title={"Navbar"} />

			<Pageheader title="Advanced Ui" currentpage="Navbar" activepage="Navbar" />

			{/* <!-- Page Header Close --> */}

			{/* <!-- Start:: row-1 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Navbar with sub-component
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar defaultValue="" expand="lg" className="navbar navbar-expand-lg bg-light">
								<Container fluid>
									<Navbar.Brand>
										<Image  src={logo1} alt="" className="d-inline-block align-text-top" />
									</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="" id="navbarSupportedContent">
										<Nav as="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item><Nav.Link className="active" >Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
											<NavDropdown title="Dropdown" id="basic-nav-dropdown">
												<NavDropdown.Item >Action</NavDropdown.Item>
												<NavDropdown.Item >
													Another action
												</NavDropdown.Item>
												<NavDropdown.Divider />
												<NavDropdown.Item >
													Something else
													here
												</NavDropdown.Item>
											</NavDropdown>
											<Nav.Item>
												<Nav.Link className="disabled">Disabled</Nav.Link>
											</Nav.Item>
										</Nav>
										<Form className="d-flex" role="search">
											<Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant="primary" Buttontype="button" >Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-1 --> */}

			{/* <!-- Start:: row-2 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Brand With And Without Links
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar bg-light mb-3">
								<Container fluid>
									<Link to="#!" className="navbar-brand"  ><Image  src={logo1} alt="" /></Link>
								</Container>
							</Navbar>
							<Navbar className="navbar bg-light">
								<Container fluid>
									<span className="navbar-brand mb-0 h1"><Image  src={logo1} alt="" /></span>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-2 --> */}

			{/* <!-- Start:: row-4 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Image and text
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar bg-light">
								<Container fluid>
									<Navbar.Brand className="navbar-brand" >
										<Image src={logo1} alt="" className="d-inline-block align-text-top" /> Bootstrap
									</Navbar.Brand>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-4 --> */}

			{/* <!-- Start:: row-5 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Nav with lists, links and dropdowns
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar expand="lg" className="navbar navbar-expand-lg bg-light mb-3">
								<Container fluid>
									<Navbar.Brand  >
										<Image  src={logo1} alt="" />
									</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarNav">
										<Nav className="navbar-nav">
											<Nav.Item><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Features</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Pricing</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link className="disabled">Disabled</Nav.Link></Nav.Item>
										</Nav>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg bg-light mb-3">
								<Container fluid>
									<Navbar.Brand >
										<Image  src={logo1} alt="" />
									</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarNavAltMarkup">
										<Nav className="navbar-nav">
											<Nav.Link className="active" aria-current="page" >Home</Nav.Link>
											<Nav.Link >Features</Nav.Link>
											<Nav.Link >Pricing</Nav.Link>
											<Nav.Link className="disabled" >Disabled</Nav.Link>
										</Nav>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg bg-light">
								<Container fluid>
									<Navbar.Brand >
										<Image  src={logo1} alt="" />
									</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarNavDropdown">
										<Nav className="navbar-nav">
											<Nav.Item>
												<Nav.Link className="active" aria-current="page">Home</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link>Features</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link>Pricing</Nav.Link>
											</Nav.Item>
											<Nav.Item className="dropdown">
												<NavDropdown title="Dropdown" id="basic-nav-dropdown">
													<NavDropdown.Item>Action</NavDropdown.Item>
													<NavDropdown.Item>
														Another action
													</NavDropdown.Item>
													<NavDropdown.Divider />
													<NavDropdown.Item>Something else here</NavDropdown.Item>
												</NavDropdown>
											</Nav.Item>
										</Nav>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-5 --> */}

			{/* <!-- Start:: row-3 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Forms In Navbar
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar bg-light mb-3">
								<Container fluid>
									<Form className="d-flex" role="search">
										<Form.Control className="form-control me-2" type="search" placeholder="Search"
											aria-label="Search" />
										<SpkButton Buttonvariant="primary" Buttontype="submit" >Search</SpkButton>
									</Form>
								</Container>
							</Navbar>
							<Navbar className="navbar bg-light mb-3">
								<Container fluid>
									<Navbar.Brand >  <Image  src={logo1} alt="" /></Navbar.Brand>
									<Form className="d-flex flex-sm-nowrap flex-wrap gap-2" role="search">
										<input className="form-control me-2" type="search" placeholder="Search"
											aria-label="Search" />
										<SpkButton Buttonvariant="primary" Buttontype="submit" >Search</SpkButton>
									</Form>
								</Container>
							</Navbar>
							<h6 className="mb-3 fw-semibold">Input groups in navbar forms</h6>
							<Navbar className="navbar bg-light mb-3">
								<Form className="container-fluid">
									<InputGroup>
										<span className="input-group-text" id="basic-addon1">@</span>
										<Form.Control type="text" className="form-control" placeholder="Username"
											aria-label="Username" aria-describedby="basic-addon1" />
									</InputGroup>
								</Form>
							</Navbar>
							<h6 className="mb-3 fw-semibold"> Variation buttons are supported as part of the navbar forms</h6>
							<Navbar className="navbar bg-light">
								<Form className="container-fluid justify-content-start flex-wrap">
									<SpkButton Buttonvariant="primary" Buttontype="button" Customclass="m-1">Main button</SpkButton>
									<SpkButton Buttonvariant="outline-secondary" Buttontype="button" Customclass="m-1 btn-sm">Smaller button</SpkButton>
								</Form>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-3 --> */}

			{/* <!-- Start:: row-6 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Navbar With Text
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar bg-light mb-3">
								<Container fluid>
									<span className="navbar-text">
										Navbar text with an inline element
									</span>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg bg-light">
								<Container fluid>
									<Navbar.Brand >Navbar with text</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarText">
										<Nav className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item><Nav.Link className="nav-link active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link className="nav-link">Features</Nav.Link></Nav.Item>
											<Nav.Item>
												<Nav.Link className="nav-link">Pricing</Nav.Link>
											</Nav.Item>
										</Nav>
										<span className="navbar-text">
											Navbar text with an inline element
										</span>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-6 --> */}

			{/* <!-- Start:: row-7 --> */}

			<Row>
				<Col xxl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Transparent Color Schemes
							</Card.Title>
						</Card.Header>
						<Card.Body>

							<Navbar expand="lg" className="navbar navbar-primary-transparent mb-3">
								<Container fluid>
									<Navbar.Brand className="navbar-brand" >
										<Image  src={logo1} alt="" />
									</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarColor01">
										<Nav as="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item as="li"><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Features</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Pricing</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>About</Nav.Link></Nav.Item>
										</Nav>
										<Form className="d-flex" role="search">
											<Form.Control className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant='primary' Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-secondary-transparent mb-3">
								<Container fluid>
									<Navbar.Brand  className="navbar-brand">  <Image  src={logo1} alt="" /></Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarColor02">
										<Nav as="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item as="li"><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Features</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Pricing</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>About</Nav.Link></Nav.Item>
										</Nav>
										<Form className="d-flex" role="search">
											<Form.Control className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant='secondary' Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark-transparent">
								<Container fluid>
									<Navbar.Brand  className="navbar-brand">  <Image  src={logo1} alt="" /></Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarColor03">
										<Nav as="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item as="li"><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Features</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Pricing</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>About</Nav.Link></Nav.Item>
										</Nav>
										<Form className="d-flex" role="search">
											<Form.Control className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant='dark' Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Solid Color Schemes
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-primary mb-3">
								<Container fluid>
									<Navbar.Brand >
										<Image  src={logo2} alt="" />
									</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarColor04">
										<Nav className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link className="nav-link">Features</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link className="nav-link">Pricing</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link className="nav-link">About</Nav.Link></Nav.Item>
										</Nav>
										<form className="d-flex" role="search">
											<Form.Control className="form-control me-2 border-0" type="search" placeholder="Search"
												aria-label="Search" />
											<SpkButton Buttonvariant='light' Buttontype="submit">Search</SpkButton>
										</form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-secondary mb-3">
								<Container fluid>
									<Navbar.Brand >  <Image  src={logo2} alt="" /></Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarColor05">
										<Nav className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Features</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Pricing</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>About</Nav.Link></Nav.Item>
										</Nav>
										<form className="d-flex" role="search">
											<Form.Control className="form-control me-2 border-0" type="search" placeholder="Search"
												aria-label="Search" />
											<SpkButton Buttonvariant='light' Buttontype="submit">Search</SpkButton>
										</form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark">
								<Container fluid>
									<Navbar.Brand >  <Image  src={logo1} alt="" /></Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarColor06">
										<Nav className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Features</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Pricing</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>About</Nav.Link></Nav.Item>
										</Nav>
										<form className="d-flex" role="search">
											<Form.Control className="form-control me-2 border-0" type="search" placeholder="Search"
												aria-label="Search" />
											<SpkButton Buttonvariant='light' Buttontype="submit">Search</SpkButton>
										</form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-7 --> */}

			{/* <!-- Start:: row-8 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Containers
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<h6>Top center</h6>
							<Container>
								<Navbar expand="lg" className="navbar-expand-lg bg-light mb-3">
									<Container fluid>
										<Navbar.Brand >Navbar</Navbar.Brand>
									</Container>
								</Navbar>
							</Container>
							<h6>Change the responsive container to how to wide the content</h6>
							<Navbar expand="lg" className="navbar navbar-expand-lg bg-light">
								<div className="container-md">
									<Navbar.Brand >Navbar</Navbar.Brand>
								</div>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-8 --> */}

			{/* <!-- Start:: row-10 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Placement
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar bg-light">
								<Container fluid>
									<Navbar.Brand >Default</Navbar.Brand>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-10 --> */}

			{/* <!-- Start:: row-11 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Placement
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar fixed-top bg-light">
								<Container fluid>
									<Navbar.Brand >Fixed top</Navbar.Brand>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-11 --> */}

			{/* <!-- Start:: row-9 --> */}

			<Row>
				<div className="'col-xl-12">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Placement
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="navbar fixed-bottom navbar-light bg-light">
								<Container fluid>
									<Navbar.Brand >Fixed bottom</Navbar.Brand>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</div>
			</Row>

			{/* <!-- End:: row-9 --> */}

			{/* <!-- Start:: row-12 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Placement
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar className="sticky-top navbar-light bg-light">
								<Container fluid>
									<Navbar.Brand  className="">Sticky top</Navbar.Brand>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-12 --> */}

			{/* <!-- Start:: row-14 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Responsive behaviors Toggler
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-light bg-light mb-3">
								<Container fluid>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarTogglerDemo01">
										<Navbar.Brand className="navbar-brand text-default" >Hidden brand</Navbar.Brand>
										<Nav as="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item as="li"><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link>Link</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link className="nav-link disabled" tabIndex={-1} aria-disabled="true">Disabled</Nav.Link></Nav.Item>
										</Nav>
										<Form className="d-flex">
											<Form.Control className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant='primary' Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<h6>With a brand name shown on the left and toggler on the right:</h6>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-light bg-light mb-3">
								<Container fluid>
									<Navbar.Brand  className="navbar-brand text-default">Navbar</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarTogglerDemo02">
										<Nav className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item><Nav.Link className="active" aria-current="page">Home</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
											<Nav.Item><Nav.Link className="disabled" tabIndex={-1} aria-disabled="true">Disabled</Nav.Link></Nav.Item>
										</Nav>
										<Form className="d-flex">
											<Form.Control className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant='primary' Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
							<h6>With a toggler on the left and brand name on the right:</h6>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-light bg-light">
								<Container fluid>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Brand  className="navbar-brand text-default">Navbar</Navbar.Brand>
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarTogglerDemo03">
										<Nav as="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
											<Nav.Item as="li"><Nav.Link className="active" aria-current="page" >Home</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link >Link</Nav.Link></Nav.Item>
											<Nav.Item as="li"><Nav.Link className="disabled" tabIndex={-1} aria-disabled="true">Disabled</Nav.Link></Nav.Item>
										</Nav>
										<Form className="d-flex">
											<Form.Control className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
											<SpkButton Buttonvariant='primary' Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-14 --> */}

			{/* <!-- Start:: row-13 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Scrolling
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar expand="lg" className="navbar navbar-expand-lg navbar-light bg-light">
								<Container fluid>
									<Navbar.Brand className="" >Navbar scroll</Navbar.Brand>
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse className="collapse navbar-collapse" id="navbarScroll">
										<Nav as="ul" className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
											<Nav.Item as="li">
												<Nav.Link className="nav-link active" aria-current="page">Home</Nav.Link>
											</Nav.Item>
											<Nav.Item as="li">
												<Nav.Link className="nav-link">Link</Nav.Link>
											</Nav.Item>
											<SpkDropdown Togglevariant="" Toggletext="Link" Customclass="nav-item dropdown" Id="navbarScrollingDropdown"
												Customtoggleclass="nav-link dropdown-toggle" Menulabel="navbarScrollingDropdown">
												<Dropdown.Item as="li" className="dropdown-item">Action</Dropdown.Item>
												<Dropdown.Item as="li" className="dropdown-item">Another action</Dropdown.Item>
												<Dropdown.Divider className="dropdown-divider" />
												<Dropdown.Item as="li" className="dropdown-item">Something else
													here</Dropdown.Item>
											</SpkDropdown>
											<Nav.Item as="li">
												<Nav.Link className="disabled" tabIndex={-1}
													aria-disabled="true">Link</Nav.Link>
											</Nav.Item>
										</Nav>
										<Form className="d-flex mt-3">
											<Form.Control className=" me-2" type="search" placeholder="Search"
												aria-label="Search" />
											<SpkButton Buttonvariant='primary'
												Buttontype="submit">Search</SpkButton>
										</Form>
									</Navbar.Collapse>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-13 --> */}

			{/* <!-- Start:: row-15 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								External content
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Collapse in={open}>
								<div className="bg-dark p-4">
									<h5 className="text-white h4">Collapsed content</h5>
									<span className="text-white op-7">Toggleable via the navbar brand.</span>
								</div>
							</Collapse>
							<Nav className="navbar navbar-dark bg-dark rounded-0">
								<Container fluid>
									<SpkButton Buttonvariant='' onClickfunc={() => setOpen(!open)} Customclass="navbar-toggler navbar-dark-btn-toggler" Buttoncontrols="example-collapse-text" Expand={open}>
										<span className="navbar-toggler-icon"></span>
									</SpkButton>
								</Container>
							</Nav>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-15 --> */}

			{/* <!-- Start:: row-16 --> */}

			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Offcanvas
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Navbar expand={false} className="navbar bg-light fixed-top mx-1 m-0">
								<Container fluid>
									<Navbar.Brand>Navbar Offcanvas</Navbar.Brand>
									<Navbar.Toggle aria-controls="offcanvasNavbar-expand-false" className='dark-filter-img' />
									<Navbar.Offcanvas id={"offcanvasNavbar-expand-false"} aria-labelledby="offcanvasNavbarLabel-expand-false" placement="end">
										<Offcanvas.Header closeButton >
											<Offcanvas.Title id="offcanvasNavbarLabel-expand-false">Offcanvas</Offcanvas.Title>
										</Offcanvas.Header>
										<Offcanvas.Body>
											<Nav className="justify-content-end flex-grow-1 pe-3">
												<Nav.Link active className='px-2 mb-1'>Home</Nav.Link>
												<Nav.Link className='px-2'>Link</Nav.Link>
												<NavDropdown title="Dropdown" id="offcanvasNavbarDropdown-expand-false" className="px-2">
													<NavDropdown.Item >Action</NavDropdown.Item>
													<NavDropdown.Item >Another action</NavDropdown.Item>
													<NavDropdown.Divider />
													<NavDropdown.Item>Something else here</NavDropdown.Item>
												</NavDropdown>
											</Nav>
											<Form className="d-flex mt-3">
												<Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
												<SpkButton Buttonvariant="primary">Search</SpkButton>
											</Form>
										</Offcanvas.Body>
									</Navbar.Offcanvas>
								</Container>
							</Navbar>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!-- End:: row-16 --> */}

		</Fragment>

	)
};

export default Navbars;