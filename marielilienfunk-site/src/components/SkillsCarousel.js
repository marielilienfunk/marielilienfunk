"use client";

import { useState } from "react";

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 48 48",
  className: "w-10 h-10",
};

const SKILLS = [
  {
    name: "Art Direction",
    description:
      "Konzeption und visuelle Führung von Kampagnen, Bildwelten und Markenauftritten.",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="24" cy="24" r="16" />
        <circle cx="24" cy="24" r="4" />
        <path d="M24 8v6M24 34v6M8 24h6M34 24h6" />
      </svg>
    ),
  },
  {
    name: "Fotografie",
    description:
      "Editorial-, Produkt- und Portraitfotografie für Kampagnen und Publikationen.",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="6" y="14" width="36" height="24" rx="3" />
        <circle cx="24" cy="26" r="7" />
        <path d="M17 14l2.5-4h9l2.5 4" />
      </svg>
    ),
  },
  {
    name: "Videografie",
    description:
      "Kurzfilme und Kampagnenfilme, konzipiert und produziert im gleichen visuellen System.",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="6" y="12" width="26" height="24" rx="3" />
        <path d="M32 20l10-6v20l-10-6z" />
      </svg>
    ),
  },
  {
    name: "Design & Branding",
    description:
      "Visuelle Identität, Art Direction und Markenstrategie — von der Idee bis zum fertigen System.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M24 6C13 6 6 13 6 22c0 6 4 8 8 8h2a3 3 0 0 1 3 3v3c0 3 2 5 5 5 11 0 20-9 20-19S35 6 24 6z" />
        <circle cx="16" cy="21" r="2" />
        <circle cx="24" cy="15" r="2" />
        <circle cx="32" cy="21" r="2" />
      </svg>
    ),
  },
  {
    name: "Layout Design",
    description: "Editorial- und Print-Layouts für Magazine und Publikationen.",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="6" y="8" width="36" height="32" rx="2" />
        <path d="M6 18h36M18 18v22" />
      </svg>
    ),
  },
  {
    name: "Creative Direction",
    description:
      "Übergreifende kreative Leitung über Teams, Formate und Disziplinen hinweg.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M24 6c7 0 12 5 12 11 0 5-3 7-4 10-1 2-1 3-1 5H17c0-2 0-3-1-5-1-3-4-5-4-10 0-6 5-11 12-11z" />
        <path d="M19 38h10M21 42h6" />
      </svg>
    ),
  },
];

const VISIBLE = 3;

export default function SkillsCarousel() {
  const [index, setIndex] = useState(0);
  const maxIndex = SKILLS.length - VISIBLE;
  const trackWidthPercent = (SKILLS.length / VISIBLE) * 100;
  const childWidthPercent = 100 / SKILLS.length;

  return (
    <div>
      <div className="overflow-x-hidden py-10">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            width: `${trackWidthPercent}%`,
            transform: `translateX(-${index * childWidthPercent}%)`,
          }}
        >
          {SKILLS.map((skill) => (
            <div
              key={skill.name}
              style={{ width: `${childWidthPercent}%` }}
              className="px-3"
            >
              <div className="group [perspective:1000px] h-60">
                <div className="relative w-full h-full transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 [backface-visibility:hidden] border border-black/10 rounded-2xl p-8 flex flex-col">
                    <div className="mb-8 text-accent">{skill.icon}</div>
                    <h3 className="font-sans font-medium text-lg text-ink">
                      {skill.name}
                    </h3>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border border-black/10 rounded-2xl p-8 bg-ink flex items-center">
                    <p className="text-paper/90 text-sm leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          aria-label="Zurück"
          className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center hover:border-black/40 disabled:opacity-30 transition-colors"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
          disabled={index === maxIndex}
          aria-label="Weiter"
          className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center hover:border-black/40 disabled:opacity-30 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
