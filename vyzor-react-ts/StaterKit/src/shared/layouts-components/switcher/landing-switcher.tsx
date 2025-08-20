
import  { Fragment, useContext, useEffect, useState } from "react";
import { Col, Form, Offcanvas, Row } from "react-bootstrap";
import { data$, getState } from "../services/switcherServices";
import SpkButton from "../../@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { updateTheme, Reset1, setDirection, setPrimaryColor, ThemePrimaryColor, LocalStorageBackup } from "../../data/switcherdata/switcherdata";
import { Initialload } from "../../../contextapi";

const Landingswitcher = ({ show, handleClose }: any) => {

  let [variable, setVariable] = useState(getState());
  useEffect(() => {
    const subscription = data$.subscribe((e) => {
      setVariable(e);
    });

    return () => subscription.unsubscribe();
  }, []);
  const theme: any = useContext(Initialload);

  useEffect(() => {
      if (!theme.pageloading) {
        LocalStorageBackup(theme.setpageloading);
      }
    }, []);
  return (
    <Fragment>
      {/* <!-- Start Switcher --> */}
      <Offcanvas className="offcanvas offcanvas-end" placement="end" show={show} onHide={handleClose} tabIndex={-1} id="switcher-canvas" aria-labelledby="offcanvasRightLabel">
        <Offcanvas.Header className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            Switcher
          </h5>
          <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClickfunc={handleClose}></SpkButton>
        </Offcanvas.Header>
        <Offcanvas.Body className="offcanvas-body">
          <div className="">
            <p className="switcher-style-head">Theme Color Mode:</p>
            <Row className="row switcher-style gx-0">
              <Col className="col-4">
                <Form.Check className="form-check switch-select">
                  <Form.Check.Label className="form-check-label" htmlFor="switcher-light-theme">
                    Light
                  </Form.Check.Label>
                  <Form.Check.Input className="form-check-input" type="radio" name="theme-style" id="switcher-light-theme" checked={variable.dataThemeMode === "light"} onChange={(_e) => { }} onClick={() => updateTheme('light', "clicked")}/>
                </Form.Check>
              </Col>
              <Col className="col-4">
                <Form.Check className="form-check switch-select">
                  <Form.Check.Label className="form-check-label" htmlFor="switcher-dark-theme">
                    Dark
                  </Form.Check.Label>
                  <Form.Check.Input className="form-check-input" type="radio" name="theme-style" id="switcher-dark-theme" checked={variable.dataThemeMode === "dark"} onChange={(_e) => { }} onClick={() => updateTheme('dark', "clicked")}/>
                </Form.Check>
              </Col>
            </Row>
          </div>
          <div className="">
            <p className="switcher-style-head">Directions:</p>
            <div className="row switcher-style gx-0">
              <div className="col-4">
                <Form.Check className="form-check switch-select">
                  <Form.Check.Label className="form-check-label" htmlFor="switcher-ltr">
                    LTR
                  </Form.Check.Label>
                  <Form.Check.Input className="form-check-input" type="radio" name="direction" id="switcher-ltr" checked={variable.dir === "ltr"} onChange={(_e) => { }} onClick={() => setDirection("ltr")}/>
                </Form.Check>
              </div>
              <div className="col-4">
                <Form.Check className="form-check switch-select">
                  <Form.Check.Label className="form-check-label" htmlFor="switcher-rtl">
                    RTL
                  </Form.Check.Label>
                  <Form.Check.Input className="form-check-input" type="radio" name="direction" id="switcher-rtl" checked={variable.dir === "rtl"} onChange={(_e) => { }} onClick={() => setDirection("rtl")}/>
                </Form.Check>
              </div>
            </div>
          </div>
          <div className="theme-colors">
            <p className="switcher-style-head">Theme Primary:</p>
            <div className="d-flex flex-wrap align-items-center switcher-style">
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-1" type="radio" name="theme-primary" id="switcher-primary"
                                                 checked={variable.colorPrimaryRgb === ' 42 ,16, 164'} onChange={(_e) => { }} onClick={() => setPrimaryColor(' 42 ,16, 164')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-2" type="radio" name="theme-primary" id="switcher-primary1"
                                                 checked={variable.colorPrimaryRgb === '125 ,0, 189'} onChange={(_e) => { }} onClick={() => setPrimaryColor('125 ,0, 189')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-3" type="radio" name="theme-primary" id="switcher-primary2"
                                                 checked={variable.colorPrimaryRgb === '4, 118, 141'} onChange={(_e) => { }} onClick={() => setPrimaryColor('4, 118, 141')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-4" type="radio" name="theme-primary" id="switcher-primary3"
                                                 checked={variable.colorPrimaryRgb === '138, 0, 32'} onChange={(_e) => { }} onClick={() => setPrimaryColor('138, 0, 32')}/>
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select me-3">
                                                <Form.Check.Input className="form-check-input color-input color-primary-5" type="radio" name="theme-primary" id="switcher-primary4"
                                                 checked={variable.colorPrimaryRgb === '9 ,124, 103'} onChange={(_e) => { }} onClick={() => setPrimaryColor('9 ,124, 103')} />
                                            </Form.Check>
                                            <Form.Check className="form-check switch-select ps-0 mt-1 color-primary-light">
                                                <div className="theme-container-primary">
                                                    <SpkButton Customclass="">nano</SpkButton>
                                                </div>
                                                <div className="pickr-container-primary"  >
                                                    <div className='pickr'>
                                                        <SpkButton Customclass='pcr-button btn-primary' onClickfunc={(ele: any) => {
                                                            if (ele.target.querySelector("input")) {
                                                                ele.target.querySelector("input").click();
                                                            }
                                                        }}>
                                                            <ThemePrimaryColor />
                                                        </SpkButton>
                                                    </div>
                                                </div>
                                            </Form.Check>
                                        </div>
          </div>
          <div>
            <p className="switcher-style-head">reset:</p>
            <div className="text-center">
              <SpkButton Id="reset-all" Customclass="btn btn-danger mt-3" Buttonvariant="danger" onClickfunc={Reset1}>
                Reset
              </SpkButton>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {/* <!-- End Switcher --> */}
    </Fragment>
  );
};

export default Landingswitcher;
