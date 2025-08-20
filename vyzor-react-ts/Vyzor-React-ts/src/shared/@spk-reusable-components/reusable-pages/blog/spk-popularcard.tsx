
import { Fragment } from "react"
import { Card, Image } from "react-bootstrap"
import { Link } from "react-router-dom";

interface Types {
    imgSrc:string;
    title:string;
}

interface SpkPopularCardProps {
    blog:Types;
}

const SpkPopularCard:React.FC<SpkPopularCardProps> = ({blog}) => {

    return (
        <Fragment>
            <div className="col-6 col-xl">
                <Link  to="#!">
                    <Card className="custom-card overlay-card blog-card text-fixed-white">
                        <Image  src={blog.imgSrc} className="card-img" alt="..." />
                        <div className="card-img-overlay d-flex flex-column p-0 over-content-bottom">
                            <div className="card-footer border-top-0 text-center">
                                <h6 className="fw-semibold mb-0 text-fixed-white">{blog.title}</h6>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>
        </Fragment>
    )
}
export default SpkPopularCard;