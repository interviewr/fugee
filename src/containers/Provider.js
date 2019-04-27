import { connect } from 'react-redux'
import Provider from '../components/atoms/Provider'
import { isSupportedBrowser } from '../reducers'
import { getConnectionState } from '../reducers/api'
import { getLocalMedia } from '../reducers/media'
import Actions from '../actions'

const mapStateToProps = state => ({
  connectionState: getConnectionState(state),
  isSupportedBrowser: isSupportedBrowser(),
  localMedia: getLocalMedia(state)
})

const mapDispatchToProps = (dispatch, props) => ({
  connect: () => dispatch(Actions.connect(props.configUrl, props.userData)),
  disconnect: () => dispatch(Actions.disconnect()),
  removeAllMedia: () => dispatch(Actions.removeAllMedia())
})

const createConnectionStateComponent = (connectionState) => {
  return connect(mapStateToProps)((props) => {
    const renderProps = {
      connectionState: props.connectionState
    }

    let render = props.render
    if (!render && typeof props.children === 'function') {
      render = props.children
    }

    if (props.connectionState === connectionState) {
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
