import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-block w-[52px] h-[26px]">
      <input 
        type="checkbox" 
        className="opacity-0 w-0 h-0"
        checked={theme === "light"}
        onChange={toggleTheme}
      />
      <span className="absolute cursor-pointer inset-0 bg-secondary transition-all duration-300 rounded-[34px] shadow-inner">
        <span className={`absolute left-[4px] bottom-[4px] h-[18px] w-[18px] bg-white transition-all duration-300 rounded-full ${theme === "light" ? "translate-x-[26px]" : ""}`}></span>
        <span className={`absolute text-[10px] left-[7px] top-[6px] text-white transition-opacity duration-300 ${theme === "light" ? "opacity-0" : "opacity-100"}`}>
          <Moon size={12} />
        </span>
        <span className={`absolute text-[10px] right-[7px] top-[6px] text-white transition-opacity duration-300 ${theme === "light" ? "opacity-100" : "opacity-0"}`}>
          <Sun size={12} />
        </span>
      </span>
    </label>
  );
}
