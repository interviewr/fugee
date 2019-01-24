import { connect } from 'react-redux'
import ActionsBar from '../components/molecules/ActionBar'
import {
  MUTE_PENDING,
  UNMUTE_PENDING,
  PAUSE_VIDEO_PENDING,
  RESUME_VIDEO_PENDING,
  END_CALL
} from '../actions'

const mapStateToProps = state => ({
  isMicrophoneEnabled: state.actionsBar.isMicrophoneEnabled,
  isCameraEnabled: state.actionsBar.isCameraEnabled
})

const mapDispatchToProps = dispatch => ({
  muteMicrophone: () => dispatch({ type: MUTE_PENDING }),
  unmuteMicrophone: () => dispatch({ type: UNMUTE_PENDING }),
  pauseVideo: () => dispatch({ type: PAUSE_VIDEO_PENDING }),
  resumeVideo: () => dispatch({ type: RESUME_VIDEO_PENDING }),
  endCall: () => dispatch({ type: END_CALL })
})

export default connect(mapStateToProps, mapDispatchToProps)(ActionsBar)
