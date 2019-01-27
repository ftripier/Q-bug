import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { circuit } from '../../state/data/types';
import { setCircuitState, setWindowSize } from '../../state/actionCreators';
import reducer from '../../state/reducer';
import Circuit from './index';
import groversAlgorithm from '../../testing/fixtures/groversAlgorithm';
import superposition from '../../testing/fixtures/superposition';

const prepareStore = (circuit: circuit, windowSize: number[]) => {
  const store = createStore(reducer);
  store.dispatch(setCircuitState(circuit));
  store.dispatch(setWindowSize(windowSize));
  return store;
};

storiesOf('Circuit', module)
  .add("Grover's algorithm", () => (
    <Provider store={prepareStore(groversAlgorithm, [1000, 400])}>
      <Circuit />
    </Provider>
  ))
  .add('Bell state', () => (
    <Provider store={prepareStore(superposition, [600, 400])}>
      <Circuit />
    </Provider>
  ));
