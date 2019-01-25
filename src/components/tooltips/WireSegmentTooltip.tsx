import './wire-segment-tooltip.css';
import React from 'react';

export default React.memo(
  ({ top, left, probabilityZero }: { top: number; left: number; probabilityZero: number }) => (
    <div className="wire-segment-tooltip" style={{ transform: `translate(${left}px, ${top}px)` }}>
      <div className="wire-segment-tooltip-probability-row">
        <span className="wire-segment-basis-element">|0></span>
        {(probabilityZero * 100).toFixed(2)}%
      </div>
      <div className="wire-segment-tooltip-row-divider" />
      <div className="wire-segment-tooltip-probability-row">
        <span className="wire-segment-basis-element">|1></span>
        {((1 - probabilityZero) * 100).toFixed(2)}%
      </div>
    </div>
  )
);
