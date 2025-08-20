

import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap'

interface Buttontypes {
  bsPrefix?: string;
  as?: any;
  Buttonvariant?: string;
  Buttontype?: 'button' | 'reset' | 'submit' | undefined;
  Customclass?: string;
  children?: React.ReactNode;
  Dismiss?: boolean;
  Closebutton?: string;
  Value?: string;
  Buttontoggle?: string;
  Expand?: boolean;
  Id?: string;
  Buttondismiss?: string;
  Buttontarget?: string;
  Role?: string;
  Buttoncontrols?: string;
  Buttonlabel?: string;
  Style?: React.CSSProperties;
  Size?: 'sm' | 'lg'
  Active?: boolean;
  Tabindex?: number | undefined;
  Disabled?: boolean;
  Navigate?: string | undefined;
  onClickfunc?: any;
  onChangefunc?: (event: React.MouseEvent<HTMLButtonElement>) => void;

}
const SpkButton: React.FC<Buttontypes> = ({ Buttonvariant, Style, Buttontype, Customclass, children, bsPrefix, Role, as, Size, Active, Expand, Navigate, Disabled, Id, onClickfunc, onChangefunc, Buttontoggle, Buttonlabel, Buttondismiss, Buttoncontrols, Value, Tabindex, Buttontarget, ...props }) => {
  return (
    <Fragment>
      <Button type={Buttontype} id={Id} style={Style} bsPrefix={bsPrefix} as={as} variant={Buttonvariant} role={Role} href={Navigate} size={Size} active={Active} disabled={Disabled} data-bs-toggle={Buttontoggle} aria-expanded={Expand} data-bs-target={Buttontarget}
        tabIndex={Tabindex} onClick={onClickfunc} value={Value} className={`btn-wave ${Customclass}`} onChange={onChangefunc} data-bs-dismiss={Buttondismiss} aria-label={Buttonlabel} aria-controls={Buttoncontrols} {...props}>
        {children}
      </Button>
    </Fragment>
  )
}

export default SpkButton