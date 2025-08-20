
import React, { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { FilePond } from "react-filepond";
import CreatableSelect from 'react-select/creatable';
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkSunEditor from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-suneditor";
import SpkDatepickr from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { AsignSelect, StatusSelect, PrioritySelect } from "../../../../shared/data/dashboards/projects/projectcreatedata";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface CreateProjectProps { }

const CreateProject: React.FC<CreateProjectProps> = () => {

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

    const [files, setFiles] = useState<{ [key: string]: File[] }>({});
    const handleFileUpdate = (fileItems: any, pondName: string) => {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [pondName]: fileItems.map((fileItem: any) => fileItem.file),
        }));
    };

    const components = {
        DropdownIndicator: null,
    };

    const createOption = (label: string) => ({
        label,
        value: label,
    });

    const [inputValue, setInputValue] = useState('');
    const [value1, setValue1] = useState([
        createOption("Marketing"),
        createOption("Sales"),
        createOption("Development"),
        createOption("Design"),
        createOption("Research"),

    ]);
    const handleKeyDown = (event: { key: any; preventDefault: () => void; }) => {
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                setValue1((prev) => [...prev, createOption(inputValue)]);
                setInputValue('');
                event.preventDefault();
        }
    };

    const defaultContent = `<p>"Project Omni" is a cloud-based platform designed to streamline project management for small to medium-sized businesses. The application enables users to create, manage, and collaborate on projects with team members. It includes tools for task tracking, time management, file sharing, and real-time messaging. The goal is to improve productivity, enhance communication, and ensure that projects are completed on time and within budget.</p>
                                        <p><br /></p>
     <ol>
        <li className="ql-size-normal">User Authentication and Role Management.</li>
        <li className="">Project Creation and Management.</li>
        <li className="">Task Assignment and Tracking.</li>
        <li className="">Time Tracking Integration.</li>
        <li className="">File Sharing and Document Management.</li>
        <li className="">Real-time Collaboration and Messaging.</li>
    </ol>`

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Projects-Create Project" />

            <Pageheader title="Dashboards" subtitle="Projects" currentpage="Create Project" activepage="Create Project" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Create Project
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="row gy-3">
                                <Col xl={4}>
                                    <Form.Label htmlFor="input-label" className="">Project Name :</Form.Label>
                                    <Form.Control type="text" className="" id="input-label" placeholder="Enter Project Name" />
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="input-label11" className="">Project Manager :</Form.Label>
                                    <Form.Control type="text" className="" id="input-label11" placeholder="Project Manager Name" />
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="input-label1" className="">Client / Stakeholder :</Form.Label>
                                    <Form.Control type="text" className="" id="input-label1" placeholder="Enter Client Name" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="">Project Description :</Form.Label>
                                    <div id="project-descriptioin-editor">
                                        <SpkSunEditor height={'300px'} defaulContent={defaultContent} />
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Start Date :</Form.Label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                            <SpkDatepickr className="form-control flatpickr-input" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" placeholderText='Choose date with time' showTimeInput selected={dates["startDate"] ? new Date(dates["startDate"]) : null} onChange={(date: Date | null) => handleDateChange("startDate", date)} />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">End Date :</Form.Label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                            <SpkDatepickr className="form-control flatpickr-input" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" placeholderText='Choose date with time' showTimeInput selected={dates["endDate"] ? new Date(dates["endDate"]) : null} onChange={(date: Date | null) => handleDateChange("endDate", date)} />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Status :</Form.Label>
                                    <SpkSelect name="colors" option={StatusSelect} mainClass="default basic-multi-select" id="choices-multiple-default" menuplacement='auto' classNameprefix="Select2" defaultvalue={[StatusSelect[1]]} />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Priority :</Form.Label>
                                    <SpkSelect name="colors" option={PrioritySelect} mainClass="default basic-multi-select" id="choices-multiple-default" menuplacement='auto' classNameprefix="Select2" defaultvalue={[PrioritySelect[1]]} />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Assigned To</Form.Label>
                                    <SpkSelect multi name="colors" option={AsignSelect} mainClass="default basic-multi-select" id="choices-multiple-default" menuplacement='auto' classNameprefix="Select2" defaultvalue={[AsignSelect[4], AsignSelect[10], AsignSelect[0]]} />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="">Tags</Form.Label>
                                    <CreatableSelect className="tags-data" components={components} classNamePrefix='react-select' inputValue={inputValue} isClearable isMulti menuIsOpen={false} onChange={(newValue) => {
                                        if (Array.isArray(newValue)) {
                                            setValue1(newValue);
                                        } else {
                                            setValue1([]);
                                        }
                                    }} onInputChange={(newValue) => setInputValue(newValue)} onKeyDown={handleKeyDown} placeholder="Type something and press enter..." value={value1} />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="">Attachments</Form.Label>
                                    <FilePond className="multiple-filepond" files={files['dropzone'] || []} onupdatefiles={(fileItems) => handleFileUpdate(fileItems, 'dropzone')} allowMultiple={true} maxFiles={3} server="/api" name="files" labelIdle='Drag & Drop your file here or click ' />
                                </Col>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <SpkButton Buttonvariant="" Customclass="btn btn-primary-light btn-wave ms-auto float-end">Create Project</SpkButton>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default CreateProject;