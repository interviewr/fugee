import * as Constants from './constants'
import { getClient } from '../reducers/api'
import { getMediaTrack, getMediaForPeer, getLocalMedia } from '../reducers/media'
import { getPeerByAddress } from '../reducers/peers'

export const addLocalMedia = (media) =>
  (dispatch, getState) => {
    let newReplaces = media.replaces
    if (media.replaces) {
      const prevMedia = getMediaTrack(getState(), media.replaces)
      if (prevMedia) {
        if (!prevMedia.shared) {
          dispatch(removeMedia(prevMedia.id))
          newReplaces = prevMedia.replaces
        }
      }
    }

    media.track.onmute = () => {
      dispatch(updateMedia(media.id, {
        externalDisabled: true
      }))
    }

    media.track.onunmute = () => {
      dispatch(updateMedia(media.id, {
        externalDisabled: false
      }))
    }

    dispatch({
      payload: { ...media, replaces: newReplaces },
      type: Constants.ADD_MEDIA
    })
  }

export const addLocalAudio = (track, stream, replaces) => {
  if (track.kind !== 'audio') {
    throw new Error('Incorrect media type. Expected audio, got: ' + track.kind)
  }

  return (dispatch, getState) => {
    const audio = track.clone()
    const utilityStream = new window.MediaStream()
    utilityStream.addTrack(audio)

    track.onended = () => {
      audio.stop()
      // dispatch(stopSharingLocalMedia(track.id))
      dispatch(removeMedia(track.id))
    }

    let player = document.createElement('audio')
    const onLoaded = () => {
      if (player) {
        player.pause()
        player.removeEventListener('oncanplay', onLoaded)
        player.srcObject = null
        player = undefined

        dispatch(updateMedia(track.id, {
          loaded: true
        }))
      }
    }

    player.muted = true
    player.autoplay = true
    player.oncanplay = onLoaded
    player.srcObject = stream

    dispatch(addLocalMedia({
      createdAt: Date.now(),
      externalDisabled: track.muted,
      id: track.id,
      inputDetected: false,
      inputLost: Date.now(),
      kind: 'audio',
      localDisabled: !track.enabled,
      remoteDisabled: false,
      renderMirrored: false,
      replaces: replaces,
      screenCapture: false,
      shared: false,
      source: 'local',
      speaking: false,
      stream: stream,
      track: track,
      utilityStream: utilityStream,
      volume: -Infinity
    }))
  }
}

export const addLocalVideo = (track, stream, mirror = true, replaces) => {
  if (track.kind !== 'video') {
    throw new Error('Incorrect media type. Expected video, got: ' + track.kind)
  }

  return (dispatch, getState) => {
    track.onended = function () {
      // dispatch(stopSharingLocalMedia(track.id))
      dispatch(removeMedia(track.id))
    }

    let player = document.createElement('video')
    const onLoaded = () => {
      if (player) {
        const height = player.videoHeight
        const width = player.videoWidth
        player.pause()
        player.removeEventListener('oncanplay', onLoaded)
        player.srcObject = null
        player = undefined

        dispatch(updateMedia(track.id, {
          height: height,
          loaded: true,
          width: width
        }))
      }
    }

    player.setAttribute('playsinline', 'playsinline')
    player.muted = true
    player.autoplay = true
    player.oncanplay = onLoaded
    player.srcObject = stream

    dispatch(addLocalMedia({
      createdAt: Date.now(),
      externalDisabled: track.muted,
      id: track.id,
      kind: 'video',
      localDisabled: !track.enabled,
      remoteDisabled: false,
      renderMirrored: mirror,
      replaces: replaces,
      screenCapture: false,
      shared: false,
      source: 'local',
      speaking: false,
      stream: stream,
      track: track,
      volume: -Infinity
    }))
  }
}

export const addRemoteMedia = (roomAddress, peerAddress, track, stream, screen) =>
  (dispatch, getState) => {
    const owner = getPeerByAddress(getState(), peerAddress)

    track.onended = () => {
      dispatch(removeMedia(track.id))
    }

    const waitForLoaded = () => {
      if (track.kind === 'video') {
        let player1 = document.createElement('video')
        const onLoaded1 = () => {
          if (player1) {
            const height = player1.videoHeight
            const width = player1.videoWidth
            player1.pause()
            player1.removeEventListener('oncanplay', onLoaded1)
            player1.srcObject = null
            player1 = undefined

            dispatch(updateMedia(track.id, {
              height: height,
              loaded: true,
              width: width
            }))
          }
        }

        player1.muted = true
        player1.autoplay = true
        player1.oncanplay = onLoaded1
        player1.srcObject = stream
        setTimeout(onLoaded1, 500)
      }

      if (track.kind === 'audio') {
        let player2 = document.createElement('audio')
        const onLoaded2 = () => {
          if (player2) {
            player2.pause()
            player2.removeEventListener('oncanplay', onLoaded2)
            player2.srcObject = null
            player2 = undefined

            dispatch(updateMedia(track.id, {
              loaded: true
            }))
          }
        }

        player2.muted = true
        player2.autoplay = true
        player2.oncanplay = onLoaded2
        player2.srcObject = stream
      }
    }

    waitForLoaded()
    setTimeout(waitForLoaded, 500)

    const media = {
      createdAt: Date.now(),
      externalDisabled: track.muted,
      id: track.id,
      kind: track.kind,
      localDisabled: owner ? owner.muted : false,
      owner: peerAddress,
      remoteDisabled: false,
      renderMirrored: false,
      roomAddress: roomAddress,
      screenCapture: track.kind === 'video' && screen,
      source: 'remote',
      speaking: false,
      stream: stream,
      track: track,
      volume: -Infinity
    }

    dispatch({
      payload: media,
      type: Constants.ADD_MEDIA
    })
  }

