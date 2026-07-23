"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/lib/theme-context";

/**
 * Unicorn témában megjelenő, egeret követő animált 🦄 egérmutató. A natív
 * kurzort a globals.css elrejti (html.unicorn-cursor-active). Csak unicorn
 * témában aktív; más témán semmit nem renderel és visszaadja a rendes kurzort.
 */
export default function UnicornCursor() {
  const { theme } = useTheme();
  const active = theme === "unicorn";
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("unicorn-cursor-active");

    function move(e: MouseEvent) {
      const el = ref.current;
      if (el) {
        // A hotspot a 🦄 bal-alsó sarka közelébe kerül.
        el.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 26}px)`;
      }
    }
    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      root.classList.remove("unicorn-cursor-active");
    };
  }, [active]);

  if (!mounted || !active) return null;

  return createPortal(
    <div ref={ref} className="unicorn-cursor" aria-hidden="true">
      🦄
      <span className="spark">✨</span>
    </div>,
    document.body
  );
}
