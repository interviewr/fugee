import React, { useState } from 'react'
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

const SettingsPopover = () => {
  const [isOpen, tooglePopover] = useState(false)
  const [isAudioEnabled, toggleAudio] = useState(false)
  const [isVideoEnabled, toggleVideo] = useState(false)

  const handleToggleClick = isPopoverOpen => () => {
    tooglePopover(isPopoverOpen)
  }

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Toggle
            ref={ref}
            onClick={handleToggleClick(!isOpen)}
          />)}
      </Reference>
      {isOpen &&
        <Popper placement='bottom'>
          {({ ref, style, placement, arrowProps }) => (
            <BodyContainer
              ref={ref}
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
                ref={arrowProps.ref}
                style={arrowProps.style}
                data-placement={placement}
              />
            </BodyContainer>)}
        </Popper>
      }
    </Manager>
  )
}

export default SettingsPopover
