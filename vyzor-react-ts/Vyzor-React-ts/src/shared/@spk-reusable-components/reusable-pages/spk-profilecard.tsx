
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import SpkButton from "../general-reusable/reusable-uielements/spk-buttons";

interface ProfileData {
  imgSrc: string;
  name: string;
  mail?: string;
  color?: string; 
  icon?: string; 
  followers?:string;
}

interface SpkProfileCardProps {
  profile: ProfileData;
  cardClass?: string;
  bodyClass?: string;
}

const SpkProfileCard: React.FC<SpkProfileCardProps> = ({ profile, cardClass, bodyClass }) => {
  return (
    <Fragment>
      <Card className={`custom-card ${cardClass}`}>
        <Card.Body className={bodyClass}>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="lh-1">
              <span className="avatar avatar-lg avatar-rounded">
                <Image src={profile.imgSrc} alt={profile.name} />
              </span>
            </div>
            <div className="flex-fill">
              <span className="fw-semibold d-block">{profile.name}</span>
              <span className="text-muted fs-13">{profile.mail}</span>
            </div>
            <div>
              <SpkButton Buttonvariant="" Customclass={`btn btn-${profile.color}-ghost`}><i className={`ri-user-${profile.icon}-line me-1`}></i>{profile.followers}</SpkButton>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkProfileCard;
