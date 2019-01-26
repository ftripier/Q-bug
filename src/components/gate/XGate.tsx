import React from 'react';

export const XGate = () => (
  <svg height="36" width="36" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle stroke="#414a4c" stroke-width="5" fill="none" cx="50" cy="50" r="40" />
    {/* vertical line */}
    <line x1="50" y1="10" x2="50" y2="90" stroke="#414a4c" stroke-width="5" />
    {/* horizontal line */}
    <line x1="10" y1="50" x2="90" y2="50" stroke="#414a4c" stroke-width="5" />
  </svg>
);
