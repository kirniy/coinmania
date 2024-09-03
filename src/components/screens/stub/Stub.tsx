import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function Stub() {
    const startTime = new Date('2024-09-06T18:00:00Z');
    let time = new Date();
    let diffDays = Math.floor((startTime.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));

    let diff = new Date(startTime.getTime() - time.getTime()).toLocaleTimeString().split(":");
    let diffHours = `${diff[0]}ч ${diff[1]}м ${diff[1]}с`;

    function refreshTime() {        
        time = new Date();
        diffDays = Math.floor((startTime.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));
        diff = new Date(startTime.getTime() - time.getTime()).toLocaleTimeString().split(":");
        diffHours = `${diff[0]}ч ${diff[1]}м ${diff[2]}с`;
    }

    const [theTime, setTheTime] = useState(diffDays > 0 ? `${diffDays}д ${diffHours}` : diffHours)

    const timer = setInterval(() => {
        refreshTime();
        setTheTime(diffDays > 0 ? `${diffDays}д ${diffHours}` : diffHours)
    }, 1000);

    useEffect(() => {
        return () => {
            clearInterval(timer);
        };
    }, []);

  return (
      <div className="h-screen w-full bg-black text-center flex items-start justify-center pt-4">
          <div className="flex flex-col items-center justify-center mt-10">
              <Image src={'/images/logo.svg'} alt="Logo" width={200} height={200} />
              <h2 className="font-bold my-10 mx-10 text-2xl text-white">
                Испытайте удачу и выиграйте до 50000 коинов!
              </h2>
              <p className="mt-2 mx-10 text-xl text-white">Время до запуска</p>
              <p className="mt-2 mx-10 text-xl text-white">{theTime}</p>
          </div>
      </div>
  );
}