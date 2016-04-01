//This file merely configures the store for hot reloading.
//This boilerplate file is likely to be the same for each project that uses Redux.
//With Redux, the actual stores are in /reducers.

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import rootReducer from '../modules';

const middleware = [thunk, promise, createLogger()];

export default function configureStore(initialState) {
  let store;
  if (window.devToolsExtension) { //Enable Redux devtools if the extension is installed in developer's browser
    // store = window.devToolsExtension()(createStore)(
    //   rootReducer, initialState, applyMiddleware(promise, thunk, createLogger())
    // );
    const finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore);

    store = finalCreateStore(rootReducer, initialState);
  } else {
    store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(...middleware)
    );
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../modules', () => {
      const nextReducer = require('../modules').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
