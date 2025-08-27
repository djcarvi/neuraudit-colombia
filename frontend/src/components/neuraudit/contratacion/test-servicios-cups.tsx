import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import Seo from '../../../shared/layouts-components/seo/seo';
import Pageheader from '../../../shared/layouts-components/pageheader/pageheader';
import ServiciosCUPSContractuales from './servicios-cups-contractuales';
import { contratacionService } from '../../../services/neuraudit/contratacionService';

interface TestServiciosCUPSProps {}

const TestServiciosCUPS: React.FC<TestServiciosCUPSProps> = () => {
    const [contratos, setContratos] = useState<any[]>([]);
    const [contratoSeleccionado, setContratoSeleccionado] = useState<any>(null);
    
    // Cargar contratos de ejemplo
    useEffect(() => {
        cargarContratos();
    }, []);
    
    const cargarContratos = async () => {
        try {
            const response = await contratacionService.getContratos();
            if (response.results && response.results.length > 0) {
                setContratos(response.results);
                // Seleccionar el primer contrato por defecto
                setContratoSeleccionado(response.results[0]);
            }
        } catch (error) {
            console.error('Error cargando contratos:', error);
            // Datos de prueba si no hay contratos
            const contratoPrueba = {
                id: 'demo_contract_001',
                numero_contrato: 'CNT-2025-001',
                prestador: {
                    razon_social: 'CLINICA DEMO S.A.S',
                    nit: '900123456-1'
                },
                manual_tarifario: 'ISS_2001',
                estado: 'VIGENTE',
                fecha_inicio: '2025-01-01',
                fecha_fin: '2025-12-31'
            };
            setContratos([contratoPrueba]);
            setContratoSeleccionado(contratoPrueba);
        }
    };
    
    return (
        <>
            <Seo title="Test Servicios CUPS" />
            
            <Pageheader 
                title="Gestión de Tarifarios" 
                subtitle="Contratación" 
                currentpage="Test Servicios CUPS" 
                activepage="Servicios CUPS" 
            />
            
            <Container fluid>
                {/* Selector de contrato */}
                <Card className="mb-3">
                    <Card.Body>
                        <h5>Seleccionar Contrato</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {contratos.map((contrato) => (
                                <Button
                                    key={contrato.id}
                                    variant={contratoSeleccionado?.id === contrato.id ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setContratoSeleccionado(contrato)}
                                >
                                    {contrato.numero_contrato} - {contrato.prestador?.razon_social || 'Sin prestador'}
                                </Button>
                            ))}
                        </div>
                        
                        {contratoSeleccionado && (
                            <div className="mt-3">
                                <p className="mb-1">
                                    <strong>Contrato:</strong> {contratoSeleccionado.numero_contrato}
                                </p>
                                <p className="mb-1">
                                    <strong>Prestador:</strong> {contratoSeleccionado.prestador?.razon_social} 
                                    ({contratoSeleccionado.prestador?.nit})
                                </p>
                                <p className="mb-1">
                                    <strong>Manual Base:</strong> {contratoSeleccionado.manual_tarifario}
                                </p>
                                <p className="mb-1">
                                    <strong>Vigencia:</strong> {contratoSeleccionado.fecha_inicio} al {contratoSeleccionado.fecha_fin}
                                </p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
                
                {/* Componente de servicios CUPS */}
                {contratoSeleccionado && (
                    <ServiciosCUPSContractuales
                        contratoId={contratoSeleccionado.id}
                        numeroContrato={contratoSeleccionado.numero_contrato}
                        manualTarifario={contratoSeleccionado.manual_tarifario}
                    />
                )}
                
                {/* Información de prueba */}
                <Card className="mt-3">
                    <Card.Body>
                        <h6>Información de Prueba - NoSQL MongoDB</h6>
                        <ul>
                            <li>Los servicios CUPS se almacenan en MongoDB puro (sin ORM)</li>
                            <li>Cada servicio tiene su tarifa negociada vs valor de referencia ISS/SOAT</li>
                            <li>Se calculan automáticamente las variaciones porcentuales</li>
                            <li>Validación automática para glosas TA (tarifas)</li>
                            <li>Importación/exportación masiva desde Excel</li>
                            <li>Restricciones por sexo, ámbito, edad configurables</li>
                        </ul>
                        
                        <h6 className="mt-3">Endpoints MongoDB disponibles:</h6>
                        <code className="d-block">GET /api/contratacion/mongodb/servicios-cups/</code>
                        <code className="d-block">POST /api/contratacion/mongodb/servicios-cups/</code>
                        <code className="d-block">POST /api/contratacion/mongodb/validar-tarifa-cups/</code>
                        <code className="d-block">GET /api/contratacion/mongodb/estadisticas-contrato/{'{contrato_id}'}/</code>
                        <code className="d-block">POST /api/contratacion/mongodb/importar-servicios-cups/</code>
                        <code className="d-block">GET /api/contratacion/mongodb/exportar-tarifario/{'{contrato_id}'}/</code>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default TestServiciosCUPS;