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
              overscanRowsCount={ 0 }
              height={ 1000 }
              rowsCount={ 20 }
              rowHeight={ 750 }
              rowRenderer={ i => (
                <div className="col-1-1">
                  <DataProvider type="products">
                    <PrintProps/>
                  </DataProvider>
                </div>
              )}
            />
          </WidthProvider>
      </div>
    );
  }
}


// {
  /*<WidthProvider>
   <SceneGrid sceneImage={ images[4] }
   sceneNeighborRows={ 2 }
   imagePool={ images }
   />
   </WidthProvider>*/
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
