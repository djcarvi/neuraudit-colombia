
import { Fragment, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom';
import { Initialload } from '../contextapi';
import Landingswitcher from '../shared/layouts-components/switcher/landing-switcher';
import Backtotop from '../shared/layouts-components/backtotop/backtotop';


const Landinglayout = () => {

  const bodyRef:any = useRef(null);

  useEffect(() => {

    bodyRef.current = document.body

    bodyRef.current?.classList.add('landing-body')
    return () => {
      bodyRef.current?.classList.remove('landing-body')
    }
  },[]);

  const getDocumentElement = (): HTMLElement => {
    return document.documentElement;
};

  useEffect(() => {
    const html = getDocumentElement()
  
    // Remove the attribute on mount
    html.removeAttribute('data-bg-img');
  
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-bg-img") {
          html.removeAttribute('data-bg-img'); // Force remove it again
        }
      });
    });
  
    observer.observe(html, { attributes: true });
  
    return () => {
      observer.disconnect();
    };
  }, []);
  const [pageloading, setpageloading] = useState(false);
  return (
    <Fragment >
      <Initialload.Provider value={{ pageloading, setpageloading }}>
        <div>
          <Landingswitcher />
          <Outlet />
        </div>
        <Backtotop />
      </Initialload.Provider>
    </Fragment>
  )
}

export default Landinglayout