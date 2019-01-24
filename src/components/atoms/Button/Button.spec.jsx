import React from 'react'
import { shallow } from 'enzyme'

import Button from './Button'

describe('<Button /> component', () => {
  it('should render without crashing', () => {
    const component = shallow(
      <Button
        title='fake title'
        onClick={() => {}}
      />
    )

    expect(component).toHaveLength(1)
  })
})
