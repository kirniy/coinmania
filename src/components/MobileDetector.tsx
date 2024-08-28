"use client";

import { useEffect, useState } from 'react'
import LockDesktop from './screens/lock/LockDesktop'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    setIsMobile(true);

    // if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    //   setIsMobile(true);
    // } else {
    //   const userAgent = navigator.userAgent || navigator.vendor;
    //   setIsMobile(toMatch.some((toMatchItem) => userAgent.match(toMatchItem)));
    // }
  }, []);

  return isMobile;
};

const MobileDetector = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? children : <LockDesktop />}
    </>
  );
};

export default MobileDetector;
