import { findDOMNode } from 'react-dom';
import React, { PropTypes } from 'react';
const { objectOf, string, element, number, bool } = PropTypes;

import { injectInto } from 'helpers/react';

export default class WidthProvider extends React.Component {
  static propTypes = {
    children: element,
    style: objectOf(string),
    injectStyle: bool
  };
  
  state = {
    width: 1280
  };

  componentDidMount() {
    this.node = findDOMNode(this);
    window.addEventListener('resize', this.handleResize);

    setTimeout(() => {
      this.handleResize();
      this.handleResize();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      width: this.node.offsetWidth
    });
  };

  render() {
    const props = {
      width: this.state.width
    };

    const childrenWithProps = injectInto(this.props.children, props);
    // return React.Children.only(childrenWithProps[0]);
    return (
      <div style={ { width: '100%' } }>
        { childrenWithProps }
      </div>
    );
  }
}
