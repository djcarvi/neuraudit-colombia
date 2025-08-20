
import React, { Fragment } from 'react'
import { Breadcrumb } from 'react-bootstrap'

interface Breadcrumbprops {
  bsPrefix?: string;
  as?: React.ElementType;
  Customclass?: string;
  Label?: string;
  children?: React.ReactNode;
}
const SpkBreadcrumb: React.FC<Breadcrumbprops> = ({ Customclass, as, Label, bsPrefix, children }) => {
  return (
    <Fragment>
      <Breadcrumb bsPrefix={bsPrefix} label={Label} as={as} className={Customclass}>
        {children}
      </Breadcrumb>
    </Fragment>
  )
}

export default SpkBreadcrumb