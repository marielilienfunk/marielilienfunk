"use client";

import { useEffect, useState } from "react";
import { C, STAR, ICONS, outfit } from "./CocktailXCover";

const PALETTE = [C.tangerine, C.jambalaya, C.everglade, C.bay, C.hibiscus, C.cream];
const icon = (id) => ICONS.find((i) => i.id === id);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function useTick(ms) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
  return n;
}

function Shape({ id, color, style, className }) {
  const i = icon(id);
  return (
    <svg viewBox="0 0 100 100" className={className} style={style}>
      <path d={i.d} fill={color} fillRule={i.evenodd ? "evenodd" : "nonzero"} />
    </svg>
  );
}

function Wordmark({ color = "#fff", size = "7.4cqw", starSlot }) {
  return (
    <div className={outfit.className} style={{ color, fontSize: size, lineHeight: 0.95, letterSpacing: "-0.01em" }}>
      <div className="flex items-center">
        cocktail
        <span style={{ width: "0.9em", height: "0.9em", marginLeft: "0.12em", display: "inline-block", position: "relative" }}>
          {starSlot || (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d={STAR} fill="currentColor" />
            </svg>
          )}
        </span>
      </div>
      <div style={{ paddingLeft: "1.55em" }}>festival</div>
    </div>
  );
}

const Frame = ({ bg, children, style }) => (
  <div
    className="absolute inset-0 overflow-hidden"
    style={{ containerType: "inline-size", background: bg, transition: "background 700ms ease", ...style }}
  >
    {children}
  </div>
);

/* ---------- B: Briefmarken-Raster ---------- */
const SHAPES = ["star", "circle", "diamond", "hourglass", "ring", "half"];
const randomTile = (prev) => {
  let bg = rand(PALETTE);
  while (prev && bg === prev.bg) bg = rand(PALETTE);
  let fg = rand(PALETTE);
  while (fg === bg) fg = rand(PALETTE);
  return { bg, fg, shape: rand(SHAPES), flip: (prev?.flip || 0) + 180 };
};

