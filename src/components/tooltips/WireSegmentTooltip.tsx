import './wire-segment-tooltip.css';
import React from 'react';

const formatProbability = (probability: number) => `${Math.round(probability * 10000) / 100}%`;

export default React.memo(
  ({ top, left, probabilityZero }: { top: number; left: number; probabilityZero: number }) => (
    <div className="wire-segment-tooltip" style={{ transform: `translate(${left}px, ${top}px)` }}>
      <div className="wire-segment-tooltip-probability-row">
        <span className="wire-segment-basis-element">|0></span>
        {formatProbability(probabilityZero)}
      </div>
      <div className="wire-segment-tooltip-row-divider" />
      <div className="wire-segment-tooltip-probability-row">
        <span className="wire-segment-basis-element">|1></span>
        {formatProbability(1 - probabilityZero)}
      </div>
    </div>
  )
);
