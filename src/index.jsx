import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Router, Switch, Route } from 'react-router'
import store from './store/configureStore'
import history from './services/history'
import './globalStyles'

import theme from './themes/default'

import Login from './components/pages/Login'
import App from './containers/App'

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/feedback' component={() => (<div>test</div>)} />
          <Route path='/:roomId' component={App} />
        </Switch>
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)
