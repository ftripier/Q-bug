import { combineReducers } from 'redux';
import { Action } from '../../actionCreators';
import { OPEN_WIRE_SEGMENT_TOOLTIP, CLOSE_WIRE_SEGMENT_TOOLTIP } from '../../constants';

function wireSegments(state = {}, action: Action) {
  switch (action.type) {
    case OPEN_WIRE_SEGMENT_TOOLTIP:
      if (action.payload) {
        return { ...state, [action.payload.id]: true };
      }
    case CLOSE_WIRE_SEGMENT_TOOLTIP:
      if (action.payload) {
        return { ...state, [action.payload.id]: false };
      }
    default:
      return state;
  }
}

export default combineReducers({ wireSegments });
