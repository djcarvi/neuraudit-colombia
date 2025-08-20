
import * as swiperdata from "../../../../shared/data/general/adavanec-ui/swiperjsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Card, Col, Image, Row } from "react-bootstrap";
import SpkSwiperJs from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-swiperjs";
import media25 from '../../../../assets/images/media/media-25.jpg';
import media28 from '../../../../assets/images/media/media-28.jpg';
import media29 from '../../../../assets/images/media/media-29.jpg';
import media30 from '../../../../assets/images/media/media-30.jpg';
import media31 from '../../../../assets/images/media/media-31.jpg';
import media32 from '../../../../assets/images/media/media-32.jpg';
interface SwiperjsProps { }

const SwiperJs: React.FC<SwiperjsProps> = () => {

	const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
	const pagination = {
		clickable: true,
		renderBullet: function (index: number, className: string) {
			return '<span class="' + className + '">' + (index + 1) + '</span>';
		},
	};

	return (

		<Fragment>

			{/* <!-- Page Header --> */}

			<Seo title={"Swiper Js"} />

			<Pageheader title="Advanced Ui" currentpage="Swiper Js" activepage="Swiper Js" />

			{/* <!-- Page Header Close --> */}

			{/* <!-- Start::row-1 --> */}

			<Row>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Basic Swiper
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Basicdata} spaceBetween={30} centeredSlides={true} autoplay={true} className="mySwiper swiper-basic" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Swiper With Navigation
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Navigationdata} spaceBetween={30} centeredSlides={true} navigation={true} autoplay={true} className="mySwiper swiper-navigation" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Swiper with Pagination
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Paginationdata} spaceBetween={30} centeredSlides={true} pagination={{ dynamicBullets: true, clickable: true }} autoplay={true} className="mySwiper" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Dynamic Pagination
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Dynamicdata} spaceBetween={30} centeredSlides={true} pagination={{ dynamicBullets: true, clickable: true }} autoplay={true} className="mySwiper" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Pagination With Progress
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Progressdata} pagination={{ type: 'progressbar' }} navigation={true} autoplay={true} className="mySwiper" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Pagination Fraction
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Fractiondata} pagination={{ type: 'fraction' }} navigation={true} autoplay={true} className="mySwiper pagination-fraction" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Custom Pagination
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Customdata} pagination={pagination} autoplay={true} className="mySwiper swiper custom-pagination" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Scrollbar Swiper
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Scrollbardata} scrollbar={{ hide: true, }} autoplay={true} className="mySwiper swiper scrollbar-swiper" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card custom-v-swiper">
						<Card.Header>
							<Card.Title>
								Vertical Swiper
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Verticaldata} direction={"vertical"} pagination={{ clickable: true }} autoplay={true} className="mySwiper vertical swiper-vertical" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Mouse Wheel Control
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Mousewheeldata} direction={"vertical"} slidesPerView={1} spaceBetween={30} pagination={{ clickable: true }} autoplay={true} className="mySwiper vertical vertical-mouse-control" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Keyboard Control
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Keyboarddata} pagination={{ dynamicBullets: true, clickable: true }} autoplay={true} slidesPerView={1} spaceBetween={30} navigation={true} keyboard={{ enabled: true }} className="mySwiper" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>Nested Swiper</Card.Title>
						</Card.Header>
						<Card.Body>
							<Swiper className="mySwiper swiper-h swiper swiper-horizontal1" spaceBetween={50} pagination={{ clickable: true, }} modules={[Pagination]}>
								<SwiperSlide><Image  src={media30} alt="" /></SwiperSlide>
								<SwiperSlide>
									<Swiper className="mySwiper2 swiper-v swiper vertical swiper-vertical1" direction={"vertical"} spaceBetween={50} pagination={{ clickable: true, }}
										modules={[Pagination]}>
										<SwiperSlide><Image  src={media25} alt="" /></SwiperSlide>
										<SwiperSlide><Image  src={media31} alt="" /></SwiperSlide>
										<SwiperSlide><Image  src={media32} alt="" /></SwiperSlide>
									</Swiper>
								</SwiperSlide>
								<SwiperSlide><Image  src={media28} alt="" /></SwiperSlide>
								<SwiperSlide><Image  src={media29} alt="" /></SwiperSlide>
							</Swiper>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Effect Cube
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Effectcubedata} spaceBetween={30} cubeEffect={{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }} effect={"cube"} navigation={true} pagination={{ dynamicBullets: true, clickable: true }} autoplay={true} className="mySwiper swiper swiper-fade cube-custom" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Effect Fade
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Effectfadedata} effect={"fade"} pagination={{ dynamicBullets: true, clickable: true }} navigation={true} autoplay={true} className="mySwiper swiper-fade" />
						</Card.Body>
					</Card>
				</Col>
				<Col xl={4} lg={6} md={6} sm={12} className="">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Effect Flip
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Effectflipdata} effect={"flip"} grabCursor={true} pagination={{ dynamicBullets: true, clickable: true }} navigation={true} autoplay={true} className="mySwiper" />
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* <!--End::row-1 --> */}

			{/* <!-- Start:: row-2 --> */}

			<Row>
				<div className="col-xl-12">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Effect Coverflow
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Effectcovberflowdata} effect={"coverflow"} grabCursor={true} centeredSlides={false} slidesPerView={4} pagination={{ dynamicBullets: true, clickable: true }} autoplay={true} coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }} className="mySwiper" />
						</Card.Body>
					</Card>
				</div>
			</Row>

			{/* <!-- End:: row-2 --> */}

			{/* <!-- Start:: row-3 --> */}

			<Row>
				<div className="col-xl-12">
					<Card className="custom-card">
						<Card.Header>
							<Card.Title>
								Thumbs Gallery
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<SpkSwiperJs slides={swiperdata.Thumbdata} navigation={true} autoplay={true} thumb={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} className="mySwiper bd-gray-100 product-details-page" />
							<SpkSwiperJs slides={swiperdata.Thumbdata} onswiper={setThumbsSwiper} spaceBetween={10} slidesPerView={4} freemode={true} autoplay={true} watchslide={true} className="swiper-view-details mt-2 swiper-view" />
						</Card.Body>
					</Card>
				</div>
			</Row>

			{/* <!-- End:: row-3 --> */}

		</Fragment>
	)
};

export default SwiperJs;