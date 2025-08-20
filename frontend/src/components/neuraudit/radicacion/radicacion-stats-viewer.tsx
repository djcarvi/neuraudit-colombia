

import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Image, Row, Nav, Tab } from "react-bootstrap";
import { Map } from 'pigeon-maps'
import { ActivityItems, Categoriesdataoptions, Categoriesdataseries, Categoriesoptions, Categoriesseries, CategoryData, CategoryItemsData, Countries, Employeesdata, Ordersdata, Productsdata, Recentoptions, Recentseries, Revenuesoptions, Revenuesseries, Salesdata, StatusData, Trafficoptions, Trafficseries, Transactionsdata, Visitorsoptions, Visitorsseries } from "../../../shared/data/widgets/widgetsdata";
import SpkEmployeeStatCard from "../../../shared/@spk-reusable-components/reusable-widgets/spk-employeecard";
import SpkSalesCard from "../../../shared/@spk-reusable-components/reusable-widgets/spk-salescard";
import SpkProductscard from "../../../shared/@spk-reusable-components/reusable-widgets/spk-productscard";
import { Link } from "react-router-dom";
import Spkapexcharts from "../../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts";
import SpkProgress from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-progress";
import SpkDropdown from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-dropdown";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";


interface RadicacionStatsViewerProps { 
    extractedInfo?: any;
    files?: any;
}

