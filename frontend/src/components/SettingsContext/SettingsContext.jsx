import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const defaultSettings = {
    country: "ua",
    timeFormat: "24"
  };
  const [settings, setSettings] = useState(defaultSettings);

  // Загружаем настройки при первом рендере
  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(user => {        
        if (user && user._id) {
          setSettings({
            country: user.country,
            timeFormat: user.time_format
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    console.log("settings UPDATED:", settings);
  }, [settings]);

  function updateSettings(newValues) {
    setSettings(prev => ({ ...prev, ...newValues }));
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
