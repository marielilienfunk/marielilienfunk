"use client";

// Intro beim ersten Aufruf (einmal pro Browser-Sitzung):
// 1. der Bildschirm füllt sich mit bunten Punkten
// 2. ein schwarzer Strich schreibt „Marie-Lilien Funk“ und schiebt die Punkte weg
// 3. alle Punkte verschwinden, nur die drei auf den i's bleiben
// 4. das Logo wird klein und fliegt an seinen Platz im Header

import { useEffect, useRef, useState } from "react";
import { LETTERS, DOTS, VIEWBOX, BRAND_COLORS } from "./Logo";

const KEY = "mlf-intro-seen";
const FILL_MIN = 1000; // ms Punkte erscheinen, mindestens
const FILL_MAX = 3500; // ms höchstens, auch wenn die Seite noch lädt
const WRITE = 2800; // ms für den ganzen Schriftzug
const LETTER_FILL = 220; // ms bis ein nachgezogener Buchstabe gefüllt ist
const CLEAR = 900; // ms bis nur noch die i-Punkte da sind
const HOLD = 600; // ms groß stehen lassen
const SHRINK = 900; // ms Verkleinern

// Jeder Teilpfad (Buchstabe bzw. Innenform) wird einzeln nachgezogen
const PARTS = LETTERS.split(/(?=M)/);

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
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
  const canvas = useRef(null);
  const wrap = useRef(null);
  const strokeGroup = useRef(null);
  const strokes = useRef([]);
  const clipRects = useRef([]);
  const fill = useRef(null);
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

    // Teilpfade: Länge und Umriss, von links nach rechts sortiert
    const parts = PARTS.map((_, i) => {
      const p = strokes.current[i];
      const len = p.getTotalLength();
      const bb = p.getBBox();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      const rect = clipRects.current[i];
      rect.setAttribute("x", `${bb.x - 1}`);
      rect.setAttribute("y", `${bb.y - 1}`);
      rect.setAttribute("height", `${bb.height + 2}`);
      const a = toScreen(bb.x, bb.y);
      const b = toScreen(bb.x + bb.width, bb.y + bb.height);
      return { i, len, bb, box: { l: a.x, t: a.y, r: b.x, b: b.y }, doneAt: 0 };
    }).sort((a, b) => a.bb.x - b.bb.x);
    const total = parts.reduce((s, p) => s + p.len, 0);

    // Punkte-Teppich auf einem Canvas
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = vw * dpr;
    cv.height = vh * dpr;
    cv.style.width = `${vw}px`;
    cv.style.height = `${vh}px`;
    ctx.scale(dpr, dpr);

    // dicht und überlappend wie Konfetti
    const small = vw < 640 ? 0.75 : 1;
    const count = Math.min(4000, Math.round((vw * vh) / (150 * small * small)));
    const penR = Math.max(40, H * 0.9);
    const t0 = performance.now();
    const dots = Array.from({ length: count }, () => {
      const x = Math.random() * vw, y = Math.random() * vh;
      return {
        x, y, hx: x, hy: y,
        r: (6 + Math.random() * 6) * small,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        delay: Math.random() * FILL_MIN * 0.8,
        jitter: Math.random() * 14,
        s: 0,
        out: null, // Zeitpunkt, ab dem der Punkt verschwindet
      };
    });

    let pen = null; // aktuelle Spitze des Strichs (Bildschirm-px)
    let cleared = null; // freigeräumtes Band hinter dem Strich
    const pad = H * 0.22;
    let keepers = []; // Punkte, die auf die i's fliegen

    const render = (now) => {
      ctx.clearRect(0, 0, vw, vh);
      for (const d of dots) {
        // vom Strich weggeschoben werden
        if (pen) {
          const dx = d.hx - pen.x, dy = d.hy - pen.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < penR) {
            const k = (penR + d.r + d.jitter * 0.5) / dist;
            d.hx = pen.x + dx * k;
            d.hy = pen.y + dy * k;
          }
        }
        // aus dem schon geschriebenen Teil des Namens herausgedrückt werden
        if (cleared) {
          const m = d.r;
          const { l, t, r, b } = cleared;
          if (d.hx > l - m && d.hx < r + m && d.hy > t - m && d.hy < b + m) {
            d.hy = d.hy < (t + b) / 2 ? t - m - d.jitter : b + m + d.jitter;
          }
        }
        if (!d.keep) {
          d.x += (d.hx - d.x) * 0.2;
          d.y += (d.hy - d.y) * 0.2;
        }

        let s = easeOutBack(clamp01((now - t0 - d.delay) / 420));
        if (d.out !== null) s *= 1 - easeInOut(clamp01((now - d.out) / 380));
        if (s <= 0.001) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * s, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
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
      await Promise.all([wait(FILL_MIN), Promise.race([loaded, wait(FILL_MAX)])]);
      if (!alive) return;

      // 2 — der Strich schreibt den Namen, Buchstaben füllen sich dahinter
      await tween(WRITE, (t, now) => {
        let at = easeInOut(t) * total;
        for (const p of parts) {
          const path = strokes.current[p.i];
          const drawn = Math.min(p.len, Math.max(0, at));
          path.style.strokeDashoffset = `${p.len - drawn}`;
          if (drawn >= p.len && !p.doneAt) {
            p.doneAt = now;
            const { l, t, r, b } = p.box;
            cleared = cleared
              ? { l: Math.min(cleared.l, l - pad), t: Math.min(cleared.t, t - pad), r: Math.max(cleared.r, r + pad), b: Math.max(cleared.b, b + pad) }
              : { l: l - pad, t: t - pad, r: r + pad, b: b + pad };
          }
          if (at > 0 && drawn < p.len) {
            const pt = path.getPointAtLength(drawn);
            pen = toScreen(pt.x, pt.y);
          }
          if (p.doneAt) {
            const rect = clipRects.current[p.i];
            rect.setAttribute("width", `${(p.bb.width + 2) * easeOut(clamp01((now - p.doneAt) / LETTER_FILL))}`);
          }
          at -= p.len;
        }
      });
      pen = null;
      for (const p of parts) clipRects.current[p.i].setAttribute("width", `${p.bb.width + 2}`);
      if (!alive) return;

      // 3 — alle Punkte verschwinden, je einer in Rot, Grün und Blau fliegt aufs i
      const used = new Set();
      keepers = DOTS.map((target, k) => {
        const to = toScreen(target.cx, target.cy);
        let best = null, bestDist = Infinity;
        for (const d of dots) {
          if (used.has(d) || d.color !== target.fill) continue;
          const dist = Math.hypot(d.x - to.x, d.y - to.y);
          if (dist < bestDist) (best = d), (bestDist = dist);
        }
        used.add(best);
        best.keep = true;
        return { d: best, from: { x: best.x, y: best.y, r: best.r }, to, r: target.r * unit, k };
      });
      const now = performance.now();
      for (const d of dots) if (!d.keep) d.out = now + Math.random() * (CLEAR - 380);
      strokeGroup.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLEAR, fill: "forwards" });

      await Promise.all(
        keepers.map(({ d, from, to, r, k }) =>
          tween(
            CLEAR - 150,
            (t) => {
              const e = easeInOut(t);
              d.x = from.x + (to.x - from.x) * e;
              d.y = from.y + (to.y - from.y) * e - Math.sin(e * Math.PI) * 60;
              d.r = from.r + (r - from.r) * e;
            },
            k * 80
          )
        )
      );
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
      <canvas ref={canvas} className="absolute inset-0" />
      <div ref={wrap} className="absolute">
        <svg
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
          className="block w-full h-auto overflow-visible"
        >
          <defs>
            <clipPath id="intro-letters">
              {PARTS.map((_, i) => (
                <rect key={i} ref={(r) => (clipRects.current[i] = r)} width={0} height={0} />
              ))}
            </clipPath>
          </defs>
          <path ref={fill} d={LETTERS} fill="currentColor" clipPath="url(#intro-letters)" />
          <g ref={strokeGroup} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinejoin="round">
            {PARTS.map((d, i) => (
              <path key={i} ref={(p) => (strokes.current[i] = p)} d={d} />
            ))}
          </g>
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
    </div>
  );
}
