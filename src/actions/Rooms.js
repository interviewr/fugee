import * as Constants from './constants'
import { leaveCall } from './Calls'
import { getClient, getAPIConfig } from '../reducers/api'
import { getRoomByAddress } from '../reducers/rooms'

export const fetchRoomConfig = (configUrl, roomName, auth, maxTries, timeout) => {
  return new Promise((resolve) => {
    resolve({
      roomAddress: 'testroom@muc.raven.io' // TODO: hardcoded
    })
  })
}

export const joinRoom = (roomName, opts = {}) =>
  async (dispatch, getState) => {
    const state = getState()
    const client = getClient(state)
    const apiConfig = getAPIConfig(state)

    try {
      const config = await fetchRoomConfig(apiConfig.roomConfigUrl, roomName, apiConfig.credential)
      const existingRoom = getRoomByAddress(state, config.roomAddress)
      if (!existingRoom || (existingRoom && !existingRoom.joined)) {
        if (client) {
          client.joinRoom(config.roomAddress, opts.password, opts.autoJoinCall)
        }

        dispatch({
          payload: {
            autoJoinCall: (opts.autoJoinCall === undefined ? true : opts.autoJoinCall),
            providedPassword: opts.password,
            providedRoomName: roomName,
            roomAddress: config.roomAddress
          },
          type: Constants.JOIN_ROOM
        })
      }
    } catch (error) {
      dispatch(joinRoomFailed('', false))
    }
  }

export const joinRoomFailed = (roomAddress, passwordRequired) => ({
  payload: {
    passwordRequired: passwordRequired,
    roomAddress: roomAddress
  },
  type: Constants.JOIN_ROOM_FAILED
})

export const joinRoomSuccess = (roomAddress, selfAddress, roomId, role) =>
  (dispatch, getState) => {
    dispatch({
      payload: {
        id: roomId,
        role: role,
        roomAddress: roomAddress,
        selfAddress: selfAddress
      },
      type: Constants.JOIN_ROOM_SUCCESS
    })

    const client = getClient(getState())
    if (client) {
      client.mesh.updateConnections()
    }
  }

export const leaveRoom = (roomAddress) =>
  (dispatch, getState) => {
    const client = getClient(getState())
    dispatch(leaveCall(roomAddress))

    if (client) {
      client.sendRoomPresence(roomAddress, {
        type: 'unavailable'
      })
    }

    dispatch({
      payload: {
        roomAddress: roomAddress
      },
      type: Constants.LEAVE_ROOM
    })

    if (client) {
      client.mesh.updateConnections()
    }
  }

export const unlockRoom = (roomAddress) =>
  (dispatch, getState) => {
    const state = getState()
    const client = getClient(state)

    if (client) {
      client.unlockRoom(roomAddress)
    }

    dispatch({
      payload: {
        roomAddress: roomAddress
      },
      type: Constants.UNLOCK_ROOM
    })
  }

export const destroyRoom = (roomAddress) =>
  async (dispatch, getState) => {
    const client = getClient(getState())

    try {
      if (!client) {
        return
      }

      await client.destroyRoom(roomAddress)

      dispatch({
        payload: {
          roomAddress: roomAddress
        },
        type: Constants.DESTROY_ROOM
      })
    } catch (error) {
      console.error(error)
    }
  }

export const roomUnlocked = (roomAddress) => ({
  payload: {
    roomAddress: roomAddress
  },
  type: Constants.ROOM_UNLOCKED
})
