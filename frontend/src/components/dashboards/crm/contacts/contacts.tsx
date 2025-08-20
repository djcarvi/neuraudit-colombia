
import React, { Fragment, useRef, useState } from "react";
import { Card, Col, Dropdown, Form, Image, InputGroup, Modal, Offcanvas, Pagination, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { Contactstable, LeadData, SourceData } from "../../../../shared/data/dashboards/crm/contactsdata";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import face2 from '../../../../assets/images/faces/2.jpg';
import face4 from '../../../../assets/images/faces/4.jpg';
import face8 from '../../../../assets/images/faces/8.jpg';
import face9 from '../../../../assets/images/faces/9.jpg';
import face10 from '../../../../assets/images/faces/10.jpg';
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
interface ContactsProps { }

const Contacts: React.FC<ContactsProps> = () => {

    const [startDate, setStartDate] = useState(new Date());
    const fileInputRef: any = useRef(null);
    const [selectedImage, setSelectedImage] = useState(face9);

    const [show, setShow] = useState<{ [key: string]: boolean }>({});
    const handleShow = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: true }));
    };
    const handleClose = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: false }));
    };

    //Delete function
    const [manageContactsData, setmanageContactsData] = useState([...Contactstable]);
    const handleDelete = (idToRemove: number) => {
        const updatedInvoiceData = manageContactsData.filter((item) => item.id !== idToRemove);
        setmanageContactsData(updatedInvoiceData);
    };
    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleImageChange = (e: any) => {

        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            // You can handle the file here, for example, upload it to a server.
            const reader = new FileReader();
            reader.onload = (event: any) => {
                setSelectedImage(event.target?.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    //Datepicker function
    const handleDateChange = (date: any) => {
        if (date) {
            setStartDate(date);
        }
    };
//
const [selectedItems, setSelectedItems] = useState<any>([]);

const handleCheckboxClick = (id:any) => {
    setSelectedItems((prevSelected:any) =>
        prevSelected.includes(id)
            ? prevSelected.filter((item:any) => item !== id)
            : [...prevSelected, id]
    );
};
const handleSelectAll = (e:any) => {
    if (e.target.checked) {
        setSelectedItems(manageContactsData.map((contact) => contact.id));
    } else {
        setSelectedItems([]);
    }
};
    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Contacts" />

            <Pageheader title="Dashboards" subtitle="CRM" currentpage="Contacts" activepage="Contacts" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div className="card-title">
                                Contacts
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <SpkButton Buttonvariant="primary" Customclass="btn" onClickfunc={() => handleShow('modal')} data-bs-toggle="modal" data-bs-target="#create-contact"><i className="ri-add-line me-1 fw-medium align-middle"></i>Create Contact</SpkButton>
                                <SpkButton Buttonvariant="success" Customclass="btn">Export As CSV</SpkButton>
                                <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-light btn-wave waves-effect waves-light no-caret" Toggletext="Sort By" Arrowicon={true}>
                                    <Dropdown.Item >Newest</Dropdown.Item>
                                    <Dropdown.Item >Date Added</Dropdown.Item>
                                    <Dropdown.Item >A - Z</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap contacts-table"  onChange={handleSelectAll} checked={selectedItems.length === manageContactsData.length} showCheckbox={true} Customcheckclass="check-all" header={[{ title: 'Contact Name' }, { title: 'Lead Score' }, { title: 'Email' }, { title: 'Company' }, { title: 'Phone' }, { title: 'Lead Source' }, { title: 'Tags' }, { title: 'Actions' }]} >
                                    {manageContactsData.map((contact) => (
                                        <tr className="crm-contact" key={contact.id}>
                                            <td>
                                            <Form.Check type="checkbox" id="checkboxNoLabel1" value="" aria-label="..."
                                                    onChange={() => handleCheckboxClick(contact.id)}
                                                    checked={selectedItems.includes(contact.id)}
                                                />
                                           
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            <Image src={contact.image} alt={contact.name} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link  data-bs-toggle="offcanvas" onClick={() => handleShow('offcanvas')} to="#!" role="button" aria-controls="offcanvasExample">
                                                            <span className="d-block fw-medium">{contact.name}</span>
                                                        </Link>
                                                        <SpkTooltips tooltipClass="tooltip-primary" title="Last Contacted" placement="top">
                                                        <span className="d-block text-muted fs-11" title="Last Contacted">
                                                            <i className="ri-account-circle-line me-1 fs-13 align-middle"></i>
                                                            {contact.lastContacted}
                                                        </span>
                                                        </SpkTooltips>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{contact.score}</td>
                                            <td>
                                                <span className="d-block mb-1">
                                                    <i className="ri-mail-line me-2 align-middle fs-14 text-muted"></i>
                                                    {contact.email}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image src={contact.companyLogo} alt={contact.company} />
                                                        </span>
                                                    </div>
                                                    <div>{contact.company}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="d-block">
                                                    <i className="ri-phone-line me-2 align-middle fs-14 text-muted"></i>
                                                    {contact.phone}
                                                </span>
                                            </td>
                                            <td>{contact.source}</td>
                                            <td>
                                                <div className="d-flex align-items-center flex-wrap gap-1">
                                                    {contact.tags.map((tag:any, i:any) => (
                                                        <SpkBadge variant="" key={i} Customclass={`bg-${tag.color}`}>
                                                            {tag.label}
                                                        </SpkBadge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-list">
                                                    <Link  onClick={() => handleShow('offcanvas')} to="#!" className="btn btn-sm btn-warning-light btn-icon">
                                                        <i className="ri-eye-line"></i>
                                                    </Link>
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-info-light btn-icon">
                                                        <i className="ri-pencil-line"></i>
                                                    </SpkButton>
                                                    <SpkButton Buttonvariant="" onClickfunc={() => handleDelete(contact.id)} Customclass="btn btn-sm btn-danger-light btn-icon contact-delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="border-top-0">
                            <div className="d-flex align-items-center flex-wrap gap-1">
                                <div>
                                    Showing 10 Entries <i className="bi bi-arrow-right ms-2 fw-medium"></i>
                                </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <Pagination className="mb-0">
                                            <Pagination.Prev disabled>Prev</Pagination.Prev>
                                            <Pagination.Item active>{1}</Pagination.Item>
                                            <Pagination.Item>{2}</Pagination.Item>
                                            <Pagination.Next className="text-primary">Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: Contact Details Offcanvas --> */}

            <Offcanvas placement="end" show={show['offcanvas'] || false} onHide={() => handleClose('offcanvas')} className="offcanvas-end" tabIndex={-1} id="offcanvasExample"
                aria-labelledby="offcanvasExample">
                <Offcanvas.Body className="p-0">
                    <div className="d-sm-flex align-items-top p-4 border-bottom border-block-end-dashed main-profile-cover">
                        <div>
                            <span className="avatar avatar-xxl avatar-rounded online me-3">
                                <Image src={face4} alt="" />
                            </span>
                        </div>
                        <div className="flex-fill main-profile-info">
                            <div className="d-flex align-items-center justify-content-between">
                                <h6 className="fw-medium mb-1">Jane Smith</h6>
                                <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose('offcanvas')}  Customclass="btn-close crm-contact-close-btn p-4" data-bs-dismiss="offcanvas" aria-label="Close"></SpkButton>
                            </div>
                            <p className="mb-1 text-muted op-7">Chief Executive Officer (C.E.O)</p>
                            <p className="fs-12 mb-4 op-5">
                                <span className="me-3"><i className="ri-building-line me-1 align-middle"></i>Georgia</span>
                                <span className="d-inline-flex align-items-center"><i className="ri-map-pin-line me-1 align-middle"></i>Washington D.C</span>
                            </p>
                            <div className="d-flex mb-0">
                                <div className="me-4">
                                    <p className="fw-bold fs-20 text-shadow mb-0">113</p>
                                    <p className="mb-0 fs-11 op-5">Deals</p>
                                </div>
                                <div className="me-4">
                                    <p className="fw-bold fs-20 text-shadow mb-0">$12.2k</p>
                                    <p className="mb-0 fs-11 op-5">Contributions</p>
                                </div>
                                <div className="me-4">
                                    <p className="fw-bold fs-20 text-shadow mb-0">$10.67k</p>
                                    <p className="mb-0 fs-11 op-5">Comitted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-bottom border-block-end-dashed">
                        <div className="mb-0">
                            <p className="fs-15 mb-2 fw-medium">Professional Bio :</p>
                            <p className="text-muted op-8 mb-0">
                                I am <b className="text-default">Jane Smith,</b> here by conclude that,i am the founder and managing director of the prestigeous company name laugh at all and acts as the cheif executieve officer of the company.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 border-bottom border-block-end-dashed">
                        <p className="fs-14 mb-2 me-4 fw-medium">Contact Information :</p>
                        <div className="">
                            <div className="d-flex align-items-center mb-2">
                                <div className="me-2">
                                    <span className="avatar avatar-sm avatar-rounded bg-light text-muted">
                                        <i className="ri-mail-line align-middle fs-14"></i>
                                    </span>
                                </div>
                                <div>
                                    sonyataylor2531@gmail.com
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="me-2">
                                    <span className="avatar avatar-sm avatar-rounded bg-light text-muted">
                                        <i className="ri-phone-line align-middle fs-14"></i>
                                    </span>
                                </div>
                                <div>
                                    +(555) 555-1234
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-0">
                                <div className="me-2">
                                    <span className="avatar avatar-sm avatar-rounded bg-light text-muted">
                                        <i className="ri-map-pin-line align-middle fs-14"></i>
                                    </span>
                                </div>
                                <div>
                                    MIG-1-11, Monroe Street, Georgetown, Washington D.C, USA,20071
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-bottom border-block-end-dashed d-flex align-items-center flex-wrap gap-4">
                        <p className="fs-14 mb-0 fw-medium">Social Networks :</p>
                        <div className="btn-list mb-0">
                            <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-primary-light btn-wave waves-effect waves-light mb-0">
                                <i className="ri-facebook-line fw-medium"></i>
                            </SpkButton>
                            <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-secondary-light btn-wave waves-effect waves-light mb-0">
                                <i className="ri-twitter-x-line fw-medium"></i>
                            </SpkButton>
                            <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-warning-light btn-wave waves-effect waves-light mb-0">
                                <i className="ri-instagram-line fw-medium"></i>
                            </SpkButton>
                            <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-success-light btn-wave waves-effect waves-light mb-0">
                                <i className="ri-github-line fw-medium"></i>
                            </SpkButton>
                            <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-icon btn-danger-light btn-wave waves-effect waves-light mb-0">
                                <i className="ri-youtube-line fw-medium"></i>
                            </SpkButton>
                        </div>
                    </div>
                    <div className="p-4 border-bottom border-block-end-dashed">
                        <p className="fs-14 mb-2 me-4 fw-medium">Tags :</p>
                        <div>
                            <SpkBadge variant="" Customclass="bg-light text-muted m-1">New Lead</SpkBadge>
                            <SpkBadge variant="" Customclass="bg-light text-muted m-1">Others</SpkBadge>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="fs-14 mb-2 fw-medium">Relationship Manager :
                            <Link  className="fs-14 text-primary mb-0 float-end" to="#!"><i className="ri-add-line me-1 align-middle"></i>Add Manager</Link>
                        </p>
                        <div className="avatar-list-stacked">
                            <span className="avatar avatar-rounded">
                                <Image src={face2} alt="img" />
                            </span>
                            <span className="avatar avatar-rounded">
                                <Image src={face8} alt="img" />
                            </span>
                            <span className="avatar avatar-rounded">
                                <Image src={face2} alt="img" />
                            </span>
                            <span className="avatar avatar-rounded">
                                <Image src={face10} alt="img" />
                            </span>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <!-- End:: Contact Details Offcanvas --> */}

            {/* <!-- Start:: Create Contact --> */}

            <Modal centered show={show['modal'] || false} onHide={() => handleClose('modal')} className="modal fade" id="create-contact" tabIndex={-1} aria-hidden="true">
                <Modal.Header className="modal-header">
                    <h6 className="modal-title">Create Contact</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose('modal')} Customclass="btn-close" Buttondismiss="modal" Buttonlabel="Close" />
                </Modal.Header>
                <Modal.Body className="">
                    <Row className="gy-3">
                        <Col xl={12}>
                            <div className="mb-0 text-center">
                                <span className="avatar avatar-xxl avatar-rounded">
                                    <Image width={80} height={80} src={selectedImage || ''} alt="" id="profile-img" />
                                    <SpkBadge variant="primary" Customclass="rounded-pill avatar-badge" Onclickfun={openFileInput}>
                                        <input type="file" name="photo" className="position-absolute w-100 h-100 op-0" id="profile-change" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                        <i className="fe fe-camera"></i>
                                    </SpkBadge>
                                </span>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Form.Label htmlFor="deal-title">Deal Title</Form.Label>
                            <Form.Control type="text" id="deal-title" placeholder="Deal Title" />
                        </Col>
                        <Col xl={6}>
                            <Form.Label htmlFor="contact-lead-score">Lead Score</Form.Label>
                            <Form.Control type="number" id="contact-lead-score" placeholder="Lead Score" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="contact-mail">Email</Form.Label>
                            <Form.Control type="email" id="contact-mail" placeholder="Enter Email" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="contact-phone">Phone No</Form.Label>
                            <Form.Control type="tel" id="contact-phone" pattern="[0-9]*"
                                placeholder="Enter Phone Number" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="company-name">Company Name</Form.Label>
                            <Form.Control type="text" id="company-name" placeholder="Company Name" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label>Lead Source</Form.Label>
                            <SpkSelect name="colors" option={SourceData} mainClass="basic-multi-select"
                                menuplacement='auto' classNameprefix="Select2" defaultvalue={[SourceData[0]]}
                            />
                        </Col>
                        <Col xl={6}>
                            <Form.Label>Last Contacted</Form.Label>
                            <div className="form-group">
                                <InputGroup className="custom-input-group flex-nowrap">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </InputGroup.Text>
                                    <SpkDatepickr className="form-control" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" selected={startDate} onChange={handleDateChange} placeholderText='Choose date and time' showTimeInput />
                                </InputGroup>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Form.Label>Tags</Form.Label>
                            <SpkSelect multi name="colors" option={LeadData} mainClass="basic-multi-select"
                                menuplacement='top' classNameprefix="Select2" placeholder="Select Tag"
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton onClickfunc={() => handleClose('modal')} Buttonvariant='light' Buttontype="button" Customclass=""
                    >Cancel</SpkButton>
                    <SpkButton Buttonvariant='primary' Buttontype="button">Create Contact</SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- End:: Create Contact --> */}

        </Fragment>
    )
};

export default Contacts;