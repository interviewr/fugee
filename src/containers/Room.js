import { connect } from 'react-redux'
import Room from '../components/atoms/Room'
import {
  getRoomByAddress,
  getRoomByProvidedName
} from '../reducers/rooms'
import { getCallForRoom } from '../reducers/calls'
import { getConnectionState } from '../reducers/api'
import { getLocalMedia, getRemoteMedia } from '../reducers/media'
import { getPeersForRoom } from '../reducers/peers'
import Actions from '../actions'

const mapStateToProps = (state, props) => {
  let room
  if (props.roomAddress) {
    room = getRoomByAddress(state, props.roomAddress)
  } else if (props.name) {
    room = getRoomByProvidedName(state, props.name)
  }

  return {
    call: room ? getCallForRoom(state, room.address) : undefined,
    connectionState: getConnectionState(state),
    localMedia: getLocalMedia(state),
    peers: room ? getPeersForRoom(state, room.address) : [],
    remoteMedia: getRemoteMedia(state),
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
  unlock: (roomAddress) => dispatch(Actions.unlockRoom(roomAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Room)
