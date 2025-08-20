
import React, { Fragment } from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Card, Col, Form, Row } from "react-bootstrap";
import { MartketPlaceItems } from "../../../../shared/data/dashboards/nft/marketplacedata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import SpkNftCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/nft/spk-nftcard";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";


registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

interface CreateNftProps { }

const CreateNft: React.FC<CreateNftProps> = () => {

    const CreatNft = MartketPlaceItems.filter(items => [1].includes(items.id));

    const SelectType = [
        { value: 'Choose Royalities', label: 'Choose Royalities' },
        { value: 'Flat Royalty', label: 'Flat Royalty' },
        { value: 'Graduated Royalty', label: 'Graduated Royalty' },
        { value: 'Tiered Royalty', label: 'Tiered Royalty' },
        { value: 'Time-Limited Royalty', label: 'Time-Limited Royalty' },
        { value: 'Customized Royalty', label: 'Customized Royalty' },
    ];
    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Jobs-Create NFT" />

            <Pageheader title="Dashboards" subtitle="NFT" currentpage="Create NFT" activepage="Create NFT" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={9}  className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Create NFT</div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3 justify-content-between">
                                <Col xxl={3} xl={12} className="">
                                    <div className="create-nft-item nft-filepond">
                                        <Form.Label className="form-label">Upload NFT</Form.Label>
                                        <FilePond className="filepond" labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                                            stylePanelLayout='compact circle' styleLoadIndicatorPosition='center bottom'
                                            styleButtonRemoveItemPosition='center bottom' />
                                    </div>
                                </Col>
                                <Col xxl={7} xl={12} className="">
                                    <Row className="gy-3">
                                        <Col xl={12}>
                                            <Form.Label htmlFor="input-placeholder" className="">NFT Title</Form.Label>
                                            <Form.Control type="text" className="" id="input-placeholder" placeholder="eg:Neo-Nebulae" />
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Label htmlFor="nft-description" className="">NFT Description</Form.Label>
                                            <Form.Control as="textarea" className="" id="nft-description" rows={3} placeholder="Enter Description" />
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Label htmlFor="nft-link" className="">External Link</Form.Label>
                                            <Form.Control type="text" className="" id="nft-link" placeholder="External Link Here" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={12}>
                                    <div className="row gy-3">
                                        <Col xl={6}>
                                            <Form.Label htmlFor="nft-creator-name" className="">Creator Name</Form.Label>
                                            <Form.Control type="text" className="" id="nft-creator-name" placeholder="Enter Name" />
                                        </Col>
                                        <Col xl={6}>
                                            <Form.Label htmlFor="nft-price" className="">NFT Price</Form.Label>
                                            <Form.Control type="text" className="" id="nft-price" placeholder="Enter Price" />
                                        </Col>
                                        <Col xl={4}>
                                            <Form.Label htmlFor="nft-size" className="">NFT Size</Form.Label>
                                            <Form.Control type="text" className="" id="nft-size" placeholder="Enter Size" />
                                        </Col>
                                        <Col xl={4}>
                                            <Form.Label htmlFor="nft-royality" className="">Royality</Form.Label>
                                            <SpkSelect option={SelectType} classNameprefix='Select2' menuplacement='auto' mainClass="multi-select custom-nft"
                                                placeholder="Choose Royalities" />
                                        </Col>
                                        <Col xl={4}>
                                            <Form.Label htmlFor="nft-property" className="">Property</Form.Label>
                                            <Form.Control type="text" className="" id="nft-property" placeholder="Enter Property" />
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Label className="form-label d-block">Method</Form.Label>
                                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                <input type="radio" className="btn-check" name="strap-material" id="strap1" defaultChecked />
                                                <label className="btn btn-sm btn-outline-primary text-default z-0" htmlFor="strap1"><i className="ti ti-tag me-1 align-middle fs-15 d-inline-block"></i>Fixed Price</label>
                                                <input type="radio" className="btn-check" name="strap-material" id="strap2" />
                                                <label className="btn btn-sm btn-outline-primary text-default z-0" htmlFor="strap2"><i className="ti ti-users fs-15 me-1 align-middle d-inline-block"></i>Open For Bids</label>
                                                <input type="radio" className="btn-check" name="strap-material" id="strap3" />
                                                <label className="btn btn-sm btn-outline-primary text-default z-0" htmlFor="strap3"><i className="ti ti-hourglass-low fs-15 me-1 align-middle d-inline-block"></i>Timed Auction</label>
                                            </div>
                                        </Col>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <div className="card-footer text-end">
                            <Link to="#!" className="btn btn-primary btn-wave waves-effect waves-light">Create NFT</Link>
                        </div>
                    </Card>
                </Col>
                <Col xxl={3}  className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                NFT Preview Here
                            </div>
                        </Card.Header>
                        <Card.Body className="pb-0">
                            {CreatNft.map((nft, index) => (
                                <SpkNftCard key={nft.id || index} nft={nft} />
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --></div> */}

        </Fragment>
    )
};

export default CreateNft;