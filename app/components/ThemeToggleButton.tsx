"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemeWithSystem = Theme | "system";

const ThemeToggleButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme = "system", setTheme } = useTheme() as {
    theme: ThemeWithSystem;
    setTheme: (theme: Theme) => void;
  };
  const [systemPreference, setSystemPreference] = useState<Theme>("light");

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setSystemPreference(prefersDark ? "dark" : "light");
  }, []);

  if (!mounted) {
    return null;
  }

  const getOppositeTheme = (currentTheme: Theme): Theme => {
    return currentTheme === "dark" ? "light" : "dark";
  };

  const handleToggleTheme = () => {
    if (theme === "system") {
      setTheme(getOppositeTheme(systemPreference));
      return;
    }
    setTheme(getOppositeTheme(theme as Theme));
  };

  const buttonText = () => {
    const currentTheme =
      theme === "system" ? systemPreference : (theme as Theme);
    const oppositeTheme = getOppositeTheme(currentTheme);
    return oppositeTheme.charAt(0).toUpperCase() + oppositeTheme.slice(1);
  };

  return (
    <button
      onClick={handleToggleTheme}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
      aria-label="Toggle theme"
    >
      {buttonText()}
    </button>
  );
};

export default ThemeToggleButton;
