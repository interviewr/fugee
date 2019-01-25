import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TabContentContainer = styled.div`
  display: ${props => props.active ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
`

const TabContent = (props) => (
  <TabContentContainer
    active={props.active}
    className={props.className}
  >
    {props.children}
  </TabContentContainer>
)

TabContent.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
}

TabContent.defaultProps = {
  active: false,
  className: ''
}

export default TabContent
