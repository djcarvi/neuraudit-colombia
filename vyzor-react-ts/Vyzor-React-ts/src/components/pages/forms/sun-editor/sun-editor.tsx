
import SpkSunEditor from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-suneditor";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface QuillEditorProps { }

const QuillEditor: React.FC<QuillEditorProps> = () => {

    const defaultContent = `
  <h4><b class="ql-size-large">Basic Suneditor</b> is a free, open source <a href="https://github.com/mkhstar/suneditor-react" target="_blank">Sun Editor</a> built for the modern web. With its <a href="https://suneditorjs.com/docs/modules/" target="_blank">modular architecture</a> and expressive API, it is completely customizable to fit any need.</h4>
  <p><br/></p>
  <ol>
    <li class="ql-size-normal">Write text, select, and edit with multiple options.</li>
    <li>This is suneditor snow editor.</li>
    <li>Easy to customize and flexible.</li>
  </ol>
  <p><br/></p>
  <h4>Suneditor officially supports a standard toolbar theme <a href="https://github.com/mkhstar/suneditor-react" target="_blank">"Snow"</a> and a floating tooltip theme <a href="https://github.com/mkhstar/suneditor-react" target="_blank">"Bubble"</a></h4>
`;

    const defaultContent1 = ` <h4><b className="ql-size-large">suneditor</b> is a free, open source <a href="https://github.com/mkhstar/suneditor-react" target="_blank">Sun Editor </a> built for the modern web. With its <a href="https://suneditorjs.com/docs/modules/" target="_blank">modular architecture</a> and expressive API, it is completely customizable to fit any need.</h4>
  <p><br/></p>
  <ol>
      <li className="ql-size-normal">Write text select and edit with multiple options.</li>
      <li className="">This is suneditor bubble editor.</li>
      <li className="">Easy to customize and flexible.</li>
  </ol>
  <p><br/></p>
  <h4>Sun Editor officially supports a standard toolbar theme <a href="https://github.com/mkhstar/suneditor-react" target="_blank">"Snow"</a> and a floating tooltip theme <a href="https://github.com/mkhstar/suneditor-react" target="_blank">"Bubble"</a></h4>`

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Suneditor" />

            <Pageheader title="Forms" currentpage="Sun Editor" activepage="Sun Editor" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Basic Sun Editor
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="editor">
                                <SpkSunEditor defaulContent={defaultContent} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Sun Editor With Value
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="editor1">
                                <SpkSunEditor defaulContent={defaultContent1} setoptions={{
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize"],
                                        [
                                            "bold",
                                            "underline",
                                            "italic",
                                            "strike",
                                            "subscript",
                                            "superscript"
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list", "lineHeight"],
                                        ["outdent", "indent"],
                                        ["table", "link", "image", "video"],
                                        ["preview", "print"],
                                        ["removeFormat"]
                                    ], defaultTag: "div", minHeight: "300px", showPathLabel: false, font: ["Arial", "Comic Sans MS", "Courier New", "Impact"],
                                    defaultStyle: 'font-family: Arial; font-size: 16px;'
                                }} />


                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default QuillEditor;