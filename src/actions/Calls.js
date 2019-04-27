import * as Constants from './constants'
import { removeAllMedia } from './Media'
import { getClient } from '../reducers/api'
import { getJoinedCalls } from '../reducers/calls'

export const startCall = () => {}
export const endCall = () => {}

export const joinCall = (roomAddress, desiredMedia) =>
  (dispatch, getState) => {
    dispatch({
      payload: {
        desiredMedia: desiredMedia,
        roomAddress: roomAddress
      },
      type: Constants.JOIN_CALL
    })

    const client = getClient(getState())
    if (client) {
      client.sendRoomPresence(roomAddress)
      client.mesh.updateConnections()
    }
  }

export const leaveCall = (roomAddress) =>
  (dispatch, getState) => {
    const state = getState()
    const originalCalls = getJoinedCalls(state)
    dispatch({
      payload: {
        roomAddress: roomAddress
      },
      type: Constants.LEAVE_CALL
    })
    const updatedState = getState()
    const remainingCalls = getJoinedCalls(updatedState)
    const client = getClient(state)
    if (client) {
      client.sendRoomPresence(roomAddress)
      client.mesh.updateConnections()
      // const speaking = Selectors.userIsSpeaking(state)
      // if (speaking) {
      //   client.sendAllCallsSpeakingUpdate(true)
      // }
    }
    if (originalCalls.length > 0 && remainingCalls.length === 0) {
      dispatch(removeAllMedia())
    }
  }

export const pauseCall = () => {}
export const resumeCall = () => {}
export const setDesiredMediaForCall = () => {}
export const updateCallState = () => {}
