import { combineReducers } from 'redux';
import { Action } from '../../actionCreators';
import { SET_WINDOW_SIZE } from '../../constants';

function windowSize(state = [0, 0], action: Action) {
  switch (action.type) {
    case SET_WINDOW_SIZE:
      if (action.payload) {
        return action.payload.size;
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({ windowSize });
