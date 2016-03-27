import { map, takeWhile, drop, range, sum } from 'lodash';
import React from 'react';
import Paper from 'material-ui/lib/paper';

import { PropTypes } from 'helpers/react';
const { string, number, shape, arrayOf, bool } = PropTypes;




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
    height: images.length > 0 ? rowHeightAtContainerWidth : 0
  };
}

export default function SceneGrid({
  sceneImage, sceneNeighborRows = 2, imagePool = [], width, margin = 10, sceneLeft
}) {
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

  const finalSceneImageWidth = scaledSceneWidth * scaleFactor;
  const finalSceneImageHeight = (scaledSceneWidth / aspectRatio(sceneImage)) * scaleFactor;

  return (
    <div style={ { 'lineHeight': '0', 'marginBottom': 20 } }>
      <div className="scene-image">
        <div style={ { float: sceneLeft ? 'left' : 'right', width: finalSceneImageWidth, height: finalSceneImageHeight } }>
          <Paper zDepth={ 3 }
                 style={ {
                   height: finalSceneImageHeight - margin,
                   width: finalSceneImageWidth - margin,
                   display: 'inline-block'
                 } }

          >
            <img { ...sceneImage }
              width={ finalSceneImageWidth - margin }
              height={ finalSceneImageHeight - margin }
            />
          </Paper>
        </div>
      </div>

      <div>
        {
          neighborRows.map(({ images, height }, i) => (
            <div key={ i }>
              {
                images.map(image => {
                  const imageHeight = height * scaleFactor;
                  const imageAspectRatio = aspectRatio(image);
                  const imageWidth = imageAspectRatio * height * scaleFactor;

                  return (
                    // invisible wrapper is here so that we can do a fake margin by scaling down the image inside it
                    <div style={ { height: imageHeight, width: imageWidth, display: 'inline-block' } }
                         key={ image.src }
                    >
                      <Paper zDepth={ 3 }
                             style={ {
                             height: imageHeight - margin,
                             width: imageWidth - margin,
                             display: 'inline-block'
                           } }

                      >
                        <img { ...image }
                          height={ imageHeight - margin }
                          width={ imageWidth - margin }
                        />
                      </Paper>
                    </div>
                  );
                })
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

const imagePropType = shape({
  height: number,
  src: string,
  type: string,
  width: number
});

SceneGrid.propTypes = {
  sceneImage: imagePropType,
  sceneNeighborRows: number,
  imagePool: arrayOf(imagePropType),
  width: number,
  margin: number,
  sceneLeft: bool
};
