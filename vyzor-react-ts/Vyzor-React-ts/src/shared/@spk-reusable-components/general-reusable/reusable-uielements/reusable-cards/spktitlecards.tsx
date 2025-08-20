
import React, { Fragment } from 'react'
import { Card, Image } from 'react-bootstrap'
import SpkButton from '../spk-buttons';
import { Link } from 'react-router-dom';

interface Titlecards {
  CustomBodyclass?: string;
  CustomHeaderclass?: string;
  Imgsrc?: string;
  Footertext?: string;
  Title?: string;
  Customclass?: string;
  Customfooterclass?: string;
  Icon?: string;
  LinkClass?: string;
  Icontag?: boolean;
  Linktag?: boolean;
  ButtonTag?: boolean;
  Cardheader?: boolean;
  Imagetag?: boolean;
  Cardfooter?: boolean;
  Anchortagbefore?: boolean;
  children?: React.ReactNode;
  OnclickFunc?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  Navigate: string | URL;
  AnchortagNavigate: string | URL;
}
const Spktitlecards: React.FC<Titlecards> = ({ ButtonTag, Imgsrc, Anchortagbefore = false, OnclickFunc, Navigate, AnchortagNavigate, Cardheader, Imagetag = false, Icontag = false, LinkClass, CustomBodyclass, Customfooterclass, Icon, Cardfooter, Customclass, CustomHeaderclass, children, Footertext, Title, Linktag }) => {
  return (
    <Fragment>
      <Card className={Customclass}>
        {Imagetag ? <Image  src={Imgsrc as string} className="card-img-top" alt="..." /> : ''}
        {Anchortagbefore ? <Link to={AnchortagNavigate} className="card-anchor"></Link> : ""}
        {Cardheader ?
          <Card.Header className={CustomHeaderclass}>
            <Card.Title>
              {Title}
            </Card.Title>
            {Linktag ? <Link to={Navigate} data-bs-toggle="card-remove" onClick={OnclickFunc} className={LinkClass}>
              {Icontag ? <i className={Icon}></i> : ''}
            </Link> : ''}
          </Card.Header>
          : ''}
        <Card.Body className={CustomBodyclass}>
          {children}
        </Card.Body>
        {Cardfooter ? <Card.Footer className={Customfooterclass}>
          {ButtonTag ? <SpkButton Buttonvariant="primary">Read More</SpkButton> : Footertext}
        </Card.Footer>
          : ''}
      </Card>
    </Fragment>
  )
}

export default Spktitlecards