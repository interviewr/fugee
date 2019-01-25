import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import TabsTemplate from '../../templates/TabsTemplate'
import VideoConferenceTab from '../../../containers/VideoConferenceTab'

const Conference = (props) => {
  useEffect(() => {
    props.joinRoom(props.roomId)
  })

  return (
    <TabsTemplate
      tab1Label='tab1'
      tab1={<VideoConferenceTab />}
      tab2Label='tab2'
      tab2={'Tab#2 Content'}
    />
  )
}

Conference.propTypes = {
  roomId: PropTypes.string.isRequired,
  joinRoom: PropTypes.func.isRequired
}

export default Conference
