
import SpkTeamCard from "../../../shared/@spk-reusable-components/reusable-pages/spk-teamcard";
import { TeamMembers } from "../../../shared/data/pages/teamdata";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Row } from "react-bootstrap";

interface TeamProps { }

const Team: React.FC<TeamProps> = () => {

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Team" />

            <Pageheader title="Pages" currentpage="Team" activepage="Team" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1">
                {TeamMembers.map((idx, index) => (
                    <div className="col" key={index}>
                        <SpkTeamCard member={idx} />
                    </div>
                ))}
            </Row>

            {/* <!-- End:: row-1 --> */}

        </Fragment>
    )
};

export default Team;