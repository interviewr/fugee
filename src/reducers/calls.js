import {} from '../actions'
import { getRoomByAddress } from './rooms'

export const initialState = {}

const addCall = (state, action) => ({
  ...state,
  [action.payload.roomAddress]: {
    allowedAudioRoles: ['moderator', 'participant'],
    allowedMedia: 'video',
    allowedVideoRoles: ['moderator', 'participant'],
    joined: false,
    recordable: false,
    recordingState: 'offline',
    requestingMedia: undefined,
    roomAddress: action.payload.roomAddress,
    state: 'active'
  }
})

const updatedCall = (state, action) => {
  if (!state[action.payload.roomAddress]) {
    state = addCall(state, action)
  }

  if (action.type === Constants_1.JOIN_CALL) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...state[action.payload.roomAddress],
        joined: true,
        requestingMedia: action.payload.desiredMedia
      }
    }
  }

  if (action.type === Constants_1.LEAVE_CALL) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...state[action.payload.roomAddress],
        joined: false,
        requestingMedia: undefined
      }
    }
  }

  return state
}

export const removeCall = (state, action) => {
  const result = { ...state }
  delete result[action.payload.roomAddress]
  return result
}

export function calls (state = initialState, action) {
  switch (action.type) {
    case Constants_1.JOIN_CALL:
      return updatedCall(state, action)
    case Constants_1.LEAVE_CALL:
      return updatedCall(state, action)
    case Constants_1.LEAVE_ROOM:
      return removeCall(state, action)
    case Constants_1.JOIN_ROOM_SUCCESS:
      return updatedCall(state, action)
    default:
      return state
  }
}

// Selectors
export const getCallForRoom = (state, roomAddress) => state.calls[roomAddress]

export const getJoinedCalls = (state) => {
  const results = []

  for (const id of Object.keys(state.calls)) {
    const call = state.calls[id]
    const room = getRoomByAddress(state, call.roomAddress)

    if (call.joined && room && room.joined) {
      results.push(call)
    }
  }

  return results
}
