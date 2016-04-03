import Immutable from 'immutable';
import { createAction, handleActions } from 'redux-actions';
// import { createSelector } from 'reselect';
import { transform, range, values, get } from 'lodash';

import * as api from 'helpers/api';

const status = {
  LOADING: 'loading',
  FAILED: 'failed'
};

const initialState = {};
export default handleActions({
  FETCH_DATA: {
    next(state, action) {
      const { type, offset } = action.meta;
      const { response, total } = action.payload;

      return {
        ...state,
        [type]: {
          items: get(state, [type, 'items'], Immutable.Map()).withMutations(map => {
            response.forEach((item, i) => map.set(i + offset, item));
          }),
          // items: {
          //   ...transform(response, (acc, val, i) => {
          //     acc[i + offset] = val;
          //   }, state[type] && state[type].items || {})
          // },
          meta: { total }
        }
      };
    },
    throw(state, action) {
      // todo
      return state;
    }
  },

  SET_LOADING: {
    next(state, action) {
      const { type, options } = action.payload;
      const { offset, limit } = options;
      const totalAvailableItems = get(state, [type, 'meta', 'total'], Infinity);
      // limit may easily ask for more data than exists on the server
      // how do we avoid setting Loading state on data that can never exist?
      // do we need to fetch an items count before doing anything?
      // or just clean up once we know what the total is going to be

      return {
        ...state,
        [type]: {
          items: get(state, [type, 'items'], Immutable.Map()).withMutations(map => {
            range(Math.min(limit, totalAvailableItems - offset)).forEach((i) => {
              // could be undefined, a value, or a status
              // status can always be overwritten
              // do not overwrite existing values
              const existing = map.get(i + offset);
              map.set(i + offset,
                values(status).includes(existing) || existing === undefined
                  ? status.LOADING
                  : existing
              );
            });
          })
        }
      };
    }
  }
}, initialState);

function local(state) {
  return state.data;
}

// selectors
export const selectData = (state, options) => {
  const { offset = 0, limit, type } = options;

  const data = local(state)[type];
  return data && {
      ...data,
      items: data.items.toJS()
    } || null;
    // .slice(offset, limit && offset + limit);
};

const setLoading = createAction('SET_LOADING', (type, options) => {
  return {
    type, options
  };
});

export const fetchData = (type, options) => ([
  setLoading(type, options),
  _fetchData(type, options)
  // setLoading(false, type, options)
]);

const _fetchData = createAction('FETCH_DATA', async (type, options) => {
  return await api.fetchData(type, options);
}, (type, options) => options);

