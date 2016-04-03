import React, { PropTypes as ReactPropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export function injectInto(children, props) {
  return React.Children.map(children, (element) => {
    return typeof props === 'object'
      ? React.cloneElement(element, props)
      : React.cloneElement(element, props(element.props));
  });
}

export const PropTypes = {
  ...ReactPropTypes,
  immutable: {
    ...ImmutablePropTypes
  },
  children: ReactPropTypes.node,
  oneChild: ReactPropTypes.element
};

