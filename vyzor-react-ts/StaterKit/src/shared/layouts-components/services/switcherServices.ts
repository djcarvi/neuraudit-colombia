
import { BehaviorSubject } from "rxjs"

interface Body {
    class: string;
}

interface InitialState {
    lang: string;
    dir: string;
    dataThemeMode: string;
    dataMenuStyles: string;
    dataNavLayout: string;
    dataHeaderStyles: string;
    dataVerticalStyle: string;
    toggled: string;
    dataNavStyle: string;
    horStyle: string;
    dataPageStyle: string;
    dataWidth: string;
    dataMenuPosition: string;
    dataHeaderPosition: string;
    loader: string;
    iconOverlay: string;
    colorPrimaryRgb: string;
    bodyBg: string;
    bodyBg2: string;
    inputBorder: string;
    lightRgb: string;
    formControlBg: string;
    gray: string;
    bgImg: string | any;
    iconText: string;
    body: Body;
}

//  Initial state with default values

const initialState: InitialState = {
    lang: "en",                     
    dir: "ltr",
    dataThemeMode: "light",
    dataMenuStyles: "transparent",
    dataNavLayout: "vertical",
    dataHeaderStyles: "transparent",
    dataVerticalStyle: "doublemenu",
    toggled: "double-menu-open",
    dataNavStyle: "",
    horStyle: "",
    dataPageStyle: "flat",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "disable",
    iconOverlay: "",
    colorPrimaryRgb: "",
    bodyBg: "",
    bodyBg2: "",
    inputBorder: "",
    lightRgb: "",
    formControlBg: "",
    gray: "",
    bgImg: "",
    iconText: "",
    body: {
        class: ""
    }
};

const stateSubject = new BehaviorSubject<InitialState>(initialState);

export const data$ = stateSubject.asObservable();

const setAttributeIfValid = (element: HTMLElement, attribute: string, value: string) => {
    if (element && value) {
        element.setAttribute(attribute, value);
    } else {
        element.removeAttribute(attribute);
    }
}

export const setAttributes: any = () => {
    const currentState = stateSubject.value;
    const html = document.documentElement;

    const cssVars = {
        '--primary-rgb': currentState.colorPrimaryRgb,
        '--body-bg-rgb': currentState.bodyBg,
        '--body-bg-rgb2': currentState.bodyBg2,
        '--light-rgb': currentState.lightRgb,
        '--form-control-bg': currentState.formControlBg,
        '--gray-3': currentState.gray,
        '--input-border': currentState.inputBorder,
    };

    setAttributeIfValid(html, 'lang', currentState.lang);
    setAttributeIfValid(html, 'dir', currentState.dir);
    setAttributeIfValid(html, 'data-toggled', currentState.toggled);
    setAttributeIfValid(html, 'data-theme-mode', currentState.dataThemeMode);
    setAttributeIfValid(html, 'data-menu-styles', currentState.dataMenuStyles);
    setAttributeIfValid(html, 'data-nav-layout', currentState.dataNavLayout);
    setAttributeIfValid(html, 'data-header-styles', currentState.dataHeaderStyles);
    setAttributeIfValid(html, 'data-vertical-style', currentState.dataVerticalStyle);
    setAttributeIfValid(html, 'data-nav-style', currentState.dataNavStyle);
    setAttributeIfValid(html, 'hor-style', currentState.horStyle);
    setAttributeIfValid(html, 'data-page-style', currentState.dataPageStyle);
    setAttributeIfValid(html, 'data-width', currentState.dataWidth);
    setAttributeIfValid(html, 'data-menu-position', currentState.dataMenuPosition);
    setAttributeIfValid(html, 'data-header-position', currentState.dataHeaderPosition);
    setAttributeIfValid(html, 'data-icon-overlay', currentState.iconOverlay);
    setAttributeIfValid(html, 'data-bg-img', currentState.bgImg);
    setAttributeIfValid(html, 'icon-text', currentState.iconText);
    setAttributeIfValid(html, 'loader', currentState.loader);

    //  adding css styles to attribute 

    Object.entries(cssVars).forEach(([varName, value]) => {
        if (value && value !== '') {
            html.style.setProperty(varName, value);
        } else {
            html.style.removeProperty(varName);
        }
    });

}

export const setState: any = (newState: Partial<InitialState>) => {
    const currentState = stateSubject.value;
    stateSubject.next({ ...currentState, ...newState });
    setAttributes()
}

export const getState: any = (): InitialState => stateSubject.value;
