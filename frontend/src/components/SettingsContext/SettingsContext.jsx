import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    country: "Ukraine",
    timeFormat: "24h",
    isLoggedOut: false,
  });

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings automatically whenever they change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
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

// Custom hook for ease of use
export function useSettings() {
  return useContext(SettingsContext);
}