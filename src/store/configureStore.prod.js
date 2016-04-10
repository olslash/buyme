import { createStore, applyMiddleware } from 'redux';
import multi from 'redux-multi';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import rootReducer from '../modules';

const middleware = [multi, thunk, promise, createLogger()];

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(...middleware));
}
