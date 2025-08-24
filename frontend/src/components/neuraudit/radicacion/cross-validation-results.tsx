import React from 'react';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import SpkBadge from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge';

interface CrossValidationResultsProps {
    validationResults?: any;
}

const CrossValidationResults: React.FC<CrossValidationResultsProps> = ({ validationResults }) => {
    if (!validationResults || !validationResults.cross_validation) {
        return null;
    }

    const { cross_validation } = validationResults;
    const { detalles, errores, advertencias, resumen } = cross_validation;

    return (
        <Card className="custom-card">
            <Card.Header>
                <div className="card-title">
                    <i className="ri-shield-check-line me-2"></i>
                    Resultados de Validación Cruzada
                </div>
            </Card.Header>
            <Card.Body>
                {/* Resumen General */}
                <Row className="mb-4">
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <div className="text-center">
                            <h3 className={`mb-1 ${resumen.requiere_atencion ? 'text-danger' : 'text-success'}`}>
                                {resumen.validaciones_exitosas}/{resumen.total_validaciones}
                            </h3>
                            <p className="text-muted mb-0">Validaciones Exitosas</p>
                        </div>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <div className="text-center">
                            <h3 className="mb-1 text-danger">{errores?.length || 0}</h3>
                            <p className="text-muted mb-0">Errores Críticos</p>
                        </div>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <div className="text-center">
                            <h3 className="mb-1 text-warning">{advertencias?.length || 0}</h3>
                            <p className="text-muted mb-0">Advertencias</p>
                        </div>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <div className="text-center">
                            <SpkBadge 
                                Customclass={`badge ${cross_validation.valido ? 'bg-success' : 'bg-danger'} fs-14`}
                            >
                                {cross_validation.valido ? 'VÁLIDO' : 'INVÁLIDO'}
                            </SpkBadge>
                        </div>
                    </Col>
                </Row>

                {/* Errores Críticos */}
                {errores && errores.length > 0 && (
                    <Alert variant="danger" className="mb-3">
                        <h6 className="alert-heading">
                            <i className="ri-error-warning-line me-2"></i>
                            Errores Críticos - Debe corregir antes de radicar
                        </h6>
                        <ul className="mb-0">
                            {errores.map((error: string, index: number) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                {/* Advertencias */}
                {advertencias && advertencias.length > 0 && (
                    <Alert variant="warning" className="mb-3">
                        <h6 className="alert-heading">
                            <i className="ri-alert-line me-2"></i>
                            Advertencias
                        </h6>
                        <ul className="mb-0">
                            {advertencias.map((advertencia: string, index: number) => (
                                <li key={index}>{advertencia}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                {/* Detalles de Validaciones */}
                <div className="validation-details">
                    {/* Validación NIT */}
                    {detalles?.nit && (
                        <div className="mb-3">
                            <h6 className="fw-semibold">
                                <i className={`ri-${detalles.nit.coincide ? 'checkbox-circle' : 'close-circle'}-line text-${detalles.nit.coincide ? 'success' : 'danger'} me-2`}></i>
                                NIT del Prestador
                            </h6>
                            <p className="text-muted mb-1">{detalles.nit.mensaje}</p>
                            {detalles.nit.valores && (
                                <div className="ms-4">
                                    <small className="d-block">XML: {detalles.nit.valores.xml || 'No encontrado'}</small>
                                    <small className="d-block">RIPS: {detalles.nit.valores.rips || 'No encontrado'}</small>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Validación Número de Factura */}
                    {detalles?.factura && (
                        <div className="mb-3">
                            <h6 className="fw-semibold">
                                <i className={`ri-${detalles.factura.coincide ? 'checkbox-circle' : 'close-circle'}-line text-${detalles.factura.coincide ? 'success' : 'danger'} me-2`}></i>
                                Número de Factura
                            </h6>
                            <p className="text-muted mb-1">{detalles.factura.mensaje}</p>
                            {detalles.factura.valores && (
                                <div className="ms-4">
                                    <small className="d-block">XML: {detalles.factura.valores.xml || 'No encontrado'}</small>
                                    <small className="d-block">RIPS: {detalles.factura.valores.rips || 'No encontrado'}</small>
                                    {detalles.factura.valores.cuv && (
                                        <small className="d-block">CUV: {detalles.factura.valores.cuv}</small>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Validación CUV */}
                    {detalles?.cuv && (
                        <div className="mb-3">
                            <h6 className="fw-semibold">
                                <i className={`ri-${detalles.cuv.valido ? 'checkbox-circle' : 'close-circle'}-line text-${detalles.cuv.valido ? 'success' : 'danger'} me-2`}></i>
                                Código Único de Validación (CUV)
                            </h6>
                            {detalles.cuv.codigo_unico && (
                                <p className="text-muted mb-1">
                                    CUV: <code className="text-break">{detalles.cuv.codigo_unico}</code>
                                </p>
                            )}
                            {detalles.cuv.errores && detalles.cuv.errores.length > 0 && (
                                <ul className="text-danger">
                                    {detalles.cuv.errores.map((error: string, index: number) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Validación Soportes PDF */}
                    {detalles?.soportes && (
                        <div className="mb-3">
                            <h6 className="fw-semibold">
                                <i className={`ri-${detalles.soportes.valido ? 'checkbox-circle' : 'close-circle'}-line text-${detalles.soportes.valido ? 'success' : 'danger'} me-2`}></i>
                                Nomenclatura de Soportes PDF
                            </h6>
                            {detalles.soportes.estadisticas && (
                                <div className="ms-4">
                                    <small className="d-block">
                                        Archivos válidos: {detalles.soportes.estadisticas.archivos_validos}/{detalles.soportes.estadisticas.total_archivos} 
                                        ({detalles.soportes.estadisticas.porcentaje_validez.toFixed(1)}%)
                                    </small>
                                </div>
                            )}
                            {detalles.soportes.archivos_invalidos && detalles.soportes.archivos_invalidos.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-danger">Archivos con nomenclatura incorrecta:</small>
                                    <ul className="text-danger small">
                                        {detalles.soportes.archivos_invalidos.map((archivo: any, index: number) => (
                                            <li key={index}>{archivo.archivo}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default CrossValidationResults;