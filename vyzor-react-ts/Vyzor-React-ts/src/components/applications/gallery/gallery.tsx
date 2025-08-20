
import React, { Fragment, useEffect } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { GalleryList } from "../../../shared/data/applications/gallerydata";

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

import media25 from '../../../assets/images/media/media-25.jpg';
import media26 from '../../../assets/images/media/media-26.jpg';
import media27 from '../../../assets/images/media/media-27.jpg';
import media28 from '../../../assets/images/media/media-28.jpg';
import media34 from '../../../assets/images/media/media-34.jpg';
import media35 from '../../../assets/images/media/media-35.jpg';
import media36 from '../../../assets/images/media/media-36.jpg';
import media59 from '../../../assets/images/media/media-59.jpg';
import media60 from '../../../assets/images/media/media-60.jpg';
import media61 from '../../../assets/images/media/media-61.jpg';
import video1mp from '../../../assets/video/1.mp4';

interface GalleryProps { }

const Gallery: React.FC<GalleryProps> = () => {
    useEffect(() => {
        const lightbox = GLightbox({
            selector: '.glightbox1,.glightbox2,.glightbox3'
        });

        // Clean up on unmount
        return () => {
            lightbox.destroy();
        };
    }, []);
    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Applications-Gallery" />

            <Pageheader title="Applications" currentpage="Gallery" activepage="Gallery" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Simple Image Gallery
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <GalleryList />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!--End::row-1 -->

            <!-- Start:: row-2 --> */}

            <div className="row">
                <div className="col-xl-12">
                    <div className="card custom-card">
                        <div className="card-header">
                            <div className="card-title">
                                Images with Description
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row gy-3">
                                {/* Item 1: Inline Description via attribute */}
                                <div className="col-xl-3 col-md-4 col-sm-6">
                                    <a
                                        href={media25}
                                        className="glightbox2"
                                        data-glightbox='title: Description Bottom; description: You can set the position of the description <a href="http://google.com">with a link to Google</a>; descPosition: bottom;'
                                    >
                                        <Image
                                            src={media25}
                                            alt="image"
                                            className="img-fluid rounded"
                                        />
                                    </a>
                                </div>

                                {/* Item 2: External description via selector (.custom-desc1) */}
                                <div className="col-xl-3 col-md-4 col-sm-6">
                                    <a
                                        href={media26}
                                        className="glightbox2"
                                        data-glightbox="title: Description Right; description: .custom-desc1; descPosition: right;"
                                    >
                                        <Image
                                            src={media26}
                                            alt="image"
                                            className="img-fluid rounded"
                                        />
                                    </a>
                                    <div className="glightbox-desc custom-desc1" style={{ display: 'none' }}>
                                        <p>
                                            You can set the position of the description in different ways like
                                            <strong style={{ textDecoration: 'underline' }}>top, bottom, left, or right</strong>
                                        </p>
                                        <p>
                                            <a href="http://google.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                                                Example Google link
                                            </a>
                                            &nbsp;Duis quis ipsum vehicula eros ultrices lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
                                        </p>
                                        <p>
                                            Primis pharetra facilisis lorem quis penatibus ad nulla inceptos, dui per tempor taciti aliquet consequat sodales...
                                        </p>
                                    </div>
                                </div>

                                {/* Item 3: External description via .custom-desc2 */}
                                <div className="col-xl-3 col-md-4 col-sm-6">
                                    <a
                                        href={media27}
                                        className="glightbox2"
                                        data-glightbox="title: Description Left; description: .custom-desc2; descPosition: left;"
                                    >
                                        <Image
                                            src={media27}
                                            alt="image"
                                            className="img-fluid rounded"
                                        />
                                    </a>
                                    <div className="glightbox-desc custom-desc2" style={{ display: 'none' }}>
                                        <p>Set the position of the description to top, bottom, left or right.</p>
                                        <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.</p>
                                    </div>
                                </div>

                                {/* Item 4: Description before the image link */}
                                <div className="col-xl-3 col-md-4 col-sm-6">
                                    <div className="glightbox-desc custom-desc3" style={{ display: 'none' }}>
                                        <p className="mb-0">This description is positioned at the top.</p>
                                    </div>
                                    <a
                                        href={media28}
                                        className="glightbox2"
                                        data-glightbox="title: Description Top; description: .custom-desc3; descPosition: top;"
                                    >
                                        <Image
                                            src={media28}
                                            alt="image"
                                            className="img-fluid rounded"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: row-2 -->

            <!-- Start:: row-3 --> */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card custom-card">
                        <div className="card-header">
                            <div className="card-title">
                                Videos Gallery
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row gy-3">
                                <div className="col-xl-4 col-md-4 col-sm-6 custom-gallery">
                                    <a href="https://vimeo.com/115041822" className="glightbox3">
                                        <Image src={media34} alt="image" className="img-fluid rounded" />
                                    </a>
                                </div>
                                <div className="col-xl-4 col-md-4 col-sm-6 custom-gallery">
                                    <a href="https://www.youtube-nocookie.com/embed/Ga6RYejo6Hk" className="glightbox3">
                                        <Image src={media35} alt="image" className="img-fluid rounded" />
                                    </a>
                                </div>
                                <div className="col-xl-4 col-md-4 col-sm-6">
                                    <a href={video1mp} className="glightbox3">
                                        <Image src={media36} alt="image" className="img-fluid rounded" />
                                    </a>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: row-3 -->*/}

            {/*<!-- Start:: row-4 --> */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card custom-card">
                        <div className="card-header">
                            <div className="card-title">
                                Iframes and Inline Elements
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row gy-3">
                                <div className="col-xl-4 col-md-4 col-sm-6">
                                    <a href="#inlineElement" className="glightbox1" data-glightbox="width: 700; height: auto;">
                                        <Image src={media59} alt="image" className="img-fluid rounded" />
                                    </a>
                                </div>
                                <div className="col-xl-4 col-md-4 col-sm-6">
                                    <a
                                        href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12085.977306439116!2d-73.96648875371474!3d40.77314541916876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258bf08488f6b%3A0x618706a9142daa0d!2sUpper+East+Side%2C+Nueva+York%2C+EE.+UU.!5e0!3m2!1ses-419!2smx!4v1511830027642"
                                        className="glightbox1">
                                        <Image src={media60} alt="image" className="img-fluid rounded" />
                                    </a>
                                </div>
                                <div className="col-xl-4 col-md-4 col-sm-6">
                                    <a href={video1mp} className="glightbox1">
                                        <Image src={media61} alt="image" className="img-fluid rounded" />
                                    </a>
                                </div>

                                {/* Inline content (make sure the ID matches the first item's href) */}
                                <div id="inlineElement" style={{ display: 'none' }}>
                                    <h3>This is inline content</h3>
                                    <p>You can put anything here, even forms or other components.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: row-4 --> */}
        </Fragment>
    )
};

export default Gallery;