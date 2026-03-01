"use client";

import { useState, useEffect } from "react";

export function useDarkMode(): [boolean, (v: boolean) => void] {
  const [dark, setDarkState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark =
      saved != null
        ? saved === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkState(isDark);
  }, []);

  const setDark = (value: boolean) => {
    setDarkState(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  return [dark, setDark];
}
