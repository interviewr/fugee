import * as Constants from './constants'
import { getClient } from '../reducers/api'

export const peerOnline = (roomAddress, peerAddress, opts) =>
  (dispatch, getState) => {
    dispatch({
      payload: {
        displayName: opts.displayName,
        joinedCall: opts.joinedCall || false,
        peerAddress: peerAddress,
        requestingMedia: opts.requestingMedia || 'none',
        role: opts.role,
        roomAddress: roomAddress
      },
      type: Constants.PEER_ONLINE
    })

    const client = getClient(getState())
    if (client) {
      client.mesh.updateConnections()
    }
  }

export const peerOffline = (roomAddress, peerAddress) =>
  (dispatch) => {
    dispatch({
      payload: {
        peerAddress: peerAddress,
        roomAddress: roomAddress
      },
      type: Constants.PEER_OFFLINE
    })
  }

export const peerUpdated = (peerAddress, updated) =>
  (dispatch, getState) => {
    dispatch({
      payload: {
        peerAddress: peerAddress,
        updated: updated
      },
      type: Constants.PEER_UPDATED
    })

    const client = getClient(getState())
    if (client) {
      client.mesh.updateConnections()
    }
  }

export const limitPeerVolume = (peerAddress, volumeLimit) => ({
  payload: {
    peerAddress: peerAddress,
    updated: {
      volumeLimit: volumeLimit
    }
  },
  type: Constants.PEER_UPDATED
})
