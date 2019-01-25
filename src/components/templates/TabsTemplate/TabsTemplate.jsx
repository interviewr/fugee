import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs } from '../../molecules/Tabs'

const TabsTemplate = (props) => {
  const [activeTabIndex, setActiveTab] = useState(0)

  return (
    <Tabs
      index={activeTabIndex}
      onChange={setActiveTab}
    >
      <Tab label={props.tab1Label}>
        {props.tab1}
      </Tab>
      <Tab label={props.tab2Label}>
        {props.tab2}
      </Tab>
    </Tabs>
  )
}

TabsTemplate.propTypes = {
  tab1: PropTypes.node.isRequired,
  tab2: PropTypes.node.isRequired,
  tab1Label: PropTypes.string.isRequired,
  tab2Label: PropTypes.string.isRequired
}

export default TabsTemplate
