// @flow

import React from 'react';

export function injectInto(children, props) {
  return React.Children.map(children, (element) => {
    return typeof props === 'object'
      ? React.cloneElement(element, props)
      : React.cloneElement(element, props(element.props));
  });
}
