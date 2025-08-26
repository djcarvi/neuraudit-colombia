import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Modal, Form, Row, Col, Alert, Table, Spinner, ProgressBar } from 'react-bootstrap';
import SpkButton from '../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons';
import { toast } from 'react-toastify';

interface ModalImportarCSVProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (file: File, skipRows: number) => void;
    loading: boolean;
    resultadoProceso: any;
}

const ModalImportarCSV: React.FC<ModalImportarCSVProps> = ({ 
    show, 
    onHide, 
    onConfirm, 
    loading, 
    resultadoProceso 
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [skipRows, setSkipRows] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showInstrucciones, setShowInstrucciones] = useState<boolean>(true);
    
    // Reset cuando el modal se cierra
    useEffect(() => {
        if (!show) {
            setSelectedFile(null);
            setSkipRows(0);
            setShowInstrucciones(true);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [show]);
    
    const handleClose = () => {
        setSelectedFile(null);
        setSkipRows(0);
        setShowInstrucciones(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onHide();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    
    const handleImportar = () => {
        if (!selectedFile) {
            toast.error('Por favor seleccione un archivo CSV');
            return;
        }
        
        onConfirm(selectedFile, skipRows);
    };
    
    const calcularPorcentajeExito = () => {
        if (!resultadoProceso || resultadoProceso.total_procesados === 0) return 0;
        return Math.round((resultadoProceso.registros_exitosos / resultadoProceso.total_procesados) * 100);
    };
    
    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} centered size="xl" className="fade" tabIndex={-1}>
                <Modal.Header>
                    <Modal.Title as="h6">
                        <i className="ri-file-upload-line me-2"></i>
                        Importar Prestadores desde CSV
                    </Modal.Title>
                    <SpkButton 
                        Buttontype="button" 
                        Buttonvariant="" 
                        Customclass="btn-close" 
                        data-bs-dismiss="modal"
                        aria-label="Close" 
                        onClickfunc={handleClose}
                    />
                </Modal.Header>
                <Modal.Body className="px-4">
                    <Row className="gy-3">
                        {/* Instrucciones */}
                        {showInstrucciones && !resultadoProceso && (
                            <Col xl={12}>
                                <Alert variant="info" dismissible onClose={() => setShowInstrucciones(false)}>
                                    <h6 className="alert-heading">
                                        <i className="ri-information-line me-2"></i>
                                        Instrucciones de Importación
                                    </h6>
                                    <hr />
                                    <div className="mb-2">
                                        <strong>Formato del archivo CSV:</strong>
                                        <ul className="mb-2 mt-2">
                                            <li>El archivo debe estar en formato CSV (valores separados por comas o punto y coma)</li>
                                            <li>Codificación: UTF-8, Latin-1 o ISO-8859-1</li>
                                        </ul>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Columnas requeridas:</strong>
                                        <ul className="mb-2 mt-2">
                                            <li><code>NIT</code>: Número de identificación tributaria (sin dígito verificador)</li>
                                            <li><code>DV</code> o <code>Dígito Verificador</code>: Dígito de verificación del NIT</li>
                                            <li><code>Razón Social</code>: Nombre legal del prestador</li>
                                            <li><code>Código Prestador</code>: Código de habilitación (opcional)</li>
                                            <li><code>Departamento</code>: Departamento de ubicación</li>
                                            <li><code>Municipio</code>: Municipio o ciudad</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>Notas importantes:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Los prestadores con NIT duplicado serán omitidos</li>
                                            <li>El sistema detectará automáticamente el tipo de prestador</li>
                                            <li>Todos los prestadores se crearán con estado ACTIVO</li>
                                        </ul>
                                    </div>
                                </Alert>
                            </Col>
                        )}
                        
                        {/* Área de carga de archivo */}
                        {!resultadoProceso && (
                            <>
                                <Col xl={8}>
                                    <Form.Label htmlFor="csv-file" className="form-label">
                                        Archivo CSV <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        id="csv-file"
                                        ref={fileInputRef}
                                        accept=".csv"
                                        onChange={handleFileChange}
                                    />
                                    {selectedFile && (
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                <i className="ri-file-text-line me-1"></i>
                                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                            </small>
                                        </div>
                                    )}
                                </Col>
                                
                                <Col xl={4}>
                                    <Form.Label htmlFor="skip-rows" className="form-label">
                                        Omitir filas iniciales
                                    </Form.Label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="skip-rows" 
                                        placeholder="0" 
                                        value={skipRows}
                                        onChange={(e) => setSkipRows(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="10"
                                    />
                                    <small className="text-muted">
                                        Útil si el archivo tiene encabezados adicionales
                                    </small>
                                </Col>
                            </>
                        )}
                        
                        {/* Indicador de carga */}
                        {loading && (
                            <Col xl={12}>
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" className="mb-3" />
                                    <h5>Procesando archivo...</h5>
                                    <p className="text-muted">Por favor espere mientras se importan los prestadores</p>
                                </div>
                            </Col>
                        )}
                        
                        {/* Resultados del proceso */}
                        {resultadoProceso && !loading && (
                            <Col xl={12}>
                                <Alert variant={resultadoProceso.registros_con_error > 0 ? 'warning' : 'success'}>
                                    <h5 className="alert-heading">
                                        <i className="ri-check-double-line me-2"></i>
                                        Importación Completada
                                    </h5>
                                    <hr />
                                    
                                    {/* Barra de progreso visual */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Progreso de importación</span>
                                            <span>{calcularPorcentajeExito()}% exitoso</span>
                                        </div>
                                        <ProgressBar>
                                            <ProgressBar 
                                                variant="success" 
                                                now={resultadoProceso.registros_exitosos} 
                                                max={resultadoProceso.total_procesados}
                                                label={`${resultadoProceso.registros_exitosos}`}
                                            />
                                            <ProgressBar 
                                                variant="warning" 
                                                now={resultadoProceso.registros_duplicados} 
                                                max={resultadoProceso.total_procesados}
                                                label={`${resultadoProceso.registros_duplicados}`}
                                            />
                                            <ProgressBar 
                                                variant="danger" 
                                                now={resultadoProceso.registros_con_error} 
                                                max={resultadoProceso.total_procesados}
                                                label={`${resultadoProceso.registros_con_error}`}
                                            />
                                        </ProgressBar>
                                    </div>
                                    
                                    {/* Estadísticas detalladas */}
                                    <Row className="g-3">
                                        <Col md={3}>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-sm bg-primary-transparent me-2">
                                                    <i className="ri-file-list-3-line fs-14"></i>
                                                </span>
                                                <div>
                                                    <small className="text-muted d-block">Total Procesados</small>
                                                    <strong className="fs-14">{resultadoProceso.total_procesados}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-sm bg-success-transparent me-2">
                                                    <i className="ri-check-line fs-14"></i>
                                                </span>
                                                <div>
                                                    <small className="text-muted d-block">Importados</small>
                                                    <strong className="fs-14 text-success">{resultadoProceso.registros_exitosos}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-sm bg-warning-transparent me-2">
                                                    <i className="ri-file-copy-2-line fs-14"></i>
                                                </span>
                                                <div>
                                                    <small className="text-muted d-block">Duplicados</small>
                                                    <strong className="fs-14 text-warning">{resultadoProceso.registros_duplicados}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-sm bg-danger-transparent me-2">
                                                    <i className="ri-error-warning-line fs-14"></i>
                                                </span>
                                                <div>
                                                    <small className="text-muted d-block">Con Error</small>
                                                    <strong className="fs-14 text-danger">{resultadoProceso.registros_con_error}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    {/* Detalle de errores si los hay */}
                                    {resultadoProceso.errores && resultadoProceso.errores.length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="mb-2">Detalle de Errores (primeros 10):</h6>
                                            <div className="table-responsive" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                <Table size="sm" striped>
                                                    <tbody>
                                                        {resultadoProceso.errores.map((error: string, index: number) => (
                                                            <tr key={index}>
                                                                <td className="text-danger">{error}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </Alert>
                            </Col>
                        )}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {!resultadoProceso ? (
                        <>
                            <SpkButton 
                                Buttonvariant="light" 
                                Buttontype="button" 
                                Customclass="btn btn-light" 
                                data-bs-dismiss="modal" 
                                onClickfunc={handleClose}
                            >
                                Cancelar
                            </SpkButton>
                            <SpkButton 
                                Buttonvariant='primary' 
                                Buttontype="button" 
                                Customclass="btn btn-primary"
                                disabled={loading || !selectedFile}
                                onClickfunc={handleImportar}
                                title={!selectedFile ? "Seleccione un archivo CSV primero" : "Importar archivo CSV"}
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Importando...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-upload-cloud-2-line me-1"></i>
                                        Importar Prestadores
                                    </>
                                )}
                            </SpkButton>
                        </>
                    ) : (
                        <SpkButton 
                            Buttonvariant="primary" 
                            Buttontype="button" 
                            Customclass="btn btn-primary" 
                            data-bs-dismiss="modal" 
                            onClickfunc={handleClose}
                        >
                            <i className="ri-check-line me-1"></i>
                            Finalizar
                        </SpkButton>
                    )}
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default ModalImportarCSV;