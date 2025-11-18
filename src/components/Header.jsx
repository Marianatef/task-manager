import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ title = "Task App" }) {
  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
