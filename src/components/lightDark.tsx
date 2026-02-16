import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "theme-mode";

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
};

export const useThemeMode = () => {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme };
};
