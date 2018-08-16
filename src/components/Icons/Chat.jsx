import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ChatIcon extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string,
  };

  static defaultProps = {
    width: 24,
    height: 24,
    fill: '#fff',
  };

  render() {
    const { width, height, fill } = this.props;

    return (
      <svg
        fill={fill}
        height={height}
        viewBox="0 0 24 24"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0h24v24H0V0z"
          fill="none"
        />
        <path
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
        />
      </svg>
    );
  }
}

export default ChatIcon;
