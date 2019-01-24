import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import Label from '../../atoms/Label'

const checkmarkExpand = keyframes`
  0% {
    top: 0.9rem;
    left: 0.5rem;
    width: 0;
    height: 0;
  }

  100% {
    top: 0.1rem;
    left: 0.4rem;
    width: 0.55rem;
    height: 1rem;
  }
`

const CheckboxContainer = styled.label`
  position: relative;
  display: block;
  height: 1.8rem;
  flex-grow: 1;
  margin-bottom: 2px;
  white-space: nowrap;
`

const Input = styled.input.attrs({
  readOnly: true,
  type: 'checkbox'
})`
  position: absolute;
  height: 0;
  width: 0;
  overflow: hidden;
  opacity: 0;
`

const Check = styled.div.attrs({
  className: props => props.checked ? 'checked' : ''
})`
  cursor: ${props => props.disabled ? 'auto' : 'pointer'};
  position: relative;
  display: inline-block;
  width: 16px;
  min-width: 16px;
  height: 16px;
  vertical-align: top;
  border-color: ${props => props.disabled ? '#ccc' : '#ebf1f7'};
  border-radius: 2px;
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  border: 1px solid  #ebf1f7;
  background: #ebf1f7;
  transition-timing-function: initial;
  transition-duration: 0.2s;

  &.checked {
    cursor: ${props => props.disabled ? 'auto' : 'pointer'};
    background-color: ${props => props.disabled ? '#ccc' : '#ebf1f7'};
    border-color: ${props => props.disabled ? 'transparent' : '#ebf1f7'};

    &:after {
      content: '';
      animation: ${checkmarkExpand} 140ms ease-out forwards;
      position: absolute;
      transform: rotate(45deg);
      border-color: #3a71b3;
      border-bottom-width: 2px;
      border-left: 0;
      border-right-width: 2px;
      border-style: solid;
      border-top: 0;
      top: 0.1rem;
      left: 0.4rem;
      width: 0.55rem;
      height: 1rem;
      animation: initial;
    }
  }
`

const Checkbox = (props) => {
  const handleToggle = (event) => {
    if (!props.disabled && props.onChange) {
      props.onChange(!props.checked, props.value, event)
    }
  }

  return (
    <CheckboxContainer>
      <Input
        disabled={props.disabled}
        onClick={handleToggle}
      />
      <Check checked={props.checked} />
      {props.label &&
        <Label disabled={props.disabled}>
          {props.label}
        </Label>
      }
    </CheckboxContainer>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string
}

Checkbox.defaultProps = {
  checked: false,
  className: '',
  disabled: false,
  value: '',
  onChange: () => {}
}

export default Checkbox
