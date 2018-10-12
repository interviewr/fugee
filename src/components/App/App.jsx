import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Video from '../Video'
import ThumbnailVideos from '../../containers/ThumbnailVideos'
import ActionBar from '../../containers/ActionBar'

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

class App extends PureComponent {
  static propTypes = {
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
  };

  state = {
    isControlsVisible: false
  };

  componentDidMount () {
    this.props.joinRoom(this.props.match.params.roomId)
  }

  handleMouseMove = (event) => {
    this.isMouseNearToolBar_ = this.isMouseNearToolBar(event)
    this.isMouseNearActionsBar_ = this.isMouseNearActionsBar(event)

    if (this.isMouseNearToolBar_ || this.isMouseNearActionsBar_) {
      this.setState({ isControlsVisible: true })
    }

    this.hideControlsAfterTimeout()
  };

  isMouseNearToolBar = event => (
    event.pageX < TOOLBAR_REVEAL_DISTANCE
  );

  isMouseNearActionsBar = event => (
    event.pageY > window.innerHeight - ACTIONBAR_REVEAL_DISTANCE
  );

  hideControls = () => {
    if (this.isMouseNearToolBar_ || this.isMouseNearActionsBar_) {
      return
    }

    this.setState({ isControlsVisible: false })
  };

  hideControlsAfterTimeout = () => {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout)
    }

    this.controlsTimeout = setTimeout(this.hideControls, HIDE_CONTROLS_TIMEOUT)
  };

  render () {
    const { activePeerId, pinnedPeerId } = this.props
    const { isControlsVisible } = this.state

    return (
      <AppContainer onMouseMove={this.handleMouseMove}>
        <MainVideo
          peerId={!pinnedPeerId ? activePeerId : pinnedPeerId}
        />
        <ThumbnailVideos />
        <ActionBar isVisible={isControlsVisible} />
      </AppContainer>
    )
  }
}

export default App
