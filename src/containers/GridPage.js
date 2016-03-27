import React from 'react';

import { requireAllOfType } from 'helpers/file';
const images = requireAllOfType(/\.(png|jpg|jpeg)$/, '../static/images');

import WidthProvider from 'shared-components/WidthProvider';
import SceneGrid from 'shared-components/SceneGrid';

export default class GridPage extends React.Component {
  render() {
    return (
      <div className="grid grid-pad">
        <div className="col-1-1">
          <WidthProvider>
            <SceneGrid sceneImage={ images[3] }
                       sceneNeighborRows={ 2 }
                       imagePool={ images }
            />
            <SceneGrid sceneImage={ images[3] }
                       sceneNeighborRows={ 2 }
                       imagePool={ images }
                       sceneLeft
            />
          </WidthProvider>
        </div>
      </div>
    );
  }
}
