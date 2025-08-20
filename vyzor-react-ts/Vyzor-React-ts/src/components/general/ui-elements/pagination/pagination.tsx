import { pagination1, pagination2, pagination3, pagination4, pagination5, pagination6, pagination7, pagination8, pagination9 } from "../../../../shared/data/prism-code/uielements-prism";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import ShowCode from "../../../../shared/layouts-components/showcode/showcode";
import React, { Fragment } from "react";
import { Col, Pagination, Row } from "react-bootstrap";

interface PaginationsProps { }

const Paginations: React.FC<PaginationsProps> = () => {

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title="Pagination" />

			<Pageheader title="Ui Elements" currentpage="Pagination" activepage="Pagination" />

			{/* <!-- Page Header Close --> */}

			{/* <!-- Start:: row-1 --> */}

			<Row>
				<Col xxl={6} xl={6}>
					<ShowCode title="Basic Pagination" customCardClass="custom-card customclass-pagination" customCardBodyClass="" reactCode={pagination1}>
						<nav aria-label="Page navigation">
							<Pagination className="pagination mb-0">
								<Pagination.Item disabled className="disabled" >Previous</Pagination.Item>
								<Pagination.Item >1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item >Next</Pagination.Item>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
				<Col xxl={6} xl={6}>
					<ShowCode title="Pagination With Icons" customCardClass="custom-card customclass-pagination" customCardBodyClass="" reactCode={pagination2}>
						<nav aria-label="Page navigation">
							<Pagination className="mb-0">
								<Pagination.Item className="disabled"><i className="bx bx-chevron-left"></i></Pagination.Item>
								<Pagination.Item className="">1</Pagination.Item>
								<Pagination.Item className="">2</Pagination.Item>
								<Pagination.Item className="">3</Pagination.Item>
								<Pagination.Item className=""><span aria-hidden="true"><i className="bx bx-chevron-right"></i></span></Pagination.Item>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
				<Col xxl={12} xl={12}>
					<ShowCode title="Pagination Sizing" customCardClass="custom-card" customCardBodyClass="d-sm-flex flex-wrap justify-content-between" reactCode={pagination5}>
						<nav aria-label="...">
							<Pagination className="pagination pagination-sm mb-2 mb-sm-0">
								<Pagination.Item active aria-current="page">1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item >3</Pagination.Item>
							</Pagination>
						</nav>
						<nav aria-label="...">
							<Pagination className="pagination  mb-2 mb-sm-0">
								<Pagination.Item active aria-current="page">1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item >3</Pagination.Item>
							</Pagination>
						</nav>
						<nav aria-label="...">
							<Pagination className="pagination pagination-lg mb-2 mb-sm-0">
								<Pagination.Item className=" active" aria-current="page">1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item >3</Pagination.Item>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-1 --> */}

			{/* <!-- Start:: row-2  --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Center & Right Aligned Pagination" customCardClass="custom-card customclass-pagination" customCardBodyClass="" reactCode={pagination4}>
						<nav aria-label="Page navigation">
							<Pagination className="justify-content-center">
								<Pagination.Item disabled>Previous
								</Pagination.Item>
								<Pagination.Item >1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item >Next
								</Pagination.Item>
							</Pagination>
						</nav>
						<nav aria-label="Page navigation">
							<Pagination className="justify-content-end mb-0">
								<Pagination.Item disabled >Previous
								</Pagination.Item>
								<Pagination.Item >1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item >Next
								</Pagination.Item>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>

					<ShowCode title="Active and disabled states" customCardClass="custom-card customclass-pagination" customCardBodyClass="d-flex flex-wrap" reactCode={pagination3}>
						<nav aria-label="..." className="me-3">
							<Pagination className="pagination">
								<Pagination.Item disabled>Previous
								</Pagination.Item>
								<Pagination.Item >1</Pagination.Item>
								<Pagination.Item active aria-current="page" >2
								</Pagination.Item>
								<Pagination.Item >Next
								</Pagination.Item>
							</Pagination>
						</nav>
						<nav aria-label="...">
							<Pagination className="pagination">
								<Pagination.Item disabled>Previous
								</Pagination.Item>
								<Pagination.Item >1</Pagination.Item>
								<Pagination.Item active aria-current="page">2
								</Pagination.Item>
								<Pagination.Item >Next
								</Pagination.Item>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-2  --> */}

			{/* <!-- Start:: row-3 --> */}

			<Row>
				<Col xl={12}>
					<ShowCode title="Pagination Style-1" customCardClass="custom-card customclass-pagination" customCardBodyClass="" reactCode={pagination6}>
						<nav aria-label="Page navigation" className="pagination-style-1">
							<Pagination className="pagination mb-0">
								<Pagination.Item disabled >
									<i className="ri-arrow-left-s-line align-middle"></i>
								</Pagination.Item>
								<Pagination.Item >1</Pagination.Item>
								<Pagination.Item active >2</Pagination.Item>
								<Pagination.Item ><i className="bi bi-three-dots"></i>
								</Pagination.Item>
								<Pagination.Item >21</Pagination.Item>
								<Pagination.Item >
									<i className="ri-arrow-right-s-line align-middle"></i>
								</Pagination.Item>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Pagination Style-2" customCardClass="custom-card" customCardBodyClass="" reactCode={pagination7}>
						<nav aria-label="Page navigation" className="pagination-style-2">
							<Pagination className="mb-0 flex-wrap">
								<Pagination.Item disabled >Prev</Pagination.Item>
								<Pagination.Item active >1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item ><i className="bi bi-three-dots"></i></Pagination.Item>
								<Pagination.Item >17</Pagination.Item>
								<Pagination.Next linkClassName="text-primary">Next</Pagination.Next>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Pagination Style-3" customCardClass="custom-card" customCardBodyClass="" reactCode={pagination8}>
						<nav aria-label="Page navigation" className="pagination-style-3">
							<Pagination className=" mb-0 flex-wrap">
								<Pagination.Item disabled>Prev</Pagination.Item>
								<Pagination.Item active >1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item ><i className="bi bi-three-dots"></i></Pagination.Item>
								<Pagination.Item >16</Pagination.Item>
								<Pagination.Next linkClassName="text-primary">Next</Pagination.Next>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
				<Col xl={12}>
					<ShowCode title="Pagination Style-4" customCardClass="custom-card" customCardBodyClass="" reactCode={pagination9}>
						<nav aria-label="Page navigation" className="pagination-style-4">
							<Pagination className="mb-0 flex-wrap">
								<Pagination.Item disabled >Prev</Pagination.Item>
								<Pagination.Item active >1</Pagination.Item>
								<Pagination.Item >2</Pagination.Item>
								<Pagination.Item ><i className="bi bi-three-dots"></i></Pagination.Item>
								<Pagination.Item >16</Pagination.Item>
								<Pagination.Item >17</Pagination.Item>
								<Pagination.Next linkClassName="text-primary">Next</Pagination.Next>
							</Pagination>
						</nav>
					</ShowCode>
				</Col>
			</Row>

			{/* <!-- End:: row-3 --> */}

		</Fragment>
	)
};

export default Paginations;