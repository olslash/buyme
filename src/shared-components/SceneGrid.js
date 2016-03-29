import { map, takeWhile, drop, range, sum } from 'lodash';
import React from 'react';

import { PropTypes } from 'helpers/react';
const { string, number, shape, arrayOf, bool } = PropTypes;

import PaperImage from 'shared-components/PaperImage';

function aspectRatio({ width, height }) {
  return width / height;
}

function balancedRow(imagePool, idealHeight, containerWidth) { //-- returns the images, and the scale needed for them to fit in the width
  const images = [...imagePool];
  let resultHeight;

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

  if (!(rowWidthAtIdealHeight >= containerWidth)) {
    // not enough images to fill the row; use ideal height and leave space, to avoid scaling the few images too large.
    resultHeight = idealHeight;
  } else if (images.length === 0) {
    // no images in pool; use 0 height to avoid NaN
    resultHeight = 0;
  } else {
    // otherwise use the calculated height to scale the combined row to container width
    resultHeight  = rowHeightAtContainerWidth;
  }

  return {
    images: rowImages,
    height: resultHeight
  };
}

export default function SceneGrid({
  sceneImage, sceneNeighborRows = 2, imagePool = [], width, margin = 10, sceneLeft, extraRowsIdealHeight = 150
}) {
  const containerWidth = width - 1; // stay 1 pixel away from the edge to prevent browser reflow bugs.
  let remainingImages = [...imagePool];

  const idealRowHeight = sceneImage.height / sceneNeighborRows;

  const neighborRows = range(sceneNeighborRows).map(_ => {
    const { images, height } = balancedRow(remainingImages, idealRowHeight, containerWidth);
    remainingImages = drop(remainingImages, images.length);

    return { images, height };
  });

  const combinedNeighborRowHeight = sum(map(neighborRows, 'height'));
  const sceneAspectRatio = aspectRatio(sceneImage);
  const scaledSceneWidth = combinedNeighborRowHeight * sceneAspectRatio;
  const fullCombinedWidth = scaledSceneWidth + containerWidth; // neighbor rows use full container width

  // what percentage smaller does the combined width of scene + neighbors need to be, to fit in the container width?
  const scaleFactor = containerWidth / fullCombinedWidth;

  const finalSceneImageWidth = scaledSceneWidth * scaleFactor || 0;
  const finalSceneImageHeight = (scaledSceneWidth / aspectRatio(sceneImage)) * scaleFactor || 0;

  return (
    <div style={ { 'lineHeight': 0, 'marginBottom': 20 } }>
      <div className="scene-image">
        <PaperImage style={ { float: sceneLeft ? 'left' : 'right' } }
                    margin={ margin }
                    height={ finalSceneImageHeight }
                    width={ finalSceneImageWidth }
                    src={ sceneImage.src }
        />
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
                    <PaperImage margin={ margin }
                                height={ imageHeight }
                                width={ imageWidth }
                                src={ image.src }
                                key={ image.src }
                    />
                  );
                })
              }
            </div>
          ))
        }
      </div>
      <div style={ { marginTop: 5 } }>
        { /* margin required to prevent row above interfering with layout */ }
        {
          range(remainingImages.length).map((i) => {
            if (remainingImages.length === 0) {
              // will be filtered out so we don't get extra divs
              return null;
            }

            const { images, height } = balancedRow(remainingImages, extraRowsIdealHeight, containerWidth);
            remainingImages = drop(remainingImages, images.length);

            return (
              <div key={ i }>
                {
                  images.map(image => (
                    <PaperImage src={ image.src }
                                height={ height }
                                width={ aspectRatio(image) * height }
                                margin={ margin }
                                key={ image.src }
                    />
                  ))
                }
              </div>
            );
          }).filter(Boolean)
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
