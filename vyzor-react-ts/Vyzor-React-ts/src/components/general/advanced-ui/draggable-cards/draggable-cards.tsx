
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import Draggabledata from "../../../../shared/data/general/adavanec-ui/draggabledata";

interface DraggableCardsProps { }

const DraggableCards: React.FC<DraggableCardsProps> = () => {
    return (
        <Fragment>

            <Seo title={"Draggable Cards"} />

            <Pageheader title="Advanced Ui" currentpage="Draggable Cards" activepage="Draggable Cards" />

            <Draggabledata />

        </Fragment>
    )
};

export default DraggableCards;