import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import type { RootState } from './rootReducer';
import { startCountdown, startEnergyResetInterval } from './userSlice';

const store = configureStore({
  reducer: rootReducer,
});

store.dispatch(startCountdown());
store.dispatch(startEnergyResetInterval());

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;