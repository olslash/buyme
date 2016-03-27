import { findDOMNode } from 'react-dom';
import React from 'react';

import { injectInto, PropTypes } from 'helpers/react';
const { objectOf, string, children, bool } = PropTypes;

export default class WidthProvider extends React.Component {
  static propTypes = {
    children: children,
    style: objectOf(string),
    injectStyle: bool
  };

  state = {
    width: 0
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
