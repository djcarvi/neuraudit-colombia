import { Fragment } from "react";
import { Card, Image, ProgressBar } from "react-bootstrap";
import SpkButton from "../../general-reusable/reusable-uielements/spk-buttons";

import SpkBadge from "../../general-reusable/reusable-uielements/spk-badge";
import { Link, useNavigate } from "react-router-dom";
import contrato_icon from '../../../../assets/images/brand-logos/toggle-logo.png';

interface Devolucion {
    id: string;
    numero_devolucion: string;
    radicacion: any;
    prestador: any;
    causal_codigo: string;
    causal_descripcion: string;
    fecha_devolucion: string;
    fecha_limite_respuesta: string;
    valor_devuelto: number;
    estado: string;
    dias_restantes_respuesta?: number;
    facturas_afectadas?: number;
}

interface SpkDevolucionCardProps {
    devolucion: Devolucion;
}

const SpkDevolucionCard: React.FC<SpkDevolucionCardProps> = ({ devolucion }) => {
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
            'PENDIENTE': { class: 'warning', label: 'Pendiente' },
            'EN_RESPUESTA': { class: 'info', label: 'En Respuesta PSS' },
            'ACEPTADA': { class: 'success', label: 'Aceptada' },
            'RECHAZADA': { class: 'danger', label: 'Rechazada' }
        };
        const estadoInfo = estados[estado] || { class: 'secondary', label: estado };
        return estadoInfo;
    };

    const getCausalIcon = (causal: string) => {
        const icons: Record<string, string> = {
            'DE16': 'ri-user-unfollow-line',
            'DE44': 'ri-hospital-line',
            'DE50': 'ri-refund-line',
            'DE56': 'ri-timer-line'
        };
        return icons[causal] || 'ri-error-warning-line';
    };

    const calculateProgress = () => {
        if (!devolucion.fecha_devolucion || !devolucion.fecha_limite_respuesta) return 0;
        const inicio = new Date(devolucion.fecha_devolucion);
        const limite = new Date(devolucion.fecha_limite_respuesta);
        const hoy = new Date();
        
        const plazoTotal = limite.getTime() - inicio.getTime();
        const tiempoTranscurrido = hoy.getTime() - inicio.getTime();
        const porcentaje = Math.min(100, Math.max(0, (tiempoTranscurrido / plazoTotal) * 100));
        
        return Math.round(porcentaje);
    };

    const estadoInfo = getEstadoBadge(devolucion.estado);
    const progress = calculateProgress();
    const causalIcon = getCausalIcon(devolucion.causal_codigo);

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
                            <i className={`${causalIcon} me-1 align-middle d-inline-block`}></i>
                            {devolucion.causal_codigo}
                        </SpkBadge>
                    </div>
                    <p className="mb-0 nft-auction-time">
                        {devolucion.dias_restantes_respuesta !== undefined && devolucion.dias_restantes_respuesta > 0 
                            ? `${devolucion.dias_restantes_respuesta} días` 
                            : 'Vencido'}
                    </p>
                </div>
                <div className="card-body p-2 grid-cards">
                    <div className="text-center p-3 bg-light rounded mb-3">
                        <h5 className="mb-0 text-primary">{devolucion.numero_devolucion}</h5>
                    </div>
                    <div className="p-2">
                        <div className="mb-3">
                            <Link to={`${import.meta.env.BASE_URL}neuraudit/devoluciones/${devolucion.id}`}>
                                <h6 className="fw-semibold mb-1 text-truncate">{devolucion.prestador?.razon_social || 'N/A'}</h6>
                            </Link>
                            <span className="fs-13 text-muted fw-medium">
                                {devolucion.causal_descripcion}
                            </span>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="fs-12 text-muted">Plazo Respuesta</span>
                                <span className="fs-12">{progress}%</span>
                            </div>
                            <ProgressBar 
                                now={progress} 
                                className="progress-xs"
                                variant={devolucion.dias_restantes_respuesta && devolucion.dias_restantes_respuesta <= 1 ? 'danger' : devolucion.dias_restantes_respuesta && devolucion.dias_restantes_respuesta <= 3 ? 'warning' : 'info'}
                            />
                            <div className="d-flex justify-content-between mt-1">
                                <span className="fs-11 text-muted">{new Date(devolucion.fecha_devolucion).toLocaleDateString('es-CO')}</span>
                                <span className="fs-11 text-muted">{new Date(devolucion.fecha_limite_respuesta).toLocaleDateString('es-CO')}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
                            <div className="flex-fill">
                                <span className="text-muted fs-12 d-block mb-1">Valor Devuelto</span>
                                <div className="d-flex align-items-center gap-2 fw-semibold">
                                    <div className="lh-1">
                                        <span className="avatar avatar-xs avatar-rounded">
                                            <i className="ri-money-dollar-circle-line fs-16"></i>
                                        </span>
                                    </div>
                                    <div>{formatCurrency(devolucion.valor_devuelto)}</div>
                                </div>
                            </div>
                            <div>
                                <SpkButton 
                                    Buttonvariant="primary" 
                                    Customclass="btn"
                                    onClickfunc={() => navigate(`${import.meta.env.BASE_URL}neuraudit/devoluciones/${devolucion.id}`)}
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

export default SpkDevolucionCard;