import rootReducer, { initialState } from '../../reducer';

import { getWireSegmentTooltips } from './tooltips';
import { openWireSegmentTooltip, closeWireSegmentTooltip } from '../../actionCreators';

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
