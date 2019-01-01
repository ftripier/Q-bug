import React from 'react';
import ReactDOM from 'react-dom';
import ENV from './environment';
import quilToJSON from 'quil-json-js';

const ws = new WebSocket(`ws://0.0.0.0:${ENV.REACT_APP_DEBUG_SERVER_PORT}`);

ws.onmessage = event => {
  console.log(quilToJSON(event.data));
};

ReactDOM.render(<div />, document.querySelector('#root'));
