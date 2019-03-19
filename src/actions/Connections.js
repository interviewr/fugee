import Constants from './constants'

export const addConnection = (peerAddress, sessionId) => ({
  payload: {
    id: sessionId,
    peerAddress: peerAddress
  },
  type: Constants.PEER_CONNECTION_ADDED
})

export const removeConnection = (peerAddress, sessionId) => ({
  payload: {
    id: sessionId,
    peerAddress: peerAddress
  },
  type: Constants.PEER_CONNECTION_REMOVED
})

export const updateConnection = (peerAddress, sessionId, updated) => ({
  payload: {
    id: sessionId,
    peerAddress: peerAddress,
    updated: updated
  },
  type: Constants.PEER_CONNECTION_UPDATED
})
