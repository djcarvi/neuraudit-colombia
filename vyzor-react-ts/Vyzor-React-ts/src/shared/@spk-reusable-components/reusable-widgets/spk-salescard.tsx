

import { Fragment } from "react";
import Spkapexcharts from "../reusable-plugins/spk-apexcharts";

interface SalesCardProps {
    sales: {
        color: string;
        svgIcon: React.ReactNode;
        title: string;
        value: string | number;
        inc: string;
        id: string;
        chartOptions: any;
        chartSeries: any;
        height?: number | string;
        width?: number | string;
        type: string;
    };
};

const SpkSalesCard: React.FC<SalesCardProps> = ({ sales }) => {

    return (
        <Fragment>
            <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="card custom-card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div className="mb-2">
                                <span className={`avatar avatar-md bg-${sales.color}-transparent svg-${sales.color}`}>
                                    {sales.svgIcon}
                                </span>
                            </div>
                            <span className="fs-16">{sales.title}</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="fs-20 fw-medium mb-0 d-flex align-items-center">
                                    {sales.value}
                                </span>
                                <span className="fs-13 text-muted">{sales.inc}</span>
                            </div>
                            <div id={sales.id}>
                                <Spkapexcharts chartOptions={sales.chartOptions} chartSeries={sales.chartSeries} height={sales.height} width={sales.width} type={sales.type} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SpkSalesCard;
