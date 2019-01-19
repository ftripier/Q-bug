import './index.css';
import React from 'react';
import { connect } from 'react-redux';
import Gate from '../gate';
import WireSegment from '../wire-segment';
import { GateLayout, WireLayout } from '../../state/ui/types';
import { getCircuitLayout, getWindowSize } from '../../state/ui/selectors/layout';
import { AppState } from '../../state/types';

export function StatelessCircuit({ gates, wires }: { gates: GateLayout[]; wires: WireLayout[] }) {
  return (
    <div className="circuit-canvas">
      <div className="circuit-wire-layer">
        {wires.map(({ width, top, left }, i) => (
          <WireSegment key={i} position={[left, top]} width={width} />
        ))}
      </div>
      <div className="circuit-gate-layer">
        {gates.map(({ name, top, left, width, height }, i) => (
          <Gate key={i} name={name} position={[left, top]} size={[width, height]} />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  const { wires, gates } = getCircuitLayout(state);
  const windowSize = getWindowSize(state);
  return {
    wires,
    gates,
    windowSize
  };
};

export default connect(mapStateToProps)(StatelessCircuit);
