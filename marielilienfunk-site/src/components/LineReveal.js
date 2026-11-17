"use client";

// Text erscheint Zeile für Zeile, sobald er ins Bild kommt: jede Zeile gleitet
// herein, wird kurz größer und setzt sich dann auf ihre normale Größe.

import { useEffect, useRef, useState } from "react";

const DURATION = 900; // ms pro Zeile
const STAGGER = 170; // ms Abstand zwischen den Zeilen

export default function LineReveal({ text, className = "" }) {
  const ref = useRef(null);
  const [lines, setLines] = useState(null); // Wörter je Zeile, sobald gemessen

  // 1. Zeilen messen: welches Wort steht in welcher Zeile?
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

  // 2. Zeilen nacheinander hereinholen, wenn der Text sichtbar wird
  useEffect(() => {
    if (!lines) return;
    const rows = [...ref.current.querySelectorAll("[data-line]")];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        rows.forEach((row, i) =>
          row.animate(
            [
              { opacity: 0, transform: "translateY(0.7em) scale(0.96)" },
              { opacity: 1, transform: "translateY(0) scale(1.12)", offset: 0.55 },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            { duration: DURATION, delay: i * STAGGER, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "both" }
          )
        );
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);

    // ändert sich die Breite, stimmen die Zeilen nicht mehr: dann einfach normaler Text
    const width = window.innerWidth;
    const onResize = () => window.innerWidth !== width && setLines(false);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [lines]);

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {lines
        ? lines.map((line, i) => (
            <span key={i} data-line className="block origin-left" style={{ opacity: 0 }}>
              {line.join(" ")}
            </span>
          ))
        : lines === false
          ? text
          : words.map((w, i) => (
              <span key={i} data-word>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
    </p>
  );
}
