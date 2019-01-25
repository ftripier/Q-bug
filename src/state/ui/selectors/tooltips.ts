import { AppState } from '../../types';

export const getWireSegmentTooltips = (state: AppState) => state.ui.tooltips.wireSegments;
export const getGateTooltips = (state: AppState) => state.ui.tooltips.gates;
