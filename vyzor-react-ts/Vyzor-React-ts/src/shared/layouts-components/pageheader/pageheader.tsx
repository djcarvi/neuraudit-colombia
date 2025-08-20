

import { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Pageheader = (props: any) => {
    
    return (
        <Fragment>
            <div className="mb-3 page-header-breadcrumb">
            <div className="d-flex align-center justify-content-between flex-wrap gap-2">
                <h1 className="page-title fw-medium fs-18 mb-0">{props.activepage}</h1>
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link  to="#!">{props.title}</Link></li>
                            {props.subtitle && (
                                <li className="breadcrumb-item">
                                    <Link  to="#!">{props.subtitle}</Link>
                                </li>
                            )}
                            <li className="breadcrumb-item active" aria-current="page">{props.currentpage}</li>
                        </ol>
                </div>
            </div>
        </Fragment>
    )
}

export default Pageheader