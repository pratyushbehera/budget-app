import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
