import { useEffect, useState } from "react";

const KEY = "tm_theme";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const v = localStorage.getItem(KEY);
      return v || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme);
    } catch {}
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggle };
}
