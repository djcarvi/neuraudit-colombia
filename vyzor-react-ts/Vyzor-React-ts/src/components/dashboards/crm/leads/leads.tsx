
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Modal, Pagination, Row } from "react-bootstrap";
import { Leadsdata, LeadsSelect, StatusSelect, Tagselect } from "../../../../shared/data/dashboards/crm/leadsdata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import face9 from '../../../../assets/images/faces/9.jpg';

interface LeadsProps { }

const Leads: React.FC<LeadsProps> = () => {

    const [leadsloopData, setLeadsloopData] = useState(Leadsdata);

    const handleDelete = (id: string) => {
        const updatedData = leadsloopData.filter((idx) => idx.id !== id);
        setLeadsloopData(updatedData);

    };

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    //image upload
    const [images1, setImages1] = useState<any>([]);
    const [selectedImage1, setSelectedImage1] = useState(null);

    const handleFileChange1 = (e: { target: { files: any[]; }; }) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setSelectedImage1(reader.result);
            };
            reader.readAsDataURL(file);
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
        setSelectedItems(leadsloopData.map((contact) => contact.id));
    } else {
        setSelectedItems([]);
    }
};
    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Leads" />

            <Pageheader title="Dashboards" subtitle="CRM" currentpage="Leads" activepage="Leads" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div className="card-title">
                                Leads
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <SpkButton Buttonvariant="primary" Customclass="btn" onClickfunc={handleShow}><i className="ri-add-line me-1 fw-medium align-middle"></i>Create Lead</SpkButton>
                                <SpkButton Buttonvariant="success" Customclass="btn">Export As CSV</SpkButton>
                                <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-light btn-wave waves-effect waves-light no-caret" Toggletext="Sort By" Arrowicon={true}>
                                    <Dropdown.Item href="#!">Newest</Dropdown.Item>
                                    <Dropdown.Item href="#!">Date Added</Dropdown.Item>
                                    <Dropdown.Item href="#!">A - Z</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap leads-table" onChange={handleSelectAll} checked={selectedItems.length === leadsloopData.length} showCheckbox={true}  Customcheckclass="check-all" header={[{ title: 'Contact Name' }, { title: "Email" }, { title: 'Phone' }, { title: 'Lead Status' }, { title: 'Company' }, { title: 'Lead Score' }, { title: 'Tags' }, { title: 'Actions' }]} >
                                    {leadsloopData.map(contact => (
                                        <tr key={contact.id} className="crm-contact">
                                            <td>
                                            <Form.Check type="checkbox" id="checkboxNoLabel1" value="" aria-label="..."
                                                    onChange={() => handleCheckboxClick(contact.id)}
                                                    checked={selectedItems.includes(contact.id)}
                                                />
                                                {/*<input className="form-check-input" type="checkbox" id={`checkboxNoLabel${contact.id}`} value="" aria-label="..." />*/}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            <Image src={contact.avatar} alt={contact.name} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="d-block fw-medium">{contact.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="d-block mb-1">
                                                        <i className="ri-mail-line me-2 align-middle fs-14 text-muted d-inline-block"></i>
                                                        {contact.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="d-block">
                                                        <i className="ri-phone-line me-2 align-middle fs-14 text-muted"></i>
                                                        {contact.phone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <SpkBadge variant="" Customclass="badge bg-light text-default">{contact.status}</SpkBadge>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image src={contact.companyLogo} alt={contact.companyName} />
                                                        </span>
                                                    </div>
                                                    <div>{contact.companyName}</div>
                                                </div>
                                            </td>
                                            <td>{contact.source}</td>
                                            <td>
                                                <div className="d-flex align-items-center flex-wrap gap-1">
                                                    {contact.tags.map((tag, i) => (
                                                        <SpkBadge variant="" key={i} Customclass={`badge bg-${tag.color}`}>
                                                            {tag.label}
                                                        </SpkBadge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-list">
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-warning-light btn-icon">
                                                        <i className="ri-eye-line"></i>
                                                    </SpkButton>
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-info-light btn-icon">
                                                        <i className="ri-pencil-line"></i>
                                                    </SpkButton>
                                                    <SpkButton onClickfunc={() => handleDelete(contact.id)} Buttonvariant="" Customclass="btn btn-sm btn-danger-light btn-icon contact-delete">
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
                            <div className="d-flex align-items-center flex-wrap">
                                <div>
                                    Showing 10 Entries <i className="bi bi-arrow-right ms-2 fw-medium"></i>
                                </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <Pagination className="mb-0">
                                            <Pagination.Prev disabled> Prev</Pagination.Prev>
                                            <Pagination.Item active>1</Pagination.Item>
                                            <Pagination.Item>2</Pagination.Item>
                                            <Pagination.Next className="text-primary"> Next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: Create Contact --> */}

            <Modal className="fade" centered id="create-contact" tabIndex={-1} show={show} onHide={handleClose}>
                <Modal.Header>
                    <h6 className="modal-title">Create Lead</h6>
                    <SpkButton Buttontype="button" Buttonvariant="" onClickfunc={handleClose} Customclass="btn-close" Buttondismiss="modal" Buttonlabel="Close" />
                </Modal.Header>
                <Modal.Body>
                    <Row className="gy-3">
                        <Col xl={12}>
                            <div className="mb-0 text-center">
                                <span className="avatar avatar-xxl avatar-rounded">
                                    <Image width={80} height={80} src={selectedImage1 || face9} alt="" id="profile-img" />
                                    <SpkBadge variant="primary" Customclass="rounded-pill avatar-badge">
                                        <Form.Control onChange={(e: any) => {
                                            handleFileChange1(e);
                                            setImages1([...images1, e.target.files[0]]);
                                        }} type="file" name="photo" className="position-absolute w-100 h-100 op-0" id="profile-change" />
                                        <i className="fe fe-camera"></i>
                                    </SpkBadge>
                                </span>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="contact-name" className="">Contact Name</Form.Label>
                            <Form.Control type="text" className="" id="contact-name" placeholder="Contact Name" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="contact-mail" className="">Email</Form.Label>
                            <Form.Control type="email" className="" id="contact-mail" placeholder="Enter Email" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="contact-phone" className="">Phone No</Form.Label>
                            <Form.Control type="tel" className="" id="contact-phone" placeholder="Enter Phone Number" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label htmlFor="company-name" className="">Company Name</Form.Label>
                            <Form.Control type="text" className="" id="company-name" placeholder="Company Name" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label className="">Lead Status</Form.Label>
                            <SpkSelect name="colors" option={StatusSelect} placeholder="Select Status" menuplacement='auto' classNameprefix="Select2" />
                        </Col>
                        <Col xl={12}>
                            <Form.Label className="">Lead Source</Form.Label>
                            <SpkSelect name="colors" option={LeadsSelect} menuplacement='auto' classNameprefix="Select2" defaultvalue={[LeadsSelect[0]]} />
                        </Col>
                        <Col xl={12}>
                            <Form.Label className="">Tags</Form.Label>
                            <SpkSelect multi name="colors" option={Tagselect} menuplacement='auto' classNameprefix="Select2" placeholder="Select Tag" />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" Buttontype="button" Customclass="m-0 me-2" onClickfunc={handleClose}
                        Buttondismiss="modal">Cancel</SpkButton>
                    <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="m-0 ">Create Contact</SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- End:: Create Contact --> */}

        </Fragment>
    )
};

export default Leads;