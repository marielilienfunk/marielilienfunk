"use client";

// Text erscheint beim Scrollen Zeile für Zeile: er bleibt in der Bildmitte
// stehen, jede Zeile gleitet herein, wird kurz größer und setzt sich auf ihre
// normale Größe. Erst wenn alle Zeilen da sind, geht es mit der Seite weiter.
// Hochscrollen spielt es rückwärts.

import { useEffect, useRef, useState } from "react";

const PER_LINE = 38; // Scrollweg pro Zeile in Prozent der Bildschirmhöhe

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Verlauf einer Zeile von 0 (unsichtbar) bis 1 (steht): rein, größer, wieder normal
function lineStyle(t) {
  const opacity = clamp01(t * 2.2);
  const y = (1 - easeOut(clamp01(t / 0.55))) * 0.7;
  const scale = t < 0.55 ? 0.96 + (1.12 - 0.96) * easeOut(t / 0.55) : 1.12 - 0.12 * easeOut((t - 0.55) / 0.45);
  return { opacity, transform: `translateY(${y}em) scale(${scale})` };
}

export default function LineReveal({ text, className = "" }) {
  const outer = useRef(null);
  const ref = useRef(null);
  const [lines, setLines] = useState(null); // Wörter je Zeile, sobald gemessen

  // 1. Zeilen messen: welches Wort steht in welcher Zeile?
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setLines(false);
    const words = [...ref.current.querySelectorAll("[data-word]")];
    const grouped = [];
    let lastTop = null;
    for (const w of words) {
      if (w.offsetTop !== lastTop) {
        grouped.push([]);
        lastTop = w.offsetTop;
      }
      grouped[grouped.length - 1].push(w.textContent);
    }
    setLines(grouped);
  }, []);

  // 2. beim Scrollen die Zeilen nacheinander zeigen
  useEffect(() => {
    if (!lines) return;
    const rows = [...ref.current.querySelectorAll("[data-line]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      // los geht's, kurz bevor der Text in der Mitte festsitzt
      const box = outer.current.getBoundingClientRect();
      const lead = window.innerHeight * 0.3;
      const range = box.height - window.innerHeight + lead;
      const p = clamp01((lead - box.top) / (range || 1));
      rows.forEach((row, i) => {
        const s = lineStyle(clamp01(p * (rows.length + 0.6) - i));
        row.style.opacity = s.opacity;
        row.style.transform = s.transform;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });

    // ändert sich die Breite, stimmen die Zeilen nicht mehr: dann einfach normaler Text
    const width = window.innerWidth;
    const onResize = () => window.innerWidth !== width && setLines(false);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [lines]);

  const words = text.split(" ");

  // ohne Zeilen-Animation: normaler Absatz
  if (lines === false) {
    return (
      <div className="py-24">
        <p className={className}>{text}</p>
      </div>
    );
  }

  return (
    <div ref={outer} style={{ height: lines ? `${100 + lines.length * PER_LINE}svh` : undefined }}>
      <div className="sticky top-0 flex h-[100svh] items-center">
        <p ref={ref} className={`w-full ${className}`}>
          {lines
            ? lines.map((line, i) => (
                <span key={i} data-line className="block origin-center" style={{ opacity: 0 }}>
                  {line.join(" ")}
                </span>
              ))
            : words.map((w, i) => (
                <span key={i} data-word>
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
        </p>
      </div>
    </div>
  );
}
