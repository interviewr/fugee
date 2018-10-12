import createBrowserHistory from 'history/createBrowserHistory' // dep of react-router

export default createBrowserHistory({
  basename: URI_PREFIX || ''
})
