'use client';

import LoadingProvider, { LoadingContext } from '@/app/context/LoaderContext'
import store, { AppDispatch } from '@/store/store'
import { fetchUserData } from '@/store/userSlice'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useContext, useEffect } from 'react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { WebAppProvider, webAppContext } from '../context'

interface IPropsProviders {
  children: React.ReactNode;
}

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const { app, isMounted } = useContext(webAppContext);
  const { isLoading, setLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (isMounted && app.initDataUnsafe?.user?.id) {
      dispatch(fetchUserData(app.initDataUnsafe.user.id)).then(() => {
        setTimeout(() => {
          app.setHeaderColor("#000000");
          setLoading(false);
        }, 3000) // Визуальная задержка
      });
    }
  }, [isMounted, app, dispatch]);

  return <>{children}</>;
};

const Providers = ({ children }: IPropsProviders) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WebAppProvider>
        <ReduxProvider store={store}>
          <LoadingProvider>
            <AppInitializer>{children}</AppInitializer>
          </LoadingProvider>
        </ReduxProvider>
      </WebAppProvider>
    </QueryClientProvider>
  );
};

export default Providers;
