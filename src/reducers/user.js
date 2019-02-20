import {} from '../actions'

export const initialState = {
  displayName: '',
  globalVolumeLimit: 1,
  mediaEnabled: true,
  requestingMedia: 'video',
  voiceActivityThreshold: -65
}

export function user (state = initialState, action) {
  switch (action.type) {
    case Constants_1.SET_USER_PREFERENCE:
      return {
        ...state,
        ...action.payload
      }
    case Constants_1.RECEIVED_CONFIG:
      return {
        ...state,
        displayName: action.payload.config.displayName || state.displayName || 'Anonymous'
      }
    case Constants_1.DEVICES: {
      var outputDevice = state.audioOutputDeviceId
      if (outputDevice) {
        for (const device of action.payload) {
          if (device.id === outputDevice) {
            return state
          }
        }

        return {
          ...state,
          audioOutputDeviceId: ''
        }
      }

      return state
    }
    default:
      return state
  }
}

// Selectors
export const getUser = state => state.user
export const getUserDisplayName = state => state.user.displayName
export const getAudioOutputDevice = state => state.user.audioOutputDeviceId
export const getGlobalVolumeLimit = state => state.user.globalVolumeLimit
