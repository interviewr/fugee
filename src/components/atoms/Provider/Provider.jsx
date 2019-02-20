import React from 'react'
import PropTypes from 'prop-types'

class Provider extends React.Component {
  static propTypes = {
    connect: PropTypes.func.isRequired,
    disconnect: PropTypes.func.isRequired,
    connectionState: PropTypes.string.isRequired,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  componentDidMount () {
    this.props.connect()
  }

  componentWillMount () {
    this.props.disconnect()
  }

  render () {
    const renderProps = {
      connectionState: this.props.connectionState
    }

    let render = this.props.render
    if (!render && typeof this.props.children === 'function') {
      render = this.props.children
    }

    return render ? render(renderProps) : this.props.children
  }
}

export default Provider
