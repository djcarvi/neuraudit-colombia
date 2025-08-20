

import React, { Fragment, useEffect, useRef, useState } from "react";
import listPlugin from "@fullcalendar/list";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import SimpleBar from "simplebar-react";
import { Card, Col, Form, Modal, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import { Link } from "react-router-dom";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkDatepickr from "../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";

interface FullCalendarProps { }

const Fullcalendar: React.FC<FullCalendarProps> = () => {
    const [dates, setDates] = useState<{ [key: string]: Date | string | null }>({});
    const handleDateChange = (key: string, date: Date | null) => {
        if (date) {
            setDates((prevDates) => ({
                ...prevDates,
                [key]: date,
            }));
        } else {
            setDates((prevDates) => {
                const { [key]: removedKey, ...rest } = prevDates;
                return rest;
            });
        }
    };
    let eventGuid = 0;
    const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
    const INITIAL_EVENTS = [
        {
            id: createEventId(),
            title: "Meeting",
            start: todayStr,
        },
        {
            id: createEventId(),
            title: "Meeting Time",
            start: todayStr + "T16:00:00",
        },
    ];

    function createEventId() {
        return String(eventGuid++);
    }
    const initialstate1 = {
        calendarEvents: [
            {
                title: "Atlanta Monster",
                start: new Date("2019-04-04 00:00"),
                id: "1001",
            },
            {
                title: "My Favorite Murder",
                start: new Date("2019-04-05 00:00"),
                id: "1002",
            },
        ],

        events: [
            {
                title: "Calendar Events",
                id: "1",
                bg: "primary",
                bgColor: 'text-primary',
            },
            {
                title: "Birthday Events",
                id: "2",
                bg: "secondary",
                bgColor: 'text-secondary',
            },
            {
                title: "Holiday Calendar",
                id: "3",
                bg: "success",
                bgColor: 'text-success',
            },
            {
                title: "Office Events",
                id: "4",
                bg: "info",
                bgColor: 'text-info',
                border: "border-info-transparent",
            },
            {
                title: "Other Events",
                id: "5",
                bg: "warning",
                bgColor: 'text-warning',
            },
            {
                title: "Festival Events",
                id: "6",
                bg: "danger",
                bgColor: 'text-danger',
            },
            {
                title: "Timeline Events",
                id: "7",
                bg: "teal",
                bgColor: 'text-teal',
            },
        ],
    };

    const [state] = useState(initialstate1);

    const externalEventsRef: any = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const draggableEl: any = externalEventsRef.current;
        new Draggable(draggableEl, {
            itemSelector: ".fc-event",
            eventData: function (eventEl) {
                const title = eventEl.getAttribute("title");
                const id = eventEl.getAttribute("data");
                const classValue = eventEl.getAttribute("class");
                return {
                    title: title,
                    id: id,
                    className: classValue,
                };
            },
        });
    }, []);

    function renderEventContent(eventInfo: any) {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    }
    const handleEventClick = (clickInfo: any) => {
        if (
            window.confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
            )
        ) {
            clickInfo.event.remove();
        }
    };
    const handleEvents = () => { };

    const handleDateSelect = (selectInfo: any) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    };

    interface SchoolEvent {
        title: string;
        date: string;
        description: string;
        badgeColor: string;
    };

    const SchoolEvents: SchoolEvent[] = [
        {
            title: "Annual School Day",
            date: "02 Mar, 2025",
            description:
                "A celebration of the school year with various events and activities for students and staff.",
            badgeColor: "bg-primary",
        },
        {
            title: "Science Fair",
            date: "17 Mar, 2025",
            description:
                "Students will showcase their science projects. Open to all parents and students.",
            badgeColor: "bg-secondary",
        },
        {
            title: "Parent-Teacher Meeting",
            date: "15 Mar, 2025",
            description:
                "An important event where parents meet teachers to discuss the progress of their children.",
            badgeColor: "bg-warning",
        },
        {
            title: "Spring Break",
            date: "13 Mar,2025",
            description:
                "The students get a break for the spring holidays. No school during this period.",
            badgeColor: "bg-info",
        },
        {
            title: "Holiday Celebrations",
            date: "Due Date",
            description:
                "Celebrating the upcoming national holiday with various cultural activities and festivities.",
            badgeColor: "bg-success",
        },
    ];

    const EventSelect = [
        { value: 'Primary', label: 'Primary' },
        { value: 'Secondary', label: 'Secondary' },
        { value: 'Success', label: 'Success' },
        { value: 'Info', label: 'Info' },
        { value: 'Warning', label: 'Warning' },
        { value: 'Danger', label: 'Danger' },
        { value: 'Teal', label: 'Teal' }
    ]

    //Modal
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Applications-Full Calendar" />

            <Pageheader title="Applications" currentpage="Full Calendar" activepage="Full Calendar" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">All Events</div>
                            <button onClick={handleShow} className="btn btn-primary btn-wave" data-bs-toggle="modal"
                                data-bs-target="#addEvent"><i className="ri-add-line align-middle me-1 fw-medium d-inline-block"></i>Create New Event</button>
                        </Card.Header>
                        <Card.Body className="">
                            <div id="external-events" ref={externalEventsRef} className="">
                                {state.events.map((event, index) => (
                                    <div key={index} className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event bg-${event.bg}`}
                                        title={event.title} >
                                        <div className={`fc-event-main text-fixed-white ${event.bgColor}`}>
                                            {event.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="custom-card">
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="fw-medium mb-0">
                                        Upcoming Events
                                    </h6>
                                    <Link to="#!" className="fs-13 text-muted text-decoration-underline">View All<i className="ti ti-arrow-narrow-right"></i></Link>
                                </div>
                            </div>
                            <SimpleBar className="p-3" id="full-calendar-activity">
                                <ul className="list-unstyled mb-0 fullcalendar-events-activity">
                                    {SchoolEvents.map((event, index) => (
                                        <li key={index}>
                                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                <p className="mb-1 fw-medium">{event.title}</p>
                                                <SpkBadge variant="" Customclass={`${event.badgeColor} mb-1`}>{event.date}</SpkBadge>
                                            </div>
                                            <p className="mb-0 text-muted fs-13">{event.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </SimpleBar>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={9}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Full Calendar</div>
                        </Card.Header>
                        <Card.Body>
                            <div id='calendar'>
                                <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                    headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek" }}
                                    initialView="dayGridMonth" editable={true} selectable={true} selectMirror={true} dayMaxEvents={true}
                                    initialEvents={INITIAL_EVENTS} select={handleDateSelect} eventContent={renderEventContent} eventClick={handleEventClick}
                                    eventsSet={handleEvents}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- Add Event Modal --> */}

            <Modal show={show} onHide={handleClose} className="fade" id="addEvent" tabIndex={-1} aria-labelledby="addEventLabel" aria-hidden="true">
                <Modal.Header>
                    <h6 className="modal-title" id="addEventLabel1">Add Event</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={handleClose} Customclass="btn-close" data-bs-dismiss="modal" aria-label="Close"></SpkButton>
                </Modal.Header>
                <Modal.Body>
                    <Row className="gy-3">
                        <Col md={12}>
                            <div className="form-group">
                                <Form.Label className="" htmlFor="eventType">Event Type:</Form.Label>
                                <SpkSelect name="state" option={EventSelect} mainClass="basic-multi-select " menuplacement='auto' classNameprefix="Select2" defaultvalue={[EventSelect[0]]} />
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="form-group">
                                <Form.Label className="" htmlFor="eventName">Event Name:</Form.Label>
                                <Form.Control type="text" className="" placeholder="Enter event" id="eventName" />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="form-group">
                                <Form.Label className="" htmlFor="fromDate">From:</Form.Label>
                                <SpkDatepickr className="form-control" dateFormat="yy/MM/dd" selected={dates["FromDate"] ? new Date(dates["FromDate"]) : null} onChange={(date: Date | null) => handleDateChange("FromDate", date)} placeholderText='From Date' />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="form-group custom-calendar">
                                <Form.Label className="" htmlFor="toDate">To:</Form.Label><br></br>
                                <SpkDatepickr  className="form-control" dateFormat="yy/MM/dd" selected={dates["ToDate"] ? new Date(dates["ToDate"]) : null} onChange={(date: Date | null) => handleDateChange("ToDate", date)} placeholderText='To Date' />

                            </div>
                        </Col>
                        <Col xl={12}>
                            <div className="form-group">
                                <Form.Label className="" htmlFor="description">Description:</Form.Label>
                                <Form.Control as="textarea" className="" id="event-description" rows={3} />
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="primary" Buttontype="button" onClickfunc={handleClose} Customclass="btn">Add Event</SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- Add Event Modal --> */}

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default Fullcalendar;