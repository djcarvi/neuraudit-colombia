
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Image, ListGroup, Modal, Offcanvas, Row } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { ActivityLog, FileCategorie, FileCategories, FileData, FileDetails, FileMenuItems, Folders, Options, PeopleList, Series } from "../../../shared/data/applications/filemanagerdata";
import { Link } from "react-router-dom";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import file2 from '../../../assets/images/media/file-manager/2.png';
import blog9 from '../../../assets/images/media/blog/9.jpg';
interface RadicacionFileViewerProps { }

const RadicacionFileViewer: React.FC<RadicacionFileViewerProps> = () => {

    const [show, setShow] = useState<{ [key: string]: boolean }>({});
    const handleShow = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: true }));
    };
    const handleClose = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: false }));
    };

    return (

        <Fragment>

            {/* <!-- Start:: row-1 --> */}

            <Row className="">
                <Col xxl={3} xl={12} className="">
                    <Row>
                        <Col xxl={12} xl={6} className="">
                            <Card className="custom-card">
                                <Card.Body>
                                    <SimpleBar>
                                        <ul className="list-unstyled files-main-nav" id="files-main-nav">
                                            {FileMenuItems.map((item, index) => (
                                                <li key={index} className={`files-type ${item.active ? 'active' : ''}`}>
                                                    <Link to="#!">
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-2">{item.icon}</div>
                                                            <span className="flex-fill text-nowrap">{item.label}</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </SimpleBar>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xxl={12} xl={6} className="">
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="filemanager-upgrade-storage w-100 text-center">
                                        <span className="d-block mb-3 p-4 bg-light rounded file-manager-upgrade-img">
                                            <Image  src={file2} alt="" className="img-fluid" />
                                        </span>
                                        <span className="fs-15 fw-semibold text-default">Upgrade To PRO</span>
                                        <span className="fs-13 fw-medium d-block text-muted mt-2">Unlock Pro for faster transfers, stronger security, and unlimited storage.</ span>
                                        <div className="mt-3 d-grid"> <SpkButton Buttonvariant="primary" Customclass="btn btn-lg">Upgrade Now</SpkButton>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={6} xl={12} className="">
                    <Card className="custom-card overflow-hidden">
                        <Card.Body className="p-0">
                            <div className="file-manager-folders">
                                <div className="d-flex p-3 flex-wrap gap-2 align-items-center justify-content-between border-bottom">
                                    <div className="w-50">
                                        <Form.Control className="" type="text" placeholder="Search Files Here" aria-label="files-search" />
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap justify-content-sm-end">
                                        <SpkButton Buttonvariant="primary" onClickfunc={() => handleShow('modal')} Customclass="btn btn-w-md d-flex align-items-center justify-content-center btn-wave waves-light"
                                            data-bs-toggle="modal" data-bs-target="#create-folder">
                                            <i className="ri-add-circle-line align-middle me-1"></i>Create Folder
                                        </SpkButton>
                                        <Modal centered show={show['modal'] || false} className="fade" id="create-folder" tabIndex={-1} aria-labelledby="create-folder" data-bs-keyboard="false" aria-hidden="true">
                                            <Modal.Header>
                                                <h6 className="modal-title" id="staticBackdropLabel">Create Folder
                                                </h6>
                                                <SpkButton Buttonvariant="" onClickfunc={() => handleClose('modal')} Buttontype="button" Customclass="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></SpkButton>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <label htmlFor="create-folder1" className="form-label">Folder Name</label>
                                                <Form.Control type="text" className="" id="create-folder1" placeholder="Folder Name" />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <SpkButton Buttonvariant="" onClickfunc={() => handleClose('modal')} Buttontype="button" Customclass="btn btn-sm btn-icon btn-light"
                                                    data-bs-dismiss="modal"><i className="ri-close-fill"></i></SpkButton>
                                                <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn btn-sm btn-success">Create</SpkButton>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </div>
                                <div className="p-3 file-folders-container">
                                    <div className="d-flex mb-3 align-items-center justify-content-between">
                                        <p className="mb-0 fw-medium fs-14">Categories</p>
                                        <Link to="#!" className="fs-12 text-muted fw-medium"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <div className="row">
                                        {FileCategories.map((category, index) => (
                                            <Col xxl={4} xl={4} lg={6} md={6} className="" key={index}>
                                                <Card className={`custom-card shadow-none file-category-card ${category.colorClass}`}>
                                                    <Card.Body className="text-center">
                                                        <Link to="#!" className="stretched-link"></Link>
                                                        <div className="d-flex align-items-center gap-2 lh-1 justify-content-end file-icons">
                                                            <div className="file-important">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,189.09l54.72,33.65a8.4,8.4,0,0,0,12.52-9.17l-14.88-62.79,48.7-42A8.46,8.46,0,0,0,224.27,94L160.36,88.8,135.74,29.2a8.36,8.36,0,0,0-15.48,0L95.64,88.8,31.73,94a8.46,8.46,0,0,0-4.79,14.83l48.7,42L60.76,213.57a8.4,8.4,0,0,0,12.52,9.17Z" opacity="0.2"></path><path d="M128,189.09l54.72,33.65a8.4,8.4,0,0,0,12.52-9.17l-14.88-62.79,48.7-42A8.46,8.46,0,0,0,224.27,94L160.36,88.8,135.74,29.2a8.36,8.36,0,0,0-15.48,0L95.64,88.8,31.73,94a8.46,8.46,0,0,0-4.79,14.83l48.7,42L60.76,213.57a8.4,8.4,0,0,0,12.52,9.17Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                                                            </div>
                                                            <SpkDropdown Align="end" Customclass="custom-dropdown dropdown-menu-end" toggleas="a" Togglevariant="" Customtoggleclass="no-caret p-0" Icon={true} IconClass="ri-more-2-fill fw-semibold text-muted">
                                                                <li><Dropdown.Item href="#!">Delete</Dropdown.Item></li>
                                                                <li><Dropdown.Item href="#!">Rename</Dropdown.Item></li>
                                                                <li><Dropdown.Item href="#!">Hide Folder</Dropdown.Item></li>
                                                            </SpkDropdown>
                                                        </div>
                                                        <div className={`mb-2 text-${category.colorClass} svg-${category.colorClass} file-img`}>
                                                            {category.icon}
                                                        </div>
                                                        <h6 className="fw-semibold mb-1">{category.title}</h6>
                                                        <span className="d-block text-muted">{category.fileCount} Files</span>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </div>
                                    <div className="d-flex mb-3 align-items-center justify-content-between">
                                        <p className="mb-0 fw-medium fs-14">Folders</p>
                                        <Link to="#!" className="fs-12 text-muted fw-medium"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <Row>
                                        {Folders.map((folder, index) => (
                                            <Col xxl={4} xl={4} lg={6} md={6} className="" key={index}>
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <Link to="#!" className="stretched-link"></Link>
                                                        <div className="mb-4 folder-svg-container d-flex flex-wrap justify-content-between align-items-start">
                                                            <div className="svg-warning text-warning">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Z"></path></svg>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 lh-1 file-icons">
                                                                {folder.important && (
                                                                    <div className="file-important true">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,189.09l54.72,33.65a8.4,8.4,0,0,0,12.52-9.17l-14.88-62.79,48.7-42A8.46,8.46,0,0,0,224.27,94L160.36,88.8,135.74,29.2a8.36,8.36,0,0,0-15.48,0L95.64,88.8,31.73,94a8.46,8.46,0,0,0-4.79,14.83l48.7,42L60.76,213.57a8.4,8.4,0,0,0,12.52,9.17Z" opacity="0.2"></path><path d="M128,189.09l54.72,33.65a8.4,8.4,0,0,0,12.52-9.17l-14.88-62.79,48.7-42A8.46,8.46,0,0,0,224.27,94L160.36,88.8,135.74,29.2a8.36,8.36,0,0,0-15.48,0L95.64,88.8,31.73,94a8.46,8.46,0,0,0-4.79,14.83l48.7,42L60.76,213.57a8.4,8.4,0,0,0,12.52,9.17Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                                                                    </div>
                                                                )}
                                                                {folder.importants && (
                                                                    <div className="file-important svg">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,189.09l54.72,33.65a8.4,8.4,0,0,0,12.52-9.17l-14.88-62.79,48.7-42A8.46,8.46,0,0,0,224.27,94L160.36,88.8,135.74,29.2a8.36,8.36,0,0,0-15.48,0L95.64,88.8,31.73,94a8.46,8.46,0,0,0-4.79,14.83l48.7,42L60.76,213.57a8.4,8.4,0,0,0,12.52,9.17Z" opacity="0.2"></path><path d="M128,189.09l54.72,33.65a8.4,8.4,0,0,0,12.52-9.17l-14.88-62.79,48.7-42A8.46,8.46,0,0,0,224.27,94L160.36,88.8,135.74,29.2a8.36,8.36,0,0,0-15.48,0L95.64,88.8,31.73,94a8.46,8.46,0,0,0-4.79,14.83l48.7,42L60.76,213.57a8.4,8.4,0,0,0,12.52,9.17Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                                                                    </div>
                                                                )}
                                                                <SpkDropdown toggleas="a" Customclass="custom-dropdown dropdown-menu-end" Togglevariant="" Customtoggleclass="no-caret p-0" Icon={true} IconClass="ri-more-2-fill fw-semibold text-muted">
                                                                    <li><Dropdown.Item href="#!">Delete</Dropdown.Item></li>
                                                                    <li><Dropdown.Item href="#!">Rename</Dropdown.Item></li>
                                                                    <li><Dropdown.Item href="#!">Hide Folder</Dropdown.Item></li>
                                                                </SpkDropdown>
                                                            </div>
                                                        </div>
                                                        <div className="fs-14 fw-medium mb-1 lh-1">{folder.name}</div>
                                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                            <div><span className="text-muted fs-12">{folder.fileCount} Files</span></div>
                                                            <div><span className="text-default fw-medium">{folder.size}</span></div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div className="d-flex mb-3 align-items-center justify-content-between">
                                        <p className="mb-0 fw-medium fs-14">Recent Files</p>
                                        <Link to="#!" className="fs-12 text-muted fw-medium"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <Row>
                                        <Col xl={12}>
                                            <div className="table-responsive border">
                                                <SpkTables tableClass="text-nowrap table-hover" tBodyClass="files-list" header={[{ title: 'File Name' }, { title: 'Category' }, { title: 'Size' }, { title: 'Date Modified' }, { title: 'Action' }]}>
                                                    {FileData.map((file, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="me-0">
                                                                        <span className={`avatar avatar-sm ${file.avatarClass}`}>
                                                                            {file.icon}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <Link to="#!" onClick={() => handleShow('offcanvas')} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                                            {file.fileName}
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <td>{file.fileType}</td>
                                                            <td>{file.fileSize}</td>
                                                            <td>{file.fileDate}</td>
                                                            <td>
                                                                <div className="hstack gap-2 fs-15">
                                                                    <Link to="#!" className="btn btn-icon btn-sm btn-light">
                                                                        <i className="ri-eye-line"></i>
                                                                    </Link>
                                                                    <Link to="#!" className="btn btn-icon btn-sm btn-light">
                                                                        <i className="ri-delete-bin-line"></i>
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </SpkTables>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <div className="p-1 rounded bg-light mb-4">
                                <div className="d-flex align-items-center">
                                    <div id="available-storage">
                                        <Spkapexcharts width={80} height={80} type="radialBar" chartOptions={Options} chartSeries={Series} />
                                    </div>
                                    <div className="flex-fill">
                                        <span className="d-block fw-semibold">Available Storage</span>
                                        <span className="fs-13 text-muted">51Gb of 64Gb</span>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-unstyled files-media-list">
                                {FileCategorie.map((item, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className={`avatar avatar-md avatar-rounded svg-${item.color} bg-${item.color}-transparent`}>
                                                    {item.icon}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <div className="fw-medium">{item.name}</div>
                                                    <div className="text-muted fs-13">{item.size}</div>
                                                </div>
                                                <SpkProgress variant={item.color} mainClass="progress-bar-animated progress-xs" now={58} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Recent Activity
                            </div>
                        </Card.Header>
                        <Card.Body className="">
                            <ul className="list-unstyled file-manager-activity-list">
                                {ActivityLog.map((activity, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="lh-1">
                                                <span className="avatar avatar-md avatar-rounded bg-light text-muted">
                                                    <i className={`ti ${activity.icon} fs-18`}></i>
                                                </span>
                                            </div>
                                            <div className="flex-fill w-75">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span className="fw-semibold">{activity.title}</span>
                                                    <span className="fs-13 text-muted">{activity.time}</span>
                                                </div>
                                                <span className="d-block text-muted fs-13 w-100 text-truncate">
                                                    {activity.description}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start::mail information offcanvas --> */}

            <Offcanvas placement="end" show={show['offcanvas'] || false} onHide={() => handleClose('offcanvas')} className="offcanvas-end" tabIndex={-1} id="offcanvasRight">
                <Offcanvas.Body className="p-0">
                    <div className="selected-file-details">
                        <div className="d-flex p-3 align-items-center justify-content-between border-bottom">
                            <div>
                                <h6 className="fw-medium mb-0">File Details</h6>
                            </div>
                            <div className="d-flex align-items-center">
                                <SpkDropdown Togglevariant="" Customclass="dropdown me-1 ms-auto" Customtoggleclass="btn btn-sm btn-icon btn-primary-light btn-wave waves-light waves-effect waves-light no-caret"
                                    Icon={true} IconClass="ri-more-2-fill">
                                    <li><Dropdown.Item href="#!">Share</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Copy</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Move</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Delete</Dropdown.Item></li>
                                    <li><Dropdown.Item href="#!">Raname</Dropdown.Item></li>
                                </SpkDropdown>
                                <SpkButton Buttonvariant="" onClickfunc={() => handleClose('offcanvas')} Buttontype="button" Customclass="btn btn-sm btn-icon btn-outline-light border" data-bs-dismiss="offcanvas"
                                    aria-label="Close"><i className="ri-close-line"></i></SpkButton>
                            </div>
                        </div>
                        <div className="filemanager-file-details" id="filemanager-file-details">
                            <div className="p-3 text-center border-bottom border-block-end-dashed">
                                <div className="file-details mb-3">
                                    <Image  src={blog9} alt="" />
                                </div>
                                <div>
                                    <p className="mb-0 fw-medium fs-16">IMG-09123878-SPK734.jpeg</p>
                                    <p className="mb-0 text-muted fs-10">422KB | 23,Nov 2025</p>
                                </div>
                            </div>
                            <div className="p-3 border-bottom border-block-end-dashed">
                                <ListGroup>
                                    {FileDetails.map((detail, index) => (
                                        <ListGroup.Item key={index} className="">
                                            <div className="d-flex align-items-start flex-wrap">
                                                <p className="fw-medium mb-0">
                                                    {detail.label} : {" "}
                                                </p> 
                                                <span className="fs-12 text-muted">{detail.value}</span>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                            <div className="p-3 border-bottom border-block-end-dashed">
                                <p className="mb-1 fw-medium fs-14">Downloaded from :</p>
                                <Link  className="text-primary fw-medium text-break" to="https://themeforest.net/user/spruko/portfolio" target="_blank">
                                    <u>https://themeforest.net/user/spruko/portfolio</u>
                                </Link>
                            </div>
                            <div className="p-3">
                                <p className="mb-2 fw-medium fs-14">Shared With :</p>
                                {PeopleList.map((person, index) => (
                                    <Link  key={index} to="#!">
                                        <div className="d-flex align-items-center p-2 mb-1">
                                            <span className="avatar avatar-sm me-2 avatar-rounded">
                                                <Image src={person.avatar} alt={person.name} />
                                            </span>
                                            <span className="fw-medium flex-fill">{person.name}</span>
                                            <SpkBadge variant="" Customclass="bg-success-transparent fw-normal">{person.date}</SpkBadge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <!-- End::mail information offcanvas --> */}

        </Fragment>
    )
};

export default RadicacionFileViewer;