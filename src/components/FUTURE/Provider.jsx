import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  connectionState: '',
  localMedia: ''
})

const mapDispatchToProps = dispatch => ({
  connect: () => {},
  disconnect: () => {},
  removeAllMedia: () => {}
})

class Provider extends Component {
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

const createConnectionStateComponent = (connectionState) => {
  return connect(mapStateToProps)((props) => {
    const renderProps = {
      connectionState: props.connectionState
    }

    let render = props.render
    if (!render && typeof props.children === 'function') {
      render = props.children
    }

    if (this.props.connectionState === connectionState) {
      return render ? render(renderProps) : props.children
    }

    return null
  })
}

export const NotConnected = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const renderProps = {
    connectionState: props.connectionState
  }

  let render = props.render
  if (!render && typeof props.children === 'function') {
    render = props.children
  }

  if (props.connectionState !== 'connected') {
    return render ? render(renderProps) : props.children
  }

  return null
})

export const Connecting = createConnectionStateComponent('connecting')
export const Connected = createConnectionStateComponent('connected')
export const Disconnected = createConnectionStateComponent('disconnected')
export const Failed = createConnectionStateComponent('failed')

export default connect(mapStateToProps, mapDispatchToProps)(Provider)
