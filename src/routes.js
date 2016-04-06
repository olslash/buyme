import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import GridPage from './containers/GridPage';
import ComponentPage from './containers/ComponentPage';
import NotFoundPage from './containers/NotFoundPage';

export default (
  <Route path="/" component={ App }>
      <IndexRoute component={ GridPage } />
      <Route path="component/(:id)" component={ ComponentPage } />
      <Route path="*" component={ NotFoundPage }/>
    {
      // <Route path="grid" component={GridPage}/>
      /*<Route path="*" component={NotFoundPage} />*/
    }
  </Route>
);
