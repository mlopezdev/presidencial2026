"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const storageKey = "upb-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    updateRootTheme(initial);
  }, []);

  const updateRootTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
  };

  const handleToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(storageKey, next);
    updateRootTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)] shadow-[0_10px_30px_-20px_rgba(15,35,52,0.6)] transition hover:-translate-y-0.5"
    >
      {theme === "dark" ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
