
import SpkBreadcrumb from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-breadcrumb";
import { breadcrumb1, breadcrumb2, breadcrumb3, breadcrumb4, breadcrumb5, breadcrumb6, reusebreadcrumb1, reusebreadcrumb2, reusebreadcrumb3, reusebreadcrumb4, reusebreadcrumb5, reusebreadcrumb6 } from "../../../../shared/data/prism-code/uielements-prism";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";

interface BreadcrumbProps { }

const Breadcrumbs: React.FC<BreadcrumbProps> = () => {

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title="Uielements-Breadcrumb" />

			<Pageheader title="Ui Elements" currentpage="Breadcrumb" activepage="Breadcrumb" />

			{/* <!-- Page Header Close --> */}

			{/* <!--ROW-START--> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Example" customCardClass="custom-card" reactCode={breadcrumb1} reusableCode={reusebreadcrumb1}>
						<SpkBreadcrumb>
							<Breadcrumb.Item active aria-current="page">Home</Breadcrumb.Item>
						</SpkBreadcrumb>
						<nav aria-label="breadcrumb">
							<SpkBreadcrumb>
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item active aria-current="page">Library</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>

						<nav aria-label="breadcrumb">
							<SpkBreadcrumb Customclass="custom-breadcrumb mb-0 custom-breadcrumb">
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
								<Breadcrumb.Item active aria-current="page">Data</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Example1" customCardClass="custom-card" reactCode={breadcrumb2} reusableCode={reusebreadcrumb2}>
						<nav aria-label="breadcrumb">
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-example1">
								<Breadcrumb.Item active aria-current="page">Home</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>

						<nav aria-label="breadcrumb">
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-example1">
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item active aria-current="page">Library</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>

						<nav aria-label="breadcrumb">
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-example1 breadcrumb-second mb-0">
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
								<Breadcrumb.Item active aria-current="page">Data</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Dividers" customCardClass="custom-card" reactCode={breadcrumb5} reusableCode={reusebreadcrumb5}>
						<nav
							aria-label="breadcrumb" className='divider-breadcrumb'>
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-second mb-0">
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item active className="active" aria-current="page">Library</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Embedded SVG icon" customCardClass="custom-card" reactCode={breadcrumb6} reusableCode={reusebreadcrumb6}>
						<nav className="embedded-svg-icon">
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-second mb-0">
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item active className="embedded-breadcrumb" aria-current="page">Library</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Breadcrumb Style-1" customCardClass="custom-card" reactCode={breadcrumb3} reusableCode={reusebreadcrumb3}>
						<nav aria-label="breadcrumb">
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-style1 breadcrumb-second mb-0">
								<Breadcrumb.Item href="#!">Home</Breadcrumb.Item>
								<Breadcrumb.Item href="#!">Library</Breadcrumb.Item>
								<Breadcrumb.Item active className="active" aria-current="page">Data</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Breadcrumb Style-2" customCardClass="custom-card" reactCode={breadcrumb4} reusableCode={reusebreadcrumb4}>
						<nav aria-label="breadcrumb">
							<SpkBreadcrumb Customclass="custom-breadcrumb breadcrumb-style2 breadcrumb-second mb-0">
								<Breadcrumb.Item href="#!"><i className="ti ti-home-2 me-1 fs-15 d-inline-block"></i>Home</Breadcrumb.Item>
								<Breadcrumb.Item href="#!"><i className="ti ti-apps me-1 fs-15 d-inline-block"></i>About</Breadcrumb.Item>
								<Breadcrumb.Item active className="active" aria-current="page">Services</Breadcrumb.Item>
							</SpkBreadcrumb>
						</nav>
					</ShowCode>
				</Col>
			</Row>

			{/* <!--ROW-END--> */}

		</Fragment>

	)
};

export default Breadcrumbs;