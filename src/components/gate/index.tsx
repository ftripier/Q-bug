import './index.css';
import { connect } from 'react-redux';
import React from 'react';
import { Dispatch } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';
import { openGateTooltip, closeGateTooltip } from '../../state/actionCreators';
import { GateID } from '../../state/data/types';
import { getGateTooltips } from '../../state/ui/selectors/tooltips';
import { AppState } from '../../state/types';
import { GateTooltip } from '../tooltips';
import { Matrix } from 'mathjs';

interface GateProps {
  name: string;
  position: number[];
  size: number[];
  id: GateID;
  tooltipIsOpen?: boolean;
  openTooltip: () => void;
  closeTooltip: () => void;
  matrix: Matrix;
}

export const StatelessGate = React.memo(function Gate({
  name,
  position,
  size,
  matrix,
  tooltipIsOpen = false,
  openTooltip,
  closeTooltip
}: GateProps) {
  return (
    <React.Fragment>
      <div
        className="circuit-gate"
        style={{
          transform: `translate(${position[0]}px, ${position[1]}px)`,
          width: `${size[0]}px`,
          height: `${size[1]}px`
        }}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
      >
        <div className="circuit-gate-label">{name}</div>
      </div>
      <CSSTransitionGroup
        transitionName="tooltip"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {tooltipIsOpen && (
          <GateTooltip top={position[1]} left={position[0]} name={name} matrix={matrix} />
        )}
      </CSSTransitionGroup>
    </React.Fragment>
  );
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: GateProps) => ({
  openTooltip() {
    dispatch(openGateTooltip(ownProps.id));
  },
  closeTooltip() {
    dispatch(closeGateTooltip(ownProps.id));
  }
});

const mapStateToProps = (state: AppState, ownProps: GateProps) => {
  const tooltips = getGateTooltips(state);
  const tooltipIsOpen = Boolean(tooltips[ownProps.id]);
  return {
    tooltipIsOpen
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatelessGate);
