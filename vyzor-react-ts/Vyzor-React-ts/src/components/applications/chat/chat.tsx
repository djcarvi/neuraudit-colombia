

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dropdown, Form, Image, Nav, Offcanvas, Tab } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import EmojiPicker from 'emoji-picker-react';
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { ChatGallery, ChatUsers, ChatUsers1, Files, GroupChatPreviews, GroupChats, GroupedContacts } from "../../../shared/data/applications/chatdata";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import face2 from '../../../assets/images/faces/2.jpg';
import face15 from '../../../assets/images/faces/15.jpg';
import BG12 from '../../../assets/images/media/backgrounds/12.png';
interface ChatProps { }

const Chat: React.FC<ChatProps> = () => {

    const [activeUser, setActiveUser] = useState({
        name: 'Alice Smith',
        image: face2,
        status: 'online',
    });

    const handleChatClick = (user: any) => {
        setActiveUser({
            name: user.name,
            image: user.image,
            status: user.status,
        });
    };

    //Offcanvas
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const mainChartWrapperRef = useRef<HTMLDivElement | null>(null);

    const toggleChat = () => {
        if (mainChartWrapperRef.current) {
            mainChartWrapperRef.current?.classList.add("responsive-chat-open");
        }
    };

    const toggleChat1 = () => {
        if (mainChartWrapperRef.current) {
            mainChartWrapperRef.current?.classList.remove("responsive-chat-open");
        }
    };

    const [showPicker, setShowPicker] = useState(false);
    const [_inputValue, setInputValue] = useState(""); // state for input value
    const pickerRef = useRef(null);

    const handleEmojiClick = (emojiData: any) => {
        // Add the selected emoji to the input field value
        setInputValue((prevValue) => prevValue + emojiData.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (pickerRef.current && !(pickerRef.current as HTMLElement).contains(event.target)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Applications-Chat" />

            <Pageheader title="Applications" currentpage="Chat" activepage="Chat" />

            {/* <!-- Page Header Close --> */}

            <div ref={mainChartWrapperRef} className="main-chart-wrapper gap-lg-2 gap-0 mb-3 d-lg-flex">
                <div className="chat-info border">
                    <div className="d-flex align-items-center justify-content-between w-100 p-3 border-bottom">
                        <div>
                            <h5 className="fw-semibold mb-0">Messages</h5>
                        </div>
                        <SpkDropdown Togglevariant="" Customclass="ms-2" Icon={true} IconClass='ri-more-2-fill' Id="navbarScrollingDropdown"
                            Customtoggleclass="btn btn-icon btn-light btn-wave waves-light btn-sm no-caret" Menulabel="navbarScrollingDropdown">
                            <Dropdown.Item as="li" className="dropdown-item">New Chat</Dropdown.Item>
                            <Dropdown.Item as="li" className="dropdown-item">Create Group</Dropdown.Item>
                            <Dropdown.Item as="li" className="dropdown-item">Invite a Friend</Dropdown.Item>
                        </SpkDropdown>
                    </div>
                    <Tab.Container defaultActiveKey={"users"}>
                        <Nav className="nav nav-style-1 nav-pills nav-justified p-2 border-bottom d-flex"
                            id="myTab1" role="tablist">
                            <Nav.Item className=" me-0" role="presentation">
                                <Nav.Link eventKey={"users"} className="text-nowrap" id="users-tab" data-bs-toggle="tab"
                                    data-bs-target="#users-tab-pane" type="button" role="tab"
                                    aria-controls="users-tab-pane" aria-selected="true">Recents<span className="badge bg-secondary ms-1 rounded-pill">04</span></Nav.Link>
                            </Nav.Item>
                            <Nav.Item className=" me-0" role="presentation">
                                <Nav.Link eventKey={"groups"} className="" id="groups-tab" data-bs-toggle="tab"
                                    data-bs-target="#groups-tab-pane" type="button" role="tab"
                                    aria-controls="groups-tab-pane" aria-selected="false">Groups</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="" role="presentation">
                                <Nav.Link eventKey={"contacts"} className="" id="contacts-tab" data-bs-toggle="tab"
                                    data-bs-target="#contacts-tab-pane" type="button" role="tab"
                                    aria-controls="contacts-tab-pane" aria-selected="false">Contacts</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div className="chat-search p-3 border-bottom border-block-end-dashed">
                            <div className="input-group">
                                <Form.Control type="text" className="" placeholder="Search Here" aria-describedby="button-addon2" />
                                <SpkButton Buttonvariant="primary" aria-label="button" Customclass="btn" Buttontype="button"><i className="ri-search-line"></i></SpkButton>
                            </div>
                        </div>
                        <Tab.Content id="myTabContent">
                            <Tab.Pane eventKey={"users"} className="border-0 chat-users-tab" id="users-tab-pane"
                                role="tabpanel" aria-labelledby="users-tab" tabIndex={0}>
                                <SimpleBar className="list-unstyled mb-0 mt-2 chat-users-tab" id="chat-msg-scroll">
                                    <li className="pb-0">
                                        <p className="text-muted fs-11 fw-medium mb-2 op-7">Recent Chats</p>
                                    </li>
                                    {ChatUsers.map((user) => (
                                        <li key={user.id} className={`checkforactive ${activeUser.name === user.name ? 'active chat-msg-unread' : 'chat-inactive'}`} onClick={() => handleChatClick(user)}>
                                            <Link to="#!" onClick={() => console.log(`Clicked on ${user.name}`)}>
                                                <div className="d-flex align-items-top">
                                                    <div className="me-1 lh-1">
                                                        <span className={`avatar avatar-md ${user.status} me-2 avatar-rounded`}>
                                                            <Image  src={user.image} alt="img" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill" onClick={toggleChat}>
                                                        <p className="mb-0 fw-medium">
                                                            {user.name}{' '}
                                                            <span className="float-end text-muted fw-normal fs-11">
                                                                {user.time}
                                                            </span>
                                                        </p>
                                                        <p className={`fs-13 mb-0 ${user.typing ? 'chat-msg-typing' : ''}`}>
                                                            <span className="chat-msg text-truncate">{user.message}</span>
                                                            {user.unreadCount > 0 && (
                                                                <SpkBadge variant="" Customclass={` ${user.typing ? 'bg-warning' : 'bg-primary'} rounded-pill float-end`}>
                                                                    {user.unreadCount}
                                                                </SpkBadge>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="pb-0">
                                        <p className="text-muted fs-11 fw-medium mb-2 op-7">All Chats</p>
                                    </li>
                                    {ChatUsers1.map((user) => (
                                        <li key={user.id} className={`checkforactive ${activeUser.name === user.name ? 'active chat-msg-unread' : 'chat-inactive'}`} onClick={() => handleChatClick(user)}>
                                            <Link to="#!" onClick={() => console.log(`Clicked on ${user.name}`)}>
                                                <div className="d-flex align-items-top">
                                                    <div className="me-1 lh-1">
                                                        <span className={`avatar avatar-md ${user.status} me-2 avatar-rounded`}>
                                                            <Image src={user.image} alt="img" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill" onClick={toggleChat}>
                                                        <p className="mb-0 fw-medium">
                                                            {user.name}
                                                            <span className="float-end text-muted fw-normal fs-11">
                                                                {user.time}
                                                            </span>
                                                        </p>
                                                        <p className={`fs-13 mb-0 ${user.typing ? 'chat-msg-typing' : ''}`}>
                                                            <span className="chat-msg text-truncate">{user.message}</span>
                                                            {user.unreadCount ? (
                                                                <SpkBadge variant="" Customclass={`${user.typing ? 'bg-warning' : 'bg-primary'} rounded-pill float-end`}>
                                                                    {user.unreadCount}
                                                                </SpkBadge>
                                                            ) : (
                                                                !user.online && (
                                                                    <span className="chat-read-icon float-end align-middle">
                                                                        <i className="ri-check-double-fill"></i>
                                                                    </span>
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </SimpleBar>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"groups"} className="border-0 chat-groups-tab overflow-y-scroll" id="groups-tab-pane"
                                role="tabpanel" aria-labelledby="groups-tab" tabIndex={0}>
                                <ul className="list-unstyled mb-0 mt-2 ">
                                    <li className="pb-0">
                                        <p className="text-muted fs-11 fw-medium mb-1 op-7">Groups</p>
                                    </li>
                                    {GroupChats.map((group) => (
                                        <li key={group.id} >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="mb-0">{group.id} {group.name}</p>
                                                    <p className="mb-0">
                                                        <SpkBadge variant="" Customclass="badge bg-light text-default border">
                                                            {group.onlineCount} Online
                                                        </SpkBadge>
                                                    </p>
                                                </div>
                                                <div className="avatar-list-stacked my-auto">
                                                    {group.avatars.map((avatar, index) => (
                                                        <span key={index} className="avatar avatar-sm avatar-rounded">
                                                            <img src={avatar} alt="img" />
                                                        </span>
                                                    ))}
                                                    <Link className="avatar avatar-sm bg-primary avatar-rounded" to="#!">
                                                        +{group.extraCount}
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="list-unstyled mb-0 mt-2 ">
                                    <li className="pb-0">
                                        <p className="text-muted fs-11 fw-medium mb-1 op-7">Group Chats</p>
                                    </li>
                                    {GroupChatPreviews.map((chat) => (
                                        <li key={chat.id} className={`checkforactive ${activeUser.name === chat.name ? 'active chat-msg-unread' : 'chat-inactive'}`} onClick={() => handleChatClick(chat)}>
                                            <Link to="#!" onClick={() => console.log(`Clicked: ${chat.name}`)}>
                                                <div className="d-flex align-items-top">
                                                    <div className="me-1 lh-1">
                                                        <span className={`avatar avatar-md ${chat.status } me-2 avatar-rounded`}>
                                                            <Image width={40} height={40} src={chat.image} alt="img" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill" onClick={toggleChat}>
                                                        <p className="mb-0 fw-medium">
                                                            {chat.name}{' '}
                                                            <span className="float-end text-muted fw-normal fs-11">
                                                                {chat.time}
                                                            </span>
                                                        </p>
                                                        <p className="fs-13 mb-0">
                                                            <span className="chat-msg text-truncate">
                                                                {chat.sender && (
                                                                    <span className="group-indivudial">{chat.sender} : </span>
                                                                )}
                                                                {chat.message}
                                                            </span>
                                                            {!chat.unread && (
                                                                <span className="chat-read-icon float-end align-middle">
                                                                    <i className="ri-check-double-fill"></i>
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"contacts"} className="border-0 chat-contacts-tab overflow-y-scroll" id="contacts-tab-pane" role="tabpanel"
                                aria-labelledby="contacts-tab" tabIndex={0}>
                                <ul className="list-unstyled mb-0 chat-contacts-tab">
                                    {GroupedContacts.map((group) => (
                                        <React.Fragment key={group.letter}>
                                            <li>
                                                <span className="text-default fw-semibold">{group.letter}</span>
                                            </li>
                                            {group.contacts.map((contact, index) => (
                                                <li key={index}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="lh-1">
                                                            <span className="avatar avatar-rounded avatar-sm bg-light text-default border">
                                                                {contact.avatar ? (
                                                                    <img src={contact.avatar} alt={contact.name} />
                                                                ) : (
                                                                    contact.initials
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex-fill">
                                                            <span className="d-block fw-semibold">{contact.name}</span>
                                                        </div>
                                                        <SpkDropdown Togglevariant="" Customclass="" Icon={true} IconClass='ri-more-2-fill' Id="navbarScrollingDropdown"
                                                            Customtoggleclass="btn btn-icon btn-sm btn-outline-light no-caret" Menulabel="navbarScrollingDropdown">
                                                            <Dropdown.Item as="li" className="dropdown-item"><i className="ri-message-2-line me-2"></i>Chat</Dropdown.Item>
                                                            <Dropdown.Item as="li" className="dropdown-item"><i className="ri-phone-line me-2"></i>Audio Call</Dropdown.Item>
                                                            <Dropdown.Item as="li" className="dropdown-item"><i className="ri-live-line me-2"></i>Video Call</Dropdown.Item>
                                                            <Dropdown.Item as="li" className="dropdown-item"><i className="ri-edit-line me-2"></i>Edit</Dropdown.Item>
                                                            <Dropdown.Item as="li" className="dropdown-item"><i className="ri-spam-2-line me-2"></i>Block</Dropdown.Item>
                                                            <Dropdown.Item as="li" className="dropdown-item"><i className="ri-delete-bin-line me-2"></i>Delete</Dropdown.Item>
                                                        </SpkDropdown>
                                                    </div>
                                                </li>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
                <div className="main-chat-area border">
                    <div className="d-flex align-items-center border-bottom main-chat-head flex-wrap">
                        <div className="me-2 lh-1">
                            <span className={`avatar avatar-md  chatstatusperson avatar-rounded ${activeUser.status}`}>
                                <Image className="chatimageperson" src={activeUser.image} alt="img" />
                            </span>
                        </div>
                        <div className="flex-fill">
                            <p className="mb-0 fw-medium fs-14 lh-1">
                                <Link to="#!" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" className="chatnameperson responsive-userinfo-open" onClick={handleShow}  >{activeUser.name}</Link>
                            </p>
                            <p className="text-muted mb-0 chatpersonstatus fs-12">{activeUser.status}</p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap rightIcons">
                            <SpkButton Buttonvariant="light" aria-label="button" Buttontype="button" Customclass="btn btn-icon ms-2 btn-sm">
                                <i className="ti ti-phone"></i>
                            </SpkButton>
                            <SpkButton Buttonvariant="light" aria-label="button" Buttontype="button" Customclass="btn btn-icon ms-2 btn-sm">
                                <i className="ti ti-video"></i>
                            </SpkButton>
                            <SpkButton Buttonvariant="light" aria-label="button" Buttontype="button" Customclass="btn btn-icon ms-2 responsive-userinfo-open btn-sm">
                                <i className="ti ti-user-circle" id="responsive-chat-close"></i>
                            </SpkButton>
                            <SpkDropdown Customclass="ms-2" Icon={true} IconClass="ti ti-dots-vertical" Customtoggleclass="btn btn-icon btn-wave waves-light btn-sm no-caret" Togglevariant="light" >
                                <Dropdown.Item as="li" className="dropdown-item" ><i className="ri-user-3-line me-1"></i>Profile</Dropdown.Item>
                                <Dropdown.Item as="li" className="dropdown-item" ><i className="ri-format-clear me-1"></i>Clear Chat</Dropdown.Item>
                                <Dropdown.Item as="li" className="dropdown-item" ><i className="ri-user-unfollow-line me-1"></i>Delete User</Dropdown.Item>
                                <Dropdown.Item as="li" className="dropdown-item" ><i className="ri-user-forbid-line me-1"></i>Block User</Dropdown.Item>
                                <Dropdown.Item as="li" className="dropdown-item" ><i className="ri-error-warning-line me-1"></i>Report</Dropdown.Item>
                            </SpkDropdown>
                            <SpkButton Buttonvariant="light" aria-label="button" onClickfunc={toggleChat1} Buttontype="button" Customclass="btn btn-icon ms-2 responsive-chat-close btn-sm">
                                <i className="ri-close-line"></i>
                            </SpkButton>
                        </div>
                    </div>

                    <SimpleBar className="chat-content" id="main-chat-content">
                        <div className="chat-content-background">
                            <Image  src={BG12} alt="" />
                        </div>
                        <ul className="list-unstyled">
                            <SimpleBar>
                                <li className="chat-day-label">
                                    <span>Today</span>
                                </li>
                                <li className="chat-item-start">
                                    <div className="chat-list-inner">
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md ${activeUser.status} avatar-rounded chatstatusperson`}>
                                                <Image width={40} height={40} className="chatimageperson" src={activeUser.image} alt="img" />
                                            </span>
                                        </div>
                                        <div className="ms-3">
                                            <span className="chatting-user-info">
                                                <span className="chatnameperson">{activeUser.name}</span> <span className="msg-sent-time"> 10:00 PM</span>
                                            </span>
                                            <div className="main-chat-msg">
                                                <div>
                                                    <p className="mb-0">Hey! How are you doing today? &#128522;</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="chat-item-end">
                                    <div className="chat-list-inner">
                                        <div className="me-3">
                                            <span className="chatting-user-info">
                                                <span className="msg-sent-time"><span className="chat-read-mark align-middle d-inline-flex"><i
                                                    className="ri-check-double-line"></i></span>10:02 AM</span> You
                                            </span>
                                            <div className="main-chat-msg">
                                                <div>
                                                    <p className="mb-0">Hi! I'm doing great, thanks for asking. How about you?</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md online avatar-rounded`}>
                                                <Image  className="chatimageperson" src={face15} alt="img" />
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li className="chat-item-start">
                                    <div className="chat-list-inner">
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md ${activeUser.status} avatar-rounded chatstatusperson`}>
                                                <Image  className="chatimageperson" src={activeUser.image} alt="img" />
                                            </span>
                                        </div>
                                        <div className="ms-3">
                                            <span className="chatting-user-info">
                                                <span className="chatnameperson">{activeUser.name}</span> <span className="msg-sent-time">10:05 AM</span>
                                            </span>
                                            <div className="main-chat-msg">
                                                <div>
                                                    <p className="mb-0">I'm good too.</p>
                                                </div>
                                                <div>
                                                    <p className="mb-0">Have you completed the project report yet? &#128221;</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="chat-item-end">
                                    <div className="chat-list-inner">
                                        <div className="me-3">
                                            <span className="chatting-user-info">
                                                <span className="msg-sent-time"><span className="chat-read-mark align-middle d-inline-flex"><i
                                                    className="ri-check-double-line"></i></span>10:06 AM</span> You
                                            </span>
                                            <div className="main-chat-msg">
                                                <div>
                                                    <p className="mb-0">Almost! Just need to finalize a few things. I should be done by the end of the day.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md online avatar-rounded`}>
                                                <Image className="chatimageperson" src={face15} alt="img" />

                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li className="chat-item-start">
                                    <div className="chat-list-inner">
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md ${activeUser.status} avatar-rounded chatstatusperson`}>
                                                <Image  className="chatimageperson" src={activeUser.image} alt="img" />
                                            </span>
                                        </div>
                                        <div className="ms-3">
                                            <span className="chatting-user-info">
                                                <span className="chatnameperson">{activeUser.name}</span> <span className="msg-sent-time"> 10:10 PM</span>
                                            </span>
                                            <div className="main-chat-msg">
                                                <div>
                                                    <p className="mb-0">Awesome! Let me know if you need any help with it.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="chat-item-end">
                                    <div className="chat-list-inner">
                                        <div className="me-3">
                                            <span className="chatting-user-info">
                                                <span className="msg-sent-time"><span className="chat-read-mark align-middle d-inline-flex"><i
                                                    className="ri-check-double-line"></i></span>10:11 AM</span> You
                                            </span>
                                            <div className="main-chat-msg">
                                                <div className="">
                                                    <p className="mb-0">Thanks! Actually, I was thinking of adding a new section to the report. What do you think about including a summary of our recent team discussions? &#128528;</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md online avatar-rounded`}>
                                                <Image  className="chatimageperson" src={face15} alt="img" />
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li className="chat-item-start">
                                    <div className="chat-list-inner">
                                        <div className="chat-user-profile">
                                            <span className={`avatar avatar-md ${activeUser.status} avatar-rounded`}>
                                                <Image  className="chatimageperson" src={activeUser.image} alt="img" />
                                            </span>
                                        </div>
                                        <div className="ms-3">
                                            <span className="chatting-user-info chatnameperson">
                                                {activeUser.name} <span className="msg-sent-time">10:15 AM</span>
                                            </span>
                                            <div className="main-chat-msg">
                                                <div>
                                                    <p className="mb-0">That’s a great idea! It will definitely add more value. I can help with writing it if you’d like.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </SimpleBar>
                        </ul>
                    </SimpleBar>
                    <div className="chat-footer">
                        <Link  aria-label="anchor" className="btn btn-icon me-2 btn-light" to="#!">
                            <i className="ri-attachment-line"></i>
                        </Link>
                        <Form.Control className="form-control-lg chat-message-space border-0 shadow-none" placeholder="Type your message here..." type="text" />
                        <Link  aria-label="anchor" className="btn btn-icon ms-2 btn-light emoji-picker" to="#!">
                            <i className="ri-emotion-line" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPicker((prev) => !prev) }}></i>
                        </Link>
                        {showPicker && (
                            <div ref={pickerRef} style={{ position: 'absolute', zIndex: 1000, bottom: '4rem', insetInlineEnd: '4rem' }}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                        <Link  aria-label="anchor" className="btn btn-primary ms-2 btn-icon btn-send" to="#!">
                            <i className="ri-send-plane-2-line"></i>
                        </Link>
                    </div>
                </div>

            </div>

            {/* <!-- End::app-content --> */}

            {/* <!-- Start::chat user details offcanvas --> */}

            <Offcanvas placement="end" show={show} onHide={handleClose} className="" tabIndex={-1} id="offcanvasRight">
                <Offcanvas.Body>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={handleClose} Customclass="btn-close btn btn-sm btn-icon btn-outline-light border" data-bs-dismiss="offcanvas"
                        aria-label="Close"></SpkButton>
                    <div className="chat-user-details" id="chat-user-details">
                        <div className="text-center mb-5">
                            <span className="avatar avatar-rounded online avatar-xxl me-2 mb-3 chatstatusperson">
                                <Image width={80} height={80} className="chatimageperson" src={face2} alt="img" />
                            </span>
                            <p className="mb-1 fs-15 fw-medium text-dark lh-1 chatnameperson">Alice Smith</p>
                            <p className="fs-13 text-muted"><span className="chatnameperson">alicesmith</span>@gmail.com</p>
                            <p className="text-center mb-0">
                                <SpkButton Buttonvariant="" Buttoncontrols="button" aria-label="button" Customclass="btn btn-icon rounded-pill btn-primary-light btn-wave">
                                    <i className="ri-phone-line"></i>
                                </SpkButton>
                                <SpkButton Buttonvariant="" Buttoncontrols="button" aria-label="button" Customclass="btn btn-icon rounded-pill btn-success-light ms-2 btn-wave">
                                    <i className="ri-chat-1-line"></i>
                                </SpkButton>
                                <SpkButton Buttonvariant="" Buttoncontrols="button" aria-label="button" Customclass="btn btn-icon rounded-pill btn-warning-light ms-2 btn-wave">
                                    <i className="ri-video-add-line"></i>
                                </SpkButton>
                            </p>
                        </div>
                        <div className="mb-5">
                            <div className="fw-medium mb-4">Shared Files
                                <span className="float-end fs-11"><Link to="#!" className="fs-13 text-muted"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link></span>
                            </div>
                            <ul className="shared-files list-unstyled">
                                {Files.map((file, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center">
                                            <div className="lh-1">
                                                <span className="avatar avatar-lg">
                                                    <Image width={48} height={48} src={file.fileIcon} alt={file.fileName} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fs-13 fw-medium mb-0">{file.fileName}</p>
                                                <p className="mb-0 text-muted fs-11">{file.fileDate}</p>
                                            </div>
                                            <div className="fs-13 text-muted">{file.fileSize}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-0">
                            <div className="fw-medium mb-4">Photos & Media
                                <span className="float-end fs-11"><Link to="#!" className="fs-13 text-muted"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link></span>
                            </div>
                            <ChatGallery />
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <!-- End::chat user details offcanvas --> */}

        </Fragment>
    )
};

export default Chat;