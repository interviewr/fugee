import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
`

const StyledInput = styled.input`
  font-family: ${props => props.theme.fonts.preferred};
  font-size: ${props => props.theme.fontSizes.normal};
  font-weight: ${props => props.theme.fontWeights.normal};
  background: transparent;
  border: 0;
  color: ${props => props.theme.colors.lightGray};
  outline: none;
  border-bottom: 1px solid;
  border-bottom-color: ${props => props.theme.colors.lightGray};
  width: 100%;
  height: 35px;
  padding: 0 15px;
  text-align: center;

  &:focus {
    border-bottom-color: ${props => props.theme.colors.white};
    transition: border-bottom-color 0.3s ease-in-out;
  }

  &::-webkit-input-placeholder,
  &:-ms-input-placeholder {
    color: ${props => props.theme.colors.lightGray};
  }
`

const Input = (props) => {
  const handleChange = (event) => {
    props.onChange(event.target.value)
  }

  return (
    <Wrapper>
      <StyledInput
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
      />
    </Wrapper>
  )
}

Input.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

Input.defaultProps = {
  placeholder: 'Type something'
}

export default Input
