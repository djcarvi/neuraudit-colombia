
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
            to="#!" className="text-dark fw-medium">Vyzor</Link>.
            Designed with <span className="bi bi-heart-fill text-danger"></span> by <Link  target='_blank' to="https://spruko.com/">
              <span className="fw-medium text-primary">Spruko</span>
            </Link> All
            rights
            reserved
          </span>
        </div>
      </footer>

      {/* <!-- Footer End --> */}

    </Fragment>
  )
}

export default Footer;