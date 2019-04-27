import '@babel/polyfill'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Router, Switch, Route } from 'react-router'
import store from './store/configureStore'
import history from './services/history'

import GlobalStyle from './components/GlobalStyle'
import Login from './components/pages/Login'
import theme from './themes/default'

import App from './components/pages/App'

const ConfiguredApp = () => (
  <App
    configUrl={{}}
    roomName='test'
    roomPassword=''
  />
)

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Fragment>
        <GlobalStyle />
        <Router history={history}>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/feedback' component={ConfiguredApp} />
          </Switch>
        </Router>
      </Fragment>
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)
