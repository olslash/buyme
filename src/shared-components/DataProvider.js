import React from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { omit } from 'lodash';

import { selectData, fetchData }from 'modules/data';
import { PropTypes, injectInto } from 'helpers/react';
const { oneChild, number, string, func } = PropTypes;

@connect((state, ownProps) => ({
  data: selectData(state, ownProps.type, ownProps)
}), {
  fetchData
})
export default class DataProvider extends React.Component {
  static propTypes = {
    type: string.isRequired,
    limit: number,
    offset: number,
    children: oneChild,

    fetchData: func
  };

  static defaultProps = {
    limit: 1000,
    offset: 0
  };

  componentDidMount() {
    this._fetchData();
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidUpdate(prevProps, prevState) {
    this._fetchData();
  }

  shouldComponentFetchData() {
    // todo: check if all data exists in range of offset/limit
    // return find(this.props.data, isUndefined);
    return true;
  }

  _fetchData() {
    if (this.shouldComponentFetchData()) {
      this.props.fetchData(this.props.type, this.props);
    }
  }

  render() {
    const injectedChild = injectInto(this.props.children, {
      test: true
    });

    return React.Children.only(injectedChild[0]);
  }
}
