import { Fragment } from "react";
import { Card, Image, ProgressBar } from "react-bootstrap";
import SpkButton from "../../general-reusable/reusable-uielements/spk-buttons";

import SpkBadge from "../../general-reusable/reusable-uielements/spk-badge";
import { Link, useNavigate } from "react-router-dom";
import contrato_icon from '../../../../assets/images/brand-logos/toggle-logo.png';

interface Contrato {
    id: string;
    numero_contrato: string;
    prestador: any;
    modalidad_principal: any;
    fecha_inicio: string;
    fecha_fin: string;
    valor_total: number;
    valor_mensual?: number;
    estado: string;
    dias_restantes?: number;
    servicios_contratados?: string[];
}

interface SpkContratoCardProps {
    contrato: Contrato;
}

const SpkContratoCard: React.FC<SpkContratoCardProps> = ({ contrato }) => {
    const navigate = useNavigate();
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getEstadoBadge = (estado: string) => {
        const estados: Record<string, { class: string; label: string }> = {
            'VIGENTE': { class: 'success', label: 'Vigente' },
            'POR_VENCER': { class: 'warning', label: 'Por Vencer' },
            'VENCIDO': { class: 'danger', label: 'Vencido' },
            'POR_INICIAR': { class: 'primary', label: 'Por Iniciar' }
        };
        const estadoInfo = estados[estado] || { class: 'secondary', label: estado };
        return estadoInfo;
    };

    const getModalidadIcon = (modalidad: any) => {
        const modalidadCodigo = typeof modalidad === 'string' ? modalidad : modalidad?.codigo || '';
        const icons: Record<string, string> = {
            'EVENTO': 'ri-calendar-event-line',
            'CAPITACION': 'ri-group-line',
            'PGP': 'ri-funds-line',
            'PAQUETE': 'ri-archive-line'
        };
        return icons[modalidadCodigo] || 'ri-file-line';
    };

    const calculateProgress = () => {
        if (!contrato.fecha_inicio || !contrato.fecha_fin) return 0;
        const inicio = new Date(contrato.fecha_inicio);
        const fin = new Date(contrato.fecha_fin);
        const hoy = new Date();
        
        const duracionTotal = fin.getTime() - inicio.getTime();
        const tiempoTranscurrido = hoy.getTime() - inicio.getTime();
        const porcentaje = Math.min(100, Math.max(0, (tiempoTranscurrido / duracionTotal) * 100));
        
        return Math.round(porcentaje);
    };

    const estadoInfo = getEstadoBadge(contrato.estado);
    const progress = calculateProgress();
    const modalidadIcon = getModalidadIcon(contrato.modalidad_principal);

    return (
        <Fragment>
            <Card className="custom-card">
                <div className="d-flex align-items-center justify-content-between nft-like-section w-100 px-3">
                    <div className="flex-fill">
                        <SpkBadge variant="" Customclass={`bg-${estadoInfo.class}-transparent`}>
                            {estadoInfo.label}
                        </SpkBadge>
                    </div>
                    <div>
                        <SpkBadge variant="" Customclass="nft-like-badge text-default">
                            <i className={`${modalidadIcon} me-1 align-middle d-inline-block`}></i>
                            {contrato.modalidad_principal?.nombre || contrato.modalidad_principal?.codigo || ''}
                        </SpkBadge>
                    </div>
                    <p className="mb-0 nft-auction-time">
                        {contrato.dias_restantes !== undefined && contrato.dias_restantes > 0 
                            ? `${contrato.dias_restantes} días` 
                            : 'Vencido'}
                    </p>
                </div>
                <div className="card-body p-2 grid-cards">
                    <div className="text-center p-3 bg-light rounded mb-3">
                        <h5 className="mb-0 text-primary">{contrato.numero_contrato}</h5>
                    </div>
                    <div className="p-2">
                        <div className="mb-3">
                            <Link to={`${import.meta.env.BASE_URL}neuraudit/contratacion/contratos/${contrato.id}`}>
                                <h6 className="fw-semibold mb-1 text-truncate">{contrato.prestador?.razon_social || 'N/A'}</h6>
                            </Link>
                            <span className="fs-13 text-muted fw-medium">
                                NIT: {contrato.prestador?.nit || 'N/A'}
                            </span>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="fs-12 text-muted">Vigencia</span>
                                <span className="fs-12">{progress}%</span>
                            </div>
                            <ProgressBar 
                                now={progress} 
                                className="progress-xs"
                                variant={contrato.dias_restantes && contrato.dias_restantes < 30 ? 'danger' : contrato.dias_restantes && contrato.dias_restantes < 90 ? 'warning' : 'success'}
                            />
                            <div className="d-flex justify-content-between mt-1">
                                <span className="fs-11 text-muted">{new Date(contrato.fecha_inicio).toLocaleDateString('es-CO')}</span>
                                <span className="fs-11 text-muted">{new Date(contrato.fecha_fin).toLocaleDateString('es-CO')}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
                            <div className="flex-fill">
                                <span className="text-muted fs-12 d-block mb-1">Valor Total</span>
                                <div className="d-flex align-items-center gap-2 fw-semibold">
                                    <div className="lh-1">
                                        <span className="avatar avatar-xs avatar-rounded">
                                            <i className="ri-money-dollar-circle-line fs-16"></i>
                                        </span>
                                    </div>
                                    <div>{formatCurrency(contrato.valor_total)}</div>
                                </div>
                            </div>
                            <div>
                                <SpkButton 
                                    Buttonvariant="primary" 
                                    Customclass="btn"
                                    onClickfunc={() => navigate(`${import.meta.env.BASE_URL}neuraudit/contratacion/contratos/${contrato.id}`)}
                                >
                                    Ver Detalle
                                </SpkButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Fragment>
    );
};

export default SpkContratoCard;