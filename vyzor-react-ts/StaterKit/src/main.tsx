import { Fragment, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = lazy(() => import('./pages/App.tsx'));
const AuthenticationLayout = lazy(() => import('./pages/authenticationlayout.tsx'));
const Error404 = lazy(() => import('./components/pages/error/404-error/404-error.tsx'));

import { Provider } from 'react-redux';
import RootWrapper from './pages/Rootwrapper.tsx';
import { store } from './shared/redux/store.tsx';
import { RouteData } from './shared/data/routingdata.tsx';
const Firebaselayout = lazy(() => import('./pages/Firebaselayout.tsx'));
const Signin = lazy(() => import('./firebase/login.tsx'));


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Fragment>
    <Provider store={store}>
      <RootWrapper>
        <BrowserRouter>
          {/* <Scrolltotop /> */}
          <Routes>

          <Route path={`${import.meta.env.BASE_URL}`} element={<Firebaselayout />}>
              <Route index element={<Signin />} />
              <Route path={`${import.meta.env.BASE_URL}common/firebase/signin`} element={<Signin />} />
            </Route>

            <Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
              {RouteData.map((idx) => (
                <Route key={idx.id} path={idx.path} element={idx.element} />
              ))}
            </Route>

            <Route path={`${import.meta.env.BASE_URL}`} element={<AuthenticationLayout />}>
              <Route path='*' element={<Error404 />} />
              
              <Route path={`${import.meta.env.BASE_URL}pages/authentication/error/404-error`} element={<Error404 />} />
            </Route>
          
          </Routes>
        </BrowserRouter>
      </RootWrapper>
    </Provider>
  </Fragment>
);

