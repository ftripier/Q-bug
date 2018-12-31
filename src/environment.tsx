import React from 'react';

let ENV = <div>{process.env}</div>;
ENV = ENV.props.children;

export default ENV;
