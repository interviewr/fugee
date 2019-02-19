import React, { Component } from 'react'

class Video extends Component {
  componentDidMount () {
    this.setup();
  }

  componentDidUpdate () {
    this.setup();
  }

  setup () {
    if (!this.props.media || !this.video) {
      return
    }

    this.video.oncontextmenu = (event) => {
      event.preventDefault()
    }

    this.video.muted = true
    this.video.autoplay = true

    if (this.video.srcObject !== this.props.media.stream) {
      this.video.srcObject = this.props.media.stream
    }
  }

  render() {
    if (!this.props.media || !this.props.media.loaded) {
      return null
    }

    return (
      <video
        playsInline
        ref={(node) => { this.vide = node; }}
        style={
          this.props.media && this.props.media.renderMirrored
            ? { transform: 'scaleX(-1)' }
            : {}
        }
      />
    )
  }
}

export default Video