export const removeMedia = (id, endMedia = true) =>
  (dispatch, getState) => {
    const media = getMediaTrack(getState(), id)
    if (!media) {
      return
    }

    if (media.shared) {
      // dispatch(stopSharingLocalMedia(id))
    }

    dispatch({
      payload: { id: id },
      type: Constants.REMOVE_MEDIA
    })

    if (endMedia) {
      if (media.track) {
        media.track.stop()
      }

      if (media.utilityStream) {
        media.utilityStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }

export const updateMedia = (id, updated) =>
  (dispatch, getState) => {
    const prevState = getState()
    const client = getClient(prevState)
    // const wasSpeaking = Selectors_1.userIsSpeaking(prevState)

    dispatch({
      payload: {
        id: id,
        updated: updated
      },
      type: Constants.MEDIA_UPDATED
    })

    const newState = getState()
    // const nowSpeaking = Selectors_1.userIsSpeaking(newState)

    if (client) {
      // if (wasSpeaking !== nowSpeaking) {
      //   client.sendAllCallsSpeakingUpdate(nowSpeaking)
      // }

      if (updated.shared !== undefined) {
        client.mesh.updateConnections()
      }
    }

    const oldMedia = getMediaTrack(prevState, id)
    const newMedia = getMediaTrack(newState, id)

    if (newMedia) {
      newMedia.track.enabled = !newMedia.localDisabled
      if (oldMedia && newMedia.source === 'local' && newMedia.localDisabled !== oldMedia.localDisabled && client) {
        client.mesh.notifyPeers(newMedia, newMedia.localDisabled === true ? 'mute' : 'unmute')
      }

      if (newMedia.source === 'remote' && newMedia.owner) {
        const peer = getPeerByAddress(newState, newMedia.owner)
        if (peer && peer.muted && !newMedia.localDisabled) {
          dispatch({
            payload: {
              peerAddress: newMedia.owner,
              updated: {
                muted: false
              }
            },
            type: Constants.PEER_UPDATED
          })
        }
      }
    }
  }

export const enableMedia = (id) => {
  return updateMedia(id, {
    localDisabled: false
  })
}

export const disableMedia = (id) => {
  return updateMedia(id, {
    localDisabled: true
  })
}

export const shareLocalMedia = (id) =>
  (dispatch, getState) => {
    const media = getMediaTrack(getState(), id)
    if (!media) {
      return
    }

    if (media.replaces) {
      dispatch(removeMedia(media.replaces))
    }

    dispatch(updateMedia(id, {
      replaces: undefined,
      shared: true
    }))
  }

export const mutePeer = (peerAddress) =>
  (dispatch, getState) => {
    const media = getMediaForPeer(getState(), peerAddress, 'audio')
    media.forEach((audio) => {
      dispatch(disableMedia(audio.id))
    })

    dispatch({
      payload: {
        peerAddress: peerAddress,
        updated: {
          muted: true
        }
      },
      type: Constants.PEER_UPDATED
    })
  }

export const unmutePeer = (peerAddress) =>
  (dispatch, getState) => {
    const media = getMediaForPeer(getState(), peerAddress, 'audio')
    media.forEach((audio) => {
      dispatch(enableMedia(audio.id))
    })

    dispatch({
      payload: {
        peerAddress: peerAddress,
        updated: {
          muted: false
        }
      },
      type: Constants.PEER_UPDATED
    })
  }

export const muteSelf = () =>
  (dispatch, getState) => {
    const media = getLocalMedia(getState(), 'audio')
    media.forEach((audio) => {
      dispatch(disableMedia(audio.id))
    })
  }

export const unmuteSelf = () =>
  (dispatch, getState) => {
    const media = getLocalMedia(getState(), 'audio')
    media.forEach((audio) => {
      dispatch(enableMedia(audio.id))
    })
  }

export const pauseSelfVideo = () =>
  (dispatch, getState) => {
    const media = getLocalMedia(getState(), 'video')
    media.forEach((video) => {
      dispatch(disableMedia(video.id))
    })
  }

export const resumeSelfVideo = () =>
  (dispatch, getState) => {
    const media = getLocalMedia(getState(), 'video')
    media.forEach((video) => {
      dispatch(enableMedia(video.id))
    })
  }

export const removeAllMedia = (kind) =>
  (dispatch, getState) => {
    const localMedia = getLocalMedia(getState(), kind)
    localMedia.forEach((media) => {
      dispatch(removeMedia(media.id))
    })
  }
