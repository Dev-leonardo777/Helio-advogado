"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useSiteMotion } from "@/components/providers/motion-provider";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useSiteMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || CSS.supports("animation-timeline: view()")) return;

    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.edge = entry.isIntersecting
        ? "visible"
        : entry.boundingClientRect.bottom < window.innerHeight / 2 ? "above" : "below";
    }, { rootMargin: "-5% 0px", threshold: 0.08 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.edge;
    };
  }, [enabled]);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
