import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Tab from './Tab'
import TabContent from './TabContent'

const isComponentOfType = (type, component) => (
  component && component.type === type
)

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`

const Navigation = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  border-top: 2px solid #509ee3;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

const Tabs = (props) => {
  const handleHeaderClick = (index) => {
    props.onChange(index)
  }

  const filterContent = () => {
    const headers = []
    const contents = []

    React.Children.forEach(props.children, (child) => {
      if (isComponentOfType(Tab, child)) {
        headers.push(child)

        if (child.props.children) {
          contents.push(<TabContent>{child.props.children}</TabContent>)
        }
      } else if (isComponentOfType(TabContent, child)) {
        contents.push(child)
      }
    })

    return { headers, contents }
  }

  const renderHeaders = (headers) => (
    headers.map((header, index) => React.cloneElement(header, {
      index,
      children: null,
      key: index,
      active: props.index === index,
      onClick: (event, index) => {
        handleHeaderClick(index)
        if (header.props.onClick) {
          header.props.onClick(event)
        }
      }
    }))
  )

  const renderContents = (contents) => (
    contents.map((content, index) => React.cloneElement(content, {
      key: index,
      active: props.index === index,
      tabIndex: index
    }))
  )

  const { headers, contents } = filterContent()

  return (
    <TabsContainer>
      <Navigation>
        {renderHeaders(headers)}
      </Navigation>
      {renderContents(contents)}
    </TabsContainer>
  )
}

Tabs.propTypes = {
  index: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  onChange: PropTypes.func
}

Tabs.defaultProps = {
  index: 0,
  onChange: () => {}
}

export default Tabs
