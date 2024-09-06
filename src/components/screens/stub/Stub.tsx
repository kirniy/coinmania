import { GAME_START_DATE } from '@/constants/game';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Stub({ serverTime }: { serverTime: number | null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [theTime, setTheTime] = useState<string | undefined>('...');
  const time = useRef<number | null>(null);
  
  // Обновляем время и форматируем вывод
  const refreshTime = () => {
    if (time.current === null) return;

    const remainingTime = GAME_START_DATE.getTime() - time.current;
    const diffDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const diffUTC = new Date(remainingTime);
    const diffHours = `${diffUTC.getUTCHours()}ч ${diffUTC.getUTCMinutes()}м ${diffUTC.getUTCSeconds()}с`;

    return diffDays > 0 ? `${diffDays}д ${diffHours}` : diffHours;
  };

  // Первичная установка времени
  useEffect(() => {
    if (serverTime) {
      time.current = serverTime;
      setIsLoading(false); // serverTime получен, убираем статус загрузки
      setTheTime(refreshTime()); // Обновляем отображение таймера
    }
  }, [serverTime]);

  // Запускаем таймер
  useEffect(() => {
    const timer = setInterval(() => {
      if (time.current === null) return;
      time.current += 1000;
      setTheTime(refreshTime());
    }, 1000);

    return () => clearInterval(timer); // Очистка таймера при размонтировании
  }, []);

  return (
    <div className="h-screen w-full bg-black text-center flex items-start justify-center pt-4">
      <div className="flex flex-col items-center justify-center mt-10">
        <Image src={'/images/logo.svg'} alt="Logo" width={200} height={200} />
        <h2 className="font-bold my-10 mx-10 text-2xl text-white">
          Испытайте удачу и выиграйте до 50000 коинов!
        </h2>
        <p className="mt-2 mx-10 text-xl text-white">Время до запуска</p>
        <p className="mt-2 mx-10 text-xl text-white">
          {isLoading ? "..." : theTime}
        </p>
      </div>
    </div>
  );
}
