"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

export default function ProjectDetail({ project, next }) {
  return (
    <article>
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-widest text-black/50 mb-4"
        >
          {project.client}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-sans font-medium text-4xl sm:text-6xl max-w-4xl leading-tight mb-6"
        >
          {project.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-lg text-black/70"
        >
          {project.role}
        </motion.p>
      </header>

      {/* Cover image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[16/10] w-full overflow-hidden bg-black/5"
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Overview */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-[1fr_2fr] gap-8">
        <Reveal>
          <h2 className="text-sm tracking-widest text-black/50">
            Overview
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xl sm:text-2xl font-sans font-light leading-relaxed max-w-2xl">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* What we did */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-black/10 grid sm:grid-cols-[1fr_2fr] gap-8">
        <Reveal>
          <h2 className="text-sm tracking-widest text-black/50">
            What we did
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {project.services.map((service, i) => (
            <Reveal key={service} delay={i * 0.05}>
              <p className="text-lg">{service}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-6 pb-20 flex flex-col gap-6">
        {project.gallery.map((src, i) => (
          <Reveal key={`${src}-${i}`} y={40}>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
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
