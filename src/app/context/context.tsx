import { lockBrowserEvents } from '@/helpers/lockBrowserEvents'
import React, { createContext, useEffect, useState } from 'react'
import type { TelegramWebApps } from 'telegram-webapps-types-new'

interface IProps {
  children: React.ReactNode;
}

interface WebAppContextValue {
  app: TelegramWebApps.WebApp;
  isMounted: boolean;
}

export const webAppContext = createContext<WebAppContextValue>({
  app: {} as TelegramWebApps.WebApp,
  isMounted: false,
});

export const WebAppProvider = ({ children }: IProps) => {
  const [app, setApp] = useState({} as TelegramWebApps.WebApp);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setApp(window.Telegram.WebApp);
  }, []);

  useEffect(() => {
    if (!app || !app.ready) return;

    app.ready();
    app.disableVerticalSwipes();
    app.expand();

    app.setHeaderColor("#00ff00");
    app.themeParams.header_bg_color = "#ff0000";
    app.themeParams.bg_color = "#0000ff";
    app.themeParams.secondary_bg_color = "#ffff00";

    console.log(app);
    

    console.log("Aasdapisdpadpasdpaspidpasijqiojdqpidjpqijdip",app.headerColor);
    console.log(app.themeParams.header_bg_color);
    console.log(app.themeParams.bg_color);
    console.log(app.themeParams.secondary_bg_color);
    
    

    lockBrowserEvents();

    const addUserToContext = async () => {
      const userId = app.initDataUnsafe?.user?.id;
      const username = app.initDataUnsafe?.user?.username;
      const firstName = app.initDataUnsafe?.user?.first_name;
      const lastName = app.initDataUnsafe?.user?.last_name;
      const scores = Number('0');
      const referralId = app.initDataUnsafe?.start_param; // Получаем реферальный ID из start_param
      const createdAt = new Date();

      if (!userId || !firstName) {
        console.error('User data is missing');
        return;
      }

      try {
        const response = await fetch('/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            username: username,
            scores: scores,
            referal_id: referralId,
            created_at: createdAt
          })
        });

        const result = await response.json();
        console.log(result.message);

        setIsMounted(true);
      } catch (error) {
        console.error('Error adding user to context:', error);
      }
    };

    addUserToContext();
  }, [app]);

  return (
    <webAppContext.Provider value={{ app, isMounted }}>
      {children}
    </webAppContext.Provider>
  );
};
