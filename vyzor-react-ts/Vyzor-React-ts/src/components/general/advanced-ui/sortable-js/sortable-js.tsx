
import SpkListgroup from "../../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-listgroup";
import { Drag, Drag1, Drag10, Drag11, Drag2, Drag3, Drag4, Drag5, Drag6, Drag7, Drag8, Drag9 } from "../../../../shared/data/general/adavanec-ui/sortablejsdata";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../../shared/layouts-components/seo/seo";
import React, { Fragment } from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";

interface SortablejsProps { }

const Sortablejs: React.FC<SortablejsProps> = () => {

    const [simpleList, setsimpleList] = React.useState(Drag);
    const [sharedList, setsharedList] = React.useState(Drag1);
    const [sharedLists, setsharedLists] = React.useState(Drag2);
    const [disableList, setdisableList] = React.useState(Drag3);
    const [cloneList, setcloneList] = React.useState(Drag4);
    const [multiList, setmultiList] = React.useState(Drag5);
    const [swapList, setswapList] = React.useState(Drag6);
    const [sortableList, setsortableList] = React.useState(Drag7);
    const [clonesList, setclonesList] = React.useState(Drag8);
    const [cloneingList, setcloneingList] = React.useState(Drag9);
    const [disableLists, setdisableLists] = React.useState(Drag10);
    const [nestList, setnestList] = React.useState(Drag11);

    type ListItem = {
        id: number;
        text: string;
    };

    const [sortlist, setsortList] = React.useState<ListItem[]>([
        { id: 1, text: "Analyze market trends." },
        { id: 2, text: "Edit video content." },
        { id: 3, text: "Plan social media calendar." },
        { id: 4, text: "Update company policies." },
        { id: 5, text: "Compile sales reports." },
        { id: 6, text: "Schedule client calls." },
    ]);



    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title={"Sortable JS"} />

            <Pageheader title="Advanced Ui" currentpage="Sortable JS" activepage="Sortable JS" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                SIMPLE LIST
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ol className="list-group sortable-list list-group-numbered" id="simple-list">
                                <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={simpleList} setList={setsimpleList} group="shared" animation={200} easing="ease-out">
                                    {simpleList.map(item => (
                                        <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                    ))}
                                </ReactSortable>
                            </ol>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={8}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">SHARED LISTS</div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xl={6}>
                                    <ol className="list-group sortable-list list-group-numbered" id="simple-list">
                                        <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={sharedList} group={'shared'} setList={setsharedList} animation={200} easing="ease-out">
                                            {sharedList.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>
                                    </ol>
                                </Col>
                                <Col xl={6}>
                                    <ol className="list-group sortable-list list-group-numbered" id="shared-right">
                                        <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={sharedLists} group={'shared'} setList={setsharedLists} animation={200} easing="ease-out">
                                            {sharedLists.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>
                                    </ol>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                CLONING
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xl={6}>
                                    <SpkListgroup as="ul" CustomClass="sortable-list" Id="cloning-left">
                                        <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" group={{ name: 'shared', pull: 'clone' }} list={clonesList} setList={setclonesList} direction={'horizontal'} animation={200} easing="ease-out">
                                            {clonesList.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>

                                    </SpkListgroup>
                                </Col>
                                <Col xl={6}>
                                    <SpkListgroup as="ul" CustomClass="sortable-list" Id="cloning-right">
                                        <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" group={{ name: 'shared', pull: 'clone' }} list={cloneingList} setList={setcloneingList} direction={'horizontal'} animation={150} swapThreshold={1} easing="ease-out">
                                            {cloneingList.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>

                                    </SpkListgroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                DISABLING SORTING
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xl={6}>
                                    <SpkListgroup as="ul" CustomClass="sortable-list" Id="disabling-sorting-left">
                                        <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={disableLists} group={{ name: 'shared', pull: 'clone', put: false }} setList={setdisableLists} animation={200} easing="ease-out">
                                            {disableLists.map((item: any) => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>
                                    </SpkListgroup>
                                </Col>
                                <Col xl={6}>
                                    <SpkListgroup as="ul" CustomClass="sortable-list" Id="disabling-sorting-right">
                                        <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={disableList} setList={setdisableList} animation={200} easing="ease-out" group={'shared'}>
                                            {disableList.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>
                                    </SpkListgroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                SORTING WITH HANDLE
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ReactSortable list={sortlist} setList={setsortList} handle=".handle" animation={150} className="list-group sortable-list list-item-numbered sortable-with-handle" tag="ol">
                                {sortlist.map((item) => (
                                    <li key={item.id} className="list-group-item d-flex align-items-center" data-id={item.id}>
                                        <i className="ri-drag-move-2-fill me-2 text-dark fs-16 handle lh-1"></i>
                                        {item.text}
                                    </li>
                                ))}
                            </ReactSortable>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                SORTING WITH FILTER
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <SpkListgroup as="ul" CustomClass="sortable-list" Id="sorting-with-filter">
                                <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={cloneList} setList={setcloneList} animation={200} easing="ease-out">
                                    {cloneList.map(item => (
                                        <li className={`list-group-item ${item.filter}`} key={item.id}>{item.name}</li>
                                    ))}
                                </ReactSortable>
                            </SpkListgroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                SORTABLE GRID
                            </div>
                        </Card.Header>
                        <Card.Body id="sortable-grid">
                            <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={sortableList} setList={setsortableList} animation={200} easing="ease-out">
                                {sortableList.map(item => (
                                    <div className="grid-square" key={item.id}>
                                        <span className="fw-medium">{item.name}</span>
                                    </div>
                                ))}
                            </ReactSortable>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

            {/* <!-- Start:: row-5 --> */}

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                NESTED SORTABLE
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="nestedSortables" className="list-group col nested-sortable">
                                <ReactSortable filter=".addImageButtonContainer" dragClass="sortableDrag" list={nestList} group={'nested'} fallbackOnBody={true} setList={setnestList} animation={200} easing="ease-out">
                                    {nestList.map(item => (
                                        <div key={item.id} className={`list-group-item nested-1 ${item.children ? 'nested-1' : ''}`} draggable={item.draggable === false ? 'false' : 'true'}>
                                            {item.name}
                                            {item.children && (
                                                <div className="list-group nested-sortable">
                                                    {item.children.map(child => (
                                                        <div key={child.id} className={`list-group-item nested-2 ${child.children ? 'nested-2' : ''}`} draggable={child.draggable === false ? 'false' : 'true'}>
                                                            {child.name}
                                                            {child.children && (
                                                                <div className="list-group nested-sortable">
                                                                    {child.children.map(grandchild => (
                                                                        <div key={grandchild.id} className="list-group-item nested-3" draggable={grandchild.draggable === false ? 'false' : 'true'}>
                                                                            {grandchild.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </ReactSortable>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        MULTIPLE DRAG
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <SpkListgroup as="ul" CustomClass="sortable-list" Id="multiple-drag">
                                        <ReactSortable filter=".addImageButtonContainer" multiDrag={true} fallbackTolerance={3} dragClass="sortableDrag" list={multiList} setList={setmultiList} animation={200} easing="ease-out">
                                            {multiList.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>
                                    </SpkListgroup>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        SWAP
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <SpkListgroup as="ul" CustomClass="sortable-list" Id="sortable-swap">
                                        <ReactSortable multiDrag filter=".addImageButtonContainer" dragClass="sortableDrag" list={swapList} swap={true} setList={setswapList} animation={200} easing="ease-out">
                                            {swapList.map(item => (
                                                <ListGroup.Item className="" as="li" key={item.id}>{item.name}</ListGroup.Item>
                                            ))}
                                        </ReactSortable>
                                    </SpkListgroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* <!-- End:: row-5 --> */}

        </Fragment>
    )
}
export default Sortablejs;