"use client";

// Intro beim ersten Aufruf (einmal pro Browser-Sitzung):
// 1. drei Punkte drehen sich als Ladeanimation
// 2. „Marie-Lilien Funk“ erscheint groß, die Punkte springen auf die i's
// 3. das Logo wird klein und fliegt an seinen Platz im Header

import { useEffect, useRef, useState } from "react";
import { LETTERS, DOTS, VIEWBOX } from "./Logo";

const KEY = "mlf-intro-seen";
const SPIN_MIN = 1500; // ms Ladeanimation mindestens
const SPIN_MAX = 4000; // ms höchstens, auch wenn die Seite noch lädt
const SPIN_SPEED = 0.0045; // rad pro ms
const JUMP = 720; // ms pro Sprung
const STAGGER = 160; // ms zwischen den Punkten
const HOLD = 700; // ms groß stehen lassen
const SHRINK = 900; // ms Verkleinern

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function finish() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  document.documentElement.classList.remove("intro-active");
  document.documentElement.classList.add("intro-seen");
}

export default function Intro() {
  const [done, setDone] = useState(false);
  const overlay = useRef(null);
  const wrap = useRef(null);
  const letters = useRef(null);
  const dots = useRef([]);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro-active")) {
      setDone(true);
      return;
    }
    let raf = 0;
    let alive = true;

    // Größe & Position des großen Logos (mittig)
    const vw = window.innerWidth, vh = window.innerHeight;
    const W = Math.min(vw * 0.86, 980);
    const unit = W / VIEWBOX.w; // px pro SVG-Einheit
    const H = VIEWBOX.h * unit;
    const el = wrap.current;
    el.style.width = `${W}px`;
    el.style.left = `${(vw - W) / 2}px`;
    el.style.top = `${(vh - H) / 2}px`;

    // Kreisbahn der Ladeanimation (Mitte des Logos)
    const cx = VIEWBOX.x + VIEWBOX.w / 2;
    const cy = VIEWBOX.y + VIEWBOX.h / 2;
    const R = Math.min(34, W * 0.04) / unit;
    const scale = Math.max(1, 12 / (DOTS[0].r * unit)); // Punkte beim Laden mind. 12px groß
    const pos = DOTS.map(() => ({ x: cx, y: cy, s: scale, sx: 1, sy: 1 }));

    const draw = () => {
      dots.current.forEach((c, i) => {
        if (!c) return;
        const p = pos[i];
        const d = DOTS[i];
        c.setAttribute(
          "transform",
          `translate(${p.x - d.cx} ${p.y - d.cy}) translate(${d.cx} ${d.cy + d.r}) scale(${p.s * p.sx} ${p.s * p.sy}) translate(${-d.cx} ${-d.cy - d.r})`
        );
      });
    };

    // 1 — Drehen
    let angle = 0;
    let spinning = true;
    let last = performance.now();
    const spin = (now) => {
      if (!alive) return;
      if (spinning) {
        angle += (now - last) * SPIN_SPEED;
        DOTS.forEach((_, i) => {
          const a = angle + (i * Math.PI * 2) / DOTS.length;
          pos[i].x = cx + Math.cos(a) * R;
          pos[i].y = cy + Math.sin(a) * R;
        });
        draw();
      }
      last = now;
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    overlay.current.style.opacity = 1;

    const loaded = new Promise((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", r, { once: true });
    });

    const tween = (dur, fn, delay = 0) =>
      new Promise((res) => {
        const start = performance.now() + delay;
        const step = (now) => {
          if (!alive) return res();
          const t = Math.min(1, Math.max(0, (now - start) / dur));
          fn(t);
          if (t < 1) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      });

    (async () => {
      await Promise.all([wait(SPIN_MIN), Promise.race([loaded, wait(SPIN_MAX)])]);
      if (!alive) return;

      // 2 — Schrift erscheint, Punkte springen auf die i's
      spinning = false;
      letters.current.style.transition = "opacity 600ms ease";
      letters.current.style.opacity = 1;
      await Promise.all(
        DOTS.map((d, i) => {
          const from = { ...pos[i] };
          const peak = Math.min(from.y, d.cy) - 70 / unit - i * (12 / unit);
          return tween(
            JUMP,
            (t) => {
              const e = easeInOut(t);
              pos[i].x = from.x + (d.cx - from.x) * e;
              // Bogen: quadratische Kurve über peak
              const a = from.y, b = peak, c = d.cy;
              pos[i].y = (1 - e) * (1 - e) * a + 2 * (1 - e) * e * b + e * e * c;
              pos[i].s = from.s + (1 - from.s) * e;
              // Stauchen beim Aufkommen
              const sq = t > 0.82 ? Math.sin(((t - 0.82) / 0.18) * Math.PI) * 0.35 : 0;
              pos[i].sx = 1 + sq;
              pos[i].sy = 1 - sq;
              draw();
            },
            i * STAGGER
          );
        })
      );
      cancelAnimationFrame(raf);
      await wait(HOLD);
      if (!alive) return;

      // 3 — klein werden und in den Header fliegen
      const target = document.querySelector("[data-header-logo] svg");
      const big = el.getBoundingClientRect();
      if (target) {
        const t = target.getBoundingClientRect();
        const s = t.width / big.width;
        el.style.transformOrigin = "0 0";
        el.animate(
          [{ transform: "none" }, { transform: `translate(${t.left - big.left}px, ${t.top - big.top}px) scale(${s})` }],
          { duration: SHRINK, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
        );
      }
      overlay.current.animate([{ backgroundColor: "rgba(250,249,247,1)" }, { backgroundColor: "rgba(250,249,247,0)" }], {
        duration: SHRINK * 0.7,
        delay: SHRINK * 0.3,
        easing: "ease",
        fill: "forwards",
      });
      await wait(SHRINK);
      if (!alive) return;
      finish();
      setDone(true);
    })();

    // Klick / Taste überspringt das Intro
    const skip = () => {
      alive = false;
      finish();
      setDone(true);
    };
    const ov = overlay.current;
    ov.addEventListener("click", skip);
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ov.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (done) return null;

  return (
    <div ref={overlay} className="intro-overlay fixed inset-0 z-[100] bg-paper text-ink" aria-hidden="true">
      <div ref={wrap} className="absolute">
        <svg
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
          className="block w-full h-auto overflow-visible"
        >
          <path ref={letters} d={LETTERS} fill="currentColor" style={{ opacity: 0 }} />
          {DOTS.map((d, i) => (
            <circle key={i} ref={(c) => (dots.current[i] = c)} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} />
          ))}
        </svg>
      </div>
    </div>
  );
}
