import queryString from 'query-string';
import { random } from 'lodash';

export function makeApiUrl(path, queryObj) {
  const params = queryString.stringify(queryObj);
  return `${__ENV__.API_ROOT}/${path}?${params}`;
}

export function fetchData(options = {}) {
  switch (options.type) {
    case 'products':
      return fetchProducts(options);
    default:
      throw new Error('fetchData type not found');
  }
}

async function fetchProducts({ offset = 0, limit = -1 }) {
  const mock_api_params_fixme = { _start: offset, _limit: limit };
  const url = makeApiUrl('products', mock_api_params_fixme);

  const res = await fetch(url);
  const json = await res.json();
  const total = res.headers.get('X-Total-Count');

  return { response: json, total: Number(total) };
}

