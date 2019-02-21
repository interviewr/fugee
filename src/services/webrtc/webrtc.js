import Peer from 'simple-peer'

class WebRTC {
  constructor (options) {
    this.options = options || {}
    this.config = {}
    this.peers = []
  }

  getPeers (sessionId, type) {
    return this.peers
      .filter(peer => (!sessionId || peer.id === sessionId) && (!type || peer.type === type))
  }

  createPeer (options) {
    options.parent = this
    const peer = new Peer(options)
    this.peers.push(peer)

    return peer
  }

  removePeers (id, type) {
    this.getPeers(id, type).forEach(peer => peer.end())
  }

  sendToAll (message, payload) {
    this.peers.forEach(peer => peer.send(message, payload))
  }

  sendDirectlyToAll (channel, message, payload) {
    this.peers.forEach((peer) => {
      if (peer.enableDataChannels) {
        peer.sendDirectly(channel, message, payload)
      }
    })
  }
}

export default WebRTC
