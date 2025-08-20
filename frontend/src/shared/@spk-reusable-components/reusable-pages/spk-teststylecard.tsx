
import { Card, Image } from "react-bootstrap";


export interface Review {
  title: string;
  stars: any;
  description: string;
  name: string;
  role: string;
  imgSrc: string;
}

interface SpkTeststyleCardProps {
  style: Review;
  cardClass?:string;
}

const SpkTeststyleCard = ({ style,cardClass }: SpkTeststyleCardProps) => {
  return (
    <Card className={`custom-card testimonial-style-2-card ${cardClass}`}>
      <Card.Body className="p-5">
        <h5 className="fw-semibold mb-3">{style.title}</h5>
        <div className="mb-3 text-muted">{style.description}</div>
        <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
          <div className="lh-1">
            <span  className="avatar rounded-circle me-2">
              <Image src={style.imgSrc} alt="" className="img-fluid rounded-circle object-fit-cover"/>
            </span>
          </div>
          <div className="flex-fill">
            <span className="d-block fw-semibold">{style.name}</span>
            <span className="text-muted fs-13">{style.role}</span>
          </div>
          <div className="text-warning d-block ms-1">{style.stars}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SpkTeststyleCard;
