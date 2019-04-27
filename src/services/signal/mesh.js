import { addConnection, updateConnection, removeConnection } from '../../actions/Connections'
import { updateMedia, removeMedia, addRemoteMedia } from '../../actions/Media'
import { getClient, getAPIConfig } from '../../reducers/api'
import { getConnections, getConnectionsForPeer } from '../../reducers/connections'
import { getPeersForCall } from '../../reducers/peers'
import { getJoinedCalls, getCallForRoom } from '../../reducers/calls'
import { getMedia, getSharedMedia } from '../../reducers/media'

const createIceServerConfig = (server) => {
  let host = server.host
  if (host.indexOf(':') >= 0) {
    host = `[${host}]`
  }

  let uri = `${server.type}:${host}`
  if (server.port) {
    uri += `:${server.port}`
  }

  if (server.transport) {
    uri += `?transport=${server.transport}`
  }

  if (server.type === 'turn' || server.type === 'turns') {
    return {
      credential: server.password,
      urls: [uri],
      username: server.username
    }
  }

  return { urls: [uri] }
}

class Mesh {
  constructor (client) {
    this.jingle = client.jingle
    this.dispatch = client.dispatch
    this.getState = client.getState
    this.updateICEServers()
  }

  updateICEServers = () => {
    this.jingle.iceServers = []
    const config = getAPIConfig(this.getState())

    config.iceServers.forEach((server) => {
      this.jingle.addICEServer(createIceServerConfig(server))
    })
  }

  updateConnections = () => {
    if (!window.RTCPeerConnection) {
      return
    }

    global.console.log('updateConnections')

    const state = this.getState()
    // const videoPeersCount = countPeersWantingVideo(state)
    const calls = getJoinedCalls(state)
    const media = getMedia(state)
    const sharedMedia = getSharedMedia(state)

    calls.forEach((call) => {
      const peers = getPeersForCall(state, call.roomAddress)

      peers.forEach((peer) => {
        const needsVideo = new Set()
        const needsAudio = new Set()
        const wantsVideo = peer.requestingMedia === 'video'
        const wantsAudio = peer.requestingMedia === 'video' || peer.requestingMedia === 'audio'
        const peerSharedMedia = new Map()
        const overSharedSessions = new Set()
        const connections = getConnectionsForPeer(state, peer.address)

        connections.forEach((connection) => {
          if (connection.sendingAudioMediaId) {
            peerSharedMedia.set(connection.sendingAudioMediaId, 'audio')
            if (!wantsAudio || !media[connection.sendingAudioMediaId] || !media[connection.sendingAudioMediaId].shared) {
              overSharedSessions.add(connection.id)
              if (connection.sendingVideoMediaId && wantsVideo) {
                needsVideo.add(connection.sendingVideoMediaId)
              }
            }
          }

          if (connection.sendingVideoMediaId) {
            peerSharedMedia.set(connection.sendingVideoMediaId, 'video')
            const video = media[connection.sendingVideoMediaId]
            if ((!wantsVideo && !video.screenCapture) || !video || !video.shared) {
              overSharedSessions.add(connection.id)
              if (connection.sendingAudioMediaId && wantsAudio) {
                needsAudio.add(connection.sendingAudioMediaId)
              }
            }
          }
        })

        sharedMedia.forEach((track) => {
          if (!peerSharedMedia.has(track.id)) {
            if (track.kind === 'audio' && wantsAudio) {
              needsAudio.add(track.id)
            }
            if (track.kind === 'video' && wantsVideo) {
              needsVideo.add(track.id)
            }
            if (track.kind === 'video' && track.screenCapture && wantsAudio) {
              needsVideo.add(track.id)
            }
          }
        })

        overSharedSessions.forEach((sessionId) => {
          const session = this.jingle.sessions[sessionId]
          if (session) {
            session.end()
          }
        })

        const pairedTracks = new Map()
        ;[...needsAudio, ...needsVideo].forEach((id) => {
          const track = media[id]
          if (track) {
            const pair = pairedTracks.get(track.stream.id) || {}
            pair[track.kind] = track
            pairedTracks.set(track.stream.id, pair)
          }
        })

        const loop = (pair) => {
          const session = this.jingle.createMediaSession(peer.address)
          const stream = new window.MediaStream()
          if (pair.audio) {
            stream.addTrack(pair.audio.track)
            this.dispatch(updateConnection(peer.address, session.sid, {
              sendingAudioMediaId: pair.audio.id
            }))
          }

          if (pair.video) {
            stream.addTrack(pair.video.track)
            this.dispatch(updateConnection(peer.address, session.sid, {
              sendingVideoMediaId: pair.video.id
            }))
          }

          session.addStream(stream)
          session.start({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false
          }, () => {
            if (pair.audio && pair.audio.localDisabled) {
              session.mute(session.sid, 'audio')
            }

            if (pair.video && pair.video.localDisabled) {
              session.mute(session.sid, 'video')
            }

            if (pair.video && pair.video.screenCapture) {
              session.send('description-info', {
                contents: [{
                  application: {
                    applicationType: 'rtp',
                    screenCaptures: [
                      { id: pair.video.id }
                    ]
                  },
                  name: 'video'
                }]
              })
            }
          })
        }

        pairedTracks.forEach((pair) => {
          loop(pair)
        })
      })
    })
  }

