async function getMedia (additional = {}) {
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
    /* Block #1 - start */
    if (!navigator.mediaDevices) {
      throw new Error('getUserMedia not supported')
    }

    this.props.deviceCaptureRequest(!!videoConstraints, !!audioConstraints)

    if (!audioConstraints) {
      return
    }

    await this.props.removeAllMedia('audio')
    /* Block #1 - end */

    /* Block #3 - start */
    stream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints,
      video: videoConstraints
    })
    /* Block #3 - end */

    /* Block #6 - start */
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
    /* Block #6 - end */

    /* Block #7 - start */
    await this.props.deviceCaptureRequest(false, false)
    /* Block #7 - end */

    /* Block #8 - start */
    const trackIds = {
      audio: audio ? audio.id : undefined,
      video: video ? video.id : undefined
    }

    if (this.props.onSuccess) {
      this.props.onSuccess(trackIds)
    }

    return trackIds
    /* Block #8 - end */
  } catch (error) {
    /* Block #5 - start */
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
    /* Block #5 - end */
  }
}
