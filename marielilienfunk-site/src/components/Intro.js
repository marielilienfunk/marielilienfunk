"use client";

// Intro beim ersten Aufruf (einmal pro Browser-Sitzung):
// 1. „Marie-Lilien Funk“ entsteht aus bunten Konfetti-Punkten, die durcheinanderwuseln
// 2. ein verspielter schwarzer Strich schlingt sich hindurch, verjagt die Punkte
//    und zeichnet dabei Buchstabe für Buchstabe das Logo
// 3. drei Punkte lässt er stehen – sie hüpfen als i-Punkte auf die i's
// 4. das Logo wird klein und fliegt an seinen Platz im Header

import { useEffect, useRef, useState } from "react";
import { LETTERS, DOTS, VIEWBOX, BRAND_COLORS } from "./Logo";

const KEY = "mlf-intro-seen";
const FORM_MIN = 1400; // ms Punkte formen den Namen, mindestens
const FORM_MAX = 3500; // ms höchstens, auch wenn die Seite noch lädt
const WIGGLE = 800; // ms der Konfetti-Name steht und wuselt
const DRAW = 2800; // ms der Strich schlingt sich durch den Namen
const TRACE = 380; // ms bis ein Buchstabe nachgezogen ist
const LETTER_FILL = 220; // ms bis er gefüllt ist
const TRAIL = 650; // ms so lang ist der sichtbare Strich
const LOOPS = 6; // Schlingen auf dem Weg
const SCATTER = 750; // ms bis ein verjagter Punkt weg ist
const SETTLE = 650; // ms die i-Punkte hüpfen auf ihren Platz
const HOLD = 600; // ms groß stehen lassen
const SHRINK = 900; // ms Verkleinern

