
import React, { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import StarsIcon from "@mui/icons-material/Stars";
import { Card, Col, Row, } from "react-bootstrap";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import SpkRatings from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-ratings";
import SpkTooltips from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import SpkButton from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkBadge from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";

interface RatingsProps { }

const Ratings: React.FC<RatingsProps> = () => {

    const [ratingValue, setRatingValue] = useState<number | null>(0);
    const handleRatingChange = (_event: React.ChangeEvent<{}>, newValue: number | null) => {
        setRatingValue(newValue); // Update the rating value when the user clicks
    };

    const handleResetRating = () => {
        setRatingValue(0); // Clear the rating when the button is clicked
    };

    const [value, setValue] = useState<number | null>(2);
    const [hover, setHover] = useState<any>(-1);

    const labels = ["1", "2", "3", "4", "5"];
    function getLabelText(value: number) {
        return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value - 1]}`;
    }

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Ratings"} />

            <Pageheader title="Advanced Ui" currentpage="Ratings" activepage="Ratings" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xxl={12} xl={6} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Basic Rater
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center basic-rating" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h6 className="fs-14 fw-semibold">Show Some <span className="text-danger">&#10084;</span> with rating : </h6>
                                <SpkRatings name="half-rating" size="large" defaultValue={0} max={5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={6} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                5 star rater with steps
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h6 className="fs-14 fw-semibold mb-0">Dont forget to rate the product :</h6>
                                <SpkRatings name="half-rating" defaultValue={0} precision={0.5} max={5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Custom messages
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h6 className="fs-14 fw-semibold">Your rating is much appreciated&#128079; :</h6>
                                <SpkRatings name="full-rating" defaultValue={4} precision={1} size="large" max={5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={12} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Unlimited number of stars readOnly
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h6 className="fs-14  fw-semibold">Thanks for rating :</h6>
                                <SpkRatings name="half-rating-read" defaultValue={6} precision={1} max={10} size="large" readOnly />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={12} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                5 Star rater with custom isBusyText and simulated backend
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h6 className="fs-14 fw-semibold">Thanks for rating :</h6>
                                <SpkRatings name="full-rating" defaultValue={0} precision={1} max={5} size="large" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={6} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                On hover event
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h6 className="fs-14  fw-semibold">Please give your valuable rating :</h6>
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    <Box sx={{ width: 200, display: "flex", alignItems: "start" }}>
                                        <SpkRatings name="hover-feedback" value={value} precision={0.5} getLabelText={getLabelText} onChange={(_event, newValue) => setValue(newValue)} onChangeActive={(_event, newHover) => setHover(newHover)} Icon={<StarsIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                        {value !== null && (
                                            <Box className="rating-stars my-rating-9 rating-9" sx={{ ml: 2 }}>
                                                <SpkBadge variant="success-transparent" Customclass="live-rating badge bg-success-transparent ms-3">
                                                    {labels[hover !== -1 ? hover - 1 : value - 1]}
                                                </SpkBadge>
                                            </Box>
                                        )}
                                    </Box>

                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={12} xl={6} className="">
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Clear/reset rater
                            </div>
                        </Card.Header>
                        <Card.Body className="text-center" id="rating-value">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <p className="fs-14 mb-0 fw-semibold">Thank You so much for your support :</p>
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    <SpkRatings name="clickable-rating" value={ratingValue} onChange={handleRatingChange} />
                                    <SpkTooltips placement="top" title="Reset">
                                        <SpkButton Buttonvariant='danger-light' Customclass="btn btn-icon btn-sm ms-3" Id="rater-reset-button" onClickfunc={handleResetRating}>
                                            <i className="ri-restart-line"></i>
                                        </SpkButton>
                                    </SpkTooltips>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

        </Fragment>
    )
};

export default Ratings;