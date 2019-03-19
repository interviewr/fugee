import { createClient } from 'stanza'
import { connect, connectionStateChanged } from '../../actions/API'
import { leaveRoom, joinRoomSuccess, joinRoomFailed } from '../../actions/Rooms'
import { joinCall } from '../../actions/Calls'
import { peerOnline, peerOffline, peerUpdated } from '../../actions/Peers'
import { getConfigURL, getAPIConfig } from '../../reducers/api'
import { getRoomByAddress, getRooms } from '../../reducers/rooms'
import { getUserDisplayName } from '../../reducers/user'
import { getCallForRoom, getJoinedCalls } from '../../reducers/calls'
import Mesh from './mesh'
import MMUC from './mmuc'

class SingalClient {
  constructor (dispatch, getState, options) {
    this.logToConsole = window.localStorage.logxmpp || false
    this.terminating = false
    this.dispatch = dispatch
    this.getState = getState
    this.rttBuffers = new Map()
    this.xmpp = createClient({ transport: 'websocket', ...options })
    this.xmpp.useStreamManagement = false
    this.xmpp.sm.allowResume = false
    this.jingle = this.xmpp.jingle
    this.xmpp.use(MMUC)
    this.mesh = new Mesh(this)
    this.xmpp.use(this.mesh.plugin())

    this.xmpp.on('raw:*', (event, data) => {
      if (this.logToConsole) {
        console.log(event, data)
      }
    })

    this.xmpp.on('session:started', () => {
      global.console.log('xmpp - session:started')
      this.xmpp.sendPresence()
      this.xmpp.enableKeepAlive({ interval: 90 })
      this.dispatch(connectionStateChanged('connected'))
    })

    this.xmpp.on('disconnected', () => {
      global.console.log('xmpp - disconnected')
      if (this.terminating) {
        return
      }

      this.dispatch(connectionStateChanged('disconnected'))
      setTimeout(function () {
        const state = this.getState()
        const configUrl = getConfigURL(state)
        const userData = Selectors.getUserToken(state)
        this.dispatch(connect(configUrl, userData))
      }, 1000 + Math.random() * 2000)
    })

    this.xmpp.on('muc:join', async (pres) => {
      global.console.log('xmpp - muc:join')
      let roomAddress, state, room
      roomAddress = pres.from.bare
      state = this.getState()
      room = getRoomByAddress(state, roomAddress)

      await this.fetchRoomConfig(roomAddress, true)

      this.dispatch(joinRoomSuccess(roomAddress, pres.from.full, pres.talkyUserInfo.roomId, pres.muc.role))
      room = getRoomByAddress(state, roomAddress)
      if (room && room.autoJoinCall) {
        this.dispatch(joinCall(roomAddress, Selectors.getDesiredMediaTypes(state, roomAddress)))
      }
    })

    this.xmpp.on('muc:failed', (pres) => {
      const roomAddress = pres.from.bare
      const room = getRoomByAddress(this.getState(), roomAddress)
      if (room && room.providedPassword && !room.passwordRequired) {
        this.joinRoom(roomAddress, undefined, room.autoJoinCall)
      } else {
        this.dispatch(joinRoomFailed(roomAddress, pres.error.condition === 'not-authorized'))
      }
    })

    this.xmpp.on('muc:error', (pres) => {
      this.dispatch(joinRoomFailed(pres.from.bare, pres.error.condition === 'not-authorized'))
    })

    this.xmpp.on('muc:available', (pres) => {
      if (pres.muc.codes && pres.muc.codes.indexOf('110') >= 0) {
        // Ignore ourself
        return
      }

      // TODO: realtime_text rtt buffer code

      const customerData = pres.talkyUserInfo.customerData || {}
      this.dispatch(peerOnline(pres.from.bare, pres.from.full, {
        customerData: customerData,
        displayName: customerData.displayName || pres.nick,
        id: pres.talkyUserInfo.sessionId,
        joinedCall: !!pres.mmuc,
        requestingMedia: (pres.mmuc || {}).media,
        role: pres.muc.role
      }))
    })

    this.xmpp.on('muc:unavailable', (pres) => {
      if (pres.muc.codes && pres.muc.codes.indexOf('110') >= 0) {
        this.dispatch(leaveRoom(pres.from.bare))
        return
      }

      this.dispatch(peerOffline(pres.from.bare, pres.from.full))
    })

    this.xmpp.on('muc:destroyed', (pres) => {
      this.dispatch(leaveRoom(pres.from.bare))
    })

    this.xmpp.on('chat:state', (msg) => {
      this.dispatch(peerUpdated(msg.from.full, {
        chatState: msg.chatState
      }))
    })

    this.xmpp.on('attention', (msg) => {
      this.dispatch(peerUpdated(msg.from.full, {
        requestingAttention: true
      }))

      setTimeout(() => {
        this.dispatch(peerUpdated(msg.from.full, {
          requestingAttention: false
        }))
      }, 5000)
    })

    this.xmpp.on('message', (msg) => {
      if (msg.type !== 'groupchat') {
        return
      }

      if (msg.body) {
        this.dispatch() // Chat message
      }
    })

    this.xmpp.on('message', (msg) => {
      return this.processMessage(msg)
    })
  }