const RadicacionStatsViewer: React.FC<RadicacionStatsViewerProps> = ({ extractedInfo, files }) => {

 const [center, setCenter] = useState<[number, number]>([50.879, 4.6997])
     const [zoom, setZoom] = useState(11)
     
     // Datos personalizados para estadísticas de RIPS
     const ripsStatsData = [
         {
             color: "primary",
             svgIcon: (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path></svg>
             ),
             title: "Total Usuarios",
             value: extractedInfo?.servicios?.estadisticas?.total_usuarios?.toLocaleString() || "0",
             percentage: "",
             percentageColor: "",
         },
         {
             color: "secondary",
             svgIcon: (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z"></path></svg>
             ),
             title: "Total Servicios",
             value: ((extractedInfo?.servicios?.detalle_completo?.consultas || 0) + 
                     (extractedInfo?.servicios?.detalle_completo?.procedimientos || 0) + 
                     (extractedInfo?.servicios?.detalle_completo?.medicamentos || 0) + 
                     (extractedInfo?.servicios?.detalle_completo?.urgencias || 0) + 
                     (extractedInfo?.servicios?.detalle_completo?.hospitalizacion || 0) + 
                     (extractedInfo?.servicios?.detalle_completo?.recien_nacidos || 0) +
                    (extractedInfo?.servicios?.detalle_completo?.otros_servicios || 0)).toLocaleString(),
             percentage: "",
             percentageColor: "",
         },
         {
             color: "warning",
             svgIcon: (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M216,88H176V48a16,16,0,0,0-16-16H96A16,16,0,0,0,80,48V88H40a8,8,0,0,0,0,16H48V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V104h8a8,8,0,0,0,0-16ZM96,48h64V88H96Zm96,160H64V104H192ZM112,136v40a8,8,0,0,1-16,0V136a8,8,0,0,1,16,0Zm48,0v40a8,8,0,0,1-16,0V136a8,8,0,0,1,16,0Z"></path></svg>
             ),
             title: "Consultas",
             value: extractedInfo?.servicios?.detalle_completo?.consultas?.toLocaleString() || "0",
             percentage: "",
             percentageColor: "",
         },
         {
             color: "info",
             svgIcon: (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M176,104h24a8,8,0,0,0,0-16H176a8,8,0,0,0,0,16Zm0,24a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Zm56-72V208a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V48A16,16,0,0,1,40,32H80a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,144,96v16h16a8,8,0,0,0,0-16H96a8,8,0,0,1-8-8V48H40V208H216V56Z"></path></svg>
             ),
             title: "Procedimientos",
             value: extractedInfo?.servicios?.detalle_completo?.procedimientos?.toLocaleString() || "0",
             percentage: "",
             percentageColor: "",
         },
         {
             color: "success",
             svgIcon: (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM110,186H48a2,2,0,0,1-2-2V144a2,2,0,0,1,2-2h62a2,2,0,0,1,2,2v40A2,2,0,0,1,110,186Zm0-84H48a2,2,0,0,1-2-2V72a2,2,0,0,1,2-2h62a2,2,0,0,1,2,2v28A2,2,0,0,1,110,102Z"></path></svg>
             ),
             title: "Medicamentos",
             value: extractedInfo?.servicios?.detalle_completo?.medicamentos?.toLocaleString() || "0",
             percentage: "",
             percentageColor: "",
         },
         {
             color: "danger",
             svgIcon: (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57,32.62,32.62,0,0,0,158.44,16,29.53,29.53,0,0,0,137,25.91a54.94,54.94,0,0,0-9,14.48,54.94,54.94,0,0,0-9-14.48A29.53,29.53,0,0,0,97.56,16,32.62,32.62,0,0,0,64,49.57,29.53,29.53,0,0,0,73.91,71c.38.33.78.65,1.17,1H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Z"></path></svg>
             ),
             title: "Hospitalización",
             value: extractedInfo?.servicios?.detalle_completo?.hospitalizacion?.toLocaleString() || "0",
             percentage: "",
             percentageColor: "",
         },
     ]

    // Siempre agregar TODOS los tipos de servicios RIPS
    ripsStatsData.push(
        {
            color: "danger",
            svgIcon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16h56V48a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H120ZM208,96H152a8,8,0,0,0,0,16h48v96H144a8,8,0,0,0,0,16h64a8,8,0,0,0,8-8V104A8,8,0,0,0,208,96Z"></path></svg>
            ),
            title: "Urgencias",
            value: extractedInfo?.servicios?.detalle_completo?.urgencias?.toLocaleString() || "0",
            percentage: "",
            percentageColor: "",
        },
        {
            color: "pink",
            svgIcon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M216,160c0,16-16,32-24,40s-24,8-32,8-24,0-32-8-24-24-24-40a32,32,0,0,1,56-21.13A32,32,0,0,1,216,160ZM72,96A32,32,0,1,0,72,32a32,32,0,0,0,0,64Z"></path></svg>
            ),
            title: "Recién Nacidos",
            value: extractedInfo?.servicios?.detalle_completo?.recien_nacidos?.toLocaleString() || "0",
            percentage: "",
            percentageColor: "",
        },
        {
            color: "teal",
            svgIcon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM72,168H56a8,8,0,0,1,0-16H72a8,8,0,0,1,0,16Zm0-32H56a8,8,0,0,1,0-16H72a8,8,0,0,1,0,16Zm0-32H56a8,8,0,0,1,0-16H72a8,8,0,0,1,0,16Zm64,64H120a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H120a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H120a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm64,64H184a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H184a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Zm0-32H184a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Z"></path></svg>
            ),
            title: "Otros Servicios",
            value: extractedInfo?.servicios?.detalle_completo?.otros_servicios?.toLocaleString() || "0",
            percentage: "",
            percentageColor: "",
        }
    );

    return (
        <Fragment>
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Información Extraída de Archivos
                            </div>
                        </Card.Header>
                        <Tab.Container defaultActiveKey="home">
                            <Card.Body className="">
                                <Nav className="nav-tabs mb-3 border-0" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="home" className="" data-bs-toggle="tab" role="tab" href="#home1"
                                            aria-selected="true">Factura XML</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="about" className="" data-bs-toggle="tab" role="tab" href="#about1"
                                            aria-selected="false">RIPS JSON</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="service" className="" data-bs-toggle="tab" role="tab" href="#service1"
                                            aria-selected="false">Soportes PDF</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                
                                {/* Almacenamiento total de la radicación */}
                                <div className="p-3 rounded bg-light mb-4">
                                    <div className="d-flex align-items-center">
                                        <div id="available-storage">
                                            <div style={{ minHeight: "81px" }}>
                                                <Spkapexcharts 
                                                    chartOptions={{
                                                        chart: {
                                                            type: 'radialBar',
                                                            height: 81,
                                                            sparkline: {
                                                                enabled: true
                                                            }
                                                        },
                                                        plotOptions: {
                                                            radialBar: {
                                                                hollow: {
                                                                    size: '58%',
                                                                },
                                                                dataLabels: {
                                                                    name: {
                                                                        show: false
                                                                    },
                                                                    value: {
                                                                        offsetY: 5,
                                                                        fontSize: '12px',
                                                                        fontWeight: 800,
                                                                        color: '#4b9bfa'
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        fill: {
                                                            colors: ['#00c9ff']
                                                        },
                                                        stroke: {
                                                            lineCap: 'round'
                                                        },
                                                        labels: ['Usado']
                                                    }}
                                                    chartSeries={[
                                                        Math.round(
                                                            ((files?.factura?.size || 0) + 
                                                             (files?.rips?.size || 0) + 
                                                             (files?.soportes?.reduce((acc: number, file: any) => acc + file.size, 0) || 0)) 
                                                            / (1024 * 1024 * 1024) * 100
                                                        )
                                                    ]}
                                                    type="radialBar"
                                                    height={81}
                                                    width={80}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-fill">
                                            <span className="d-block fw-semibold">Almacenamiento Usado</span>
                                            <span className="fs-13 text-muted">
                                                {(
                                                    ((files?.factura?.size || 0) + 
                                                     (files?.rips?.size || 0) + 
                                                     (files?.soportes?.reduce((acc: number, file: any) => acc + file.size, 0) || 0)) 
                                                    / (1024 * 1024)
                                                ).toFixed(2)} MB de 1024 MB (Límite por Resolución 2284)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Tab.Content className="">
                                    <Tab.Pane eventKey="home" className="text-muted" id="home1" role="tabpanel">
                                        <div className="mb-0">
                                            <Tab.Container defaultActiveKey="prestador">
                                                <Row>
                                                    <div className="col-md-2">
                                                        <Nav className="flex-column nav-pills me-3 tab-style-7" id="v-pills-tab"
                                                            role="tablist" aria-orientation="vertical">
                                                            <Nav.Item>
                                                                <Nav.Link eventKey="prestador" className="text-start" id="prestador-tab" data-bs-toggle="pill"
                                                                    data-bs-target="#prestador" type="button" role="tab"
                                                                    aria-controls="prestador" aria-selected="true"><i
                                                                        className="ri-building-line me-1 align-middle d-inline-block"></i>Prestador</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link eventKey="factura" className="text-start" id="factura-tab" data-bs-toggle="pill"
                                                                    data-bs-target="#factura" type="button" role="tab"
                                                                    aria-controls="factura" aria-selected="false"><i
                                                                        className="ri-file-text-line me-1 align-middle d-inline-block"></i>Factura</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link eventKey="valores" className="text-start" id="valores-tab" data-bs-toggle="pill"
                                                                    data-bs-target="#valores" type="button" role="tab"
                                                                    aria-controls="valores" aria-selected="false"><i
                                                                        className="ri-money-dollar-circle-line me-1 align-middle d-inline-block"></i>Valores</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link eventKey="sector" className="text-start" id="sector-tab" data-bs-toggle="pill"
                                                                    data-bs-target="#sector" type="button" role="tab"
                                                                    aria-controls="sector" aria-selected="false"><i
                                                                        className="ri-hospital-line me-1 align-middle d-inline-block"></i>Sector Salud</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link eventKey="paciente" className="text-start mb-1" id="paciente-tab" data-bs-toggle="pill"
                                                                    data-bs-target="#paciente" type="button" role="tab"
                                                                    aria-controls="paciente" aria-selected="false"><i
                                                                        className="ri-user-heart-line me-1 align-middle d-inline-block"></i>Paciente</Nav.Link>
                                                            </Nav.Item>
                                                        </Nav>
                                                    </div>
                                                    <Col md={10}>
                                                        <Tab.Content className="" id="v-pills-tabContent">
                                                            <Tab.Pane eventKey="prestador" className="" id="prestador" role="tabpanel" tabIndex={0}>
                                                                <ul className="list-unstyled text-muted mb-0">
                                                                    <li className="mb-2">
                                                                        <b>NIT:</b> {extractedInfo?.prestador?.nit || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Razón Social:</b> {extractedInfo?.prestador?.nombre || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Tipo de Persona:</b> {extractedInfo?.prestador?.tipo_persona || 'Jurídica'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Régimen Tributario:</b> {extractedInfo?.prestador?.regimen || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Dirección:</b> {extractedInfo?.prestador?.direccion || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-0">
                                                                        <b>Teléfono:</b> {extractedInfo?.prestador?.telefono || 'No disponible'}
                                                                    </li>
                                                                </ul>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="factura" className="" id="factura" role="tabpanel" tabIndex={0}>
                                                                <ul className="list-unstyled text-muted mb-0">
                                                                    <li className="mb-2">
                                                                        <b>Número de Factura:</b> {extractedInfo?.factura?.numero || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Fecha de Expedición:</b> {extractedInfo?.factura?.fecha_expedicion || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>CUFE:</b> {extractedInfo?.factura?.cufe || 'No disponible'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Tipo de Factura:</b> {extractedInfo?.factura?.tipo || 'Venta'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Forma de Pago:</b> {extractedInfo?.factura?.forma_pago || 'Crédito'}
                                                                    </li>
                                                                    <li className="mb-0">
                                                                        <b>Medio de Pago:</b> {extractedInfo?.factura?.medio_pago || 'Transferencia'}
                                                                    </li>
                                                                </ul>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="valores" className="" id="valores" role="tabpanel" tabIndex={0}>
                                                                <ul className="list-unstyled text-muted mb-0">
                                                                    <li className="mb-2">
                                                                        <b>Valor Bruto:</b> ${extractedInfo?.factura?.resumen_monetario?.valor_bruto?.toLocaleString() || '0'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Base Gravable:</b> ${extractedInfo?.factura?.resumen_monetario?.base_gravable?.toLocaleString() || '0'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Total Descuentos:</b> ${extractedInfo?.factura?.resumen_monetario?.descuentos?.toLocaleString() || '0'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Total Cargos:</b> ${extractedInfo?.factura?.resumen_monetario?.cargos?.toLocaleString() || '0'}
                                                                    </li>
                                                                    <li className="mb-2">
                                                                        <b>Total Impuestos:</b> ${extractedInfo?.factura?.resumen_monetario?.impuestos?.toLocaleString() || '0'}
                                                                    </li>
                                                                    <li className="mb-0">
                                                                        <b>Valor Total a Pagar:</b> <span className="text-success fw-bold">${extractedInfo?.factura?.resumen_monetario?.valor_final_pagar?.toLocaleString() || '0'}</span>
                                                                    </li>
                                                                </ul>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="sector" className="" id="sector" role="tabpanel" tabIndex={0}>
                                                                {extractedInfo?.factura?.sector_salud ? (
                                                                    <ul className="list-unstyled text-muted mb-0">
                                                                        {extractedInfo.factura.sector_salud.codigo_prestador && (
                                                                            <li className="mb-2">
                                                                                <b>Código Prestador:</b> {extractedInfo.factura.sector_salud.codigo_prestador}
                                                                            </li>
                                                                        )}
                                                                        <li className="mb-2">
                                                                            <b>Modalidad de Pago:</b> {extractedInfo.factura.sector_salud.modalidad_pago || 'No disponible'}
                                                                        </li>
                                                                        <li className="mb-2">
                                                                            <b>Cobertura Plan Beneficios:</b> {extractedInfo.factura.sector_salud.cobertura_plan_beneficios || 'No disponible'}
                                                                        </li>
                                                                        <li className="mb-2">
                                                                            <b>Número de Contrato:</b> {extractedInfo.factura.sector_salud.numero_contrato || 'No disponible'}
                                                                        </li>
                                                                        <li className="mb-2">
                                                                            <b>Número de Póliza:</b> {extractedInfo.factura.sector_salud.numero_poliza || 'No especificado'}
                                                                        </li>
                                                                        {extractedInfo.factura.sector_salud.total_recaudo && (
                                                                            <li className="mb-2">
                                                                                <b>Total Recaudo:</b> <span className="text-primary fw-bold">${extractedInfo.factura.sector_salud.total_recaudo.toLocaleString()}</span>
                                                                            </li>
                                                                        )}
                                                                        {extractedInfo.factura.sector_salud.recaudos_detalle && extractedInfo.factura.sector_salud.recaudos_detalle.length > 0 && (
                                                                            <li className="mb-2">
                                                                                <b>Detalle Recaudos:</b>
                                                                                <ul className="mt-1">
                                                                                    {extractedInfo.factura.sector_salud.recaudos_detalle.map((recaudo: any, index: number) => (
                                                                                        <li key={index}>
                                                                                            {recaudo.tipo}: ${recaudo.monto.toLocaleString()} {recaudo.fecha && `(${recaudo.fecha})`}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </li>
                                                                        )}
                                                                        {extractedInfo.factura.sector_salud.copago > 0 && (
                                                                            <li className="mb-2">
                                                                                <b>Copago:</b> ${extractedInfo.factura.sector_salud.copago.toLocaleString()}
                                                                            </li>
                                                                        )}
                                                                        {extractedInfo.factura.sector_salud.cuota_moderadora > 0 && (
                                                                            <li className="mb-2">
                                                                                <b>Cuota Moderadora:</b> ${extractedInfo.factura.sector_salud.cuota_moderadora.toLocaleString()}
                                                                            </li>
                                                                        )}
                                                                        {extractedInfo.factura.sector_salud.cuota_recuperacion > 0 && (
                                                                            <li className="mb-2">
                                                                                <b>Cuota Recuperación:</b> ${extractedInfo.factura.sector_salud.cuota_recuperacion.toLocaleString()}
                                                                            </li>
                                                                        )}
                                                                        {extractedInfo.factura.sector_salud.pagos_compartidos > 0 && (
                                                                            <li className="mb-0">
                                                                                <b>Pagos Compartidos:</b> ${extractedInfo.factura.sector_salud.pagos_compartidos.toLocaleString()}
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <ul className="list-unstyled text-muted mb-0">
                                                                        <li className="mb-0">
                                                                            No se encontró información específica del sector salud en el XML
                                                                        </li>
                                                                    </ul>
                                                                )}
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="paciente" className="" id="paciente" role="tabpanel" tabIndex={0}>
                                                                {extractedInfo?.factura?.paciente ? (
                                                                    <ul className="list-unstyled text-muted mb-0">
                                                                        <li className="mb-2">
                                                                            <b>Tipo de Documento:</b> {extractedInfo.factura.paciente.tipo_documento || 'CC'}
                                                                        </li>
                                                                        <li className="mb-2">
                                                                            <b>Número de Documento:</b> {extractedInfo.factura.paciente.numero_documento || 'No disponible'}
                                                                        </li>
                                                                        <li className="mb-2">
                                                                            <b>Nombre Completo:</b> {extractedInfo.factura.paciente.nombre_completo || 'No disponible'}
                                                                        </li>
                                                                        <li className="mb-2">
                                                                            <b>Tipo de Usuario:</b> {extractedInfo.factura.paciente.tipo_usuario || 'No disponible'}
                                                                        </li>
                                                                        <li className="mb-0">
                                                                            <b>Modalidad Contratación:</b> {extractedInfo.factura.paciente.modalidad_contratacion || 'No disponible'}
                                                                        </li>
                                                                    </ul>
                                                                ) : (
                                                                    <ul className="list-unstyled text-muted mb-0">
                                                                        <li className="mb-0">
                                                                            La información del paciente se encuentra en el archivo RIPS
                                                                        </li>
                                                                    </ul>
                                                                )}
                                                            </Tab.Pane>
                                                        </Tab.Content>
                                                    </Col>
                                                </Row>
                                            </Tab.Container>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="about" className=" text-muted" id="about1" role="tabpanel">
                                        <div className="mb-0">
                                            <h6 className="fw-semibold mb-3">Información General RIPS</h6>
                                            <div className="row mb-4">
                                                <div className="col-md-4">
                                                    <div className="p-3 border rounded">
                                                        <p className="mb-1 text-muted fs-13">Tipo Principal de Servicio</p>
                                                        <h5 className="mb-0">{(() => {
                                                            const tipo = extractedInfo?.servicios?.tipo_principal;
                                                            const tiposMapeados: any = {
                                                                'AMBULATORIO': 'Ambulatorio',
                                                                'URGENCIAS': 'Urgencias',
                                                                'HOSPITALIZACION': 'Hospitalización',
                                                                'CIRUGIA': 'Cirugía',
                                                                'MEDICAMENTOS': 'Medicamentos',
                                                                'APOYO_DIAGNOSTICO': 'Apoyo Diagnóstico',
                                                                'TERAPIAS': 'Terapias',
                                                                'ODONTOLOGIA': 'Odontología',
                                                                'TRANSPORTE': 'Transporte'
                                                            };
                                                            return tiposMapeados[tipo] || tipo || 'No determinado';
                                                        })()}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="p-3 border rounded">
                                                        <p className="mb-1 text-muted fs-13">Modalidad de Pago</p>
                                                        <h5 className="mb-0">{(() => {
                                                            const modalidad = extractedInfo?.servicios?.modalidad_inferida;
                                                            const modalidadesMapeadas: any = {
                                                                'EVENTO': 'Pago por Evento',
                                                                'CAPITACION': 'Capitación',
                                                                'GLOBAL_PROSPECTIVO': 'Global Prospectivo',
                                                                'GRUPO_DIAGNOSTICO': 'Grupo Diagnóstico'
                                                            };
                                                            return modalidadesMapeadas[modalidad] || modalidad || 'No determinado';
                                                        })()}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="p-3 border rounded">
                                                        <p className="mb-1 text-muted fs-13">Período de Atención</p>
                                                        <h5 className="mb-0">{extractedInfo?.servicios?.periodo || new Date().getFullYear()}</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Resumen de Servicios RIPS con cards visuales */}
                                            <h6 className="fw-semibold mb-3">Detalle de Servicios</h6>
                                            <Row className="gy-4">
                                                {ripsStatsData.map((stats, index) => (
                                                    <SpkProductscard key={index} products={stats} />
                                                ))}
                                            </Row>

                                            {(() => {
                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                const pacientesMultiples = extractedInfo?.pacientes_multiples || [];
                                                const totalUsuarios = usuarios.length || pacientesMultiples.length;
                                                
                                                if (totalUsuarios === 0) return null;
                                                
                                                return (
                                                    <>
                                                        <h6 className="fw-semibold mb-3 mt-4">Pacientes Identificados</h6>
                                                        <p><strong>Total Pacientes:</strong> {totalUsuarios}</p>
                                                        <div className={`alert ${totalUsuarios === 1 ? 'alert-success' : 'alert-info'}`}>
                                                            <i className={`${totalUsuarios === 1 ? 'ri-user-line' : 'ri-group-line'} me-2`}></i>
                                                            {totalUsuarios === 1 
                                                                ? 'RIPS Monousuario - Un único paciente en la factura'
                                                                : `RIPS Multiusuario - ${totalUsuarios} pacientes en la factura`
                                                            }
                                                        </div>
                                                    </>
                                                );
                                            })()}

                                            {/* Tab Style-6 para mostrar los primeros 5 registros de usuarios y servicios */}
                                            <div className="mt-4">
                                                <h6 className="fw-semibold mb-3">Detalle de Primeros Registros</h6>
                                                <Tab.Container defaultActiveKey="usuarios-tab">
                                                        <div className="custom-nav-tab">
                                                            <Nav className="nav-tabs mb-3 tab-style-6" id="myTab3" role="tablist">
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="usuarios-tab" className="" id="usuarios-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#usuarios-tab-pane" type="button" role="tab"
                                                                        aria-controls="usuarios-tab-pane" aria-selected="true"><i
                                                                            className="ri-user-line me-1 align-middle d-inline-block"></i>Usuarios</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="consultas-tab" className="" id="consultas-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#consultas-tab-pane" type="button" role="tab"
                                                                        aria-controls="consultas-tab-pane" aria-selected="false"><i
                                                                            className="ri-stethoscope-line me-1 align-middle d-inline-block"></i>Consultas</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="procedimientos-tab" className="" id="procedimientos-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#procedimientos-tab-pane" type="button" role="tab"
                                                                        aria-controls="procedimientos-tab-pane" aria-selected="false"><i
                                                                            className="ri-syringe-line me-1 align-middle d-inline-block"></i>Procedimientos</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="medicamentos-tab" className="" id="medicamentos-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#medicamentos-tab-pane" type="button" role="tab"
                                                                        aria-controls="medicamentos-tab-pane" aria-selected="false"><i
                                                                            className="ri-capsule-line me-1 align-middle d-inline-block"></i>Medicamentos</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="urgencias-tab" className="" id="urgencias-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#urgencias-tab-pane" type="button" role="tab"
                                                                        aria-controls="urgencias-tab-pane" aria-selected="false"><i
                                                                            className="ri-hospital-line me-1 align-middle d-inline-block"></i>Urgencias</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="hospitalizacion-tab" className="" id="hospitalizacion-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#hospitalizacion-tab-pane" type="button" role="tab"
                                                                        aria-controls="hospitalizacion-tab-pane" aria-selected="false"><i
                                                                            className="ri-hotel-bed-line me-1 align-middle d-inline-block"></i>Hospitalización</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="reciennacidos-tab" className="" id="reciennacidos-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#reciennacidos-tab-pane" type="button" role="tab"
                                                                        aria-controls="reciennacidos-tab-pane" aria-selected="false"><i
                                                                            className="ri-user-2-line me-1 align-middle d-inline-block"></i>Recién Nacidos</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="" role="presentation">
                                                                    <Nav.Link eventKey="otros-tab" className="" id="otros-tab" data-bs-toggle="tab"
                                                                        data-bs-target="#otros-tab-pane" type="button" role="tab"
                                                                        aria-controls="otros-tab-pane" aria-selected="false"><i
                                                                            className="ri-service-line me-1 align-middle d-inline-block"></i>Otros Servicios</Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                            <Tab.Content className="" id="myTabContent2">
                                                                <Tab.Pane eventKey="usuarios-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="usuarios-tab-pane"
                                                                    role="tabpanel" aria-labelledby="usuarios-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Tipo Doc' }, { title: 'Número Documento' }, { title: 'Fecha Nacimiento' }, { title: 'Sexo' }]} >
                                                                            {(() => {
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                const pacientesMultiples = extractedInfo?.pacientes_multiples || [];
                                                                                
                                                                                // Si es monousuario (1 solo usuario), mostrar ese único usuario
                                                                                if (usuarios.length === 1 || pacientesMultiples.length === 1) {
                                                                                    const usuario = usuarios[0] || pacientesMultiples[0];
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{usuario.tipoDocumentoIdentificacion || usuario.tipo_documento || 'CC'}</td>
                                                                                            <td>{usuario.numDocumentoIdentificacion || usuario.numero_documento || 'N/A'}</td>
                                                                                            <td>{usuario.fechaNacimiento || 'N/A'}</td>
                                                                                            <td>{usuario.codSexo || usuario.sexo || 'N/A'}</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                                
                                                                                // Si es multiusuario, mostrar hasta 5 usuarios
                                                                                if (usuarios.length > 1) {
                                                                                    return usuarios.slice(0, 5).map((usuario: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{usuario.tipoDocumentoIdentificacion || 'CC'}</td>
                                                                                            <td>{usuario.numDocumentoIdentificacion || 'N/A'}</td>
                                                                                            <td>{usuario.fechaNacimiento || 'N/A'}</td>
                                                                                            <td>{usuario.codSexo || usuario.sexo || 'N/A'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                }
                                                                                
                                                                                return (
                                                                                    <tr>
                                                                                        <td colSpan={4} className="text-center text-muted">No hay datos de usuarios disponibles</td>
                                                                                    </tr>
                                                                                );
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="consultas-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="consultas-tab-pane" role="tabpanel"
                                                                    aria-labelledby="consultas-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Fecha' }, { title: 'Código' }, { title: 'Diagnóstico' }, { title: 'Valor' }]} >
                                                                            {(() => {
                                                                                const consultas: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                // Extraer consultas de todos los usuarios
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosConsultas = usuario.servicios?.consultas || [];
                                                                                    serviciosConsultas.forEach((consulta: any) => {
                                                                                        consultas.push({
                                                                                            ...consulta,
                                                                                            usuario: `${usuario.primerNombre || ''} ${usuario.primerApellido || ''}`
                                                                                        });
                                                                                    });
                                                                                });
                                                                                
                                                                                // Mostrar primeras 5 consultas
                                                                                if (consultas.length > 0) {
                                                                                    return consultas.slice(0, 5).map((consulta: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{consulta.fechaInicioAtencion || consulta.fechaAtencion || consulta.fechaConsulta || 'N/A'}</td>
                                                                                            <td>{consulta.codConsulta || 'N/A'}</td>
                                                                                            <td>{consulta.codDiagnosticoPrincipal || 'N/A'}</td>
                                                                                            <td>${consulta.vrServicio?.toLocaleString() || '0'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de consultas disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="procedimientos-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="procedimientos-tab-pane" role="tabpanel"
                                                                    aria-labelledby="procedimientos-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Fecha' }, { title: 'Código CUPS' }, { title: 'Descripción' }, { title: 'Valor' }]} >
                                                                            {(() => {
                                                                                const procedimientos: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosProcedimientos = usuario.servicios?.procedimientos || [];
                                                                                    serviciosProcedimientos.forEach((proc: any) => {
                                                                                        procedimientos.push(proc);
                                                                                    });
                                                                                });
                                                                                
                                                                                if (procedimientos.length > 0) {
                                                                                    return procedimientos.slice(0, 5).map((proc: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{proc.fechaInicioAtencion || proc.fechaAtencion || proc.fechaProcedimiento || 'N/A'}</td>
                                                                                            <td>{proc.codProcedimiento || 'N/A'}</td>
                                                                                            <td>{proc.nomProcedimiento || proc.descripcion || 'Sin descripción'}</td>
                                                                                            <td>${proc.vrServicio?.toLocaleString() || '0'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de procedimientos disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="medicamentos-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="medicamentos-tab-pane" role="tabpanel"
                                                                    aria-labelledby="medicamentos-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Código' }, { title: 'Medicamento' }, { title: 'Cantidad' }, { title: 'Valor' }]} >
                                                                            {(() => {
                                                                                const medicamentos: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosMedicamentos = usuario.servicios?.medicamentos || [];
                                                                                    serviciosMedicamentos.forEach((med: any) => {
                                                                                        medicamentos.push(med);
                                                                                    });
                                                                                });
                                                                                
                                                                                if (medicamentos.length > 0) {
                                                                                    return medicamentos.slice(0, 5).map((med: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{med.codMedicamento || med.codTecnologiaSalud || 'N/A'}</td>
                                                                                            <td>{med.nomTecnologiaSalud || med.descripcion || 'Sin descripción'}</td>
                                                                                            <td>{med.cantidadSuministrada || med.cantidad || '0'} {med.tipoUnidadMedida || ''}</td>
                                                                                            <td>${med.vrServicio?.toLocaleString() || '0'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de medicamentos disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="urgencias-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="urgencias-tab-pane" role="tabpanel"
                                                                    aria-labelledby="urgencias-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Fecha' }, { title: 'Causa Externa' }, { title: 'Diagnóstico' }, { title: 'Destino' }]} >
                                                                            {(() => {
                                                                                const urgencias: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosUrgencias = usuario.servicios?.urgencias || [];
                                                                                    serviciosUrgencias.forEach((urg: any) => {
                                                                                        urgencias.push(urg);
                                                                                    });
                                                                                });
                                                                                
                                                                                if (urgencias.length > 0) {
                                                                                    return urgencias.slice(0, 5).map((urg: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{urg.fechaInicioAtencion || urg.fechaAtencion || 'N/A'}</td>
                                                                                            <td>{urg.causaExterna || 'N/A'}</td>
                                                                                            <td>{urg.diagnosticoPrincipal || 'N/A'}</td>
                                                                                            <td>{urg.destinoSalidaServicioSalud || 'N/A'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de urgencias disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="hospitalizacion-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="hospitalizacion-tab-pane" role="tabpanel"
                                                                    aria-labelledby="hospitalizacion-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Fecha Ingreso' }, { title: 'Fecha Egreso' }, { title: 'Diagnóstico' }, { title: 'Días' }]} >
                                                                            {(() => {
                                                                                const hospitalizaciones: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosHospitalizacion = usuario.servicios?.hospitalizacion || [];
                                                                                    serviciosHospitalizacion.forEach((hosp: any) => {
                                                                                        hospitalizaciones.push(hosp);
                                                                                    });
                                                                                });
                                                                                
                                                                                if (hospitalizaciones.length > 0) {
                                                                                    return hospitalizaciones.slice(0, 5).map((hosp: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{hosp.fechaIngresoServicioSalud || 'N/A'}</td>
                                                                                            <td>{hosp.fechaEgresoServicioSalud || 'N/A'}</td>
                                                                                            <td>{hosp.diagnosticoPrincipalEgreso || 'N/A'}</td>
                                                                                            <td>{hosp.diasEstancia || 'N/A'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de hospitalización disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="reciennacidos-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="reciennacidos-tab-pane" role="tabpanel"
                                                                    aria-labelledby="reciennacidos-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Fecha Nacimiento' }, { title: 'Sexo' }, { title: 'Peso (g)' }, { title: 'Edad Gestacional' }]} >
                                                                            {(() => {
                                                                                const recienNacidos: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosRecienNacidos = usuario.servicios?.recien_nacidos || [];
                                                                                    serviciosRecienNacidos.forEach((rn: any) => {
                                                                                        recienNacidos.push(rn);
                                                                                    });
                                                                                });
                                                                                
                                                                                if (recienNacidos.length > 0) {
                                                                                    return recienNacidos.slice(0, 5).map((rn: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{rn.fechaNacimiento || 'N/A'}</td>
                                                                                            <td>{rn.sexo || 'N/A'}</td>
                                                                                            <td>{rn.peso || 'N/A'}</td>
                                                                                            <td>{rn.edadGestacional || 'N/A'} semanas</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de recién nacidos disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="otros-tab" className="fade p-0 border-bottom-0 overflow-hidden" id="otros-tab-pane" role="tabpanel"
                                                                    aria-labelledby="otros-tab" tabIndex={0}>
                                                                    <div className="table-responsive">
                                                                        <SpkTables tableClass="mb-0" header={[{ title: 'Fecha' }, { title: 'Tipo Servicio' }, { title: 'Descripción' }, { title: 'Valor' }]} >
                                                                            {(() => {
                                                                                const otrosServicios: any[] = [];
                                                                                const usuarios = extractedInfo?.rips_data?.usuarios || [];
                                                                                
                                                                                usuarios.forEach((usuario: any) => {
                                                                                    const serviciosOtros = usuario.servicios?.otros_servicios || [];
                                                                                    serviciosOtros.forEach((otro: any) => {
                                                                                        otrosServicios.push(otro);
                                                                                    });
                                                                                });
                                                                                
                                                                                if (otrosServicios.length > 0) {
                                                                                    return otrosServicios.slice(0, 5).map((otro: any, index: number) => (
                                                                                        <tr key={index}>
                                                                                            <td>{otro.fechaInicioAtencion || otro.fechaAtencion || 'N/A'}</td>
                                                                                            <td>{otro.tipoServicio || 'Otro'}</td>
                                                                                            <td>{otro.nomTecnologiaSalud || otro.descripcion || 'Servicio'}</td>
                                                                                            <td>${otro.vrServicio?.toLocaleString() || '0'}</td>
                                                                                        </tr>
                                                                                    ));
                                                                                } else {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td colSpan={4} className="text-center text-muted">No hay datos de otros servicios disponibles</td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            })()}
                                                                        </SpkTables>
                                                                    </div>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </div>
                                                    </Tab.Container>
                                                </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="service" className=" text-muted" id="service1" role="tabpanel">
                                        <div className="mb-0">
                                            <div className="file-manager-folders">
                                                <div className="d-flex p-3 flex-wrap gap-2 align-items-center justify-content-between border-bottom">
                                                    <div className="w-50">
                                                        <input placeholder="Buscar Soportes Médicos" aria-label="files-search" className="form-control" type="text" />
                                                    </div>
                                                    <div className="d-flex gap-2 flex-wrap justify-content-sm-end">
                                                        <button className="btn-wave btn btn-w-md d-flex align-items-center justify-content-center btn-wave waves-light btn btn-primary">
                                                            <i className="ri-add-circle-line align-middle me-1"></i>Agregar Soporte
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-3 file-folders-container">
                                                    <div className="d-flex mb-3 align-items-center justify-content-between">
                                                        <p className="mb-0 fw-medium fs-14">Categorías de Soportes</p>
                                                        <Link to="#!" className="fs-12 text-muted fw-medium"> Ver Todos<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                                    </div>
                                                    <Row>
                                                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
                                                            <div className="custom-card shadow-none file-category-card primary card">
                                                                <div className="text-center card-body">
                                                                    <Link className="stretched-link" to="#!"></Link>
                                                                    <div className="mb-2 text-primary svg-primary file-img">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M158.66,219.56A8,8,0,0,1,152,232H24a8,8,0,0,1-6.73-12.33l36-56a8,8,0,0,1,13.46,0l9.76,15.18,20.85-31.29a8,8,0,0,1,13.32,0ZM216,88V216a16,16,0,0,1-16,16h-8a8,8,0,0,1,0-16h8V96H152a8,8,0,0,1-8-8V40H56v88a8,8,0,0,1-16,0V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88Zm-56-8h28.69L160,51.31Z"></path></svg>
                                                                    </div>
                                                                    <h6 className="fw-semibold mb-1">Historias Clínicas</h6>
                                                                    <span className="d-block text-muted">{files?.soportes?.filter((f: any) => f.name.includes('historia')).length || 0} Archivos</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
                                                            <div className="custom-card shadow-none file-category-card info card">
                                                                <div className="text-center card-body">
                                                                    <Link className="stretched-link" to="#!"></Link>
                                                                    <div className="mb-2 text-info svg-info file-img">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M44,120H212.07a4,4,0,0,0,4-4V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152.05,24H56A16,16,0,0,0,40,40v76A4,4,0,0,0,44,120Zm108-76,44,44h-44ZM52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H51.33C71,216,87.55,200.52,88,180.87A36,36,0,0,0,52,144Zm-.49,56H44V160h8a20,20,0,0,1,20,20.77C71.59,191.59,62.35,200,51.52,200Zm170.67-4.28a8.26,8.26,0,0,1-.73,11.09,30,30,0,0,1-21.4,9.19c-17.65,0-32-16.15-32-36s14.36-36,32-36a30,30,0,0,1,21.4,9.19,8.26,8.26,0,0,1,.73,11.09,8,8,0,0,1-11.9.38A14.21,14.21,0,0,0,200.06,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.25,14.25,0,0,0,10.23-4.66A8,8,0,0,1,222.19,195.72ZM128,144c-17.65,0-32,16.15-32,36s14.37,36,32,36,32-16.15,32-36S145.69,144,128,144Zm0,56c-8.83,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.86,200,128,200Z"></path></svg>
                                                                    </div>
                                                                    <h6 className="fw-semibold mb-1">Prescripciones</h6>
                                                                    <span className="d-block text-muted">{files?.soportes?.filter((f: any) => f.name.includes('prescripcion')).length || 0} Archivos</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
                                                            <div className="custom-card shadow-none file-category-card warning card">
                                                                <div className="text-center card-body">
                                                                    <Link className="stretched-link" to="#!"></Link>
                                                                    <div className="mb-2 text-warning svg-warning file-img">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M152,180a40.55,40.55,0,0,1-20,34.91A8,8,0,0,1,124,201.09a24.49,24.49,0,0,0,0-42.18A8,8,0,0,1,132,145.09,40.55,40.55,0,0,1,152,180ZM99.06,128.61a8,8,0,0,0-8.72,1.73L68.69,152H48a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8H68.69l21.65,21.66A8,8,0,0,0,104,224V136A8,8,0,0,0,99.06,128.61ZM216,88V216a16,16,0,0,1-16,16H168a8,8,0,0,1,0-16h32V96H152a8,8,0,0,1-8-8V40H56v80a8,8,0,0,1-16,0V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88Zm-56-8h28.69L160,51.31Z"></path></svg>
                                                                    </div>
                                                                    <h6 className="fw-semibold mb-1">Exámenes</h6>
                                                                    <span className="d-block text-muted">{files?.soportes?.filter((f: any) => f.name.includes('examen')).length || 0} Archivos</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    
                                                    <div className="d-flex mb-3 align-items-center justify-content-between">
                                                        <p className="mb-0 fw-medium fs-14">Soportes Cargados</p>
                                                        <Link to="#!" className="fs-12 text-muted fw-medium"> Ver Todos<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                                    </div>
                                                    <Row>
                                                        <Col xl={12}>
                                                            <div className="table-responsive border">
                                                                <table className="text-nowrap table-hover table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Nombre del Archivo</th>
                                                                            <th>Categoría</th>
                                                                            <th>Tamaño</th>
                                                                            <th>Fecha de Carga</th>
                                                                            <th>Acción</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="files-list">
                                                                        {files?.soportes && files.soportes.length > 0 ? (
                                                                            files.soportes.map((file: any, index: number) => (
                                                                                <tr key={index}>
                                                                                    <th scope="row">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <div className="me-2">
                                                                                                <span className="avatar avatar-sm svg-primary text-primary">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M44,120H212.07a4,4,0,0,0,4-4V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152.05,24H56A16,16,0,0,0,40,40v76A4,4,0,0,0,44,120Zm108-76,44,44h-44ZM52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H51.33C71,216,87.55,200.52,88,180.87A36,36,0,0,0,52,144Zm-.49,56H44V160h8a20,20,0,0,1,20,20.77C71.59,191.59,62.35,200,51.52,200Zm170.67-4.28a8.26,8.26,0,0,1-.73,11.09,30,30,0,0,1-21.4,9.19c-17.65,0-32-16.15-32-36s14.36-36,32-36a30,30,0,0,1,21.4,9.19,8.26,8.26,0,0,1,.73,11.09,8,8,0,0,1-11.9.38A14.21,14.21,0,0,0,200.06,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.25,14.25,0,0,0,10.23-4.66A8,8,0,0,1,222.19,195.72ZM128,144c-17.65,0-32,16.15-32,36s14.37,36,32,36,32-16.15,32-36S145.69,144,128,144Zm0,56c-8.83,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.86,200,128,200Z"></path></svg>
                                                                                                </span>
                                                                                            </div>
                                                                                            <div>
                                                                                                <Link to="#!">{file.name}</Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </th>
                                                                                    <td>Soporte Médico</td>
                                                                                    <td>{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                                                                                    <td>{new Date().toLocaleDateString()}</td>
                                                                                    <td>
                                                                                        <div className="hstack gap-2 fs-15">
                                                                                            <Link className="btn btn-icon btn-sm btn-light" to="#!"><i className="ri-eye-line"></i></Link>
                                                                                            <Link className="btn btn-icon btn-sm btn-light" to="#!"><i className="ri-delete-bin-line"></i></Link>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={5} className="text-center">
                                                                                    <div className="alert alert-warning mb-0">
                                                                                        <i className="ri-alert-line me-2"></i>
                                                                                        No se han cargado soportes médicos adicionales
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default RadicacionStatsViewer;