const STEP = 3.1; // Rasterabstand (SVG-Einheiten) beim Füllen der Buchstaben mit Punkten
const PARTS = LETTERS.split(/(?=M)/); // jeder Buchstabe bzw. jede Innenform einzeln

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
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
  const strokeGroup = useRef(null);
  const strokes = useRef([]);
  const clipRects = useRef([]);
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

    // Buchstaben: Länge und Umriss, zum Nachziehen vorbereitet
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
      return { i, len, bb, startX: toScreen(bb.x + bb.width * 0.3, 0).x, startedAt: 0 };
    });

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
    dots.sort(() => Math.random() - 0.5); // Farben gleichmäßig überlagern

    // ein paar lose Punkte schweben um den Schriftzug
    for (let n = Math.round(homes.length * 0.04); n > 0; n--) {
      const h = pick(homes);
      const home = { x: h.x + (Math.random() - 0.5) * 6 * H, y: h.y + (Math.random() - 0.5) * 2.5 * H };
      dots.push({ ...pick(dots), home, x: home.x, y: home.y, floater: true });
    }

    // der Strich: Spur der Stiftspitze (Bildschirm-px)
    let trail = [];
    let trailFrom = 0; // Zeitpunkt, ab dem die Spur sichtbar ist
    const lineW = Math.max(2.5, 2.3 * unit);
    const midY = top + H * 0.55;

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
          d.vx *= 0.95;
          d.vy = d.vy * 0.95 + 0.22 * dt;
          s *= 1 - clamp01((now - d.kickedAt) / SCATTER);
          if (s <= 0.001) continue;
        } else if (!d.settling) {
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

      // Strich als weiche Linie durch die letzten Punkte der Spur
      const vis = trail.filter((p) => p.t >= Math.max(trailFrom, now - TRAIL));
      if (vis.length > 1) {
        ctx.beginPath();
        ctx.moveTo(vis[0].x, vis[0].y);
        for (let k = 1; k < vis.length - 1; k++) {
          const mx = (vis[k].x + vis[k + 1].x) / 2, my = (vis[k].y + vis[k + 1].y) / 2;
          ctx.quadraticCurveTo(vis[k].x, vis[k].y, mx, my);
        }
        ctx.lineTo(vis[vis.length - 1].x, vis[vis.length - 1].y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineW;
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

      // drei Punkte – je einer in Rot, Grün, Blau – lässt der Strich stehen
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

      // 2 — der Strich schlingt sich von links nach rechts durch den Namen.
      // Bahn: eine Zykloide mit Schlingen, deren Größe leicht schwankt.
      const x0 = left - H * 1.2, x1 = left + W + H * 1.2;
      const loopR = (u) => H * (0.5 + 0.18 * Math.sin(u * 17) + 0.1 * Math.sin(u * 7 + 1));
      const reach = Math.max(28, H * 0.7);
      const bandT = top - H * 0.3, bandB = top + H * 1.3;
      trailFrom = performance.now();
      await tween(DRAW, (t, now) => {
        const u = t * 0.85 + easeInOut(t) * 0.15; // fast gleichmäßig, weich am Anfang und Ende
        const theta = u * LOOPS * Math.PI * 2;
        const base = x0 + (x1 - x0) * u;
        const R = loopR(u);
        const tip = {
          x: base - R * Math.sin(theta),
          y: midY - R * Math.cos(theta) * 0.95 + Math.sin(u * 9) * H * 0.15,
          t: now,
        };
        trail.push(tip);

        // Punkte in der Nähe der Spitze und hinter dem Strich werden verjagt
        for (const d of dots) {
          if (d.kickedAt || d.keep) continue;
          const dx = d.x - tip.x, dy = d.y - tip.y;
          const dist = Math.hypot(dx, dy);
          const behind = d.x < base - H * 0.2 && d.y > bandT && d.y < bandB;
          if (dist < reach || behind) {
            const n = dist || 1;
            const f = 5 + Math.random() * 8;
            d.vx = (dx / n) * f + 2;
            d.vy = (dy / n) * f - 2;
            d.kickedAt = now;
          }
        }

        // Buchstaben, über die der Strich schon gefahren ist, zeichnen sich
        for (const p of parts) {
          if (!p.startedAt && base > p.startX) p.startedAt = now;
          if (!p.startedAt) continue;
          const k = clamp01((now - p.startedAt) / TRACE);
          strokes.current[p.i].style.strokeDashoffset = `${p.len * (1 - easeOut(k))}`;
          const f = clamp01((now - p.startedAt - TRACE * 0.6) / LETTER_FILL);
          clipRects.current[p.i].setAttribute("width", `${(p.bb.width + 2) * easeOut(f)}`);
        }
      });
      if (!alive) return;

      // restliche Buchstaben fertig zeichnen, lose Punkte auch verjagen
      const after = performance.now();
      for (const p of parts) {
        strokes.current[p.i].style.strokeDashoffset = "0";
        clipRects.current[p.i].setAttribute("width", `${p.bb.width + 2}`);
      }
      for (const d of dots) {
        if (d.kickedAt || d.keep) continue;
        d.vx = (Math.random() - 0.5) * 8;
        d.vy = (d.y < midY ? -1 : 1) * (3 + Math.random() * 6);
        d.kickedAt = after;
      }

      // 3 — Strich läuft aus, die drei Punkte hüpfen auf die i's
      strokeGroup.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: SETTLE, fill: "forwards" });
      await Promise.all([
        tween(TRAIL, (t, now) => {
          trailFrom = after + TRAIL * t;
          if (t === 1) trail = [];
        }),
        ...keepers.map(({ d, to, r, k }) => {
          d.settling = true;
          const from = { x: d.x, y: d.y, r: d.r };
          return tween(
            SETTLE,
            (t) => {
              const e = easeInOut(t);
              d.x = from.x + (to.x - from.x) * e;
              d.y = from.y + (to.y - from.y) * e - Math.sin(e * Math.PI) * H * 0.6;
              d.r = from.r + (r - from.r) * e;
            },
            k * 110
          );
        }),
      ]);
      await wait(Math.max(0, SCATTER - SETTLE));
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
            <clipPath id="intro-letters">
              {PARTS.map((_, i) => (
                <rect key={i} ref={(r) => (clipRects.current[i] = r)} width={0} height={0} />
              ))}
            </clipPath>
          </defs>
          <path d={LETTERS} fill="currentColor" clipPath="url(#intro-letters)" />
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
      <canvas ref={canvas} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
