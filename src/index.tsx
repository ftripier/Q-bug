import React from 'react';
import ReactDOM from 'react-dom';
import store from './state/store';
import { initializeApplication } from './state/actionCreators';

store.dispatch(initializeApplication());

ReactDOM.render(<div />, document.querySelector('#root'));
