import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers/rootReducer'
import App from './components/App'

const initialState = {
  zipCode: {},
  legislators: []
};

const store = createStore(rootReducer, {state: initialState}, compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

render(
    <App
      store={store}
    />,
  document.getElementById('container')
);

store.subscribe(render);