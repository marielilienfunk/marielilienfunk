"use client";

// Intro beim ersten Aufruf (einmal pro Browser-Sitzung):
// 1. „Marie-Lilien Funk“ entsteht aus bunten Konfetti-Punkten, die durcheinanderwuseln
// 2. ein einziger schwarzer Strich fährt hindurch, verjagt die Punkte, dahinter steht das Logo
// 3. nur die drei Punkte auf den i's bleiben
// 4. das Logo wird klein und fliegt an seinen Platz im Header

import { useEffect, useRef, useState } from "react";
import { LETTERS, DOTS, VIEWBOX, BRAND_COLORS } from "./Logo";

const KEY = "mlf-intro-seen";
const FORM_MIN = 1400; // ms Punkte formen den Namen, mindestens
const FORM_MAX = 3500; // ms höchstens, auch wenn die Seite noch lädt
const WIGGLE = 900; // ms der Konfetti-Name steht und wuselt
const SWEEP = 1500; // ms der Strich fährt durch
const SCATTER = 750; // ms bis ein verjagter Punkt weg ist
const SETTLE = 600; // ms die i-Punkte setzen sich
const HOLD = 600; // ms groß stehen lassen
const SHRINK = 900; // ms Verkleinern

const STEP = 3.1; // Rasterabstand (SVG-Einheiten) beim Füllen der Buchstaben mit Punkten

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function finish() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  document.documentElement.classList.remove("intro-active");
  document.documentElement.classList.add("intro-seen");
}

// Punkte innerhalb der Buchstaben und der i-Punkte (in SVG-Einheiten)
function samplePoints() {
  const ctx = document.createElement("canvas").getContext("2d");
  const letters = new Path2D(LETTERS);
  const pts = [];
  for (let y = VIEWBOX.y; y < VIEWBOX.y + VIEWBOX.h; y += STEP) {
    for (let x = VIEWBOX.x; x < VIEWBOX.x + VIEWBOX.w; x += STEP) {
      const px = x + (Math.random() - 0.5) * STEP;
      const py = y + (Math.random() - 0.5) * STEP;
      const onDot = DOTS.some((d) => Math.hypot(px - d.cx, py - d.cy) < d.r);
      if (onDot || ctx.isPointInPath(letters, px, py)) pts.push({ x: px, y: py });
    }
  }
  return pts;
}