export function CoverStamps() {
  const [tiles, setTiles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      bg: PALETTE[i % 6],
      fg: PALETTE[(i + 3) % 6],
      shape: SHAPES[(i * 5) % 6],
      flip: 0,
    }))
  );
  const n = useTick(650);
  useEffect(() => {
    if (!n) return;
    setTiles((t) => {
      const k = Math.floor(Math.random() * t.length);
      return t.map((x, i) => (i === k ? randomTile(x) : x));
    });
  }, [n]);

  const cells = [...tiles.slice(0, 5), "logo", ...tiles.slice(5)];
  return (
    <Frame bg="#0d0d0d">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3" style={{ gap: "1.6cqw", padding: "1.6cqw" }}>
        {cells.map((t, i) =>
          t === "logo" ? (
            <div key="logo" className="col-span-2 flex items-center justify-center">
              <Wordmark size="5.6cqw" />
            </div>
          ) : (
            <div key={i} style={{ perspective: "60cqw" }}>
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: t.bg,
                  borderRadius: "1.2cqw",
                  transform: `rotateY(${t.flip}deg)`,
                  transition: "transform 700ms cubic-bezier(.7,0,.2,1), background 0ms 350ms",
                }}
              >
                <Shape
                  id={t.shape}
                  color={t.fg}
                  style={{ width: "58%", height: "58%", transform: `rotateY(${t.flip}deg)`, transition: "transform 0ms 350ms" }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </Frame>
  );
}

/* ---------- C: Muster mit Label ---------- */
const PATTERNS = [
  { bg: C.bay, a: C.hibiscus, b: C.jambalaya, shape: "split" },
  { bg: C.everglade, a: C.tangerine, shape: "star" },
  { bg: C.tangerine, a: C.jambalaya, shape: "diamond" },
  { bg: C.hibiscus, a: C.bay, shape: "hourglass" },
];

function patternUrl(p) {
  const inner =
    p.shape === "split"
      ? `<path d='M40 8 A32 32 0 0 0 40 72Z' fill='${p.a}'/><path d='M40 8 A32 32 0 0 1 40 72Z' fill='${p.b}'/>`
      : `<g transform='translate(20 20) scale(.4)'><path d='${icon(p.shape).d}' fill='${p.a}'/></g>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='${p.bg}'/>${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function CoverPattern() {
  const n = useTick(2600);
  const cur = n % PATTERNS.length;
  return (
    <Frame bg="#000">
      {PATTERNS.map((p, i) => (
        <div
          key={i}
          className="absolute inset-0 cx-pan"
          style={{
            backgroundImage: patternUrl(p),
            backgroundSize: "20cqw 20cqw",
            opacity: i === cur ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ background: C.cream, borderRadius: "3cqw", padding: "4cqw 7cqw" }}>
          <Wordmark color={C.jambalaya} size="6.4cqw" />
        </div>
      </div>
      <style>{`
        .cx-pan { animation: cx-pan 8s linear infinite; }
        @keyframes cx-pan { from { background-position: 0 0; } to { background-position: 20cqw 20cqw; } }
        @media (prefers-reduced-motion: reduce) { .cx-pan { animation: none; } }
      `}</style>
    </Frame>
  );
}

/* ---------- D: Stern wird zum Icon ---------- */
const MORPHS = [
  { shape: "star", fg: "#0d0d0d" },
  { shape: "circle", fg: C.everglade },
  { shape: "star", fg: C.tangerine },
  { shape: "hourglass", fg: C.hibiscus },
  { shape: "ring", fg: C.bay },
  { shape: "diamond", fg: C.jambalaya },
  { shape: "half", fg: C.hibiscus },
];

export function CoverMorph() {
  const n = useTick(1300);
  const m = MORPHS[n % MORPHS.length];
  return (
    <Frame bg="#fff">
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: "#0d0d0d" }}>
        <Wordmark
          color="currentColor"
          size="8cqw"
          starSlot={
            <Shape
              key={n}
              id={m.shape}
              color={m.fg}
              className="cx-pop absolute inset-0 w-full h-full"
            />
          }
        />
      </div>
      <style>{`
        .cx-pop { animation: cx-pop 600ms cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes cx-pop { from { transform: scale(0) rotate(-90deg); } to { transform: scale(1) rotate(0); } }
      `}</style>
    </Frame>
  );
}

/* ---------- E: Icons poppen groß im Hintergrund ---------- */
const POP_COLORS = [C.tangerine, C.everglade, C.bay, C.hibiscus, C.jambalaya, C.cream];
const POP_SPOTS = [
  // Raster aus 10 Plätzen rund ums Logo – bei 20cqw Icongröße überlappt nichts
  [13, 18], [37.7, 18], [62.3, 18], [87, 18],
  [13, 50], [87, 50],
  [13, 82], [37.7, 82], [62.3, 82], [87, 82],
];

export function CoverPop() {
  const [items, setItems] = useState([]);
  const n = useTick(850);
  useEffect(() => {
    if (!n) return;
    setItems((prev) => {
      const live = prev.filter((p) => !p.out);
      const used = new Set(prev.map((p) => p.spot));
      const free = POP_SPOTS.map((_, i) => i).filter((i) => !used.has(i));
      const spot = rand(free);
      const next = {
        key: n,
        spot,
        shape: rand(SHAPES.filter((x) => !live.some((p) => p.shape === x))),
        color: rand(POP_COLORS.filter((x) => !live.some((p) => p.color === x))),
        size: 20,
        rot: rand([0, 90, 180, 270]),
      };
      // ältestes sichtbares Icon raus, sobald mehr als 3 da sind
      const marked = live.length >= 3
        ? prev.map((p) => (p === live[0] ? { ...p, out: true, outAt: n } : p))
        : prev;
      return [...marked.filter((p) => !p.out || p.outAt >= n - 1), next];
    });
  }, [n]);

  return (
    <Frame bg="#0d0d0d">
      {items.map((p) => {
        const [x, y] = POP_SPOTS[p.spot];
        return (
          <div
            key={p.key}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${p.size}cqw`,
              height: `${p.size}cqw`,
              transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
            }}
          >
            <Shape id={p.shape} color={p.color} className={`w-full h-full ${p.out ? "cx-pop-out" : "cx-pop-in"}`} />
          </div>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: "#fff" }}>
        <Wordmark color="currentColor" size="8cqw" />
      </div>
      <style>{`
        .cx-pop-in { animation: cx-pop-in 550ms cubic-bezier(.3,1.6,.5,1) both; }
        .cx-pop-out { animation: cx-pop-out 350ms cubic-bezier(.6,0,.8,.4) both; }
        @keyframes cx-pop-in { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes cx-pop-out { from { transform: scale(1); } to { transform: scale(0); } }
      `}</style>
    </Frame>
  );
}

/* ---------- F: Kugel-Muster mit Logo, Kreise drehen sich ---------- */
const GRID_COLS = 11;
const GRID_ROWS = 8;
const isGap = (r, c) => (r === 3 || r === 4) && c >= 3 && c <= 7;

export function CoverCircles() {
  const cell = 100 / GRID_COLS; // in cqw
  const offsetY = (75 - GRID_ROWS * cell) / 2;
  const dots = [];
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++)
      if (!isGap(r, c)) dots.push([r, c]);

  return (
    <Frame bg={C.bay}>
      {dots.map(([r, c]) => (
        <svg
          key={`${r}-${c}`}
          viewBox="0 0 100 100"
          className="absolute cx-spin"
          style={{
            left: `${c * cell + cell * 0.05}cqw`,
            top: `${offsetY + r * cell + cell * 0.05}cqw`,
            width: `${cell * 0.9}cqw`,
            height: `${cell * 0.9}cqw`,
            animationDelay: `${(r + c) * 0.07}s`,
          }}
        >
          <path d="M50 0 A50 50 0 0 0 50 100Z" fill={C.hibiscus} />
          <path d="M50 0 A50 50 0 0 1 50 100Z" fill={C.jambalaya} />
        </svg>
      ))}
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: "#fff" }}>
        <Wordmark color="currentColor" size="6.6cqw" />
      </div>
      <style>{`
        .cx-spin { animation: cx-spin 4s cubic-bezier(.7,0,.2,1) infinite; }
        @keyframes cx-spin {
          0%, 30% { transform: rotate(0deg); }
          50%, 80% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) { .cx-spin { animation: none; } }
      `}</style>
    </Frame>
  );
}
