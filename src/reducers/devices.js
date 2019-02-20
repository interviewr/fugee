import {} from '../actions'
import { getMediaTrack } from './media'

export const initialState = {
  cameraPermissionDenied: false,
  cameraPermissionGranted: false,
  devices: [],
  hasAudioOutput: false,
  hasCamera: false,
  hasMicrophone: false,
  microphonePermissionDenied: false,
  microphonePermissionGranted: false,
  requestingCameraCapture: false,
  requestingCapture: false,
  requestingMicrophoneCapture: false
}

export function devices (state = initialState, action) {
  switch (action.type) {
    case Constants_1.DEVICES: {
      const devices = action.payload
      const audioInputs = devices.filter(d => d.kind === 'audioinput')
      const videoInputs = devices.filter(d => d.kind === 'videoinput')
      const audioOutputs = devices.filter(d => d.kind === 'audiooutput')

      return {
        ...state,
        cameraPermissionGranted: videoInputs.filter(d => !!d.label).length > 0,
        devices: devices.filter(d => !!d.label),
        hasAudioOutput: audioOutputs.length > 0,
        hasCamera: videoInputs.length > 0,
        hasMicrophone: audioInputs.length > 0,
        microphonePermissionGranted: audioInputs.filter(d => !!d.label).length > 0
      }
    }
    case Constants_1.CAMERA_PERMISSION_DENIED:
      return {
        ...state,
        cameraPermissionDenied: true
      }
    case Constants_1.MICROPHONE_PERMISSION_DENIED:
      return {
        ...state,
        microphonePermissionDenied: true
      }
    case Constants_1.DEVICE_CAPTURE:
      return {
        ...state,
        equestingCameraCapture: action.payload.camera,
        requestingCapture: action.payload.camera || action.payload.microphone,
        requestingMicrophoneCapture: action.payload.microphone
      }
    default:
      return state
  }
}

// Selectors
export const getDeviceForMediaTrack = (state, id) => {
  const track = getMediaTrack(state, id)

  if (!track) {
    return
  }

  const deviceLabel = track.track.label
  const deviceKind = track.kind + 'input'
  const devices = state.devices.devices

  for (const device of devices) {
    if (deviceLabel === device.label && deviceKind === device.kind) {
      return device
    }
  }
}

export const getDevices = (state, kind) => {
  const devices = state.devices.devices

  if (!kind) {
    return devices
  }

  return devices.filter(device => device.kind === kind)
}

export const getDevicePermissions = (state) => {
  const devices = state.devices

  return {
    cameraPermissionDenied: devices.cameraPermissionDenied,
    cameraPermissionGranted: devices.cameraPermissionGranted,
    hasAudioOutput: devices.hasAudioOutput,
    hasCamera: devices.hasCamera,
    hasMicrophone: devices.hasMicrophone,
    microphonePermissionDenied: devices.microphonePermissionDenied,
    microphonePermissionGranted: devices.microphonePermissionGranted,
    requestingCameraCapture: devices.requestingCameraCapture,
    requestingCapture: devices.requestingCapture,
    requestingMicrophoneCapture: devices.requestingMicrophoneCapture
  }
}
