import {} from '../actions'

export const initialState = {}

export function media (state = initialState, action) {
  switch (action.type) {
    case Constants_1.ADD_MEDIA:
      return {
        ...state,
        [action.payload.id]: action.payload
      }
    case Constants_1.REMOVE_MEDIA: {
      const result = { ...state }
      delete result[action.payload.id]
      return result
    }
    case Constants_1.MEDIA_UPDATED: {
      const existing = state[action.payload.id]
      if (!existing) {
        return state
      }

      return {
        ...state,
        [action.payload.id]: {
          ...existing,
          ...action.payload.updated
        }
      }
    }
    case Constants_1.LEAVE_CALL: {
      const result = { ...state }
      for (const id of Object.keys(state)) {
        const media = state[id]
        if (media.source === 'remote' && media.roomAddress === action.payload.roomAddress) {
          delete result[id]
        }
      }

      return result || {}
    }
    default:
      return state
  }
}

// Selectors
export const getMedia = state => state.media
export const getMediaTrack = (state, id) => state.media[id]

export const getMediaForPeer = (state, peerAddress, kind) => {
  const results = []

  for (const id of Object.keys(state.media)) {
    const media = state.media[id]
    if (media.owner === peerAddress) {
      if (!kind || kind === media.kind) {
        results.push(media)
      }
    }
  }

  return results
}

export const getLocalMedia = (state, kind) => {
  const results = []

  for (const id of Object.keys(state.media)) {
    var media = state.media[id]
    if (media.source === 'local') {
      if (!kind || kind === media.kind) {
        results.push(media)
      }
    }
  }

  return results.sort((a, b) => a.createdAt - b.createdAt)
}

export const getRemoteMedia = (state, kind) => {
  const results = []

  for (const id of Object.keys(state.media)) {
    const media = state.media[id]
    if (media.source === 'remote') {
      if (!kind || kind === media.kind) {
        results.push(media)
      }
    }
  }

  return results
}

export const getSharedMedia = (state, kind) => {
  const results = []

  for (const id of Object.keys(state.media)) {
    const media = state.media[id]
    if (media.source === 'local' && media.shared) {
      if (!kind || kind === media.kind) {
        results.push(media)
      }
    }
  }

  return results
}
