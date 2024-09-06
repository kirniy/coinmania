import type { Booster } from "@/types/boosters";
import { referralReward } from "@/types/referralReward";

export const BOOSTERS: Booster[] = [
  {
    name: "Full Tank",
    slug: "full_tank",
    description: "Восстановление полной энергии",
    duration: 0,
    maxUsePerDay: 3,
    action: "resetEnergy",
    bgColor: "#f8cc46",
  },
  {
    name: "Tap Boost",
    slug: "tap_boost",
    description: "Множитель x5 на 20 секунд",
    duration: 20,
    maxUsePerDay: 3,
    action: "tapBoost",
    bgColor: "#ff7f50",
  },
];

export const REFERRAL_TASKS: referralReward[] = [
  {
    goal: 3,
    reward: 6e4,
  },
  {
    goal: 5,
    reward: 1e5,
  },
  {
    goal: 10,
    reward: 2e5,
  },
  {
    goal: 20,
    reward: 4e5,
  },
  {
    goal: 50,
    reward: 1e6,
  },
  {
    goal: 100,
    reward: 2.5e6,
  },
]