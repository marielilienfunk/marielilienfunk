"use client";

// Startseite, erster Bildschirm:
// „Marie-Lilien Funk“ steht als wuselnder Konfetti-Schriftzug da, das Logo liegt
// versteckt darunter. Beim Runterscrollen kommt von unten ein verspielter schwarzer
// Strich und verjagt die Punkte kreuz und quer – darunter steht das Logo, nur drei
// Punkte bleiben und werden die i-Punkte. Weiter scrollen schiebt das Logo in den
// Header. Alles hängt an der Scrollposition, hochscrollen spielt es rückwärts.

import { useEffect, useRef } from "react";
import { LETTERS, DOTS, VIEWBOX, BRAND_COLORS } from "./Logo";

const DRAW_SCROLL = 1.1; // Bildschirmhöhen Scrollen, bis alle Punkte verjagt sind
const DOCK_SCROLL = 0.45; // danach so viel, bis das Logo im Header sitzt
const TRAIL = 0.045; // Anteil der Bahn, der als Strich zu sehen ist

// Bahn des Strichs, nach Maries Skizze: Punkte relativ zum Schriftzug
// (x: 0 = linker, 1 = rechter Rand; y: 0 = Ober-, 1 = Unterkante der Buchstaben)
const SKETCH = [
  [-200, 100], [0, 225], [20, 290], [70, 370], [130, 440], [200, 475], [300, 500], [380, 495], [420, 470],
  [450, 430], [465, 410], [460, 400], [420, 400], [400, 420], [370, 450], [330, 505], [308, 545], [310, 595],
  [350, 615], [430, 622], [500, 595], [560, 545], [630, 490], [700, 445], [760, 410], [820, 395], [880, 395],
  [940, 425], [965, 475], [962, 530], [925, 560], [840, 580], [760, 580], [730, 560], [680, 535], [620, 500],
  [560, 450], [538, 400], [575, 368], [650, 375], [720, 400], [760, 420], [830, 460], [900, 520], [960, 560],
  [1020, 585], [1110, 605], [1220, 612], [1300, 590], [1380, 545], [1430, 490], [1440, 435], [1400, 422],
  [1330, 430], [1260, 465], [1200, 505], [1130, 565], [1060, 630], [990, 690], [930, 720], [890, 738],
  [890, 722], [930, 670], [1000, 605], [1070, 540], [1140, 470], [1190, 390], [1215, 320], [1215, 260],
  [1185, 205], [1150, 190], [1100, 205], [1050, 245], [1022, 310], [1022, 350], [1070, 395], [1160, 435],
  [1250, 470], [1350, 520], [1430, 560], [1500, 600], [1560, 620], [1600, 618], [1650, 580], [1700, 535],
  [1728, 460], [1738, 395], [1715, 360], [1670, 352], [1610, 395], [1578, 440], [1560, 500], [1535, 580],
  [1500, 670], [1450, 745], [1400, 790], [1345, 805], [1305, 785], [1285, 745], [1290, 695], [1330, 640],
  [1400, 580], [1480, 540], [1560, 505], [1660, 465], [1780, 462], [1880, 440], [2000, 400], [2250, 330],
].map(([x, y]) => [(x - 310) / 1375, (y - 398) / 147]); // Schriftzug in der Skizze: x 310–1685, y 398–545
const FLEE = 0.16; // Anteil der Bahn, über den ein verjagter Punkt aus dem Bild fliegt
const STEP = 3.1; // Rasterabstand (SVG-Einheiten) beim Füllen der Buchstaben mit Punkten
const CONFETTI_R = 4.2; // Radius der Konfetti-Punkte (SVG-Einheiten)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);

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

      // Stiftbahn: Punkte der Skizze erst glätten (Chaikin), dann weiche Kurve (Catmull-Rom)
      let pts = SKETCH.map(([x, y]) => ({ x: left + x * W, y: top + y * H }));
      for (let n = 0; n < 3; n++) {
        const next = [pts[0]];
        for (let k = 0; k < pts.length - 1; k++) {
          const a = pts[k], b = pts[k + 1];
          next.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 });
          next.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 });
        }
        next.push(pts[pts.length - 1]);
        pts = next;
      }
      const route = [pts[0]];
      for (let k = 0; k < pts.length - 1; k++) {
        const p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(pts.length - 1, k + 2)];
        for (let s = 1; s <= 3; s++) {
          const t = s / 3, t2 = t * t, t3 = t2 * t;
          const c = (a, b, c2, d) => 0.5 * (2 * b + (c2 - a) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (3 * b - a - 3 * c2 + d) * t3);
          route.push({ x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) });
        }
      }

      route[0].time = 0;
      for (let k = 1; k < route.length; k++) {
        route[k].time = route[k - 1].time + Math.hypot(route[k].x - route[k - 1].x, route[k].y - route[k - 1].y);
      }
      const total = route[route.length - 1].time;

      // Konfetti-Punkte: jeder hat einen Platz im Schriftzug und wechselt ihn ab und zu
      const homes = samplePoints().map((p) => toScreen(p.x, p.y));
      const rBase = CONFETTI_R * unit; // alle Punkte etwa gleich groß, wie Konfetti
      const dots = homes.map((h) => ({
        home: h,
        x: h.x, y: h.y,
        r: rBase * rand(0.92, 1.08),
        color: pick(BRAND_COLORS),
        delay: Math.random() * 900,
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.0015, 0.0035),
        amp: rand(0.6, 2) * unit,
        nextHop: Math.random() * 3000,
      }));
      dots.sort(() => Math.random() - 0.5); // Farben gleichmäßig überlagern
      for (let n = Math.round(homes.length * 0.04); n > 0; n--) {
        const h = pick(homes);
        const home = { x: h.x + rand(-3, 3) * H, y: h.y + rand(-1.25, 1.25) * H };
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

      // wann der Strich jeden Punkt erwischt (sobald er nah genug ist, sonst dort,
      // wo er ihm am nächsten kommt) und wohin er ihn wegschleudert
      const reach = Math.max(18, H * 0.35);
      for (const d of dots) {
        if (d.keeper) continue;
        let hit = -1, closest = 0, best = Infinity;
        for (let k = 0; k < route.length; k++) {
          const dist = Math.hypot(route[k].x - d.home.x, route[k].y - d.home.y);
          if (dist < reach) {
            hit = k;
            break;
          }
          if (dist < best) (best = dist), (closest = k);
        }
        if (hit < 0) hit = closest;
        d.pass = route[hit].time;
        const tip = route[Math.max(0, hit - 1)];
        // weit genug, dass jeder Punkt das Bild verlässt; dazu Schwerkraft und Flattern
        const dx = d.home.x - tip.x, dy = d.home.y - tip.y;
        const n = Math.hypot(dx, dy) || 1;
        const far = Math.hypot(vw, vh) * rand(0.75, 1.15);
        d.fx = (dx / n) * far;
        d.fy = (dy / n) * far - vh * rand(0.1, 0.4);
        d.drop = vh * rand(0.5, 1);
        d.flutter = H * rand(0.08, 0.25);
      }

      return { vw, vh, W, H, left, top, ctx, route, total, dots, lineW: Math.max(3, H * 0.06) };
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const s = scene;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const u = reduce ? 1 : clamp01(y / (vh * DRAW_SCROLL));
      const T = u * s.total;
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
            const k = easeInOut(clamp01((u - 0.8 - d.keeper.k * 0.03) / 0.12));
            x += (d.keeper.to.x - x) * k;
            y2 += (d.keeper.to.y - y2) * k - Math.sin(k * Math.PI) * s.H * 0.6;
            r += (d.keeper.r - r) * k;
          } else {
            const f = clamp01((T - d.pass) / (s.total * FLEE));
            if (f >= 1) continue;
            const e = 1 - Math.pow(1 - f, 2);
            x += d.fx * e + Math.sin(f * 14 + d.phase) * d.flutter * f;
            y2 += d.fy * e + d.drop * f * f;
            if (x < -20 || x > s.vw + 20 || y2 < -20 || y2 > s.vh + 20) continue;
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
        // Spitze genau an der Scrollposition, damit der Strich nicht ruckelt
        const next = s.route.find((p) => p.time > T);
        const prev = vis[vis.length - 1];
        if (next && prev) {
          const k = (T - prev.time) / (next.time - prev.time || 1);
          vis.push({ x: prev.x + (next.x - prev.x) * k, y: prev.y + (next.y - prev.y) * k });
        }
        // wie ein Pinselstrich: vorne voll, nach hinten dünn auslaufend
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1f1f1f";
        for (let k = 1; k < vis.length; k++) {
          ctx.beginPath();
          ctx.moveTo(vis[k - 1].x, vis[k - 1].y);
          ctx.lineTo(vis[k].x, vis[k].y);
          ctx.lineWidth = s.lineW * (0.15 + 0.85 * Math.pow(k / (vis.length - 1), 0.7));
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
        {/* das Logo liegt von Anfang an fertig unter den Punkten */}
        <div ref={wrap} className="absolute origin-top-left">
          <svg viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`} className="block w-full h-auto overflow-visible">
            <path d={LETTERS} fill="currentColor" />
            {DOTS.map((d, i) => (
              <circle key={i} ref={(c) => (circles.current[i] = c)} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} style={{ opacity: 0 }} />
            ))}
          </svg>
        </div>
        <canvas ref={canvas} className="absolute inset-0" />
      </div>
      {/* Scrollweg für das Freilegen und das Andocken an den Header */}
      <div style={{ height: `${(DRAW_SCROLL + DOCK_SCROLL + 0.2) * 100}svh` }} aria-hidden="true" />
    </>
  );
}
