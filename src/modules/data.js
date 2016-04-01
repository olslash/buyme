import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';


import * as api from 'helpers/api';
import { updateSparseArray } from 'helpers/immutable';

const initialState = {
  products: []
};

const handleFetchData = {
  next(state, action) {
    const { type, offset } = action.meta;

    return {
      ...state,
      [type]: updateSparseArray(state[type], action.payload, offset)
    };
  },
  throw(state, action) {
    // todo
    return state;
  }
};

export default handleActions({
  FETCH_DATA: handleFetchData
}, initialState);

function local(state) {
  return state.data;
}

// selectors
export const selectProducts = (state, options) => {
  const { offset = 0, limit } = options;


  return local(state).products
    .slice(offset, limit && offset + limit);
};

// export const selectData = (state, type, options) => {
//   switch (type) {
//     case 'products':
//       return selectProducts(state, options);
//   }
// };

// action creators
const withOptions = (type, options) => options;

export const fetchData = createAction('FETCH_DATA', async (type, options) => {
  return await api.fetchData(type, options);
}, withOptions);

