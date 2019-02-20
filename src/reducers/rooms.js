import {} from '../actions'

export const initialState = {}

const updateRoom = (state, action) => {
  const existingRoom = state[action.payload.roomAddress]

  if (!existingRoom) {
    return state
  }

  if (action.type === Constants_1.JOIN_ROOM_FAILED) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...existingRoom,
        joined: false,
        password: '',
        passwordRequired: !!action.payload.passwordRequired,
        roomState: action.payload.passwordRequired ? 'password-required' : 'failed'
      }
    }
  }

  return {
    ...state,
    [action.payload.roomAddress]: {
      ...existingRoom,
      id: action.payload.id,
      joined: true,
      roomState: 'joined',
      selfAddress: action.payload.selfAddress,
      selfRole: action.payload.role
    }
  }
}

// TODO: maybe move all case into separate functions
export function rooms (state = initialState, action) {
  switch (action.type) {
    case Constants_1.JOIN_ROOM:
      return {
        ...state,
        [action.payload.roomAddress]: {
          address: action.payload.roomAddress,
          autoJoinCall: !!action.payload.autoJoinCall,
          id: '',
          joined: false,
          password: action.payload.password || '',
          passwordRequired: false,
          providedName: action.payload.providedRoomName,
          providedPassword: action.payload.providedPassword,
          roomState: 'joining',
          selfAddress: '',
          selfRole: 'none',
          unreadCount: 0
        }
      }
    case Constants_1.JOIN_ROOM_FAILED:
      return updateRoom(state, action)
    case Constants_1.JOIN_ROOM_SUCCESS:
      return updateRoom(state, action)
    case Constants_1.LEAVE_ROOM: {
      const result = { ...state }
      delete result[action.payload.roomAddress]
      return result
    }
    case Constants_1.LOCK_ROOM:
    case Constants_1.UNLOCK_ROOM:
    case Constants_1.ROOM_LOCKED:
    case Constants_1.ROOM_UNLOCKED: {
      const existingRoom = state[action.payload.roomAddress]

      if (!existingRoom) {
        return state
      }

      switch (action.type) {
        case Constants_1.LOCK_ROOM:
        case Constants_1.ROOM_LOCKED:
          return {
            ...state,
            [action.payload.roomAddress]: {
              ...existingRoom,
              password: action.payload.password,
              passwordRequired: true,
              providedPassword: undefined
            }
          }
        case Constants_1.ROOM_UNLOCKED:
          return {
            ...state,
            [action.payload.roomAddress]: {
              ...existingRoom,
              password: '',
              passwordRequired: false,
              providedPassword: undefined
            }
          }
      }

      return state
    }
    default:
      return state
  }
}

// Selectors
export const getRooms = state => state.rooms
export const getRoomByAddress = (state, roomAddress) => state.rooms[roomAddress]

export const getRoomByProvidedName = (state, roomName) => {
  for (const roomAddress of Object.keys(state.simplewebrtc.rooms)) {
    if (state.rooms[roomAddress].providedName === roomName) {
      return state.rooms[roomAddress]
    }
  }
}
