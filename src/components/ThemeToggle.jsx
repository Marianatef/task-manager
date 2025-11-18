import React from "react";
import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-pressed={theme === "dark"}
      className="
        px-3 
        py-1 
        border 
        rounded 
        transition 
        hover:bg-slate-100 
        dark:hover:bg-slate-700 
        focus:outline-none 
        focus:ring 
        flex items-center gap-2
      "
    >
      {theme === "dark" ? (
        <>
          🌙 <span>Dark</span>
        </>
      ) : (
        <>
          ☀️ <span>Light</span>
        </>
      )}
    </button>
  );
}
