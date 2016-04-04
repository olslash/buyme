import Immutable from 'immutable';
import { createAction, handleActions } from 'redux-actions';
// import { createSelector } from 'reselect';
import { transform, range, values, get } from 'lodash';

import * as api from 'helpers/api';

export const status = {
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
      const { type, offset, limit } = action.payload;
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
  const { type } = options;
  const data = local(state)[type];

  return data && {
      ...data,
      items: data.items.toJS()
    };
};

// actions
export const fetchDataIfNeeded = (options = {}) => (dispatch, getState) => {
  const data = selectData(getState(), options);

  if(shouldFetchData(data, options)) {
    dispatch(fetchData(options));
  }
};

const shouldFetchData = (existingData = {}, options = {}) => {
  // check if all data exists
  // todo: check failed status and count that as not existing
  const { offset, limit } = options;
  const { data = {}, total = Infinity } = existingData;

  const allDataAvailable = range(
    offset,
    Math.min(offset + (limit - 1), total - 1)
  ).every(i => !!data[i]);

  return !allDataAvailable;
};

const fetchData = (options) => ([
  _setLoading(options),
  _fetchData(options)
]);

const _fetchData = createAction('FETCH_DATA', async (options) => {
  return await api.fetchData(options);
}, (options) => options);

const _setLoading = createAction('SET_LOADING', (options) => options);
