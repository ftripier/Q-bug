import { combineReducers } from 'redux';
import data from './data/reducers';
import ui from './ui/reducers';

export default combineReducers({
  ui,
  data
});
