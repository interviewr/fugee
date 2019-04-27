import {
  JOIN_ROOM,
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_FAILED,
  LEAVE_ROOM
} from '../actions/constants'

export const initialState = {}

const updateRoom = (state, action) => {
  const existingRoom = state[action.payload.roomAddress]

  if (!existingRoom) {
    return state
  }

  if (action.type === JOIN_ROOM_FAILED) {
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
    case JOIN_ROOM:
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
    case JOIN_ROOM_FAILED:
      return updateRoom(state, action)
    case JOIN_ROOM_SUCCESS:
      return updateRoom(state, action)
    case LEAVE_ROOM: {
      const result = { ...state }
      delete result[action.payload.roomAddress]
      return result
    }
    default:
      return state
  }
}

// Selectors
export const getRooms = state => state.rooms
export const getRoomByAddress = (state, roomAddress) => state.rooms[roomAddress]

export const getRoomByProvidedName = (state, roomName) => {
  for (const roomAddress of Object.keys(state.rooms)) {
    if (state.rooms[roomAddress].providedName === roomName) {
      return state.rooms[roomAddress]
    }
  }
}
