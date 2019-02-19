import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
  let room
  if (props.roomAddress) {
    room = Selectors_1.getRoomByAddress(state, props.roomAddress)
  } else if (props.name) {
    room = Selectors_1.getRoomByProvidedName(state, props.name)
  }

  return {
    call: room ? Selectors_1.getCallForRoom(state, room.address) : undefined,
    connectionState: Selectors_1.getConnectionState(state),
    localMedia: Selectors_1.getLocalMedia(state),
    peers: room ? Selectors_1.getPeersForRoom(state, room.address) : [],
    remoteMedia: Selectors_1.getRemoteMedia(state),
    room: room,
    roomAddress: room ? room.address : undefined,
    roomState: room ? room.roomState : 'joining'
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  destroy: (roomAddress) => dispatch(Actions.destroyRoom(roomAddress)),
  join: () => dispatch(Actions.joinRoom(props.name, { password: props.password || undefined })),
  leave: (roomAddress) => dispatch(Actions.leaveRoom(roomAddress)),
  lock: (roomAddress, password) => dispatch(Actions.lockRoom(roomAddress, password)),
  unlock: (roomAddress) => dispatch(Actions.unlockRoom(roomAddress)),
})

class Room extends Component {
  componentDidMount () {
    if (this.props.connectionState === 'connected') {
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

  render() {
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

export default connect(mapStateToProps, mapDispatchToProps)(Room)
