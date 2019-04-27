import { connect } from 'react-redux'
import RequestUserMedia from '../components/atoms/RequestUserMedia'
import { getDevicePermissions } from '../reducers/devices'
import Actions from '../actions'

const mapStateToProps = (state, props) => {
  const permissions = getDevicePermissions(state)

  return {
    ...props,
    requestingCameraCapture: permissions.requestingCameraCapture,
    requestingCapture: permissions.requestingCapture,
    requestingMicrophoneCapture: permissions.requestingMicrophoneCapture
  }
}

const mapDispatchToProps = dispatch => ({
  addLocalAudio: (track, stream, replace) => dispatch(Actions.addLocalAudio(track, stream, replace)),
  addLocalVideo: (track, stream, mirrored, replace) => dispatch(Actions.addLocalVideo(track, stream, mirrored, replace)),
  cameraPermissionDenied: (err) => dispatch(Actions.cameraPermissionDenied(err)),
  deviceCaptureRequest: (camera, microphone) => dispatch(Actions.deviceCaptureRequest(camera, microphone)),
  fetchDevices: () => dispatch(Actions.fetchDevices()),
  microphonePermissionDenied: (err) => dispatch(Actions.microphonePermissionDenied(err)),
  removeAllMedia: (kind) => dispatch(Actions.removeAllMedia(kind)),
  shareLocalMedia: (id) => dispatch(Actions.shareLocalMedia(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestUserMedia)
