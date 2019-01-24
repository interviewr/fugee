import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledButton = styled.button`
  font-family: ${props => props.theme.fonts.preferred};
  font-size: ${props => props.theme.fontSizes.normal};
  font-weight: ${props => props.theme.fontWeights.normal};
  cursor: pointer;
  width: 100%;
  padding: 10px 15px;
  border: 0;
  background: ${props => props.theme.colors.lightBlue};
  border-radius: 3px;
  color: ${props => props.theme.colors.white};

  &:focus {
    outline: none;
  }
`

const Button = (props) => (
  <StyledButton
    {...props}
    type={props.type}
    disabled={props.disabled}
    onClick={props.onClick}
  >
    {props.title}
  </StyledButton>
)

Button.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['button', 'submit']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

Button.defaultProps = {
  type: 'button',
  disabled: false
}

export default Button
