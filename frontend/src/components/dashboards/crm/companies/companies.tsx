
import React, { Fragment, useRef, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Modal, Offcanvas, Pagination, Row } from "react-bootstrap";
import { CompaniesTable, Selectdata, Selectdatas } from "../../../../shared/data/dashboards/crm/companiesdata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import comppanyLogo1 from '../../../../assets/images/company-logos/1.png';
import comppanyLogo3 from '../../../../assets/images/company-logos/3.png';
import face2 from '../../../../assets/images/faces/2.jpg';
interface CompaniesProps {}

const Companies:React.FC<CompaniesProps> = () => {

    const [show, setShow] = useState<{ [key: string]: boolean }>({});
    const handleShow = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: true }));
    };
    const handleClose = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: false }));
    };

    const [selectedImage, setSelectedImage] = useState(comppanyLogo3);
    const fileInputRef: any = useRef(null);
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
        setSelectedItems(allData.map((row:any) => row.id));
    } else {
        setSelectedItems([]);
    }
};
//
    const [allData, setAlldata] = useState(CompaniesTable);
    const handleremove = (id: number) => {
        const dataList = allData.filter((row) => row.id !== id);
        setAlldata(dataList)
    }

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-Companies" />

            <Pageheader title="Dashboards" subtitle="CRM" currentpage="Companies" activepage="Companies" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Companies
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <SpkButton Buttonvariant="primary" Customclass="btn btn-wave" onClickfunc={() => handleShow('modal')} data-bs-toggle="modal" data-bs-target="#create-contact"><i className="ri-add-line me-1 fw-medium align-middle"></i>Add Company</SpkButton>
                                <SpkButton Buttonvariant="success" Customclass="btn btn-wave">Export As CSV</SpkButton>
                                <SpkDropdown toggleas="a" Navigate="#!" Customtoggleclass="btn btn-light btn-wave waves-effect waves-light no-caret" Toggletext="Sort By" Arrowicon={true}>
                                    <Dropdown.Item >Newest</Dropdown.Item>
                                    <Dropdown.Item >Date Added</Dropdown.Item>
                                    <Dropdown.Item >A - Z</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap"  onChange={handleSelectAll} checked={selectedItems.length === allData.length} showCheckbox={true} Customcheckclass="check-all" header={[{ title: 'Company Name' }, { title: 'Email' }, { title: 'Phone' }, { title: 'Company Size' }, { title: 'Industry' }, { title: "Key Contact" }, { title: 'Total Deals' }, { title: 'Actions' }]} >
                                    {allData.map((row) => (
                                        <tr className="crm-contact" key={row.id}>
                                            <td>
                                            <Form.Check type="checkbox" id="checkboxNoLabel1" value="" aria-label="..."
                                                    onChange={() => handleCheckboxClick(row.id)}
                                                    checked={selectedItems.includes(row.id)}
                                                />
                                                {/*<input  className="form-check-input" type="checkbox" id={`checkboxNoLabel${row.id}`} value="" aria-label="..." />*/}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-md bg-light avatar-rounded">
                                                            <Image src={row.companyLogo} alt={row.companyName} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link onClick={() => handleShow('offcanvas')} data-bs-toggle="offcanvas" to="#!" role="button" aria-controls="offcanvasExample">
                                                            {row.companyName}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="d-block mb-1">
                                                    <i className="ri-mail-line me-2 align-middle fs-14 text-muted d-inline-block"></i>
                                                    {row.email}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="d-block">
                                                    <i className="ri-phone-line me-2 align-middle fs-14 text-muted d-inline-block"></i>
                                                    {row.phone}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center flex-wrap gap-1">
                                                    <SpkBadge variant="" Customclass={`badge bg-${row.badgeColor}`}>
                                                        {row.employeeBadge}
                                                    </SpkBadge>
                                                </div>
                                            </td>
                                            <td>{row.industry}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            <Image width={28} height={28} src={row.personImage} alt={row.personName} />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="d-block fw-medium">{row.personName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{row.score}</td>
                                            <td>
                                                <div className="btn-list">
                                                    <Link onClick={() => handleShow('offcanvas')} data-bs-toggle="offcanvas" to="#!" role="button" aria-controls="offcanvasExample" className="btn btn-sm btn-warning-light btn-icon">
                                                        <i className="ri-eye-line"></i>
                                                    </Link>
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-sm btn-info-light btn-icon">
                                                        <i className="ri-pencil-line"></i>
                                                    </SpkButton>
                                                    <SpkButton Buttonvariant="" onClickfunc={() => handleremove(row.id)} Customclass="btn btn-sm btn-danger-light btn-icon contact-delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                            <div className="d-flex align-items-center flex-wrap gap-1">
                                <div>
                                    Showing 10 Entries <i className="bi bi-arrow-right ms-2 fw-medium"></i>
                                </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <Pagination className="mb-0">
                                            <Pagination.Prev disabled > Prev </Pagination.Prev>
                                            <Pagination.Item active>{1}</Pagination.Item>
                                            <Pagination.Item>{2}</Pagination.Item>
                                            <Pagination.Next> next</Pagination.Next>
                                        </Pagination>
                                    </nav>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: Company Details Offcanvas --> */}

            <Offcanvas placement="end" className="offcanvas-end" show={show['offcanvas'] || false} onHide={() => handleClose('offcanvas')} tabIndex={-1} id="offcanvasExample"
                aria-labelledby="offcanvasExample">
                <Offcanvas.Body className="p-0">
                    <div className="d-sm-flex align-items-top p-4 border-bottom border-block-end-dashed main-profile-cover">
                        <div>
                            <span className="avatar avatar-xxl avatar-rounded me-3 bg-light p-2">
                                <Image src={comppanyLogo1} alt="" />
                            </span>
                        </div>
                        <div className="flex-fill main-profile-info">
                            <div className="d-flex align-items-center justify-content-between">
                                <h6 className="fw-medium mb-1">Spruko Technologies</h6>
                                <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose('offcanvas')}  Customclass="btn-close invert-1 p-0" data-bs-dismiss="offcanvas" aria-label="Close"></SpkButton>
                            </div>
                            <p className="mb-1 text-muted op-7">Telecommunications</p>
                            <p className="fs-12 mb-4 op-5">
                                <span className="me-3"><i className="ri-building-line me-1 align-middle"></i>Georgia</span>
                                <span className="d-inline-flex align-items-center"><i className="ri-map-pin-line me-1 align-middle"></i>Washington D.C</span>
                            </p>
                            <div className="d-flex mb-0">
                                <div className="me-4">
                                    <p className="fw-medium fs-20 text-shadow mb-0">113</p>
                                    <p className="mb-0 fs-11 op-5">Deals</p>
                                </div>
                                <div className="me-4">
                                    <p className="fw-medium fs-20 text-shadow mb-0">$12.2k</p>
                                    <p className="mb-0 fs-11 op-5">Contributions</p>
                                </div>
                                <div className="me-4">
                                    <p className="fw-medium fs-20 text-shadow mb-0">$10.67k</p>
                                    <p className="mb-0 fs-11 op-5">Comitted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-bottom border-block-end-dashed">
                        <div className="mb-0">
                            <p className="fs-15 mb-2 fw-medium">Professional Bio :</p>
                            <p className="text-muted op-8 mb-0">
                                <b className="text-default">Spruko</b> Technologies is a leading technology company specializing in innovative software solutions for businesses worldwide. With a strong focus on cutting-edge technologies and a team of skilled professionals.
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
                                    spruko2981@gmail.com
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="me-2">
                                    <span className="avatar avatar-sm avatar-rounded bg-light text-muted">
                                        <i className="ri-phone-line align-middle fs-14"></i>
                                    </span>
                                </div>
                                <div>
                                    1678-28993-223
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
                    <div className="p-4 border-bottom border-block-end-dashed d-flex align-items-center gap-3">
                        <div className="fs-14 fw-medium">Company Size:</div>
                        <div>
                            <SpkBadge variant="" Customclass="bg-primary-transparent m-1">Corporate</SpkBadge> - 1001+ Employees
                        </div>
                    </div>
                    <div className="p-4 d-flex align-items-center gap-3">
                        <div className="fs-14 fw-medium">
                            Key Contact :
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="lh-1">
                                <span className="avatar avatar-rounded avatar-sm">
                                    <Image src={face2} alt="img" />
                                </span>
                            </div>
                            <div className="fw-medium">Lisa Convay</div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <!-- End:: Company Details Offcanvas --> */}

            {/* <!-- Start:: Add Company --> */}

            <Modal show={show['modal'] || false} onHide={() => handleClose('modal')} className="fade" id="create-company" tabIndex={-1} centered>
                    <Modal.Header className="">
                        <h6 className="modal-title">Add Company</h6>
                        <SpkButton Buttonvariant="" Customclass="btn-close" onClickfunc={() => handleClose('modal')} Buttondismiss="modal" Buttonlabel="Close" />
                    </Modal.Header>
                    <Modal.Body className="">
                        <Row className="gy-3">
                            <Col xl={12}>
                                <div className="mb-0 text-center">
                                    <span className="avatar avatar-xxl avatar-rounded p-2 bg-light">
                                        <Image width={80} height={80} src={selectedImage || ''} alt="" id="profile-img" />
                                        <SpkBadge Pill={true} variant="primary" Customclass="avatar-badge" Onclickfun={openFileInput}>
                                            <input type="file" name="photo" className="position-absolute w-100 h-100 op-0" id="profile-change" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                            <i className="fe fe-camera"></i>
                                        </SpkBadge>
                                    </span>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <Form.Label htmlFor="company-name">Company Name</Form.Label>
                                <Form.Control type="text" id="company-name" placeholder="Contact Name" />
                            </Col>
                            <Col xl={6}>
                                <Form.Label htmlFor="company-lead-score">Total Deals</Form.Label>
                                <Form.Control type="number" id="company-lead-score" placeholder="Total Deals" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="company-mail">Email</Form.Label>
                                <Form.Control type="email" id="company-mail" placeholder="Enter Email" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="company-phone">Phone No</Form.Label>
                                <Form.Control type="tel" id="company-phone" placeholder="Enter Phone Number" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="key-contact">Key Contact</Form.Label>
                                <Form.Control type="text" id="key-contact" placeholder="Contact Name" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label>Industry</Form.Label>
                                <SpkSelect name="colors" option={Selectdatas} mainClass="basic-multi-select"
                                    menuplacement='top' classNameprefix="Select2" placeholder="Select Industry" />
                            </Col>
                            <Col xl={12}>
                                <Form.Label>Company Size</Form.Label>
                                <SpkSelect name="colors" option={Selectdata} mainClass="basic-multi-select"
                                    menuplacement='top' classNameprefix="Select2" defaultvalue={[Selectdata[0]]} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <SpkButton Buttonvariant="light" Buttontype="button" onClickfunc={() => handleClose('modal')}
                            Buttondismiss="modal">Cancel</SpkButton>
                        <SpkButton Buttonvariant="primary" Buttontype="button">Create Contact</SpkButton>
                    </Modal.Footer>
            </Modal>
            {/* <!-- End:: Add Company --> */}
        </Fragment>
    )
};

export default Companies;