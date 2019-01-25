import rootReducer, { initialState } from '../../reducer';

import { getWireSegmentTooltips, getGateTooltips } from './tooltips';
import {
  openWireSegmentTooltip,
  closeWireSegmentTooltip,
  openGateTooltip,
  closeGateTooltip
} from '../../actionCreators';

describe('getWireSegmentTooltips', () => {
  it('returns a map that indicates if a given wire segment tooltip is open or not', () => {
    const id = 'FAKE_TOOLTIP_ID';
    let state = rootReducer(initialState, openWireSegmentTooltip(id));
    expect(getWireSegmentTooltips(state)[id]).toBeTruthy();
    expect(getWireSegmentTooltips(state)['THIS ID DOESNT EXIST']).toBeFalsy();

    state = rootReducer(initialState, closeWireSegmentTooltip(id));
    expect(getWireSegmentTooltips(state)[id]).toBeFalsy();
  });
});

describe('getGateTooltips', () => {
  it('returns a map that indicates if a given wire segment tooltip is open or not', () => {
    const id = 'FAKE_TOOLTIP_ID';
    let state = rootReducer(initialState, openGateTooltip(id));
    expect(getGateTooltips(state)[id]).toBeTruthy();
    expect(getGateTooltips(state)['THIS ID DOESNT EXIST']).toBeFalsy();

    state = rootReducer(initialState, closeGateTooltip(id));
    expect(getGateTooltips(state)[id]).toBeFalsy();
  });
});
