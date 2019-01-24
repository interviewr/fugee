import PropTypes from 'prop-types'
import styled from 'styled-components'

const Label = styled.span`
  color: ${props => props.disabled ? '#666' : '#000'};
  display: inline-block;
  font-size: 13px;
  line-height: 13px;
  padding-left: 16px;
  vertical-align: top;
  white-space: nowrap;
`

Label.propTypes = {
  disabled: PropTypes.bool
}

Label.defaultProps = {
  disabled: false
}

export default Label
