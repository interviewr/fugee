import React from 'react'
import PropTypes from 'prop-types'

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

class RequestUserMedia extends React.Component {
  // TODO: fix propTypes
  static propTypes = {
    auto: PropTypes.bool,
    video: PropTypes.bool,
    audio: PropTypes.bool,
    deviceCaptureRequest: PropTypes.func.isRequired,
    removeAllMedia: PropTypes.func.isRequired,
    microphonePermissionDenied: PropTypes.func.isRequired,
    cameraPermissionDenied: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    addLocalAudio: PropTypes.func.isRequired,
    addLocalVideo: PropTypes.func.isRequired,
    replaceAudio: PropTypes.string,
    share: PropTypes.bool,
    shareLocalMedia: PropTypes.func.isRequired,
    fetchDevices: PropTypes.func.isRequired,
    children: PropTypes.node,
    mirrored: PropTypes.bool
  }

  static defaultProps = {
    auto: true,
    video: true,
    audio: true,
    mirrored: false,
    share: true,
    onError: () => {},
    onSuccess: () => {}
  }

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

      if (audioConstraints) {
        await this.props.removeAllMedia('audio')
      }

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
        if (!!audioConstraints) { // eslint-disable-line
          this.props.microphonePermissionDenied()
        }

        if (!!videoConstraints) { // eslint-disable-line
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
    } else if (!!audioConstraints) { // eslint-disable-line
      this.props.microphonePermissionDenied()
    }

    if (video) {
      this.props.addLocalVideo(video, stream, this.props.mirrored, this.props.replaceVideo)
      if (this.props.share !== false) {
        this.props.shareLocalMedia(video.id)
      }
    } else if (!!videoConstraints) { // eslint-disable-line
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
  }

  render () {
    if (this.props.auto) {
      return null
    } else {
      return (
        <button onClick={this.getMedia}>
          Request Media
        </button>
      )
    }
  }
}

export default RequestUserMedia
