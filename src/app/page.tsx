'use client';

import Loader from '@/components/loader/loader'
import CoinMania from '@/components/screens/main/main'
import { useContext, useEffect } from 'react'
import { webAppContext } from './context'
import { LoadingContext } from './context/LoaderContext'

export default function Home() {
  const {app} = useContext(webAppContext);
  const { isLoading, setLoading } = useContext(LoadingContext);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  // return <>{app.version ? <CoinMania /> : <Loader loading={isLoading} />}</>;
  return <>{<Loader loading={!isLoading} />}</>;
}
