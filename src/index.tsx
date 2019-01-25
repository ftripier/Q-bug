import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import { initializeApplication } from './state/actionCreators';
import Circuit from './components/circuit';

store.dispatch(initializeApplication());

ReactDOM.render(
  <Provider store={store}>
    <Circuit />
  </Provider>,
  document.querySelector('#root')
);
