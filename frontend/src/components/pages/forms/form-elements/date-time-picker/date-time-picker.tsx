
import React, { Fragment, useState } from "react";
import { Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import SpkDatepickr from "../../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import Pageheader from "../../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../../shared/layouts-components/seo/seo";

interface DateTimeProps { }

const DateTimePicker: React.FC<DateTimeProps> = () => {

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
    //  date range 

    const [startDate1, setStartDate1] = useState(new Date());
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);
        const [endDate1, setEndDate1] = useState(thirtyDaysLater);
        const onChange1 = (dates: any) => {
            const [start, end] = dates;
            setStartDate1(start);
            setEndDate1(end);
        };

    const [startDate, setStartDate] = useState(new Date());
   
  

    const [timeRange, setTimeRange] = useState(
        setHours(setMinutes(new Date(), 30), 17)
    );

    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="Forms-Date&TimePickers" />

            <Pageheader title="Forms" subtitle="Form Elements" currentpage="Date & Time Pickers" activepage="Date & Time Pickers" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}
            <Row>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Basic Date picker
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-calendar-line"></i></InputGroup.Text>
                                    <SpkDatepickr className="form-control" selected={dates["basicDate"] ? new Date(dates["basicDate"]) : null} onChange={(date: Date | null) => handleDateChange("basicDate", date)} />
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}> 
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Date picker With Time
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </InputGroup.Text>
                                    <SpkDatepickr className="form-control" selected={dates["timeDate"] ? new Date(dates["timeDate"]) : null} onChange={(date: Date | null) => handleDateChange("timeDate", date)} Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" placeholderText='Choose date with time' showTimeInput />
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Human Friendly dates
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted">
                                        <i className="ri-calendar-line"></i> </InputGroup.Text>
                                    <SpkDatepickr className="form-control" dateFormat="MMMM d, yyyy" selected={dates["humanFriendly"] ? new Date(dates["humanFriendly"]) : null} onChange={(date: Date | null) => handleDateChange("humanFriendly", date)} placeholderText='Human friendly dates' />

                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Date range picker
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-calendar-line"></i>
                                    </InputGroup.Text>
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate1}
                                        onChange={onChange1}
                                        startDate={startDate1}
                                        endDate={endDate1}
                                        selectsRange
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 -->/ */}
            <Row>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Basic Time picker
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-time-line"></i> </InputGroup.Text>
                                    <SpkDatepickr className="form-control" showTimeSelect dateFormat="h:mm aa" showTimeSelectOnly selected={dates["BasicTimepicker"] ? new Date(dates["BasicTimepicker"]) : null} onChange={(date: Date | null) => handleDateChange("BasicTimepicker", date)} placeholderText="Choose time" />
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Time picker with 24hr Format
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-group mb-0">
                                <div className="input-group datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-time-line"></i> </InputGroup.Text>
                                    <SpkDatepickr className="form-control" showTimeSelect dateFormat="h:mm aa" showTimeSelectOnly selected={dates["Timepickerwith24hrFormat"] ? new Date(dates["Timepickerwith24hrFormat"]) : null} onChange={(date: Date | null) => handleDateChange("Timepickerwith24hrFormat", date)} placeholderText="Choose time in 24hr formate " />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                Time Picker with Limits
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-time-line"></i> </InputGroup.Text>
                                    <DatePicker
                                        className='form-control'
                                        selected={timeRange} // Pass a single Date here
                                        onChange={(date:any) => setTimeRange(date)} // Ensure this is a single Date
                                        showTimeSelect
                                        showTimeSelectOnly
                                        minTime={setHours(setMinutes(new Date(), 0), 17)} // Min time: 5:00 PM
                                        maxTime={setHours(setMinutes(new Date(), 30), 20)} // Max time: 8:30 PM
                                        dateFormat="h:mm aa"
                                        placeholderText="choose time min 5:00 to 8:30"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card custom-datepicker">
                        <Card.Header className="">
                            <div className="card-title">
                                DateTimePicker with Limited Time Range
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <InputGroup className="datepicker-inputwraper">
                                    <InputGroup.Text className="input-group-text text-muted"> <i className="ri-time-line"></i> </InputGroup.Text>
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate}
                                        onChange={(date:any) => setStartDate(date)}
                                        showTimeSelect
                                        minTime={setHours(setMinutes(new Date(), 0), 17)}
                                        maxTime={setHours(setMinutes(new Date(), 30), 20)}
                                        dateFormat="yy/MM/dd h:mm aa"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}
            <Row>
                <Col xl={6}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="">
                                    <div className="card-title">
                                        Date Picker with week numbers
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="form-group mb-0">
                                        <InputGroup className="datepicker-inputwraper">
                                        <InputGroup.Text className="input-group-text text-muted"> <i className="ri-calendar-line"></i></InputGroup.Text>
                                            <SpkDatepickr className="form-control" showWeekNumbers
                                                dateFormat="yy/MM/dd"
                                                selected={dates["DatePickerwithweeknumbers"] ? new Date(dates["DatePickerwithweeknumbers"]) : null} onChange={(date: Date | null) => handleDateChange("DatePickerwithweeknumbers", date)}  placeholderText="Choose date" />
                                        </InputGroup>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="">
                                    <div className="card-title">
                                        Inline Time Picker
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="form-group mb-0">
                                        <div className="input-group">
                                            <SpkDatepickr className="form-control" selected={dates["inlineTime"] ? new Date(dates["inlineTime"]) : null} onChange={(date: Date | null) => handleDateChange("inlineTime", date)} Inline={true} showTimeSelect showTimeSelectOnly={true} timeIntervals={15} Caption="Time" dateFormat="h:mm aa" />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card custom-Preloading">
                                <Card.Header className="">
                                    <div className="card-title">
                                        Preloading time
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="form-group mb-0">
                                        <div className="input-group custom-inputfieldTime">
                                        <InputGroup.Text className="input-group-text text-muted"> <i className="ri-calendar-line"></i></InputGroup.Text>
                                            <SpkDatepickr className="form-control" showTimeSelect showTimeSelectOnly={true} selected={dates["preLoad"] ? new Date(dates["preLoad"]) : new Date('2025-01-30T12:00:00')} onChange={(date: Date | null) => handleDateChange("preLoad", date)} dateFormat="h:mm" />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="">
                            <div className="card-title">
                                Inline Calendar
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-group overflow-auto">
                                <SpkDatepickr className="form-control" selected={dates["InlineCalendar"] ? new Date(dates["InlineCalendar"]) : null} onChange={(date: Date | null) => handleDateChange("InlineCalendar", date)} Inline={true} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <!-- End:: row-3 --> */}
        </Fragment>
    )
};

export default DateTimePicker;