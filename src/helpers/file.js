// @flow

function requireAll(r) {
  return r.keys().map(r);
}

export function requireAllOfType(typeRegex, path, includeSubdirectories = true) {
  return requireAll(require.context(
    '../static/images', // FIXME -- this is just for testing, so has to be static
    true, //includeSubdirectories,
    /\.(png|jpg|jpeg)$/ // typeRegex
  ));
}
