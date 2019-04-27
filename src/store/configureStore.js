import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers'

const initStore = () => {
  const composeEnhancers = process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    (
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'Raven' })
        : compose
    )

  const enhancer = composeEnhancers(
    applyMiddleware(thunk)
  )

  return createStore(reducers, enhancer)
}

export default initStore()
