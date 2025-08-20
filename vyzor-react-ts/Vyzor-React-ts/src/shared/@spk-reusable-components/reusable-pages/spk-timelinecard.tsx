import { Fragment } from "react";
import SpkBadge from "../general-reusable/reusable-uielements/spk-badge";

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  bgColor: string;
}

interface SpkTimelineCardProps {
  timeline: TimelineItem;
}

const SpkTimelineCard: React.FC<SpkTimelineCardProps> = ({ timeline }) => {
  return (
    <Fragment>
      <div className="timeline-step">
        <div className="timeline-content" data-toggle="popover" data-placement="top" title="" data-content="And here's some amazing content. It's very engaging. Right?" data-original-title={timeline.date}>
          <div className="timeline-date_time-container">
            <SpkBadge variant="" Customclass={`bg-${timeline.bgColor}`}>{timeline.date}</SpkBadge>
          </div>
          <div className={`inner-circle ${timeline.bgColor}`}></div>
          <p className="fw-medium mt-3 mb-1">{timeline.title}</p>
          <p className="text-muted mb-0 mb-lg-0">{timeline.description}</p>
        </div>
      </div>
    </Fragment>
  );
};

export default SpkTimelineCard;
