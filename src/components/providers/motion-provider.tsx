"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

const storageKey = "valenca.motion";
const reducedMotion = "(prefers-reduced-motion: reduce)";
const MotionPreference = createContext({ enabled: false, toggle: () => {} });

function subscribe(notify: () => void) {
  const media = window.matchMedia(reducedMotion);
  media.addEventListener("change", notify);
  window.addEventListener("storage", notify);
  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener("storage", notify);
  };
}

function readPreference() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "on" || saved === "off") return saved === "on";
  } catch { /* Private browsing may disable storage. */ }
  return !window.matchMedia(reducedMotion).matches;
}

export const useSiteMotion = () => useContext(MotionPreference);

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const enabled = choice ?? preference;

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    return () => { delete document.documentElement.dataset.motion; };
  }, [enabled]);

  function toggle() {
    setChoice(!enabled);
    try { window.localStorage.setItem(storageKey, enabled ? "off" : "on"); } catch { /* The current page still updates. */ }
  }

  return (
    <MotionPreference.Provider value={{ enabled, toggle }}>
      <MotionConfig reducedMotion={enabled ? "never" : "always"}>{children}</MotionConfig>
    </MotionPreference.Provider>
  );
}
