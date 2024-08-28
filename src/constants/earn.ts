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

// export const TASKS: Task[] = [
//   {
//     platform: "Telegram",
//     name: "Маленькая Виновница",
//     tg_id: "@qdayvckwds",
//     link: "https://t.me/qdayvckwds",
//     reward: 20000,
//     duration: 15,
//     color: "#0088cc",
//   },
//   {
//     platform: "Telegram",
//     name: "VNVNC",
//     tg_id: "@AlfaBank",
//     link: "https://t.me/AlfaBank",
//     reward: 20000,
//     duration: 15,
//     color: "#0088cc",
//   },
//   {
//     platform: "Telegram",
//     name: "ANGAR",
//     tg_id: "@rabota_Angarsk",
//     link: "https://t.me/rabota_Angarskk",
//     reward: 20000,
//     duration: 15,
//     color: "#0088cc",
//   },
//   {
//     platform: "Instagram",
//     name: "Маленькая Виновница",
//     link: "https://t.me/qdayvckwds",
//     reward: 20000,
//     duration: 15,
//     color: "#c300cc",
//   },
//   {
//     platform: "Instagram",
//     name: "VNVNC",
//     link: "https://t.me/AlfaBank",
//     reward: 20000,
//     duration: 15,
//     color: "#c300cc",
//   },
//   {
//     platform: "Instagram",
//     name: "ANGAR",
//     link: "https://t.me/rabota_Angarskk",
//     reward: 20000,
//     duration: 15,
//     color: "#c300cc",
//   },
// ];
