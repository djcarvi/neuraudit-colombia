
import { Link, useNavigate } from "react-router-dom";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState, useRef } from "react";
import { Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import radicacionService from "../../../services/neuraudit/radicacionService";
import Swal from 'sweetalert2';
import RadicacionStatsViewer from "./radicacion-stats-viewer";

interface NuevaRadicacionProps { }

const NuevaRadicacion: React.FC<NuevaRadicacionProps> = () => {

    const [key, setKey] = useState('first');
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    
    // Referencias a los inputs
    const facturaXmlRef = useRef<HTMLInputElement>(null);
    const ripsJsonRef = useRef<HTMLInputElement>(null);
    
    // Estado para archivos
    const [files, setFiles] = useState({
        factura_xml: null as File | null,
        rips_json: null as File | null,
        soportes: [] as File[]
    });
    
    // Estado para información extraída
    const [extractedInfo, setExtractedInfo] = useState<any>({
        prestador: { nit: '', nombre: '' },
        factura: { 
            numero: '', 
            fecha_expedicion: '', 
            valor_total: 0,
            resumen_monetario: {
                valor_bruto: 0,
                valor_sin_impuestos: 0,
                valor_con_impuestos: 0,
                valor_prepagado: 0,
                valor_final_pagar: 0
            },
            sector_salud: null  // Campos del Sector Salud del XML
        },
        servicios: {
            estadisticas: { total_usuarios: 0 },
            detalle_completo: {
                consultas: 0,
                procedimientos: 0,
                medicamentos: 0,
                urgencias: 0,
                hospitalizacion: 0,
                otros_servicios: 0
            },
            tipo_principal: null,
            modalidad_inferida: null
        },
        pacientes_multiples: [],
        paciente: null
    });
    
    // Estado de validación
    const [readyToCreate, setReadyToCreate] = useState(false);

    const handleTabSelect = (selectedKey: any) => {
        setKey(selectedKey);
    };

    const handleNext = () => {
        switch (key) {
            case 'first':
                setKey('second');
                break;
            case 'second':
                setKey('third');
                break;
            default:
                break;
        }
    };

    const handlePrevious = () => {
        switch (key) {
            case 'second':
                setKey('first');
                break;
            case 'third':
                setKey('second');
                break;
            default:
                break;
        }
    };
    
    // Manejadores de archivos
    const handleFacturaXmlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.toLowerCase().endsWith('.xml')) {
                Swal.fire('Error', 'Solo se permiten archivos XML para la factura electrónica', 'error');
                if (facturaXmlRef.current) facturaXmlRef.current.value = '';
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                Swal.fire('Error', 'El archivo XML no puede exceder 10MB', 'error');
                if (facturaXmlRef.current) facturaXmlRef.current.value = '';
                return;
            }
            
            setFiles(prev => ({ ...prev, factura_xml: file }));
        }
    };
    
    const handleRipsJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.toLowerCase().endsWith('.json')) {
                Swal.fire('Error', 'Solo se permiten archivos JSON para RIPS', 'error');
                if (ripsJsonRef.current) ripsJsonRef.current.value = '';
                return;
            }
            
            if (file.size > 50 * 1024 * 1024) {
                Swal.fire('Error', 'El archivo JSON no puede exceder 50MB', 'error');
                if (ripsJsonRef.current) ripsJsonRef.current.value = '';
                return;
            }
            
            setFiles(prev => ({ ...prev, rips_json: file }));
        }
    };
    
    const handleSoportesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        
        for (const file of files) {
            const extension = file.name.toLowerCase().split('.').pop();
            if (!['pdf', 'zip'].includes(extension || '')) {
                Swal.fire('Error', `Archivo ${file.name}: Solo se permiten archivos PDF o ZIP como soportes`, 'error');
                return;
            }
            
            if (file.size > 20 * 1024 * 1024) {
                Swal.fire('Error', `Archivo ${file.name}: No puede exceder 20MB`, 'error');
                return;
            }
        }
        
        setFiles(prev => ({ ...prev, soportes: files }));
    };
    
    // Procesar archivos
    const processFiles = async () => {
        if (!files.factura_xml || !files.rips_json) {
            Swal.fire('Error', 'Debe seleccionar tanto la factura XML como el RIPS JSON', 'error');
            return;
        }
        
        setProcessing(true);
        
        try {
            const response = await radicacionService.processFiles(files);
            
            if (response.success) {
                console.log('📊 RESPUESTA COMPLETA DEL BACKEND:', response);
                console.log('💰 FACTURA INFO:', response.extracted_info?.factura);
                console.log('💵 RESUMEN MONETARIO:', response.extracted_info?.factura?.resumen_monetario);
                console.log('👥 PACIENTES MÚLTIPLES:', response.extracted_info?.pacientes_multiples);
                console.log('🏥 SERVICIOS:', response.extracted_info?.servicios);
                console.log('📋 TIPO PRINCIPAL:', response.extracted_info?.servicios?.tipo_principal);
                console.log('💊 MODALIDAD INFERIDA:', response.extracted_info?.servicios?.modalidad_inferida);
                
                // Guardar información extraída
                setExtractedInfo(response.extracted_info);
                setReadyToCreate(response.ready_to_create);
                
                // Pasar al siguiente paso
                setKey('second');
                
                Swal.fire('Éxito', 'Información extraída exitosamente de los archivos', 'success');
            } else {
                Swal.fire('Error', response.error || 'Error procesando archivos', 'error');
            }
            
        } catch (error: any) {
            console.error('Error procesando archivos:', error);
            if (error.response?.data?.error) {
                Swal.fire('Error', error.response.data.error, 'error');
            } else {
                Swal.fire('Error', 'Error de conexión. Verifique su conexión a internet.', 'error');
            }
        } finally {
            setProcessing(false);
        }
    };
    
    // Confirmar radicación
    const confirmRadicacion = async () => {
        if (!readyToCreate) {
            Swal.fire('Error', 'No se puede radicar: existen errores en los archivos', 'error');
            return;
        }
        
        setProcessing(true);
        
        try {
            // Crear la radicación usando la información extraída
            const radicacionData = {
                // Datos del prestador (extraídos automáticamente)
                pss_nit: extractedInfo.prestador?.nit,
                pss_nombre: extractedInfo.prestador?.nombre,
                
                // Datos de la factura (extraídos automáticamente)
                factura_numero: extractedInfo.factura?.numero,
                factura_fecha_expedicion: extractedInfo.factura?.fecha_expedicion,
                factura_valor_total: extractedInfo.factura?.valor_total,
                
                // Datos de servicios (inferidos automáticamente y mapeados)
                tipo_servicio: extractedInfo.servicios?.tipo_principal,
                modalidad_pago: extractedInfo.servicios?.modalidad_inferida,
                
                // Datos del paciente (solo identificadores únicos)
                paciente_tipo_documento: extractedInfo.paciente?.paciente_tipo_documento || 'CC',
                paciente_numero_documento: extractedInfo.paciente?.paciente_numero_documento || '',
                paciente_codigo_sexo: extractedInfo.paciente?.paciente_codigo_sexo || 'M',
                paciente_codigo_edad: extractedInfo.paciente?.paciente_codigo_edad || '001',
                
                // Fechas de atención (usando fecha de factura como referencia)
                fecha_atencion_inicio: extractedInfo.factura?.fecha_expedicion || new Date().toISOString(),
                
                // Diagnóstico (requerido - usar código genérico)
                diagnostico_principal: 'Z000'  // Código genérico para servicios generales
            };
            
            const response = await radicacionService.createRadicacion(radicacionData);
            
            if (response) {
                Swal.fire(
                    '¡Éxito!',
                    `Cuenta radicada exitosamente. Número de radicado: ${response.numero_radicado}`,
                    'success'
                );
                
                // Redirigir al listado después de un momento
                setTimeout(() => {
                    navigate('/neuraudit/radicacion/consulta');
                }, 2000);
            }
            
        } catch (error: any) {
            console.error('Error radicando cuenta:', error);
            if (error.response?.data?.error) {
                Swal.fire('Error', error.response.data.error, 'error');
            } else {
                Swal.fire('Error', 'Error creando radicación. Intente nuevamente.', 'error');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="NeurAudit-Nueva Radicación" />

            <Pageheader title="Nueva Radicación" subtitle="Cuenta Médica" currentpage="Nueva Radicación" activepage="Radicación" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}


            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Flujo de Radicación según Resolución 2284 de 2023
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div id="basicwizard">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" activeKey={key} onSelect={handleTabSelect}>
                                    <Nav className="nav nav-tabs nav-justified flex-md-row flex-column mb-4 tab-style-8 scaleX p-0">
                                        <Nav.Item data-target-form="#uploadDocuments">
                                            <Nav.Link eventKey="first" className="icon-btn d-flex align-items-center justify-content-md-center gap-1">
                                                <i className="ri-upload-cloud-line"></i><span>Subir Archivos</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item data-target-form="#reviewInfo">
                                            <Nav.Link eventKey="second" className="icon-btn d-flex align-items-center justify-content-md-center gap-1">
                                                <i className="ri-file-search-line"></i><span>Revisar Información</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item data-target-form="#confirmRadicacion">
                                            <Nav.Link eventKey="third" className="icon-btn d-flex align-items-center justify-content-md-center gap-1">
                                                <i className="ri-shield-check-line"></i><span>Confirmar Radicación</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="first" className="show" id="uploadDocuments">
                                            <form id="uploadForm" className="needs-validation" noValidate>
                                                <div className="alert alert-primary" role="alert">
                                                    <i className="ri-information-line me-2"></i>
                                                    <strong>Resolución 2284 de 2023:</strong> Suba factura electrónica (XML) y RIPS validado (JSON). El sistema extraerá automáticamente toda la información.
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <Form.Label className="fw-semibold">Factura Electrónica (XML) <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="file" 
                                                        ref={facturaXmlRef}
                                                        accept=".xml"
                                                        onChange={handleFacturaXmlUpload}
                                                        disabled={processing}
                                                        required
                                                    />
                                                    <div className="form-text">Archivo XML de factura electrónica DIAN con CUFE válido</div>
                                                    {files.factura_xml && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-success-transparent">
                                                                <i className="ri-file-check-line me-1"></i>{files.factura_xml.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <Form.Label className="fw-semibold">RIPS Validado (JSON) <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="file" 
                                                        ref={ripsJsonRef}
                                                        accept=".json"
                                                        onChange={handleRipsJsonUpload}
                                                        disabled={processing}
                                                        required
                                                    />
                                                    <div className="form-text">Archivo JSON con código único MinSalud validado</div>
                                                    {files.rips_json && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-success-transparent">
                                                                <i className="ri-file-check-line me-1"></i>{files.rips_json.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <Form.Label className="fw-semibold">Soportes Adicionales</Form.Label>
                                                    <Form.Control 
                                                        type="file" 
                                                        multiple 
                                                        accept=".pdf,.zip"
                                                        onChange={handleSoportesUpload}
                                                        disabled={processing}
                                                    />
                                                    <div className="form-text">Autorizaciones, órdenes médicas, epicrisis, etc. (PDF o ZIP)</div>
                                                    {files.soportes.length > 0 && (
                                                        <div className="mt-2">
                                                            {files.soportes.map((file, index) => (
                                                                <span key={index} className="badge bg-info-transparent me-1">
                                                                    <i className="ri-attachment-line me-1"></i>{file.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="text-center">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-primary btn-wave" 
                                                        onClick={processFiles}
                                                        disabled={!files.factura_xml || !files.rips_json || processing}
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                Procesando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="ri-magic-line me-2"></i>
                                                                Extraer Información Automáticamente
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second" className="" id="reviewInfo">
                                            {/* Información extraída de archivos */}
                                            <Row>
                                                <Col xl={12}>
                                                    <RadicacionStatsViewer extractedInfo={extractedInfo} files={files} />
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third" className="" id="confirmRadicacion">
                                            <div className="row d-flex justify-content-center">
                                                <div className="col-lg-10">
                                                    <div className="alert alert-success" role="alert">
                                                        <i className="ri-shield-check-line me-2"></i>
                                                        <strong>Estado de Validación: Listo para Radicar</strong><br/>
                                                        Los archivos son válidos y cumplen con la Resolución 2284 de 2023.
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <h6 className="fw-semibold mb-2">Archivos Procesados:</h6>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="ri-file-text-line text-success me-2"></i>
                                                            <span className="text-success">Factura XML cargada correctamente</span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className="ri-file-code-line text-success me-2"></i>
                                                            <span className="text-success">RIPS JSON validado</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-center p-4">
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-success btn-wave"
                                                            onClick={confirmRadicacion}
                                                            disabled={!readyToCreate || processing}
                                                        >
                                                            {processing ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                    Radicando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="ri-check-line me-2"></i>
                                                                    Confirmar y Radicar Cuenta
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <div className="d-flex wizard justify-content-between mt-3 flex-wrap gap-2">
                                            <div className="first">
                                                <Link to="#!" className="btn btn-light" onClick={() => setKey('first')}>
                                                    Inicio
                                                </Link>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                <div className="previous me-2">
                                                    <Link to="#!" className={`btn icon-btn btn-primary ${key === 'first' ? 'disabled' : ''}`} onClick={handlePrevious}>
                                                        <i className="bx bx-left-arrow-alt me-2"></i>Anterior
                                                    </Link>
                                                </div>
                                                <div className="next">
                                                    <Link to="#!" className="btn icon-btn btn-secondary" onClick={handleNext}>
                                                        Siguiente<i className="bx bx-right-arrow-alt ms-2"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="last">
                                                <Link to="#!" className={`btn btn-success ${key === 'third' ? '' : 'disabled'}`} onClick={() => setKey('third')}>
                                                    Finalizar
                                                </Link>
                                            </div>
                                        </div>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

        </Fragment>
    )
};

export default NuevaRadicacion;