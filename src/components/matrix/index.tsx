import './index.css';
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

export default React.memo(({ matrix }: { matrix: Matrix }) => {
  const matrixArr = matrix.toArray() as (number | Complex)[][];
  const [matrixRows, matrixCols] = matrix.size();
  return (
    <div
      className="circuit-matrix"
      style={{
        gridTemplateColumns: `repeat(${matrixCols}, 1fr)`,
        gridTemplateRows: `repeat(${matrixRows}, 1fr)`
      }}
    >
      {matrixArr.map((row, rowNum) =>
        row.map((c, colNum) => (
          <span
            style={{
              gridRow: `${rowNum + 1} / ${rowNum + 2}`,
              gridColumn: `${colNum + 1} / ${colNum + 2}`
            }}
            className="circuit-matrix-column"
          >
            {formatNumber(c)}
          </span>
        ))
      )}
    </div>
  );
});
