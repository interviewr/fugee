import Connection from './connection'
import WebRTC from './webrtc'

class WebRTCManager {
  constructor (options, dispatch) {
    this.options = options || {}
    this.config = {}
    this.dispatch = dispatch
    this.connection = new Connection(this.config)

    this.connection.on('connect', () => {
      this.dispatch({ type: 'connectionRead', payload: this.connection.getSessionid() })
    })

    this.connection.on('message', (message) => {
      const peers = this.webrtc.getPeers(message.from, message.roomType)
    })

    this.connection.on('remove', (room) => {
      if (room.id !== this.connection.getSessionid()) {
        this.webrtc.removePeers(room.id, room.type)
      }
    })

    this.webrtc = new WebRTC(this.options)
  }

  disconnect () {
    this.connection.disconnect()
    delete this.connection
  }

  leaveRoom () {
    if (this.roomName) {
      this.connection.emit('leave')
      while (this.webrtc.peers.length) {
        this.webrtc.peers[0].end()
      }

      this.roomName = undefined
    }
  }
}

export default WebRTCManager
