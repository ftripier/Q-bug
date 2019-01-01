import ENV from '../environment';

export const createSocketConnection = (): WebSocket => {
  return new WebSocket(`ws://0.0.0.0:${ENV.REACT_APP_DEBUG_SERVER_PORT}`);
};
