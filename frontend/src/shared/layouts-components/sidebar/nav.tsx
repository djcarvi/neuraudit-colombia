


import SpkBadge from "../../@spk-reusable-components/general-reusable/reusable-uielements/spk-badge";
import * as Svgicons from "./menusvg-icons";

const badgePrimary = <SpkBadge variant="" Customclass="bg-primary-transparent ms-2">9</SpkBadge>
const badgeSucccess = <SpkBadge variant="" Customclass="bg-success-transparent ms-2">6</SpkBadge>
const badgeWarning = <SpkBadge variant="" Customclass="bg-warning-transparent ms-2">5</SpkBadge>
const badgeInfo = <SpkBadge variant="" Customclass="bg-info-transparent ms-2">4</SpkBadge>
const badgedanger = <SpkBadge variant="" Customclass="bg-danger-transparent ms-2">6</SpkBadge>
const badgeSuccess = <SpkBadge variant="" Customclass="bg-success-transparent ms-2">8</SpkBadge>

export const MENUITEMS: any = [

  {
     menutitle:'INICIO'
  },
  {
    title: "Dashboard", icon: Svgicons.Dashboardicon, type: "link", path: `${import.meta.env.BASE_URL}dashboards/sales`, active: false, selected: false, dirchange: false
  },
  {
     menutitle:'CONTRATACIÓN'
  },
  {
    title: "Contratación", icon: Svgicons.Nestedmenuicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/contratacion/prestadores`, type: "link", active: false, selected: false, dirchange: false, title: "Prestadores" },
      { path: `${import.meta.env.BASE_URL}neuraudit/contratacion/contratos`, type: "link", active: false, selected: false, dirchange: false, title: "Contratos" },
      { path: `${import.meta.env.BASE_URL}neuraudit/contratacion/tarifarios`, type: "link", active: false, selected: false, dirchange: false, title: "Tarifarios" },
    ]
  },
  {
     menutitle:'RADICACIÓN'
  },
  {
    title: "Radicación", icon: Svgicons.Pagesicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/radicacion/nueva`, type: "link", active: false, selected: false, dirchange: false, title: "Nueva Radicación" },
      { path: `${import.meta.env.BASE_URL}neuraudit/radicacion/consulta`, type: "link", active: false, selected: false, dirchange: false, title: "Consultar Radicaciones" },
      { path: `${import.meta.env.BASE_URL}neuraudit/devoluciones/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Devoluciones" },
    ]
  },
  {
     menutitle:'ASIGNACIÓN'
  },
  {
    title: "Asignación", icon: Svgicons.Generalicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/asignacion/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard Asignación" },
      { path: `${import.meta.env.BASE_URL}neuraudit/asignacion/manual`, type: "link", active: false, selected: false, dirchange: false, title: "Asignación Manual" },
    ]
  },
  {
     menutitle:'AUDITORÍA'
  },
  {
    title: "Auditoría", icon: Svgicons.Applicationicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/auditoria/medica`, type: "link", active: false, selected: false, dirchange: false, title: "Auditoría Médica" },
      { path: `${import.meta.env.BASE_URL}neuraudit/glosas/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Gestión de Glosas" },
      { path: `${import.meta.env.BASE_URL}neuraudit/trazabilidad/auditoria`, type: "link", active: false, selected: false, dirchange: false, title: "Trazabilidad" },
    ]
  },
  {
     menutitle:'CONCILIACIÓN'
  },
  {
    title: "Conciliación", icon: Svgicons.widgetsicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/conciliacion/casos`, type: "link", active: false, selected: false, dirchange: false, title: "Casos de Conciliación" },
      { path: `${import.meta.env.BASE_URL}neuraudit/conciliacion/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard Conciliación" },
    ]
  },
  {
     menutitle:'PAGOS'
  },
  {
    title: "Pagos", icon: Svgicons.Chartsicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/pagos/autorizacion`, type: "link", active: false, selected: false, dirchange: false, title: "Autorizar Pagos" },
      { path: `${import.meta.env.BASE_URL}neuraudit/pagos/historial`, type: "link", active: false, selected: false, dirchange: false, title: "Historial de Pagos" },
    ]
  },
  {
     menutitle:'CONFIGURACIÓN'
  },
  {
    title: "Configuración", icon: Svgicons.Mapsicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/configuracion/usuarios`, type: "link", active: false, selected: false, dirchange: false, title: "Usuarios" },
      { path: `${import.meta.env.BASE_URL}neuraudit/configuracion/perfiles`, type: "link", active: false, selected: false, dirchange: false, title: "Perfiles y Permisos" },
      { path: `${import.meta.env.BASE_URL}neuraudit/configuracion/catalogos`, type: "link", active: false, selected: false, dirchange: false, title: "Catálogos" },
      { path: `${import.meta.env.BASE_URL}neuraudit/alertas/configuracion`, type: "link", active: false, selected: false, dirchange: false, title: "Alertas" },
    ]
  },
  {
     menutitle:'REPORTES'
  },
  {
    title: "Reportes", icon: Svgicons.Tablesicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}neuraudit/reportes/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard Ejecutivo" },
      { path: `${import.meta.env.BASE_URL}neuraudit/reportes/financiero`, type: "link", active: false, selected: false, dirchange: false, title: "Reportes Financieros" },
      { path: `${import.meta.env.BASE_URL}neuraudit/reportes/operativo`, type: "link", active: false, selected: false, dirchange: false, title: "Reportes Operativos" },
    ]
  },
  
  // Original menu items temporarily hidden
  /*
  {
     menutitle:'MAIN'
  },
  {
    title: "Dashboards", icon: Svgicons.Dashboardicon, type: "sub", active: false, dirchange: false, children: [

      { path: `${import.meta.env.BASE_URL}dashboards/sales`, icon: Svgicons.Salesicon, type: "link", active: false, selected: false, dirchange: false, title: "Sales" },
      { path: `${import.meta.env.BASE_URL}dashboards/analytics`, icon: Svgicons.Analyticsicon, type: "link", active: false, selected: false, dirchange: false, title: "Analytics" },

      {
        title: "Ecommerce", type: "sub", badgetxt:badgePrimary, icon: Svgicons.Ecommerceicon, active: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/products`, type: "link", active: false, selected: false, dirchange: false, title: "Products" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/product-details`, type: "link", active: false, selected: false, dirchange: false, title: "Product Details" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/cart`, type: "link", active: false, selected: false, dirchange: false, title: "Cart" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/checkout`, type: "link", active: false, selected: false, dirchange: false, title: "Checkout" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/customers`, type: "link", active: false, selected: false, dirchange: false, title: "Customers" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/orders`, type: "link", active: false, selected: false, dirchange: false, title: "Orders" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/order-details`, type: "link", active: false, selected: false, dirchange: false, title: "Order Details" },
          { path: `${import.meta.env.BASE_URL}dashboards/ecommerce/add-product`, type: "link", active: false, selected: false, dirchange: false, title: "Add Product" },

        ]
      },
      {
        title: "Crypto", type: "sub", badgetxt:badgeSucccess, icon: Svgicons.Cryptoicon, active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}dashboards/crypto/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
          { path: `${import.meta.env.BASE_URL}dashboards/crypto/transactions`, type: "link", active: false, selected: false, dirchange: false, title: "Transactions" },
          { path: `${import.meta.env.BASE_URL}dashboards/crypto/currency-exchange`, type: "link", active: false, selected: false, dirchange: false, title: "Currency Exchange" },
          { path: `${import.meta.env.BASE_URL}dashboards/crypto/buy-sell`, type: "link", active: false, selected: false, dirchange: false, title: "Buy & Sell" },
          { path: `${import.meta.env.BASE_URL}dashboards/crypto/market-cap`, type: "link", active: false, selected: false, dirchange: false, title: "Marketcap" },
          { path: `${import.meta.env.BASE_URL}dashboards/crypto/wallet`, type: "link", active: false, selected: false, dirchange: false, title: "Wallet" },

        ],
      },
      {
        title: "CRM", type: "sub",  badgetxt:badgeWarning, icon: Svgicons.Crmicon, active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}dashboards/crm/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
          { path: `${import.meta.env.BASE_URL}dashboards/crm/contacts`, type: "link", active: false, selected: false, dirchange: false, title: "Contacts" },
          { path: `${import.meta.env.BASE_URL}dashboards/crm/companies`, type: "link", active: false, selected: false, dirchange: false, title: "Companies" },
          { path: `${import.meta.env.BASE_URL}dashboards/crm/deals`, type: "link", active: false, selected: false, dirchange: false, title: "Deals" },
          { path: `${import.meta.env.BASE_URL}dashboards/crm/leads`, type: "link", active: false, selected: false, dirchange: false, title: " Leads" },

        ],
      },
      {
        title: "Projects", type: "sub", badgetxt:badgeInfo, icon: Svgicons.Projectsicon, active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}dashboards/projects/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
          { path: `${import.meta.env.BASE_URL}dashboards/projects/projects-list`, type: "link", active: false, selected: false, dirchange: false, title: "Projects List" },
          { path: `${import.meta.env.BASE_URL}dashboards/projects/project-overview`, type: "link", active: false, selected: false, dirchange: false, title: "Project Overview" },
          { path: `${import.meta.env.BASE_URL}dashboards/projects/create-project`, type: "link", active: false, selected: false, dirchange: false, title: "Create Project" },

        ],
      },
      { path: `${import.meta.env.BASE_URL}dashboards/hrm`, type: "link", icon: Svgicons.Hrmicon, active: false, selected: false, dirchange: false, title: "HRM" },
      { path: `${import.meta.env.BASE_URL}dashboards/courses`, type: "link", active: false, icon:Svgicons.Courseicon, selected: false, dirchange: false, title: "Courses" },
      { path: `${import.meta.env.BASE_URL}dashboards/stocks`, type: "link", active: false, icon:Svgicons.Stockicon, selected: false, dirchange: false, title: "Stocks" },
      {
        title: "NFT", type: "sub", badgetxt:badgedanger, active: false, icon: Svgicons.Nfticon, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}dashboards/nft/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
          { path: `${import.meta.env.BASE_URL}dashboards/nft/market-place`, type: "link", active: false, selected: false, dirchange: false, title: "Market Place" },
          { path: `${import.meta.env.BASE_URL}dashboards/nft/nft-details`, type: "link", active: false, selected: false, dirchange: false, title: "NFT Details" },
          { path: `${import.meta.env.BASE_URL}dashboards/nft/create-nft`, type: "link", active: false, selected: false, dirchange: false, title: "Create NFT" },
          { path: `${import.meta.env.BASE_URL}dashboards/nft/wallet-integration`, type: "link", active: false, selected: false, dirchange: false, title: " Wallet Integration" },
          { path: `${import.meta.env.BASE_URL}dashboards/nft/live-auction`, type: "link", active: false, selected: false, dirchange: false, title: "Live Auction" },

        ],
      },
      {
        title: "Jobs", type: "sub", badgetxt:badgeSuccess, active: false, icon: Svgicons.Jobsicon, selected: false, children: [

          { path: `${import.meta.env.BASE_URL}dashboards/jobs/dashboard`, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/job-details`, type: "link", active: false, selected: false, dirchange: false, title: "Job Details" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/search-company`, type: "link", active: false, selected: false, dirchange: false, title: "Search Company" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/search-jobs`, type: "link", active: false, selected: false, dirchange: false, title: "Search Jobs" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/job-post`, type: "link", active: false, selected: false, dirchange: false, title: " Job Post" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/jobs-list`, type: "link", active: false, selected: false, dirchange: false, title: " Jobs List" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/search-candidate`, type: "link", active: false, selected: false, dirchange: false, title: " Search Candidate" },
          { path: `${import.meta.env.BASE_URL}dashboards/jobs/candidate-details`, type: "link", active: false, selected: false, dirchange: false, title: "Candidate Details" },

        ],
      },
      { path: `${import.meta.env.BASE_URL}dashboards/podcast`, type: "link", icon: Svgicons.Podcasticon, active: false, selected: false, dirchange: false, title: "Podcast" },
      { path: `${import.meta.env.BASE_URL}dashboards/social-media`, type: "link", icon: Svgicons.Socialicon, active: false, selected: false, dirchange: false, title: "Social Media" },
      { path: `${import.meta.env.BASE_URL}dashboards/school`, type: "link", icon: Svgicons.Schoolicon, active: false, selected: false, dirchange: false, title: "School" },
      { path: `${import.meta.env.BASE_URL}dashboards/medical`, type: "link", icon: Svgicons.Medicalicon, active: false, selected: false, dirchange: false, title: "Medical" },
      { path: `${import.meta.env.BASE_URL}dashboards/pos-system`, type: "link", icon: Svgicons.Posicon, active: false, selected: false, dirchange: false, title: "POS System" },
    ]
  },

  {
    menutitle:'WEB APPS'
 },

  {
    title: "Applications", icon: Svgicons.Applicationicon, type: "sub", active: false, selected: false, dirchange: false, children: [

      { path: `${import.meta.env.BASE_URL}applications/chat`, icon: Svgicons.Chaticon, type: "link", active: false, selected: false, dirchange: false, title: "Chat" },
      {
        title: "Email", type: "sub", icon: Svgicons.Emailicon, active: false, children: [

          { path: `${import.meta.env.BASE_URL}applications/email/mail-app`, type: "link", active: false, selected: false, dirchange: false, title: "Mail-App" },
          { path: `${import.meta.env.BASE_URL}applications/email/mail-settings`, type: "link", active: false, selected: false, dirchange: false, title: "Mail-Settings" },

        ]
      },
      { path: `${import.meta.env.BASE_URL}applications/file-manager`, icon: Svgicons.Fileicon, type: "link", active: false, selected: false, dirchange: false, title: "File Manager" },
      { path: `${import.meta.env.BASE_URL}applications/full-calendar`, icon: Svgicons.Fullicon, type: "link", active: false, selected: false, dirchange: false, title: "Full Calendar" },
      { path: `${import.meta.env.BASE_URL}applications/gallery`, type: "link", icon: Svgicons.Galleryicon, active: false, selected: false, dirchange: false, title: "Gallery" },
      { path: `${import.meta.env.BASE_URL}applications/sweet-alerts`, type: "link", icon: Svgicons.Sweeticon, active: false, selected: false, dirchange: false, title: "Sweet Alerts" },
      {
        title: "Task", type: "sub", icon: Svgicons.Taskicon, active: false, selected: false, dirchange: false, doublToggle: false, children: [

          { path: `${import.meta.env.BASE_URL}applications/task/kanban-board`, type: "link", active: false, selected: false, dirchange: false, title: "Kanban Board" },
          { path: `${import.meta.env.BASE_URL}applications/task/list-view`, type: "link", active: false, selected: false, dirchange: false, title: "List View" },

        ]
      },
      { path: `${import.meta.env.BASE_URL}applications/to-do-list`, icon: Svgicons.Todoicon, type: "link", active: false, selected: false, dirchange: false, title: "To Do List" },
    ],
  },

  {
    title: "Nested Menu", icon: Svgicons.Nestedmenuicon, selected: false, active: false, dirchange: false, type: "sub", children: [

      { path: `${import.meta.env.BASE_URL}`, title: "Nested-1", icon: Svgicons.Nested1icon, type: "empty", active: false, selected: false, dirchange: false},
      { title: "Nested-2", icon: Svgicons.Nested2icon, type: "sub", active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}`, type: "empty", active: false, selected: false, dirchange: false, title: "Nested-2.1"},
          { title: "Nested-2.2",path: `${import.meta.env.BASE_URL}`, type: "sub", ctive: false, selected: false, dirchange: false, children: [
            { path: `${import.meta.env.BASE_URL}`, type: "empty", active: false, selected: false, dirchange: false, title: "Nested-2.2.1"},
            { path: `${import.meta.env.BASE_URL}`, type: "empty", active: false, selected: false, dirchange: false, title: "Nested-2.2.2"},
          ]},

        ],
      },

    ],
  },

  {
    menutitle:'PAGES'
 },

  {
    icon: Svgicons.Pagesicon, title: "Pages", type: "sub", active: false, dirchange: false, children: [
      {
        icon: Svgicons.Authenticationicon, title: " Authentication", type: "sub", active: false, selected: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}pages/authentication/coming-soon`, type: "link", active: false, selected: false, title: "Coming Soon" },

          {
            title: "Create Password", type: "sub", active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/authentication/create-password/basic`, type: "link", active: false, selected: false, dirchange: false, title: "Basic" },
              { path: `${import.meta.env.BASE_URL}pages/authentication/create-password/cover`, type: "link", active: false, selected: false, title: "Cover" },
            ],
          },
          {
            title: "Lock Screen", type: "sub", active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/authentication/lock-screen/basic`, type: "link", active: false, selected: false, dirchange: false, title: "Basic" },
              { path: `${import.meta.env.BASE_URL}pages/authentication/lock-screen/cover`, type: "link", active: false, selected: false, title: "Cover" },
            ],
          },
          {
            title: "Reset Password", type: "sub", active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/authentication/reset-password/basic`, type: "link", active: false, selected: false, dirchange: false, title: "Basic" },
              { path: `${import.meta.env.BASE_URL}pages/authentication/reset-password/cover`, type: "link", active: false, selected: false, dirchange: false, title: "Cover" },
            ],
          },
          {
            title: "Sign Up", type: "sub", active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/authentication/sign-up/basic`, type: "link", active: false, selected: false, dirchange: false, title: "Basic" },
              { path: `${import.meta.env.BASE_URL}pages/authentication/sign-up/cover`, type: "link", active: false, selected: false, dirchange: false, title: "Cover" },
            ],
          },
          {
            title: "Sign In", type: "sub", active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/authentication/sign-in/basic`, type: "link", active: false, selected: false, dirchange: false, title: "Basic" },
              { path: `${import.meta.env.BASE_URL}pages/authentication/sign-in/cover`, type: "link", active: false, selected: false, dirchange: false, title: "Cover" },
            ],
          },
          {
            title: "Two Step Verification", type: "sub", active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/authentication/two-step-verification/basic`, type: "link", active: false, selected: false, dirchange: false, title: "Basic" },
              { path: `${import.meta.env.BASE_URL}pages/authentication/two-step-verification/cover`, type: "link", active: false, selected: false, dirchange: false, title: "Cover" },
            ],
          },
          { path: `${import.meta.env.BASE_URL}pages/authentication/under-maintainance`, type: "link", active: false, selected: false, dirchange: false, title: "Under Maintainance" },
        ]
      },
      {
        icon: Svgicons.Erroricon, title: "Error", type: "sub", active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}pages/authentication/error/401-error`, type: "link", active: false, selected: false, dirchange: false, title: "401-Error" },
          { path: `${import.meta.env.BASE_URL}pages/authentication/error/404-error`, type: "link", active: false, selected: false, dirchange: false, title: "404-Error" },
          { path: `${import.meta.env.BASE_URL}pages/authentication/error/500-error`, type: "link", active: false, selected: false, dirchange: false, title: "500-Error" },
        ]
      },
      {
        title: "Blog", icon: Svgicons.Blogicon, type: "sub", active: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}pages/blog/blog`, type: "link", active: false, selected: false, dirchange: false, title: "Blog" },
          { path: `${import.meta.env.BASE_URL}pages/blog/blog-details`, type: "link", active: false, selected: false, dirchange: false, title: "Blog-Details" },
          { path: `${import.meta.env.BASE_URL}pages/blog/create-blog`, type: "link", active: false, selected: false, dirchange: false, title: "Create-Blog" },
        ]
      },
      { path: `${import.meta.env.BASE_URL}pages/empty`, icon: Svgicons.Emptyicon, type: "link", active: false, selected: false, dirchange: false, title: "Empty", },
      {
        title: "Forms", icon: Svgicons.Formsicon, type: "sub", active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}pages/forms/form-advanced`, type: "link", active: false, selected: false, dirchange: false, title: "Form Advanced" },

          {
            title: "Form Elements", type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/inputs`, type: "link", active: false, selected: false, dirchange: false, title: "Inputs" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/checks-radios`, type: "link", active: false, selected: false, dirchange: false, title: "Checks & Radios " },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/input-group`, type: "link", active: false, selected: false, dirchange: false, title: "Input Group" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/form-select`, type: "link", active: false, selected: false, dirchange: false, title: "Form Select" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/range-slider`, type: "link", active: false, selected: false, dirchange: false, title: "Range Slider" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/input-masks`, type: "link", active: false, selected: false, dirchange: false, title: "Input Masks" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/file-uploads`, type: "link", active: false, selected: false, dirchange: false, title: "File Uploads" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/date-time-picker`, type: "link", active: false, selected: false, dirchange: false, title: "Date,Time Picker" },
              { path: `${import.meta.env.BASE_URL}pages/forms/form-elements/color-picker`, type: "link", active: false, selected: false, dirchange: false, title: "Color Pickers" },

            ],
          },
          { path: `${import.meta.env.BASE_URL}pages/forms/floating-labels`, type: "link", active: false, selected: false, dirchange: false, title: "Floating Labels" },
          { path: `${import.meta.env.BASE_URL}pages/forms/form-layouts`, type: "link", active: false, selected: false, dirchange: false, title: "Form Layouts" },
          { path: `${import.meta.env.BASE_URL}pages/forms/form-wizards`, type: "link", active: false, selected: false, dirchange: false, title: "Form Wizards" },
          { path: `${import.meta.env.BASE_URL}pages/forms/sun-editor`, type: "link", active: false, selected: false, dirchange: false, title: "Sun Editor" },
          { path: `${import.meta.env.BASE_URL}pages/forms/validation`, type: "link", active: false, selected: false, dirchange: false, title: "Validation" },
          { path: `${import.meta.env.BASE_URL}pages/forms/select2`, type: "link", active: false, selected: false, dirchange: false, title: "Select2" },
        ],
      },
      { path: `${import.meta.env.BASE_URL}pages/faqs`, icon: Svgicons.Faqsicon, type: "link", active: false, selected: false, dirchange: false, title: "FAQ's" },
      {
        title: "Invoice", type: "sub", icon: Svgicons.Invoiceicon, menusub: true, active: false, selected: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}pages/invoice/create-invoice`, type: "link", active: false, selected: false, dirchange: false, title: "Create Invoice" },
          { path: `${import.meta.env.BASE_URL}pages/invoice/invoice-details`, type: "link", active: false, selected: false, dirchange: false, title: "Invoice Details" },
          { path: `${import.meta.env.BASE_URL}pages/invoice/invoice-list`, type: "link", active: false, selected: false, dirchange: false, title: "Invoice List" },
        ],
      },
      { path: `${import.meta.env.BASE_URL}pages/landing`, icon: Svgicons.Landingicon, type: "link", active: false, selected: false, dirchange: false, title: "Landing" },
      { path: `${import.meta.env.BASE_URL}pages/pricing`, icon: Svgicons.Pricingicon, type: "link", active: false, selected: false, dirchange: false, title: "Pricing" },
      { path: `${import.meta.env.BASE_URL}pages/profile`, type: "link", icon: Svgicons.Profileicon, active: false, selected: false, dirchange: false, title: "Profile" },
      { path: `${import.meta.env.BASE_URL}pages/profile-settings`, type: "link", icon: Svgicons.Profilesettingicon, active: false, selected: false, dirchange: false, title: "Profile Settings" },
      { path: `${import.meta.env.BASE_URL}pages/testimonials`, type: "link", icon: Svgicons.Testimonialicon, active: false, selected: false, dirchange: false, title: "Testimonials" },
      { path: `${import.meta.env.BASE_URL}pages/search`, type: "link", icon: Svgicons.Searchicon, active: false, selected: false, dirchange: false, title: "Search" },
      { path: `${import.meta.env.BASE_URL}pages/team`, type: "link", icon: Svgicons.Teamicon, active: false, selected: false, dirchange: false, title: "Team", },
      { path: `${import.meta.env.BASE_URL}pages/terms-conditions`, type: "link", icon: Svgicons.Termsicon, active: false, selected: false, dirchange: false, title: "Terms & Conditions" },
      { path: `${import.meta.env.BASE_URL}pages/timeline`, type: "link", icon: Svgicons.Timelineicon, active: false, selected: false, dirchange: false, title: "Timeline" },
    ]
  },

  {
    menutitle:'GENERAL'
 },

  {
    title: "General", icon: Svgicons.Generalicon, type: "sub", active: false, selected: false, dirchange: false, children: [
      {
        title: "Ui Elements", icon: Svgicons.Elementsicon, type: "sub", active: false, selected: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}general/ui-elements/alerts`, type: "link", active: false, selected: false, dirchange: false, title: "Alerts" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/badge`, type: "link", active: false, selected: false, dirchange: false, title: "Badge" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/breadcrumb`, type: "link", active: false, selected: false, dirchange: false, title: "Breadcrumb" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/buttons`, type: "link", active: false, selected: false, dirchange: false, title: "Buttons" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/button-group`, type: "link", active: false, selected: false, dirchange: false, title: "Button Group" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/cards`, type: "link", active: false, selected: false, dirchange: false, title: "Cards" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/dropdowns`, type: "link", active: false, selected: false, dirchange: false, title: "Dropdowns" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/images-figures`, type: "link", active: false, selected: false, dirchange: false, title: "Images & Figures" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/links-interactions`, type: "link", active: false, selected: false, dirchange: false, title: "Links & Interactions" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/list-group`, type: "link", active: false, selected: false, dirchange: false, title: "List Group" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/navs-tabs`, type: "link", active: false, selected: false, dirchange: false, title: "Navs & Tabs" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/object-fit`, type: "link", active: false, selected: false, dirchange: false, title: "Object Fit" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/pagination`, type: "link", active: false, selected: false, dirchange: false, title: "Pagination" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/popovers`, type: "link", active: false, selected: false, dirchange: false, title: "Popovers" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/progress`, type: "link", active: false, selected: false, dirchange: false, title: "Progress" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/spinners`, type: "link", active: false, selected: false, dirchange: false, title: "Spinners" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/toasts`, type: "link", active: false, selected: false, dirchange: false, title: "Toasts" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/tooltips`, type: "link", active: false, selected: false, dirchange: false, title: "Tooltips" },
          { path: `${import.meta.env.BASE_URL}general/ui-elements/typography`, type: "link", active: false, selected: false, dirchange: false, title: "Typography" },
        ],
      },
      {
        title: "Utilities", icon: Svgicons.Utilitiesicon, type: "sub", active: false, selected: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}general/utilities/avatars`, type: "link", active: false, selected: false, dirchange: false, title: "Avatars" },
          { path: `${import.meta.env.BASE_URL}general/utilities/borders`, type: "link", active: false, selected: false, dirchange: false, title: "Borders" },
          { path: `${import.meta.env.BASE_URL}general/utilities/breakpoints`, type: "link", active: false, selected: false, dirchange: false, title: "Breakpoints" },
          { path: `${import.meta.env.BASE_URL}general/utilities/colors`, type: "link", active: false, selected: false, dirchange: false, title: "Colors" },
          { path: `${import.meta.env.BASE_URL}general/utilities/columns`, type: "link", active: false, selected: false, dirchange: false, title: "Columns" },
          { path: `${import.meta.env.BASE_URL}general/utilities/css-grid`, type: "link", active: false, selected: false, dirchange: false, title: "Css Grid" },
          { path: `${import.meta.env.BASE_URL}general/utilities/flex`, type: "link", active: false, selected: false, dirchange: false, title: "Flex" },
          { path: `${import.meta.env.BASE_URL}general/utilities/gutters`, type: "link", active: false, selected: false, dirchange: false, title: "Gutters" },
          { path: `${import.meta.env.BASE_URL}general/utilities/helpers`, type: "link", active: false, selected: false, dirchange: false, title: "Helpers" },
          { path: `${import.meta.env.BASE_URL}general/utilities/position`, type: "link", active: false, selected: false, dirchange: false, title: "Position" },
          { path: `${import.meta.env.BASE_URL}general/utilities/additional-content`, type: "link", active: false, selected: false, dirchange: false, title: "Additional Content" },

        ],
      },
      {
        title: "Advanced Ui", icon: Svgicons.Advancedicon, type: "sub", active: false, selected: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/accordions-collapse`, type: "link", active: false, selected: false, dirchange: false, title: "Accordions & collapse" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/carousel`, type: "link", active: false, selected: false, dirchange: false, title: "Carousel" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/draggable-cards`, type: "link", active: false, selected: false, dirchange: false, title: "Draggable Cards" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/media-player`, type: "link", active: false, selected: false, dirchange: false, title: "Media Player" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/modals-closes`, type: "link", active: false, selected: false, dirchange: false, title: "Modals & Closes" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/navbar`, type: "link", active: false, selected: false, dirchange: false, title: "Navbar" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/offcanvas`, type: "link", active: false, selected: false, dirchange: false, title: "Offcanvas" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/placeholders`, type: "link", active: false, selected: false, dirchange: false, title: "Placeholders" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/ratings`, type: "link", active: false, selected: false, dirchange: false, title: "Ratings" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/ribbons`, type: "link", active: false, selected: false, dirchange: false, title: "Ribbons" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/sortable-js`, type: "link", active: false, selected: false, dirchange: false, title: "Sortable Js" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/swiper-js`, type: "link", active: false, selected: false, dirchange: false, title: "Swiper JS" },
          { path: `${import.meta.env.BASE_URL}general/advanced-ui/tour`, type: "link", active: false, selected: false, dirchange: false, title: "Tour" },
        ],
      },
    ]
  },

  { path: `${import.meta.env.BASE_URL}widgets`, icon:Svgicons.widgetsicon, title: "widgets", type: "link", active: false, dirchange: false, selected: false },

  {
    menutitle:'MAPS & ICONS'
 },

  {
    title: "Maps", icon: Svgicons.Mapsicon, type: "sub", background: "hor-rightangle", active: false, selected: false, dirchange: false, children: [

      { path: `${import.meta.env.BASE_URL}maps/pigeon-maps`, icon: Svgicons.Vectoricon, type: "link", active: false, selected: false, dirchange: false, title: "Pigeon Maps" },
      { path: `${import.meta.env.BASE_URL}maps/leaflet-maps`, icon: Svgicons.Leafleticon, type: "link", active: false, selected: false, dirchange: false, title: "Leaflet Maps" }

    ],
  },

  { path: `${import.meta.env.BASE_URL}icons`, icon: Svgicons.Iconsicon, type: "link", active: false, selected: false, dirchange: false, title: "Icons" },

  {
    menutitle:'TABLES & CHARTS'
 },

  {
    title: "Charts", icon: Svgicons.Chartsicon, type: "sub", dirchange: false, children: [
      {
        title: "Apex Charts", icon: Svgicons.Apexicon, type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

          { path: `${import.meta.env.BASE_URL}charts/apex-charts/line-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Line Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/area-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Area Charts " },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/column-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Column Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/bar-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Bar Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/mixed-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Mixed Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/range-area-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Range Area Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/timeline-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Timeline Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/funnel-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Funnel Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/candlestick-chart`, type: "link", active: false, selected: false, dirchange: false, title: "CandleStick Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/boxplot-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Boxplot Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/bubble-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Bubble Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/scatter-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Scatter Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/heatmap-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Heatmap Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/treemap-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Treemap Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/pie-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Pie Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/radialbar-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Radialbar Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/radar-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Radar Charts" },
          { path: `${import.meta.env.BASE_URL}charts/apex-charts/polararea-chart`, type: "link", active: false, selected: false, dirchange: false, title: "Polararea Charts" },
        ],
      },
      { path: `${import.meta.env.BASE_URL}charts/chartjs-charts`, icon: Svgicons.Chartjsicon, type: "link", active: false, selected: false, dirchange: false, title: "Chartjs Charts" },
      { path: `${import.meta.env.BASE_URL}charts/echart-charts`, type: "link", icon: Svgicons.Echartsicon, active: false, selected: false, dirchange: false, title: "Echart Charts" },
    ],
  },

  {
    title: "Tables", icon:Svgicons.Tablesicon, type: "sub", menutitle: "", active: false, selected: false, dirchange: false, children: [

      { path: `${import.meta.env.BASE_URL}tables/tables`, type: "link", icon:Svgicons.Basictableicon, active: false, selected: false, dirchange: false, title: "Tables" },
      { path: `${import.meta.env.BASE_URL}tables/grid-js-tables`, type: "link", icon:Svgicons.Gridjsicon, active: false, selected: false, dirchange: false, title: "Grid JS Tables" },
      { path: `${import.meta.env.BASE_URL}tables/data-tables`, type: "link", icon:Svgicons.Datatablesicon, active: false, selected: false, dirchange: false, title: "Data Tables" },
      
    ],
  },
  */
]