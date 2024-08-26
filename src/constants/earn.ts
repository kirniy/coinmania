import type { Booster } from "@/types/boosters";
import type { Task } from "@/types/tasks";

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

export const TASKS: Task[] = [
  {
    platform: "Telegram",
    name: "Маленькая Виновница",
    tgId: "@qdayvckwds",
    link: "https://t.me/qdayvckwds",
    reward: 20000,
    duration: 15,
    color: "#0088cc",
  },
  {
    platform: "Telegram",
    name: "VNVNC",
    tgId: "@AlfaBank",
    link: "https://t.me/AlfaBank",
    reward: 20000,
    duration: 15,
    color: "#0088cc",
  },
  {
    platform: "Telegram",
    name: "ANGAR",
    tgId: "@rabota_Angarsk",
    link: "https://t.me/rabota_Angarskk",
    reward: 20000,
    duration: 15,
    color: "#0088cc",
  },
  {
    platform: "Instagram",
    name: "Маленькая Виновница",
    tgId: "@qdayvckwds",
    link: "https://t.me/qdayvckwds",
    reward: 20000,
    duration: 15,
    color: "#c300cc",
  },
  {
    platform: "Instagram",
    name: "VNVNC",
    tgId: "@AlfaBank",
    link: "https://t.me/AlfaBank",
    reward: 20000,
    duration: 15,
    color: "#c300cc",
  },
  {
    platform: "Instagram",
    name: "ANGAR",
    tgId: "@rabota_Angarskk",
    link: "https://t.me/rabota_Angarskk",
    reward: 20000,
    duration: 15,
    color: "#c300cc",
  },
];
