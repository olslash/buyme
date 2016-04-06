import React from 'react';
// import {  } from 'lodash';

import { PropTypes } from 'helpers/react';
// const { } = PropTypes;

export default class NotFoundPage extends React.Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    return (
      <div className="grid grid-pad" style={ { paddingTop: 0 } }>
        <div className="col-1-1">
          <div className="content">
            Route not found
          </div>
        </div>
      </div>
    );
  }
}
