import { mapValues } from 'lodash';

module.exports = {
  __ENV__: mapValues({
    API_ROOT: 'http://localhost:3001'
  }, val => JSON.stringify(val))
};
