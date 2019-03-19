import Constants from './constants'

let deviceListener
let devicePollInterval

export const listenForDevices = () =>
  (dispatch) => {
    if (!navigator.mediaDevices) {
      return
    }

    if (!deviceListener) {
      deviceListener = () => {
        dispatch(fetchDevices())
      }
    }

    deviceListener()
    navigator.mediaDevices.addEventListener('devicechange', deviceListener)
    // Safari 12.0 does not emit device change events, but does update its
    // list of devices current.
    if (window.safari) {
      devicePollInterval = setInterval(() => {
        if (deviceListener) {
          deviceListener()
        }
      }, 1000)
    }
  }

export const fetchDevices = () => async (dispatch) => {
  if (!navigator.mediaDevices) {
    return
  }

  const devices = await navigator.mediaDevices.enumerateDevices()
  dispatch(deviceList(devices))
}

export const stopListeningForDevices = () => {
  if (deviceListener) {
    navigator.mediaDevices.removeEventListener('devicechange', deviceListener)
    deviceListener = undefined
  }
  if (devicePollInterval) {
    clearInterval(devicePollInterval)
    devicePollInterval = undefined
  }
}

export const deviceList = (devices) => {
  devices = devices.filter(function (d) {
    // Work around Safari reporting the built-in speakers as a microphone
    if (d.kind === 'audioinput' && d.label === 'MacBook Pro Speakers') {
      return false
    }

    return true
  })

  return {
    payload: devices,
    type: Constants.DEVICES
  }
}

export const cameraPermissionDenied = (error) => ({
  payload: {
    error: error
  },
  type: Constants.CAMERA_PERMISSION_DENIED
})

export const microphonePermissionDenied = (error) => ({
  payload: {
    error: error
  },
  type: Constants.MICROPHONE_PERMISSION_DENIED
})

export const deviceCaptureRequest = (camera, microphone) => ({
  payload: {
    camera: camera,
    microphone: microphone
  },
  type: Constants.DEVICE_CAPTURE
})
