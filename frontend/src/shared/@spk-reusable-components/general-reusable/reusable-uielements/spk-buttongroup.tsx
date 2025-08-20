

import React, { Fragment } from 'react'
import { ButtonGroup } from 'react-bootstrap'

interface Buttongrouptype {
  bsPrefix?: string;
  as?: any;
  Buttongrplabel?: string;
  Customclass?: string;
  children?: any;
  Vertical?: boolean;
  Size?: 'sm' | 'lg'
}

const SpkButtongroup: React.FC<Buttongrouptype> = ({ children, Customclass, Buttongrplabel, bsPrefix, as, Size, Vertical }) => {
  return (
    <Fragment>
      <ButtonGroup className={Customclass} role="group" aria-label={Buttongrplabel} as={as} size={Size} bsPrefix={bsPrefix} vertical={Vertical}>
        {children}
      </ButtonGroup>
    </Fragment>
  )
}

export default SpkButtongroup