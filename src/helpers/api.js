import queryString from 'query-string';
import { random } from 'lodash';

export function makeApiUrl(path, queryObj) {
  const params = queryString.stringify(queryObj);
  return `${__ENV__.API_ROOT}/${path}?${params}`;
}

export function fetchData(type, options = {}) {
  switch (type) {
    case 'products':
      return fetchProducts(options);
    default:
      throw new Error('fetchData type not found');
  }
}

function fetchProducts({ offset = 0, limit = -1 }) {
  const fakeDelay = random(0, 1, true);

  const fake_api_params_fixme = { _start: offset, _limit: limit };
  const url = makeApiUrl('products', fake_api_params_fixme);

  return new Promise((resolve, reject) => setTimeout(async () => {
    const res = await fetch(url);
    const json = await res.json();

    const total = res.headers.get('X-Total-Count');

    resolve({ response: json, total: Number(total) });
  }, fakeDelay * 1000));
}

