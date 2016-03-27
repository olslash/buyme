import { createStore } from 'redux';
import rootReducer from '../modules';

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState);
}
