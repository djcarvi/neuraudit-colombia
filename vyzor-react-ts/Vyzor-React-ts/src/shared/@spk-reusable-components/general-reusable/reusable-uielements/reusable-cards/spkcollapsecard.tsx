
import React, { Fragment, useState } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import SpkButton from '../spk-buttons';
import { Link } from 'react-router-dom';

interface Collapsecards {
    Customheaderclass?: string
    Expand?: boolean | undefined;
    children?: React.ReactNode;
    footertext?: string;
    Title?: string;
    Color?: string;
    Timeout?: number;
    Customimgclass?: string;
    OnClickFunc?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
    Navigate: string | URL;
    closeButton?: boolean;
    expandButton?: boolean;
    collapseToggle?: boolean;
    normalToggle?: boolean;
    fullScreenButton?: boolean;
    hideToggle?: boolean
}
const SpkCollapsecard: React.FC<Collapsecards> = ({ Customheaderclass, OnClickFunc, expandButton = false, collapseToggle = false, normalToggle = false, hideToggle = false, children, Title, footertext, Navigate, }) => {

    const [BasicExpanded, setBasicExpanded] = useState(true);

    const BasicHandleExpandClick = () => {
        setBasicExpanded(!BasicExpanded);
    };

    //Card With Close Button
    const [Basicshow, setBasicshow] = useState(true);

    return (
        <Fragment>
            {Basicshow ?
                <Card className="custom-card">
                    <Card.Header className={`card-header justify-content-between border-bottom-0 ${Customheaderclass}`}>
                        {collapseToggle && <Card.Title>
                            {Title}
                        </Card.Title>
                        }
                        {hideToggle &&
                            Basicshow ?
                            <Card.Title>
                                {Title}
                            </Card.Title> : null
                        }

                        {
                            normalToggle &&
                            <Card.Title>
                                {Title}
                            </Card.Title>
                        }
                        {expandButton &&
                            <Link to={Navigate} onClick={BasicHandleExpandClick} >
                                <i className={`ri-${BasicExpanded ? 'arrow-down-s-line' : 'arrow-up-s-line'} fs-18`}></i>
                            </Link>
                        }
                        {
                            hideToggle &&
                                Basicshow ?
                                <Link to={Navigate} onClick={() => setBasicshow(false)} >
                                    <i className='ri-close-line fs-18'></i>
                                </Link> : null
                        }
                        {
                            normalToggle &&
                            <Link to={Navigate} onClick={OnClickFunc} >
                                <i className="ri-fullscreen-line"></i>
                            </Link>

                        }
                    </Card.Header>
                    {
                        collapseToggle &&
                        <>
                            <Collapse className="border-top" in={BasicExpanded} timeout={3000}>
                                <div>
                                    <Card.Body>
                                        {children}
                                    </Card.Body>
                                    <Card.Footer>
                                        <SpkButton Buttonvariant="primary">{footertext}</SpkButton>
                                    </Card.Footer>
                                </div>
                            </Collapse>
                        </>
                    }

                    {
                        hideToggle &&
                            Basicshow ? <>
                            <Card.Body className="border-top">
                                {children}
                            </Card.Body>
                            <Card.Footer>
                                <SpkButton Buttonvariant="primary">{footertext}</SpkButton>
                            </Card.Footer>
                        </> : null
                    }


                    {
                        normalToggle &&
                        <>
                            <Card.Body className="border-top">
                                {children}
                            </Card.Body>
                            <Card.Footer>
                                <SpkButton Buttonvariant="primary">{footertext}</SpkButton>
                            </Card.Footer>
                        </>
                    }

                </Card> : null
            }

        </Fragment >
    )
}

export default SpkCollapsecard
