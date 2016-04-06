import React from 'react';
import { connect } from 'react-redux';
import { VirtualScroll, InfiniteLoader, AutoSizer } from 'react-virtualized';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { partial, get, map, debounce, isEmpty } from 'lodash';

import {
  selectData, fetchDataIfNeeded as fetchData, status as dataStatus
} from 'modules/data';
import { PropTypes } from 'helpers/react';
const {
  func, number, oneOfType, objectOf, status, object, shape, arrayOf
} = PropTypes;

// import DataProvider from 'shared-components/DataProvider';
import WidthProvider from 'shared-components/WidthProvider';
import SceneGrid from 'shared-components/SceneGrid';
// import { PrintProps } from 'helpers/debug';

// import { requireAllOfType } from 'helpers/file';
// const images = requireAllOfType(/\.(png|jpg|jpeg)$/, '../static/images');


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
      this.setState({
        rowHeights: {
          ...this.state.rowHeights,
          [i]: height
        }
      });
    }
  };

  getRowHeight = (i) => {
    return this.state.rowHeights[i] || 20;

    // const ref = this._rowRefs[i];
    // return ref && ref.getHeight() || 0;
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

  _rowRenderer = (width, i) => {
    const { items } = this.props;

    if (isEmpty(items)) return 'no data';
    if (items[i] === dataStatus.LOADING) return 'Loading';
    if (items[i] === dataStatus.FAILED) return 'Failed to load';

    return (
        <SceneGrid sceneImage={ items[i].sceneImage }
                   sceneNeighborRows={ 1 }
                   imagePool={ map(items[i].components, 'image') }
                   onHeightCalculated={ this.setRowHeight }
                   width={ width }
                   id={ i }
        />
    );
  };

  render() {
    return (
      <div className="grid grid-pad" style={ { paddingTop: 0 } }>
        <div className="col-1-1">
          <div className="content" style={ { height: '100vh' } }>
            <InfiniteLoader isRowLoaded={ this.isRowLoaded }
                            loadMoreRows={ this.loadMoreRows }
                            rowsCount={ this.props.total || Infinity }
            >
              { ({ onRowsRendered, registerChild }) => (
                <AutoSizer>
                  { ({ width, height }) => (
                    <VirtualScroll
                      // fixme -- should be possible to remove this partial
                      rowRenderer={ partial(this._rowRenderer, width) }
                      onRowsRendered={ onRowsRendered }
                      width={ width }
                      height={ height }
                      rowHeight={ this.getRowHeight }
                      rowsCount={ this.props.total || get(this.props.items, 'length', 1) }
                      overscanRowsCount={ 2 }
                      ref={ (ref) => { registerChild(ref); this.scroller = ref; }  }
                    />
                  ) }
                </AutoSizer>
              ) }
            </InfiniteLoader>
          </div>
        </div>
      </div>
    );
  }
}


// {
  /**/
// }


// (<SceneGrid sceneImage={ images[4] }
//             sceneNeighborRows={ 2 }
//             imagePool={ [...images, ...images, ...images] }
//             onItemClick={ this.handleItemClick }
//             fullScene
//   />
//   < SceneGrid
// sceneImage = { images[3] }
// sceneNeighborRows = { 2 }
// onItemClick = { this.handleItemClick
// }
// imagePool = { [...images
// ] }
// />)