export default function Intro() {
  const [done, setDone] = useState(false);
  const overlay = useRef(null);
  const canvas = useRef(null);
  const wrap = useRef(null);
  const reveal = useRef(null);
  const circles = useRef([]);

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
    const left = (vw - W) / 2, top = (vh - H) / 2;
    const el = wrap.current;
    el.style.width = `${W}px`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    const toScreen = (x, y) => ({ x: left + (x - VIEWBOX.x) * unit, y: top + (y - VIEWBOX.y) * unit });

    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = vw * dpr;
    cv.height = vh * dpr;
    cv.style.width = `${vw}px`;
    cv.style.height = `${vh}px`;
    ctx.scale(dpr, dpr);

    // Konfetti: jeder Punkt hat einen Platz im Schriftzug und wechselt ihn ab und zu
    const homes = samplePoints().map((p) => toScreen(p.x, p.y));
    const near = (h, radius) => {
      for (let n = 0; n < 8; n++) {
        const c = pick(homes);
        if (Math.hypot(c.x - h.x, c.y - h.y) < radius) return c;
      }
      return h;
    };
    const rMin = 2.9 * unit, rMax = 5.2 * unit;
    const t0 = performance.now();
    const dots = homes.map((h) => {
      const a = Math.random() * Math.PI * 2;
      const from = 40 + Math.random() * 160;
      return {
        home: h,
        x: h.x + Math.cos(a) * from,
        y: h.y + Math.sin(a) * from,
        r: rMin + Math.random() * (rMax - rMin),
        color: pick(BRAND_COLORS),
        delay: Math.random() * FORM_MIN * 0.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0015 + Math.random() * 0.002,
        amp: (0.6 + Math.random() * 1.4) * unit,
        nextHop: t0 + FORM_MIN + Math.random() * 2500,
        vx: 0, vy: 0,
        kickedAt: 0,
        keep: false,
      };
    });
    // Reihenfolge mischen, damit sich die Farben gleichmäßig überlagern
    dots.sort(() => Math.random() - 0.5);

    // ein paar lose Punkte schweben um den Schriftzug
    const floaters = Array.from({ length: Math.round(homes.length * 0.04) }, () => {
      const h = pick(homes);
      return { ...pick(dots), home: { x: h.x + (Math.random() - 0.5) * 6 * H, y: h.y + (Math.random() - 0.5) * 2.5 * H }, floater: true };
    });
    floaters.forEach((f) => dots.push({ ...f, x: f.home.x, y: f.home.y }));

    let line = null; // { x0, x1, y, w } — der Strich in Bildschirm-px
    const lineY = top + (VIEWBOX.y + VIEWBOX.h * 0.5 - VIEWBOX.y) * unit;
    const lineW = Math.max(2, 1.6 * unit);

    let last = t0;
    const render = (now) => {
      const dt = Math.min(48, now - last) / 16.7; // 1 = ein Frame bei 60 fps
      last = now;
      ctx.clearRect(0, 0, vw, vh);

      for (const d of dots) {
        let s = easeOutBack(clamp01((now - t0 - d.delay) / 600));
        if (d.kickedAt) {
          // verjagt: wegfliegen, langsamer werden, verblassen
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vx *= 0.96;
          d.vy = d.vy * 0.96 + 0.25 * dt;
          s *= 1 - clamp01((now - d.kickedAt) / SCATTER);
          if (s <= 0.001) continue;
        } else if (!d.keep) {
          // ab und zu einen neuen Platz in der Nähe suchen (das Wuseln)
          if (now > d.nextHop && !d.floater) {
            d.home = near(d.home, 9 * unit);
            d.nextHop = now + 700 + Math.random() * 2600;
          }
          const tx = d.home.x + Math.sin(now * d.speed + d.phase) * d.amp;
          const ty = d.home.y + Math.cos(now * d.speed * 1.3 + d.phase) * d.amp;
          d.x += (tx - d.x) * 0.12 * dt;
          d.y += (ty - d.y) * 0.12 * dt;
        }
        if (s <= 0.001) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * s, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
      }

      if (line) {
        ctx.beginPath();
        ctx.moveTo(line.x0, line.y);
        ctx.lineTo(line.x1, line.y);
        ctx.lineCap = "round";
        ctx.lineWidth = line.w;
        ctx.strokeStyle = "#1f1f1f";
        ctx.stroke();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
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
          const t = clamp01((now - start) / dur);
          fn(t, now);
          if (t < 1) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      });

    (async () => {
      await Promise.all([wait(FORM_MIN), Promise.race([loaded, wait(FORM_MAX)])]);
      if (!alive) return;
      await wait(WIGGLE);
      if (!alive) return;

      // je ein roter, grüner und blauer Punkt bleibt für die i's
      const used = new Set();
      const keepers = DOTS.map((target, k) => {
        const to = toScreen(target.cx, target.cy);
        let best = null, bestDist = Infinity;
        for (const d of dots) {
          if (used.has(d) || d.floater) continue;
          const dist = Math.hypot(d.x - to.x, d.y - to.y) + (d.color === target.fill ? 0 : 40);
          if (dist < bestDist) (best = d), (bestDist = dist);
        }
        used.add(best);
        best.keep = true;
        best.color = target.fill;
        return { d: best, to, r: target.r * unit, k };
      });

      // 2 — der Strich fährt von links nach rechts, Punkte fliehen, das Logo bleibt stehen
      const x0 = left - 30, x1 = left + W + 30;
      const reach = H * 0.9;
      await tween(SWEEP, (t, now) => {
        const tip = x0 + (x1 - x0) * easeInOut(t);
        line = { x0, x1: tip, y: lineY, w: lineW };
        reveal.current.setAttribute("width", `${Math.max(0, VIEWBOX.x + (tip - left) / unit - VIEWBOX.x)}`);
        for (const d of dots) {
          if (d.kickedAt || d.keep || d.x > tip + reach * 0.3 || d.x < tip - reach) continue;
          const away = d.y < lineY ? -1 : 1;
          d.vx = 3 + Math.random() * 7;
          d.vy = away * (3 + Math.random() * 9) - 2;
          d.kickedAt = now;
        }
      });
      if (!alive) return;
      // lose Punkte abseits des Strichs fliegen auch weg
      const after = performance.now();
      for (const d of dots) {
        if (d.kickedAt || d.keep) continue;
        d.vx = (Math.random() - 0.5) * 8;
        d.vy = (d.y < lineY ? -1 : 1) * (3 + Math.random() * 6);
        d.kickedAt = after;
      }

      // Strich zieht sich nach rechts zurück, i-Punkte setzen sich
      const settle = keepers.map(({ d, to, r, k }) => {
        const from = { x: d.x, y: d.y, r: d.r };
        return tween(
          SETTLE,
          (t) => {
            const e = easeInOut(t);
            d.x = from.x + (to.x - from.x) * e;
            d.y = from.y + (to.y - from.y) * e - Math.sin(e * Math.PI) * 40;
            d.r = from.r + (r - from.r) * e;
          },
          k * 90
        );
      });
      await Promise.all([
        ...settle,
        tween(SETTLE, (t) => {
          line = { x0: x0 + (x1 - x0) * easeInOut(t), x1, y: lineY, w: lineW * (1 - t) };
        }),
      ]);
      line = null;
      await wait(SCATTER - SETTLE > 0 ? SCATTER - SETTLE : 0);
      if (!alive) return;

      // ab hier übernimmt das echte SVG-Logo
      circles.current.forEach((c) => c && (c.style.opacity = 1));
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, vw, vh);
      await wait(HOLD);
      if (!alive) return;

      // 4 — klein werden und in den Header fliegen
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
          <defs>
            <clipPath id="intro-reveal">
              <rect ref={reveal} x={VIEWBOX.x - 2} y={VIEWBOX.y - 2} width={0} height={VIEWBOX.h + 4} />
            </clipPath>
          </defs>
          <path d={LETTERS} fill="currentColor" clipPath="url(#intro-reveal)" />
          {DOTS.map((d, i) => (
            <circle
              key={i}
              ref={(c) => (circles.current[i] = c)}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.fill}
              style={{ opacity: 0 }}
            />
          ))}
        </svg>
      </div>
      <canvas ref={canvas} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
