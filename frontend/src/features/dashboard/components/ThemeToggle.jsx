import { useTheme } from "../../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import Button from "@/shared/system/Button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      size="icon-sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      variant="ghost"
      className="rounded-full"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
