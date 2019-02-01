import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import { initializeApplication, setCircuitState } from './state/actionCreators';
import Circuit from './components/circuit';
import groversAlgorithm from './testing/fixtures/groversAlgorithm';

store.dispatch(initializeApplication());
store.dispatch(setCircuitState(groversAlgorithm));

ReactDOM.render(
  <Provider store={store}>
    <Circuit />
  </Provider>,
  document.querySelector('#root')
);
