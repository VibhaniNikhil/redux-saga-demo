import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from '../reducers'
import sagas from '../sagas'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const enhancers = [];
  
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
  
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
  
  const composedEnhancers = compose(
    applyMiddleware(sagaMiddleware),
    ...enhancers
  )

  const store = createStore(
    rootReducer, 
    initialState,
    composedEnhancers
  )
  
  sagaMiddleware.run(sagas)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
