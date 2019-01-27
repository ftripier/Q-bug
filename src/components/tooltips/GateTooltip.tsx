import './gate-tooltip.css';
import React from 'react';
import { Matrix, Complex } from 'mathjs';

import CircuitMatrix from '../matrix';

const EPSILON = 1e-2;

const formatNumber = (num: number | Complex) => {
  if (num.constructor === Number) {
    num = num as number;
    if (Math.abs(Math.abs(num) - Math.sqrt(2) / 2) < EPSILON) {
      return `${num < 0 ? '-' : ''}1/√2`;
    }
    return Math.round(num * 100) / 100;
  }
  return num;
};

export default React.memo(
  ({ top, left, name, matrix }: { top: number; left: number; name: string; matrix: Matrix }) => (
    <div className="gate-tooltip" style={{ transform: `translate(${left}px, ${top}px)` }}>
      <div className="gate-tooltip-name">{name}</div>
      <div className="gate-tooltip-matrix">
        <CircuitMatrix matrix={matrix} />
      </div>
    </div>
  )
);
