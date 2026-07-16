import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Marie-Lilien Funk`,
    description: project.role,
  };
}

export default function ProjectPage({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <article className="max-w-6xl mx-auto px-6 py-14">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-black/50 mb-2">
          {project.client}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl mb-4">{project.title}</h1>
        <p className="text-black/70">{project.role}</p>
        <p className="text-sm text-black/50 mt-3">{project.tags.join(" · ")}</p>
      </header>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 mb-16">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="border-t border-black/10 pt-8 flex items-center justify-between">
        <Link href="/" className="text-sm uppercase tracking-wide text-black/60 hover:text-accent">
          ← Zurück zum Portfolio
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="text-sm uppercase tracking-wide hover:text-accent"
        >
          Nächstes Projekt: {next.title} →
        </Link>
      </div>
    </article>
  );
}
