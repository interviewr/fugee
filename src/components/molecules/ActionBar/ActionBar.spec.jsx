import React from 'react'
import { shallow } from 'enzyme'

import ActionBar from './ActionBar'
import Mic from '../../atoms/Icon/Mic'
import Video from '../../atoms/Icon/Video'

const defaultRequiredProps = {
  muteMicrophone: () => {},
  unmuteMicrophone: () => {},
  pauseVideo: () => {},
  resumeVideo: () => {},
  endCall: () => {}
}

describe('<ActionBar /> component', () => {
  it('should render without crashing', () => {
    const component = shallow(<ActionBar {...defaultRequiredProps} />)

    expect(component).toHaveLength(1)
  })

  it('should render <Mic /> component when microphone turned on', () => {
    const component = shallow(
      <ActionBar
        {...defaultRequiredProps}
        isMicrophoneEnabled
      />
    )

    expect(component.find(Mic)).toHaveLength(1)
  })

  it('should render <Video /> component when camera turned on', () => {
    const component = shallow(
      <ActionBar
        {...defaultRequiredProps}
        isCameraEnabled
      />
    )

    expect(component.find(Video)).toHaveLength(1)
  })
})
