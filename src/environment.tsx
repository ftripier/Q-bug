import React from 'react';

let ENV = <div>{process.env}</div>;
ENV = ENV.props.children;

interface Env {
  REACT_APP_DEBUG_SERVER_PORT: string;
  NODE_ENV: string;
  PUBLIC_URL: string;
}

export default (ENV as unknown) as Env;
