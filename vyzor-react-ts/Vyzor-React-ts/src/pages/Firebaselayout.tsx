import { type FC, Fragment } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { store } from '../shared/redux/store';

interface ComponentProps { }

const Firebaselayout: FC<ComponentProps> = () => {
  return (
    <Fragment>
      <Fragment>
        <Provider store={store}>
          <Fragment>
            <Outlet />
          </Fragment>
        </Provider>
      </Fragment>
    </Fragment>
  );
};

export default Firebaselayout;