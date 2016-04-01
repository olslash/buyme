import { mapValues } from 'lodash';

const env = {
  __API_ROOT: ''
};

module.exports = mapValues(env, val => JSON.stringify(val));
