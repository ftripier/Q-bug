import './gate-tooltip.css';
import React from 'react';
import { Matrix, Complex } from 'mathjs';

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
        {(matrix.toArray() as (number | Complex)[][]).map(row => (
          <div className="gate-tooltip-matrix-row">
            {row.map(c => (
              <span className="gate-tooltip-matrix-component">{formatNumber(c)}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
);
