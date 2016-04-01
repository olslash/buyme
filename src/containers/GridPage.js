import React from 'react';
import { VirtualScroll } from 'react-virtualized';

import { requireAllOfType } from 'helpers/file';
const images = requireAllOfType(/\.(png|jpg|jpeg)$/, '../static/images');

import DataProvider from 'shared-components/DataProvider';
import WidthProvider from 'shared-components/WidthProvider';
import SceneGrid from 'shared-components/SceneGrid';
import { PrintProps } from 'helpers/debug';

export default class GridPage extends React.Component {
  render() {
    return (
      <div className="grid grid-pad">

          <WidthProvider>
            <VirtualScroll
              overscanRowsCount={ 100 }
              height={ 1000 }
              rowsCount={ 20 }
              rowHeight={ 1000 }
              rowRenderer={ i => (
                <div className="col-1-1">
                  <WidthProvider>
                    <SceneGrid sceneImage={ images[4] }
                               sceneNeighborRows={ 2 }
                               imagePool={ [...images, ...images, ...images] }
                    />
                  </WidthProvider>
                </div>
              )}
            />
          </WidthProvider>
      </div>
    );
  }
}

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
