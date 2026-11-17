"use client";

// Startseite: oben steht das Logo groß in der Mitte (genau dort, wo das Intro
// endet). Beim Runterscrollen wandert es in den Header nach oben links,
// beim Hochscrollen kommt es wieder groß zurück.

import { useEffect, useRef } from "react";
import Logo, { VIEWBOX } from "./Logo";

const DOCK = 0.55; // nach so viel Bildschirmhöhe Scrollen sitzt das Logo im Header

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function ScrollLogo() {
  const big = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = big.current;
    let raf = 0;

    const update = () => {
      raf = 0;
      const header = document.querySelector("[data-header-logo] svg");
      if (!header) return;
      // gleiche Größe und Lage wie das große Logo am Ende des Intros
      const vw = window.innerWidth, vh = window.innerHeight;
      const W = Math.min(vw * 0.86, 980);
      const H = (W * VIEWBOX.h) / VIEWBOX.w;
      const x0 = (vw - W) / 2, y0 = (vh - H) / 2;
      const t = header.getBoundingClientRect();

      const e = easeInOut(clamp01(window.scrollY / (vh * DOCK)));
      const s = 1 + (t.width / W - 1) * e;
      el.style.width = `${W}px`;
      el.style.transform = `translate(${x0 + (t.left - x0) * e}px, ${y0 + (t.top - y0) * e}px) scale(${s})`;

      // angekommen: ab hier zeigt der Header sein eigenes Logo
      const docked = e >= 1;
      el.style.visibility = docked ? "hidden" : "visible";
      html.classList.toggle("logo-big", !docked);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      html.classList.remove("logo-big");
    };
  }, []);

  return (
    <>
      <div
        ref={big}
        data-scroll-logo
        className="fixed left-0 top-0 z-[60] origin-top-left text-ink pointer-events-none"
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        <Logo className="block w-full h-auto" />
      </div>
      {/* der erste Bildschirm gehört dem großen Logo */}
      <div className="h-[calc(100svh-4.5rem)]" aria-hidden="true" />
    </>
  );
}
