import {} from '../actions'

export const initialState = {
  config: {
    credential: '',
    customerData: {},
    iceServers: [],
    id: '',
    orgId: '',
    roomConfigUrl: '',
    signalingUrl: '',
    userId: ''
  },
  configUrl: '',
  connectionAttempts: 0,
  connectionState: 'disconnected',
  signalingClient: undefined,
  token: ''
}

export function api (state = initialState, action) {
  switch (action.type) {
    case Constants_1.SIGNALING_CLIENT:
      return {
        ...state,
        signalingClient: action.payload
      }
    case Constants_1.SIGNALING_CLIENT_SHUTDOWN:
      return {
        ...state,
        connectionState: 'disconnected',
        signalingClient: undefined
      }
    case Constants_1.CONNECTION_STATE_CHANGE:
      return {
        ...state,
        connectionState: action.payload
      }
    case Constants_1.RECEIVED_CONFIG: {
      const config = action.payload.config
      const configUrl = action.payload.configUrl
      const token = action.payload.token || ''

      return {
        ...state,
        config: { ...state.config, config },
        configUrl: configUrl,
        token: token
      }
    }
    default:
      return state
  }
}

// Selectors
export const getAPIConfig = state => state.api.config
export const getUserToken = state => state.api.token
export const getConfigURL = state => state.api.configUrl
export const getClient = state => state.api.signalingClient
export const getConnectionState = state => state.api.connectionState
