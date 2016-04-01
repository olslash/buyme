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

function fetchProducts({ offset = 0, limit = 10 }) {
  const fakeDelay = random(0, 1, true);
  const url = makeApiUrl('products', { offset, limit });

  return new Promise((resolve, reject) => setTimeout(async () => {
    const res = await fetch(url);
    const json = await res.json();
    res.headers.forEach(header => console.log(header))

    return json
  }, fakeDelay * 1000));
}

