import * as Constants from './constants'
import Signal from '../services/signal'
import { getClient } from '../reducers/api'

const fetchConfig = async () => {
  return new Promise((resolve) => {
    resolve({
      // userId: 'admin@localhost',
      userId: `admin${Math.floor(Math.random() * 100)}@anon.raven.io`,
      credential: '',
      id: '',
      signalingUrl: 'ws://localhost:5280/xmpp-websocket/',
      iceServers: [{
        host: 'stun.l.google.com',
        password: '',
        port: '19302',
        type: 'stun',
        username: ''
      }, {
        host: 'global.stun.twilio.com',
        password: '',
        port: '3478',
        type: 'stun',
        username: '',
        transport: 'udp'
      }]
    })
  })
}

export const connectionStateChanged = (connectionState) => ({
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
