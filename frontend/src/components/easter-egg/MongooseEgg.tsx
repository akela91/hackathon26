"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Ha megváltozik az érték (pl. kvíz-kör váltás), azonnal felbukkan a mongúz. */
  trigger?: number | string;
  /** Ambient módban ennyi ms-enként (+/- szórással) magától felbukkan. null = kikapcsolva. */
  ambientIntervalMs?: number | null;
  /** "fixed": a viewport jobb alsó sarkában lebeg. "corner": a legközelebbi
   * `relative` szülő jobb alsó sarkában jelenik meg (pl. egy kártyán belül). */
  mode?: "fixed" | "corner";
}

/**
 * A Monguz csapat kabala-mongúza — véletlenszerű, játékos easter egg, ami
 * időnként felbukkan (leginkább a kvíz során). Ha rákattintasz, a helyén
 * 5 másodpercre megjelenik a lea.jpg (dupla easter egg).
 */
export default function MongooseEgg({
  trigger,
  ambientIntervalMs = 30000,
  mode = "fixed",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [showLea, setShowLea] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstTriggerRender = useRef(true);

  function pop() {
    if (showLea) return; // ne bújjon el, amíg a lea kép látszik
    setPulse((p) => p + 1);
    setVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setVisible(false), 3000);
  }

  function handleClick() {
    // Kattintásra: lea.jpg 5 másodpercre a mongúz helyén.
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowLea(true);
    setVisible(true);
    if (leaTimeout.current) clearTimeout(leaTimeout.current);
    leaTimeout.current = setTimeout(() => {
      setShowLea(false);
      setVisible(false);
    }, 5000);
  }

  useEffect(() => {
    if (trigger === undefined) return;
    if (isFirstTriggerRender.current) {
      isFirstTriggerRender.current = false;
      return;
    }
    pop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (!ambientIntervalMs) return;
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    function schedule() {
      const delay = ambientIntervalMs! + Math.random() * ambientIntervalMs! * 0.7;
      t = setTimeout(() => {
        if (cancelled) return;
        pop();
        schedule();
      }, delay);
    }
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientIntervalMs]);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      if (leaTimeout.current) clearTimeout(leaTimeout.current);
    };
  }, []);

  const wrapperClass =
    mode === "fixed"
      ? "pointer-events-none fixed bottom-0 right-4 z-50 sm:right-8"
      : "pointer-events-none absolute bottom-0 right-0 z-20";

  if (!visible) return <div className={wrapperClass} aria-hidden="true" />;

  return (
    <div className={wrapperClass} aria-hidden="true">
      {showLea ? (
        <img
          key="lea"
          src="/lea.jpg"
          alt=""
          className="pointer-events-auto h-40 w-40 rounded-2xl border-2 border-white/70 object-cover shadow-2xl sm:h-52 sm:w-52"
          style={{ animation: "mongoose-peek 5s ease-in-out forwards" }}
        />
      ) : (
        <img
          key={pulse}
          src="/mongoose.svg"
          alt=""
          onClick={handleClick}
          className="mongoose-peek pointer-events-auto h-16 w-16 origin-bottom cursor-pointer drop-shadow-2xl sm:h-24 sm:w-24"
        />
      )}
    </div>
  );
}
