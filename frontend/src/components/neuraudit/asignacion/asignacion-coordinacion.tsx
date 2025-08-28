
import React, { Fragment, useEffect, useRef, useState } from "react";
import asignacionService from "../../../services/neuraudit/asignacionService";
import { Card, Col, Form, Image, Modal, Row, Alert, Badge, Table } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { FilePond } from "react-filepond";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Link } from "react-router-dom";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
// import {  KanbanCards, kanbanCardsdanger, kanbanCardsinfo, kanbanCardswarning, Option1, kanbanCardsuccess, simpleItems1, cars } from "../../../../shared/data/applications/task/kanbandata";

// Datos temporales para evitar errores mientras se implementa el backend
const KanbanCards: any[] = [];
const kanbanCardsdanger: any[] = [];
const kanbanCardsinfo: any[] = [];
const kanbanCardswarning: any[] = [];
const Option1: any[] = [];
const kanbanCardsuccess: any[] = [];
const simpleItems1: any[] = [];
const cars: any[] = [];
import SpkKanbanCard from "../../../shared/@spk-reusable-components/application-reusable/spk-kanbancard";
import SpkDatepickr from "../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import dragula from "dragula";
import face2 from '../../../assets/images/faces/2.jpg';
import face8 from '../../../assets/images/faces/8.jpg';
import face4 from '../../../assets/images/faces/4.jpg';
import face10 from '../../../assets/images/faces/10.jpg';
import face13 from '../../../assets/images/faces/13.jpg';
interface AsignacionCoordinacionProps { }

