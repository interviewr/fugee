import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledVideo = styled.video``

class Video extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    media: PropTypes.shape({
      stream: PropTypes.string,
      loaded: PropTypes.bool,
      renderMirrored: PropTypes.bool
    })
  }

  static defaultProps = {
    className: '',
    onClick: () => {},
    media: null
  }

  componentDidMount () {
    this.setup()
  }

  componentDidUpdate () {
    this.setup()
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

  render () {
    if (!this.props.media || !this.props.media.loaded) {
      return null
    }

    return (
      <StyledVideo
        playsInline
        ref={(node) => { this.video = node }}
        className={this.props.className}
        onClick={this.props.onClick}
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
