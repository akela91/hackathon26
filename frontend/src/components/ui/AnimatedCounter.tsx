"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

/** Nullától a célértékig számoló szám, ami akkor indul, amikor képbe kerül. */
export default function AnimatedCounter({
  value,
  duration = 1600,
  format = (n) => Math.round(n).toLocaleString("hu-HU"),
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Csökkentett mozgás igény esetén azonnal a végérték.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Biztonsági háló: ha a rAF szünetel (háttér-fül, nem kompozitáló panel),
    // a setTimeout garantáltan a végértékre állítja a számot.
    const safety = setTimeout(() => setDisplay(value), duration + 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
