import { BOOSTERS } from '@/constants/earn'
import { MAX_SPINS_PER_DAY } from '@/constants/game.js'
import { referredUserRecord, UserData, userUpgrades } from '@/types/user'
import { checkIsSameDay } from '@/utils/dates'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppThunk } from './store'
import type { userReferralReward } from '@/types/referralReward';

interface UserState {
  data: UserData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchUserData = createAsyncThunk<{user: UserData, serverTime: Date}, number>(
  'user/fetchUserData',
  async (userId: number) => {
    const response = await fetch(`/api/user/data?id=${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Front user', data)
    return data;
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
    updateUserMaxEnergy: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.maxenergy = action.payload;
      }
    },
    updateUserSpin: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.daily_spin_count = action.payload
      }
    },
    updateUserTapBoosterCount: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.daily_tap_boost_count = action.payload;
      }
    },
    updateUserTapBoosterLastTime: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.last_tap_boost_time = action.payload;
      }
    },
    updateUserFullTankCount: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.daily_full_tank_count = action.payload;
      }
    },
    updateUserFullTankLastTime: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.last_full_tank_time = action.payload;
      }
    },
    updateUserTapBoostRemainingTime: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.tap_boost_remaining_time = action.payload;
      }
    },
    updateUserReferred: (state, action: PayloadAction<referredUserRecord>) => {
      if (state.data) {
        state.data.referrals = state.data.referrals.map(referredUserRecord =>
          referredUserRecord.id === action.payload.id ? action.payload : referredUserRecord
        );
      }
    },
    updateUserUpgrades: (state, action: PayloadAction<userUpgrades>) => {
      if (state.data) {
        state.data.upgrades = action.payload;
      }
    },
    updateIsRechargingEnergy: (state, action: PayloadAction<boolean>) => {
      if (state.data) {
        state.data.isRechargingEnergy = action.payload;
      }
    },
    updateUserCompletedTasks: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.completedTasks.concat(action.payload);
      }
    },
    updateUserReferralReward: (state, action: PayloadAction<userReferralReward[]>) => {
      if (state.data) {
        state.data.referral_rewards = action.payload;
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

        const userData = action.payload.user;
        state.status = 'succeeded';
        state.data = userData;
        state.data.energy = Math.min(userData.energy ?? 0, userData.maxenergy);

        const lastSpinTime = userData.last_spin_time ? new Date(userData.last_spin_time) : new Date(0);
        const isSameDay = checkIsSameDay(lastSpinTime, action.payload.serverTime);

        let availableSpinCount = isSameDay
            ? MAX_SPINS_PER_DAY - userData.daily_spin_count ?? 0
            : MAX_SPINS_PER_DAY;

        state.data.daily_spin_count = availableSpinCount;

        // Boosters

        BOOSTERS.forEach(booster => {
          const lastBoostTime = userData[`last_${booster.slug}_time`]
            ? new Date(userData[`last_${booster.slug}_time`] ?? 0)
            : new Date(0);
          const isSameDay = checkIsSameDay(lastBoostTime, action.payload.serverTime);
  
          let availableBoostCount = isSameDay
              ? userData[`daily_${booster.slug}_count`] ?? booster.maxUsePerDay
              : booster.maxUsePerDay;

          if (state.data) {
            state.data[`daily_${booster.slug}_count`] = availableBoostCount;
          }
        })

        state.data.isRechargingEnergy = true;
        // Upgrades

        const defaultUserUpgrades: userUpgrades = {
          tap_value: 1,
          energy_limit: 1,
          recharging_speed: 1,
        };

        if (!userData.upgrades) {
          state.data.upgrades = defaultUserUpgrades;
        } else {
          state.data.upgrades = userData.upgrades;
        }

        state.data.completedTasks = []
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log('action', action)
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export const {
  updateUserScores,
  updateUserEnergy,
  updateUserMaxEnergy,
  updateUserSpin,
  updateUserTapBoosterCount,
  updateUserTapBoosterLastTime,
  updateUserFullTankCount,
  updateUserFullTankLastTime,
  updateUserTapBoostRemainingTime,
  updateUserReferred,
  updateUserUpgrades,
  updateIsRechargingEnergy,
  updateUserCompletedTasks,
  updateUserReferralReward,
} = userSlice.actions;

export const startCountdown = (): AppThunk => (dispatch, getState) => {
  if (typeof window === 'undefined') {
    return;
  }

  const timer = setInterval(() => {
    const state = getState().user;    
    if (state.data) {
      if (
        state.data.tap_boost_remaining_time
        && state.data.tap_boost_remaining_time > 0
      ) {
        dispatch(updateUserTapBoostRemainingTime(Math.max(0, state.data.tap_boost_remaining_time - 1000)));
      } else {
        clearInterval(timer);
      }
    }

  }, 1000);
};

export const startEnergyResetInterval = (): AppThunk => (dispatch, getState) => {
  if (typeof window === 'undefined') {
    return;
  }

  const interval = setInterval(() => {
    const state = getState().user;
    if (state.data) {     
      if (
        state.data.energy !== null
        && state.data.upgrades.recharging_speed
        && state.data.energy < state.data.maxenergy
        && state.data.isRechargingEnergy
      ) {
        dispatch(updateUserEnergy(Math.min(state.data.energy + state.data.upgrades.recharging_speed, state.data.maxenergy)));
      }
    }

  }, 1000);

  const heartbeatIntervalId = setInterval(async () => {
    const state = getState().user;

    if (state.data) {
      axios.get(`/api/user/heartbeat?id=${state.data.id}&energy=${state.data.energy}`)
    }
  }, 10000)
};

export default userSlice.reducer;