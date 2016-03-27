import React from 'react';

import { PropTypes } from 'helpers/react';
const { children } = PropTypes;

export default class App extends React.Component {
  static propTypes = {
    children: children
  };

  render() {
   return (
     <div>
       { this.props.children }
     </div>
   );
  }
}
