
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Dropdown, Form, Image, Modal, Offcanvas, Row } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { MailMenuItems, Mailstable, RecipientOptions, TagItems } from "../../../../shared/data/applications/email/mailappdata";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkProgress from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkSunEditor from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-suneditor";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import face6 from '../../../../assets/images/faces/6.jpg';
import media43 from '../../../../assets/images/media/media-43.jpg';
import media44 from '../../../../assets/images/media/media-44.jpg';
interface MailAppProps {}

const MailApp:React.FC<MailAppProps> = () => {

    const [show, setShow] = useState<{ [key: string]: boolean }>({});
    const handleShow = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: true }));
    };
    const handleClose = (offcanvasName: string) => {
        setShow((prevShow) => ({ ...prevShow, [offcanvasName]: false }));
    };

    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleVisibility = () => {
        if (isMobile) {
            setIsVisible((prev) => !prev);
        }
       
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [allMailstable, _setAllData] = useState(Mailstable)
const [selectedTasks, setSelectedTasks] = useState(
    Mailstable.map((_, index) => index === 1)
    );
    const handleCheckboxChange = (index: number) => {
        const updatedSelectedTasks = [...selectedTasks];
        updatedSelectedTasks[index] = !updatedSelectedTasks[index];
        setSelectedTasks(updatedSelectedTasks);
    };
    const handleSelectAll = () => {
        const areAllSelected = selectedTasks.every((selected) => selected);
        setSelectedTasks(Mailstable.map(() => !areAllSelected));
    };
    
    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Email-Mail App" />

            <Pageheader title="Applications" subtitle="Email" currentpage="Mail App" activepage="Mail App" />

            {/* <!-- Page Header Close --> */}

            <div className="main-mail-container mb-3 gap-2 d-flex">
                <div className="mail-navigation border"  style={{ display: isMobile ? (isVisible ? 'block' : 'none') : 'block', }}>
                    <div className="d-grid align-items-top p-3 pb-0">
                        <SpkButton Buttonvariant="primary" Customclass="btn d-flex align-items-center justify-content-center" onClickfunc={() => handleShow('modal')} data-bs-toggle="modal"
                            data-bs-target="#mail-Compose">
                            <i className="ri-add-circle-line fs-16 align-middle me-1"></i>New Mail
                        </SpkButton>
                    </div>
                    <SimpleBar>
                        <ul className="list-unstyled mail-main-nav" id="mail-main-nav" onClick={toggleVisibility}>
                            <li className="px-0 pt-0">
                                <span className="fs-11 text-muted op-7 fw-medium">MAILS</span>
                            </li>
                            {MailMenuItems.map((item, idx) => (
                                <li key={idx} className={`mail-type ${item.isActive ? "active" : ""}`}>
                                    <Link to="#!">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="lh-1">
                                                <span className="mail-menu-icon">{item.icon}</span>
                                            </div>
                                            <span className="flex-fill text-nowrap">{item.label}</span>
                                            {item.count && (
                                                <SpkBadge variant="" Customclass="bg-primary">{item.count}</SpkBadge>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            <li className="px-0">
                                <span className="fs-11 text-muted op-7 fw-medium">SETTINGS</span>
                            </li>
                            <li>
                                <Link to="#!">
                                    <div className="d-flex gap-2 align-items-center">
                                        <div className="lh-1">
                                            <span className="mail-menu-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" opacity="0.2" /><circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M130.05,206.11c-1.34,0-2.69,0-4,0L94,224a104.61,104.61,0,0,1-34.11-19.2l-.12-36c-.71-1.12-1.38-2.25-2-3.41L25.9,147.24a99.15,99.15,0,0,1,0-38.46l31.84-18.1c.65-1.15,1.32-2.29,2-3.41l.16-36A104.58,104.58,0,0,1,94,32l32,17.89c1.34,0,2.69,0,4,0L162,32a104.61,104.61,0,0,1,34.11,19.2l.12,36c.71,1.12,1.38,2.25,2,3.41l31.85,18.14a99.15,99.15,0,0,1,0,38.46l-31.84,18.1c-.65,1.15-1.32,2.29-2,3.41l-.16,36A104.58,104.58,0,0,1,162,224Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                            </span>
                                        </div>
                                        <span className="flex-fill text-nowrap">
                                            Settings
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            <li className="px-0">
                                <span className="fs-11 text-muted op-7 fw-medium">LABELS</span>
                            </li>
                            {TagItems.map((item, idx) => (
                                <li key={idx}>
                                    <Link to="#!">
                                        <div className="d-flex align-items-center">
                                            <span className="me-2 lh-1">
                                                <i className={`ri-circle-line align-middle fs-10 fw-semibold ${item.colorClass}`}></i>
                                            </span>
                                            <span className="flex-fill text-nowrap">{item.label}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <div className="mb-2 fs-12">
                                    <Link to="#!">
                                        40Gb of 50Gb used
                                    </Link>
                                </div>
                                <SpkProgress variant="primary" mainClass="progress-xs" animated now={50} />
                            </li>
                        </ul>
                    </SimpleBar>
                </div>
                <div className="total-mails border" style={{ display: isMobile ? (isVisible ? 'none' : 'block') : 'block', }}>
                    <div className="total-mails-header d-flex align-items-center border-bottom flex-wrap gap-2">
                        <div>
                            <input className="form-check-input" type="checkbox" id="checkAll" checked={selectedTasks.every((selected) => selected)} onChange={handleSelectAll} aria-label="..." />
                        </div>
                        <div className="flex-fill d-flex align-items-center gap-3 flex-wrap">
                            <h6 className="fw-medium mb-0">All Mails</h6>
                            <div className="d-flex">
                                <div className="btn-list">
                                    <SpkTooltips placement="top" title="Reload">
                                        <SpkButton Size="sm" Buttonvariant="light" Customclass="btn btn-icon">
                                            <i className="ti ti-refresh"></i>
                                        </SpkButton>
                                    </SpkTooltips>
                                    <SpkTooltips placement="top" title="Archive">
                                        <SpkButton Size="sm" Buttonvariant="light" Customclass="btn btn-icon">
                                            <i className="ti ti-archive"></i>
                                        </SpkButton>
                                    </SpkTooltips>
                                    <SpkTooltips placement="top" title="Delete">
                                        <SpkButton Size="sm" Buttonvariant="light" Customclass="btn btn-icon">
                                            <i className="ti ti-trash"></i>
                                        </SpkButton>
                                    </SpkTooltips>
                                    <SpkTooltips placement="top" title="Report Spam">
                                        <SpkButton Size="sm" Buttonvariant="light" Customclass="btn btn-icon">
                                            <i className="ti ti-alert-circle"></i>
                                        </SpkButton>
                                    </SpkTooltips>
                                </div>
                                <SpkDropdown Togglevariant='' Toggletext="" Customtoggleclass="btn btn-icon btn-light btn-sm no-caret" Id="navbarScrollingDropdown" Icon={true} IconClass="ti ti-dots-vertical" Menulabel="navbarScrollingDropdown">
                                    <Dropdown.Item as="li" className="dropdown-item">Recent</Dropdown.Item>
                                    <Dropdown.Item as="li" className="dropdown-item">Unread</Dropdown.Item>
                                    <Dropdown.Item as="li" className="dropdown-item">Mark All Read</Dropdown.Item>
                                    <Dropdown.Item as="li" className="dropdown-item">Spam</Dropdown.Item>
                                    <Dropdown.Item as="li" className="dropdown-item">Delete All</Dropdown.Item>
                                </SpkDropdown>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <div className="input-group">
                                <Form.Control type="text" className="shadow-none" placeholder="Search Email" aria-describedby="button-addon" />
                                <SpkButton Buttonvariant="primary" Customclass="btn" Buttontype="button"><i className="ri-search-line"></i></SpkButton>
                            </div>
                            <SpkButton Buttonvariant="light" Customclass="btn btn-icon d-lg-none d-block total-mails-close" onClickfunc={toggleVisibility}>
                                <i className="ri-close-line"></i>
                            </SpkButton>
                        </div>
                    </div>
                    <SimpleBar className="mail-messages" id="mail-messages">
                        <div className="table-responsive mail-messages-container">
                            <SpkTables tableClass="text-nowrap table-borderless table-hover">
                                {allMailstable.map((mail,index) => (
                                    <tr key={mail.id} className={mail.checked ? "mail-selected" : ""} >
                                        <td>
                                            <input className="form-check-input mail-check-input" type="checkbox" id={mail.id} checked={selectedTasks[index]} onChange={() => handleCheckboxChange(index)} aria-label="..." />
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-4">
                                                <SpkTooltips placement="top" title="Star">
                                                    <Link  className={`mail-starred ${mail.starred ? "true" : ""}`} to="#!">
                                                        <i className="ti ti-star-filled"></i>
                                                    </Link>
                                                </SpkTooltips>
                                                <SpkTooltips placement="top" title="Mark As Important">
                                                    <Link  className={`mail-important ${mail.important ? "true" : ""}`} to="#!">
                                                        <i className="ti ti-bookmark"></i>
                                                    </Link>
                                                </SpkTooltips>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2 mail-user-container" onClick={() => handleShow('offcanvas')} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                <div className="lh-1">
                                                    <span className="avatar avatar-sm avatar-rounded mail-msg-avatar">
                                                        <Image width={28} height={28} src={mail.senderAvatar} alt={mail.senderName} />
                                                    </span>
                                                </div>
                                                <div>{mail.senderName}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mail-msg" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                <span className="d-block mb-0 fw-medium text-truncate w-75">
                                                    {mail.subject}
                                                    {mail.badge && (
                                                        <SpkBadge variant="" Customclass={`ms-2 ${mail.badge.className}`}>
                                                            {mail.badge.text}
                                                        </SpkBadge>
                                                    )}
                                                </span>
                                                <div className="text-muted text-wrap text-truncate mail-msg-content">
                                                    {mail.content}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="mail-received-time">{mail.time}</span>
                                        </td>
                                    </tr>
                                ))}
                            </SpkTables>
                        </div>
                    </SimpleBar>
                </div>
            </div>

            {/* // < !--End:: app - content-- > */}

            {/* // < !--Start::mail information offcanvas-- > */}

            <Offcanvas show={show['offcanvas'] || false} onHide={() => handleClose('offcanvas')} placement="end" className="mail-info-offcanvas pb-3" tabIndex={-1} id="offcanvasRight">
                <Offcanvas.Body className="p-0">
                    <div className="mails-information">
                        <div className="mail-info-header d-flex flex-wrap gap-2 align-items-center">
                            <div className="flex-fill d-flex gap-1">
                                <SpkTooltips title={"Print"} placement="bottom">
                                    <SpkButton Buttonvariant="light" Customclass="btn btn-icon">
                                        <i className="ri-printer-line"></i>
                                    </SpkButton>
                                </SpkTooltips>
                                <SpkTooltips title={"Mark as read"} placement="bottom">
                                    <SpkButton Buttonvariant="light" Customclass="btn btn-icon ms-1">
                                        <i className="ri-mail-open-line"></i>
                                    </SpkButton>
                                </SpkTooltips>
                                <SpkTooltips title={"Reload"} placement="bottom">
                                    <SpkButton Buttonvariant="light" Customclass="btn btn-icon ms-1">
                                        <i className="ri-refresh-line"></i>
                                    </SpkButton>
                                </SpkTooltips>
                            </div>
                            <SpkButton Buttontype="button" Buttonvariant="" onClickfunc={() => handleClose('offcanvas')} Customclass="btn-close btn btn-sm btn-icon border" data-bs-dismiss="offcanvas"
                                aria-label="Close"></SpkButton>
                        </div>
                        <div className="mail-info-body p-4" id="mail-info-body">
                            <div className="d-sm-flex d-block align-items-center justify-content-between mb-4">
                                <div>
                                    <p className="fs-20 fw-medium mb-0">Invoice #45678 – Payment Due Soon</p>
                                </div>
                                <div className="float-end">
                                    <span className="fs-13 fw-medium text-muted">Feb 22 2025,03:05PM</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="me-1">
                                    <span className="avatar avatar-md me-2 avatar-rounded mail-msg-avatar">
                                        <Image src={face6} alt="" />
                                    </span>
                                </div>
                                <div className="flex-fill">
                                    <h6 className="mb-0 fw-medium">Sarah Smith</h6>
                                    <span className="text-muted fs-12">to:me</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 fs-14">
                                    <SpkTooltips title={"Starred"} placement="top">
                                        <Link to="#!" className="text-muted">
                                            <i className="ri-star-line"></i>
                                        </Link>
                                    </SpkTooltips>
                                    <SpkTooltips title={"Archive"} placement="top">
                                        <Link to="#!" className="text-muted ms-1">
                                            <i className="ri-inbox-archive-line"></i>
                                        </Link>
                                    </SpkTooltips>
                                    <SpkTooltips title={"Report spam"} placement="top">
                                        <Link to="#!" className="text-muted ms-1">
                                            <i className="ri-spam-2-line"></i>
                                        </Link>
                                    </SpkTooltips>
                                    <SpkTooltips title={"Delete"} placement="top">
                                        <Link to="#!" className="text-muted ms-1">
                                            <i className="ri-delete-bin-line"></i>
                                        </Link>
                                    </SpkTooltips>
                                    <SpkTooltips title={"Reply"} placement="top">
                                        <Link to="#!" className="text-muted ms-1">
                                            <i className="ri-reply-line"></i>
                                        </Link>
                                    </SpkTooltips>
                                </div>
                            </div>
                            <div className="main-mail-content mb-4">
                                <p className="text-muted mb-2">Dear Sarah</p>
                                <p className="mb-2 text-muted">Thank you for your prompt attention to this matter. As we approach the end of the month, please ensure that the payment is made by the 28th to avoid any late fees. You can find the invoice attached to this email. If you require any further clarification or need assistance with the payment process, don't hesitate to reach out.</p>
                                <p className="mb-2 text-muted">Looking forward to your confirmation.</p>
                                <p className="mb-0 mt-4">
                                    <span className="d-block fs-13 text-muted">Best Regards,</span>
                                    <span className="d-block">Finance Team</span>
                                </p>
                            </div>
                            <div className="mail-attachments mb-4">
                                <Row>
                                    <Col xl={3}>
                                        <Card className="custom-card">
                                            <Image  src={media43} className="card-img-top" alt="..." />
                                            <Card.Body className="p-2 text-center">
                                                <Link to="#!" className="text-decoration-underline">Download <i className="ti ti-download"></i></Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xl={3}>
                                        <Card className="custom-card">
                                            <Image  src={media44} className="card-img-top" alt="..." />
                                            <Card.Body className="p-2 text-center">
                                                <Link to="#!" className="text-decoration-underline">Download <i className="ti ti-download"></i></Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                            <div className="mail-reply">
                                <div id="mail-reply-editor">
                                    <SpkSunEditor />
                                </div>
                                <div className="mail-info-footer">
                                    <div className="float-end">
                                        <SpkButton Buttonvariant="primary" Customclass="btn">
                                            <i className="ri-share-forward-line me-1 d-inline-block align-middle"></i>Forward
                                        </SpkButton>
                                        <SpkButton Buttonvariant="danger" Customclass="btn ms-1">
                                            <i className="ri-reply-all-line me-1 d-inline-block align-middle"></i>Reply
                                        </SpkButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <!--End::mail information offcanvas-- > */}

            {/* < !--Start::compose mail modal-- > */}

            <Modal size="lg" show={show['modal'] || false} onHide={() => handleClose('modal')} className="fade" id="mail-Compose" tabIndex={-1} aria-labelledby="mail-ComposeLabel" aria-hidden="true">
                <Modal.Header>
                    <h6 className="modal-title" id="mail-ComposeLabel">Compose Mail</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose('modal')} Customclass="btn-close"></SpkButton>
                </Modal.Header>
                <Modal.Body className="px-4">
                    <div className="row">
                        <Col xl={6} className="mb-2">
                            <label htmlFor="fromMail" className="form-label">From<sup><i className="ri-star-s-fill text-success fs-8"></i></sup></label>
                            <Form.Control type="email" className="" id="fromMail" defaultValue="jackmiller2345@gmail.com" />
                        </Col>
                        <Col xl={6} className="mb-2">
                            <label htmlFor="toMail" className="form-label">To<sup><i className="ri-star-s-fill text-success fs-8"></i></sup></label>
                            <SpkSelect searchable name="colors" multi option={RecipientOptions} menuplacement='auto' classNameprefix="Select2" defaultvalue={[RecipientOptions[0]]} />
                        </Col>
                        <Col xl={6} className="mb-2">
                            <label htmlFor="mailCC" className="form-label text-dark fw-medium">Cc</label>
                            <Form.Control type="email" className="" id="mailCC" />
                        </Col>
                        <Col xl={6} className="mb-2">
                            <label htmlFor="mailBcc" className="form-label text-dark fw-medium">Bcc</label>
                            <Form.Control type="email" className="" id="mailBcc" />
                        </Col>
                        <Col xl={12} className="mb-2">
                            <label htmlFor="Subject" className="form-label">Subject</label>
                            <Form.Control type="text" className="" id="Subject" placeholder="Subject" />
                        </Col>
                        <Col xl={12} className="">
                            <label className="col-form-label">Content :</label>
                            <div className="mail-compose">
                                <div id="mail-compose-editor">
                                    <SpkSunEditor />
                                </div>
                            </div>
                        </Col>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" Buttontype="button" Customclass="btn" onClickfunc={() => handleClose('modal')}
                        data-bs-dismiss="modal">Cancel</SpkButton>
                    <SpkButton Buttonvariant="primary" Buttontype="button" Customclass="btn">Send</SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!--End::compose mail modal-- > */}

        </Fragment >
    )
};

export default MailApp;