  plugin = () => () => {
    this.jingle.on('incoming', (session) => {
      global.console.log('jingle:incoming')
      const state = this.getState()
      const call = getCallForRoom(state, session.peerID.split('/')[0])

      if (call && call.joined) {
        session.accept()
      } else {
        session.end()
      }

      session.onDescriptionInfo = (changes, cb) => {
        changes.contents.forEach((content) => {
          if (content.application && content.application.screenCaptures) {
            content.application.screenCaptures.forEach((screen) => {
              this.dispatch(updateMedia(screen.id, {
                screenCapture: true
              }))
            })
          }
        })
      }
    })

    this.jingle.on('terminated', (session) => {
      global.console.log('terminated')
      this.dispatch(removeConnection(session.peerID, session.sid))
      this.updateConnections()
    })

    this.jingle.on('createdSession', (session) => {
      global.console.log('createdSession')
      this.dispatch(addConnection(session.peerID, session.sid))
      session.on('peerTrackAdded', (_, track, stream) => {
        this.dispatch(addRemoteMedia(session.peerID.split('/')[0], session.peerID, track, stream, false))
        if (track.kind === 'audio') {
          this.dispatch(updateConnection(session.peerID, session.sid, {
            receivingAudioMediaId: track.id
          }))
        }

        if (track.kind === 'video') {
          this.dispatch(updateConnection(session.peerID, session.sid, {
            receivingVideoMediaId: track.id
          }))
        }
      })

      session.on('peerStreamRemoved', (_, stream) => {
        stream.getTracks().forEach((track) => {
          this.dispatch(removeMedia(track.id))
        })
      })

      session.pc.on('iceConnectionStateChange', () => {
        global.console.log('iceConnectionStateChange')
        let connection = 'disconnected'
        switch (session.pc.iceConnectionState) {
          case 'checking':
            connection = 'connecting'
            break
          case 'completed':
          case 'connected':
            connection = 'connected'
            break
          case 'disconnected':
            connection = session.pc.signalingState === 'stable' ? 'interrupted' : 'disconnected'
            break
          case 'failed':
            connection = 'failed'
            break
          case 'closed':
            connection = 'disconnected'
            break
          default:
            connection = 'connecting'
        }

        this.dispatch(updateConnection(session.peerID, session.sid, {
          connectionState: connection
        }))

        if (connection === 'failed' || connection === 'disconnected') {
          session.end()
        }
      })
    })

    this.jingle.on('mute', (session, info) => {
      const state = this.getState()
      const connections = getConnections(state)
      if (info.name === 'audio') {
        this.dispatch(updateMedia(connections[session.sid].receivingAudioMediaId, { remoteDisabled: true }))
      } else if (info.name === 'video') {
        this.dispatch(updateMedia(connections[session.sid].receivingVideoMediaId, { remoteDisabled: true }))
      } else {
        throw new Error('Invalid mute property')
      }
    })

    this.jingle.on('unmute', (session, info) => {
      const state = this.getState()
      const connections = getConnections(state)

      if (info.name === 'audio') {
        this.dispatch(updateMedia(connections[session.sid].receivingAudioMediaId, { remoteDisabled: false }))
      } else if (info.name === 'video') {
        this.dispatch(updateMedia(connections[session.sid].receivingVideoMediaId, { remoteDisabled: false }))
      } else {
        throw new Error('Invalid mute property')
      }
    })
  }

  notifyPeers = (media, action) => {
    global.console.log('notifyPeers')
    const state = this.getState()
    const connections = getConnections(state)
    Object.values(getClient(state).jingle.sessions).forEach((session) => {
      if (connections[session.sid] && connections[session.sid].sendingAudioMediaId === media.id) {
        session[action](session.sid, media.kind)
      }
    })
  }
}

export default Mesh
