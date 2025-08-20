
import Seo from "../../../shared/layouts-components/seo/seo";
import React, {  Fragment, useState } from "react";
import { Map, Marker, Overlay, Draggable, ZoomControl } from 'pigeon-maps'
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { Card, Col, Image, Row } from "react-bootstrap";
import desktop_logo from "../../../assets/images/brand-logos/desktop-logo.png";
interface PigeonmapsProps { }


const Pigeonmaps: React.FC<PigeonmapsProps> = () => {

    const [center, setCenter] = useState<[number, number]>([50.879, 4.6997])
    const [zoom, setZoom] = useState(11)

    //Marker 
    const [hue, setHue] = useState(0)
    const color = `hsl(${hue % 360}deg 39% 70%)`

    //Draggable
    const [anchor, setAnchor] = useState<[number, number]>([50.879, 4.6997]);


    return (
        <Fragment>

            <Seo title={"Pigeon Maps"} />

            <Pageheader title="Maps" currentpage="Pigeon Maps" activepage="Pigeon Maps" />

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Basic  Map</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="vector-map">
                                <Map height={300} center={center} zoom={zoom} onBoundsChanged={({ center, zoom }) => { setCenter(center); setZoom(zoom) }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Map With Markers</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="marker-map">
                                <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
                                    <Marker width={50} anchor={[50.879, 4.6997]} color={color} onClick={() => setHue(hue + 20)} />
                                    <Marker width={50} anchor={[50.879, 4.6997]} color={color} onClick={() => setHue(hue + 20)}>
                                    </Marker>
                                </Map>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Map With Image Markers</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="marker-image-map">
                                <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
                                    <Overlay anchor={[50.879, 4.6997]} offset={[120, 79]}>
                                        <Image src={desktop_logo }  alt='' />
                                    </Overlay>
                                </Map>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Map With Image Draggable Overlay</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="lines-map">
                                <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
                                    <Draggable offset={[60, 87]} anchor={anchor} onDragEnd={setAnchor}>
                                        <Image src={desktop_logo }  alt="Pigeon!" />
                                    </Draggable>
                                </Map>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">ZoomControl</div>
                        </Card.Header>
                        <Card.Body>
                            <div id="us-map">
                                <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
                                    <ZoomControl />
                                </Map>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    );
};

export default Pigeonmaps;