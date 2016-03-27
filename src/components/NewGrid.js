import { map, takeWhile, drop, range, sum } from 'lodash';
import React, { PropTypes } from 'react';
// const { number } = PropTypes;

import WidthProvider from 'shared-components/WidthProvider';

function aspectRatio({ width, height }) {
  return width / height;
}

function balancedRow(imagePool, idealHeight, containerWidth) { //-- returns the images, and the scale needed for them to fit in the width
  const images = [...imagePool];

  let rowWidthAtIdealHeight = 0;
  const rowImages = takeWhile(images, (image) => {
    const imageAspectRatio = aspectRatio(image);
    const scaledImageWidth = idealHeight * imageAspectRatio;


    if (rowWidthAtIdealHeight < containerWidth) {
      rowWidthAtIdealHeight += scaledImageWidth;
      return true;
    }

    return false;
  });

  const rowAspectRatio = aspectRatio({ width: rowWidthAtIdealHeight, height: idealHeight });
  const rowHeightAtContainerWidth = containerWidth / rowAspectRatio;

  return {
    images: rowImages,
    height: rowHeightAtContainerWidth
  };
}

function SceneGrid({ sceneImage, sceneNeighborRows = 2, imagePool = [], width, sceneLeft }) {
  let remainingImages = [...imagePool];

  const idealRowHeight = sceneImage.height / sceneNeighborRows;

  const neighborRows = range(0, sceneNeighborRows).map(_ => {
    const { images, height } = balancedRow(remainingImages, idealRowHeight, width);
    remainingImages = drop(remainingImages, images.length);

    return { images, height };
  });

  const combinedNeighborRowHeight = sum(map(neighborRows, 'height'));
  const sceneAspectRatio = aspectRatio(sceneImage);
  const scaledSceneWidth = combinedNeighborRowHeight * sceneAspectRatio;
  const fullCombinedWidth = scaledSceneWidth + width; // neighbor rows use full container width

  // what percentage smaller does the combined width of scene + neighbors need to be, to fit in the container width?
  const scaleFactor = width / fullCombinedWidth;

  return (
    <div style={ { 'line-height': '0' } }>
      <div className="scene-image">
        <div style={ { float: sceneLeft ? 'left' : 'right' } }>
          <img { ...sceneImage }
            width={ scaledSceneWidth * scaleFactor }
            height={ (scaledSceneWidth / aspectRatio(sceneImage)) * scaleFactor }
          />
        </div>
      </div>

      <div>
        {
          neighborRows.map(({ images, height }, i) => (
            <div key={ i }>
              {
                images.map(image => (
                  <img { ...image }
                    height={ height * scaleFactor }
                    width={ aspectRatio(image) * height * scaleFactor }
                    key={ image.src }
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default class App extends React.Component {
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


function requireAll(r) {
  return r.keys().map(r);
}

const images = requireAll(require.context(
  '../static/images',
  true, // include subdirectories
  /\.(png|jpg|jpeg)$/
));
