import { combineReducers } from 'redux'
// import { api } from './api'
// import { peers } from './peers'
import { actionsBar } from './actionBar'
// import { calls } from './calls'
// import { connections } from './connections'
// import { devices } from './devices'
// import { media } from './media'
// import { rooms } from './rooms'
// import { user } from './user'

export default combineReducers({
  // api,
  // peers,
  actionsBar
  // calls,
  // connections,
  // devices,
  // media,
  // rooms,
  // user
})

export const isSupportedBrowser = () => {
  return !!('RTCPeerConnection' in window) && !!('mediaDevices' in navigator)
}
