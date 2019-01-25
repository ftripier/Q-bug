import { GateWithMask, WireSegment, GateID, WireSegmentID, GateWithID } from '../data/types';

export interface UIState {
  layout: {
    windowSize: number[];
  };
  tooltips: {
    wireSegments: { [key: string]: boolean };
    gates: { [key: string]: boolean };
  };
}

export interface WireLayout {
  top: number;
  left: number;
  width: number;
}

export interface GateLayout extends GateWithID {
  top: number;
  left: number;
  width: number;
  height: number;
  sparse: boolean;
}

export interface WireSegmentLayout extends WireSegment {
  top: number;
  left: number;
  width: number;
}
