"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero bust card — lime background, bust image overflows above the card.
 * • Default  → bust1
 * • Hover    → bust2
 * • Auto     → toggles bust1 ↔ bust2 every 5 s
 */
export default function BustCard() {
  const [altFrame, setAltFrame] = useState(false); // false=bust1 true=bust2
  const [hovered, setHovered]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setAltFrame(f => !f), 5000);
  };

  useEffect(() => {
    startCycle();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showBust2 = hovered || altFrame;

  return (
    <div
      aria-hidden="true"
      className="c-hero__card"
      style={{
        background: "#a8fd02",
        overflow: "visible",   /* let bust bleed above the card */
        border: "1.5px solid var(--c-ink)",
        cursor: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Bust images, anchored to card bottom, overflowing above ── */}
      <div style={{
        position: "absolute",
        bottom: -4,
        left: "50%",
        transform: "translateX(-50%)",
        width: "148%",
        pointerEvents: "none",
        userSelect: "none",
      }}>
        {/* bust 1 */}
        <img
          src="/creative/bust1.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
            display: "block",
            opacity: showBust2 ? 0 : 1,
            transition: "opacity 0.55s ease",
          }}
        />
        {/* bust 2 */}
        <img
          src="/creative/bust2.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
            display: "block",
            opacity: showBust2 ? 1 : 0,
            transition: "opacity 0.55s ease",
          }}
        />
        {/* invisible spacer: gives the div its natural height */}
        <img
          src="/creative/bust1.png"
          alt=""
          style={{ width: "100%", visibility: "hidden", display: "block" }}
        />
      </div>
    </div>
  );
}
