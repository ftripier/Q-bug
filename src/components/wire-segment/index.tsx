import './index.css';
import React from 'react';

export default function WireSegment({ position, width }: { position: number[]; width: number }) {
  return (
    <div
      className="circuit-wire-segment"
      style={{
        transform: `translate(${position[0]}px, ${position[1]}px)`,
        width: `${width}px`
      }}
    />
  );
}
