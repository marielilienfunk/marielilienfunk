"use client";

import { useState } from "react";
import { TAGS, tagColor, tagTextColor } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ projects }) {
  const [activeTag, setActiveTag] = useState("All");

  const filtered =
    activeTag === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveTag("All")}
          className={`px-4 py-1.5 font-light text-[15px] border rounded-full transition-colors ${
            activeTag === "All"
              ? "bg-ink text-paper border-ink"
              : "border-black/15 text-ink hover:border-black/40"
          }`}
        >
          All
        </button>
        {TAGS.map((tag) => {
          const color = tagColor(tag);
          const active = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 font-light text-[15px] border rounded-full transition-colors ${
                active ? "" : "border-black/15 text-ink hover:border-black/40"
              }`}
              style={active ? { borderColor: color, backgroundColor: color, color: tagTextColor(color) } : undefined}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-black/50 text-sm">No projects with this tag yet.</p>
      )}
    </div>
  );
}
