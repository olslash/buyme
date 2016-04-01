import { combineReducers } from 'redux';
import grid from './grid';
import data from './data';

const rootReducer = combineReducers({
  grid,
  data
});

export default rootReducer;
