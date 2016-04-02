import React from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { get, omit, range } from 'lodash';

import { selectData, fetchData }from 'modules/data';
import { PropTypes, injectInto } from 'helpers/react';
const { oneChild, number, string, func, arrayOf, any } = PropTypes;

@connect((state, ownProps) => {
  const data = selectData(state, ownProps);

  return {
    items: get(data, 'items', []),
    total: get(data, 'meta.total', Infinity)
  };
}, {
  fetchData
})
export default class DataProvider extends React.Component {
  static propTypes = {
    type: string.isRequired,
    limit: number,
    offset: number,
    children: oneChild,

    items: arrayOf(any),
    total: number,
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
    // check if all data exists
    const { offset, limit, items, total } = this.props;

    const allDataAvailable = range(offset, Math.min(offset + (limit - 1), total - 1))
      .every(i => !!items[i]);

    return !allDataAvailable;
  }

  _fetchData() {
    if (this.shouldComponentFetchData()) {
      return this.props.fetchData(this.props.type, this.props);
    }
  }

  render() {
    const injectedChild = injectInto(this.props.children, {
      data: this.props.items
    });

    return React.Children.only(injectedChild[0]);
  }
}
