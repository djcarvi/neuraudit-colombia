
import { Fragment } from "react"
import { Card, Image } from "react-bootstrap";

interface Types {
    stars: any;
    description?: string;
    imgSrc?: any;
    title?: string;
    role?: string;
    name?:string;
}

interface SpkTestimonialcardProps {
    test: Types;
    cardClass?: string;
}

const SpkTestimonialcard: React.FC<SpkTestimonialcardProps> = ({ test, cardClass }) => {

    return (

        <Fragment>
            <Card className={`custom-card mb-0 ${cardClass}`}>
                <Card.Body className="p-5 pb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                        <h5 className="fw-semibold mb-0">{test.title}</h5>
                        <div className="text-warning fs-14 my-auto">
                            {test.stars}
                        </div>
                    </div>
                    <p className="mb-3 text-muted">
                        {test.description}
                    </p>
                    <div className="d-flex align-items-start justify-content-end gap-2">
                        <div className="lh-1">
                            <span className="avatar avatar-md avatar-rounded">
                                <Image  src={test.imgSrc} alt="" />
                            </span>
                        </div>
                        <div>
                            <span className="d-block fw-semibold">{test.name}</span>
                            <span className="text-muted fs-13">{test.role}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )

}
export default SpkTestimonialcard;