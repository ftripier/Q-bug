interface DataState {
  circuit: any[];
}

interface UIState {
  layout: {
    windowSize: Number[];
  };
}

interface AppState {
  data: DataState;
  ui: UIState;
}
