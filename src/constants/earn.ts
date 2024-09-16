import type { Booster } from "@/types/boosters"
import { referralReward } from "@/types/referralReward"
import { Battery, Zap } from 'lucide-react'

export const BOOSTERS: Booster[] = [
  {
    name: "Full Tank",
    slug: "full_tank",
    description: "Мгновенно заполняет Energy bar до максимума",
    duration: 0,
    maxUsePerDay: 3,
    action: "resetEnergy",
    icon: Battery,
    bgColor: "#f8cc46",
  },
  {
    name: "Tap Boost",
    slug: "tap_boost",
    description: "Каждый тап дает в 5 раз больше коинов в течение 20 секунд",
    duration: 20,
    maxUsePerDay: 3,
    action: "tapBoost",
    icon: Zap, 
    bgColor: "#ff7f50",
  }
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