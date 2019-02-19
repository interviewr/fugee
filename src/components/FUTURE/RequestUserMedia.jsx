import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
  const permissions = Selectors.getDevicePermissions(state)

  return {
    ...props,
    requestingCameraCapture: permissions.requestingCameraCapture,
    requestingCapture: permissions.requestingCapture,
    requestingMicrophoneCapture: permissions.requestingMicrophoneCapture
  }
}

const mapDispatchToProps = dispatch => ({
  addLocalAudio: (track, stream, replace) => dispatch(Actions.addLocalAudio(track, stream, replace)),
  addLocalVideo: (track, stream, mirrored, replace) => dispatch(Actions.addLocalVideo(track, stream, mirrored, replace)),
  cameraPermissionDenied: (err) => dispatch(Actions.cameraPermissionDenied(err)),
  deviceCaptureRequest: (camera, microphone) => dispatch(Actions.deviceCaptureRequest(camera, microphone)),
  fetchDevices: () => dispatch(Actions.fetchDevices()),
  microphonePermissionDenied: (err) => dispatch(Actions.microphonePermissionDenied(err)),
  removeAllMedia: (kind) => dispatch(Actions.removeAllMedia(kind)),
  shareLocalMedia: (id) => dispatch(Actions.shareLocalMedia(id))
})

const mergeConstraints = (defaults, provided, additional) => {
  var disabled = (additional === false) || (!additional && !provided)
  if (disabled) {
    return false
  }

  provided = (provided === true) ? {} : provided
  additional = (additional === true) ? {} : additional
  return {
    ...defaults,
    ...provided,
    ...additional
  }
}

class RequestUserMedia extends Component {
  constructor (props) {
    super(props)
    this.errorCount = 0
  }

  componentDidMount () {
    if (this.props.auto) {
      this.getMedia()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.auto && this.props.auto !== prevProps.auto) {
      this.getMedia()
    }
  }

  async getMedia (additional = {}) {
    let audioConstraints, videoConstraints, stream
    const defaultAudioConstraints = {}
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints()

    for (let constraint of ['autoGainControl', 'echoCancellation', 'noiseSuppression']) {
      if (supportedConstraints[constraint]) {
        defaultAudioConstraints[constraint] = true
      }
    }

    audioConstraints = mergeConstraints(defaultAudioConstraints, this.props.audio, additional.audio)
    videoConstraints = mergeConstraints({}, this.props.video, additional.video)

    try {
      if (!navigator.mediaDevices) {
        throw new Error('getUserMedia not supported')
      }

      this.props.deviceCaptureRequest(!!videoConstraints, !!audioConstraints)

      if (!audioConstraints) {
        return
      }

      await this.props.removeAllMedia('audio')

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: videoConstraints
        })
      } catch (error) {
        this.errorCount += 1

        if (error.name === 'AbortError' && this.errorCount < 12) {
          setTimeout(() => this.getMedia(additional), 100 + Math.pow(2, this.errorCount))
          return {}
        }

        if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
          if (audioConstraints) {
            this.props.microphonePermissionDenied()
          }

          if (videoConstraints) {
            this.props.cameraPermissionDenied()
          }
        }

        this.props.deviceCaptureRequest(false, false)
        if (this.props.onError) {
          this.props.onError(error)
        }

        return {}
      }

      this.errorCount = 0

      const audio = stream.getAudioTracks()[0]
      const video = stream.getVideoTracks()[0]

      if (audio) {
        this.props.addLocalAudio(audio, stream, this.props.replaceAudio)
        if (this.props.share !== false) {
          this.props.shareLocalMedia(audio.id)
        }
      } else if (audioConstraints) {
        this.props.microphonePermissionDenied()
      }

      if (video) {
        this.props.addLocalVideo(video, stream, this.props.mirrored, this.props.replaceVideo)
        if (this.props.share !== false) {
          this.props.shareLocalMedia(video.id)
        }
      } else if (videoConstraints) {
        this.props.cameraPermissionDenied()
      }

      await this.props.fetchDevices()

      await this.props.deviceCaptureRequest(false, false)

      const trackIds = {
        audio: audio ? audio.id : undefined,
        video: video ? video.id : undefined
      }

      if (this.props.onSuccess) {
        this.props.onSuccess(trackIds)
      }

      return trackIds
    } catch (error) {

    }
  }

  render () {
    const renderProps = this.getMedia()
    let render = this.props.render

    if (!render && typeof this.props.children === 'function') {
      render = this.props.children
    }

    if (render) {
      return render(renderProps)
    } else if (this.props.children) {
      return this.props.children
    }

    if (this.props.auto) {
      return null
    } else {
      return (
        <button onClick={renderProps}>
          Request Media
        </button>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestUserMedia)
