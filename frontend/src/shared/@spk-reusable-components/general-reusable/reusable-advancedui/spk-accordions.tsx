
import React, { useState, Fragment } from 'react';
import { Accordion } from 'react-bootstrap';

interface AccordionItem {
    footer?: React.JSX.Element;
    id?: any;
    title?: string;
    content?: React.ReactNode;
    itemClass?: any;
    accordionHead?: string
}

interface SpkAccordionsProps {
    items?: AccordionItem[] | any;
    defaultActiveKey?: number;
    flush?: boolean;
    accordionClass?: string;
    closeAll?: boolean;
    footer?: boolean;
    alwaysopen?: boolean;
    bodyClass?: string;
}

const SpkAccordions: React.FC<SpkAccordionsProps> = ({ items, bodyClass, defaultActiveKey, flush = false, alwaysopen = false, accordionClass, closeAll = false }) => {

    const [activeKey, setActiveKey] = useState<string | null>(
        closeAll ? null : (defaultActiveKey || (items.length > 0 ? items[0].id : null))
    );

    return (
        <Fragment>
            <Accordion alwaysOpen={alwaysopen} className={accordionClass} activeKey={activeKey} flush={flush} onSelect={(k: any) => setActiveKey(k)}>
                {items.map((item: AccordionItem, index: number) => (
                    <Accordion.Item eventKey={item.id} className={item.itemClass} key={item.id || `${item.title}-${index}`}>
                        <Accordion.Header className={item.accordionHead}>{item.title}</Accordion.Header>
                        <Accordion.Body className={bodyClass}>{item.content}</Accordion.Body>
                        {item.footer && <div className="accordion-footer">{item.footer}</div>}
                    </Accordion.Item>
                ))}
            </Accordion>
        </Fragment>
    );
};

export default SpkAccordions;