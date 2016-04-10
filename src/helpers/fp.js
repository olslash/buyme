import { head, tail, forEach } from 'lodash';
// https://github.com/lodash/lodash/issues/1684
export function scan(array, fn, seed, thisArg) {
  let accumulator = seed;
  let results = [];
  if (seed === undefined) {
    accumulator = head(array);
    array = tail(array);
  }
  results.push(accumulator);
  forEach(array, function (nextValue, i) {
    accumulator = fn.call(thisArg, accumulator, nextValue, i);
    results.push(accumulator);
  });
  return results;
}
