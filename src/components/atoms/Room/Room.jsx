import React from 'react'
import PropTypes from 'prop-types'

class Room extends React.Component {
  static propTypes = {
    connectionState: PropTypes.string,
    join: PropTypes.func.isRequired,
    lock: PropTypes.func.isRequired,
    unlock: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    call: PropTypes.object,
    room: PropTypes.shape({
      id: PropTypes.string,
      address: PropTypes.string,
      autoJoinCall: PropTypes.bool,
      passwordRequired: PropTypes.bool,
      password: PropTypes.string,
      unreadCount: PropTypes.number,
      joined: PropTypes.bool,
      providedName: PropTypes.string,
      providedPassword: PropTypes.string,
      selfAddress: PropTypes.string,
      selfRole: PropTypes.string,
      roomState: PropTypes.oneOf(['joining', 'joined', 'password-required', 'failed', 'ended'])
    }),
    peers: PropTypes.array,
    localMedia: PropTypes.array,
    remoteMedia: PropTypes.array,
    roomAddress: PropTypes.string,
    password: PropTypes.string,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  // TODO: add default params
  static defaultProps = {}

  componentDidMount () {
    if (this.props.connectionState === 'connected') { // TODO: move into constants (api)
      this.props.join()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.connectionState !== 'connected') {
      return
    }

    if (this.props.connectionState !== prevProps.connectionState) {
      this.props.join()
      return
    }

    if (!this.props.room) {
      return
    }

    if (this.props.password !== prevProps.password) {
      if (this.props.room.roomState === 'joined') {
        if (this.props.password) {
          this.props.lock(this.props.roomAddress, this.props.password)
        } else {
          this.props.unlock(this.props.roomAddress)
        }
      } else {
        this.props.join()
      }
    }
  }

  componentWillUnmount () {
    this.props.leave(this.props.roomAddress)
  }

  render () {
    const renderProps = {
      call: this.props.call || {},
      joined: this.props.room ? this.props.room.joined : false,
      localMedia: this.props.localMedia || [],
      peers: this.props.peers || [],
      remoteMedia: this.props.remoteMedia || [],
      room: this.props.room || {}
    }

    let render = this.props.render
    if (!render && typeof this.props.children === 'function') {
      render = this.props.children
    }
    return render ? render(renderProps) : this.props.children
  }
}

export default Room
