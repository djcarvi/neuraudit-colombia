
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { dataspinner1, dataspinner7, spinner1, spinner10, spinner2, spinner3, spinner4, spinner5, spinner6, spinner7, spinner8, spinner9 } from "../../../../shared/data/prism-code/uielements-prism";
import { Buttonspinner, Colorspinner } from "../../../../shared/data/general/ui-elements/spinnersdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";

interface SpinnersProps { }

const Spinners: React.FC<SpinnersProps> = () => {

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title="Spinners" />

			<Pageheader title="Ui Elements" currentpage="Spinners" activepage="Spinners" />

			{/* <!-- Page Header Close --> */}

			{/* <!-- Start:: row-1 --> */}

			<Row>
				<Col xl={6}>
					<ShowCode title="Border spinner" customCardClass="custom-card" customCardBodyClass="" reactCode={spinner4}>
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</ShowCode>
				</Col>
				<Col xl={6}>
					<ShowCode title="Growing spinner" customCardClass="custom-card" customCardBodyClass="" reactCode={spinner3}>
						<div className="spinner-grow" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-1 --> */}

			{/* <!-- Start:: row-2 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Colors" customCardClass="custom-card" customCardBodyClass="" dataCode={dataspinner1} reactCode={spinner1}>
						{Colorspinner.map((idx, index) => (
							<div className={`spinner-border me-2 text-${idx.color}`} role="status" key={index}>
								<span className="visually-hidden">Loading...</span>
							</div>
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Growing Color spinner" customCardClass="custom-card" customCardBodyClass="" dataCode={dataspinner1} reactCode={spinner2}>
						{Colorspinner.map((idx, index) => (
							<div className={`spinner-grow me-1 text-${idx.color}`} role="status" key={index}>
								<span className="visually-hidden">Loading...</span>
							</div>
						))}
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-2 --> */}

			{/* <!-- Start:: row-3 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Alignment Flex" customCardClass="custom-card" customCardBodyClass="" reactCode={spinner5}>
						<div className="d-flex justify-content-center mb-4">
							<div className="spinner-border " role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
						<div className="d-flex align-items-center">
							<strong>Loading...</strong>
							<div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Alignment Float" customCardClass="custom-card" customCardBodyClass="" reactCode={spinner6}>
						<div className="clearfix mb-4">
							<div className="spinner-border float-end" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
						<div className="clearfix">
							<div className="spinner-border float-start" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-3 --> */}

			{/* <!-- Start:: row-4 --> */}

			<Row>
				<Col xl={6}>
					<ShowCode title="Alignment Text center" customCardClass="custom-card" customCardBodyClass="" reactCode={spinner9}>
						<div className="text-center">
							<div className="spinner-border text-dark" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					</ShowCode>
					<ShowCode title="Spinner Sizes" customCardClass="custom-card" customCardBodyClass="d-flex align-items-center" reactCode={spinner10}>
						<div className="spinner-border text-dark spinner-border-sm me-4" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<div className="spinner-grow text-dark spinner-grow-sm me-4" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<div className="spinner-border text-dark me-4" style={{ width: "3rem", height: "3rem" }}
							role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<div className="spinner-grow text-dark" style={{ width: "3rem", height: "3rem" }} role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</ShowCode>
				</Col>
				<Col xl={6}>
					<ShowCode title="Alignment Margin" customCardClass="custom-card" customCardBodyClass="d-flex align-items-center" reactCode={spinner8}>
						<div className="spinner-border text-dark m-5" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-4 --> */}

			{/* <!-- Start:: row-5 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Buttons" customCardClass="custom-card" customCardBodyClass="" dataCode={dataspinner7} reactCode={spinner7}>
						<div className="btn-list">
							<SpkButton Buttonvariant='primary-light' Buttontype="button" Disabled={true}>
								<span className="spinner-border spinner-border-sm align-middle me-1" role="status"
									aria-hidden="true"></span>
								<span className="visually-hidden"> Loading...</span>
							</SpkButton>
							<SpkButton Buttonvariant='primary-light' Buttontype="button" Disabled={true}>
								<span className="spinner-border spinner-border-sm align-middle me-1" role="status"
									aria-hidden="true"></span>
								Loading...
							</SpkButton>
							<SpkButton Buttonvariant='primary-light' Buttontype="button" Disabled={true}>
								<span className="spinner-grow spinner-grow-sm align-middle me-1" role="status"
									aria-hidden="true"></span>
								<span className="visually-hidden"> Loading...</span>
							</SpkButton>
							{Buttonspinner.map((idx, index) => (
								<SpkButton Buttonvariant={idx.color} Buttontype="button" Disabled={true} key={index}>
									<span className="spinner-grow spinner-grow-sm align-middle me-1" role="status"
										aria-hidden="true"></span>
									Loading...
								</SpkButton>
							))}
						</div>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-5 --> */}

		</Fragment>
	)
};

export default Spinners;