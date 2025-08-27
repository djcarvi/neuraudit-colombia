
import { Link, useNavigate } from "react-router-dom";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import Seo from "../../../shared/layouts-components/seo/seo";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import radicacionService from "../../../services/neuraudit/radicacionService";
import contratacionService from "../../../services/neuraudit/contratacionService";
import Swal from 'sweetalert2';
import RadicacionStatsViewer from "./radicacion-stats-viewer";
import CrossValidationResults from "./cross-validation-results";

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
        cuv_file: null as File | null,
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
        paciente: null,
        validacion_minsalud: {
            codigo_unico_validacion: '',
            fecha_validacion: null
        }
    });
    
    // Estado de validación
    const [readyToCreate, setReadyToCreate] = useState(false);
    const [validationResults, setValidationResults] = useState<any>(null);
    
    // Estado para prestadores y contratos
    const [prestadores, setPrestadores] = useState<any[]>([]);
    const [prestadorSeleccionado, setPrestadorSeleccionado] = useState<string>('');
    const [buscandoPrestador, setBuscandoPrestador] = useState<string>('');
    const [cargandoPrestadores, setCargandoPrestadores] = useState(false);
    const [contratosActivos, setContratosActivos] = useState<any[]>([]);
    const [contratoSeleccionado, setContratoSeleccionado] = useState<string>('');
    const [cargandoContratos, setCargandoContratos] = useState(false);

    // Función para buscar prestadores
    const buscarPrestadores = async (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 3) return;
        
        try {
            setCargandoPrestadores(true);
            const response = await contratacionService.getPrestadores({
                search: searchTerm,
                estado: 'ACTIVO'
            });
            
            if (response.results) {
                setPrestadores(response.results);
            }
        } catch (error) {
            console.error('Error buscando prestadores:', error);
            Swal.fire('Error', 'No se pudieron cargar los prestadores', 'error');
        } finally {
            setCargandoPrestadores(false);
        }
    };

    // Función para cargar contratos cuando se seleccione un prestador
    const cargarContratosPrestador = async (prestadorNit: string) => {
        try {
            setCargandoContratos(true);
            setContratosActivos([]);
            setContratoSeleccionado('');
            
            const contratosResponse = await radicacionService.getContratosActivosPrestador(prestadorNit);
            if (contratosResponse.success && contratosResponse.contratos) {
                setContratosActivos(contratosResponse.contratos);
                // Si solo hay un contrato, seleccionarlo automáticamente
                if (contratosResponse.contratos.length === 1) {
                    setContratoSeleccionado(contratosResponse.contratos[0].id);
                }
            }
        } catch (error) {
            console.error('Error cargando contratos:', error);
            Swal.fire('Error', 'No se pudieron cargar los contratos del prestador', 'error');
        } finally {
            setCargandoContratos(false);
        }
    };

    // Cargar prestador del usuario logueado al montar
    useEffect(() => {
        const userStr = localStorage.getItem('neurauditUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Si es PSS, preseleccionar su prestador
            if (user.tipo_usuario === 'PSS' && user.nit) {
                setPrestadorSeleccionado(user.nit);
                cargarContratosPrestador(user.nit);
            }
        }
    }, []);

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
    
    const handleCuvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const extension = file.name.toLowerCase().split('.').pop();
            if (extension !== 'json' && extension !== 'txt') {
                Swal.fire('Error', 'Solo se permiten archivos JSON o TXT para el CUV', 'error');
                event.target.value = '';
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire('Error', 'El archivo CUV no puede exceder 5MB', 'error');
                event.target.value = '';
                return;
            }
            
            setFiles(prev => ({ ...prev, cuv_file: file }));
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
        // Validar contrato seleccionado
        if (!prestadorSeleccionado) {
            Swal.fire('Error', 'Debe seleccionar un prestador antes de procesar los archivos', 'error');
            return;
        }
        
        if (!contratoSeleccionado) {
            Swal.fire('Error', 'Debe seleccionar un contrato antes de procesar los archivos', 'error');
            return;
        }
        
        if (!files.factura_xml || !files.rips_json || !files.cuv_file) {
            Swal.fire('Error', 'Debe seleccionar la factura XML, el RIPS JSON y el archivo CUV', 'error');
            return;
        }
        
        setProcessing(true);
        
        try {
            // Obtener modalidad del contrato seleccionado
            const contratoInfo = contratosActivos.find(c => c.id === contratoSeleccionado);
            
            const response = await radicacionService.processFiles(files, {
                contrato_id: contratoSeleccionado,
                modalidad_contrato: contratoInfo?.modalidad_principal || 'EVENTO'
            });
            
            if (response.success) {
                console.log('📊 RESPUESTA COMPLETA DEL BACKEND:', response);
                console.log('💰 FACTURA INFO:', response.extracted_info?.factura);
                console.log('💵 RESUMEN MONETARIO:', response.extracted_info?.factura?.resumen_monetario);
                console.log('👥 PACIENTES MÚLTIPLES:', response.extracted_info?.pacientes_multiples);
                console.log('🏥 SERVICIOS:', response.extracted_info?.servicios);
                console.log('📋 TIPO PRINCIPAL:', response.extracted_info?.servicios?.tipo_principal);
                console.log('💊 MODALIDAD INFERIDA:', response.extracted_info?.servicios?.modalidad_inferida);
                console.log('🔍 VALIDACIÓN CRUZADA:', response.cross_validation);
                
                // Guardar información extraída
                setExtractedInfo(response.extracted_info);
                setReadyToCreate(response.ready_to_create);
                setValidationResults(response);
                
                // Si hay errores de validación cruzada, mostrarlos
                if (response.cross_validation && !response.cross_validation.valido) {
                    const errores = response.cross_validation.errores || [];
                    Swal.fire({
                        icon: 'error',
                        title: 'Errores de Validación',
                        html: `
                            <div class="text-start">
                                <p><strong>Se encontraron errores que deben corregirse:</strong></p>
                                <ul>
                                    ${errores.map((error: string) => `<li>${error}</li>`).join('')}
                                </ul>
                                <p class="text-muted">Por favor, verifique que los archivos correspondan al mismo prestador y factura.</p>
                            </div>
                        `,
                        confirmButtonText: 'Entendido'
                    });
                } else {
                    Swal.fire('Éxito', 'Información extraída y validada exitosamente', 'success');
                }
                
                // Pasar al siguiente paso
                setKey('second');
            } else {
                Swal.fire('Error', response.error || 'Error procesando archivos', 'error');
            }
            
        } catch (error: any) {
            console.error('Error procesando archivos:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                // Si hay validación cruzada con errores, mostrarlos claramente
                if (errorData.cross_validation && !errorData.cross_validation.valido) {
                    const errores = errorData.cross_validation.errores || [];
                    const advertencias = errorData.cross_validation.advertencias || [];
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Errores de Validación',
                        html: `
                            <div class="text-start">
                                <p><strong>Los archivos no coinciden entre sí:</strong></p>
                                ${errores.length > 0 ? `
                                    <p class="text-danger fw-bold">Errores críticos:</p>
                                    <ul class="text-danger">
                                        ${errores.map((error: string) => `<li>${error}</li>`).join('')}
                                    </ul>
                                ` : ''}
                                ${advertencias.length > 0 ? `
                                    <p class="text-warning fw-bold mt-3">Advertencias:</p>
                                    <ul class="text-warning">
                                        ${advertencias.map((warn: string) => `<li>${warn}</li>`).join('')}
                                    </ul>
                                ` : ''}
                                <p class="text-muted mt-3">Por favor, verifique que todos los archivos correspondan al mismo prestador y la misma factura.</p>
                            </div>
                        `,
                        confirmButtonText: 'Entendido',
                        width: '600px'
                    });
                } else if (errorData.errors && errorData.errors.length > 0) {
                    // Si hay otros errores
                    Swal.fire({
                        icon: 'error',
                        title: 'Error procesando archivos',
                        html: `
                            <div class="text-start">
                                <ul>
                                    ${errorData.errors.map((error: string) => `<li>${error}</li>`).join('')}
                                </ul>
                            </div>
                        `,
                        confirmButtonText: 'Entendido'
                    });
                } else {
                    // Error genérico
                    Swal.fire('Error', errorData.error || 'Error procesando archivos', 'error');
                }
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
                diagnostico_principal: 'Z000',  // Código genérico para servicios generales
                
                // Contrato asociado (NUEVO - OBLIGATORIO)
                contrato_id: contratoSeleccionado
            };
            
            // Enviar tanto los datos como los archivos originales
            const response = await radicacionService.createRadicacion(radicacionData, files);
            
            if (response && response.success) {
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
                                                
                                                {/* Selección de prestador */}
                                                <div className="mb-4">
                                                    <h6 className="fw-semibold mb-2">Prestador <span className="text-danger">*</span></h6>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Buscar por NIT o razón social..."
                                                        value={buscandoPrestador}
                                                        onChange={(e) => {
                                                            setBuscandoPrestador(e.target.value);
                                                            if (e.target.value.length >= 3) {
                                                                buscarPrestadores(e.target.value);
                                                            }
                                                        }}
                                                        className="mb-2"
                                                    />
                                                    {cargandoPrestadores && (
                                                        <div className="text-warning">
                                                            <i className="ri-loader-4-line ri-spin me-1"></i>
                                                            Buscando prestadores...
                                                        </div>
                                                    )}
                                                    {prestadores.length > 0 && buscandoPrestador.length >= 3 && (
                                                        <div className="list-group mb-2" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                            {prestadores.map(prestador => (
                                                                <button
                                                                    key={prestador.id}
                                                                    type="button"
                                                                    className={`list-group-item list-group-item-action ${prestadorSeleccionado === prestador.nit ? 'active' : ''}`}
                                                                    onClick={() => {
                                                                        setPrestadorSeleccionado(prestador.nit);
                                                                        setBuscandoPrestador(`${prestador.nit} - ${prestador.razon_social}`);
                                                                        setPrestadores([]);
                                                                        cargarContratosPrestador(prestador.nit);
                                                                    }}
                                                                >
                                                                    <strong>{prestador.nit}</strong> - {prestador.razon_social}
                                                                    <br />
                                                                    <small className="text-muted">{prestador.ciudad}, {prestador.departamento}</small>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {prestadorSeleccionado && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-success-transparent">
                                                                <i className="ri-building-line me-1"></i>
                                                                Prestador seleccionado: {prestadorSeleccionado}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Selección de contrato - MOVIDO AL PASO 1 */}
                                                <div className="mb-4">
                                                    <h6 className="fw-semibold mb-2">Selección de Contrato <span className="text-danger">*</span></h6>
                                                    <Form.Select
                                                        value={contratoSeleccionado}
                                                        onChange={(e) => setContratoSeleccionado(e.target.value)}
                                                        className="form-control"
                                                        required
                                                    >
                                                        <option value="">-- Seleccione el contrato para esta radicación --</option>
                                                        {contratosActivos.map(contrato => (
                                                            <option key={contrato.id} value={contrato.id}>
                                                                {contrato.numero_contrato} - {contrato.modalidad_principal} 
                                                                ({new Date(contrato.fecha_inicio).toLocaleDateString()} - {new Date(contrato.fecha_fin).toLocaleDateString()})
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    {cargandoContratos && (
                                                        <div className="text-warning mt-2">
                                                            <i className="ri-loader-4-line ri-spin me-1"></i>
                                                            Cargando contratos activos...
                                                        </div>
                                                    )}
                                                    {!cargandoContratos && contratosActivos.length === 0 && (
                                                        <div className="text-danger mt-2">
                                                            <i className="ri-alert-line me-1"></i>
                                                            No se encontraron contratos activos para este prestador
                                                        </div>
                                                    )}
                                                    {contratoSeleccionado && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-info-transparent">
                                                                <i className="ri-file-contract-line me-1"></i>
                                                                {contratosActivos.find(c => c.id === contratoSeleccionado)?.modalidad_principal === 'CAPITACION' 
                                                                    ? 'Contrato de Capitación - Se esperan valores 0 en RIPS' 
                                                                    : 'Contrato por Evento - Los servicios deben tener valores'}
                                                            </span>
                                                        </div>
                                                    )}
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
                                                    <Form.Label className="fw-semibold">CUV - Código Único de Validación <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="file" 
                                                        accept=".json,.txt"
                                                        onChange={handleCuvUpload}
                                                        disabled={processing}
                                                        required
                                                    />
                                                    <div className="form-text">Archivo JSON o TXT con el resultado de validación MinSalud</div>
                                                    {files.cuv_file && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-info-transparent">
                                                                <i className="ri-shield-check-line me-1"></i>{files.cuv_file.name}
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
                                                
                                                {!contratoSeleccionado && (
                                                    <div className="alert alert-warning mb-4" role="alert">
                                                        <i className="ri-alert-line me-2"></i>
                                                        Debe seleccionar un contrato antes de procesar los archivos
                                                    </div>
                                                )}
                                                
                                                <div className="text-center">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-primary btn-wave" 
                                                        onClick={processFiles}
                                                        disabled={!contratoSeleccionado || !files.factura_xml || !files.rips_json || !files.cuv_file || processing}
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
                                            
                                            {/* Resultados de validación cruzada */}
                                            {validationResults && (
                                                <Row className="mt-3">
                                                    <Col xl={12}>
                                                        <CrossValidationResults validationResults={validationResults} />
                                                    </Col>
                                                </Row>
                                            )}
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
                                            {key !== 'first' && (
                                                <div className="previous">
                                                    <Link to="#!" className="btn icon-btn btn-light" onClick={handlePrevious}>
                                                        <i className="bx bx-left-arrow-alt me-2"></i>Anterior
                                                    </Link>
                                                </div>
                                            )}
                                            {key === 'first' && <div></div>}
                                            
                                            {key === 'second' && (
                                                <div className="next">
                                                    <Link to="#!" className="btn icon-btn btn-primary" onClick={handleNext}>
                                                        Continuar a Confirmación<i className="bx bx-right-arrow-alt ms-2"></i>
                                                    </Link>
                                                </div>
                                            )}
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