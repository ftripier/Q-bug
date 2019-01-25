import './index.css';
import React from 'react';

export default React.memo(function Gate({
  name,
  position,
  size
}: {
  name: string;
  position: number[];
  size: number[];
}) {
  return (
    <div
      className="circuit-gate"
      style={{
        transform: `translate(${position[0]}px, ${position[1]}px)`,
        width: `${size[0]}px`,
        height: `${size[1]}px`
      }}
    >
      <div className="circuit-gate-label">{name}</div>
    </div>
  );
});
