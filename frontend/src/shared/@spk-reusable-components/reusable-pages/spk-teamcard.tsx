
import { Fragment } from "react";
import { Card, Image } from "react-bootstrap";
import SpkButton from "../general-reusable/reusable-uielements/spk-buttons";

export interface TeamMember {
  imgSrc: string;
  name: string;
  role: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface SpkTeamCardProps {
  member: TeamMember;
}

const SpkTeamCard: React.FC<SpkTeamCardProps> = ({ member }) => {
  const Icons = [
    { platform: "facebook", icon: "facebook-circle", url: member.socials?.facebook },
    { platform: "twitter", icon: "twitter-x", url: member.socials?.twitter },
    { platform: "linkedin", icon: "linkedin-box", url: member.socials?.linkedin },
  ];

  return (
    <Fragment>
      <Card className="custom-card">
          <Image src={member.imgSrc} alt={member.name}  className="card-img-top" style={{ borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}/>
        <Card.Body className="text-center">
          <h6 className="fw-semibold mb-0">{member.name}</h6>
          <span className="text-muted fs-13">{member.role}</span>
          <div className="mt-3 justify-content-center d-flex gap-2">
            {Icons.map((idx, index) =>
              idx.url ? (
                <SpkButton Buttonvariant="" key={index} Customclass="btn btn-light btn-icon rounded-circle border">
                  <i className={`ri-${idx.icon}-fill lh-1`}></i>
                </SpkButton>
              ) : null
            )}
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default SpkTeamCard;
