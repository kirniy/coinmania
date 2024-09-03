import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function Stub() {
    const startTime = new Date('2024-09-06T18:00:00Z');
    let time = new Date();
    let diffDays = Math.floor((startTime.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));
    let diffUTC = new Date(startTime.getTime() - time.getTime());
    let diffHours = `${diffUTC.getUTCHours()}ч ${diffUTC.getUTCMinutes()}м ${diffUTC.getUTCSeconds()}с`;

    function refreshTime() {        
        time = new Date();
        diffDays = Math.floor((startTime.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));
        diffUTC = new Date(startTime.getTime() - time.getTime());
        diffHours = `${diffUTC.getUTCHours()}ч ${diffUTC.getUTCMinutes()}м ${diffUTC.getUTCSeconds()}с`;
    }

    const [theTime, setTheTime] = useState(diffDays > 0 ? `${diffDays}д ${diffHours}` : diffHours)

    useEffect(() => {
        const timer = setInterval(() => {
            refreshTime();
            setTheTime(diffDays > 0 ? `${diffDays}д ${diffHours}` : diffHours)
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [theTime, setTheTime]);

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