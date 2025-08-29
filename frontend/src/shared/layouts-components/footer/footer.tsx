
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

interface FooterProps { }

const Footer: React.FC<FooterProps> = () => {

  return (
    <Fragment>

      {/* <!-- Footer Start --> */}

      <footer className="footer mt-auto py-3 text-center">
        <div className="container">
          <span className="text-muted"> Copyright © <span id="year"> 2025 </span> <Link 
            to="#!" className="text-dark fw-medium">Neuralytic</Link>.
            Desarrollado con <span className="bi bi-heart-fill text-danger"></span> por <Link target='_blank' to="https://analiticaneuronal.com/">
              <span className="fw-medium text-primary">Analítica Neuronal</span>
            </Link> Todos
            los derechos
            reservados
          </span>
        </div>
      </footer>

      {/* <!-- Footer End --> */}

    </Fragment>
  )
}

export default Footer;