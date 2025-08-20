

import React, { Fragment } from 'react'
import { ListGroup } from 'react-bootstrap'

interface Listgrouptype {
  bsPrefix?: string;
  CustomClass?: string;
  Numbered?: boolean;
  children?: React.ReactNode;
  Variant?: string;
  Id?: string;
  as?: any;
  Menuas?: any;
  Horizontal?: true | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}
const SpkListgroup: React.FC<Listgrouptype> = ({ CustomClass, children, Numbered, Horizontal, as, Variant, bsPrefix, Id, }) => {
  return (
    <Fragment>
      <ListGroup variant={Variant} horizontal={Horizontal} numbered={Numbered} bsPrefix={bsPrefix} as={as} className={CustomClass} id={Id}>
        {children}
      </ListGroup>
    </Fragment>
  )
}

export default SpkListgroup