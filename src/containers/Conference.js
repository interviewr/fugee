import { connect } from 'react-redux'
import { JOIN_ROOM_PENDING } from '../actions'
import Conference from '../components/pages/Conference'

const mapStateToProps = (_, ownProps) => ({
  roomId: ownProps.match.params.roomId
})

const mapDispatchToProps = dispatch => ({
  joinRoom: roomId => dispatch({ type: JOIN_ROOM_PENDING, payload: { roomId } })
})

export default connect(mapStateToProps, mapDispatchToProps)(Conference)
