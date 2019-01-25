import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import TabIcon from './TabIcon'

const TabContainer = styled.div`
  color: ${props => props.active
    ? props.theme.colors.white
    : props.theme.colors.lightGray};
  font-size: ${props => props.theme.fontSizes.normal};
  font-weight: ${props => props.theme.fontWeights.thin};
  position: relative;
  cursor: ${props => !props.disabled ? 'pointer' : 'default'};
  opacity: ${props => props.disabled ? '0.5' : '1'};
  z-index: ${props => props.active ? 200 : 100};

  & + div {
    margin-left: -23px;
  }
`

const TabInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`

const TabLabel = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
`

const Tab = (props) => {
  const handleClick = (event) => {
    if (!props.disabled) {
      props.onClick(event, props.index)
    }
  }

  return (
    <TabContainer
      active={props.active}
      disabled={props.disabled}
      onClick={handleClick}
    >
      <TabInner>
        <TabIcon fill={props.active ? '#509ee3' : '#ccc'} />
        {props.icon}
        <TabLabel>{props.label}</TabLabel>
        {props.children}
      </TabInner>
    </TabContainer>
  )
}

Tab.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  index: PropTypes.number,
  label: PropTypes.string,
  onClick: PropTypes.func
}

Tab.defaultProps = {
  active: false,
  className: '',
  disabled: false,
  onClick: () => {}
}

export default Tab