  connect = () => {
    this.xmpp.connect()
  }

  disconnect = () => {
    this.terminating = true
    this.dispatch(connectionStateChanged('disconnected'))
    this.xmpp.disconnect()
  }

  joinRoom = (roomAddress, password, autoJoinCall) => {
    const state = this.getState()
    const config = getAPIConfig(state)
    const displayName = getUserDisplayName(state)
    const options = {
      joinMuc: {
        password: password
      },
      nick: displayName
    }
    this.xmpp.joinRoom(roomAddress, config.id, options)

    if (autoJoinCall !== false) {
      this.dispatch(joinCall(roomAddress, Selectors.getDesiredMediaTypes(state, roomAddress)))
    }
  }

  destroyRoom = async (roomAddress) => {
    await this.xmpp.destroyRoom(roomAddress)
  }

  sendRoomPresence = (roomAddress, options) => {
    if (!options) {
      options = {}
    }

    const state = this.getState()
    const displayName = getUserDisplayName(state)
    const room = getRoomByAddress(state, roomAddress)
    const call = getCallForRoom(state, roomAddress)
    const media = Selectors.getDesiredMediaTypes(state, roomAddress)

    if (!room || !room.joined) {
      return
    }

    this.xmpp.sendPresence({
      mmuc: call && call.joined
        ? { media: media }
        : undefined,
      nick: displayName || true,
      to: roomAddress,
      ...options
    })
  }

  sendAllRoomsPresence = (options) => {
    if (!options) {
      options = {}
    }

    const state = this.getState()
    const rooms = Object.keys(getRooms(state))

    rooms.forEach((roomAddress) => {
      this.sendRoomPresence(roomAddress, options)
    })
  }

  sendAllCallsSpeakingUpdate = (speaking) => {
    const state = this.getState()
    const calls = getJoinedCalls(state)

    calls.forEach((call) => {
      this.xmpp.sendMessage({
        mmuc: {
          speaking: speaking
        },
        to: call.roomAddress,
        type: 'groupchat'
      })
    })
  }

  lockRoom = async (roomAddress, password) => {
    const state = this.getState()
    const room = getRoomByAddress(state, roomAddress)
    if (!room || !room.joined) {
      return
    }

    try {
      await this.xmpp.configureRoom(roomAddress, {
        fields: [{
          name: 'FORM_TYPE',
          value: 'http://jabber.org/protocol/muc#roomconfig'
        }, {
          name: 'muc#roomconfig_whois',
          type: 'text-single',
          value: 'moderators'
        }, {
          name: 'muc#roomconfig_roomsecret',
          type: 'text-single',
          value: password
        }, {
          name: 'muc#roomconfig_passwordprotectedroom',
          type: 'boolean',
          value: '1'
        }]
      })

      // this.dispatch(roomLocked(roomAddress, password))
    } catch (error) {
      console.error(error)
    }
  }

  unlockRoom = async (roomAddress) => {
    const state = this.getState()
    const room = getRoomByAddress(state, roomAddress)
    if (!room || !room.joined) {
      return
    }

    try {
      await this.xmpp.configureRoom(roomAddress, {
        fields: [{
          name: 'FORM_TYPE',
          value: 'http://jabber.org/protocol/muc#roomconfig'
        }, {
          name: 'muc#roomconfig_whois',
          type: 'text-single',
          value: 'moderators'
        }, {
          name: 'muc#roomconfig_roomsecret',
          type: 'text-single',
          value: ''
        }, {
          name: 'muc#roomconfig_passwordprotectedroom',
          type: 'boolean',
          value: '1'
        }]
      })

      // this.dispatch(roomUnlocked(roomAddress))
    } catch (error) {
      console.error(error)
    }
  }

  fetchRoomConfig = async (roomAddress, initial = false) => {
    const config = {}
    const state = this.getState()
    const room = getRoomByAddress(state, roomAddress)
    if (!initial && (!room || !room.joined)) {
      throw new Error('Room not joined')
    }

    const res = await this.xmpp.getRoomConfig(roomAddress)
    const form = res.mucOwner.form

    form.fields.forEach((field) => {
      if (field.name === 'muc#roomconfig_roomsecret') {
        if (field.value) {
          config.password = field.value
        } else {
          config.password = undefined
        }
      }
    })

    return config
  }

  processMessage = async (msg) => {
    const roomAddress = msg.from.bare
    const room = getRoomByAddress(this.getState(), roomAddress)
    if (msg.type === 'groupchat' && msg.mmuc) {
      if (room && room.selfAddress !== msg.from.full && msg.mmuc) {
        this.dispatch(peerUpdated(msg.from.full, {
          speaking: msg.mmuc.speaking || false
        }))
      }
    }
  }
}

export default SingalClient
