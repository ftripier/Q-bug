import { Action } from '../../actionCreators';
import { SET_CIRCUIT_STATE } from '../../constants';

export default function circuitReducer(state = [], action: Action) {
  switch (action.type) {
    case SET_CIRCUIT_STATE:
      if (action.payload) {
        return action.payload.circuit;
      }
      return state;
    default:
      return state;
  }
}
