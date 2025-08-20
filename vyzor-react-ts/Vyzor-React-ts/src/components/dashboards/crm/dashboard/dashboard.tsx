
import React, { Fragment } from "react";
import { Card, Col, ListGroup,Pagination, Nav, Row, Tab, Image } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import { CrmOptions, CrmSeries, Deals, LeadOptions, LeadSeries, Overviewtable, StatCards, StaticOptions, StaticSeries, Tasks, TopdealsTable, TrafficSources, Upcoming } from "../../../../shared/data/dashboards/crm/crmdashboarddata";
import SpkEmployeeStatCard from "../../../../shared/@spk-reusable-components/reusable-widgets/spk-employeecard";
import Spkapexcharts from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import { Link } from "react-router-dom";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkTables from "../../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";

interface CrmProps { }

const CRM: React.FC<CrmProps> = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Dashboards-CRM" />

            <Pageheader title="Dashboards" subtitle="CRM" currentpage="Dashboard" activepage="CRM" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={5}>
                    <Row>
                        {StatCards.map((idx, index) => (
                            <Col lg={6} key={index}>
                                <SpkEmployeeStatCard widget={idx} />
                            </Col>
                        ))}
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Revenue Analytics
                                    </div>
                                </Card.Header>
                                <Card.Body className="pb-0">
                                    <div id="crm-revenue-analytics">
                                        <Spkapexcharts height={315} width={"100%"} type={"line"} chartOptions={CrmOptions} chartSeries={CrmSeries} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={4}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Tab.Container defaultActiveKey={"upcoming"}>
                                    <Card.Header className="justify-content-between">
                                        <div className="card-title">
                                            Tasks List
                                        </div>
                                        <Nav className="nav-tabs justify-content-end nav-tabs-header card-headertabs" role="tablist">
                                            <Nav.Item role="presentation">
                                                <Nav.Link eventKey={"today"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#today" aria-selected="false" tabIndex={-1}>Today</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item role="presentation">
                                                <Nav.Link eventKey={"upcoming"} className="" data-bs-toggle="tab" role="tab" aria-current="page" href="#Upcoming" aria-selected="true">Upcoming</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Card.Header>
                                    <Card.Body className="todo-tab p-0">
                                        <Tab.Content>
                                            <Tab.Pane eventKey={"today"} className="border-0" id="today" role="tabpanel">
                                                <ul className="list-unstyled task-list-tab">
                                                    {Tasks.map((task) => (
                                                        <li key={task.id}>
                                                            <div className="d-flex align-items-start gap-2 flex-wrap">
                                                                <div className="mb-3 form-check">
                                                                    <input type="checkbox" className="form-check-input" defaultChecked={task.completed} />
                                                                </div>
                                                                <div className="flex-fill">
                                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                                        <Link to="#!" className="crm-task-name">
                                                                            {task.title}
                                                                        </Link>
                                                                        <SpkTooltips title={task.status} placement="top">
                                                                            <div className="lh-1">
                                                                                <span className="avatar avatar-xs avatar-rounded bg-light border text-muted fw-semibold" data-bs-toggle="tooltip" >
                                                                                    <i className="ti ti-info-circle fs-11"></i>
                                                                                </span>
                                                                            </div>
                                                                        </SpkTooltips>
                                                                    </div>
                                                                    <div className="d-flex align-items-center gap-2 lh-1">
                                                                        <Link to="#!" className="fs-12">
                                                                            {task.code}
                                                                        </Link>
                                                                        <div className="vr"></div>
                                                                        <span className="text-muted mb-0 fs-12">
                                                                            <i className="ti ti-user me-1 fw-medium"></i>
                                                                            {task.assignee}
                                                                        </span>
                                                                        <div className="vr"></div>
                                                                        <SpkBadge variant="" Customclass={`${task.priority === 'High' ? 'bg-danger-transparent' : task.priority === 'Medium' ? 'bg-warning-transparent' : 'bg-success-transparent'}`}>
                                                                            {task.priority}
                                                                        </SpkBadge>
                                                                    </div>
                                                                </div>
                                                                <div className="text-end">
                                                                    <span className="d-block fw-medium">{task.dueTime}</span>
                                                                    <span className="d-block fs-12 text-muted">Due Time</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey={"upcoming"} className="border-0" id="Upcoming" role="tabpanel">
                                                <ul className="list-unstyled task-list-tab">
                                                    {Upcoming.map((task) => (
                                                        <li key={task.id}>
                                                            <div className="d-flex align-items-start gap-2 flex-wrap">
                                                                <div className="mb-3 form-check">
                                                                    <input type="checkbox" className="form-check-input" defaultChecked={task.completed} />
                                                                </div>
                                                                <div className="flex-fill">
                                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                                        <Link to="#!" className="crm-task-name">
                                                                            {task.title}
                                                                        </Link>
                                                                        <SpkTooltips placement="top" title="Not Started">
                                                                            <div className="lh-1">
                                                                                <span className="avatar avatar-xs avatar-rounded bg-light border text-muted fw-semibold" data-bs-toggle="tooltip" title={task.status}>
                                                                                    <i className="ti ti-info-circle fs-11"></i>
                                                                                </span>
                                                                            </div>
                                                                        </SpkTooltips>
                                                                    </div>
                                                                    <div className="d-flex align-items-center gap-2 lh-1">
                                                                        <Link to="#!" className="fs-12">{task.code}</Link>
                                                                        <div className="vr"></div>
                                                                        <span className="text-muted mb-0 fs-12">
                                                                            <i className="ti ti-user me-1 fw-medium"></i>{task.assignee}
                                                                        </span>
                                                                        <div className="vr"></div>
                                                                        <SpkBadge variant="" Customclass={`${task.priority === 'High' ? 'bg-danger-transparent' : task.priority === 'Medium' ? 'bg-warning-transparent' : 'bg-success-transparent'}`}>
                                                                            {task.priority}
                                                                        </SpkBadge>
                                                                    </div>
                                                                </div>
                                                                <div className="text-end">
                                                                    <span className="d-block fw-medium">{task.dueDate}</span>
                                                                    <span className="d-block fs-12 text-muted">Due Date</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Card.Body>
                                </Tab.Container>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                        <div className="lead-title total">Total Leads</div>
                                        <div className="lead-title target">Leads Target</div>
                                    </div>
                                    <div className="progress-stacked progress-animate progress-sm my-3">
                                        <div className="progress-bar" role="progressbar" style={{ width: "68%" }} aria-valuenow={68} aria-valuemin={0} aria-valuemax={100}></div>
                                        <div className="progress-bar bg-success" role="progressbar" style={{ width: "32%" }} aria-valuenow={32} aria-valuemin={0} aria-valuemax={100}></div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap">
                                        <div><span className="text-success fw-medium me-2"><i className="ti ti-arrow-up me-1"></i>3.25%</span> Compared to last week</div>
                                        <div><Link to="#!" className="link-primary text-decoration-underline">Leads Report <i className="ti ti-arrow-narrow-right"></i></Link></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Leads By Source
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="leads-source">
                                <Spkapexcharts height={205} type="polarArea" width={"100%"} chartOptions={LeadOptions} chartSeries={LeadSeries} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                            <ListGroup as="ul" className="list-group-flush leads-source-list">
                                {TrafficSources.map((source, index) => (
                                    <ListGroup.Item as="li" className="" key={index}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="fw-semibold">{source.name}</div>
                                            <div className="lh-1 text-end">
                                                <span className="d-block fw-semibold mb-0">
                                                    <span className={`d-inline-flex align-items-center fw-medium me-2 fs-12 ${source.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                                                        <i className={`ti ti-arrow-${source.trend} me-1`}></i>
                                                        {source.percentage}
                                                    </span>
                                                    {source.count.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Top Deals
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled crm-top-deals">
                                {Deals.map((user, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-top flex-wrap">
                                            <div className="me-2">
                                                <span className="avatar avatar-sm avatar-rounded fw-semibold bg-primary-transparent">
                                                    {user.avatar ? (
                                                        <Image src={user.avatar} alt={user.name} />
                                                    ) : (
                                                        user.initials
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">{user.name}</p>
                                                <span className="text-muted fs-12">{user.email}</span>
                                            </div>
                                            <div className="fw-semibold fs-15">{user.amount}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Deals Statistics
                            </div>
                        </Card.Header>
                        <Card.Body className="py-0">
                            <div id="deals-statistics">
                                <Spkapexcharts height={351} type={"bar"} chartOptions={StaticOptions} chartSeries={StaticSeries} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={6}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Leads Overview
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Lead Name' }, { title: 'Company' }, { title: 'Status' }, { title: 'Source' }]}>
                                    {Overviewtable.map((lead, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image src={lead.avatar} alt={lead.name} />
                                                        </span>
                                                    </div>
                                                    <div>{lead.name}</div>
                                                </div>
                                            </td>
                                            <td>{lead.company}</td>
                                            <td>
                                                <SpkBadge variant="" Customclass={`${lead.status.colorClass}`}>{lead.status.label}</SpkBadge>
                                            </td>
                                            <td>{lead.source}</td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header>
                            <div className="card-title">
                                Top Deals
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <SpkTables tableClass="text-nowrap" header={[{ title: 'Deal ID' }, { title: 'Deal Name' }, { title: 'Client Name' }, { title: 'Deal Amount' }, { title: 'Status' }, { title: 'Closing Date' }, { title: 'Sales Rep' }, { title: 'Priority' }, { title: 'Actions' }]}>
                                    {TopdealsTable.map((deal, idx) => (
                                        <tr key={idx}>
                                            <td><Link to="#!">{deal.id}</Link></td>
                                            <td>{deal.title}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 position-relative">
                                                    <Link to="#!" className="stretched-link"></Link>
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image width={28} height={28} src={deal.companyLogo} alt={deal.companyName} />
                                                        </span>
                                                    </div>
                                                    <div>{deal.companyName}</div>
                                                </div>
                                            </td>
                                            <td>{deal.amount}</td>
                                            <td><SpkBadge variant="" Customclass={`${deal.status.colorClass}`}>{deal.status.label}</SpkBadge></td>
                                            <td>{deal.closeDate}</td>
                                            <td>{deal.owner}</td>
                                            <td>{deal.priority}</td>
                                            <td>
                                                <div className="btn-list">
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-primary-light btn-sm">
                                                        <i className="ti ti-edit"></i>
                                                    </SpkButton>
                                                    <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-danger-light btn-sm">
                                                        <i className="ti ti-trash"></i>
                                                    </SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </SpkTables>
                            </div>
                        </Card.Body>
                        <Card.Footer className="">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div> Showing 6 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i> </div>
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

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default CRM;