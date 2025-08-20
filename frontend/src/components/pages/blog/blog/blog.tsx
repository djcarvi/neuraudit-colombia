
import React, { Fragment } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Spkimageoverlaycard from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/reusable-cards/spkimageoverlaycard";
import { BlogCards, BlogCategoryCards, BlogPosts, PopularBlogs, TopStories } from "../../../../shared/data/pages/blog/blogdata";
import SpkBlogCard from "../../../../shared/@spk-reusable-components/reusable-pages/blog/spk-blogcard";
import { Link } from "react-router-dom";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkPopularCard from "../../../../shared/@spk-reusable-components/reusable-pages/blog/spk-popularcard";
import blog1 from '../../../../assets/images/media/blog/1.jpg';
interface BlogProps {}

const Blog:React.FC<BlogProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Blog-Blog" />

            <Pageheader title="Pages" subtitle="Blog" currentpage="Blog" activepage="Blog" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xxl={5}>
                    <Spkimageoverlaycard CardHeader={false} stretchedLink={true} CustomClass="overlay-card blog-card" Custombodyclass="text-fixed-white" Imgsrc={blog1} Customimgclass="card-img" Customfooterclass="text-fixed-white" CardFooter={false}>
                        <div className="card-text text-fixed-white">
                            <div className="card-img-overlay d-flex flex-column p-0 over-content-bottom">
                                <div className="card-body text-fixed-white">
                                    <div className="text-fixed-white fs-14 mb-2">
                                        FEATURED POST
                                    </div>
                                    <div className="card-text mb-2 fs-2 fw-semibold lh-sm">Exploring the Future of Artificial Intelligence</div>
                                </div>
                            </div>
                        </div>
                    </Spkimageoverlaycard>
                </Col>
                <Col xxl={4}>
                    <Row>
                        {BlogPosts.map((idx, index) => (
                            <div className="col-xl-6" key={index}>
                                <SpkBlogCard blog={idx} />
                            </div>
                        ))}
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card">
                        <div className="card-header justify-content-between">
                            <div className="card-title">
                                Top Stories
                            </div>
                            <Link  to="#!" className="fs-13 text-muted text-decoration-underline">View All <i className="ti ti-arrow-narrow-right"></i></Link>
                        </div>
                        <Card.Body>
                            <ul className="list-unstyled blog-top-stories-list">
                                {TopStories.map((story, index) => (
                                    <li key={index}>
                                        <Link  to={`${import.meta.env.BASE_URL}pages/blog/blog-details/`} className="stretched-link"></Link>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-xl">
                                                    <Image src={story.image} alt={story.title} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <SpkBadge variant="" Customclass={`${story.badgeClass}`}>{story.badgeText}</SpkBadge>
                                                <h6 className="fw-semibold mb-0 lh-base top-stories-title mt-1">{story.title}</h6>
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

            {/* <!-- Start:: row-2 --> */}

            <Col xl={12}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-semibold">Popular Topics</h5>
                    <p className="mb-0 fw-semibold">
                        <Link  to="#!" className="text-primary"><u>View All</u></Link>
                    </p>
                </div>
                <Row className="">
                    {BlogCategoryCards.map((idx, index) => (
                        <SpkPopularCard key={index} blog={idx} />
                    ))}
                </Row>

            </Col>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row className="row-deck">
                <Col xxl={9}>
                    <Row>
                        {BlogCards.map((idx, index) => (
                            <Col xl={3} lg={4} md={6} className="" key={index}>
                                <SpkBlogCard blog={idx} />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xxl={3}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Popular Blogs
                            </div>
                            <Link  to="#!" className="fs-13 text-muted text-decoration-underline">View All <i className="ti ti-arrow-narrow-right"></i></Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ul className="list-group list-group-flush list-popular-blogs ">
                                {PopularBlogs.map((blog, index) => (
                                    <li className="list-group-item" key={index}>
                                        <Link  to={`${import.meta.env.BASE_URL}pages/blog/blog-details`} className="stretched-link"></Link>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="lh-1">
                                                <span className="avatar avatar-xl">
                                                    <Image src={blog.image} alt={blog.title} />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <div className="popular-blogs-title fw-semibold mb-1">{blog.title}</div>
                                                <span className="d-block text-muted fs-13 fw-normal">{blog.dateViews}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default Blog;