
import React, { Fragment } from 'react'
import { Card, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface Horizontal {
    Imagesrc?: string
    CardFooter?: boolean
    Footertext?: string
    Title?: string
    Linktag?: boolean;
    children?: React.ReactNode;
    CardHeader?: boolean;
    Imgposition?: string;
    Imgclass?: string;
    Navigate: string | URL;
}
const Spkhorizontalcards: React.FC<Horizontal> = ({ Imagesrc, CardHeader, Imgclass, Navigate, Imgposition, children, CardFooter, Title, Linktag, Footertext }) => {
    return (
        <Fragment>
            <Card className="custom-card">
                {Linktag ? <Link to={Navigate} className="card-anchor"></Link> : ''}
                <div className="row g-0">
                    {Imgposition === "before" ?
                        <div className="col-md-4">
                            <Image src={Imagesrc as string} className={Imgclass} alt="..." />
                        </div>
                        : ''}
                    <div className="col-md-8">
                        {CardHeader ?
                            <Card.Header>
                                <div className="card-title">{Title}</div>
                            </Card.Header>
                            : ''}

                        <Card.Body>
                            {children}
                        </Card.Body>

                        {CardFooter ?
                            <Card.Footer>
                                <p className="card-text"><small className="text-muted">{Footertext}</small></p>
                            </Card.Footer> : ''}
                    </div>

                    {Imgposition === "after" ?
                        <div className="col-md-4 ">
                            <Image src={Imagesrc as string} className="img-fluid rounded-end h-100 w-100" alt="..." />
                        </div>
                        : ''}
                </div>
            </Card>
        </Fragment>
    )
}

export default Spkhorizontalcards