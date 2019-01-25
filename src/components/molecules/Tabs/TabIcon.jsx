import React from 'react'
import PropTypes from 'prop-types'

const TabIcon = (props) => (
  <svg
    fill={props.fill}
    height={props.height}
    viewBox='0 0 195 30'
    width={props.width}
    xmlns='http://www.w3.org/2000/svg'
  >
    <g transform='translate(-6.000000, -406.000000)'>
      <g transform='translate(-57.000000, 186.000000)'>
        <path d='M246.633667,246.069149 C246.989839,245.473891 247.260255,244.835024 247.422482,244.170162 L252.054912,225.184813 C252.452657,222.256705 254.962788,220 258,220 L63,220 C66.0371943,220 68.547313,222.256678 68.9450811,225.18476 L73.5775195,244.170162 C74.3644558,247.395311 77.6854884,250 80.9982063,250 L240.001794,250 C240.170207,250 240.338649,249.993252 240.506782,249.980019 C240.66944,249.993253 240.833932,250 241,250 C243.586525,250 245.790788,248.363342 246.633667,246.069149 Z' />
      </g>
    </g>
  </svg>
)

TabIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string
}

TabIcon.defaultProps = {
  width: 195,
  height: 30,
  fill: '#509ee3'
}

export default TabIcon
