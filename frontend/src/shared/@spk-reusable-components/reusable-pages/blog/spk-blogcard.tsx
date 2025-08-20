
import { Fragment } from "react"
import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Types {
    image: string;
    title: string;
    desc: string;
  };
interface BlogCardProps {
    blog:Types
}

const SpkBlogCard:React.FC<BlogCardProps> = ({blog}) => {
    return (
        <Fragment>
            <Card className="custom-card border-0 blog-card shadow-none">
                <Card.Body className="p-0">
                    <Link to={`${import.meta.env.BASE_URL}pages/blog/blog-details`} className="stretched-link"></Link>
                    <div className="blog-image mb-3">
                        <Image src={blog.image} className="card-img" alt="..." />
                    </div>
                    <span className="d-block mb-1 text-primary blog-category">{blog.title}</span>
                    <h6 className="mb-0 blog-title lh-base">{blog.desc}</h6>
                </Card.Body>
            </Card>
        </Fragment>
    )
}
export default SpkBlogCard;