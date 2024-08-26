export type Task = {
  platform: "Telegram" | "Instagram";
  name: string;
  tgId: string;
  link: string;
  reward: number;
  duration: number;
  color: string;
};
