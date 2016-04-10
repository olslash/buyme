import React from 'react';
import { connect } from 'react-redux';
import { VirtualScroll, InfiniteLoader, AutoSizer } from 'react-virtualized';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { partial, get, set, map, debounce, isEmpty } from 'lodash';

import {
  selectData, fetchDataIfNeeded as fetchData, status as dataStatus
} from 'modules/data';
import { PropTypes } from 'helpers/react';
const {
  func, number, oneOfType, objectOf, status, object, shape, arrayOf
} = PropTypes;

import SceneGrid from 'shared-components/SceneGrid';

@connect((state) => {
  const data = selectData(state, { type: 'products' });

  return {
    items: get(data, 'items', {}),
    total: get(data, 'meta.total', 0)
  };
}, {
  fetchData
})
export default class GridPage extends React.Component {
  static propTypes = {
    fetchData: func.isRequired,
    items: oneOfType([
      objectOf(status),
      objectOf(shape({
        sceneImage: object.isRequired,
        components: arrayOf(object).isRequired
      }))
    ]),
    total: number
  };

  state = {
    rowHeights: {}
  };

  componentWillMount() {
    this.props.fetchData({
      type: 'products',
      offset: 0,
      limit: 6
    });
  }

  componentDidMount() {
    debounce(this.scroller.recomputeRowHeights, 250);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidUpdate() {
    this.scroller.recomputeRowHeights();
  }

  setRowHeight = (i, height) => {
    if (height !== this.getRowHeight(i)) {
      console.log('setting state, ', height, this.getRowHeight(i))
      // this.setState({
      //   rowHeights: set(this.state.rowHeights, i, height)
      //   // rowHeights: {
      //   //   ...this.state.rowHeights,
      //   //   [i]: height
      //   // }
      // });
      // fixme -- commented-out approach doesn't work when react batches setState calls
      set(this.state.rowHeights, i, height);
      this.forceUpdate();
    }
  };

  getRowHeight = (i) => {
    return this.state.rowHeights[i] || 20;
  };

  isRowLoaded = (i) => {
    return this.props.items[i] || this.props.items[i] === dataStatus.LOADING;
  };

  loadMoreRows = ({ startIndex, stopIndex }) => {
    return this.props.fetchData({
      type: 'products',
      offset: startIndex,
      limit: stopIndex - startIndex
    });
  };

  _rowRenderer = (i) => {
    const { items } = this.props;

    if (isEmpty(items)) return 'no data';
    if (items[i] === dataStatus.LOADING) return 'Loading';
    if (items[i] === dataStatus.FAILED) return 'Failed to load';

    return (
      <div className="grid" style={ { height: '100%' } }>
        <div className="col-1-1">
          <AutoSizer disableHeight>
            { ({ width }) => (
              <SceneGrid sceneImage={ items[i].sceneImage }
                         sceneNeighborRows={ 2 }
                         sceneLeft={ i % 2 === 0 }
                         imagePool={ items[i].components }
                         onHeightCalculated={ this.setRowHeight }
                         width={ width }
                         id={ i }
              />
            ) }
          </AutoSizer>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div style={ { height: '100vh' } }>
        <InfiniteLoader isRowLoaded={ this.isRowLoaded }
                        loadMoreRows={ this.loadMoreRows }
                        rowsCount={ this.props.total || Infinity }
        >
          { ({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              { ({ width, height }) => {return (
                <VirtualScroll
                  // fixme -- should be possible to remove this partial
                  rowRenderer={ this._rowRenderer }
                  onRowsRendered={ onRowsRendered }
                  width={ width }
                  height={ height }
                  rowHeight={ this.getRowHeight }
                  rowsCount={ this.props.total || get(this.props.items, 'length', 1) }
                  overscanRowsCount={ 2 }
                  ref={ (ref) => { registerChild(ref); this.scroller = ref; }  }
                />
              )} }
            </AutoSizer>
          ) }
        </InfiniteLoader>
      </div>
    );
  }
}
