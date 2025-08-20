
import { Fragment } from "react";

interface ProductCardProps  {
    products: {
      color: string;
      svgIcon: React.ReactNode;
      title: string;
      value: string | number;
      percentage: string;
      percentageColor: string;
    };
  };
  

const SpkProductscard: React.FC<ProductCardProps> = ({ products }) => {
  return (
    <Fragment>
      <div className="col-xxl-2 col-xl-3 col-lg-4 col-md-6">
        <div className="text-center">
          <div className="lh-1 mb-3">
            <span className={`avatar avatar-lg bg-${products.color}-transparent avatar-rounded`}>
              <span className={`avatar avatar-sm bg-${products.color} avatar-rounded svg-white`}>
                {products.svgIcon}
              </span>
            </span>
          </div>
          <span className="d-block mb-1">{products.title}</span>
          <h5 className="fw-semibold">{products.value}</h5>
          {products.percentage && (
            <div className="fs-13">
              <span className={`text-${products.percentageColor} me-1`}>{products.percentage}</span>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default SpkProductscard;
