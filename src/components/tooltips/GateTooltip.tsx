import './gate-tooltip.css';
import React from 'react';
import { Matrix } from 'mathjs';

import CircuitMatrix from '../matrix';

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
