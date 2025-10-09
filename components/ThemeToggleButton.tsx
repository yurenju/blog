"use client";

import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

type Theme = "dark" | "light";
type ThemeWithSystem = Theme | "system";

const ThemeToggleButton = ({ locale = 'zh' }: { locale?: Locale }) => {
  const t = getTranslation(locale);
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

  const currentTheme = theme === "system" ? systemPreference : (theme as Theme);

  return (
    <button
      onClick={handleToggleTheme}
      className="p-2 rounded-lg "
      aria-label={currentTheme === "dark" ? t.theme.toggleToLight : t.theme.toggleToDark}
    >
      {currentTheme === "dark" ? (
        <IconSun className="w-5 h-5 text-gray-400 hover:text-gray-100" />
      ) : (
        <IconMoon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
