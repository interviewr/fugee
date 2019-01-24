import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Mic from '../../atoms/Icon/Mic'
import MicOff from '../../atoms/Icon/MicOff'
import Video from '../../atoms/Icon/Video'
import VideoOff from '../../atoms/Icon/VideoOff'
import CallEnd from '../../atoms/Icon/CallEnd'

const ActionBarContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.darkGray};
  border-radius: 3px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 40px;
  overflow: hidden;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`

const ActionBarList = styled.ul`
  display: flex;
  flex-direction: row;
  list-style: none;
`

const ActionBarListItem = styled.li.attrs({
  className: props => props.isActive ? 'active' : ''
})`
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.darkGray};
  }

  &.active {
    background: ${props => props.theme.colors.lightBlue};
  }
`

const ActionsBar = (props) => (
  <ActionBarContainer isVisible={props.isVisible}>
    <ActionBarList>
      <ActionBarListItem
        isActive={!props.isMicrophoneEnabled}
        onClick={
          props.isMicrophoneEnabled
            ? props.muteMicrophone
            : props.unmuteMicrophone
        }
      >
        {props.isMicrophoneEnabled ? <Mic /> : <MicOff />}
      </ActionBarListItem>
      <ActionBarListItem
        isActive={!props.isCameraEnabled}
        onClick={
          props.isCameraEnabled
            ? props.pauseVideo
            : props.resumeVideo
        }
      >
        {props.isCameraEnabled
          ? <Video />
          : <VideoOff />
        }
      </ActionBarListItem>
      <ActionBarListItem
        onClick={props.endCall}
      >
        <CallEnd />
      </ActionBarListItem>
    </ActionBarList>
  </ActionBarContainer>
)

ActionsBar.propTypes = {
  isVisible: PropTypes.bool,
  isMicrophoneEnabled: PropTypes.bool,
  isCameraEnabled: PropTypes.bool,
  muteMicrophone: PropTypes.func.isRequired,
  unmuteMicrophone: PropTypes.func.isRequired,
  pauseVideo: PropTypes.func.isRequired,
  resumeVideo: PropTypes.func.isRequired,
  endCall: PropTypes.func.isRequired
}

ActionsBar.defaultProps = {
  isVisible: false,
  isMicrophoneEnabled: false,
  isCameraEnabled: false
}

export default ActionsBar
