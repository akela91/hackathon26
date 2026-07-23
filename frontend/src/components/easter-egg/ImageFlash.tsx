"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  src: string;
  /** Meddig látszódjon (ms). */
  durationMs?: number;
  /** Ha ez az érték változik, újra felvillan a kép. 0/undefined = nem villan. */
  trigger: number;
  alt?: string;
}

/**
 * Teljes képernyős, elhalványuló kép-overlay, ami `durationMs` után eltűnik.
 * A `trigger` (számláló) növelésével indítható újra.
 */
export default function ImageFlash({ src, durationMs = 5000, trigger, alt = "" }: Props) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!trigger) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(id);
  }, [trigger, durationMs]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      onClick={() => setVisible(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      style={{ animation: "fadein .25s ease" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-[80vh] max-w-[86vw] rounded-2xl border-2 border-white/70 object-contain shadow-2xl"
        style={{ animation: "pop-in .4s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </div>,
    document.body
  );
}
