'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WebAppProvider } from '../context';
import LoadingProvider from '../context/LoaderContext';

interface IPropsProviders {
  children: React.ReactNode;
}

const Providers = ({ children }: IPropsProviders) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WebAppProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </WebAppProvider>
    </QueryClientProvider>
  );
};

export default Providers;
