import React from 'react';
import { connect } from 'react-redux';
import { VirtualScroll, InfiniteLoader } from 'react-virtualized';
import { get, map } from 'lodash';

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
    items: get(data, 'items', null),
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

  componentWillMount() {
    this.props.fetchData({
      type: 'products',
      offset: 0,
      limit: 10
    });
  }

  componentDidMount() {
    // this.props.fetchData('products', {
    //   offset: 0,
    //   limit: 10
    // });
    this._rowRefs.scroller.recomputeRowHeights();
  }

  componentDidUpdate() {
    this._rowRefs.scroller.recomputeRowHeights();
  }

  _rowRefs = {};

  getRowHeight = (i) => {
    const ref = this._rowRefs[i];
    return ref && ref.getHeight() || 0;
  };

  _rowRenderer = (i) => {
    console.log(i)
    const { items } = this.props;

    if (!items) return 'no data';
    console.log('rendering with', items[i])
    if (items[i] === dataStatus.LOADING) return 'loading';

    return (
      <div className="col-1-1">
        <WidthProvider>
          <SceneGrid sceneImage={ items[i].sceneImage }
                     sceneNeighborRows={ 3 }
                     imagePool={ map(items[i].components, 'image') }
                     ref={ (ref) => this._rowRefs[i] = ref }
          />
        </WidthProvider>
      </div>
    );
  };

  render() {
    console.log(this.props.items)
    return (
      <div className="grid grid-pad">
        <InfiniteLoader isRowLoaded={ () => true }
                        loadMoreRows={ () => true }
                        rowsCount={ this.props.total || Infinity }
        >
          { ({ onRowsRendered, registerChild }) => (
            <WidthProvider>
              <VirtualScroll
                overscanRowsCount={ 6 }
                height={ 1000 }
                rowsCount={ this.props.total || get(this.props.items, 'length', 10) }
                rowHeight={ this.getRowHeight }
                ref={ (ref) => { registerChild(ref); this._rowRefs.scroller = ref; }  }
                onRowsRendered={ onRowsRendered }
                rowRenderer={ this._rowRenderer }
              />
            </WidthProvider>
          ) }
        </InfiniteLoader>
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
