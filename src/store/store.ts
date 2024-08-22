import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import type { RootState } from './rootReducer';
import { startCountdown } from './userSlice';

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;