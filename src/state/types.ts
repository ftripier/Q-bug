import { DataState } from './data/types';
import { UIState } from './ui/types';

export interface AppState {
  data: DataState;
  ui: UIState;
}
