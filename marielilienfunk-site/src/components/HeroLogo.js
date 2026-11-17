"use client";

// Startseite, erster Bildschirm:
// „Marie-Lilien Funk“ steht als wuselnder Konfetti-Schriftzug da. Beim Runterscrollen
// kommt ein verspielter schwarzer Strich, malt die Umrisse des Logos nach und verjagt
// die Punkte – nur drei bleiben und werden die i-Punkte. Weiter scrollen schiebt das
// Logo in den Header. Alles hängt an der Scrollposition, hochscrollen spielt es rückwärts.

import { useEffect, useRef } from "react";
import { LETTERS, DOTS, VIEWBOX, BRAND_COLORS } from "./Logo";

const DRAW_SCROLL = 1.1; // Bildschirmhöhen Scrollen, bis das Logo fertig gemalt ist
const DOCK_SCROLL = 0.45; // danach so viel, bis es im Header sitzt
const TRAIL = 0.07; // Anteil der Bahn, der als Strich zu sehen ist
const FLEE = 0.1; // Anteil der Bahn, über den ein verjagter Punkt wegfliegt
const LOOP_SPEED = 1.8; // in den Schlingen so viel schneller als auf den Buchstaben
const STEP = 3.1; // Rasterabstand (SVG-Einheiten) beim Füllen der Buchstaben mit Punkten
const PARTS = LETTERS.split(/(?=M)/); // jeder Buchstabe bzw. jede Innenform einzeln

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

