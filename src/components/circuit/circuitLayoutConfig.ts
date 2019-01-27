/**
 * This module is imported by the layout selector and used to calculate the circuit layou.
 *
 * In the future, circuits and gates will most likely be rendered in WebGL, so layout
 * and styling information is configured and calculated in JavaScript/the application rather than CSS.the browser.
 */

export default {
  // units are in pixels
  padding: {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  },
  wire: {
    height: 40,
    margin: 18
  },
  gate: {
    width: 40,
    margin: {
      left: 18
    }
  }
};
