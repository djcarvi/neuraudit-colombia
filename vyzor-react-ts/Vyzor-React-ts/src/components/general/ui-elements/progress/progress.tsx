
import SpkProgress from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import { dataprogress4, dataprogress8, progress1, progress10, progress11, progress12, progress13, progress14, progress2, progress3, progress4, progress5, progress6, progress7, progress8, progress9, reusable13, reusableprogress1, reusableprogress12, reusableprogress14, reusableprogress2, reusableprogress3, reusableprogress4, reusableprogress5, reusableprogress6 } from "../../../../shared/data/prism-code/uielements-prism";
import { Animatedata, Coloreddata, CustomProgress2data, Heightdata, Multipleprogress, Stripeddata, progressdata } from "../../../../shared/data/general/ui-elements/progressdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, ProgressBar, Row } from "react-bootstrap";

interface ProgressProps { }

const Progress: React.FC<ProgressProps> = () => {

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title="Progress" />

			<Pageheader title="Ui Elements" currentpage="Progress" activepage="Progress" />

			{/* <!-- Page Header Close --> */}

			{/* <!-- Start:: row-1 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Basic Progress" customCardClass="custom-card" customCardBodyClass="" reactCode={progress1} reusableCode={reusableprogress1}>
						{progressdata.map((idx, index) => (
							<SpkProgress key={index} variant="primary" now={idx.data} mainClass="progress mb-3" />
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Different Colored Progress" customCardClass="custom-card" customCardBodyClass="" reactCode={progress6} reusableCode={reusableprogress6}>
						{Coloreddata.map((idx, index) => (
							<SpkProgress key={index} variant={idx.color} now={idx.data} mainClass="progress mb-3" />
						))}
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-1 --> */}

			{/* <!-- Start:: row-2 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Striped Progress" customCardClass="custom-card" customCardBodyClass="" reactCode={progress2} reusableCode={reusableprogress2}>
						{Stripeddata.map((idx, index) => (
							<SpkProgress key={index} variant={idx.color} striped={true} now={idx.data} mainClass="progress mb-3" />
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Progress Height" customCardClass="custom-card" customCardBodyClass="" reactCode={progress5} reusableCode={reusableprogress5}>
						{Heightdata.map((idx, index) => (
							<SpkProgress key={index} variant="primary" now={idx.data} mainClass={idx.class} />
						))}
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-2 --> */}

			{/* <!-- Start:: row-3 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Progress With Labels" customCardClass="custom-card" customCardBodyClass="" reactCode={progress3} reusableCode={reusableprogress3}>
						{Stripeddata.map((idx, index) => (
							<SpkProgress key={index} variant={idx.color} label={`${idx.data}%`} now={idx.data} mainClass="progress mb-3" />
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Multiple bars With Sizes" customCardClass="custom-card" customCardBodyClass="progress-body" dataCode={dataprogress4} reactCode={progress4} reusableCode={reusableprogress4}>
						{Multipleprogress.map((idx, index) => (
							<ProgressBar className={`progress-stacked progress-${idx.size} mb-3`} key={index}>
								<ProgressBar variant={idx.class1} now={idx.now1} key={1} />
								<ProgressBar variant={idx.class2} now={idx.now2} key={2} />
								<ProgressBar variant={idx.class3} now={idx.now3} key={3} />
							</ProgressBar>
						))}
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-3 --> */}

			{/* <!-- Start:: row-4 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Animated Stripped Progress" customCardClass="custom-card" customCardBodyClass="" reactCode={progress13} reusableCode={reusable13}>
						{Animatedata.map((idx, index) => (
							<SpkProgress key={index} variant={idx.color} mainClass={`progress ${idx.class}`} animated={true} now={idx.data} />
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Gradient Progress" customCardClass="custom-card" customCardBodyClass="" reactCode={progress12} reusableCode={reusableprogress12}>
						{Animatedata.map((idx, index) => (
							<SpkProgress key={index} variant={`${idx.color}-gradient`} mainClass={`progress ${idx.class}`} animated={true} now={idx.data} />
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Custom Animated Progress" customCardClass="custom-card" customCardBodyClass="" reactCode={progress14} reusableCode={reusableprogress14}>
						{Animatedata.map((idx, index) => (
							<SpkProgress key={index} variant={`${idx.color}-gradient`} mainClass={`progress progress-animate ${idx.class}`} animated={true} now={idx.data} />
						))}
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-4 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Custom Progress-1" customCardClass="custom-card" customCardBodyClass="" reactCode={progress7}>
						<div className="progress progress-sm progress-custom mb-5 progress-animate">
							<h6 className="progress-bar-title">Mobiles</h6>
							<div className='progress-bar bg-primary custom-height1' style={{ width: "50%" }}>
								<div className='progress-bar-value bg-primary'>50%</div>
							</div>
						</div>
						<div className="progress progress-sm progress-custom mb-5 progress-animate">
							<h6 className="progress-bar-title bg-secondary">Watches</h6>
							<div className='progress-bar bg-secondary custom-height1' style={{ width: "60%" }}>
								<div className='progress-bar-value bg-secondary'>50%</div>
							</div>
						</div>
						<div className="progress progress-sm progress-custom mb-3 progress-animate">
							<h6 className="progress-bar-title bg-success">Shirts</h6>
							<div className='progress-bar bg-success custom-height1' style={{ width: "70%" }}>
								<div className='progress-bar-value bg-success'>50%</div>
							</div>
						</div>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- Start:: row-6 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Custom Progress-2" reactCode={progress8} dataCode={dataprogress8}>
						{CustomProgress2data.map((idx, index) => (
							<div className={`progress progress-bar progress-sm ${idx.class3}`} key={index} >
								<div className={`progress-item-1 bg-${idx.class}`}></div>
								<div className={`progress-item-2 bg-${idx.class2}`}></div>
								<div className={`progress-item-3 bg-${idx.class1}`}></div>
								<ProgressBar variant={idx.class} now={idx.now} />
							</div>
						))}
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Custom Progress-3" customCardClass="custom-card" customCardBodyClass="" reactCode={progress9}>
						<div className="progress progress-lg mb-5 custom-progress-3 progress-animate" role="progressbar">
							<div className="progress-bar bg-primary" style={{ width: "50%" }}>
								<div className="progress-bar-value">50%</div>
							</div>
						</div>
						<div className="progress progress-lg mb-5 custom-progress-3 progress-animate" role="progressbar">
							<div className="progress-bar bg-secondary" style={{ width: "60%" }}>
								<div className="progress-bar-value secondary">60%</div>
							</div>
						</div>
						<div className="progress progress-lg custom-progress-3 progress-animate" role="progressbar" >
							<div className="progress-bar bg-success" style={{ width: "70%" }}>
								<div className="progress-bar-value success">70%</div>
							</div>
						</div>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-6 --> */}

			{/* <!-- Start:: row-7 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Custom Progress-4" customCardClass="custom-card" customCardBodyClass="progress-body" reactCode={progress10}>
						<div className="progress progress-xl mb-3 progress-animate custom-progress-4" role="progressbar">
							<div className="progress-bar bg-primary-gradient" style={{ width: "10%" }}></div>
							<div className="progress-bar-label">10%</div>
						</div>
						<div className="progress progress-xl mb-3 progress-animate custom-progress-4 secondary" role="progressbar" >
							<div className="progress-bar bg-secondary-gradient" style={{ width: "20%" }}></div>
							<div className="progress-bar-label">20%</div>
						</div>
						<div className="progress progress-xl mb-3 progress-animate custom-progress-4 success" role="progressbar">
							<div className="progress-bar bg-success-gradient" style={{ width: "40%" }}></div>
							<div className="progress-bar-label">40%</div>
						</div>
						<div className="progress progress-xl mb-3 progress-animate custom-progress-4 info" role="progressbar">
							<div className="progress-bar bg-info-gradient" style={{ width: "60%" }}></div>
							<div className="progress-bar-label">60%</div>
						</div>
						<div className="progress progress-xl mb-3 progress-animate custom-progress-4 warning" role="progressbar">
							<div className="progress-bar bg-warning-gradient" style={{ width: "80%" }}></div>
							<div className="progress-bar-label">80%</div>
						</div>
						<div className="progress progress-xl progress-animate custom-progress-4 danger" role="progressbar">
							<div className="progress-bar bg-danger-gradient" style={{ width: "100%" }}></div>
							<div className="progress-bar-label text-fixed-white">100%</div>
						</div>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Custom Progress-5" customCardClass="custom-card" customCardBodyClass="" reactCode={progress11}>
						<h6 className="fw-semibold mb-2">Project Dependencies</h6>
						<ProgressBar className="progress-stacked progress-xl mb-5" >
							<ProgressBar variant="primary" now={25} label={`${25}%`} key={1} />
							<ProgressBar variant="secondary" now={35} label={`${35}%`} key={2} />
							<ProgressBar variant="danger" now={40} label={`${40}%`} key={3} />
						</ProgressBar>
						<Row className="justify-content-center">
							<Col xl={5}>
								<div className="border p-3">
									<p className="fs-12 fw-semibold mb-0 text-muted">Html<span className="float-end fs-10 fw-normal">25%</span></p>
									<ProgressBar className="progress progress-xs mb-4 progress-animate" variant="primary" now={25} />
									<p className="fs-12 fw-semibold mb-0 text-muted">Css<span className="float-end fs-10 fw-normal">35%</span></p>
									<ProgressBar className="progress progress-xs mb-4 progress-animate" variant="secondary" now={35} />
									<p className="fs-12 fw-semibold mb-0 text-muted">Js<span className="float-end fs-10 fw-normal">40%</span></p>
									<ProgressBar className="progress progress-xs progress-animate" variant="danger" now={40} />
								</div>
							</Col>
						</Row>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-7 --> */}

		</Fragment>
	)
};

export default Progress;