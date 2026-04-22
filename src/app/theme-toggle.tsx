"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const storageKey = "upb-theme-mode";

function getSystemMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedMode = localStorage.getItem(storageKey) as ThemeMode | null;
    const initialMode = savedMode ?? getSystemMode();

    setMode(initialMode);
    document.documentElement.setAttribute("data-theme", initialMode);
  }, []);

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    document.documentElement.setAttribute("data-theme", nextMode);
    localStorage.setItem(storageKey, nextMode);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
      style={{
        color: "var(--ink-primary)",
        borderColor: "var(--line-soft)",
        background: "color-mix(in srgb, var(--surface) 88%, transparent)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <span aria-hidden="true">{mode === "light" ? "D" : "L"}</span>
      {mode === "light" ? "Modo oscuro" : "Modo claro"}
    </button>
  );
}
