import { MAX_SPINS_PER_DAY } from '@/constants/game.js'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserData {
  booster_x2: string | null;
  booster_x3: string | null;
  booster_x5: string | null;
  daily_spin_count: number;
  energy: number | null;
  energyresettime: string;
  first_name: string;
  id: string;
  last_login_time: string;
  last_name: string;
  last_spin_time: string | null;
  maxenergy: number;
  referal_id: string | null;
  scores: number | null;
  username: string;
}

interface UserState {
  data: UserData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchUserData = createAsyncThunk<UserData, number>(
  'user/fetchUserData',
  async (userId: number) => {
    const response = await fetch(`/api/user/data?id=${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data?.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserScores: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.scores = action.payload
      }
    },
    updateUserEnergy: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.energy = action.payload
      }
    },
    updateUserSpin: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.daily_spin_count = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        console.log('state', state)
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.status = 'failed';
          state.error = 'Failed to fetch user data';
          return;
        }
        console.log('action.payload', action.payload)
        state.status = 'succeeded';
        state.data = action.payload;
        state.data.energy = Math.min(action.payload.energy ?? 0, action.payload.maxenergy);

        const lastSpinTime = action.payload.last_spin_time ? new Date(action.payload.last_spin_time) : new Date(0);
        const isSameDay = lastSpinTime.toDateString() === new Date().toDateString();

        let availableSpinCount = isSameDay
            ? MAX_SPINS_PER_DAY - action.payload.daily_spin_count ?? 0
            : MAX_SPINS_PER_DAY;

        state.data.daily_spin_count = availableSpinCount;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log('action', action)
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export const { updateUserScores, updateUserEnergy, updateUserSpin } = userSlice.actions;
export default userSlice.reducer;