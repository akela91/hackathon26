"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  /** A számláló növelésével indul újra az animáció. */
  trigger: number;
  /** Meddig pattogjon (ms). */
  durationMs?: number;
}

const SIZE = 90; // px

/**
 * A BYD ikon a bal felső sarokból indulva, folyamatosan PÖRÖGVE, DVD-képernyővédő
 * módjára PATTOG a viewport falain (a jobb alsó felé tartva). `durationMs` után eltűnik.
 */
export default function BydBounce({ trigger, durationMs = 6000 }: Props) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!trigger) return;
    setActive(true);
    const off = setTimeout(() => setActive(false), durationMs);
    return () => clearTimeout(off);
  }, [trigger, durationMs]);

  useEffect(() => {
    if (!active) return;
    // Bal felső sarokból indul, jobbra-lefelé tartó sebességgel.
    let x = 8;
    let y = 8;
    let vx = 4.2;
    let vy = 3.4;

    function step() {
      const maxX = window.innerWidth - SIZE;
      const maxY = window.innerHeight - SIZE;
      x += vx;
      y += vy;
      if (x <= 0) { x = 0; vx = Math.abs(vx); }
      else if (x >= maxX) { x = maxX; vx = -Math.abs(vx); }
      if (y <= 0) { y = 0; vy = Math.abs(vy); }
      else if (y >= maxY) { y = maxY; vy = -Math.abs(vy); }
      const el = elRef.current;
      if (el) el.style.transform = `translate(${x}px, ${y}px)`;
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  if (!mounted || !active) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[110]"
      aria-hidden="true"
      style={{ top: 0, left: 0 }}
    >
      {/* Külső elem: pozíció (translate). Belső img: pörgés. */}
      <div ref={elRef} style={{ position: "absolute", top: 0, left: 0, width: SIZE, height: SIZE }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/byd_icon.svg"
          alt=""
          style={{
            width: SIZE,
            height: SIZE,
            animation: "byd-spin 1.1s linear infinite",
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
          }}
        />
      </div>
    </div>,
    document.body
  );
}
