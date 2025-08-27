
import React, { Fragment, useState, useEffect } from "react";
import { Card, Col, Form, Pagination, Row } from "react-bootstrap";
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButtongroup from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttongroup";
import SpkBadge from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import SpkTables from "../../../shared/@spk-reusable-components/reusable-tables/spk-tables";
import SpkTooltips from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-tooltips";
import tarifariosOficialesService from '../../../services/neuraudit/tarifariosOficialesService';
import type { TarifarioISS2001, TarifarioSOAT2025, TarifarioEstadisticas } from '../../../services/neuraudit/tarifariosOficialesService';
const TarifariosOficiales = () => {
    // Estados para datos reales de tarifarios
    const [issData, setIssData] = useState<{ results: TarifarioISS2001[], count: number, stats: TarifarioEstadisticas } | null>(null);
    const [soatData, setSoatData] = useState<{ results: TarifarioSOAT2025[], count: number, stats: TarifarioEstadisticas } | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedView, setSelectedView] = useState<'comparativo' | 'calculadora' | 'liquidador'>('comparativo');
    const [tableMode, setTableMode] = useState<'iss' | 'soat' | 'comparar'>('iss');
    
    // Estados para comparación manual
    const [selectedISSForCompare, setSelectedISSForCompare] = useState<TarifarioISS2001 | null>(null);
    const [selectedSOATForCompare, setSelectedSOATForCompare] = useState<TarifarioSOAT2025 | null>(null);
    
    // Estados para comparación y cálculo
    const [selectedCode, setSelectedCode] = useState<string>('');
    const [selectedISSItem, setSelectedISSItem] = useState<TarifarioISS2001 | null>(null);
    const [selectedSOATItem, setSelectedSOATItem] = useState<TarifarioSOAT2025 | null>(null);
    
    // Estados para calculadora
    const [valorFacturado, setValorFacturado] = useState<string>('');
    const [porcentajeNegociado, setPorcentajeNegociado] = useState<string>('100');
    const [modalidadContrato, setModalidadContrato] = useState<'evento' | 'capitado'>('evento');
    
    // Estados para conversor UVR/UVT
    const [valorUVR2001] = useState<number>(1270); // Valor UVR ISS 2001 base (nunca se actualiza)
    const [valorUVB2025] = useState<number>(11552); // Valor UVB 2025 (Circular 23 de 2024 MinSalud)
    const [valorUVT2025] = useState<number>(49799); // Valor UVT 2025 oficial (DIAN)
    const [cantidadUVR, setCantidadUVR] = useState<string>('');
    const [tipoConversion, setTipoConversion] = useState<'uvr2001' | 'uvb2025' | 'uvt2025'>('uvr2001');
    
    // Estados para liquidador de cirugías ISS 2001
    const [codigoCirugia, setCodigoCirugia] = useState<string>('');
    const [descripcionCirugia, setDescripcionCirugia] = useState<string>('');
    const [uvrCirugia, setUvrCirugia] = useState<string>('');
    const [porcentajeContratoISS, setPorcentajeContratoISS] = useState<string>('0');
    const [tipoEspecialista, setTipoEspecialista] = useState<'especialista' | 'general'>('especialista');
    const [tipoAnestesia, setTipoAnestesia] = useState<'general_regional' | 'local' | 'sin_anestesia'>('general_regional');
    const [hayAyudante, setHayAyudante] = useState<boolean>(true);
    const [tipoSala, setTipoSala] = useState<'quirofano' | 'procedimientos_especial' | 'procedimientos_basica'>('quirofano');
    const [aplicaArticulo134, setAplicaArticulo134] = useState<boolean>(false);
    const [buscandoCirugia, setBuscandoCirugia] = useState<boolean>(false);
    const [sugerenciasCirugia, setSugerenciasCirugia] = useState<TarifarioISS2001[]>([]);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadTarifariosData();
    }, [currentPage, searchTerm, selectedView]);
    
    // Debug: verificar si las búsquedas funcionan
    useEffect(() => {
        if (selectedView === 'liquidador' && codigoCirugia === '80') {
            console.log('🔍 Should be searching for code 80...');
            console.log('📋 Current suggestions:', sugerenciasCirugia);
            console.log('⏳ Is searching:', buscandoCirugia);
        }
    }, [codigoCirugia, sugerenciasCirugia, buscandoCirugia, selectedView]);

    const loadTarifariosData = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                page_size: 20,
                search: searchTerm || undefined
            };

            // Si estamos en el liquidador, solo cargar ISS
            if (selectedView === 'liquidador') {
                const issResponse = await tarifariosOficialesService.getTarifariosISS2001(params);
                setIssData(issResponse);
            } else {
                // Cargar ambos tarifarios para comparación
                const [issResponse, soatResponse] = await Promise.all([
                    tarifariosOficialesService.getTarifariosISS2001(params),
                    tarifariosOficialesService.getTarifariosSOAT2025(params)
                ]);
                
                setIssData(issResponse);
                setSoatData(soatResponse);
            }
        } catch (error) {
            console.error('Error loading tarifarios data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Función para buscar similitud entre descripciones
    const buscarSimilitud = (descripcion1: string, descripcion2: string): number => {
        if (!descripcion1 || !descripcion2) return 0;
        
        // Normalizar textos
        const texto1 = descripcion1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const texto2 = descripcion2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Palabras clave importantes para procedimientos médicos
        const palabrasClave = texto1.split(/\s+/).filter(p => p.length > 3);
        let coincidencias = 0;
        
        palabrasClave.forEach(palabra => {
            if (texto2.includes(palabra)) {
                coincidencias++;
            }
        });
        
        // Calcular porcentaje de similitud
        return (coincidencias / palabrasClave.length) * 100;
    };
    
    // Función para seleccionar código para comparación
    const selectCodeForComparison = async (codigo: string) => {
        setSelectedCode(codigo);
        
        // Buscar en ISS
        const issItem = issData?.results.find(item => item.codigo === codigo) || null;
        setSelectedISSItem(issItem);
        
        // Buscar en SOAT por código exacto primero
        let soatItem = soatData?.results.find(item => item.codigo === codigo) || null;
        
        // Si no hay coincidencia exacta y tenemos un item ISS, buscar por similitud usando el backend
        if (!soatItem && issItem) {
            try {
                console.log('🔍 Buscando similares en backend para:', codigo);
                const response = await tarifariosOficialesService.buscarSimilaresPorDescripcion(codigo);
                
                if (response.resultados && response.resultados.length > 0) {
                    // Buscar coincidencia exacta por descripción primero
                    const palabrasClaveISS = issItem.descripcion.toLowerCase().split(/\s+/);
                    let mejorCoincidencia = response.resultados[0];
                    let mejorScore = 0;
                    
                    response.resultados.forEach(resultado => {
                        const descripcionSOAT = resultado.descripcion.toLowerCase();
                        let score = 0;
                        
                        // Priorizar coincidencias exactas de términos principales
                        if (palabrasClaveISS.includes('punción') && descripcionSOAT.includes('punción')) score += 10;
                        if (palabrasClaveISS.includes('cisternal') && descripcionSOAT.includes('cisternal')) score += 10;
                        if (palabrasClaveISS.includes('ventricular') && descripcionSOAT.includes('ventricular')) score += 10;
                        if (palabrasClaveISS.includes('lumbar') && descripcionSOAT.includes('lumbar')) score += 10;
                        
                        // Bonus por coincidencia perfecta de procedimiento
                        if (descripcionSOAT.includes('cisternal') && palabrasClaveISS.includes('cisternal')) {
                            score += 20;
                        }
                        
                        if (score > mejorScore) {
                            mejorScore = score;
                            mejorCoincidencia = resultado;
                        }
                    });
                    
                    soatItem = mejorCoincidencia;
                    console.log('✅ Encontrado match inteligente:', soatItem.codigo, '-', soatItem.descripcion, 'Score:', mejorScore);
                }
            } catch (error) {
                console.error('Error buscando similares:', error);
                // Fallback: buscar localmente en los datos cargados
                if (soatData) {
                    let mejorCoincidencia = null;
                    let mejorPorcentaje = 0;
                    
                    soatData.results.forEach(soat => {
                        const similitud = buscarSimilitud(issItem.descripcion, soat.descripcion);
                        if (similitud > mejorPorcentaje && similitud > 50) {
                            mejorPorcentaje = similitud;
                            mejorCoincidencia = soat;
                        }
                    });
                    
                    soatItem = mejorCoincidencia;
                }
            }
        }
        
        setSelectedSOATItem(soatItem);
    };
    
    // Calcular validación tarifaria
    const calcularValidacion = () => {
        if (!selectedISSItem || !selectedSOATItem || !valorFacturado) return null;
        
        const valorFacturadoNum = parseFloat(valorFacturado.replace(/[^\d.-]/g, ''));
        const porcentaje = parseFloat(porcentajeNegociado) / 100;
        const valorISS = selectedISSItem.valor_referencia_actual || 0;
        const valorSOAT = selectedSOATItem.valor_referencia_actual || 0;
        const valorNegociado = modalidadContrato === 'evento' ? valorISS * porcentaje : valorISS;
        
        return {
            dentroRango: valorFacturadoNum >= valorISS && valorFacturadoNum <= valorSOAT,
            valorISS,
            valorSOAT,
            valorNegociado,
            diferenciaPorcentaje: ((valorFacturadoNum - valorISS) / valorISS * 100).toFixed(2)
        };
    };
    
    // Tablas de valores ISS 2001 según rangos UVR
    // Tabla de derechos de sala de QUIRÓFANO (Art. 77)
    const tablaDerechosSalaQuirofano = [
        { rangoMin: 0, rangoMax: 20, codigo: 'S23101', valor: 12890 },
        { rangoMin: 21, rangoMax: 30, codigo: 'S23102', valor: 26790 },
        { rangoMin: 31, rangoMax: 40, codigo: 'S23201', valor: 44270 },
        { rangoMin: 41, rangoMax: 50, codigo: 'S23202', valor: 55605 },
        { rangoMin: 51, rangoMax: 60, codigo: 'S23203', valor: 72215 },
        { rangoMin: 61, rangoMax: 70, codigo: 'S23204', valor: 96520 },
        { rangoMin: 71, rangoMax: 80, codigo: 'S23205', valor: 114830 },
        { rangoMin: 81, rangoMax: 90, codigo: 'S23301', valor: 142505 },
        { rangoMin: 91, rangoMax: 100, codigo: 'S23302', valor: 179460 },
        { rangoMin: 101, rangoMax: 110, codigo: 'S23303', valor: 206600 },
        { rangoMin: 111, rangoMax: 120, codigo: 'S23304', valor: 241610 },
        { rangoMin: 121, rangoMax: 130, codigo: 'S23305', valor: 276700 },
        { rangoMin: 131, rangoMax: 140, codigo: 'S23306', valor: 306695 },
        { rangoMin: 141, rangoMax: 150, codigo: 'S23401', valor: 321610 },
        { rangoMin: 151, rangoMax: 160, codigo: 'S23402', valor: 339715 },
        { rangoMin: 161, rangoMax: 170, codigo: 'S23403', valor: 371805 }
    ];
    
    // Tabla de derechos de SALA DE PROCEDIMIENTOS ESPECIAL (Art. 79)
    const tablaDerechosSalaEspecial = [
        { rangoMin: 0, rangoMax: 20, codigo: 'S22201', valor: 6445 },
        { rangoMin: 21, rangoMax: 30, codigo: 'S22202', valor: 13400 },
        { rangoMin: 31, rangoMax: 40, codigo: 'S22203', valor: 22395 },
        { rangoMin: 41, rangoMax: 50, codigo: 'S22204', valor: 27800 },
        { rangoMin: 51, rangoMax: 60, codigo: 'S22205', valor: 40590 },
        { rangoMin: 61, rangoMax: 70, codigo: 'S22206', valor: 48260 },
        { rangoMin: 71, rangoMax: 80, codigo: 'S22207', valor: 57415 },
        { rangoMin: 81, rangoMax: 90, codigo: 'S22208', valor: 64830 },
        { rangoMin: 91, rangoMax: 100, codigo: 'S22209', valor: 72325 },
        { rangoMin: 101, rangoMax: 110, codigo: 'S22210', valor: 74275 },
        { rangoMin: 111, rangoMax: 130, codigo: 'S22211', valor: 76540 },
        { rangoMin: 131, rangoMax: 150, codigo: 'S22212', valor: 93210 },
        { rangoMin: 151, rangoMax: 170, codigo: 'S22213', valor: 102350 },
        { rangoMin: 171, rangoMax: 200, codigo: 'S22214', valor: 123485 }
    ];
    
    // Tabla de derechos de SALA DE PROCEDIMIENTOS BÁSICA (Art. 81)
    const tablaDerechosSalaBasica = [
        { rangoMin: 0, rangoMax: 20, codigo: 'S22104', valor: 3225 },
        { rangoMin: 21, rangoMax: 30, codigo: 'S22105', valor: 6700 }
    ];
    
    // Tabla de material médico quirúrgico para QUIRÓFANO
    const tablaMaterialQuirofano = [
        { rangoMin: 0, rangoMax: 20, codigo: 'S55101', valor: 6350 },
        { rangoMin: 21, rangoMax: 30, codigo: 'S55102', valor: 13185 },
        { rangoMin: 31, rangoMax: 40, codigo: 'S55103', valor: 22925 },
        { rangoMin: 41, rangoMax: 50, codigo: 'S55104', valor: 29850 },
        { rangoMin: 51, rangoMax: 60, codigo: 'S55105', valor: 57410 },
        { rangoMin: 61, rangoMax: 70, codigo: 'S55106', valor: 82315 },
        { rangoMin: 71, rangoMax: 80, codigo: 'S55107', valor: 88610 },
        { rangoMin: 81, rangoMax: 90, codigo: 'S55108', valor: 95015 },
        { rangoMin: 91, rangoMax: 100, codigo: 'S55109', valor: 101405 },
        { rangoMin: 101, rangoMax: 110, codigo: 'S55110', valor: 110375 },
        { rangoMin: 111, rangoMax: 120, codigo: 'S55111', valor: 119395 },
        { rangoMin: 121, rangoMax: 130, codigo: 'S55112', valor: 130950 },
        { rangoMin: 131, rangoMax: 140, codigo: 'S55113', valor: 138000 },
        { rangoMin: 141, rangoMax: 150, codigo: 'S55201', valor: 147560 },
        { rangoMin: 151, rangoMax: 160, codigo: 'S55202', valor: 156445 },
        { rangoMin: 161, rangoMax: 170, codigo: 'S55203', valor: 171445 }
    ];
    
    // Función para buscar cirugía en ISS 2001
    const buscarCirugia = async (termino: string, porCodigo: boolean = true) => {
        if (!termino || termino.length < 2) {
            setSugerenciasCirugia([]);
            return;
        }
        
        try {
            setBuscandoCirugia(true);
            console.log('🔍 Buscando cirugía:', termino, porCodigo ? 'por código' : 'por descripción');
            
            const params = {
                search: termino,
                page_size: 20
            };
            
            const response = await tarifariosOficialesService.getTarifariosISS2001(params);
            console.log('📋 Respuesta búsqueda:', response);
            
            if (response.results && response.results.length > 0) {
                // Filtrar solo procedimientos quirúrgicos si es posible
                const procedimientosQuirurgicos = response.results.filter(item => 
                    item.tipo === 'QUIRURGICO' || 
                    item.tipo === 'PROCEDIMIENTO' ||
                    item.descripcion.toLowerCase().includes('cirug') ||
                    item.descripcion.toLowerCase().includes('quirurg') ||
                    item.descripcion.toLowerCase().includes('operac') ||
                    item.descripcion.toLowerCase().includes('tomia') ||
                    item.descripcion.toLowerCase().includes('ectomia') ||
                    item.descripcion.toLowerCase().includes('plasty') ||
                    item.descripcion.toLowerCase().includes('scopia')
                );
                
                const resultados = procedimientosQuirurgicos.length > 0 ? procedimientosQuirurgicos : response.results;
                setSugerenciasCirugia(resultados);
                
                // Si es búsqueda por código exacto y hay coincidencia exacta
                if (porCodigo) {
                    const coincidenciaExacta = resultados.find(item => item.codigo === termino);
                    if (coincidenciaExacta) {
                        seleccionarCirugia(coincidenciaExacta);
                    }
                }
            } else {
                setSugerenciasCirugia([]);
            }
        } catch (error) {
            console.error('❌ Error buscando cirugía:', error);
            setSugerenciasCirugia([]);
        } finally {
            setBuscandoCirugia(false);
        }
    };
    
    // Función para seleccionar una cirugía de las sugerencias
    const seleccionarCirugia = (cirugia: TarifarioISS2001) => {
        console.log('✅ Cirugía seleccionada:', cirugia);
        setCodigoCirugia(cirugia.codigo);
        setDescripcionCirugia(cirugia.descripcion);
        
        // Manejar UVR que puede venir como string con decimales
        let uvrValue = '';
        if (cirugia.uvr) {
            // Si es string, parsear y quitar decimales
            uvrValue = parseFloat(cirugia.uvr.toString()).toFixed(0);
        }
        setUvrCirugia(uvrValue);
        setSugerenciasCirugia([]);
    };
    
    // Función para calcular liquidación de cirugía ISS 2001
    const calcularLiquidacionCirugia = () => {
        if (!uvrCirugia || !codigoCirugia) return null;
        
        const uvr = parseFloat(uvrCirugia);
        const porcentajeContrato = parseFloat(porcentajeContratoISS) || 0;
        
        // Valores base UVR según tipo de profesional
        const valorUVRCirujano = tipoEspecialista === 'especialista' ? 1270 : 810;
        const valorUVRAnestesiologo = 960;
        const valorUVRAyudante = 360;
        
        // Factor de incremento contractual
        const factor = 1 + (porcentajeContrato / 100);
        
        // Factor adicional si aplica artículo 134 (30% según los datos mostrados)
        const factorArticulo134 = aplicaArticulo134 ? 1.3 : 1.0;
        
        // Calcular honorarios base
        let honorariosCirujano = uvr * valorUVRCirujano * factor * factorArticulo134;
        let honorariosAnestesiologo = 0;
        let honorariosAyudante = 0;
        
        // Honorarios anestesiólogo solo si aplica anestesia general o regional
        // Art. 61 Parágrafo 1: La anestesia local no es facturable
        if (tipoAnestesia === 'general_regional') {
            honorariosAnestesiologo = uvr * valorUVRAnestesiologo * factor * factorArticulo134;
        }
        
        // Honorarios ayudante
        // Art. 63: Solo es facturable cuando el procedimiento es en quirófano
        if (hayAyudante && tipoSala === 'quirofano') {
            honorariosAyudante = uvr * valorUVRAyudante * factor * factorArticulo134;
        }
        
        // Seleccionar tabla correcta según tipo de sala
        let tablaSala, tablaMaterial;
        let codigoMaterial = 'S55107'; // Por defecto quirófano
        let descripcionMaterial = 'Material de sutura y curación, agentes y gases anestésicos';
        
        if (tipoSala === 'quirofano') {
            tablaSala = tablaDerechosSalaQuirofano;
            tablaMaterial = tablaMaterialQuirofano;
        } else if (tipoSala === 'procedimientos_especial') {
            tablaSala = tablaDerechosSalaEspecial;
            // En sala de procedimientos especial se usa tarifa fija S55114
            codigoMaterial = 'S55114';
            descripcionMaterial = 'Material de sutura y curación, agentes y gases anestésicos, en sala de procedimientos especial';
        } else {
            tablaSala = tablaDerechosSalaBasica;
            // En sala básica se usa tarifa fija S55115
            codigoMaterial = 'S55115';
            descripcionMaterial = 'Materiales de sutura y curación, agentes y gases anestésicos, en sala de procedimientos básica';
        }
        
        // Buscar valores según rango UVR
        const rangoSala = tablaSala.find(r => uvr >= r.rangoMin && uvr <= r.rangoMax);
        const rangoMaterial = tablaMaterial?.find(r => uvr >= r.rangoMin && uvr <= r.rangoMax);
        
        // Calcular valores
        let derechosSala = 0;
        let materialQuirurgico = 0;
        
        if (tipoSala === 'quirofano') {
            // En quirófano usar tabla según UVR
            if (rangoSala) {
                derechosSala = rangoSala.valor * factor * factorArticulo134;
            } else if (uvr > 170) {
                // Para UVR > 170 en quirófano, se calcula diferente
                derechosSala = uvr * 1410 * factor * factorArticulo134;
            }
            
            if (rangoMaterial) {
                materialQuirurgico = rangoMaterial.valor * factor;
            } else if (uvr > 170) {
                materialQuirurgico = uvr * 1035 * factor;
            }
        } else if (tipoSala === 'procedimientos_especial') {
            // En sala especial usar tabla según UVR para sala
            if (rangoSala) {
                derechosSala = rangoSala.valor * factor * factorArticulo134;
            }
            // Material es tarifa fija sin incremento del artículo 134
            materialQuirurgico = 24270 * factor;
        } else {
            // En sala básica
            if (rangoSala) {
                derechosSala = rangoSala.valor * factor * factorArticulo134;
            }
            // Material es tarifa fija
            materialQuirurgico = 10350 * factor;
        }
        
        // Preparar componentes según lo facturado
        const componentes = [];
        
        // Honorarios cirujano
        componentes.push({
            codigo: tipoEspecialista === 'especialista' ? 'S41101' : 'S41401',
            concepto: 'Honorarios de Cirujano',
            descripcion: tipoEspecialista === 'especialista' ? 
                'Especialistas de clínicas quirúrgicas o ginecoobstétricas' : 
                'Médico u odontólogo general',
            porcentaje: 100,
            valor: honorariosCirujano
        });
        
        // Honorarios anestesiólogo
        if (tipoAnestesia === 'general_regional') {
            componentes.push({
                codigo: 'S41201',
                concepto: 'Honorarios de Anestesiólogo',
                descripcion: 'Especialistas en anestesiología',
                porcentaje: 100,
                valor: honorariosAnestesiologo
            });
        } else if (tipoAnestesia === 'local') {
            componentes.push({
                codigo: 'S41201',
                concepto: 'Honorarios de Anestesiólogo',
                descripcion: 'Especialistas en anestesiología - Art. 61 Parágrafo 1 (Anestesia local no facturable)',
                porcentaje: 100,
                valor: 0
            });
        }
        
        // Honorarios ayudante
        if (hayAyudante) {
            if (tipoSala === 'quirofano') {
                componentes.push({
                    codigo: 'S41301',
                    concepto: 'Honorarios de Ayudante',
                    descripcion: 'Médico ayudante quirúrgico',
                    porcentaje: 100,
                    valor: honorariosAyudante
                });
            } else {
                componentes.push({
                    codigo: 'S41301',
                    concepto: 'Honorarios de Ayudante',
                    descripcion: 'Médico ayudante quirúrgico - Art. 63 - Solamente es facturable cuando el procedimiento es en quirófano',
                    porcentaje: 100,
                    valor: 0
                });
            }
        }
        
        // Derechos de sala
        componentes.push({
            codigo: rangoSala?.codigo || 'S22XXX',
            concepto: 'Derechos de sala',
            descripcion: rangoSala ? `DE ${rangoSala.rangoMin} HASTA ${rangoSala.rangoMax} UVR` : 'FUERA DE RANGO',
            porcentaje: 100,
            valor: derechosSala
        });
        
        // Material médico quirúrgico
        componentes.push({
            codigo: codigoMaterial,
            concepto: 'Material médico quirúrgico',
            descripcion: descripcionMaterial,
            porcentaje: 100,
            valor: materialQuirurgico
        });
        
        // Calcular total solo de valores > 0
        const total = componentes.reduce((sum, comp) => sum + comp.valor, 0);
        
        return {
            codigo: codigoCirugia,
            descripcion: descripcionCirugia,
            uvr: uvr,
            factorIncremento: factor,
            factorArticulo134: factorArticulo134,
            componentes: componentes,
            total: total
        };
    };

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Contratación-Tarifarios Oficiales" />

            <Pageheader title="Contratación" currentpage="Tarifarios Oficiales" activepage="Tarifarios Oficiales" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start:: row-1 - Buscador Unificado --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Validador de Tarifas Médicas - Resolución 2284 de 2023
                            </div>
                            <div className="ms-auto">
                                <SpkBadge variant="" Customclass="bg-primary text-white">
                                    ISS 2001: {issData?.count.toLocaleString() || 0} códigos
                                </SpkBadge>
                                <SpkBadge variant="" Customclass="bg-warning text-white ms-2">
                                    SOAT 2025: {soatData?.count.toLocaleString() || 0} códigos
                                </SpkBadge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={8}>
                                    <Form.Control 
                                        size="lg"
                                        type="text"
                                        placeholder="Buscar por código CUPS, descripción del procedimiento o medicamento..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </Col>
                                <Col md={4}>
                                    <SpkButtongroup className="w-100">
                                        <SpkButton 
                                            Buttonvariant={selectedView === 'comparativo' ? 'primary' : 'primary-light'}
                                            Buttontype="button"
                                            onClick={() => setSelectedView('comparativo')}
                                        >
                                            <i className="bi bi-arrows-collapse me-1"></i> Comparar Tarifas
                                        </SpkButton>
                                        <SpkButton 
                                            Buttonvariant={selectedView === 'calculadora' ? 'primary' : 'primary-light'}
                                            Buttontype="button"
                                            onClick={() => setSelectedView('calculadora')}
                                        >
                                            <i className="bi bi-calculator me-1"></i> Validar
                                        </SpkButton>
                                        <SpkButton 
                                            Buttonvariant={selectedView === 'liquidador' ? 'primary' : 'primary-light'}
                                            Buttontype="button"
                                            onClick={() => setSelectedView('liquidador')}
                                        >
                                            <i className="bi bi-receipt me-1"></i> Liquidador ISS
                                        </SpkButton>
                                    </SpkButtongroup>
                                </Col>
                            </Row>
                            
                            {/* Toggle para modo de tabla - Solo en vista comparativo */}
                            {selectedView === 'comparativo' && (
                                <Row className="g-3 mt-2">
                                    <Col md={12}>
                                        <div className="d-flex justify-content-center">
                                            <SpkButtongroup>
                                                <SpkButton 
                                                    Buttonvariant={tableMode === 'iss' ? 'success' : 'success-light'}
                                                    Buttontype="button"
                                                    onClick={() => setTableMode('iss')}
                                                    Customclass="btn-sm"
                                                >
                                                    <i className="bi bi-journal-medical me-1"></i> ISS 2001
                                                </SpkButton>
                                                <SpkButton 
                                                    Buttonvariant={tableMode === 'soat' ? 'warning' : 'warning-light'}
                                                    Buttontype="button"
                                                    onClick={() => setTableMode('soat')}
                                                    Customclass="btn-sm"
                                                >
                                                    <i className="bi bi-clipboard-pulse me-1"></i> SOAT 2025
                                                </SpkButton>
                                                <SpkButton 
                                                    Buttonvariant={tableMode === 'comparar' ? 'info' : 'info-light'}
                                                    Buttontype="button"
                                                    onClick={() => setTableMode('comparar')}
                                                    Customclass="btn-sm"
                                                    disabled={!selectedISSForCompare || !selectedSOATForCompare}
                                                >
                                                    <i className="bi bi-arrows-collapse me-1"></i> Comparar
                                                    {selectedISSForCompare && selectedSOATForCompare && (
                                                        <SpkBadge variant="" Customclass="bg-light text-dark ms-1">
                                                            2 seleccionados
                                                        </SpkBadge>
                                                    )}
                                                </SpkButton>
                                            </SpkButtongroup>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-1 --> */}

            {/* <!-- Start:: row-2 - Comparador / Calculadora --> */}

            {selectedView === 'comparativo' && selectedCode && (
                <Row>
                    <Col xxl={6}>
                        <Card className="custom-card border-primary">
                            <Card.Header className="bg-primary-transparent">
                                <div className="card-title">
                                    ISS 2001 - Mínimo Nacional
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {selectedISSItem ? (
                                    <>
                                        <h5 className="fw-semibold mb-3">{selectedISSItem.codigo}</h5>
                                        <p className="text-muted">{selectedISSItem.descripcion}</p>
                                        <h2 className="text-primary fw-bold">
                                            ${(selectedISSItem.valor_referencia_actual || 0).toLocaleString('es-CO')}
                                        </h2>
                                        <div className="mt-3">
                                            <SpkBadge variant="" Customclass="bg-primary-transparent me-2">
                                                UVR: {selectedISSItem.uvr || 'N/A'}
                                            </SpkBadge>
                                            <SpkBadge variant="" Customclass="bg-secondary-transparent">
                                                {selectedISSItem.tipo}
                                            </SpkBadge>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-muted">
                                        <i className="bi bi-info-circle fs-1"></i>
                                        <p className="mt-2">Código no encontrado en ISS 2001</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={6}>
                        <Card className="custom-card border-warning">
                            <Card.Header className="bg-warning-transparent">
                                <div className="card-title">
                                    SOAT 2025 - Máximo Nacional
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {selectedSOATItem ? (
                                    <>
                                        <h5 className="fw-semibold mb-3">{selectedSOATItem.codigo}</h5>
                                        <p className="text-muted">{selectedSOATItem.descripcion}</p>
                                        <h2 className="text-warning fw-bold">
                                            ${(selectedSOATItem.valor_referencia_actual || 0).toLocaleString('es-CO')}
                                        </h2>
                                        <div className="mt-3">
                                            <SpkBadge variant="" Customclass="bg-warning-transparent me-2">
                                                Grupo: {selectedSOATItem.grupo_quirurgico || 'N/A'}
                                            </SpkBadge>
                                            <SpkBadge variant="" Customclass="bg-secondary-transparent">
                                                {selectedSOATItem.tipo}
                                            </SpkBadge>
                                        </div>
                                        {selectedISSItem && (
                                            <div className="alert alert-warning mt-3">
                                                <strong>Diferencia sobre ISS:</strong> {' '}
                                                +{(((selectedSOATItem.valor_referencia_actual || 0) - (selectedISSItem.valor_referencia_actual || 0)) / (selectedISSItem.valor_referencia_actual || 1) * 100).toFixed(1)}%
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center text-muted">
                                        <i className="bi bi-info-circle fs-1"></i>
                                        <p className="mt-2">Código no encontrado en SOAT 2025</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {selectedView === 'calculadora' && (
                <Row className="g-3">
                    {/* Conversor UVR/UVT */}
                    <Col xxl={6}>
                        <Card className="custom-card">
                            <Card.Header>
                                <div className="card-title">
                                    Conversor UVR / UVT a Pesos Colombianos
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Tipo de Conversión</Form.Label>
                                            <Form.Select
                                                value={tipoConversion}
                                                onChange={(e) => setTipoConversion(e.target.value as any)}
                                            >
                                                <option value="uvr2001">UVR ISS 2001 ($1,270)</option>
                                                <option value="uvb2025">UVB 2025 ($11,552)</option>
                                                <option value="uvt2025">UVT 2025 ($49,799)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Cantidad</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="0"
                                                value={cantidadUVR}
                                                onChange={(e) => setCantidadUVR(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {cantidadUVR && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <h6 className="text-primary">Resultado:</h6>
                                        <h3 className="mb-0">
                                            ${(parseFloat(cantidadUVR || '0') * 
                                              (tipoConversion === 'uvr2001' ? valorUVR2001 : 
                                               tipoConversion === 'uvb2025' ? valorUVB2025 : 
                                               valorUVT2025)).toLocaleString('es-CO')}
                                        </h3>
                                        <small className="text-muted">
                                            {cantidadUVR} {tipoConversion === 'uvt2025' ? 'UVT' : tipoConversion === 'uvb2025' ? 'UVB' : 'UVR'} × 
                                            ${(tipoConversion === 'uvr2001' ? valorUVR2001 : 
                                               tipoConversion === 'uvb2025' ? valorUVB2025 : 
                                               valorUVT2025).toLocaleString('es-CO')}
                                        </small>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Información del código seleccionado */}
                    <Col xxl={6}>
                        <Card className="custom-card">
                            <Card.Header>
                                <div className="card-title">
                                    Información del Procedimiento
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código CUPS</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese código CUPS"
                                        value={selectedCode}
                                        onChange={(e) => selectCodeForComparison(e.target.value)}
                                    />
                                </Form.Group>
                                {selectedCode && (
                                    <div>
                                        {selectedISSItem && (
                                            <div className="border-bottom pb-3 mb-3">
                                                <h6 className="text-primary">ISS 2001</h6>
                                                <p className="mb-1">{selectedISSItem.descripcion}</p>
                                                <p className="mb-0">
                                                    <strong>${(selectedISSItem.valor_referencia_actual || 0).toLocaleString('es-CO')}</strong>
                                                    <small className="text-muted ms-2">({selectedISSItem.uvr} UVR)</small>
                                                </p>
                                            </div>
                                        )}
                                        {selectedSOATItem && (
                                            <div>
                                                <h6 className="text-warning">SOAT 2025</h6>
                                                <p className="mb-1">{selectedSOATItem.descripcion}</p>
                                                <p className="mb-0">
                                                    <strong>${(selectedSOATItem.valor_referencia_actual || 0).toLocaleString('es-CO')}</strong>
                                                    <small className="text-muted ms-2">(Grupo {selectedSOATItem.grupo_quirurgico})</small>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Calculadora de Validación Mejorada */}
                    <Col xl={12}>
                        <Card className="custom-card">
                            <Card.Header>
                                <div className="card-title">
                                    Calculadora Avanzada de Validación Tarifaria
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Valor Facturado</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="$0"
                                                value={valorFacturado}
                                                onChange={(e) => setValorFacturado(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Modalidad</Form.Label>
                                            <Form.Select
                                                value={modalidadContrato}
                                                onChange={(e) => setModalidadContrato(e.target.value as 'evento' | 'capitado')}
                                            >
                                                <option value="evento">Evento</option>
                                                <option value="capitado">Capitado</option>
                                                <option value="paquete">Paquete</option>
                                                <option value="conjunto">Conjunto Integral</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>% Negociado sobre ISS</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="100"
                                                value={porcentajeNegociado}
                                                onChange={(e) => setPorcentajeNegociado(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Cantidad</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="1"
                                                defaultValue="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                {(() => {
                                    const validacion = calcularValidacion();
                                    if (!validacion) return null;
                                    
                                    const porcentajeISS = ((parseFloat(valorFacturado.replace(/[^\d.-]/g, '')) - validacion.valorISS) / validacion.valorISS * 100).toFixed(1);
                                    const porcentajeSOAT = ((parseFloat(valorFacturado.replace(/[^\d.-]/g, '')) - validacion.valorSOAT) / validacion.valorSOAT * 100).toFixed(1);
                                    
                                    return (
                                        <div className="mt-4">
                                            <Row>
                                                <Col md={8}>
                                                    <div className="border rounded p-3">
                                                        <h6 className="mb-3">Análisis Comparativo:</h6>
                                                        
                                                        {/* Gráfico visual de rangos */}
                                                        <div className="position-relative mb-4" style={{height: '80px'}}>
                                                            <div className="position-absolute w-100 bg-light rounded" style={{height: '40px', top: '20px'}}>
                                                                <div className="position-absolute bg-success rounded-start" 
                                                                     style={{
                                                                         width: `${(validacion.valorISS / validacion.valorSOAT * 100)}%`,
                                                                         height: '100%'
                                                                     }}>
                                                                </div>
                                                                <div className="position-absolute text-white text-center" 
                                                                     style={{left: '5px', top: '50%', transform: 'translateY(-50%)'}}>
                                                                    <small>ISS: ${validacion.valorISS.toLocaleString('es-CO')}</small>
                                                                </div>
                                                                <div className="position-absolute text-dark text-center" 
                                                                     style={{right: '5px', top: '50%', transform: 'translateY(-50%)'}}>
                                                                    <small>SOAT: ${validacion.valorSOAT.toLocaleString('es-CO')}</small>
                                                                </div>
                                                                
                                                                {/* Marcador del valor facturado */}
                                                                {valorFacturado && (
                                                                    <div className="position-absolute" 
                                                                         style={{
                                                                             left: `${Math.min(100, Math.max(0, (parseFloat(valorFacturado.replace(/[^\d.-]/g, '')) / validacion.valorSOAT * 100)))}%`,
                                                                             top: '-20px',
                                                                             transform: 'translateX(-50%)'
                                                                         }}>
                                                                        <div className="text-center">
                                                                            <i className="bi bi-caret-down-fill text-primary fs-5"></i>
                                                                            <div className="small fw-bold">Facturado</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <Row>
                                                            <Col md={4}>
                                                                <div className="text-center">
                                                                    <h6 className="text-success">ISS 2001 (Mínimo)</h6>
                                                                    <h5>${validacion.valorISS.toLocaleString('es-CO')}</h5>
                                                                    <SpkBadge variant="" Customclass="bg-success-transparent">
                                                                        {porcentajeISS}% vs facturado
                                                                    </SpkBadge>
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                <div className="text-center">
                                                                    <h6 className="text-primary">Valor Negociado</h6>
                                                                    <h5>${validacion.valorNegociado.toLocaleString('es-CO')}</h5>
                                                                    <SpkBadge variant="" Customclass="bg-primary-transparent">
                                                                        {porcentajeNegociado}% ISS
                                                                    </SpkBadge>
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                <div className="text-center">
                                                                    <h6 className="text-warning">SOAT 2025 (Máximo)</h6>
                                                                    <h5>${validacion.valorSOAT.toLocaleString('es-CO')}</h5>
                                                                    <SpkBadge variant="" Customclass="bg-warning-transparent">
                                                                        {porcentajeSOAT}% vs facturado
                                                                    </SpkBadge>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={`alert ${validacion.dentroRango ? 'alert-success' : 'alert-danger'} h-100 d-flex flex-column justify-content-center`}>
                                                        <h5 className="alert-heading d-flex align-items-center">
                                                            <i className={`bi ${validacion.dentroRango ? 'bi-check-circle' : 'bi-x-circle'} me-2`}></i>
                                                            {validacion.dentroRango ? 'Tarifa Válida' : 'Tarifa Inválida'}
                                                        </h5>
                                                        <hr/>
                                                        <p className="mb-0">
                                                            {validacion.dentroRango ? 
                                                                'El valor facturado está dentro del rango legal establecido entre ISS 2001 y SOAT 2025.' : 
                                                                `El valor facturado excede el máximo legal SOAT en ${porcentajeSOAT}%. Procede aplicar glosa TA0101.`
                                                            }
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    );
                                })()}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Panel de Glosas Mejorado */}
                    <Col xl={12}>
                        <Card className="custom-card">
                            <Card.Header>
                                <div className="card-title">
                                    Generador de Glosas Tarifarias (TA)
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3}>
                                        <div className="list-group">
                                            <button className="list-group-item list-group-item-action border-danger">
                                                <SpkBadge variant="" Customclass="bg-danger text-white">TA0101</SpkBadge>
                                                <p className="mb-1 mt-2 fw-semibold">Tarifa &gt; SOAT</p>
                                                <small>Valor facturado supera el máximo legal SOAT 2025</small>
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="list-group">
                                            <button className="list-group-item list-group-item-action border-warning">
                                                <SpkBadge variant="" Customclass="bg-warning">TA0201</SpkBadge>
                                                <p className="mb-1 mt-2 fw-semibold">Sin contrato</p>
                                                <small>Tarifa no pactada en contrato vigente</small>
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="list-group">
                                            <button className="list-group-item list-group-item-action border-info">
                                                <SpkBadge variant="" Customclass="bg-info text-white">TA0301</SpkBadge>
                                                <p className="mb-1 mt-2 fw-semibold">Diferencia valor</p>
                                                <small>Diferencia con valor negociado en contrato</small>
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="list-group">
                                            <button className="list-group-item list-group-item-action border-secondary">
                                                <SpkBadge variant="" Customclass="bg-secondary">TA0401</SpkBadge>
                                                <p className="mb-1 mt-2 fw-semibold">Modalidad incorrecta</p>
                                                <small>Facturado por evento siendo capitado</small>
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            
            {selectedView === 'liquidador' && (
                <Row className="g-3">
                    {/* Formulario de entrada de datos */}
                    <Col xl={12}>
                        <Card className="custom-card">
                            <Card.Header>
                                <div className="card-title">
                                    <i className="bi bi-receipt me-2"></i>
                                    Liquidador de Cirugías ISS 2001 - Acuerdo 256 de 2001
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row className="g-3">
                                        <Col md={12}>
                                            <div className="alert alert-info">
                                                <i className="bi bi-info-circle me-2"></i>
                                                <strong>Liquidación en línea de cirugías según Manual Tarifario ISS 2001</strong>
                                            </div>
                                        </Col>
                                        
                                        {/* Datos de la cirugía */}
                                        <Col md={4}>
                                            <Form.Label>Código de la Cirugía <span className="text-danger">*</span></Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ej: 801200"
                                                    value={codigoCirugia}
                                                    onChange={(e) => {
                                                        setCodigoCirugia(e.target.value);
                                                        if (e.target.value.length >= 2) {
                                                            buscarCirugia(e.target.value, true);
                                                        } else {
                                                            setSugerenciasCirugia([]);
                                                        }
                                                    }}
                                                    onBlur={() => setTimeout(() => setSugerenciasCirugia([]), 200)}
                                                />
                                                {buscandoCirugia && (
                                                    <div className="position-absolute end-0 top-50 translate-middle-y me-2">
                                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                            <span className="visually-hidden">Buscando...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {(sugerenciasCirugia.length > 0 || (buscandoCirugia && codigoCirugia.length >= 2)) && (
                                                    <div className="position-absolute w-100 bg-white border rounded-bottom shadow-sm" style={{top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                                                        {buscandoCirugia && sugerenciasCirugia.length === 0 && (
                                                            <div className="p-3 text-center text-muted">
                                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                    <span className="visually-hidden">Buscando...</span>
                                                                </div>
                                                                Buscando cirugías...
                                                            </div>
                                                        )}
                                                        {sugerenciasCirugia.map((cirugia) => (
                                                            <div 
                                                                key={cirugia.id}
                                                                className="p-2 cursor-pointer hover-bg-light"
                                                                style={{cursor: 'pointer'}}
                                                                onClick={() => seleccionarCirugia(cirugia)}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                            >
                                                                <small className="d-block">
                                                                    <strong>{cirugia.codigo}</strong> - {cirugia.descripcion}
                                                                    <span className="text-muted ms-2">({cirugia.uvr ? parseFloat(cirugia.uvr.toString()).toFixed(0) : 'Sin UVR'} UVR)</span>
                                                                </small>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Descripción de la Cirugía</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ej: ARTROTOMIA DE CODO SOD"
                                                    value={descripcionCirugia}
                                                    onChange={(e) => {
                                                        setDescripcionCirugia(e.target.value.toUpperCase());
                                                        if (e.target.value.length >= 3) {
                                                            buscarCirugia(e.target.value, false);
                                                        } else {
                                                            setSugerenciasCirugia([]);
                                                        }
                                                    }}
                                                    onBlur={() => setTimeout(() => setSugerenciasCirugia([]), 200)}
                                                />
                                                {(sugerenciasCirugia.length > 0 || (buscandoCirugia && descripcionCirugia.length >= 3)) && (
                                                    <div className="position-absolute w-100 bg-white border rounded-bottom shadow-sm" style={{top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                                                        {buscandoCirugia && sugerenciasCirugia.length === 0 && (
                                                            <div className="p-3 text-center text-muted">
                                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                    <span className="visually-hidden">Buscando...</span>
                                                                </div>
                                                                Buscando cirugías...
                                                            </div>
                                                        )}
                                                        {sugerenciasCirugia.map((cirugia) => (
                                                            <div 
                                                                key={cirugia.id}
                                                                className="p-2 cursor-pointer hover-bg-light"
                                                                style={{cursor: 'pointer'}}
                                                                onClick={() => seleccionarCirugia(cirugia)}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                            >
                                                                <small className="d-block">
                                                                    <strong>{cirugia.codigo}</strong> - {cirugia.descripcion}
                                                                    <span className="text-muted ms-2">({cirugia.uvr ? parseFloat(cirugia.uvr.toString()).toFixed(0) : 'Sin UVR'} UVR)</span>
                                                                </small>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>UVR de la Cirugía <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Ej: 80"
                                                value={uvrCirugia}
                                                onChange={(e) => setUvrCirugia(e.target.value)}
                                                readOnly={buscandoCirugia}
                                                className={uvrCirugia ? 'bg-light' : ''}
                                            />
                                            {uvrCirugia && (
                                                <small className="text-success">Valor cargado automáticamente del ISS 2001</small>
                                            )}
                                        </Col>
                                        
                                        {/* Configuración del contrato */}
                                        <Col md={3}>
                                            <Form.Label>Contrato ISS 2001</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text">ISS 2001 +</span>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="0"
                                                    value={porcentajeContratoISS}
                                                    onChange={(e) => setPorcentajeContratoISS(e.target.value)}
                                                />
                                                <span className="input-group-text">%</span>
                                            </div>
                                            <small className="text-muted">Ej: 50 para ISS + 50%</small>
                                        </Col>
                                        
                                        {/* Tipo de especialista */}
                                        <Col md={3}>
                                            <Form.Label>Participación de Cirujano</Form.Label>
                                            <Form.Select 
                                                value={tipoEspecialista}
                                                onChange={(e) => setTipoEspecialista(e.target.value as any)}
                                            >
                                                <option value="especialista">Cirujano Especialista</option>
                                                <option value="general">Médico General</option>
                                            </Form.Select>
                                        </Col>
                                        
                                        {/* Tipo de anestesia */}
                                        <Col md={3}>
                                            <Form.Label>Participación de Anestesiólogo</Form.Label>
                                            <Form.Select
                                                value={tipoAnestesia}
                                                onChange={(e) => setTipoAnestesia(e.target.value as any)}
                                            >
                                                <option value="general_regional">Anestesia General o Regional</option>
                                                <option value="local">Anestesia Local</option>
                                                <option value="sin_anestesia">Sin Anestesia</option>
                                            </Form.Select>
                                        </Col>
                                        
                                        {/* Ayudante */}
                                        <Col md={3}>
                                            <Form.Label>Participación de Ayudante</Form.Label>
                                            <Form.Select
                                                value={hayAyudante ? 'si' : 'no'}
                                                onChange={(e) => setHayAyudante(e.target.value === 'si')}
                                            >
                                                <option value="si">Hubo ayudante quirúrgico</option>
                                                <option value="no">Sin ayudante quirúrgico</option>
                                            </Form.Select>
                                        </Col>
                                        
                                        {/* Tipo de sala */}
                                        <Col md={4}>
                                            <Form.Label>Tipo de Sala</Form.Label>
                                            <Form.Select
                                                value={tipoSala}
                                                onChange={(e) => setTipoSala(e.target.value as any)}
                                            >
                                                <option value="quirofano">Sala de cirugía (quirófanos) y de parto</option>
                                                <option value="procedimientos_especial">Sala de procedimientos especial</option>
                                                <option value="procedimientos_basica">Sala de procedimientos básica</option>
                                            </Form.Select>
                                        </Col>
                                        
                                        {/* Artículo 134 */}
                                        <Col md={4}>
                                            <Form.Label>¿Aplica el incremento del artículo 134?</Form.Label>
                                            <Form.Select
                                                value={aplicaArticulo134 ? 'si' : 'no'}
                                                onChange={(e) => setAplicaArticulo134(e.target.value === 'si')}
                                            >
                                                <option value="no">NO aplica</option>
                                                <option value="si">SI aplica</option>
                                            </Form.Select>
                                        </Col>
                                        
                                        {/* Botón calcular */}
                                        <Col md={4}>
                                            <Form.Label>&nbsp;</Form.Label>
                                            <div>
                                                <SpkButton
                                                    Buttonvariant="primary"
                                                    Buttontype="button"
                                                    Customclass="w-100"
                                                    onClick={() => calcularLiquidacionCirugia()}
                                                    disabled={!codigoCirugia || !uvrCirugia}
                                                >
                                                    <i className="bi bi-calculator me-2"></i>
                                                    Calcular Cirugía
                                                </SpkButton>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Resultados de la liquidación */}
                    {(() => {
                        const liquidacion = calcularLiquidacionCirugia();
                        if (!liquidacion) return null;
                        
                        return (
                            <Col xl={12}>
                                <Card className="custom-card">
                                    <Card.Header className="bg-primary text-white">
                                        <div className="card-title text-white">
                                            Liquidación de Cirugía
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <h5 className="fw-bold">{liquidacion.codigo} - {liquidacion.descripcion || 'PROCEDIMIENTO QUIRÚRGICO'}</h5>
                                                <p className="mb-2">
                                                    <strong>UVR:</strong> {liquidacion.uvr} | 
                                                    <strong className="ms-2">Contrato:</strong> ISS 2001 {porcentajeContratoISS > '0' ? `+ ${porcentajeContratoISS}%` : 'pleno'}
                                                </p>
                                            </Col>
                                            <Col md={6} className="text-end">
                                                <h3 className="text-primary fw-bold">
                                                    Total Cirugía: ${liquidacion.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                </h3>
                                            </Col>
                                        </Row>
                                        
                                        <div className="table-responsive">
                                            <SpkTables 
                                                tableClass="text-nowrap" 
                                                header={[
                                                    { title: 'Código' },
                                                    { title: 'Concepto' },
                                                    { title: 'Descripción' },
                                                    { title: '%' },
                                                    { title: 'Total' }
                                                ]}
                                            >
                                                {liquidacion.componentes.map((componente, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <SpkBadge variant="" Customclass="bg-primary-transparent">
                                                                {componente.codigo}
                                                            </SpkBadge>
                                                        </td>
                                                        <td className="fw-semibold">{componente.concepto}</td>
                                                        <td className="text-muted">{componente.descripcion}</td>
                                                        <td>{componente.porcentaje}%</td>
                                                        <td className="fw-bold text-primary">
                                                            ${componente.valor.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </SpkTables>
                                        </div>
                                        
                                        <div className="mt-3">
                                            <div className="alert alert-success">
                                                <i className="bi bi-check-circle me-2"></i>
                                                <strong>Liquidación calculada según Manual Tarifario ISS 2001 - Acuerdo 256 de 2001</strong>
                                                <p className="mb-0 mt-2 text-muted">
                                                    Los valores incluyen todos los componentes según el tipo de cirugía y configuración seleccionada.
                                                </p>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })()}
                </Row>
            )}

            {/* <!-- End:: row-2 --> */}


            {/* <!-- Start:: row-3 - Tablas Dinámicas --> */}

            {selectedView === 'comparativo' && (
            <Row>
                <Col xl={12}>
                    <Card className="custom-card overflow-hidden">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                {tableMode === 'iss' && '📘 Manual Tarifario ISS 2001 - Mínimo Nacional'}
                                {tableMode === 'soat' && '📙 Manual Tarifario SOAT 2025 - Máximo Nacional'} 
                                {tableMode === 'comparar' && '⚖️ Comparación Directa de Códigos Seleccionados'}
                            </div>
                            <div className="d-flex gap-2">
                                {tableMode !== 'comparar' && (
                                    <SpkBadge variant="" Customclass={`${tableMode === 'iss' ? 'bg-success' : 'bg-warning'} text-white`}>
                                        {tableMode === 'iss' ? issData?.count.toLocaleString() : soatData?.count.toLocaleString()} códigos
                                    </SpkBadge>
                                )}
                                <SpkButton 
                                    Buttonvariant="info-light"
                                    Buttontype="button"
                                    Customclass="btn-sm"
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i>
                                    Exportar {tableMode.toUpperCase()}
                                </SpkButton>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                
                                {/* TABLA ISS 2001 */}
                                {tableMode === 'iss' && (
                                    <SpkTables tableClass="text-nowrap" header={[
                                        { title: 'Código CUPS' }, 
                                        { title: 'Descripción' }, 
                                        { title: 'UVR' }, 
                                        { title: 'Valor ISS 2001' }, 
                                        { title: 'Tipo' }, 
                                        { title: 'Contratos' },
                                        { title: 'Acciones' }
                                    ]}>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="text-center p-4">
                                                    <div className="spinner-border text-success" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                    <p className="mt-2 text-muted">Cargando tarifario ISS 2001...</p>
                                                </td>
                                            </tr>
                                        ) : issData ? (
                                            issData.results.map((issItem) => (
                                                <tr key={issItem.id}>
                                                    <td className="fw-medium text-success">
                                                        {issItem.codigo}
                                                    </td>
                                                    <td>
                                                        <div className="flex-fill lh-1">
                                                            <span className="d-block mb-1 fs-14 fw-medium">
                                                                {issItem.descripcion.length > 60 ? 
                                                                 `${issItem.descripcion.substring(0, 60)}...` : 
                                                                 issItem.descripcion}
                                                            </span>
                                                            <span className="d-block fs-12 text-muted">
                                                                Manual ISS 2001 - Acuerdo 256
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {issItem.uvr ? (
                                                            <SpkBadge variant="" Customclass="bg-success-transparent">
                                                                {parseInt(parseFloat(issItem.uvr).toString())}
                                                            </SpkBadge>
                                                        ) : (
                                                            <span className="text-muted">Fija</span>
                                                        )}
                                                    </td>
                                                    <td className="text-success fw-semibold fs-15">
                                                        ${(issItem.valor_referencia_actual || 0).toLocaleString('es-CO')}
                                                    </td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass="bg-primary-transparent">
                                                            {issItem.tipo}
                                                        </SpkBadge>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="fw-semibold">{issItem.contratos_activos}</span>
                                                        <small className="d-block text-muted">activos</small>
                                                    </td>
                                                    <td>
                                                        <div className="btn-list">
                                                            <SpkTooltips placement="top" title="Seleccionar para comparar">
                                                                <button 
                                                                    className={`btn btn-icon btn-sm ${selectedISSForCompare?.codigo === issItem.codigo ? 'btn-success' : 'btn-success-light'}`}
                                                                    onClick={() => setSelectedISSForCompare(issItem)}
                                                                >
                                                                    <i className={`bi ${selectedISSForCompare?.codigo === issItem.codigo ? 'bi-check-square' : 'bi-square'}`}></i>
                                                                </button>
                                                            </SpkTooltips>
                                                            <SpkTooltips placement="top" title="Validar Tarifa">
                                                                <button 
                                                                    className="btn btn-icon btn-info-light btn-sm"
                                                                    onClick={() => {
                                                                        setSelectedView('calculadora');
                                                                        selectCodeForComparison(issItem.codigo);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-calculator"></i>
                                                                </button>
                                                            </SpkTooltips>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="text-center p-4">
                                                    <p className="text-muted">No hay datos disponibles</p>
                                                </td>
                                            </tr>
                                        )}
                                    </SpkTables>
                                )}

                                {/* TABLA SOAT 2025 */}
                                {tableMode === 'soat' && (
                                    <SpkTables tableClass="text-nowrap" header={[
                                        { title: 'Código CUPS' }, 
                                        { title: 'Descripción' }, 
                                        { title: 'UVB' }, 
                                        { title: 'Valor SOAT 2025' }, 
                                        { title: 'Grupo Q.' }, 
                                        { title: 'Sección' },
                                        { title: 'Tipo' },
                                        { title: 'Acciones' }
                                    ]}>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={8} className="text-center p-4">
                                                    <div className="spinner-border text-warning" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                    <p className="mt-2 text-muted">Cargando tarifario SOAT 2025...</p>
                                                </td>
                                            </tr>
                                        ) : soatData ? (
                                            soatData.results.map((soatItem) => (
                                                <tr key={soatItem.id}>
                                                    <td className="fw-medium text-warning">
                                                        {soatItem.codigo}
                                                    </td>
                                                    <td>
                                                        <div className="flex-fill lh-1">
                                                            <span className="d-block mb-1 fs-14 fw-medium">
                                                                {soatItem.descripcion.length > 60 ? 
                                                                 `${soatItem.descripcion.substring(0, 60)}...` : 
                                                                 soatItem.descripcion}
                                                            </span>
                                                            <span className="d-block fs-12 text-muted">
                                                                Manual SOAT 2025 - Res. 2284/2023
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {soatItem.uvb ? (
                                                            <SpkBadge variant="" Customclass="bg-warning-transparent">
                                                                {soatItem.uvb}
                                                            </SpkBadge>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>
                                                    <td className="text-warning fw-semibold fs-15">
                                                        ${(soatItem.valor_referencia_actual || 0).toLocaleString('es-CO')}
                                                    </td>
                                                    <td className="text-center">
                                                        {soatItem.grupo_quirurgico ? (
                                                            <SpkBadge variant="" Customclass="bg-secondary-transparent">
                                                                {soatItem.grupo_quirurgico}
                                                            </SpkBadge>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <small className="text-muted">
                                                            {soatItem.seccion_manual ? 
                                                             soatItem.seccion_manual.substring(0, 30) + '...' : 
                                                             'Sin sección'}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <SpkBadge variant="" Customclass="bg-info-transparent">
                                                            {soatItem.tipo}
                                                        </SpkBadge>
                                                    </td>
                                                    <td>
                                                        <div className="btn-list">
                                                            <SpkTooltips placement="top" title="Seleccionar para comparar">
                                                                <button 
                                                                    className={`btn btn-icon btn-sm ${selectedSOATForCompare?.codigo === soatItem.codigo ? 'btn-warning' : 'btn-warning-light'}`}
                                                                    onClick={() => setSelectedSOATForCompare(soatItem)}
                                                                >
                                                                    <i className={`bi ${selectedSOATForCompare?.codigo === soatItem.codigo ? 'bi-check-square' : 'bi-square'}`}></i>
                                                                </button>
                                                            </SpkTooltips>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="text-center p-4">
                                                    <p className="text-muted">No hay datos disponibles</p>
                                                </td>
                                            </tr>
                                        )}
                                    </SpkTables>
                                )}

                                {/* TABLA COMPARACIÓN */}
                                {tableMode === 'comparar' && selectedISSForCompare && selectedSOATForCompare && (
                                    <div className="p-4">
                                        <Row className="g-4">
                                            <Col md={5}>
                                                <Card className="border-success">
                                                    <Card.Header className="bg-success-transparent">
                                                        <h6 className="text-success mb-0">📘 ISS 2001 - Mínimo Nacional</h6>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <h5 className="text-success fw-bold">{selectedISSForCompare.codigo}</h5>
                                                        <p className="mb-3">{selectedISSForCompare.descripcion}</p>
                                                        <div className="mb-3">
                                                            <h4 className="text-success fw-bold">${(selectedISSForCompare.valor_referencia_actual || 0).toLocaleString('es-CO')}</h4>
                                                            <small className="text-muted">
                                                                {selectedISSForCompare.uvr ? `UVR: ${parseInt(parseFloat(selectedISSForCompare.uvr).toString())}` : 'Tarifa fija'}
                                                            </small>
                                                        </div>
                                                        <SpkBadge variant="" Customclass="bg-primary-transparent me-2">
                                                            {selectedISSForCompare.tipo}
                                                        </SpkBadge>
                                                        <SpkBadge variant="" Customclass="bg-info-transparent">
                                                            {selectedISSForCompare.contratos_activos} contratos
                                                        </SpkBadge>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={2} className="d-flex align-items-center justify-content-center">
                                                <div className="text-center">
                                                    <i className="bi bi-arrows-angle-expand fs-1 text-primary"></i>
                                                    <div className="mt-2">
                                                        {(() => {
                                                            const diferencia = ((selectedSOATForCompare.valor_referencia_actual || 0) - (selectedISSForCompare.valor_referencia_actual || 0)) / (selectedISSForCompare.valor_referencia_actual || 1) * 100;
                                                            return (
                                                                <SpkBadge variant="" Customclass={diferencia > 100 ? "bg-danger" : diferencia > 50 ? "bg-warning" : "bg-success"}>
                                                                    {diferencia > 0 ? '+' : ''}{diferencia.toFixed(1)}%
                                                                </SpkBadge>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={5}>
                                                <Card className="border-warning">
                                                    <Card.Header className="bg-warning-transparent">
                                                        <h6 className="text-warning mb-0">📙 SOAT 2025 - Máximo Nacional</h6>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <h5 className="text-warning fw-bold">{selectedSOATForCompare.codigo}</h5>
                                                        <p className="mb-3">{selectedSOATForCompare.descripcion}</p>
                                                        <div className="mb-3">
                                                            <h4 className="text-warning fw-bold">${(selectedSOATForCompare.valor_referencia_actual || 0).toLocaleString('es-CO')}</h4>
                                                            <small className="text-muted">
                                                                {selectedSOATForCompare.uvb ? `UVB: ${selectedSOATForCompare.uvb}` : 'Sin UVB'}
                                                            </small>
                                                        </div>
                                                        <SpkBadge variant="" Customclass="bg-info-transparent me-2">
                                                            {selectedSOATForCompare.tipo}
                                                        </SpkBadge>
                                                        {selectedSOATForCompare.grupo_quirurgico && (
                                                            <SpkBadge variant="" Customclass="bg-secondary-transparent">
                                                                Grupo {selectedSOATForCompare.grupo_quirurgico}
                                                            </SpkBadge>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <div className="mt-4 p-3 bg-light rounded">
                                            <Row className="text-center">
                                                <Col md={3}>
                                                    <h6 className="text-muted">Valor ISS</h6>
                                                    <h5 className="text-success">${(selectedISSForCompare.valor_referencia_actual || 0).toLocaleString('es-CO')}</h5>
                                                </Col>
                                                <Col md={3}>
                                                    <h6 className="text-muted">Valor SOAT</h6>
                                                    <h5 className="text-warning">${(selectedSOATForCompare.valor_referencia_actual || 0).toLocaleString('es-CO')}</h5>
                                                </Col>
                                                <Col md={3}>
                                                    <h6 className="text-muted">Diferencia Absoluta</h6>
                                                    <h5 className="text-primary">${((selectedSOATForCompare.valor_referencia_actual || 0) - (selectedISSForCompare.valor_referencia_actual || 0)).toLocaleString('es-CO')}</h5>
                                                </Col>
                                                <Col md={3}>
                                                    <h6 className="text-muted">Rango Válido</h6>
                                                    <SpkBadge variant="" Customclass="bg-success-transparent">
                                                        Entre los dos límites
                                                    </SpkBadge>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </Card.Body>
                        
                        {tableMode !== 'comparar' && (
                            <Card.Footer className="">
                                <div className="d-flex align-items-center">
                                    <div>
                                        Mostrando {Math.min(20, (tableMode === 'iss' ? issData?.results.length : soatData?.results.length) || 0)} de {(tableMode === 'iss' ? issData?.count : soatData?.count)?.toLocaleString() || 0} códigos
                                        <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                                    </div>
                                    <div className="ms-auto">
                                        <nav aria-label="Page navigation" className="pagination-style-4">
                                            <Pagination className="mb-0">
                                                <Pagination.Prev 
                                                    disabled={currentPage <= 1} 
                                                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                                >
                                                    Anterior
                                                </Pagination.Prev>
                                                <Pagination.Item active>{currentPage}</Pagination.Item>
                                                {((tableMode === 'iss' ? issData : soatData) && currentPage < Math.ceil(((tableMode === 'iss' ? issData?.count : soatData?.count) || 0) / 20)) && (
                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                                                        {currentPage + 1}
                                                    </Pagination.Item>
                                                )}
                                                <Pagination.Next 
                                                    className="text-primary"
                                                    disabled={!(tableMode === 'iss' ? issData : soatData) || currentPage >= Math.ceil(((tableMode === 'iss' ? issData?.count : soatData?.count) || 0) / 20)}
                                                    onClick={() => {
                                                        const data = tableMode === 'iss' ? issData : soatData;
                                                        if (data && currentPage < Math.ceil((data.count || 0) / 20)) {
                                                            setCurrentPage(currentPage + 1);
                                                        }
                                                    }}
                                                >
                                                    Siguiente
                                                </Pagination.Next>
                                            </Pagination>
                                        </nav>
                                    </div>
                                </div>
                            </Card.Footer>
                        )}
                    </Card>
                </Col>
            </Row>
            )}

            {/* <!-- End:: row-3 --> */}

        </Fragment>
    )
};

export default TarifariosOficiales;