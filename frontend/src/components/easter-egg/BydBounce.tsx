"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  /** Amíg true (pl. a nyelv kínai), addig a BYD ikon pattog és nem tűnik el. */
  active: boolean;
}

const SIZE = 84; // px

/**
 * A BYD ikon a bal felső sarokból indulva, LASSAN, DVD-képernyővédő módjára
 * pattog a viewport falain (nem pörög). Amikor eléri az egyik SARKOT, egyet
 * villan. Addig marad látható, amíg az `active` igaz (kínai nyelv).
 */
export default function BydBounce({ active }: Props) {
  const [mounted, setMounted] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!active) return;
    // Bal felső sarokból indul, lassú, jobbra-lefelé tartó sebességgel.
    let x = 6;
    let y = 6;
    let vx = 1.6;
    let vy = 1.25;
    let flashing = false;

    function flash() {
      const img = imgRef.current;
      if (!img || flashing) return;
      flashing = true;
      img.classList.add("byd-flash");
      window.setTimeout(() => {
        img.classList.remove("byd-flash");
        flashing = false;
      }, 450);
    }

    function step() {
      const maxX = window.innerWidth - SIZE;
      const maxY = window.innerHeight - SIZE;
      x += vx;
      y += vy;

      let bx = false;
      let by = false;
      if (x <= 0) { x = 0; vx = Math.abs(vx); bx = true; }
      else if (x >= maxX) { x = maxX; vx = -Math.abs(vx); bx = true; }
      if (y <= 0) { y = 0; vy = Math.abs(vy); by = true; }
      else if (y >= maxY) { y = maxY; vy = -Math.abs(vy); by = true; }

      // Sarok = mindkét tengelyen egyszerre pattan, VAGY a másik tengely is
      // épp a fal közelében van (közel-sarok érintés).
      const nearX = x <= 2 || x >= maxX - 2;
      const nearY = y <= 2 || y >= maxY - 2;
      if ((bx && by) || (bx && nearY) || (by && nearX)) flash();

      const box = boxRef.current;
      if (box) box.style.transform = `translate(${x}px, ${y}px)`;
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  if (!mounted || !active) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[110]" aria-hidden="true">
      <div
        ref={boxRef}
        style={{ position: "absolute", top: 0, left: 0, width: SIZE, height: SIZE, transform: "translate(6px, 6px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/byd_icon.svg"
          alt=""
          style={{ width: SIZE, height: SIZE, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}
        />
      </div>
    </div>,
    document.body
  );
}
