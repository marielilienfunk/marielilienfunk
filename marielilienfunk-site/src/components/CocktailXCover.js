"use client";

import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";

export const outfit = Outfit({ subsets: ["latin"], weight: ["400"] });

// Markenfarben Cocktail X
export const C = {
  tangerine: "#F39200",
  jambalaya: "#55331A",
  everglade: "#1A4620",
  bay: "#223A7B",
  hibiscus: "#BD2562",
  cream: "#E3D6C4",
};

export const STAR = "M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z";

export const ICONS = [
  { id: "star", color: C.tangerine, d: STAR },
  { id: "circle", color: C.everglade, d: "M50 0 A50 50 0 1 1 49.99 0Z" },
  { id: "diamond", color: C.jambalaya, d: "M50 0 L100 50 L50 100 L0 50Z" },
  { id: "hourglass", color: C.hibiscus, d: "M0 0 H100 L50 50Z M0 100 H100 L50 50Z" },
  { id: "ring", color: C.bay, d: "M0 0 H100 V100 H0Z M50 18 A32 32 0 1 0 50.01 18Z", evenodd: true },
  { id: "half", color: C.cream, d: "M50 0 A50 50 0 0 1 50 100Z" },
];

// Plätze rund um das Logo (in % des 4:3-Rahmens)
const SLOTS = [
  [13, 18], [38, 14], [62, 14], [87, 18],
  [8, 50], [92, 50],
  [13, 82], [38, 86], [62, 86], [87, 82],
];

const START = [0, 3, 4, 7, 9, 5];

export default function CocktailXCover() {
  const [state, setState] = useState(() =>
    ICONS.map((_, i) => ({ slot: START[i], rot: 0 }))
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setState((prev) => {
        const taken = new Set(prev.map((p) => p.slot));
        const free = SLOTS.map((_, i) => i).filter((i) => !taken.has(i));
        const who = Math.floor(Math.random() * prev.length);
        const to = free[Math.floor(Math.random() * free.length)];
        return prev.map((p, i) =>
          i === who ? { slot: to, rot: p.rot + (Math.random() < 0.5 ? 90 : -90) } : p
        );
      });
    }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="cx-cover absolute inset-0 bg-[#0d0d0d] overflow-hidden"
      style={{ containerType: "inline-size" }}
    >
      {ICONS.map((icon, i) => {
        const [x, y] = SLOTS[state[i].slot];
        return (
          <div
            key={icon.id}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: "13cqw",
              height: "13cqw",
              transform: `translate(-50%, -50%) rotate(${state[i].rot}deg)`,
              transition: "left 900ms cubic-bezier(.7,0,.2,1), top 900ms cubic-bezier(.7,0,.2,1), transform 900ms cubic-bezier(.7,0,.2,1)",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="cx-icon w-full h-full"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <path d={icon.d} fill={icon.color} fillRule={icon.evenodd ? "evenodd" : "nonzero"} />
            </svg>
          </div>
        );
      })}

      <div
        className={`${outfit.className} absolute inset-0 flex items-center justify-center text-white`}
        style={{ fontSize: "7.4cqw", lineHeight: 0.95, letterSpacing: "-0.01em" }}
      >
        <div>
          <div className="flex items-center">
            cocktail
            <svg viewBox="0 0 100 100" className="cx-logo-star" style={{ width: "0.9em", height: "0.9em", marginLeft: "0.12em" }}>
              <path d={STAR} fill="currentColor" />
            </svg>
          </div>
          <div style={{ paddingLeft: "1.55em" }}>festival</div>
        </div>
      </div>

      <style>{`
        .cx-logo-star { animation: cx-twinkle 3.2s cubic-bezier(.7,0,.2,1) infinite; }
        @keyframes cx-twinkle {
          0%, 70% { transform: rotate(0) scale(1); }
          85% { transform: rotate(90deg) scale(1.25); }
          100% { transform: rotate(90deg) scale(1); }
        }
        .cx-icon { transition: transform 500ms cubic-bezier(.3,1.6,.5,1); }
        .group:hover .cx-icon { transform: scale(1.15); }
        @media (prefers-reduced-motion: reduce) { .cx-logo-star { animation: none; } }
      `}</style>
    </div>
  );
}