export default function HeroLogo() {
  const layer = useRef(null);
  const canvas = useRef(null);
  const wrap = useRef(null);
  const strokeGroup = useRef(null);
  const strokes = useRef([]);
  const clipRects = useRef([]);
  const circles = useRef([]);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    let scene = null;

    // alles, was von der Bildschirmgröße abhängt
    const build = () => {
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
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = vw * dpr;
      cv.height = vh * dpr;
      cv.style.width = `${vw}px`;
      cv.style.height = `${vh}px`;
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Buchstaben zum Nachmalen vorbereiten
      const parts = PARTS.map((_, i) => {
        const p = strokes.current[i];
        const len = p.getTotalLength();
        const bb = p.getBBox();
        p.style.strokeDasharray = `${len}`;
        const rect = clipRects.current[i];
        rect.setAttribute("x", `${bb.x - 1}`);
        rect.setAttribute("y", `${bb.y - 1}`);
        rect.setAttribute("height", `${bb.height + 2}`);
        return { i, len, bb, right: toScreen(bb.x + bb.width, 0).x };
      });

      // Stiftbahn: Umrisse der Buchstaben von links nach rechts, dazwischen Schlingen
      const route = [];
      const connect = (A, B, k) => {
        // kubische Kurve mit gekreuzten Anfassern ergibt eine Schlinge
        const span = Math.max(Math.abs(B.x - A.x), H * 0.8) * (1.1 + Math.random() * 0.5);
        const lift = H * (0.55 + Math.random() * 0.5) * (k % 2 ? 1 : -1);
        const c1 = { x: A.x + span, y: A.y + lift };
        const c2 = { x: B.x - span, y: B.y + lift };
        for (let s = 1; s <= 28; s++) {
          const t = s / 28, m = 1 - t;
          route.push({
            x: m * m * m * A.x + 3 * m * m * t * c1.x + 3 * m * t * t * c2.x + t * t * t * B.x,
            y: m * m * m * A.y + 3 * m * m * t * c1.y + 3 * m * t * t * c2.y + t * t * t * B.y,
            part: null,
          });
        }
      };
      let prev = { x: left - H * 1.5, y: top + H * 1.7, part: null };
      route.push(prev);
      [...parts].sort((a, b) => a.bb.x - b.bb.x).forEach((p, k) => {
        const path = strokes.current[p.i];
        const s0 = path.getPointAtLength(0);
        connect(prev, toScreen(s0.x, s0.y), k);
        const n = Math.max(10, Math.ceil(p.len / 1.5));
        for (let s = 0; s <= n; s++) {
          const pt = path.getPointAtLength((p.len * s) / n);
          route.push({ ...toScreen(pt.x, pt.y), part: p });
        }
        prev = route[route.length - 1];
      });
      connect(prev, { x: left + W + H * 1.5, y: top - H * 0.7 }, parts.length);

      // Zeitachse der Bahn: auf den Buchstaben gleichmäßig, in den Schlingen schneller
      route[0].time = 0;
      for (let k = 1; k < route.length; k++) {
        const seg = Math.hypot(route[k].x - route[k - 1].x, route[k].y - route[k - 1].y);
        route[k].time = route[k - 1].time + (route[k].part ? seg : seg / LOOP_SPEED);
        const p = route[k].part;
        if (p) {
          if (p.t0 === undefined) p.t0 = route[k].time;
          p.t1 = route[k].time;
        }
      }
      const total = route[route.length - 1].time;

      // Konfetti-Punkte: jeder hat einen Platz im Schriftzug und wechselt ihn ab und zu
      const homes = samplePoints().map((p) => toScreen(p.x, p.y));
      const rMin = 2.9 * unit, rMax = 5.2 * unit;
      const dots = homes.map((h) => ({
        home: h,
        x: h.x, y: h.y,
        r: rMin + Math.random() * (rMax - rMin),
        color: pick(BRAND_COLORS),
        delay: Math.random() * 900,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0015 + Math.random() * 0.002,
        amp: (0.6 + Math.random() * 1.4) * unit,
        nextHop: Math.random() * 3000,
      }));
      dots.sort(() => Math.random() - 0.5); // Farben gleichmäßig überlagern
      for (let n = Math.round(homes.length * 0.04); n > 0; n--) {
        const h = pick(homes);
        const home = { x: h.x + (Math.random() - 0.5) * 6 * H, y: h.y + (Math.random() - 0.5) * 2.5 * H };
        dots.push({ ...pick(dots), home, x: home.x, y: home.y, floater: true });
      }

      // drei Punkte – je einer in Rot, Grün, Blau – lässt der Strich stehen
      const used = new Set();
      DOTS.forEach((target, k) => {
        const to = toScreen(target.cx, target.cy);
        let best = null, bestDist = Infinity;
        for (const d of dots) {
          if (used.has(d) || d.floater) continue;
          const dist = Math.hypot(d.home.x - to.x, d.home.y - to.y) + (d.color === target.fill ? 0 : 40);
          if (dist < bestDist) (best = d), (bestDist = dist);
        }
        used.add(best);
        best.keeper = { to, r: target.r * unit, k };
        best.color = target.fill;
      });

      // wann der Strich jeden Punkt verjagt und wohin er fliegt
      const reach = Math.max(26, H * 0.55);
      const bandT = top - H * 0.3, bandB = top + H * 1.3;
      const byEnd = [...parts].sort((a, b) => a.t1 - b.t1);
      for (const d of dots) {
        if (d.keeper) continue;
        let pass = Infinity, tip = null;
        for (let k = 0; k < route.length; k += 2) {
          const r = route[k];
          if (Math.hypot(r.x - d.home.x, r.y - d.home.y) < reach) {
            pass = r.time;
            tip = r;
            break;
          }
        }
        // spätestens, wenn der Buchstabe daneben fertig ist
        if (d.home.y > bandT && d.home.y < bandB) {
          let right = -Infinity;
          for (const p of byEnd) {
            right = Math.max(right, p.right);
            if (right > d.home.x) {
              if (p.t1 < pass) (pass = p.t1), (tip = null);
              break;
            }
          }
        }
        if (pass === Infinity) pass = total * (0.9 + Math.random() * 0.08);
        const dx = d.home.x - (tip ? tip.x : d.home.x - 1), dy = d.home.y - (tip ? tip.y : top + H / 2);
        const n = Math.hypot(dx, dy) || 1;
        const far = H * (1.5 + Math.random() * 2.5);
        d.pass = pass;
        d.fx = (dx / n) * far + H * 0.4;
        d.fy = (dy / n) * far - H * 0.3;
        d.drop = H * (0.8 + Math.random());
      }

      return { vw, vh, W, H, left, top, ctx, parts, route, total, dots, lineW: Math.max(2.5, 2.3 * unit) };
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const s = scene;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const u = reduce ? 1 : clamp01(y / (vh * DRAW_SCROLL));
      const T = u * s.total;

      // Logo: Umrisse nachmalen, dann füllen; Umrisse blenden am Ende aus
      for (const p of s.parts) {
        const frac = u >= 1 ? 1 : clamp01((T - p.t0) / (p.t1 - p.t0 || 1));
        strokes.current[p.i].style.strokeDashoffset = `${p.len * (1 - frac)}`;
        const fill = u >= 1 ? 1 : easeOut(clamp01((T - p.t1) / (s.total * 0.03)));
        clipRects.current[p.i].setAttribute("width", `${(p.bb.width + 2) * fill}`);
      }
      strokeGroup.current.style.opacity = `${1 - clamp01((u - 0.9) / 0.1)}`;
      circles.current.forEach((c) => c && (c.style.opacity = u >= 1 ? "1" : "0"));

      // ins Header-Logo schieben
      const dock = easeInOut(clamp01((y - vh * DRAW_SCROLL) / (vh * DOCK_SCROLL)));
      const header = document.querySelector("[data-header-logo] svg");
      if (header) {
        const t = header.getBoundingClientRect();
        const k = 1 + (t.width / s.W - 1) * dock;
        wrap.current.style.transform = `translate(${(t.left - s.left) * dock}px, ${(t.top - s.top) * dock}px) scale(${k})`;
      }
      const docked = dock >= 1;
      layer.current.style.visibility = docked ? "hidden" : "visible";
      html.classList.toggle("logo-big", !docked);
      if (docked) return;

      // Konfetti
      const ctx = s.ctx;
      ctx.clearRect(0, 0, s.vw, s.vh);
      if (u < 1) {
        for (const d of s.dots) {
          let scale = reduce ? 1 : easeOutBack(clamp01((now - t0 - d.delay) / 600));
          // wuseln: ab und zu einen neuen Platz in der Nähe suchen
          if (now > d.nextHop && !d.floater && !d.keeper) {
            const c = pick(s.dots);
            if (!c.floater && Math.hypot(c.home.x - d.home.x, c.home.y - d.home.y) < s.H * 0.16) d.home = c.home;
            d.nextHop = now + 700 + Math.random() * 2600;
          }
          const tx = d.home.x + Math.sin(now * d.speed + d.phase) * d.amp;
          const ty = d.home.y + Math.cos(now * d.speed * 1.3 + d.phase) * d.amp;
          d.x += (tx - d.x) * 0.12;
          d.y += (ty - d.y) * 0.12;

          let x = d.x, y2 = d.y, r = d.r;
          if (d.keeper) {
            // die drei i-Punkte hüpfen zum Schluss an ihren Platz
            const k = easeInOut(clamp01((u - 0.82 - d.keeper.k * 0.03) / 0.12));
            x += (d.keeper.to.x - x) * k;
            y2 += (d.keeper.to.y - y2) * k - Math.sin(k * Math.PI) * s.H * 0.6;
            r += (d.keeper.r - r) * k;
          } else {
            const f = clamp01((T - d.pass) / (s.total * FLEE));
            if (f >= 1) continue;
            x += d.fx * easeOut(f);
            y2 += d.fy * easeOut(f) + d.drop * f * f;
            scale *= 1 - f;
          }
          if (scale <= 0.001) continue;
          ctx.beginPath();
          ctx.arc(x, y2, r * scale, 0, Math.PI * 2);
          ctx.fillStyle = d.color;
          ctx.fill();
        }
      }

      // der Strich: sichtbarer Abschnitt der Bahn hinter der Stiftspitze
      if (u > 0 && u < 1) {
        const from = T - s.total * TRAIL;
        const vis = s.route.filter((p) => p.time >= from && p.time <= T);
        if (vis.length > 1) {
          ctx.beginPath();
          ctx.moveTo(vis[0].x, vis[0].y);
          for (let k = 1; k < vis.length - 1; k++) {
            ctx.quadraticCurveTo(vis[k].x, vis[k].y, (vis[k].x + vis[k + 1].x) / 2, (vis[k].y + vis[k + 1].y) / 2);
          }
          ctx.lineTo(vis[vis.length - 1].x, vis[vis.length - 1].y);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = s.lineW;
          ctx.strokeStyle = "#1f1f1f";
          ctx.stroke();
        }
      }
    };

    scene = build();
    raf = requestAnimationFrame(frame);

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => (scene = build()), 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      html.classList.remove("logo-big");
    };
  }, []);

  return (
    <>
      <div ref={layer} className="fixed inset-0 z-[60] pointer-events-none text-ink" aria-hidden="true">
        <div ref={wrap} className="absolute origin-top-left">
          <svg viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`} className="block w-full h-auto overflow-visible">
            <defs>
              <clipPath id="hero-letters">
                {PARTS.map((_, i) => (
                  <rect key={i} ref={(r) => (clipRects.current[i] = r)} width={0} height={0} />
                ))}
              </clipPath>
            </defs>
            <path d={LETTERS} fill="currentColor" clipPath="url(#hero-letters)" />
            <g ref={strokeGroup} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinejoin="round">
              {PARTS.map((d, i) => (
                <path key={i} ref={(p) => (strokes.current[i] = p)} d={d} />
              ))}
            </g>
            {DOTS.map((d, i) => (
              <circle key={i} ref={(c) => (circles.current[i] = c)} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} style={{ opacity: 0 }} />
            ))}
          </svg>
        </div>
        <canvas ref={canvas} className="absolute inset-0" />
      </div>
      {/* Scrollweg für das Malen und das Andocken an den Header */}
      <div style={{ height: `${(DRAW_SCROLL + DOCK_SCROLL + 0.2) * 100}svh` }} aria-hidden="true" />
    </>
  );
}
