import React, { Fragment, useEffect, useRef, useState } from "react";
import { Card, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { FilePond } from "react-filepond";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import { Link } from "react-router-dom";
import SpkSelect from "../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import SpkDatepickr from "../../../shared/@spk-reusable-components/reusable-plugins/spk-datepicker";
import dragula from "dragula";
import face2 from '../../../assets/images/faces/2.jpg';
import face8 from '../../../assets/images/faces/8.jpg';
import face4 from '../../../assets/images/faces/4.jpg';
import face10 from '../../../assets/images/faces/10.jpg';
import face13 from '../../../assets/images/faces/13.jpg';
import auditoriaService from '../../../services/neuraudit/auditoriaService';
import { toast } from 'react-toastify';

interface ModalAplicarGlosaProps {
    show: boolean;
    onHide: () => void;
    servicio: any;
    onGlosaAplicada: () => void;
}

const ModalAplicarGlosa: React.FC<ModalAplicarGlosaProps> = ({ show, onHide, servicio, onGlosaAplicada }) => {

    const [files, setFiles] = useState<any>([]);
    const [dates, setDates] = useState<{ [key: string]: Date | string | null }>({});
    const [selectedTipoGlosa, setSelectedTipoGlosa] = useState<string>("");
    const [selectedCodigoGlosa, setSelectedCodigoGlosa] = useState<string>("");
    const [valorGlosado, setValorGlosado] = useState<string>("");
    const [observaciones, setObservaciones] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [glosasTemporales, setGlosasTemporales] = useState<any[]>([]);
    const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
    const [warningMessage, setWarningMessage] = useState<string>("");
    const [warningCallback, setWarningCallback] = useState<(() => void) | null>(null);
    
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

    const handleClose = () => {
        // Limpiar el formulario al cerrar
        setSelectedTipoGlosa("");
        setSelectedCodigoGlosa("");
        setValorGlosado("");
        setObservaciones("");
        setGlosasTemporales([]);
        onHide();
    };

    // Cargar glosas existentes cuando se abre el modal
    useEffect(() => {
        if (show && servicio) {
            const glosasExistentes = servicio.glosas || servicio.glosas_aplicadas || [];
            setGlosasTemporales([...glosasExistentes]);
        }
    }, [show, servicio]);

    // Función para agregar glosa temporal
    const agregarGlosaTemporal = () => {
        const codigoInfo = codigosGlosa.find(c => c.value === selectedCodigoGlosa);
        const nuevaGlosa = {
            codigo_glosa: selectedCodigoGlosa,
            tipo_glosa: selectedTipoGlosa,
            descripcion_glosa: codigoInfo?.label || selectedCodigoGlosa,
            valor_glosado: parseFloat(valorGlosado),
            observaciones: observaciones,
            temporal: true,
            estado: 'NUEVA'
        };
        
        setGlosasTemporales([...glosasTemporales, nuevaGlosa]);
        
        // Limpiar formulario
        setSelectedTipoGlosa("");
        setSelectedCodigoGlosa("");
        setValorGlosado("");
        setObservaciones("");
        
        toast.success('Glosa agregada temporalmente');
    };

    // Tipos de glosa según Resolución 2284
    const tiposGlosa = [
        { value: "FA", label: "FA - Facturación" },
        { value: "TA", label: "TA - Tarifas" },
        { value: "SO", label: "SO - Soportes" },
        { value: "AU", label: "AU - Autorizaciones" },
        { value: "CO", label: "CO - Cobertura" },
        { value: "CL", label: "CL - Calidad" },
        { value: "SA", label: "SA - Seguimiento Acuerdos" }
    ];

    // Estructura completa de códigos según Resolución 2284 - Con todos los subcódigos oficiales
    const codigosPorTipo: { [key: string]: Array<{ value: string; label: string }> } = {
        FA: [
            { value: "FA1605", label: "FA1605 - Personas que corresponden a otro responsable de pago" },
            { value: "FA1606", label: "FA1606 - Servicios o tecnologías que corresponden a otro responsable de pago" },
            { value: "FA1905", label: "FA1905 - Error en descuento pactado" },
            { value: "FA2006", label: "FA2006 - Pago compartido no corresponde a lo informado" },
            { value: "FA2301", label: "FA2301 - Diferencias en cantidades de otros procedimientos no quirúrgicos" },
            { value: "FA2302", label: "FA2302 - Se facturan separadamente otros procedimientos no quirúrgicos incluidos" },
            { value: "FA2303", label: "FA2303 - Se cobran procedimientos incluidos en atención agrupada" },
            { value: "FA2702", label: "FA2702 - Servicios o tecnologías ya facturados" },
            { value: "FA2805", label: "FA2805 - Servicio o tecnología ya pagada" },
            { value: "FA3801", label: "FA3801 - Diferencias en cantidades de traslado asistencial" },
            { value: "FA3803", label: "FA3803 - Traslado incluido en atención agrupada" },
            { value: "FA5103", label: "FA5103 - Servicio prestado por otro prestador en urgencias o referencia" },
            { value: "FA5105", label: "FA5105 - Servicio RIAS prestado por otro prestador" },
            { value: "FA5106", label: "FA5106 - Servicio de control prestado por otro prestador" },
            { value: "FA5205", label: "FA5205 - Disminución de personas en modalidad prospectiva" },
            { value: "FA5206", label: "FA5206 - Persona fallece en modalidad prospectiva" },
            { value: "FA5701", label: "FA5701 - Diferencias en cantidades de apoyo terapéutico" },
            { value: "FA5702", label: "FA5702 - Se facturan separadamente apoyos terapéuticos incluidos" },
            { value: "FA5703", label: "FA5703 - Apoyos terapéuticos incluidos en atención agrupada" },
            { value: "FA5801", label: "FA5801 - Diferencias en cantidades de procedimientos quirúrgicos" },
            { value: "FA5802", label: "FA5802 - Se facturan separadamente procedimientos quirúrgicos incluidos" },
            { value: "FA5803", label: "FA5803 - Procedimientos quirúrgicos incluidos en atención agrupada" },
            { value: "FA5901", label: "FA5901 - Diferencias en cantidades de transporte no asistencial" },
            { value: "FA5903", label: "FA5903 - Transporte no asistencial incluido en atención agrupada" }
        ],
        TA: [
            { value: "TA0101", label: "TA0101 - Diferencia en valores de estancia u observación de urgencias" },
            { value: "TA0201", label: "TA0201 - Diferencia en valores de consultas/interconsultas" },
            { value: "TA0301", label: "TA0301 - Diferencia en honorarios profesionales en procedimientos" },
            { value: "TA0302", label: "TA0302 - Diferencia en honorarios de anestesia" },
            { value: "TA0401", label: "TA0401 - Diferencia en honorarios de otro talento humano" },
            { value: "TA0501", label: "TA0501 - Diferencia en derechos de sala" },
            { value: "TA0601", label: "TA0601 - Diferencia en valores de dispositivos médicos" },
            { value: "TA0701", label: "TA0701 - Diferencia en valores de medicamentos o APME" },
            { value: "TA0801", label: "TA0801 - Diferencia en valores de apoyo diagnóstico" },
            { value: "TA0901", label: "TA0901 - Diferencia en valores de atención agrupada" },
            { value: "TA2301", label: "TA2301 - Diferencia en valores de otros procedimientos no quirúrgicos" },
            { value: "TA2901", label: "TA2901 - Recargos no pactados" },
            { value: "TA3801", label: "TA3801 - Diferencia en valores de traslado asistencial" },
            { value: "TA5701", label: "TA5701 - Diferencia en valores de apoyo terapéutico" },
            { value: "TA5801", label: "TA5801 - Diferencia en valores de procedimientos quirúrgicos" },
            { value: "TA5901", label: "TA5901 - Diferencia en valores de transporte no asistencial" }
        ],
        SO: [
            { value: "SO0101", label: "SO0101 - Ausencia/inconsistencia epicrisis en estancia de urgencias" },
            { value: "SO0102", label: "SO0102 - Soportes de estancia no corresponden a la persona" },
            { value: "SO0201", label: "SO0201 - Ausencia/inconsistencia soportes de consulta" },
            { value: "SO0202", label: "SO0202 - Soportes de consulta no corresponden a la persona" },
            { value: "SO0301", label: "SO0301 - Ausencia/inconsistencia honorarios profesionales" },
            { value: "SO0302", label: "SO0302 - Soportes honorarios no corresponden a la persona" },
            { value: "SO0303", label: "SO0303 - Ausencia/inconsistencia honorarios anestesia" },
            { value: "SO0401", label: "SO0401 - Ausencia/inconsistencia honorarios otro talento humano" },
            { value: "SO0402", label: "SO0402 - Soportes honorarios otros no corresponden a la persona" },
            { value: "SO0601", label: "SO0601 - Ausencia/inconsistencia dispositivos en procedimientos" },
            { value: "SO0602", label: "SO0602 - Soportes dispositivos no corresponden a la persona" },
            { value: "SO0603", label: "SO0603 - Ausencia/inconsistencia dispositivos no quirúrgicos" },
            { value: "SO0604", label: "SO0604 - Ausencia/inconsistencia dispositivos como tratamiento" },
            { value: "SO0701", label: "SO0701 - Ausencia/inconsistencia hoja administración medicamentos" },
            { value: "SO0702", label: "SO0702 - Soportes medicamentos no corresponden a la persona" },
            { value: "SO0703", label: "SO0703 - Ausencia/inconsistencia comprobante recibido medicamentos" },
            { value: "SO0801", label: "SO0801 - Ausencia/inconsistencia apoyo diagnóstico" },
            { value: "SO0802", label: "SO0802 - Soportes apoyo diagnóstico no corresponden a la persona" },
            { value: "SO0803", label: "SO0803 - Ausencia lectura/interpretación apoyo diagnóstico" },
            { value: "SO2101", label: "SO2101 - Número de autorización no incluido en RIPS" },
            { value: "SO2102", label: "SO2102 - Número autorización no corresponde al prestador" },
            { value: "SO2103", label: "SO2103 - Número autorización no corresponde al servicio" },
            { value: "SO2104", label: "SO2104 - Número autorización no corresponde a la persona" },
            { value: "SO2301", label: "SO2301 - Ausencia/inconsistencia otros procedimientos no quirúrgicos" },
            { value: "SO2302", label: "SO2302 - Soportes otros procedimientos no corresponden a la persona" },
            { value: "SO3401", label: "SO3401 - Ausencia/inconsistencia epicrisis" },
            { value: "SO3402", label: "SO3402 - Epicrisis no corresponde a la persona" },
            { value: "SO3403", label: "SO3403 - Ausencia/inconsistencia hoja atención urgencias" },
            { value: "SO3404", label: "SO3404 - Hoja urgencias no corresponde a la persona" },
            { value: "SO3405", label: "SO3405 - Ausencia/inconsistencia resumen de atención" },
            { value: "SO3406", label: "SO3406 - Resumen atención no corresponde a la persona" },
            { value: "SO3407", label: "SO3407 - Ausencia/inconsistencia hoja atención odontológica" },
            { value: "SO3408", label: "SO3408 - Hoja odontológica no corresponde a la persona" },
            { value: "SO3601", label: "SO3601 - Ausencia copia factura SOAT/ADRES" },
            { value: "SO3602", label: "SO3602 - Copia factura SOAT no corresponde a la persona" },
            { value: "SO3701", label: "SO3701 - Ausencia orden/prescripción del profesional" },
            { value: "SO3702", label: "SO3702 - Orden/prescripción no corresponde a la persona" },
            { value: "SO3801", label: "SO3801 - Ausencia/inconsistencia hoja traslado asistencial" },
            { value: "SO3802", label: "SO3802 - Hoja traslado no corresponde a la persona" },
            { value: "SO3901", label: "SO3901 - Ausencia/inconsistencia comprobante recibido usuario" },
            { value: "SO3902", label: "SO3902 - Comprobante no corresponde a la persona" },
            { value: "SO4001", label: "SO4001 - Ausencia/inconsistencia registro anestesia" },
            { value: "SO4002", label: "SO4002 - Registro anestesia no corresponde a la persona" },
            { value: "SO4101", label: "SO4101 - Ausencia/inconsistencia descripción quirúrgica" },
            { value: "SO4102", label: "SO4102 - Descripción quirúrgica no corresponde a la persona" },
            { value: "SO4201", label: "SO4201 - Ausencia/inconsistencia lista de precios" },
            { value: "SO4701", label: "SO4701 - Faltan soportes de recobros ADRES/ARL" },
            { value: "SO4801", label: "SO4801 - Ausencia evidencia envío trámite respectivo" },
            { value: "SO4802", label: "SO4802 - Informe urgencias no corresponde a la persona" },
            { value: "SO5701", label: "SO5701 - Ausencia/inconsistencia apoyo terapéutico" },
            { value: "SO5702", label: "SO5702 - Soportes apoyo terapéutico no corresponden a la persona" },
            { value: "SO5801", label: "SO5801 - Ausencia/inconsistencia procedimientos quirúrgicos" },
            { value: "SO5802", label: "SO5802 - Soportes quirúrgicos no corresponden a la persona" },
            { value: "SO5901", label: "SO5901 - Ausencia/inconsistencia transporte no asistencial" },
            { value: "SO5902", label: "SO5902 - Tiquete transporte no corresponde a la persona" },
            { value: "SO6101", label: "SO6101 - Inconsistencias RIPS con atención prestada" },
            { value: "SO6102", label: "SO6102 - Inconsistencias RIPS con relación al contrato" }
        ],
        AU: [
            { value: "AU0101", label: "AU0101 - Diferencia días habitación vs autorizados" },
            { value: "AU0102", label: "AU0102 - Servicio internación no corresponde al autorizado" },
            { value: "AU0201", label: "AU0201 - Diferencia número consultas vs autorizadas" },
            { value: "AU0202", label: "AU0202 - Consulta no corresponde a la autorizada" },
            { value: "AU0302", label: "AU0302 - Honorarios no corresponden a lo autorizado" },
            { value: "AU0303", label: "AU0303 - Autorización directa al profesional, IPS factura" },
            { value: "AU0601", label: "AU0601 - Diferencia cantidad dispositivos vs autorizados" },
            { value: "AU0602", label: "AU0602 - Dispositivos no corresponden a los autorizados" },
            { value: "AU0701", label: "AU0701 - Diferencia unidades farmacéuticas vs autorizadas" },
            { value: "AU0702", label: "AU0702 - Forma farmacéutica diferente a autorizada" },
            { value: "AU0703", label: "AU0703 - Principio activo diferente al autorizado" },
            { value: "AU0704", label: "AU0704 - Concentración diferente a la autorizada" },
            { value: "AU0801", label: "AU0801 - Diferencia número apoyos diagnósticos vs autorizados" },
            { value: "AU0802", label: "AU0802 - Apoyos diagnósticos no corresponden a autorizados" },
            { value: "AU2103", label: "AU2103 - Número autorización vencido/expirado" },
            { value: "AU2301", label: "AU2301 - Diferencia otros procedimientos vs autorizados" },
            { value: "AU2302", label: "AU2302 - Otros procedimientos no corresponden a autorizados" },
            { value: "AU3803", label: "AU3803 - Traslado no autorizado" },
            { value: "AU4303", label: "AU4303 - Autorización no aplicable a la modalidad" },
            { value: "AU4304", label: "AU4304 - Grupo etáreo no requiere autorización" },
            { value: "AU5701", label: "AU5701 - Diferencia apoyo terapéutico vs autorizado" },
            { value: "AU5702", label: "AU5702 - Apoyo terapéutico no corresponde a autorizado" },
            { value: "AU5801", label: "AU5801 - Diferencia procedimientos quirúrgicos vs autorizados" },
            { value: "AU5802", label: "AU5802 - Procedimientos quirúrgicos no autorizados" },
            { value: "AU5903", label: "AU5903 - Transporte no asistencial no autorizado" }
        ],
        CO: [
            { value: "CO0101", label: "CO0101 - Estancia no pertinente para diagnóstico" },
            { value: "CO0201", label: "CO0201 - Consulta no pertinente para diagnóstico" },
            { value: "CO0302", label: "CO0302 - Procedimiento no pertinente para diagnóstico" },
            { value: "CO0303", label: "CO0303 - Procedimiento simultáneo de igual vía y especialidad" },
            { value: "CO0601", label: "CO0601 - Dispositivo no pertinente para diagnóstico" },
            { value: "CO0701", label: "CO0701 - Medicamento no pertinente para diagnóstico" },
            { value: "CO0702", label: "CO0702 - Medicamento no PBS/No financiado UPC" },
            { value: "CO0801", label: "CO0801 - Apoyo diagnóstico no pertinente" },
            { value: "CO2301", label: "CO2301 - Otros procedimientos no pertinentes" },
            { value: "CO3801", label: "CO3801 - Traslado no pertinente para diagnóstico" },
            { value: "CO5701", label: "CO5701 - Apoyo terapéutico no pertinente" },
            { value: "CO5801", label: "CO5801 - Procedimiento quirúrgico no pertinente" },
            { value: "CO5901", label: "CO5901 - Transporte no pertinente para diagnóstico" }
        ],
        CL: [
            { value: "CL01", label: "CL01 - Servicios no pertinentes para la patología" },
            { value: "CL02", label: "CL02 - Incumplimiento de guías de práctica clínica" },
            { value: "CL03", label: "CL03 - Servicios repetitivos o duplicados" },
            { value: "CL04", label: "CL04 - Estancias hospitalarias prolongadas sin justificación" },
            { value: "CL05", label: "CL05 - Nivel de complejidad no requerido" }
        ],
        SA: [
            { value: "SA01", label: "SA01 - Incumplimiento indicadores de calidad" },
            { value: "SA02", label: "SA02 - Falta implementación programas P&P" },
            { value: "SA03", label: "SA03 - No reporte eventos adversos" },
            { value: "SA04", label: "SA04 - Incumplimiento metas cobertura" },
            { value: "SA05", label: "SA05 - Deficiencias en oportunidad de atención" }
        ]
    };

    // Obtener códigos según el tipo seleccionado
    const codigosGlosa = selectedTipoGlosa ? codigosPorTipo[selectedTipoGlosa] || [] : [];

    // Debug: Ver qué datos tiene el servicio
    useEffect(() => {
        if (servicio) {
            console.log('=== DATOS COMPLETOS DEL SERVICIO ===');
            console.log('Servicio completo:', servicio);
            console.log('detalle_json:', servicio.detalle_json);
            console.log('Campos del servicio:', Object.keys(servicio));
            
            // Verificar específicamente los datos del usuario
            if (servicio.detalle_json) {
                console.log('\n=== DATOS DEL USUARIO EN detalle_json ===');
                console.log('tipo_documento:', servicio.detalle_json.tipo_documento);
                console.log('usuario_documento:', servicio.detalle_json.usuario_documento);
                console.log('fecha_nacimiento:', servicio.detalle_json.fecha_nacimiento);
                console.log('sexo:', servicio.detalle_json.sexo);
                console.log('municipio_residencia:', servicio.detalle_json.municipio_residencia);
                console.log('zona_residencia:', servicio.detalle_json.zona_residencia);
                console.log('regimen:', servicio.detalle_json.regimen);
                console.log('eps_actual:', servicio.detalle_json.eps_actual);
                console.log('tiene_derechos:', servicio.detalle_json.tiene_derechos);
            }
        }
    }, [servicio]);

    // Calcular porcentaje de glosa
    const valorServicio = parseFloat(servicio?.vrServicio || '0');
    const porcentajeGlosa = valorServicio > 0 && valorGlosado ? 
        Math.round((parseFloat(valorGlosado) / valorServicio) * 100) : 0;

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} centered size="xl" className="fade" id="add-task" tabIndex={-1}>
                <Modal.Header>
                        <Modal.Title as="h6" >Aplicar Glosa al Servicio</Modal.Title>
                        <SpkButton Buttontype="button" Buttonvariant="" Customclass="btn-close" data-bs-dismiss="modal"
                            aria-label="Close" onClickfunc={handleClose} ></SpkButton>
                    </Modal.Header>
                    <Modal.Body className="px-4">
                        <Row className="gy-3">
                            <Col xl={12}>
                                <div className="card bg-light border-0">
                                    <div className="card-body">
                                        <div className="d-flex align-items-start mb-3">
                                            <div className="flex-shrink-0">
                                                <span className="avatar avatar-md bg-primary text-white">
                                                    <i className={`${
                                                        servicio?.tipo_servicio === 'MEDICAMENTO' ? 'ri-capsule-line' :
                                                        servicio?.tipo_servicio === 'PROCEDIMIENTO' ? 'ri-surgical-mask-line' :
                                                        servicio?.tipo_servicio === 'CONSULTA' ? 'ri-stethoscope-line' :
                                                        'ri-service-line'
                                                    } fs-18`}></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-3">Información Completa del Servicio RIPS</h6>
                                                
                                                {/* INFORMACIÓN DEL USUARIO/PACIENTE - 3 ELEMENTOS COMPACTOS */}
                                                <div className="border-bottom pb-3 mb-3">
                                                    <h6 className="fs-13 text-muted mb-2">
                                                        <i className="ri-user-3-line me-1"></i>
                                                        Datos del Usuario/Paciente
                                                    </h6>
                                                    
                                                    <Row className="g-3">
                                                        {/* Elemento 1: Identificación */}
                                                        <Col md={4}>
                                                            <div className="d-flex align-items-center">
                                                                <span className="avatar avatar-sm bg-primary-transparent me-2">
                                                                    <i className="ri-user-line fs-14"></i>
                                                                </span>
                                                                <div>
                                                                    <small className="text-muted d-block">Identificación</small>
                                                                    <strong className="fs-14 text-primary">
                                                                        {servicio?.detalle_json?.tipo_documento || 'CC'} {servicio?.detalle_json?.usuario_documento || 'N/A'}
                                                                    </strong>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        
                                                        {/* Elemento 2: Edad y Sexo */}
                                                        {servicio?.detalle_json?.fecha_nacimiento && (
                                                            <Col md={4}>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="avatar avatar-sm bg-info-transparent me-2">
                                                                        <i className="ri-calendar-line fs-14"></i>
                                                                    </span>
                                                                    <div>
                                                                        <small className="text-muted d-block">Edad y Sexo</small>
                                                                        <strong className="fs-14">
                                                                            {(() => {
                                                                                const fechaNac = new Date(servicio.detalle_json.fecha_nacimiento);
                                                                                const hoy = new Date();
                                                                                const edad = Math.floor((hoy.getTime() - fechaNac.getTime()) / (1000 * 3600 * 24 * 365.25));
                                                                                const sexo = servicio?.detalle_json?.sexo === 'M' ? 'M' : 
                                                                                           servicio?.detalle_json?.sexo === 'F' ? 'F' : '';
                                                                                return `${edad} años${sexo ? ` - ${sexo}` : ''}`;
                                                                            })()}
                                                                        </strong>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                        
                                                        {/* Elemento 3: Ubicación */}
                                                        {servicio?.detalle_json?.municipio_residencia && (
                                                            <Col md={4}>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="avatar avatar-sm bg-success-transparent me-2">
                                                                        <i className="ri-map-pin-line fs-14"></i>
                                                                    </span>
                                                                    <div>
                                                                        <small className="text-muted d-block">Ubicación</small>
                                                                        <strong className="fs-14">
                                                                            {servicio.detalle_json.municipio_residencia}
                                                                            {servicio?.detalle_json?.zona_residencia && 
                                                                                ` - ${servicio.detalle_json.zona_residencia === 'U' ? 'Urbana' : 'Rural'}`
                                                                            }
                                                                        </strong>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                    
                                                    {/* CASO ESPECIAL: RECIÉN NACIDOS */}
                                                    {servicio?.detalle_json?.documento_madre && (
                                                        <div className="mt-3 pt-2 border-top">
                                                            <small className="text-info fw-medium d-block mb-2">
                                                                <i className="ri-parent-line me-1"></i>Datos de la Madre
                                                            </small>
                                                            <Row className="g-2">
                                                                <Col md={4}>
                                                                    <small className="text-muted d-block">Identificación Madre</small>
                                                                    <strong className="fs-14">
                                                                        {servicio.detalle_json.tipo_documento_madre || 'CC'} {servicio.detalle_json.documento_madre}
                                                                    </strong>
                                                                </Col>
                                                                {servicio?.detalle_json?.madre_fecha_nacimiento && (
                                                                    <Col md={3}>
                                                                        <small className="text-muted d-block">Edad Madre</small>
                                                                        <strong className="fs-14">
                                                                            {(() => {
                                                                                const fechaNac = new Date(servicio.detalle_json.madre_fecha_nacimiento);
                                                                                const hoy = new Date();
                                                                                const edad = Math.floor((hoy.getTime() - fechaNac.getTime()) / (1000 * 3600 * 24 * 365.25));
                                                                                return `${edad} años`;
                                                                            })()}
                                                                        </strong>
                                                                    </Col>
                                                                )}
                                                                {servicio?.detalle_json?.madre_regimen && (
                                                                    <Col md={3}>
                                                                        <small className="text-muted d-block">Régimen Madre</small>
                                                                        <strong className="fs-14">{servicio.detalle_json.madre_regimen}</strong>
                                                                    </Col>
                                                                )}
                                                            </Row>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* INFORMACIÓN COMPLETA DEL SERVICIO RIPS - SIN DUPLICACIONES */}
                                                <div className="border-bottom pb-3 mb-3">
                                                    <h6 className="fs-13 text-muted mb-2">
                                                        <i className="ri-service-line me-1"></i>
                                                        Datos del Servicio RIPS
                                                    </h6>
                                                    <Row className="g-2">
                                                        {/* Mostrar TODOS los campos del servicio sin duplicar */}
                                                        {servicio && (() => {
                                                            const camposExcluidos = ['id', '_id', 'detalle_json', 'glosas', 'glosas_aplicadas', 'tiene_glosa', 'estado', 'soportes'];
                                                            const camposMostrados = new Set(); // Para evitar duplicados
                                                            
                                                            return Object.keys(servicio).map((key, index) => {
                                                                if (camposExcluidos.includes(key) || servicio[key] === null || servicio[key] === undefined || servicio[key] === '') {
                                                                    return null;
                                                                }
                                                                
                                                                // Mapeo genérico para todos los tipos de servicios
                                                                const nombresAmigables: {[key: string]: string} = {
                                                                    'tipo_servicio': 'Tipo de Servicio',
                                                                    'codConsulta': 'Código del Servicio',
                                                                    'codProcedimiento': 'Código del Servicio', 
                                                                    'codTecnologiaSalud': 'Código del Servicio',
                                                                    'codigo': 'Código Alternativo',
                                                                    'nomTecnologiaSalud': 'Descripción del Servicio',
                                                                    'descripcion': 'Descripción del Servicio',
                                                                    'vrServicio': 'Valor del Servicio',
                                                                    'valor_unitario': 'Valor Unitario',
                                                                    'valor_total': 'Valor Total',
                                                                    'cantidad': 'Cantidad',
                                                                    'usuario_documento': 'Documento del Usuario',
                                                                    'nomConsulta': 'Nombre de la Consulta',
                                                                    'nomProcedimiento': 'Nombre del Procedimiento',
                                                                    'finalidad': 'Finalidad del Servicio',
                                                                    'tipoDocumentoIdentificacion': 'Tipo de Documento',
                                                                    'numDocumentoIdentificacion': 'Número de Documento'
                                                                };
                                                                
                                                                let displayName = nombresAmigables[key] || key
                                                                    .replace(/_/g, ' ')
                                                                    .replace(/([A-Z])/g, ' $1')
                                                                    .replace(/^./, str => str.toUpperCase())
                                                                    .trim();
                                                                
                                                                // Evitar duplicados de códigos y valores
                                                                if ((key === 'codigo' && (servicio.codConsulta || servicio.codProcedimiento || servicio.codTecnologiaSalud)) ||
                                                                    (key === 'valor_total' && servicio.vrServicio) ||
                                                                    (key === 'valor_unitario' && servicio.vrServicio)) {
                                                                    return null; // Skip duplicados
                                                                }
                                                                
                                                                // Evitar duplicados por nombre
                                                                const displayNameKey = displayName.toLowerCase();
                                                                if (camposMostrados.has(displayNameKey)) {
                                                                    return null;
                                                                }
                                                                camposMostrados.add(displayNameKey);
                                                                
                                                                // Formatear valores
                                                                let displayValue = servicio[key];
                                                                if (typeof displayValue === 'boolean') {
                                                                    displayValue = displayValue ? 'Sí' : 'No';
                                                                } else if (key === 'vrServicio' || key.includes('valor') || key.includes('Valor')) {
                                                                    displayValue = `$${parseFloat(displayValue).toLocaleString('es-CO')}`;
                                                                } else if (key.includes('fecha')) {
                                                                    try {
                                                                        displayValue = new Date(displayValue).toLocaleDateString('es-CO');
                                                                    } catch(e) {
                                                                        // Si no es fecha válida, mostrar como está
                                                                    }
                                                                }
                                                                
                                                                return (
                                                                    <Col md={3} key={`servicio-${key}-${index}`}>
                                                                        <small className="text-muted d-block">{displayName}</small>
                                                                        <strong className="fs-13">{displayValue}</strong>
                                                                    </Col>
                                                                );
                                                            }).filter(Boolean); // Eliminar nulls
                                                        })()}

                                                        {/* Mostrar campos del detalle_json (datos adicionales del servicio) */}
                                                        {servicio?.detalle_json && Object.keys(servicio.detalle_json).map((key, index) => {
                                                            // Excluir solo campos de usuario/paciente ya mostrados arriba
                                                            const camposUsuarioExcluidos = [
                                                                'usuario_documento', 'tipo_documento', 'fecha_nacimiento', 
                                                                'sexo', 'municipio_residencia', 'zona_residencia',
                                                                'regimen', 'eps_actual', 'tiene_derechos',
                                                                'documento_madre', 'tipo_documento_madre',
                                                                'madre_usuario_documento', 'madre_tipo_documento',
                                                                'madre_fecha_nacimiento', 'madre_sexo', 
                                                                'madre_municipio_residencia', 'madre_zona_residencia',
                                                                'madre_regimen', 'madre_eps_actual', 'madre_tiene_derechos'
                                                            ];
                                                            
                                                            if (!camposUsuarioExcluidos.includes(key) && 
                                                                servicio.detalle_json[key] !== null && 
                                                                servicio.detalle_json[key] !== undefined && 
                                                                servicio.detalle_json[key] !== '') {
                                                                
                                                                // Mapeo especial de nombres
                                                                const nombresCampos: {[key: string]: string} = {
                                                                    'fecha_atencion': 'Fecha de Atención',
                                                                    'diagnostico_principal': 'Diagnóstico Principal',
                                                                    'autorizacion': 'Autorización',
                                                                    'finalidad': 'Finalidad',
                                                                    'modalidad': 'Modalidad',
                                                                    'via_ingreso': 'Vía de Ingreso',
                                                                    'tipo_unidad': 'Tipo de Unidad',
                                                                    'causa_externa': 'Causa Externa'
                                                                };
                                                                
                                                                let displayName = nombresCampos[key] || key
                                                                    .replace(/_/g, ' ')
                                                                    .replace(/([A-Z])/g, ' $1')
                                                                    .replace(/^./, str => str.toUpperCase())
                                                                    .trim();
                                                                
                                                                // Formatear el valor
                                                                let displayValue = servicio.detalle_json[key];
                                                                if (typeof displayValue === 'boolean') {
                                                                    displayValue = displayValue ? 'Sí' : 'No';
                                                                } else if (key.includes('fecha')) {
                                                                    try {
                                                                        displayValue = new Date(displayValue).toLocaleDateString('es-CO');
                                                                    } catch(e) {
                                                                        // Si no es fecha válida, mostrar como está
                                                                    }
                                                                } else if (key.includes('valor')) {
                                                                    try {
                                                                        displayValue = `$${parseFloat(displayValue).toLocaleString('es-CO')}`;
                                                                    } catch(e) {
                                                                        // Si no es número válido, mostrar como está
                                                                    }
                                                                }
                                                                
                                                                return (
                                                                    <Col md={3} key={`detail-${key}-${index}`}>
                                                                        <small className="text-muted d-block">{displayName}</small>
                                                                        <strong className="fs-13">{displayValue}</strong>
                                                                    </Col>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </Row>
                                                </div>
                                                {/* Botones para ver soportes */}
                                                {servicio?.soportes && servicio.soportes.length > 0 && (
                                                    <div className="mt-3 pt-3 border-top">
                                                        <h6 className="mb-2 fs-13">Soportes Disponibles</h6>
                                                        <div className="btn-list">
                                                            {servicio.soportes.map((soporte: any, index: number) => (
                                                                <Link 
                                                                    key={index}
                                                                    to="#!" 
                                                                    className="btn btn-sm btn-primary-light btn-wave"
                                                                    onClick={() => {
                                                                        // Aquí implementar visualización de PDF
                                                                        window.open(soporte.url, '_blank');
                                                                    }}
                                                                >
                                                                    <i className="ri-file-pdf-line me-1"></i>
                                                                    {soporte.nombre || `Soporte ${index + 1}`}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <Form.Label className="form-label">Tipo de Glosa <span className="text-danger">*</span></Form.Label>
                                <SpkSelect 
                                    name="tipoGlosa" 
                                    option={tiposGlosa} 
                                    mainClass="basic-multi-select" 
                                    placeholder="Seleccione tipo" 
                                    menuplacement='auto' 
                                    classNameprefix="Select2"
                                    onChange={(e: any) => {
                                        setSelectedTipoGlosa(e.value);
                                        setSelectedCodigoGlosa(""); // Limpiar código al cambiar tipo
                                    }}
                                />
                            </Col>
                            <Col xl={6}>
                                <Form.Label className="form-label">Código de Glosa <span className="text-danger">*</span></Form.Label>
                                <SpkSelect 
                                    name="codigoGlosa" 
                                    option={codigosGlosa} 
                                    mainClass="basic-multi-select" 
                                    placeholder={selectedTipoGlosa ? "Seleccione código" : "Primero seleccione tipo"} 
                                    menuplacement='auto' 
                                    classNameprefix="Select2"
                                    isDisabled={!selectedTipoGlosa}
                                    onChange={(e: any) => setSelectedCodigoGlosa(e.value)}
                                />
                            </Col>
                            <Col xl={6}>
                                <Form.Label htmlFor="valor-glosado" className="form-label">Valor Glosado <span className="text-danger">*</span></Form.Label>
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="valor-glosado" 
                                        placeholder="0" 
                                        value={valorGlosado}
                                        onChange={(e) => setValorGlosado(e.target.value)}
                                    />
                                    <SpkButton 
                                        Buttonvariant="outline-secondary" 
                                        Buttontype="button" 
                                        Customclass="btn btn-outline-secondary"
                                        onClickfunc={() => setValorGlosado(valorServicio.toString())}
                                        title="Aplicar 100% del valor del servicio"
                                    >
                                        100%
                                    </SpkButton>
                                </div>
                                {parseFloat(valorGlosado) > valorServicio && (
                                    <small className="text-warning">⚠️ El valor supera el valor del servicio</small>
                                )}
                            </Col>
                            <Col xl={6}>
                                <Form.Label className="form-label">Porcentaje de Glosa</Form.Label>
                                <div className="form-control-plaintext">
                                    <span className={`badge ${porcentajeGlosa > 100 ? 'bg-danger' : porcentajeGlosa === 100 ? 'bg-warning' : porcentajeGlosa >= 50 ? 'bg-info' : 'bg-success'}-transparent fs-14`}>
                                        {porcentajeGlosa}%
                                    </span>
                                    {porcentajeGlosa > 100 && (
                                        <small className="text-muted d-block">Múltiples glosas aplicadas</small>
                                    )}
                                </div>
                            </Col>
                            <Col xl={12}>
                                <Form.Label htmlFor="observaciones" className="form-label">Observaciones <span className="text-danger">*</span></Form.Label>
                                <textarea 
                                    className="form-control" 
                                    id="observaciones" 
                                    rows={3}
                                    placeholder="Ingrese las observaciones de la glosa..."
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                ></textarea>
                            </Col>
                            <Col xl={12}>
                                <div className="card bg-light border-0 mb-0">
                                    <div className="card-body">
                                        <h6 className="mb-2">📋 Glosas aplicadas a este servicio</h6>
                                        <div className="table-responsive" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                            <table className="table table-sm table-bordered mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th width="25%">Código</th>
                                                        <th width="20%">Valor</th>
                                                        <th width="20%">Estado</th>
                                                        <th width="35%">Acción/Auditor</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {glosasTemporales && glosasTemporales.length > 0 ? (
                                                        glosasTemporales.map((glosa: any, index: number) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <small className="fw-medium">{glosa.codigo_glosa || glosa.codigo}</small>
                                                                </td>
                                                                <td className="text-end">
                                                                    <small>${parseFloat(glosa.valor_glosado || glosa.valor || '0').toLocaleString('es-CO')}</small>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge bg-${glosa.temporal ? 'info' : glosa.estado === 'APLICADA' ? 'warning' : glosa.estado === 'ACEPTADA' ? 'success' : glosa.estado === 'RECHAZADA' ? 'danger' : 'secondary'}-transparent`}>
                                                                        {glosa.temporal ? 'NUEVA' : glosa.estado || 'PENDIENTE'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {glosa.temporal ? (
                                                                        <SpkButton 
                                                                            Buttonvariant="danger" 
                                                                            Buttontype="button" 
                                                                            Customclass="btn btn-sm btn-danger-light btn-wave btn-icon p-0"
                                                                            onClickfunc={() => {
                                                                                setGlosasTemporales(glosasTemporales.filter((_, i) => i !== index));
                                                                            }}
                                                                            style={{width: '24px', height: '24px'}}
                                                                            title="Eliminar glosa temporal"
                                                                        >
                                                                            <i className="ri-delete-bin-line fs-12"></i>
                                                                        </SpkButton>
                                                                    ) : (
                                                                        <small>{glosa.auditor || 'Sistema'}</small>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="text-center text-muted">
                                                                <small>No hay glosas aplicadas a este servicio</small>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                {glosasTemporales && glosasTemporales.length > 0 && (
                                                    <tfoot className="table-light">
                                                        <tr>
                                                            <td className="fw-semibold">Total Glosado:</td>
                                                            <td className="text-end fw-semibold">
                                                                ${glosasTemporales.reduce((sum: number, g: any) => 
                                                                    sum + parseFloat(g.valor_glosado || g.valor || '0'), 0
                                                                ).toLocaleString('es-CO')}
                                                            </td>
                                                            <td colSpan={2}>
                                                                <small className="text-muted">
                                                                    {((glosasTemporales.reduce((sum: number, g: any) => 
                                                                        sum + parseFloat(g.valor_glosado || g.valor || '0'), 0
                                                                    ) / valorServicio) * 100).toFixed(1)}% del servicio
                                                                </small>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <SpkButton Buttonvariant="light" Buttontype="button" Customclass="btn btn-light" data-bs-dismiss="modal" onClickfunc={handleClose} >Cancelar</SpkButton>
                        <SpkButton 
                            Buttonvariant='info' 
                            Buttontype="button" 
                            Customclass="btn btn-info"
                            disabled={isSubmitting}
                            onClickfunc={() => {
                                // Validaciones
                                if (!selectedTipoGlosa || !selectedCodigoGlosa || !valorGlosado || !observaciones) {
                                    toast.error('Por favor complete todos los campos requeridos');
                                    return;
                                }
                                
                                // Advertencia si el valor supera el del servicio
                                const totalGlosado = glosasTemporales.reduce((sum: number, g: any) => 
                                    sum + parseFloat(g.valor_glosado || g.valor || '0'), 0
                                ) + parseFloat(valorGlosado);
                                
                                if (totalGlosado > valorServicio) {
                                    setWarningMessage(
                                        `El valor total glosado ($${totalGlosado.toLocaleString('es-CO')}) ` +
                                        `superará el valor del servicio ($${valorServicio.toLocaleString('es-CO')}).\n\n` +
                                        `Esto es válido cuando se aplican múltiples glosas al mismo servicio.`
                                    );
                                    setWarningCallback(() => () => agregarGlosaTemporal());
                                    setShowWarningModal(true);
                                    return;
                                }
                                
                                // Verificar si ya existe esta glosa
                                const glosaExistente = glosasTemporales.find((g: any) => g.codigo_glosa === selectedCodigoGlosa || g.codigo === selectedCodigoGlosa);
                                if (glosaExistente) {
                                    setWarningMessage(
                                        `Ya existe una glosa con el código ${selectedCodigoGlosa}.\n` +
                                        `¿Desea aplicar una glosa adicional con el mismo código?`
                                    );
                                    setWarningCallback(() => () => agregarGlosaTemporal());
                                    setShowWarningModal(true);
                                    return;
                                }
                                
                                agregarGlosaTemporal();
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Aplicando...
                                </>
                            ) : (
                                'Agregar Glosa'
                            )}
                        </SpkButton>
                        <SpkButton 
                            Buttonvariant='success' 
                            Buttontype="button" 
                            Customclass="btn btn-success"
                            disabled={isSubmitting || glosasTemporales.length === 0}
                            onClickfunc={async () => {
                                // Confirmar antes de finalizar
                                if (glosasTemporales.filter(g => g.temporal).length > 0) {
                                    setWarningMessage(
                                        `Tiene ${glosasTemporales.filter(g => g.temporal).length} glosa(s) nueva(s) pendiente(s) de aplicar.\n\n` +
                                        `¿Desea finalizar y aplicar todas las glosas a este servicio?`
                                    );
                                    setWarningCallback(() => async () => {
                                        try {
                                            setIsSubmitting(true);
                                            
                                            // Aplicar todas las glosas temporales
                                            for (const glosa of glosasTemporales.filter(g => g.temporal)) {
                                                await auditoriaService.aplicarGlosa(servicio.id || servicio._id, glosa);
                                            }
                                            
                                            toast.success('Todas las glosas aplicadas exitosamente');
                                            onGlosaAplicada();
                                            handleClose();
                                        } catch (error: any) {
                                            console.error('Error aplicando glosas:', error);
                                            toast.error('Error al aplicar las glosas. Por favor intente nuevamente.');
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    });
                                    setShowWarningModal(true);
                                } else {
                                    // Si no hay glosas nuevas, solo cerrar
                                    handleClose();
                                }
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <i className="ri-check-double-line me-1"></i>
                                    Finalizar Servicio
                                </>
                            )}
                        </SpkButton>
                    </Modal.Footer>
            </Modal>

        {/* Modal de Advertencia */}
        <Modal 
            show={showWarningModal} 
            onHide={() => setShowWarningModal(false)} 
            centered
            className="modal-warning"
        >
            <Modal.Header className="border-0">
                <div className="d-flex align-items-center">
                    <span className="avatar avatar-md avatar-rounded bg-warning-transparent me-3">
                        <i className="ri-alert-line fs-24 text-warning"></i>
                    </span>
                    <h6 className="modal-title mb-0">Confirmación Requerida</h6>
                </div>
                <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowWarningModal(false)}
                    aria-label="Close"
                ></button>
            </Modal.Header>
            <Modal.Body className="px-4">
                <div className="text-center">
                    <p className="text-muted mb-4" style={{whiteSpace: 'pre-line'}}>
                        {warningMessage}
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center">
                <SpkButton 
                    Buttonvariant="light" 
                    Buttontype="button" 
                    Customclass="btn btn-light px-4"
                    onClickfunc={() => setShowWarningModal(false)}
                >
                    <i className="ri-close-line me-1"></i>
                    Cancelar
                </SpkButton>
                <SpkButton 
                    Buttonvariant="warning" 
                    Buttontype="button" 
                    Customclass="btn btn-warning px-4"
                    onClickfunc={() => {
                        setShowWarningModal(false);
                        if (warningCallback) {
                            warningCallback();
                        }
                    }}
                >
                    <i className="ri-check-line me-1"></i>
                    Continuar
                </SpkButton>
            </Modal.Footer>
        </Modal>
        </Fragment>
    );
};

export default ModalAplicarGlosa;