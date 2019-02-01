import './index.css';
import { connect } from 'react-redux';
import React from 'react';
import { Dispatch } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';
import { openWireSegmentTooltip, closeWireSegmentTooltip } from '../../state/actionCreators';
import { WireSegmentID } from '../../state/data/types';
import { AppState } from '../../state/types';
import { getWireSegmentTooltips } from '../../state/ui/selectors/tooltips';
import { WireSegmentTooltip } from '../tooltips';
import LiveWire from './LiveWire';

const BLUR_PIXEL_UPPER_BOUND = 3;

function injectBlurStyles(percentBlurriness: number) {
  const blurPx = percentBlurriness * BLUR_PIXEL_UPPER_BOUND;
  const blurString = `blur(${blurPx}px)`;
  return {
    WebkitFilter: blurString,
    MozFilter: blurString,
    filter: blurString,
    msFilter: blurString
  };
}

const injectTransparencyStyles = (percentTransparency: number) => ({
  opacity: 1 - percentTransparency
});

const SuperpositionWire = ({
  probabilityZero,
  width
}: {
  probabilityZero: number;
  width: number;
}) => {
  const probabilityOne = 1 - probabilityZero;
  return (
    <div className="circuit-wire-superposition-wire">
      <div
        className="circuit-inactive-wire-segment-line"
        style={{
          ...injectBlurStyles(probabilityOne),
          ...injectTransparencyStyles(probabilityOne)
        }}
      />
      <div className="circuit-active-wire-segment-line" />
      <LiveWire
        width={width}
        density={probabilityOne}
        blur={probabilityZero}
        {...injectTransparencyStyles(probabilityZero)}
      />
    </div>
  );
};

interface WireSegmentProps {
  position: number[];
  width: number;
  probabilityZero: number;
  id: WireSegmentID;
  tooltipIsOpen?: boolean;
  closeTooltip: () => void;
  openTooltip: () => void;
}

export const StatelessWireSegment = React.memo(
  ({
    position,
    width,
    probabilityZero,
    tooltipIsOpen = false,
    openTooltip,
    closeTooltip
  }: WireSegmentProps) => (
    <React.Fragment>
      <div
        className="circuit-wire-segment"
        style={{
          transform: `translate(${position[0]}px, ${position[1] - 30}px)`,
          width: `${width}px`
        }}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
      >
        <SuperpositionWire {...{ probabilityZero, width }} />
      </div>
      <CSSTransitionGroup
        transitionName="tooltip"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {tooltipIsOpen && (
          <WireSegmentTooltip
            top={position[1]}
            left={position[0]}
            probabilityZero={probabilityZero}
          />
        )}
      </CSSTransitionGroup>
    </React.Fragment>
  )
);

const mapDispatchToProps = (dispatch: Dispatch, ownProps: WireSegmentProps) => ({
  openTooltip() {
    dispatch(openWireSegmentTooltip(ownProps.id));
  },
  closeTooltip() {
    dispatch(closeWireSegmentTooltip(ownProps.id));
  }
});

const mapStateToProps = (state: AppState, ownProps: WireSegmentProps) => {
  const tooltips = getWireSegmentTooltips(state);
  const tooltipIsOpen = Boolean(tooltips[ownProps.id]);
  return {
    tooltipIsOpen
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatelessWireSegment);
