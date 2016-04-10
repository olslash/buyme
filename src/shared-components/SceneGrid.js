// ********
// TODO:
//   refactor to remove stuff from render
// ********

import { map, takeWhile, drop, range, sum, get, reduce } from 'lodash';
import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

// import { scan } from 'helpers/fp';
import { PropTypes } from 'helpers/react';
const { string, number, shape, arrayOf, bool, func, oneOfType } = PropTypes;

import PaperImage from 'shared-components/PaperImage';

function aspectRatio({ width, height }) {
  return width / height;
}

function balancedRow(imagePool, idealHeight, containerWidth) { //-- returns the images, and the scale needed for them to fit in the width
  const images = [...imagePool];
  let resultHeight;

  let rowWidthAtIdealHeight = 0;
  const rowImages = takeWhile(images, ({ image }) => {
    const imageAspectRatio = aspectRatio(image);
    const scaledImageWidth = idealHeight * imageAspectRatio;

    if (rowWidthAtIdealHeight < containerWidth) {
      rowWidthAtIdealHeight += scaledImageWidth;
      return true;
    }

    return false;
  });

  const rowAspectRatio = aspectRatio({ width: rowWidthAtIdealHeight, height: idealHeight });
  const rowHeightAtContainerWidth = (containerWidth / rowAspectRatio) || 0; // protect against NaN for empty rows

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

const imagePropType = shape({
  height: number,
  src: string,
  width: number
});


export default class SceneGrid extends React.Component {
  static propTypes = {
    sceneImage: imagePropType,
    imagePool: arrayOf(shape({
      image: imagePropType
    })),
    sceneNeighborRows: number,
    width: number,
    extraRowsIdealHeight: number,
    margin: number,
    sceneLeft: bool,
    fullScene: bool,
    id: oneOfType([string, number]),
    onItemClick: func,
    onHeightCalculated: func
  };

  static defaultProps = {
    sceneNeighborRows: 2,
    imagePool: [],
    margin: 5,
    extraRowsIdealHeight: 150
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    console.log('didmount')
    this.props.onHeightCalculated(this.props.id, this.getHeight());
  }

  componentDidUpdate() {
    console.log('did update')
    this.props.onHeightCalculated(this.props.id, this.getHeight());
  }

  _height = 0;

  getHeight() {
    return this._height;
    // return this.refs.container && this.refs.container.scrollHeight;
  }

  renderNeighborRows = (neighborRows, scaleFactor, sceneImageWidth) => {
    let colHeightToNow = 0;

    return neighborRows.map(({ images, height }, coli) => {
      colHeightToNow += height * scaleFactor;
      let rowWidthToNow = 0;

      return (
        <div key={ coli }>
          {
            map(images, ({ image, meta }, i) => {
              const imageHeight = height * scaleFactor;
              const imageAspectRatio = aspectRatio(image);
              const imageWidth = imageAspectRatio * height * scaleFactor;

              rowWidthToNow += imageWidth;

              return (
                <PaperImage src={ image.src }
                            margin={ this.props.margin }
                            overlayTitle={ meta.title }
                            height={ imageHeight }
                            width={ imageWidth }
                            key={ image.src }
                            left={
                              this.props.sceneLeft
                                ? sceneImageWidth + (rowWidthToNow - imageWidth)
                                : rowWidthToNow - imageWidth
                            }
                            top={ colHeightToNow - imageHeight }

                />
              );
            })
          }
        </div>
      );
    });
  };

  render() {
    let totalHeight = 0;

    const containerWidth = this.props.width; // stay 1 pixel away from the edge to prevent browser reflow bugs.
    let { sceneNeighborRows } = this.props;

    if (this.props.fullScene) {
      sceneNeighborRows = 0;
    }

    let remainingImages = this.props.imagePool;
    const idealRowHeight = this.props.sceneImage.height / sceneNeighborRows;
    const neighborRows = this.neighborRows = range(sceneNeighborRows).map(_ => {
      const { images, height } = balancedRow(remainingImages, idealRowHeight, containerWidth);
      remainingImages = drop(remainingImages, images.length);

      return { images, height };
    });


    const combinedNeighborRowHeight = sum(map(neighborRows, 'height'));
    const sceneAspectRatio = aspectRatio(this.props.sceneImage);
    const scaledSceneWidth = (combinedNeighborRowHeight || this.props.sceneImage.height) * sceneAspectRatio;
    // neighbor rows initial layout uses full container width, or 0 if there are no neighbor rows
    const neighborRowUnscaledWidth = (sceneNeighborRows > 0 ? containerWidth : 0);
    const fullCombinedWidth = scaledSceneWidth + neighborRowUnscaledWidth;
    // what percentage smaller does the combined width of scene + neighbors need to be, to fit in the container width?
    const scaleFactor = containerWidth / fullCombinedWidth;

    const finalSceneImageWidth = scaledSceneWidth * scaleFactor || 0;
    const finalSceneImageHeight = (scaledSceneWidth / aspectRatio(this.props.sceneImage)) * scaleFactor || 0;

    totalHeight += finalSceneImageHeight;

    let overflowHeightToNow = 0;
    const overflowRows = range(remainingImages.length).map((i) => {
      if (remainingImages.length === 0) {
        // will be filtered out so we don't get extra divs
        return null;
      }

      const { images, height } = balancedRow(remainingImages, this.props.extraRowsIdealHeight, containerWidth);
      remainingImages = drop(remainingImages, images.length);

      totalHeight += height;
      overflowHeightToNow += height;

      let currentRowWidth = 0;
      return (
        <div key={ i }>
          {
            images.map(({ image, meta }) => {
              const imageWidth = aspectRatio(image) * height;
              currentRowWidth += imageWidth;

              return (
                <PaperImage src={ image.src }
                            overlayTitle={ meta.title }
                            height={ height }
                            width={ imageWidth }
                            top={ finalSceneImageHeight + overflowHeightToNow - height }
                            left={ currentRowWidth - imageWidth }
                            margin={ this.props.margin }
                            key={ image.src }
                />
              );
            })
          }
        </div>
      );
    }).filter(Boolean);

    this._height = totalHeight + 50;

    return (
      <div style={ { width: this.props.width } }>
        <PaperImage src={ this.props.sceneImage.src }
                    margin={ this.props.margin }
                    height={ finalSceneImageHeight }
                    width={ finalSceneImageWidth }
                    left={
                      this.props.sceneLeft
                        ? 0
                        : containerWidth - finalSceneImageWidth
                    }
        />
        {
          this.renderNeighborRows(neighborRows, scaleFactor, finalSceneImageWidth)
        }
        {
          overflowRows
        }
      </div>
    );
  }
}
