"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/components/shared/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      {isDark ? <Sun size={16} weight="regular" /> : <Moon size={16} weight="regular" />}
    </button>
  );
}
