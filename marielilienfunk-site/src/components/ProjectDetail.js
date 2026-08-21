"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

export default function ProjectDetail({ project, next }) {
  return (
    <article>
      {/* Cover image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/5"
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Statement heading */}
      <section className="max-w-6xl mx-auto px-6 pt-20">
        <Reveal>
          <h2 className="font-sans font-light text-3xl sm:text-5xl leading-snug max-w-4xl text-ink">
            {project.statement}
          </h2>
        </Reveal>
      </section>

      {/* Services & Overview */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-2 gap-12">
        <Reveal>
          <h2 className="text-sm tracking-widest text-black/40 mb-4">
            Services
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service}
                className="px-4 py-1.5 rounded-full bg-accent/15 text-ink text-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-black/80 whitespace-pre-line">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-6 pb-20 flex flex-col gap-6">
        {project.gallery.map((src, i) => (
          <Reveal key={`${src}-${i}`} y={40}>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/5">
              <Image
                src={src}
                alt={`${project.title} — Bild ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </section>

      {/* Next project / back */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-black/10 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm tracking-wide text-black/60 hover:text-accent transition-colors"
        >
          ← Zurück zum Portfolio
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="text-sm tracking-wide hover:text-accent transition-colors"
        >
          Nächstes Projekt: {next.title} →
        </Link>
      </footer>
    </article>
  );
}
