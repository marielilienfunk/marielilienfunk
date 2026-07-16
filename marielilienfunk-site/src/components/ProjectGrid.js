"use client";

import { useState } from "react";
import { TAGS } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ projects }) {
  const [activeTag, setActiveTag] = useState("Alle");

  const filtered =
    activeTag === "Alle"
      ? projects
      : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {["Alle", ...TAGS].map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 text-sm uppercase tracking-wide border rounded-full transition-colors ${
              activeTag === tag
                ? "bg-ink text-paper border-ink"
                : "border-black/15 text-black/60 hover:border-black/40"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-black/50 text-sm">Noch keine Projekte mit diesem Tag.</p>
      )}
    </div>
  );
}
