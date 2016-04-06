import React from 'react';
// import {  } from 'lodash';

import { PropTypes } from 'helpers/react';
// const { } = PropTypes;

export default class ComponentPage extends React.Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    return (
      <div className="grid grid-pad" style={ { paddingTop: 0 } }>
        <div className="col-1-1">
          <div className="content">
            This is the component page { this.props.params.id || 'no id' }
          </div>
        </div>
      </div>
    );
  }
}
