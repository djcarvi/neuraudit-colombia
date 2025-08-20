
import React, { Fragment } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

interface SpkPopoversProps {
    title?: string;
    content?: React.ReactNode;
    trigger?: 'click' | 'hover' | 'focus';
    placement?: 'top' | 'bottom' | 'left' | 'right';
    popoverClass?: string;
    headerClass?: string;
    bodyClass?: string;
    children?: any;
    rootClose?: boolean;
}

const SpkPopovers: React.FC<SpkPopoversProps> = ({ title, content, trigger, placement, popoverClass, headerClass, bodyClass, children, rootClose = false }) => {
    return (
        <Fragment>
            <OverlayTrigger
                rootClose={rootClose}
                trigger={trigger}
                placement={placement}
                overlay={
                    <Popover className={popoverClass}>
                        <Popover.Header as="h3" className={headerClass}>{title}</Popover.Header>
                        <Popover.Body className={bodyClass}>
                            {content}
                        </Popover.Body>
                    </Popover>
                }
            >
                {children}
            </OverlayTrigger>
        </Fragment>
    );
};

export default SpkPopovers;
