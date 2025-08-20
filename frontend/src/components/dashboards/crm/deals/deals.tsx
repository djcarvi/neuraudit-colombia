
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Card, Col, Dropdown, Form, Image, InputGroup, Modal, Row } from "react-bootstrap";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import { DangerDeals, dealCards, InfoDeal, PinkDeals, PrimaryDeal, SuccessDeal, WarningDeal } from "../../../../shared/data/dashboards/crm/dealsdata";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkDealsCard from "../../../../shared/@spk-reusable-components/dashboards-reusable/crm/spk-dealscard";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import dragula from "dragula";
import face9 from '../../../../assets/images/faces/9.jpg';
interface DealsProps { }

const Deals: React.FC<DealsProps> = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const slideArrow = (selector: any) => document.querySelector(selector)

    const [startDate, setStartDate] = useState();
    const handleDateChange = (date: any) => {
        if (date) {
            setStartDate(date);
        }
    };

    const firstContainerRef = useRef(null);
    const secondContainerRef = useRef(null);
    const thirdContainerRef = useRef(null);
    const fourthContainerRef = useRef(null);
    const fifthContainerRef = useRef(null);
    const sixthContainerRef = useRef(null);

    useEffect(() => {
        if (firstContainerRef.current && secondContainerRef.current) {
            dragula([firstContainerRef.current, secondContainerRef.current, thirdContainerRef.current, fourthContainerRef.current, fifthContainerRef.current, sixthContainerRef.current]);
            if (slideArrow(".firstdrag")?.classList.contains("task-Null")) {
                slideArrow(".view-more-button")?.classList.add("d-none");
            }
        }
    }, []);

    const [selectedImage, setSelectedImage] = useState(face9);
    const fileInputRef: any = useRef(null);
    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleImageChange = (e: any) => {
        const selectedFile = e.target.files && e.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                setSelectedImage(event.target?.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Deals" />

            <Pageheader title="Dashboards" subtitle="CRM" currentpage="Deals" activepage="Deals" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <div className="d-flex align-items-center">
                                    <span className="fw-medium fs-16 me-1">Deals</span>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    <SpkButton Buttonvariant="primary" Customclass="btn" onClickfunc={handleShow} data-bs-toggle="modal" data-bs-target="#create-contact"><i className="ri-add-line me-1 fw-medium align-middle"></i>New Deal</SpkButton>
                                    <SpkButton Buttonvariant="success" Customclass="btn">Export As CSV</SpkButton>
                                    <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-light btn-wave waves-effect waves-light no-caret" Toggletext="Sort By" Arrowicon={true}>
                                        <Dropdown.Item href="#!">Newest</Dropdown.Item>
                                        <Dropdown.Item href="#!">Date Added</Dropdown.Item>
                                        <Dropdown.Item href="#!">A - Z</Dropdown.Item>
                                    </SpkDropdown>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start::row-2 --> */}

            <Row>
                {dealCards.map((deal) => (
                    <Col xxl={2} md={4} className="" key={deal.id}>
                        <Card className="custom-card">
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-top flex-wrap justify-content-between">
                                    <div>
                                        <div className={`fw-medium fs-15 ${deal.labelClass}`}>{deal.label}</div>
                                        <SpkBadge variant="" Customclass="bg-light text-default">{deal.badgeText}</SpkBadge>
                                    </div>
                                    <div>
                                        <span className={`fw-medium ${deal.amountStyle}`}>{deal.amount}</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* <!-- End::row-2 --> */}

            {/* <!-- Start::row-3 --> */}

            <Row>
                <Col xxl={2} id="leads-discovered" ref={firstContainerRef}>
                    {PrimaryDeal.map((idx, index) => (
                        <SpkDealsCard key={index} deal={idx} />
                    ))}
                </Col>
                <Col xxl={2} id="leads-qualified" ref={secondContainerRef}>
                    {WarningDeal.map((idx, index) => (
                        <SpkDealsCard key={index} deal={idx} />
                    ))}
                </Col>
                <Col xxl={2} id="contact-initiated" ref={thirdContainerRef}>
                    {SuccessDeal.map((idx, index) => (
                        <SpkDealsCard key={index} deal={idx} />
                    ))}
                </Col>
                <Col xxl={2} id="needs-identified" ref={fourthContainerRef}>
                    {InfoDeal.map((idx, index) => (
                        <SpkDealsCard key={index} deal={idx} />
                    ))}
                </Col>
                <Col xxl={2} id="negotiation" ref={fifthContainerRef}>
                    {DangerDeals.map((idx, index) => (
                        <SpkDealsCard key={index} deal={idx} />
                    ))}
                </Col>
                <Col xxl={2} id="deal-finalized" ref={sixthContainerRef}>
                    {PinkDeals.map((idx, index) => (
                        <SpkDealsCard key={index} deal={idx} />
                    ))}
                </Col>
            </Row>

            {/* <!-- End::row-3 --> */}

            {/* <!-- Start:: New Deal --> */}

            <Modal show={show} onHide={handleClose} className="fade" id="create-deal" tabIndex={-1} centered>
                <div className="modal-content border-0">
                    <Modal.Header>
                        <h6 className="modal-title">New Deal</h6>
                        <SpkButton Buttonvariant="" Customclass="btn-close" onClickfunc={handleClose} Buttondismiss="modal" Buttonlabel="Close" />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="gy-3">
                            <Col xl={12}>
                                <div className="mb-0 text-center">
                                    <span className="avatar avatar-xxl avatar-rounded">
                                        <Image src={selectedImage || ''} alt="" id="profile-img" />
                                        <SpkBadge variant="" Customclass="rounded-pill bg-primary avatar-badge" Onclickfun={openFileInput}>
                                            <input type="file" name="photo" className="position-absolute w-100 h-100 op-0" id="profile-change" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                            <i className="fe fe-camera"></i>
                                        </SpkBadge>
                                    </span>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <Form.Label htmlFor="deal-name" className="">Contact Name</Form.Label>
                                <Form.Control type="text" className="" id="deal-name" placeholder="Contact Name" />
                            </Col>
                            <Col xl={6}>
                                <Form.Label htmlFor="deal-lead-score" className="">Deal Value</Form.Label>
                                <Form.Control type="number" className="" id="deal-lead-score" placeholder="Deal Value" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="company-name" className="">Company Name</Form.Label>
                                <Form.Control type="text" className="" id="company-name" placeholder="Company Name" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label className="">Last Contacted</Form.Label>
                                <InputGroup className="custom-input-group">
                                    <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                    <SpkDatepickr className="form-control breadcrumb-input border-1  " Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" selected={startDate} onChange={handleDateChange} placeholderText='Choose date and time' showTimeInput />
                                </InputGroup>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <SpkButton Buttonvariant="light" Buttontype="button" onClickfunc={handleClose}
                            Buttondismiss="modal">Cancel</SpkButton>
                        <SpkButton Buttonvariant="primary" Buttontype="button">Create Deal</SpkButton>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* <!-- End:: New Deal --> */}
            
        </Fragment>
    )
};

export default Deals;