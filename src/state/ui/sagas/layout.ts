import { take, takeLatest, call, put, fork } from 'redux-saga/effects';
import { delay } from '../../sagaLib';
import { eventChannel } from 'redux-saga';
import { readSize, addListener, removeListener } from '../../../dom/window';
import { setWindowSize } from '../../actionCreators';
import { INITIALIZE_APPLICATION } from '../../constants';

function createWindowSizeListener() {
  return eventChannel(emit => {
    const listener = () => {
      emit(readSize());
    };

    addListener('resize', listener);

    const unsubscribe = () => {
      removeListener('resize', listener);
    };

    return unsubscribe;
  });
}

function* processReflow(payload: number[]) {
  // reflows are projected to be expensive, and occur at least on every window resize
  // hence, this debouncing
  yield delay(300);
  yield put(setWindowSize(payload));
}

function* resizeWindow() {
  // read the initial size of the window
  yield put(setWindowSize(readSize()));

  // and update our state whenever the actual window changes
  const resizeChannel = yield call(createWindowSizeListener);
  yield takeLatest(resizeChannel, processReflow);
}

export default function* responsiveLayout() {
  yield take(INITIALIZE_APPLICATION);
  yield fork(resizeWindow);
}
