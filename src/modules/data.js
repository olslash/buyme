// import Immutable from 'immutable';
import { createAction, handleActions } from 'redux-actions';
// import { createSelector } from 'reselect';
import { transform } from 'lodash';


import * as api from 'helpers/api';
// import { updateSparseArray } from 'helpers/immutable';

const initialState = {

};

export default handleActions({
  FETCH_DATA: {
    next(state, action) {
      const { type, offset } = action.meta;
      const { response, total } = action.payload;

      return {
        ...state,
        [type]: {
          items: transform(response, (acc, val, i) => {
            acc[i + offset] = val;
          }, state[type] && state[type].items || {}),
          // items: (state[type].items || Immutable.Map()).withMutations(map => {
          // response.forEach((item, i) => map.set(i + offset, item));
          // }),
          meta: { total }
        }
      };
    },
    throw(state, action) {
      // todo
      return state;
    }
  }
}, initialState);

function local(state) {
  return state.data;
}

// selectors
export const selectData = (state, options) => {
  const { offset = 0, limit, type } = options;

  return local(state)[type];
    // .slice(offset, limit && offset + limit);
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

