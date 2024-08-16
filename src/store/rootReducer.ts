import { combineReducers } from '@reduxjs/toolkit'
import tabReducer from './tabSlice'
import userReducer from './userSlice'

const rootReducer = combineReducers({
  tab: tabReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;