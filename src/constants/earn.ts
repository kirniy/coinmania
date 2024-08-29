import type { Booster } from "@/types/boosters";

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