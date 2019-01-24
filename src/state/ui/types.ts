import { GateWithMask, WireSegment } from '../data/types';

export interface UIState {
  layout: {
    windowSize: number[];
  };
}

export interface WireLayout {
  top: number;
  left: number;
  width: number;
}

export interface GateLayout extends GateWithMask {
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
