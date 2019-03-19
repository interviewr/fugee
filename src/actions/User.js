import Constants from './constants'
import { getClient } from '../reducers'

export const setDisplayName = (displayName) =>
  (dispatch, getState) => {
    const client = getClient(getState())
    dispatch({
      payload: {
        displayName: displayName
      },
      type: Constants.SET_USER_PREFERENCE
    })

    if (client) {
      client.sendAllRoomsPresence()
    }
  }

export const setDesiredMedia = (mediaKind, roomAddress) =>
  (dispatch, getState) => {
    const client = getClient(getState())
    dispatch({
      payload: {
        requestingMedia: mediaKind
      },
      type: Constants.SET_USER_PREFERENCE
    })

    if (client) {
      client.sendAllRoomsPresence()
    }
  }

export const setVoiceActivityThreshold = (threshold = -65) => {
  // Hark_1.setGlobalVoiceActivityThreshold(threshold)
  return {
    payload: {
      voiceActivityThreshold: threshold
    },
    type: Constants.SET_USER_PREFERENCE
  }
}

export const setPushToTalk = (enabled) => ({
  payload: {
    pushToTalk: enabled
  },
  type: Constants.SET_USER_PREFERENCE
})

export const setAudioOutputDevice = (deviceId) => ({
  payload: {
    audioOutputDeviceId: deviceId
  },
  type: Constants.SET_USER_PREFERENCE
})

export const setGlobalVolumeLimit = (globalVolumeLimit = 1) => ({
  payload: {
    globalVolumeLimit: globalVolumeLimit
  },
  type: Constants.SET_USER_PREFERENCE
})
