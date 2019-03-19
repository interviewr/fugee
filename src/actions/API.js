import Constants from './constants'
import Signal from '../services/signal'
import { getClient } from '../reducers/api'

const connectionStateChanged = (connectionState) => ({
  payload: connectionState,
  type: Constants.CONNECTION_STATE_CHANGE
})

const receivedConfig = (configUrl, config, userData) => ({
  payload: {
    config: config,
    configUrl: configUrl,
    token: userData
  },
  type: Constants.RECEIVED_CONFIG
})

const receivedConfigError = () => ({
  type: Constants.RECEIVED_CONFIG_ERROR
})

export const connect = (configUrl, userData) =>
  async (dispatch, getState) => {
    let config
    dispatch(connectionStateChanged('connecting'))

    try {
      config = await fetchConfig(configUrl, userData) // TODO: use guest config here
      dispatch(receivedConfig(configUrl, config, userData))
    } catch (error) {
      dispatch(receivedConfigError(error))
      dispatch(connectionStateChanged('failed'))
    }

    const signalingClient = new Signal(dispatch, getState, {
      jid: config.userId,
      password: config.credential,
      resource: config.id,
      wsURL: config.signalingUrl
    })

    dispatch({
      payload: signalingClient,
      type: Constants.SIGNALING_CLIENT
    })

    signalingClient.connect()
  }

export const disconnect = () =>
  (dispatch, getState) => {
    const signal = getClient(getState())
    if (signal) {
      signal.disconnect()
    }

    dispatch({ type: Constants.SIGNALING_CLIENT_SHUTDOWN })
  }
