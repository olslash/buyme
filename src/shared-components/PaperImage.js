import React from 'react';
//import {} from 'lodash';
import Paper from 'material-ui/lib/paper';

import { PropTypes } from 'helpers/react';
const { number, string } = PropTypes;


export default function PaperImage({
  src, height, width, top = 0, left = 0, margin = 0, zDepth = 1, style
}) {
  const marginHeight = height - margin;
  const marginWidth = width - margin;

  const baseStyles = {
    // display: 'inline-block',
    position: 'absolute',
    transform: `translate(${left}px,${top}px)`
  };

  const marginWrapperStyle = {
    ...baseStyles,
    ...style,
    // wrapper gets original h & w, inner gets h & w - margin
    height,
    width
  };

  let paperStyle = {
    height: marginHeight,
    width: marginWidth
  };

  // props.style must only be applied to outermost div
  // (if no margin is specified, this is the <Paper> itself
  if (margin === 0) {
    paperStyle = {
      ...style
    };
  }

  const PaperImage = (
    <Paper zDepth={ zDepth }
           style={ paperStyle }
    >
      <img height={ marginHeight }
           width={ marginWidth }
           src={ src }
      />
    </Paper>
  );


  return margin !== 0
    // invisible wrapper is here so that we can do a fake margin by
    // scaling down the image inside it
    ? <div style={ marginWrapperStyle }>{ PaperImage }</div>
    : PaperImage;
}

PaperImage.propTypes = {
  height: number,
  width: number,
  src: string,
  zDepth: number
};
