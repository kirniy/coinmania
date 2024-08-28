export type Task = {
  platform: "Telegram" | "Instagram";
  name: string;
  tg_id?: string;
  link: string;
  reward: number;
  duration?: number;
  color: string;
};
