import LockDesctopScreen from '@/components/LockDesctopScreen'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import { BrowserView, MobileView, isAndroid, isBrowser, isIOS, isMobile, osName } from 'react-device-detect'
import './globals.scss'
import Providers from './providers/providers'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebApp telegram template',
  description: 'WebApp Telegram template for new projects'
};

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
console.log('environment', process?.env)
console.log('environment2', process?.env?.NEXT_PUBLIC_ENVIRONMENT)
let checkIsMobile = isMobile;

console.log('isMobile', BrowserView, MobileView, isBrowser, isMobile, isIOS, isAndroid,osName)

if (environment === 'development') {
  checkIsMobile = true;
}
console.log('checkIsMobile', checkIsMobile)

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover, minimum-scale=1.0, maximum-scale=1.0'
        />
        <meta name='color-scheme' content='light' />
        <meta name='format-detection' content='telephone=no' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='MobileOptimized' content='176' />
        <meta name='HandheldFriendly' content='True' />
        <meta name='robots' content='noindex,nofollow' />
        <Script
          src='https://telegram.org/js/telegram-web-app.js'
          strategy='beforeInteractive'
        />
      </head>
      <body className={inter.className}>
        {
          checkIsMobile ? <Providers>{children}</Providers> : <LockDesctopScreen/>
        }
      </body>
    </html>
  );
}
