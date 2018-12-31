import React from 'react';
import ReactDOM from 'react-dom';
import ENV from './environment';

console.log(ENV);

const ws = new WebSocket(`ws://0.0.0.0:${ENV.REACT_APP_DEBUG_SERVER_PORT}`);

ws.onmessage = event => {
  console.log(event.data);
};

ReactDOM.render(<div />, document.querySelector('#root'));
