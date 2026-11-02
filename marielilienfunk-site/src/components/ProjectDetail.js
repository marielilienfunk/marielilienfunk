"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

function GalleryVideo({ src, portrait, ratio }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [asImage, setAsImage] = useState(false);
  const [isNear, setIsNear] = useState(false);

  // Safari legt bei blockiertem Autoplay einen Playbutton über <video>. Als
  // <img> spielt Safari MP4s ohne Button in Dauerschleife ab.
  useEffect(() => {
    setAsImage(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  // Videos erst kurz vor dem Sichtbereich laden, damit die Seite schnell öffnet.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay zusätzlich per Code starten. Falls der Browser das blockiert,
  // startet das Video bei der ersten Berührung der Seite.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    play();
    document.addEventListener("touchend", play, { passive: true });
    document.addEventListener("click", play);
    return () => {
      document.removeEventListener("touchend", play);
      document.removeEventListener("click", play);
    };
  }, [asImage, isNear]);

  const className = "w-full h-full object-cover";

  return (
    <Reveal y={40} className={portrait ? undefined : "col-span-2"}>
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-2xl bg-black/5 ${
          portrait ? "aspect-[4/5]" : ""
        }`}
        style={portrait ? undefined : { aspectRatio: ratio }}
      >
        {isNear &&
          (asImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              className={className}
              onError={() => setAsImage(false)}
            />
          ) : (
            <video
              ref={videoRef}
              src={src}
              className={className}
              autoPlay
              muted
              loop
              playsInline
            />
          ))}
      </div>
    </Reveal>
  );
}

function GalleryImage({ src, alt, portrait }) {
  const [isLandscape, setIsLandscape] = useState(false);

  const checkOrientation = (img) => {
    if (img && img.naturalWidth && img.naturalHeight) {
      setIsLandscape(img.naturalWidth > img.naturalHeight);
    }
  };

  return (
    <Reveal y={40} className={isLandscape ? "col-span-2" : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={(img) => img?.complete && checkOrientation(img)}
        src={src}
        alt={alt}
        onLoad={(e) => checkOrientation(e.currentTarget)}
        className={`w-full rounded-2xl ${
          portrait ? "aspect-[4/5] object-cover" : "h-auto"
        }`}
      />
    </Reveal>
  );
}

export default function ProjectDetail({ project, next }) {
  return (
    <article>
      {/* Cover image */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/5"
        >
          {project.cover && (
            <Image
              src={project.cover}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          )}
        </motion.div>
      </div>

      {/* Statement heading */}
      <section className="max-w-6xl mx-auto px-6 pt-20">
        <Reveal>
          <h2 className="font-sans font-light text-3xl sm:text-5xl leading-snug max-w-4xl text-ink">
            {project.statement}
          </h2>
          {project.subtitle && (
            <p className="font-sans font-light text-xl sm:text-2xl mt-2 text-black/40">
              {project.subtitle}
            </p>
          )}
        </Reveal>
      </section>

      {/* Services & Overview */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-2 gap-12">
        <Reveal>
          {project.services.length > 0 && (
            <h2 className="text-sm tracking-widest text-black/40 mb-4">
              Services
            </h2>
          )}
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
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-2 gap-4 sm:gap-6">
        {project.gallery.map((item, i) =>
          typeof item === "object" && item.video ? (
            <GalleryVideo
              key={`video-${i}`}
              src={item.video}
              portrait={item.portrait}
              ratio={item.ratio}
            />
          ) : (
            <GalleryImage
              key={`image-${i}`}
              src={item.image || item}
              portrait={item.portrait}
              alt={`${project.title} — Bild ${i + 1}`}
            />
          )
        )}
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
