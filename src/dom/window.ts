// this library mostly exists to easily mock out the expected dom interface
// in jest tests.

export const addListener = (event: string, listener: EventListenerOrEventListenerObject) => {
  window.addEventListener(event, listener);
};

export const removeListener = (event: string, listener: EventListenerOrEventListenerObject) => {
  window.removeEventListener(event, listener);
};

export const readSize = () => {
  return [window.innerWidth, window.innerHeight];
};
