import {
  PEER_ONLINE,
  PEER_OFFLINE,
  PEER_UPDATED,
  LEAVE_ROOM
} from '../actions/constants'

export const initialState = {}

export function peers (state = initialState, action) {
  switch (action.type) {
    case PEER_ONLINE: {
      if (state[action.payload.peerAddress]) {
        const existingPeer = state[action.payload.peerAddress]
        if (!existingPeer) {
          return state
        }

        return {
          ...state,
          [action.payload.peerAddress]: {
            ...existingPeer,
            ...action.payload
          }
        }
      }

      return {
        ...state,
        [action.payload.peerAddress]: {
          address: action.payload.peerAddress,
          chatState: 'active',
          displayName: action.payload.displayName || '',
          joinedCall: action.payload.joinedCall || false,
          muted: false,
          requestingAttention: false,
          requestingMedia: action.payload.requestingMedia || 'none',
          role: action.payload.role,
          roomAddress: action.payload.roomAddress,
          rtt: '',
          speaking: false,
          volume: -Infinity,
          volumeLimit: 0.8
        }
      }
    }
    case PEER_OFFLINE: {
      const result = { ...state }
      delete result[action.payload.peerAddress]
      return result
    }
    case PEER_UPDATED: {
      const existingPeer = state[action.payload.peerAddress]
      if (!existingPeer) {
        return state
      }

      return {
        ...state,
        [action.payload.peerAddress]: {
          ...existingPeer,
          ...action.payload
        }
      }
    }
    case LEAVE_ROOM: {
      const result = { ...state }

      for (const peerAddress of Object.keys(state)) {
        const peer = state[peerAddress]
        if (peer.roomAddress === action.payload.roomAddress) {
          delete result[peerAddress]
        }
      }

      return result
    }
    default:
      return state
  }
}

// Selectors
export const getPeerByAddress = (state, peerAddress) => state.peers[peerAddress]

export const getPeersForRoom = (state, roomAddress) => {
  const peers = []

  for (const peerAddress of Object.keys(state.peers)) {
    if (state.peers[peerAddress].roomAddress === roomAddress) {
      peers.push(state.peers[peerAddress])
    }
  }

  return peers
}

export const getPeersForCall = (state, roomAddress) => {
  const results = []

  for (const id of Object.keys(state.peers)) {
    const peer = state.peers[id]
    if (peer.roomAddress === roomAddress && peer.joinedCall) {
      results.push(peer)
    }
  }

  return results
}

export const getActiveSpeakersForCall = (state, roomAddress) => {
  const results = []

  for (const id of Object.keys(state.peers)) {
    const peer = state.peers[id]
    if (peer.roomAddress === roomAddress && peer.joinedCall && peer.speaking) {
      results.push(peer)
    }
  }

  return results
}

export const countPeersWantingVideo = (state) => {
  let count = 0
  const peers = Object.keys(state.peers)

  peers.forEach((id) => {
    const peer = state.peers[id]
    if (peer.requestingMedia === 'video') {
      count += 1
    }
  })

  return count
}
