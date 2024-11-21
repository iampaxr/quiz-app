"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleThemeHandler: () => void;
}

const MyThemeContext = createContext<ThemeContextType>({
  isDarkTheme: false,
  toggleThemeHandler: () => {},
});

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("darkTheme") === "true";
    setIsDarkTheme(isDark);
  }, []);

  const toggleThemeHandler = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("darkTheme", newTheme.toString());
  };

  return (
    <MyThemeContext.Provider value={{ isDarkTheme, toggleThemeHandler }}>
      {children}
    </MyThemeContext.Provider>
  );
}

export const useTheme = () => useContext(MyThemeContext);

export default MyThemeContext;
