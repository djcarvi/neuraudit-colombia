
import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface SpkTooltipsProps {
    title: string;
    id?: string;
    children: any;
    tooltipClass?: string;
    trigger?: any;
    placement?: 'top' | 'bottom' | 'left' | 'right' |'auto'; //make placement optional 
}

const SpkTooltips: React.FC<SpkTooltipsProps> = (
    {
        title,
        id,
        children,
        tooltipClass,
        trigger,
        placement
    }
) => {

    return (
        <OverlayTrigger placement={placement} trigger={trigger} overlay={<Tooltip id={id} className={tooltipClass} >{title}</Tooltip>} >
            {children}
        </OverlayTrigger>
    )
}

export default SpkTooltips