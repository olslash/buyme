export function updateSparseArray(array, values, offset) {
  let result = [...array];
  values.forEach((v, i) => result[i + offset] = v);

  return result;
}
