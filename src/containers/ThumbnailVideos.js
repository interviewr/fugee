import { connect } from 'react-redux'
import { SET_PINNED_PEER } from '../actions'
import ThumbnailVideos from '../components/molecules/ThumbnailVideos'

const mapStateToProps = state => ({
  peers: state.peers.ids,
  pinnedPeerId: state.peers.pinnedPeerId
})

const mapDispatchToProps = dispatch => ({
  setPinnedPeer: id => dispatch({ type: SET_PINNED_PEER, payload: { id } })
})

export default connect(mapStateToProps, mapDispatchToProps)(ThumbnailVideos)
