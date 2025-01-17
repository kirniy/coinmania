import { lockBrowserEvents } from '@/helpers/lockBrowserEvents'
import { createContext, ReactNode, useEffect, useState } from 'react'

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

const defaultValue: LoadingContextType = {
  isLoading: true,
  setLoading: () => {}
};

export const LoadingContext = createContext<LoadingContextType>(defaultValue);

type Props = { children: ReactNode };

const LoadingProvider = ({ children }: Props) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(()=> {
    lockBrowserEvents();
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
