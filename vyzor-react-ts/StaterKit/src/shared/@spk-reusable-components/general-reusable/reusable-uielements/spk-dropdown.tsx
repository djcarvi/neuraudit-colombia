
import React, { Fragment } from 'react'
import { Dropdown, Image } from 'react-bootstrap'
import SpkBadge from './spk-badge';
import SpkButton from './spk-buttons';

interface Dropdowntype {
  bsPrefix?: string;
  as?: any;
  toggleas?: any;
  Menuas?: any;
  Align?: "start" | "end" | { sm: "start" | "end" } | { md: "start" | "end" } | { lg: "start" | "end" } | { xl: "start" | "end" } | { xxl: "start" | "end" };
  Menualign?: "start" | "end" | { sm: "start" | "end" } | { md: "start" | "end" } | { lg: "start" | "end" } | { xl: "start" | "end" } | { xxl: "start" | "end" };
  Customclass?: string;
  children?: React.ReactNode
  Buttontext?: React.ReactNode
  Drop?: 'up' | 'up-centered' | 'start' | 'end' | 'down' | 'down-centered';
  Togglevariant?: string;
  Menulabel?: string;
  Menuclass?: string;
  Show?: boolean;
  Toggleshow?: boolean;
  Flip?: boolean;
  Menuvariant?: string;
  autoClose?: true | 'outside' | 'inside' | false;
  Id?: string;
  Customtoggleclass?: string;
  iconPosition?: string;
  Imagetag?: boolean;
  Imagename?: string;
  Imagesrc?: string;
  Imageclass?: string;
  Icon?: boolean;
  IconClass?: string;
  Toggletext?: string;
  color?: string;
  Buttonposition?: string;
  SvgClass?: string;
  Svgicon?: string;
  Badgecolor?: string;
  Badgepill?: boolean;
  Badgeid?: string;
  Active?: boolean;
  Badgetext?: React.ReactNode;
  Disabled?: boolean;
  Badgeclass?: string;
  Buttontag?: boolean;
  Badgetag?: boolean;
  Split?: boolean;
  Arrowicon?: boolean;
  Arrowicon1?: boolean;
  Arrowiconvertical?: boolean;
  Svg?: boolean;
  Size?: "sm" | "lg" | undefined;
  Navigate?: string | undefined;
  onTogglefunc?: (isOpen: boolean) => void;
  onSelectfunc?: (eventKey: string | null, event: React.SyntheticEvent<unknown>) => void;
}
const SpkDropdown: React.FC<Dropdowntype> = ({ children, color, Badgecolor, Badgepill, Badgeclass, Badgeid, Badgetext, Menualign, Buttontag = false, Badgetag = false, SvgClass, Svgicon, Svg = false, Buttontext, Arrowicon = false, Arrowicon1 = false,  Buttonposition, toggleas, Split, iconPosition, Togglevariant, Imagetag, Size, Imagesrc, Menuas, Navigate, Imageclass, Icon, IconClass, Toggletext, Drop, Customclass, Id, Menulabel, Customtoggleclass, as, Menuclass, Align, Show, Flip, Menuvariant, onTogglefunc, onSelectfunc, bsPrefix, Toggleshow, autoClose }) => {
  return (
    <Fragment>
      <Dropdown drop={Drop} className={Customclass} align={Align} bsPrefix={bsPrefix} as={as} autoClose={autoClose} show={Toggleshow} onToggle={onTogglefunc} onSelect={onSelectfunc}>
        {Buttontag && Buttonposition === "before" ? <SpkButton Buttonvariant={color}>{Buttontext}</SpkButton> : ""}
        <>

          <Dropdown.Toggle as={toggleas} split={Split} variant={Togglevariant} className={` ${Customtoggleclass}`} type="button" href={Navigate} size={Size}
            id={Id} data-bs-toggle="dropdown" aria-expanded="false">

            {iconPosition === 'before' ?
              (
                <>
                  {Imagetag ? (<Image  src={Imagesrc as string} alt="" className={Imageclass} />) : <>{Icon ? (<i className={IconClass}></i>) : ""}</>}
                  {Toggletext}
                </>
              )
              : (
                <>
                  {Toggletext}
                  {Imagetag ? (<Image  src={Imagesrc as string} alt="" className={Imageclass} />) : <>{Icon ? (<i className={IconClass}></i>) : ""}</>}

                </>
              )}
            {Arrowicon ? <i className="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i> : ""}
            {Arrowicon1 ? <i className="ri-more-fill align-middle d-inline-block fs-15 fw-medium lh-1"></i> : ""}

            {Svg ?
              <svg xmlns="http://www.w3.org/2000/svg" className={SvgClass} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={Svgicon} />
              </svg>
              : ""}
            {Badgetag ?
              <SpkBadge variant={Badgecolor} Pill={Badgepill} Customclass={Badgeclass} Id={Badgeid}>{Badgetext}</SpkBadge>
              : ""}

          </Dropdown.Toggle>
          {Buttontag && Buttonposition === "after" ? (<SpkButton Buttonvariant={color}>{Buttontext}</SpkButton>) : ''}

        </>
        <Dropdown.Menu as={Menuas} align={Menualign} show={Show} variant={Menuvariant} className={Menuclass} bsPrefix={bsPrefix} flip={Flip} aria-labelledby={Menulabel}>
          {children}
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  )
}

export default SpkDropdown