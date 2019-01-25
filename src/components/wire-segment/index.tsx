import './index.css';
import React from 'react';

function injectBlurStyles(probabilityZero: number) {
  const blurPx = (1 - probabilityZero) * 2;
  const blurString = `blur(${blurPx}px)`;
  return {
    WebkitFilter: blurString,
    MozFilter: blurString,
    filter: blurString,
    msFilter: blurString
  };
}

export default function WireSegment({
  position,
  width,
  probabilityZero
}: {
  position: number[];
  width: number;
  probabilityZero: number;
}) {
  return (
    <div
      className="circuit-wire-segment"
      style={{
        transform: `translate(${position[0]}px, ${position[1]}px)`,
        width: `${width}px`,
        ...injectBlurStyles(probabilityZero)
      }}
    />
  );
}
