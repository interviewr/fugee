import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import StreamStore from '../../../services/StreamStore'

const StyledVideo = styled.video``

const Video = React.memo((props) => {
  const attachStream = (id, node) => {
    if (node) {
      node.srcObject = StreamStore.get(id)
    }
  }

  return (
    <StyledVideo
      autoPlay
      className={props.className}
      ref={(c) => { attachStream(props.peerId, c) }}
      onClick={props.onClick}
    />
  )
})

Video.propTypes = {
  peerId: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
}

Video.defaultProps = {
  className: '',
  onClick: () => {}
}

export default Video
