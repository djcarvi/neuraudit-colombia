
import * as Svgicons from "./menusvg-icons";

export const MENUITEMS: any = [

  {
     menutitle:'MAIN'
  },
  {
    title: "Dashboards", icon: Svgicons.Dashboardicon, type: "sub", active: false, dirchange: false, children: [

      { path: `${import.meta.env.BASE_URL}dashboards/sales`, icon: Svgicons.Salesicon, type: "link", active: false, selected: false, dirchange: false, title: "Sales" },
]
  },

  {
    menutitle:'WEB APPS'
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
        icon: Svgicons.Erroricon, title: "Error", type: "sub", active: false, selected: false, dirchange: false, children: [
          { path: `${import.meta.env.BASE_URL}pages/authentication/error/404-error`, type: "link", active: false, selected: false, dirchange: false, title: "404-Error" },
        ]
      },
    ]
  },

]