import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Manager, Reference, Popper } from 'react-popper'
import styled from 'styled-components'
import Checkbox from '../../molecules/Checkbox'

const Toggle = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background: red;
  position: absolute;
  bottom: 20px;
  right: 25px;
`

const BodyContainer = styled.div`
  padding: 15px;
  background: #509EE3;
  color: #fff;
  border-radius: 3px;
`

const Arrow = styled.div`
  position: absolute;
  width: 15px;
  height: 13px;

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -8px;
    width: 16px;
    height: 8px;

    &::before {
      border-width: 0 8px 8px 8px;
      border-color: transparent transparent #509EE3 transparent;
    }
  }

  &::before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
`

const SettingsPopover = React.memo((props) => {
  const [isAudioEnabled, toggleAudio] = useState(false)
  const [isVideoEnabled, toggleVideo] = useState(false)

  const handleToggleClick = isOpen => () => {
    props.onToggleClick(isOpen)
  }

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Toggle
            innerRef={ref}
            onClick={handleToggleClick(!props.isOpen)}
          />)}
      </Reference>
      {props.isOpen &&
        <Popper placement='bottom'>
          {({ ref, style, placement, arrowProps }) => (
            <BodyContainer
              innerRef={ref}
              style={style}
              data-placement={placement}
            >
              <Checkbox
                label='Disable audio'
                checked={isAudioEnabled}
                onChange={toggleAudio}
              />
              <Checkbox
                label='Disable video'
                checked={isVideoEnabled}
                onChange={toggleVideo}
              />
              <Arrow
                innerRef={arrowProps.ref}
                style={arrowProps.style}
                data-placement={placement}
              />
            </BodyContainer>)}
        </Popper>
      }
    </Manager>
  )
})

SettingsPopover.propTypes = {
  isOpen: PropTypes.bool,
  onToggleClick: PropTypes.func.isRequired
}

SettingsPopover.defaultProps = {
  isOpen: false
}

export default SettingsPopover
