import React, { Fragment, useState } from "react";
import { Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { toast } from 'react-toastify';

interface ModalFinalizarAuditoriaProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (observaciones: string) => void;
    loading: boolean;
    estadisticas: {
        totalFacturado: number;
        totalGlosadoEfectivo: number;
        totalAPagar: number;
        cantidadServicios: number;
        cantidadGlosas: number;
        porcentajeGlosado: number;
    };
    factura: any;
}

const ModalFinalizarAuditoria: React.FC<ModalFinalizarAuditoriaProps> = ({ 
    show, 
    onHide, 
    onConfirm, 
    loading,
    estadisticas,
    factura
}) => {
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [observacionesFinal, setObservacionesFinal] = useState("");

    const handleConfirm = () => {
        console.log('=== MODAL FINALIZAR - handleConfirm ===');
        console.log('Acepta términos:', aceptaTerminos);
        console.log('Observaciones:', observacionesFinal);
        console.log('onConfirm función:', onConfirm);
        console.log('Tipo de onConfirm:', typeof onConfirm);
        
        if (!aceptaTerminos) {
            toast.error('Debe aceptar los términos y condiciones para continuar');
            return;
        }
        
        console.log('Llamando a onConfirm...');
        if (typeof onConfirm === 'function') {
            onConfirm(observacionesFinal);
        } else {
            console.error('onConfirm no es una función válida');
        }
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <Fragment>
            <Modal 
                show={show} 
                onHide={onHide} 
                centered 
                size="lg" 
                className="fade" 
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="border-bottom">
                    <div className="d-flex align-items-center">
                        <span className="avatar avatar-md avatar-rounded bg-primary-transparent me-3">
                            <i className="ri-check-double-line fs-24 text-primary"></i>
                        </span>
                        <div>
                            <h6 className="modal-title mb-0">Finalizar Auditoría Médica</h6>
                            <small className="text-muted">Factura {factura?.numero_factura}</small>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={onHide}
                        disabled={loading}
                        aria-label="Close"
                    ></button>
                </Modal.Header>
                
                <Modal.Body className="px-4">
                    {/* Resumen de la Auditoría */}
                    <div className="alert alert-primary-transparent alert-dismissible fade show" role="alert">
                        <div className="d-flex align-items-start">
                            <div className="flex-shrink-0">
                                <i className="ri-information-line fs-20 text-primary"></i>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h6 className="alert-heading mb-1">Importante</h6>
                                <p className="mb-0">
                                    Al finalizar la auditoría, se guardarán todas las glosas aplicadas y el prestador será notificado 
                                    para que pueda responder en el plazo legal de <strong>5 días hábiles</strong> según la Resolución 2284 de 2023.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas Finales */}
                    <Card className="custom-card mb-3">
                        <Card.Header>
                            <div className="card-title mb-0">
                                <i className="ri-bar-chart-2-line me-2"></i>
                                Resumen Final de la Auditoría
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col md={6}>
                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                                        <div>
                                            <small className="text-muted d-block">Total Facturado</small>
                                            <h5 className="mb-0 fw-semibold">{formatCurrency(estadisticas.totalFacturado)}</h5>
                                        </div>
                                        <span className="avatar avatar-sm bg-primary-transparent">
                                            <i className="ri-file-text-line fs-16"></i>
                                        </span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                                        <div>
                                            <small className="text-muted d-block">Total Glosado</small>
                                            <h5 className="mb-0 fw-semibold text-danger">{formatCurrency(estadisticas.totalGlosadoEfectivo)}</h5>
                                        </div>
                                        <span className="avatar avatar-sm bg-danger-transparent">
                                            <i className="ri-error-warning-line fs-16"></i>
                                        </span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                                        <div>
                                            <small className="text-muted d-block">Total a Pagar</small>
                                            <h5 className="mb-0 fw-semibold text-success">{formatCurrency(estadisticas.totalAPagar)}</h5>
                                        </div>
                                        <span className="avatar avatar-sm bg-success-transparent">
                                            <i className="ri-money-dollar-circle-line fs-16"></i>
                                        </span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                                        <div>
                                            <small className="text-muted d-block">Porcentaje Glosado</small>
                                            <h5 className="mb-0 fw-semibold text-warning">{estadisticas.porcentajeGlosado.toFixed(1)}%</h5>
                                        </div>
                                        <span className="avatar avatar-sm bg-warning-transparent">
                                            <i className="ri-percent-line fs-16"></i>
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            {/* Detalle adicional */}
                            <div className="mt-3 p-3 bg-light rounded">
                                <Row className="text-center">
                                    <Col xs={6}>
                                        <div className="border-end">
                                            <h6 className="mb-1 fw-semibold">{estadisticas.cantidadServicios}</h6>
                                            <small className="text-muted">Servicios Auditados</small>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div>
                                            <h6 className="mb-1 fw-semibold">{estadisticas.cantidadGlosas}</h6>
                                            <small className="text-muted">Glosas Aplicadas</small>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Observaciones finales */}
                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones Finales (Opcional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Ingrese observaciones adicionales sobre esta auditoría..."
                            value={observacionesFinal}
                            onChange={(e) => setObservacionesFinal(e.target.value)}
                            disabled={loading}
                        />
                    </Form.Group>

                    {/* Términos y condiciones */}
                    <Form.Check 
                        type="checkbox" 
                        id="terminos-auditoria"
                        custom
                        className="mt-3"
                    >
                        <Form.Check.Input 
                            type="checkbox" 
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            disabled={loading}
                        />
                        <Form.Check.Label htmlFor="terminos-auditoria">
                            Confirmo que he revisado todos los servicios y las glosas aplicadas son correctas según 
                            la normativa vigente y los criterios de auditoría médica establecidos.
                        </Form.Check.Label>
                    </Form.Check>
                </Modal.Body>

                <Modal.Footer className="border-top">
                    <SpkButton 
                        Buttonvariant="light" 
                        Buttontype="button" 
                        Customclass="btn btn-light px-4"
                        onClickfunc={onHide}
                        disabled={loading}
                    >
                        <i className="ri-close-line me-1"></i>
                        Cancelar
                    </SpkButton>
                    <SpkButton 
                        Buttonvariant="primary" 
                        Buttontype="button" 
                        Customclass="btn btn-primary px-4"
                        onClickfunc={handleConfirm}
                        disabled={loading || !aceptaTerminos}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Finalizando...
                            </>
                        ) : (
                            <>
                                <i className="ri-check-double-line me-1"></i>
                                Confirmar y Finalizar
                            </>
                        )}
                    </SpkButton>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default ModalFinalizarAuditoria;