const AsignacionCoordinacion: React.FC<AsignacionCoordinacionProps> = () => {

    const [files, setFiles] = useState<any>([]);
    const [dates, setDates] = useState<{ [key: string]: Date | string | null }>({});
    const [asignacionesKanban, setAsignacionesKanban] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [propuestaPendiente, setPropuestaPendiente] = useState<any>(null);
    const [showPropuesta, setShowPropuesta] = useState(false);
    const [generandoPropuesta, setGenerandoPropuesta] = useState(false);
    const handleDateChange = (key: string, date: Date | null) => {
        if (date) {
            setDates((prevDates) => ({
                ...prevDates,
                [key]: date,
            }));
        } else {
            setDates((prevDates) => {
                const { [key]: removedKey, ...rest } = prevDates;
                return rest;
            });
        }
    };

    const [show, setShow] = useState<{ [key: string]: boolean }>({});

    const handleShow = (offcanvasName: string) => {
        setShow((prevShow) => {
            if (prevShow[offcanvasName] !== true) {
                return { ...prevShow, [offcanvasName]: true };
            }
            return prevShow;
        });
    };

    const handleClose = (offcanvasName: string) => {
        setShow((prevShow) => {
            if (prevShow[offcanvasName] !== false) {
                return { ...prevShow, [offcanvasName]: false };
            }
            return prevShow;
        });
    };

    const leftContainerRef = useRef(null);
    const rightContainerRef = useRef(null);
    const topContainerRef = useRef(null);
    const bottomContainerRef = useRef(null);
    const lastContainerRef = useRef(null);

    // Cargar datos de asignaciones Kanban y propuesta pendiente
    useEffect(() => {
        const cargarAsignaciones = async () => {
            try {
                // Cargar en paralelo
                const [kanbanData, propuesta] = await Promise.all([
                    asignacionService.obtenerAsignacionesKanban(),
                    asignacionService.obtenerPropuestaPendiente()
                ]);
                
                setAsignacionesKanban(kanbanData);
                setPropuestaPendiente(propuesta);
                
                // Si hay propuesta pendiente, mostrar alerta
                if (propuesta) {
                    setShowPropuesta(true);
                }
            } catch (error) {
                console.error('Error cargando asignaciones:', error);
            } finally {
                setLoading(false);
            }
        };
        
        cargarAsignaciones();
    }, []);

    // Función para generar propuesta automática
    const generarPropuestaAutomatica = async () => {
        setGenerandoPropuesta(true);
        try {
            const coordinadorUsername = 'admin.coordinador'; // TODO: Obtener del usuario actual
            const propuestaId = await asignacionService.generarPropuestaAsignacion(coordinadorUsername);
            
            if (propuestaId) {
                // Recargar datos
                const propuesta = await asignacionService.obtenerPropuesta(propuestaId);
                setPropuestaPendiente(propuesta);
                setShowPropuesta(true);
                handleClose("addmodal");
            }
        } catch (error) {
            console.error('Error generando propuesta:', error);
            alert('Error al generar la propuesta de asignación');
        } finally {
            setGenerandoPropuesta(false);
        }
    };

    // Función para aprobar propuesta masivamente
    const aprobarPropuestaMasiva = async () => {
        if (!propuestaPendiente) return;
        
        try {
            const resultado = await asignacionService.aprobarPropuestaMasiva(
                propuestaPendiente.id,
                'admin.coordinador' // TODO: Obtener del usuario actual
            );
            
            if (resultado) {
                alert('Propuesta aprobada exitosamente');
                setPropuestaPendiente(null);
                setShowPropuesta(false);
                // Recargar kanban
                const kanbanData = await asignacionService.obtenerAsignacionesKanban();
                setAsignacionesKanban(kanbanData);
            }
        } catch (error) {
            console.error('Error aprobando propuesta:', error);
            alert('Error al aprobar la propuesta');
        }
    };

    // Función para rechazar propuesta
    const rechazarPropuesta = async (justificacion: string) => {
        if (!propuestaPendiente) return;
        
        try {
            const resultado = await asignacionService.rechazarPropuestaMasiva(
                propuestaPendiente.id,
                'admin.coordinador', // TODO: Obtener del usuario actual
                justificacion
            );
            
            if (resultado) {
                alert('Propuesta rechazada');
                setPropuestaPendiente(null);
                setShowPropuesta(false);
            }
        } catch (error) {
            console.error('Error rechazando propuesta:', error);
            alert('Error al rechazar la propuesta');
        }
    };

    useEffect(() => {
        if (leftContainerRef.current && rightContainerRef.current) {
            dragula([leftContainerRef.current, rightContainerRef.current, topContainerRef.current, bottomContainerRef.current, lastContainerRef.current]);
      
            if(document.querySelector('.firstdrag')?.classList.contains('task-Null'))
            {
                
                document.querySelector('.view-more-button')?.classList.add('d-none'); 
            }
          }
    }, [asignacionesKanban]);

    const leftButtonRef = useRef(null);
    const rightButtonRef = useRef(null);
    const topButtonRef = useRef(null);
    const bottomButtonRef = useRef(null);
    const lastButtonRef = useRef(null);

    // Store all the refs in an array
    const elementsToModify = [
        { containerRef: leftContainerRef, buttonRef: leftButtonRef },
        { containerRef: rightContainerRef, buttonRef: rightButtonRef },
        { containerRef: topContainerRef, buttonRef: topButtonRef },
        { containerRef: bottomContainerRef, buttonRef: bottomButtonRef },
        { containerRef: lastContainerRef, buttonRef: lastButtonRef }
    ];

    const OnDivChange = () => {
        elementsToModify.forEach(({ containerRef, buttonRef }:any) => {
            const element = containerRef.current;
            const button = buttonRef.current;

            if (element?.children.length <= 0) {
                element?.classList.add("task-Null");
                if (button) {
                    button.classList.add("d-none");
                }
            } else {
                element?.classList.remove("task-Null");
                if (button) {
                    button.classList.remove("d-none");
                }
            }
        });
    };


    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="NeurAudit-Coordinación de Asignación" />

            <Pageheader title="Asignación" subtitle="Coordinación" currentpage="Coordinación de Asignación" activepage="Asignación" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 --> */}

            {/* Mostrar propuesta pendiente si existe */}
            {showPropuesta && propuestaPendiente && (
                <Row className="mb-3">
                    <Col xl={12}>
                        <Alert variant="warning" dismissible onClose={() => setShowPropuesta(false)}>
                            <h5 className="alert-heading">
                                <i className="ri-notification-3-line me-2"></i>
                                Propuesta de Asignación Pendiente
                            </h5>
                            <hr />
                            <Row>
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Total radicaciones:</strong> {propuestaPendiente.metricas_distribucion?.total_radicaciones || 0}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Auditores involucrados:</strong> {propuestaPendiente.metricas_distribucion?.auditores_involucrados || 0}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Balance del algoritmo:</strong>{' '}
                                        <Badge bg="success">
                                            {((propuestaPendiente.metricas_distribucion?.balance_score || 0) * 100).toFixed(1)}%
                                        </Badge>
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Ambulatorio:</strong> {propuestaPendiente.metricas_distribucion?.tipos_servicio?.ambulatorio || 0}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Hospitalario:</strong> {propuestaPendiente.metricas_distribucion?.tipos_servicio?.hospitalario || 0}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Valor total:</strong> ${(propuestaPendiente.metricas_distribucion?.valor_total_asignado || 0).toLocaleString('es-CO')}
                                    </p>
                                </Col>
                            </Row>
                            <div className="mt-3">
                                <SpkButton 
                                    Buttonvariant="success" 
                                    Customclass="btn me-2" 
                                    onClickfunc={aprobarPropuestaMasiva}
                                >
                                    <i className="ri-check-line me-1"></i>Aprobar Todas
                                </SpkButton>
                                <SpkButton 
                                    Buttonvariant="danger" 
                                    Customclass="btn me-2" 
                                    onClickfunc={() => {
                                        const justificacion = prompt('Ingrese la justificación del rechazo:');
                                        if (justificacion) {
                                            rechazarPropuesta(justificacion);
                                        }
                                    }}
                                >
                                    <i className="ri-close-line me-1"></i>Rechazar
                                </SpkButton>
                                <SpkButton 
                                    Buttonvariant="info" 
                                    Customclass="btn" 
                                    onClickfunc={() => handleShow("detallePropuesta")}
                                >
                                    <i className="ri-eye-line me-1"></i>Ver Detalles
                                </SpkButton>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body className="p-3">
                            <div className="d-sm-flex align-items-center flex-wrap gap-3 kanban-header justify-content-between">
                                <div className="d-sm-flex align-items-center flex-wrap gap-3 w-sm-50 mb-sm-0 mb-3">
                                    <div className="mb-sm-0 mb-3">
                                        <SpkButton 
                                            Buttonvariant="primary" 
                                            Customclass="btn me-2" 
                                            onClickfunc={() => handleShow("addmodal")}
                                            disabled={generandoPropuesta || (propuestaPendiente !== null)}
                                        >
                                            <i className="ri-robot-line me-1 fw-medium align-middle"></i>
                                            {generandoPropuesta ? 'Generando...' : 'Generar Propuesta Automática'}
                                        </SpkButton>
                                    </div>
                                    <div>
                                        <div className="avatar-list-stacked">
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face2} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face8} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face2} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face10} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face4} alt="img" />
                                            </span>
                                            <span className="avatar avatar-sm avatar-rounded">
                                                <Image src={face13} alt="img" />
                                            </span>
                                            <Link className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white" to="#!">
                                                +8
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center flex-wrap justify-content-end gap-3 custom-kanaban">
                                    <SpkSelect name="colors" option={Option1} mainClass="w-full !rounded-md"
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Option1[0]]} />
                                    <div className="d-flex mt-sm-0 mt-3" role="search">
                                        <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <SpkButton Buttonvariant="" Customclass="btn btn-light" Buttontype="submit">Search</SpkButton>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start::row-2 --> */}

            <div className="VYZOR-kanban-board">
                <div className="kanban-tasks-type new">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">Pendientes - {asignacionesKanban?.pendientes?.length || 0}</span>
                            <div>
                                <Link aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Asignar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="new-tasks">
                        <div id="new-tasks-draggable" data-view-btn="new-tasks" ref={leftContainerRef} onMouseEnter={OnDivChange}>

                            {KanbanCards.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={leftButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-primary-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type todo">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">Asignadas - {asignacionesKanban?.asignadas?.length || 0}</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Asignar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="todo-tasks">
                        <div id="todo-tasks-draggable" data-view-btn="todo-tasks" ref={rightContainerRef} onMouseEnter={OnDivChange}>

                            {kanbanCardswarning.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={rightButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-warning-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type in-progress">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">En Proceso - {asignacionesKanban?.en_proceso?.length || 0}</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Asignar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="inprogress-tasks">
                        <div id="inprogress-tasks-draggable" data-view-btn="inprogress-tasks" ref={topContainerRef} onMouseEnter={OnDivChange}>
                            {/*<div className="task-null-background" draggable="false">
                                <Image  src={media81} alt="" />
                            </div>*/}
                            {kanbanCardsinfo.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={topButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-info-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type inreview">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">En Revisión - 2</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Asignar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="inreview-tasks">
                        <div id="inreview-tasks-draggable" data-view-btn="inreview-tasks" ref={bottomContainerRef} onMouseEnter={OnDivChange}>
                            {/*<div className="task-null-background" draggable="false">
                                <Image  src={media81} alt="" />
                            </div>*/}
                            {kanbanCardsdanger.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={bottomButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-danger-light btn-wave">View More</SpkButton>
                    </div>
                </div>
                <div className="kanban-tasks-type completed">
                    <div className="pe-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="d-block fw-medium fs-15">Completadas - {asignacionesKanban?.completadas?.length || 0}</span>
                            <div>
                                <Link  aria-label="anchor" to="#!" onClick={() => handleShow("taskmodal")} className="btn btn-sm bg-white text-default border btn-wave">
                                    <i className="ri-add-line align-middle me-1 fw-medium"></i>Asignar
                                </Link>
                            </div>
                        </div>
                    </div>
                    <SimpleBar className="kanban-tasks" id="completed-tasks">
                        <div id="completed-tasks-draggable" data-view-btn="completed-tasks" ref={lastContainerRef} onMouseEnter={OnDivChange}>
                            {/*<div className="task-null-background" draggable="false">
                                <Image  src={media81} alt="" />
                            </div>*/}
                            {kanbanCardsuccess.map((idx, index) => (
                                <SpkKanbanCard key={index} kanban={idx} />
                            ))}
                        </div>
                    </SimpleBar>
                    <div className="d-grid view-more-button mt-3" ref={lastButtonRef}>
                        <SpkButton Buttonvariant="" Customclass="btn btn-success-light btn-wave">View More</SpkButton>
                    </div>
                </div>
            </div>

            {/* <!--End::row-2 --> */}

            {/* Modal Code */}

            <Modal show={show["addmodal"] || false} onHide={() => handleClose("addmodal")} centered className="fade" id="add-board" tabIndex={-1} aria-hidden="true">
                <Modal.Header>
                    <h6 className="modal-title">Generar Propuesta Automática de Asignación</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose("addmodal")} Customclass="btn-close" Buttondismiss="modal" Buttonlabel="Close"></SpkButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center py-3">
                        <i className="ri-robot-line fs-1 text-primary mb-3 d-block"></i>
                        <h5>¿Generar propuesta automática?</h5>
                        <p className="text-muted">
                            El sistema analizará las radicaciones pendientes y generará una 
                            propuesta de asignación equitativa basada en:
                        </p>
                        <ul className="list-unstyled text-start">
                            <li><i className="ri-check-line text-success"></i> Perfil del auditor (Médico/Administrativo)</li>
                            <li><i className="ri-check-line text-success"></i> Tipo de auditoría (Ambulatorio/Hospitalario)</li>
                            <li><i className="ri-check-line text-success"></i> Carga de trabajo actual</li>
                            <li><i className="ri-check-line text-success"></i> Capacidad máxima por día</li>
                            <li><i className="ri-check-line text-success"></i> Distribución equitativa</li>
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" Buttontype="button" onClickfunc={() => handleClose("addmodal")} data-bs-dismiss="modal">
                        Cancelar
                    </SpkButton>
                    <SpkButton 
                        Buttonvariant="primary" 
                        Buttontype="button"
                        onClickfunc={generarPropuestaAutomatica}
                        disabled={generandoPropuesta}
                    >
                        {generandoPropuesta ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Generando...
                            </>
                        ) : (
                            <>
                                <i className="ri-robot-line me-1"></i>
                                Generar Propuesta
                            </>
                        )}
                    </SpkButton>
                </Modal.Footer>
            </Modal>

            {/* <!-- Start::add task modal --> */}

            <Modal show={show["taskmodal"] || false} onHide={() => handleClose("taskmodal")} centered className="fade" id="add-task" tabIndex={-1}>
                <div className="">
                    <div className="">
                        <Modal.Header>
                            <Modal.Title as="h6" >Asignar Auditoría</Modal.Title>
                            <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn-close" data-bs-dismiss="modal"
                                aria-label="Close" onClickfunc={() => handleClose("taskmodal")} ></SpkButton>
                        </Modal.Header>
                        <Modal.Body className="px-4">
                            <Row className="gy-2">
                                <Col xl={6}>
                                    <Form.Label htmlFor="task-name" className="form-label">N° Radicación</Form.Label>
                                    <input type="text" className="form-control" id="task-name" placeholder="Número de Radicación" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label htmlFor="task-id" className="form-label">Prestador</Form.Label>
                                    <input type="text" className="form-control" id="task-id" placeholder="Nombre del Prestador" />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="text-area" className="form-label">Observaciones</Form.Label>
                                    <textarea className="form-control" id="text-area" rows={2}
                                        placeholder="Observaciones de la asignación"></textarea>
                                </Col>
                                <Col xl={12}>
                                    <Form.Label htmlFor="text-area" className="form-label">Documentos Adjuntos</Form.Label>
                                    <FilePond className="multiple-filepond" files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={6} server="/api" name="files" labelIdle='Drag & Drop your file here or click' />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="form-label">Asignar a Auditor</Form.Label>
                                    <SpkSelect name="colors" multi={true} option={simpleItems1} mainClass="basic-multi-select" placeholder="Sort By" menuplacement='auto' classNameprefix="Select2" />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label">Fecha Límite</Form.Label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-text text-muted"> <i
                                                className="ri-calendar-line"></i> </div>
                                            <SpkDatepickr className="form-control" Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" selected={dates["TargetDate"] ? new Date(dates["TargetDate"]) : null} onChange={(date: Date | null) => handleDateChange("TargetDate", date)} placeholderText='Choose date and time' showTimeInput />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label">Prioridad</Form.Label>
                                    <SpkSelect multi name="colors" option={cars} mainClass="w-full !rounded-md" menuplacement='top' classNameprefix="Select2" />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <SpkButton Buttonvariant="light" Buttontype="button" Customclass="btn btn-light" data-bs-dismiss="modal" onClickfunc={() => handleClose("taskmodal")} >Cancel</SpkButton>
                            <SpkButton Buttonvariant='primary' Buttontype="button" Customclass="btn btn-primary">Asignar Auditoría</SpkButton>
                        </Modal.Footer>
                    </div>
                </div>
            </Modal>

            {/* <!-- End::add task modal --> */}

            {/* <!-- Start::detalle propuesta modal --> */}
            <Modal show={show["detallePropuesta"] || false} onHide={() => handleClose("detallePropuesta")} size="xl" centered className="fade">
                <Modal.Header>
                    <h6 className="modal-title">Detalle de Propuesta de Asignación</h6>
                    <SpkButton Buttonvariant="" Buttontype="button" onClickfunc={() => handleClose("detallePropuesta")} Customclass="btn-close" Buttondismiss="modal" Buttonlabel="Close"></SpkButton>
                </Modal.Header>
                <Modal.Body>
                    {propuestaPendiente && (
                        <>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Total Radicaciones</h6>
                                            <h3 className="text-primary">{propuestaPendiente.metricas_distribucion?.total_radicaciones || 0}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Auditores Involucrados</h6>
                                            <h3 className="text-info">{propuestaPendiente.metricas_distribucion?.auditores_involucrados || 0}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Balance del Algoritmo</h6>
                                            <h3 className="text-success">{((propuestaPendiente.metricas_distribucion?.balance_score || 0) * 100).toFixed(1)}%</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <h6 className="mb-3">Asignaciones Propuestas</h6>
                            <div className="table-responsive">
                                <Table className="table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Radicación</th>
                                            <th>Prestador</th>
                                            <th>Auditor</th>
                                            <th>Perfil</th>
                                            <th>Tipo</th>
                                            <th>Prioridad</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {propuestaPendiente.asignaciones_individuales?.slice(0, 10).map((asig: any, index: number) => (
                                            <tr key={index}>
                                                <td>{asig.numero_radicado}</td>
                                                <td>{asig.prestador_info?.razon_social || 'N/A'}</td>
                                                <td>{asig.auditor_asignado}</td>
                                                <td>
                                                    <Badge bg={asig.auditor_perfil === 'MEDICO' ? 'primary' : 'secondary'}>
                                                        {asig.auditor_perfil}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={asig.tipo_auditoria === 'HOSPITALARIO' ? 'danger' : 'info'}>
                                                        {asig.tipo_auditoria}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={
                                                        asig.prioridad === 'ALTA' ? 'danger' : 
                                                        asig.prioridad === 'MEDIA' ? 'warning' : 
                                                        'success'
                                                    }>
                                                        {asig.prioridad}
                                                    </Badge>
                                                </td>
                                                <td>${asig.valor_auditoria?.toLocaleString('es-CO') || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {propuestaPendiente.asignaciones_individuales?.length > 10 && (
                                    <p className="text-center text-muted">
                                        ... y {propuestaPendiente.asignaciones_individuales.length - 10} asignaciones más
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <SpkButton Buttonvariant="light" Buttontype="button" onClickfunc={() => handleClose("detallePropuesta")}>
                        Cerrar
                    </SpkButton>
                    <SpkButton 
                        Buttonvariant="success" 
                        Buttontype="button" 
                        onClickfunc={() => {
                            handleClose("detallePropuesta");
                            aprobarPropuestaMasiva();
                        }}
                    >
                        <i className="ri-check-line me-1"></i>Aprobar Todas
                    </SpkButton>
                </Modal.Footer>
            </Modal>
            {/* <!-- End::detalle propuesta modal --> */}

        </Fragment>
    )
};

export default AsignacionCoordinacion;