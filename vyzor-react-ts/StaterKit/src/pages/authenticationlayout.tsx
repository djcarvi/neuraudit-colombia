import { Fragment, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Initialload } from '../contextapi';
import Landingswitcher from '../shared/layouts-components/switcher/landing-switcher';
import { store } from '../shared/redux/store';

const AuthenticationLayout = () => {
  const location = useLocation()
  const bodyRef: any = useRef(null);

  useEffect(() => {
    bodyRef.current = document.body

    if (location.pathname.includes('/basic')) {
      bodyRef.current.classList.add('authentication-background', 'authenticationcover-background', 'position-relative');
    } else {
      bodyRef.current.classList.remove('authentication-background', 'authenticationcover-background', 'position-relative');
    }

    if (location.pathname.includes('/cover')) {
      bodyRef.current.classList.add('bg-white')
    } else {
      bodyRef.current.classList.remove('bg-white')
    }

    if (location.pathname.includes('/coming-soon') || location.pathname.includes('/under-maintainance')) {
      bodyRef.current.classList.add('coming-soon-main')
    } else {
      bodyRef.current.classList.remove('coming-soon-main')
    }

    return () => {
      bodyRef.current.classList.remove('authentication-background', 'authenticationcover-background', 'position-relative');
      bodyRef.current.classList.remove('bg-white');
      bodyRef.current.classList.remove('coming-soon-main');
    };

  }, [location.pathname]);

  const [pageloading, setpageloading] = useState(false)
  return (
    <Fragment>
      <Initialload.Provider value={{ pageloading, setpageloading }}>
        <Provider store={store}>
          <Landingswitcher />
          <Outlet />
        </Provider>
      </Initialload.Provider>
    </Fragment>
  )

}

export default AuthenticationLayout;
