import { connect } from 'react-redux'
import { JOIN_ROOM_PENDING } from '../actions'
import App from '../components/pages/App'

const mapStateToProps = state => ({
  pinnedPeerId: state.peers.pinnedPeerId,
  activePeerId: state.peers.activePeerId
})

const mapDispatchToProps = dispatch => ({
  joinRoom: roomId => dispatch({ type: JOIN_ROOM_PENDING, payload: { roomId } })
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
