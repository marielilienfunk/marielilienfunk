"use client";

// Klick ins Leere: vom Klickpunkt wächst ein geschwungener Strang aus bunten
// Konfetti-Scheiben, die danach herunterfallen. Der Punkt-Cursor wechselt dabei
// zufällig in eine andere Markenfarbe (die Cursor stehen in globals.css).

import { useEffect, useRef } from "react";
import { BRAND_COLORS } from "./Logo";

const DISCS = 16; // Scheiben pro Klick
const SPAWN = 22; // ms zwischen zwei Scheiben
const HOLD = 260; // ms steht der Strang, bevor er fällt
const FALL = 1100; // ms bis alles weg ist

// Klicks hierauf lösen kein Konfetti aus
const INTERACTIVE = "a, button, input, textarea, select, label, summary, video, [role='button'], [contenteditable]";

const rand = (a, b) => a + Math.random() * (b - a);

export default function ClickConfetti() {
  const canvas = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    let bursts = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = window.innerWidth * dpr;
      cv.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const frame = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      bursts = bursts.filter((b) => now - b.t0 < DISCS * SPAWN + HOLD + FALL);
      for (const b of bursts) {
        const fallT = Math.max(0, now - b.t0 - DISCS * SPAWN - HOLD) / 1000;
        for (const d of b.discs) {
          const age = now - b.t0 - d.delay;
          if (age < 0) continue;
          const pop = Math.min(1, age / 120);
          const x = d.x + d.vx * fallT;
          const y = d.y + d.vy * fallT + 1400 * fallT * fallT;
          ctx.globalAlpha = 1 - Math.min(1, (fallT * 1000) / FALL) ** 3;
          ctx.beginPath();
          ctx.arc(x, y, d.r * (0.6 + 0.4 * pop), 0, Math.PI * 2);
          ctx.fillStyle = d.color;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = bursts.length ? requestAnimationFrame(frame) : 0;
    };

    // Strang: Scheiben entlang einer leicht geschwungenen Kurve, zufällig nach
    // oben, unten, links oder rechts
    const burst = (cx, cy) => {
      const directions = [-Math.PI / 2, Math.PI / 2, Math.PI, 0];
      let angle = directions[Math.floor(Math.random() * 4)] + rand(-0.25, 0.25);
      const turn = rand(-0.1, 0.1);
      let x = cx, y = cy;
      const discs = [];
      for (let k = 0; k < DISCS; k++) {
        discs.push({
          x, y,
          r: 13 * rand(0.94, 1.06), // alle etwa gleich groß
          color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
          delay: k * SPAWN,
          vx: rand(-120, 120),
          vy: rand(-260, -60),
        });
        angle += turn;
        const step = rand(7, 12);
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
      }
      bursts.push({ t0: performance.now(), discs });
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // Cursor zufällig in eine andere Farbe wechseln
    const nextCursor = () => {
      const current = html.dataset.cursor ?? "3"; // Start: Rosa
      const others = BRAND_COLORS.map((_, i) => String(i)).filter((i) => i !== current);
      html.dataset.cursor = others[Math.floor(Math.random() * others.length)];
    };

    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest(INTERACTIVE)) return;
      if (!reduce) burst(e.clientX, e.clientY);
      nextCursor();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-[70] h-full w-full" aria-hidden="true" />;
}
