import { PrizeProps, RuleProps } from "@/types/rules";

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LightningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
  </svg>
);

const DollarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" x2="12" y1="2" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const EnergyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="10" x="2" y="7" rx="2" ry="2"></rect>
    <line x1="22" x2="22" y1="11" y2="13"></line>
  </svg>
);

const RocketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const CupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const PrizeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="4" rx="1"></rect>
    <path d="M12 8v13"></path>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
  </svg>
);

export const RULES: RuleProps[] = [
  {
    text: "Тапайте по большой монете VNVNC для заработка коинов",
    icon: StarIcon,
  },
  {
    text: "Каждый тап тратит 1 единицу энергии",
    icon: LightningIcon,
  },
  {
    text: "Улучшайте Tap Value для увеличения награды за тап",
    icon: DollarIcon,
  },
  {
    text: "Покупайте улучшения Energy Limit для увеличения запаса энергии",
    icon: EnergyIcon,
  },
  {
    text: "Используйте бустеры Tap Boost и Full Tank для быстрого прогресса",
    icon: RocketIcon,
  },
  {
    text: "Соревнуйтесь с друзьями и попадите в топ-30 игроков",
    icon: CupIcon,
  },
  {
    text: "Обменивайте коины на реальные призы! Дата запуска обмена и стоимость призов в коинах будут анонсированы в сентябре. Stay tuned!",
    icon: PrizeIcon,
  },
];

export const PRIZES: PrizeProps[] = [
  {
    title: "Месяц бесплатных тусовок в VNVNC",
    decription: "Целый месяц безлимитного веселья в лучшем клубе города!",
    cost: 250000,
    left: 2,
    pic: ""
  },
  {
    title: "VIP-депозит на 50 000 ₽",
    decription: "Шикуй как король - твой личный депозит на любые напитки!",
    cost: 200000,
    left: 2,
    pic: ""
  },
  {
    title: "Шанс выступить на сцене с топовыми диджеями",
    decription: "Стань звездой вечеринки, играя сет с лучшими диджеями!",
    cost: 150000,
    left: 5,
    pic: ""
  },
  {
    title: "Эксклюзивный мерч VNVNC",
    decription: "Уникальная коллекция одежды, доступная только для игроков",
    cost: 100000,
    left: 10,
    pic: ""
  },
  {
    title: "Скидка 50% на следующую вечеринку",
    decription: "Отрывайся на полную катушку за полцены!",
    cost: 100000,
    left: 100,
    pic: ""
  }
]