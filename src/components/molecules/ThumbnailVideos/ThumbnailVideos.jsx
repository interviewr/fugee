import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SettingsPopover from '../SettingsPopover'
import Video from '../../atoms/Video'

const ThumbnailVideosContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  right: 20px;
  top: 20px;
`

const StyledVideo = styled(Video)`
  object-fit: cover;
  transform: scaleX(-1);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid lightgreen;
`

const VideoWrapper = styled.div`
  position: relative;
`

const ThumbnailVideos = React.memo((props) => {
  const handleThumbnailClick = peerId => {
    if (props.pinnedPeerId !== peerId) {
      props.setPinnedPeer(peerId)
    } else {
      props.setPinnedPeer(null)
    }
  }

  return (
    <ThumbnailVideosContainer>
      {props.peers
        .map((peerId, index) => (
          <VideoWrapper key={`${peerId}-${index}`}>
            <StyledVideo
              peerId={peerId}
              onClick={() => handleThumbnailClick(peerId)}
            />
            <SettingsPopover />
          </VideoWrapper>
        ))}
    </ThumbnailVideosContainer>
  )
})

ThumbnailVideos.propTypes = {
  peers: PropTypes.array,
  setPinnedPeer: PropTypes.func.isRequired,
  pinnedPeerId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

ThumbnailVideos.defaultProps = {
  peers: [],
  pinnedPeerId: null
}

export default ThumbnailVideos
