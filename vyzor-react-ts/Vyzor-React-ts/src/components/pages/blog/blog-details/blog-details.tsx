
import { CategoryStats, PopularPosts, Tags } from "../../../../shared/data/pages/blog/blogdetailsdata";

import React, { Fragment, useState } from "react";
import { Card, Col, Collapse, Dropdown, Form, Image, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkCard from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/reusable-cards/spk-basiccard";
import SpkDropdown from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import { Link } from "react-router-dom";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import blog27 from '../../../../assets/images/media/blog/27.jpg';
import face2 from '../../../../assets/images/faces/2.jpg';
import face3 from '../../../../assets/images/faces/3.jpg';
import face4 from '../../../../assets/images/faces/4.jpg';
import face13 from '../../../../assets/images/faces/13.jpg';
import face14 from '../../../../assets/images/faces/14.jpg';

interface BlogDetailsProps {}

const BlogDetails:React.FC<BlogDetailsProps> = () => {

    const Years: number[] = [2024, 2023, 2022, 2021, 2020, 2019];
    const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});

    const toggleReply = (id: string) => {
      setOpenReplies(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    };
    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Blog-Blogdetails" />

            <Pageheader title="Pages" subtitle="Blog" currentpage="Blog Details" activepage="Blog Details" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={9}>
                    <h3 className="fw-medium mb-3">The Future of Artificial Intelligence: Trends to Watch in 2025</h3>
                    <Card className="custom-card">
                        <Image  src={blog27} className="card-img-top" alt="..." />
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="lh-1">
                                        <span className="avatar avatar-xs avatar-rounded">
                                            <Image  src={face13} alt="" />
                                        </span>
                                    </div>
                                    <div>
                                        John Doe
                                    </div>
                                    <div>
                                        <SpkBadge variant="" Customclass="bg-primary-transparent">Technology</SpkBadge>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 text-muted">
                                    <div className="d-inline-flex align-items-center"><i className="ti ti-calendar-event fs-16 me-2"></i>March 15, 2025</div>
                                    <div>1.2K Views</div>
                                </div>
                            </div>
                            <div className="blog-details-area">
                                <p>The rapid advancements in Artificial Intelligence (AI) have already begun transforming industries, and the next decade promises even more exciting innovations. As we look toward 2025, several key trends will define the future of AI and shape the way businesses, governments, and individuals interact with technology. Here’s a look at what to expect from the AI revolution in the coming years.</p>
                                <h5>1. AI-Powered Personal Assistants</h5>
                                <p>Artificial intelligence is evolving rapidly to make personal assistants smarter and more intuitive. Virtual assistants, powered by AI, will become increasingly capable of understanding complex tasks and personal preferences. Whether it's scheduling appointments, managing emails, or providing personalized recommendations, AI will become a more integral part of our daily lives.</p>
                                <h5>2. Autonomous Systems and Self-Driving Vehicles</h5>
                                <p>The field of autonomous vehicles has made huge strides, and by 2025, we expect self-driving cars to become much more prevalent. With advancements in AI and machine learning algorithms, self-driving cars are expected to improve in safety, efficiency, and affordability, potentially revolutionizing transportation and mobility.</p>
                                <SpkCard cardClass="card-bg-primary" bodyText={(
                                    <>
                                        <blockquote className="blockquote mb-0 text-center">
                                            <h5 className="text-fixed-white lh-base">This highlights how AI is expected to revolutionize industries just as electricity did in the past, <br /> becoming a core part of almost every sector..</h5> <footer className="blockquote-footer mt-3 fs-14 text-fixed-white op-7">Someone famous as <cite title="Source Title">-Andrew Ng</cite></footer> </blockquote>
                                    </>
                                )}
                                />
                                <h5>3. AI in Healthcare</h5>
                                <p>AI is already being used to predict diseases, assist in diagnostics, and provide personalized treatment options. By 2025, AI will play an even larger role in healthcare, including innovations like AI-powered robotic surgery, precision medicine, and real-time health monitoring. The AI-driven healthcare industry will help reduce human error, lower costs, and improve outcomes for patients.</p>
                                <h5>4. The Rise of Ethical AI</h5>
                                <p>As AI continues to shape the future, the focus on ethics will become more important than ever. There will be an increasing demand for AI systems to be transparent, fair, and accountable. Companies and governments will invest in frameworks and guidelines to ensure that AI is used responsibly, without reinforcing biases or discrimination.</p>
                                <h5>5. AI-Driven Automation in the Workplace</h5>
                                <p>Automation is transforming industries by increasing efficiency and reducing costs. By 2025, AI will continue to automate tasks across multiple sectors, from manufacturing and logistics to customer service and data analysis. As a result, businesses will experience greater productivity, while workers will need to adapt and learn new skills to stay relevant in the evolving job market.</p>
                                <h5>Conclusion</h5>
                                <p>Artificial Intelligence is poised to disrupt nearly every industry over the next decade. From personalized AI assistants to autonomous vehicles and smarter healthcare systems, the future of AI will create both exciting opportunities and significant challenges. To stay competitive and adapt to this rapidly changing landscape, businesses and individuals must embrace the potential of AI and prepare for the transformation it will bring. In the coming years, those who are prepared to leverage AI will be at the forefront of innovation.</p>
                            </div>
                            <div className="blog-comments mb-4">
                                <Card className="custom-card">
                                    <Card.Header>
                                        <div className="card-title">
                                            Comments
                                        </div>
                                    </Card.Header>
                                    <Card.Body id="blog-details-comment-list">
                                        <div className="mb-3 overflow-visible d-flex align-items-start flex-wrap">
                                            <div className="me-3">
                                                <span className="avatar avatar-rounded avatar-md">
                                                    <Image src={face2} alt="img" />
                                                </span>
                                            </div>
                                            <div className="media-body overflow-visible flex-fill">
                                                <div className="mb-4">
                                                    <nav className="nav float-end">
                                                        <SpkDropdown Togglevariant="" toggleas="a" Icon={true} Customtoggleclass="text-muted fs-16 p-0 ps-4 no-caret" IconClass="fe fe-more-vertical" Menuclass="dropdown-menu-start">
                                                                <Dropdown.Item className="" ><i className="fe fe-edit me-1 d-inline-block"></i> Edit</Dropdown.Item>
                                                                <Dropdown.Item className="" ><i className="fe fe-flag me-1 d-inline-block"></i> Report Abuse</Dropdown.Item>
                                                                <Dropdown.Item className="" ><i className="fe fe-trash-2 me-1 d-inline-block"></i> Delete</Dropdown.Item>
                                                        </SpkDropdown>
                                                    </nav>
                                                    <h6 className="mt-0">JohnDoe23 <span className="text-muted fs-12 ms-1">1 day ago</span></h6>
                                                    <span><i className="fe fe-thumb-up text-danger"></i></span>
                                                    <p className="font-13 text-muted">This is a fascinating read! AI is truly shaping the future in ways we never imagined. Excited to see what’s next!</p>
                                                    <span className="reply" id="1">
                                                        <Link  data-bs-toggle="collapse" onClick={() => toggleReply("1")} to="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"><span className="px-2 py-1 rounded bg-light text-muted fs-12 border d-inline-flex align-items-center">Reply<i className="ti ti-share-3 ms-1"></i></span></Link>
                                                    </span>
                                                    <Collapse in={openReplies["1"]} className="collapse" >
                                                        <div>
                                                            <Form.Control as="textarea" defaultValue="" className="form-control mb-2 mt-3" id="text-area" rows={3} placeholder="Write a reply ..." />
                                                            <div className="text-end">
                                                                <SpkButton Buttonvariant="primary" Customclass="btn btn-wave btn-sm">Post</SpkButton>
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="media mb-2 overflow-visible  d-flex flex-wrap">
                                                    <div className="me-3">
                                                        <span className="avatar avatar-rounded avatar-md">
                                                            <Image src={face3} alt="img" />
                                                        </span>
                                                    </div>
                                                    <div className="media-body overflow-visible flex-fill">
                                                        <nav className="nav float-end">
                                                        <SpkDropdown Togglevariant="" toggleas="a" Icon={true} Customtoggleclass="text-muted fs-16 p-0 ps-4 no-caret" IconClass="fe fe-more-vertical" Menuclass="dropdown-menu-start">
                                                                <Dropdown.Item className="" ><i className="fe fe-edit me-1 d-inline-block"></i> Edit</Dropdown.Item>
                                                                <Dropdown.Item className="" ><i className="fe fe-flag me-1 d-inline-block"></i> Report Abuse</Dropdown.Item>
                                                                <Dropdown.Item className="" ><i className="fe fe-trash-2 me-1 d-inline-block"></i> Delete</Dropdown.Item>
                                                        </SpkDropdown>
                                                        </nav>
                                                        <h6 className="mt-0 d-flex align-items-center gap-2 flex-wrap">TechEnthusiast99<span className="badge text-muted bg-light border">Reply to JohnDoe23</span><span className="text-muted fs-12 ms-1">2 min ago</span></h6>
                                                        <span><i className="fe fe-thumb-up text-danger"></i></span>
                                                        <p className="font-13 text-muted">I love how AI is revolutionizing different industries, but do you think it will ever fully replace human creativity?</p>
                                                        <span className="reply" id="2">
                                                            <Link data-bs-toggle="collapse" onClick={() => toggleReply("2")} to="#collapseExample1" role="button" aria-expanded="false" aria-controls="collapseExample1"><span className="px-2 py-1 rounded bg-light text-muted fs-12 border d-inline-flex align-items-center">Reply<i className="ti ti-share-3 ms-1"></i></span></Link>
                                                        </span>
                                                        <Collapse in={openReplies["2"]} className="collapse" >
                                                        <div>
                                                            <Form.Control as="textarea" defaultValue="" className="form-control mb-2 mt-3" id="text-area" rows={3} placeholder="Write a reply ..." />
                                                            <div className="text-end">
                                                                <SpkButton Buttonvariant="primary" Customclass="btn btn-wave btn-sm">Post</SpkButton>
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="media mb-0 overflow-visible d-flex align-items-start flex-wrap">
                                            <div className="me-3">
                                                <span className="avatar avatar-rounded avatar-md">
                                                    <Image  src={face4} alt="img" />
                                                </span>
                                            </div>
                                            <div className="media-body overflow-visible flex-fill">
                                                <div>
                                                    <nav className="nav float-end">
                                                    <SpkDropdown Togglevariant="" toggleas="a" Icon={true} Customtoggleclass="text-muted fs-16 p-0 ps-4 no-caret" IconClass="fe fe-more-vertical" Menuclass="dropdown-menu-start">
                                                                <Dropdown.Item className="" ><i className="fe fe-edit me-1 d-inline-block"></i> Edit</Dropdown.Item>
                                                                <Dropdown.Item className="" ><i className="fe fe-flag me-1 d-inline-block"></i> Report Abuse</Dropdown.Item>
                                                                <Dropdown.Item className="" ><i className="fe fe-trash-2 me-1 d-inline-block"></i> Delete</Dropdown.Item>
                                                        </SpkDropdown>
                                                    </nav>
                                                    <h6 className="mt-0">FutureCoder<span className="text-muted fs-12 ms-1">27 Mar 2025 - 10:45AM</span></h6>
                                                    <p className="font-13 text-muted">Great insights! AI has come a long way, but ethical concerns around automation still need to be addressed.</p>
                                                    <span className="reply" id="3">
                                                        <Link  data-bs-toggle="collapse" onClick={() => toggleReply("3")} to="#collapseExample2" role="button" aria-expanded="false" aria-controls="collapseExample2"><span className="px-2 py-1 rounded bg-light text-muted fs-12 border d-inline-flex align-items-center">Reply<i className="ti ti-share-3 ms-1"></i></span></Link>
                                                    </span>
                                                    <Collapse in={openReplies["3"]} className="collapse" >
                                                        <div>
                                                            <Form.Control as="textarea" defaultValue="" className="form-control mb-2 mt-3" id="text-area" rows={3} placeholder="Write a reply ..." />
                                                            <div className="text-end">
                                                                <SpkButton Buttonvariant="primary" Customclass="btn btn-wave btn-sm">Post</SpkButton>
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="blog-comments-create">
                                <div className="row gy-3">
                                    <Col xl={12}>
                                        <Form.Label htmlFor="blog-first-name" className="">Name</Form.Label>
                                        <Form.Control type="text" defaultValue={""} className="form-control-light" id="blog-first-name" placeholder="Enter Name" />
                                    </Col>
                                    <Col xl={12}>
                                        <Form.Label htmlFor="blog-comment" className="">Write Comment</Form.Label>
                                        <Form.Control as="textarea" className="form-control form-control-light" id="blog-comment" rows={5} defaultValue={""} />
                                    </Col>
                                    <Col xl={12}>
                                        <div className="btn-list float-end">
                                            <SpkButton Buttonvariant="light" Customclass="btn btn-icon border">
                                                <i className="ti ti-paperclip"></i>
                                            </SpkButton>
                                            <SpkButton Buttonvariant="primary" Customclass="btn float-end">Post Comment</SpkButton>
                                        </div>
                                    </Col>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body className="p-5 text-center">
                                    <div className="lh-1 mb-2">
                                        <span className="avatar avatar-rounded blogger-details-avatar">
                                            <Image  src={face14} alt="" />
                                        </span>
                                    </div>
                                    <h5 className="fw-semibold mb-0">John Doe</h5>
                                    <span className="d-block text-muted mb-3">Tech Blogger</span>
                                    <p>Jhon Doe, an AI and tech writer, explores emerging trends, innovations, and their impact on everyday life.</p>
                                    <div className="btn-list">
                                            <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-facebook btn-wave rounded-circle">
                                                <i className="ri-facebook-line lh-1"></i>
                                            </SpkButton>
                                            <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-twitter btn-wave rounded-circle">
                                                <i className="ri-twitter-x-line lh-1"></i>
                                            </SpkButton>
                                            <SpkButton Customclass="btn btn-icon btn-instagram btn-wave rounded-circle">
                                                <i className="ri-instagram-line lh-1"></i>
                                        </SpkButton>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Body>
                                    <div className="text-center">
                                        <h5 className="fw-semibold mb-3">Never Miss A Post!</h5>
                                        <label className="form-check-label mb-4">Subscribe for free and be the first to receive updates and exclusive content! </label>
                                        <div className="input-group">
                                            <Form.Control type="text" className="" placeholder="Email Here" aria-label="blog-email" aria-describedby="blog-subscribe" />
                                            <SpkButton Buttonvariant="primary" Customclass="btn btn-wave waves-effect waves-light" Buttontype="button" >Subscribe</SpkButton>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Top Categories
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled top-blog-categories-list">
                                        {CategoryStats.map((item, index) => (
                                            <li key={index}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="flex-fill fw-medium">{item.name}</div>
                                                    <div>
                                                        <SpkBadge variant="" Customclass={`${item.badgeClass} rounded-pill`}>
                                                            {item.count.toLocaleString()}
                                                        </SpkBadge>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card overflow-hidden">
                                <Card.Header className="justify-content-between">
                                    <Card.Title>
                                        Blogs you may like
                                    </Card.Title>
                                    <Link  to="#!" className="fs-13 text-muted text-decoration-underline">View All<i className="ti ti-arrow-narrow-right"></i></Link>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ul className="list-group list-group-flush">
                                        {PopularPosts.map((post, index) => (
                                            <li className="list-group-item" key={index}>
                                                <Link  to="#!" className="stretched-link"></Link>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="lh-1">
                                                        <span className="avatar avatar-xl">
                                                            <Image  src={post.image} alt={post.title} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-fill">
                                                        <div className="popular-blogs-title fw-semibold mb-1">{post.title}</div>
                                                        <span className="d-block text-muted fs-13 fw-normal">{post.dateViews}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Popular Tags
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        {Tags.map((idx, index) => (
                                            <Link  key={index} to="#!" className="badge bg-primary-transparent">{idx.title}</Link>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Archive
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled blog-archive">
                                        {Years.map((year) => (
                                            <li key={year}>
                                                <Link  to="#!" className="stretched-link"></Link>
                                                <div className="d-flex align-items-center gap-5 justify-content-between">
                                                    <div>{year}</div>
                                                    <div>
                                                        <i className="ti ti-chevron-right"></i>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}
            
        </Fragment>
    )
};

export default BlogDetails;