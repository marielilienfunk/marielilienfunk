"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

function GalleryVideo({ src, portrait, ratio, position }) {
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
          portrait && !ratio ? "aspect-[4/5]" : ""
        }`}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {isNear &&
          (asImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              className={className}
              style={{ objectPosition: position }}
              onError={() => setAsImage(false)}
            />
          ) : (
            <video
              ref={videoRef}
              src={src}
              className={className}
              style={{ objectPosition: position }}
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

function GalleryImage({ src, alt, portrait, inRow }) {
  const [isLandscape, setIsLandscape] = useState(false);

  const checkOrientation = (img) => {
    if (img && img.naturalWidth && img.naturalHeight) {
      setIsLandscape(img.naturalWidth > img.naturalHeight);
    }
  };

  return (
    <Reveal y={40} className={isLandscape && !inRow ? "col-span-2" : undefined}>
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

// Ein Medium in der Galerie: Bild im Originalformat (mittig, ganz sichtbar)
// oder Video. Videos laufen nur, solange ihr Slide sichtbar ist, und starten
// beim Hinblättern von vorn.
function CarouselSlide({ src, isVideo, active, load, asImage }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, load]);

  if (!load) return null;
  if (isVideo && !asImage) {
    return (
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={
        isVideo
          ? "h-full w-full object-cover"
          : "max-h-full max-w-full rounded-2xl object-contain"
      }
    />
  );
}

function Arrow({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Previous" : "Next"}
      className={`absolute top-1/2 -translate-y-1/2 ${
        dir < 0 ? "left-3" : "right-3"
      } z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/85 text-ink shadow-sm backdrop-blur transition hover:bg-paper`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d={dir < 0 ? "M8.5 2.5 4 7l4.5 4.5" : "M5.5 2.5 10 7l-4.5 4.5"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// Galerie zum Durchklicken: { carousel: [...], ratio: "4 / 5" }. Bilder bleiben
// in ihrem Format, links und rechts mittig sitzt je ein kleiner Pfeil; auf dem
// Handy kann man auch wischen.
function GalleryCarousel({ items, ratio = "4 / 5" }) {
  const ref = useRef(null);
  const swipe = useRef(null);
  const [index, setIndex] = useState(0);
  const [isNear, setIsNear] = useState(false);
  const [asImage, setAsImage] = useState(false);
  const n = items.length;
  const go = (d) => setIndex((i) => (i + d + n) % n);

  useEffect(() => {
    setAsImage(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal y={40}>
      <div
        ref={ref}
        className="relative select-none overflow-hidden rounded-2xl"
        style={{ aspectRatio: ratio, touchAction: "pan-y" }}
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipe.current == null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item, i) => {
            const src = typeof item === "string" ? item : item.video || item.image;
            const isVideo = typeof item === "object" && !!item.video;
            return (
              <div
                key={src}
                className={`flex h-full w-full shrink-0 items-center justify-center ${
                  isVideo ? "bg-black/5" : ""
                }`}
                aria-hidden={i !== index}
              >
                <CarouselSlide
                  src={src}
                  isVideo={isVideo}
                  active={i === index}
                  load={isNear && (isVideo || Math.min((i - index + n) % n, (index - i + n) % n) <= 2)}
                  asImage={asImage}
                />
              </div>
            );
          })}
        </div>
        {n > 1 && (
          <>
            <Arrow dir={-1} onClick={() => go(-1)} />
            <Arrow dir={1} onClick={() => go(1)} />
          </>
        )}
      </div>
    </Reveal>
  );
}

export default function ProjectDetail({ project, next }) {
  return (
    <article>
      {/* Statement heading */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
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
        {project.gallery.map(function renderItem(item, i, inRow) {
          // { row: [...] } zeigt mehrere Hochformate nebeneinander in einer Reihe
          if (item.row) {
            return (
              <div
                key={`row-${i}`}
                className="col-span-2 grid gap-4 sm:gap-6"
                style={{
                  gridTemplateColumns:
                    item.cols || `repeat(${item.row.length}, minmax(0, 1fr))`,
                }}
              >
                {item.row.map((child, j) => renderItem(child, j, true))}
              </div>
            );
          }

          if (item.carousel) {
            return (
              <GalleryCarousel
                key={`carousel-${i}`}
                items={item.carousel}
                ratio={item.ratio}
              />
            );
          }

          return typeof item === "object" && item.video ? (
            <GalleryVideo
              key={`video-${i}`}
              src={item.video}
              portrait={item.portrait}
              ratio={item.ratio}
              position={item.position}
            />
          ) : (
            <GalleryImage
              key={`image-${i}`}
              src={item.image || item}
              portrait={item.portrait}
              inRow={inRow === true}
              alt={`${project.title} — image ${i + 1}`}
            />
          );
        })}
      </section>

      {/* Next project / back */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-black/10 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm tracking-wide text-black/60 hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="text-sm tracking-wide hover:text-accent transition-colors"
        >
          Next project: {next.title} →
        </Link>
      </footer>
    </article>
  );
}
