'use client';

import Loader from '@/components/loader/loader'
import CoinMania from '@/components/screens_new/main/main'
import MobileDetect from 'mobile-detect'
import { useContext, useEffect, useState } from 'react'
import { webAppContext } from './context'
import { LoadingContext } from './context/LoaderContext'

export default function Home() {
  const app = useContext(webAppContext);
  const { isLoading, setLoading } = useContext(LoadingContext);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    setIsMobile(!!md.mobile());
    setTimeout(() => {
      setLoading(false);
    }, 3000)
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
      document.body.style.zoom = '0.99';
    });

    document.addEventListener('gesturechange', function (e) {
      e.preventDefault();

      document.body.style.zoom = '0.99';
    });
    document.addEventListener('gestureend', function (e) {
      e.preventDefault();
      document.body.style.zoom = '1';
    });
  }, []);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  // if (!isMobile) {
  //     return (
  //         <div className="h-screen w-full bg-black text-center flex items-center justify-center pt-4">
  //             <div className="flex flex-col items-center justify-center">
  //                 <Image src={'/logo.svg'} alt="Logo" width={250} height={250} />
  //                 <h3 className="font-bold my-10 mx-10 text-2xl text-white">
  //                     Пожалуйста, зайдите в приложение с вашего <strong className={'text-blue-500'}>смартфона!</strong>
  //                 </h3>
  //                 <MobileFriendlyIcon fontSize="large" className={'text-yellow-500 '} />
  //             </div>
  //         </div>
  //     );
  // }

  return <>{app.version ? <CoinMania /> : <Loader loading={isLoading} />}</>;
}
