import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Video from '../../atoms/Video'
import ThumbnailVideos from '../../../containers/ThumbnailVideos'
import ActionBar from '../../../containers/ActionBar'

const TOOLBAR_REVEAL_DISTANCE = 100
const ACTIONBAR_REVEAL_DISTANCE = 150
const HIDE_CONTROLS_TIMEOUT = 2000

const AppContainer = styled.div`
  user-select: none;
  height: 100%;
  width: 100%;
  position: relative;
`

const MainVideo = styled(Video)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
  transform: scaleX(-1);
  user-select: none;
`

const App = (props) => {
  let isMouseNearToolBar_
  let isMouseNearActionsBar_
  let controlsTimeout
  const [isControlsVisible, toogleControls] = useState(false)

  useEffect(() => {
    props.joinRoom(props.match.params.roomId) // TODO: this will lead to constant joining the room
  })

  const handleMouseMove = (event) => {
    isMouseNearToolBar_ = isMouseNearToolBar(event)
    isMouseNearActionsBar_ = isMouseNearActionsBar(event)

    if (isMouseNearToolBar_ || isMouseNearActionsBar_) {
      toogleControls(true)
    }

    hideControlsAfterTimeout()
  }

  const isMouseNearToolBar = (event) => (
    event.pageX < TOOLBAR_REVEAL_DISTANCE
  )

  const isMouseNearActionsBar = (event) => (
    event.pageY > window.innerHeight - ACTIONBAR_REVEAL_DISTANCE
  )

  const hideControls = () => {
    if (isMouseNearToolBar_ || isMouseNearActionsBar_) {
      return
    }

    toogleControls(false)
  }

  const hideControlsAfterTimeout = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }

    controlsTimeout = setTimeout(hideControls, HIDE_CONTROLS_TIMEOUT)
  }

  return (
    <AppContainer onMouseMove={handleMouseMove}>
      <MainVideo peerId={props.pinnedPeerId || props.activePeerId} />
      <ThumbnailVideos />
      <ActionBar isVisible={isControlsVisible} />
    </AppContainer>
  )
}

App.propTypes = {
  activePeerId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  pinnedPeerId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  joinRoom: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomId: PropTypes.string.isRequired
    })
  }).isRequired
}

export default App
