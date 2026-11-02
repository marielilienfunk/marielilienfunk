import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5">
        {project.cover && (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-sans font-medium text-base">{project.title}</h3>
      </div>
      <p className="text-sm text-black/50 mt-0.5">{project.tags.join(" · ")}</p>
    </Link>
  );
}
