import './cnot-gate.css';
import React from 'react';
import { XGate } from './XGate';
import { ControlBit } from './ControlBit';

export default React.memo(({ left, from, to }: { left: number; from: number; to: number }) => (
  <div className="cnot-gate" style={{ left, top: from, height: Math.abs(from - to) }}>
    <div className="cnot-wire">
      <div className="cnot-control-bit" style={{ top: from > to ? '100%' : '0' }}>
        <ControlBit />
      </div>
      <div className="cnot-x-gate" style={{ top: from > to ? '-10px' : 'calc(100% - 10px)' }}>
        <XGate />
      </div>
    </div>
  </div>
));
