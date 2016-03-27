import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import GridPage from './components/NewGrid';

export default (
  <Route path="/" component={App}>
      <IndexRoute component={GridPage} />
      <Route path="grid" component={GridPage}/>
    {
      /*<Route path="*" component={NotFoundPage} />*/
    }
  </Route>
);
