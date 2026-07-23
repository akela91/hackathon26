"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Rainbow } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

/**
 * Szivárvány gomb: kattintásra teljes képernyős videó (kép + HANG) játszódik le,
 * majd a végén (vagy kihagyáskor) bekapcsol az extrém szivárványos "unicorn" téma.
 */
export default function RainbowButton() {
  const { setTheme } = useTheme();
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setMounted(true), []);

  function start() {
    setPlaying(true);
  }

  function finish() {
    setPlaying(false);
    setTheme("unicorn");
  }

  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    // A kattintás felhasználói gesztus, így a hangos lejátszás engedélyezett.
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // Ha a böngésző mégis blokkolná a hangot, némán próbáljuk újra.
        v.muted = true;
        v.play().catch(() => {});
      });
    }
  }, [playing]);

  return (
    <>
      <button
        onClick={start}
        aria-label="🌈"
        title="🌈"
        className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 transition hover:scale-110"
      >
        <Rainbow className="h-4 w-4" style={{ color: "#ff2e97" }} />
      </button>

      {mounted &&
        playing &&
        createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src="/why_are_you_g.mp4"
              className="max-h-full max-w-full"
              playsInline
              autoPlay
              controls={false}
              onEnded={finish}
            />
            <button
              onClick={finish}
              className="absolute bottom-8 right-8 rounded-full bg-white/15 px-5 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              🌈 ✨
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
