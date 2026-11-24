import { BRAND_COLORS, PINK } from "@/components/Logo";

// Platzhalter-Content, übernommen von der aktuellen Wix-Seite (marielilienfunk.com).
// Bilder werden vorerst noch von Wix geladen — sobald du eigene Dateien hast,
// einfach die "cover" / "gallery"-URLs durch lokale Bilder in /public/projects ersetzen.
//
// Tags sind bewusst NICHT fest vorgegeben: die Filterleiste zeigt automatisch
// jeden Tag an, der irgendwo bei einem Projekt in "tags: [...]" steht. Neue
// Kategorie hinzufügen = einfach bei einem Projekt einen neuen Tag-String
// eintragen, kein zweiter Ort im Code zum Pflegen.

export const projects = [
  {
    slug: "cosia",
    title: "Cosia",
    tags: [],
    cover: "/images/cosia/cosia-cover.jpg",
    gallery: [
      { video: "/images/cosia/cosia-video-3.mp4", portrait: true },
      { image: "/images/cosia/cosia-app-mockup.jpg", portrait: true },
      { video: "/images/cosia/cosia-video-1.mp4", ratio: "1926 / 1080" },
      { video: "/images/cosia/cosia-scroll-karussell.mp4", portrait: true },
      { video: "/images/cosia/cosia-video-4.mp4", portrait: true },
      "/images/cosia/cosia-app-icon.jpg",
      { video: "/images/cosia/cosia-video-2.mp4", ratio: "1700 / 1080" },
    ],
  },
  {
    slug: "around-around",
    title: "Around Around",
    client: "Around Around",
    role: "Development of the visual identity.",
    tags: ["Design & Branding"],
    cover: "/images/around-around/around-around-cover.jpg",
    gallery: [
      { video: "/images/around-around/around-around-sketches.mp4", portrait: true },
      { image: "/images/around-around/around-around-aa-all.jpg", portrait: true },
      { image: "/images/around-around/around-around-window.jpg", portrait: true },
      { video: "/images/around-around/around-around-socks.mp4", portrait: true },
      "/images/around-around/around-around-poster.jpg",
      { image: "/images/around-around/around-around-tag.jpg", portrait: true },
      { image: "/images/around-around/around-around-label-knit.jpg", portrait: true },
      { image: "/images/around-around/around-around-card.jpg", portrait: true },
      { video: "/images/around-around/around-around-socke.mp4", portrait: true, position: "center bottom" },
      { video: "/images/around-around/around-around-logo.mp4", portrait: true },
    ],
  },
  {
    slug: "cocktail-x-festival",
    title: "Cocktail X Festival",
    tags: [],
    cover: "/images/cocktail-x/cocktail-x-cover.jpg",
    animatedCover: "cocktail-x",
    gallery: [
      { video: "/images/cocktail-x/cocktail-x-rebranding.mp4", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-karten-zu-icons.mp4", portrait: true },
      { image: "/images/cocktail-x/cocktail-x-briefmarken.jpg", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-coaster.mp4", portrait: true },
      "/images/cocktail-x/cocktail-x-poster-mockup.jpg",
      { video: "/images/cocktail-x/cocktail-x-teaser.mp4", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-app-teaser.mp4", portrait: true },
      "/images/cocktail-x/cocktail-x-menu-karten.jpg",
      {
        row: [
          { video: "/images/cocktail-x/cocktail-x-tags-to-map.mp4", portrait: true },
          { video: "/images/cocktail-x/cocktail-x-carousel.mp4", portrait: true },
          { video: "/images/cocktail-x/cocktail-x-barvorstellungen.mp4", portrait: true },
        ],
      },
      "/images/cocktail-x/cocktail-x-matchbook-mockup.jpg",
    ],
  },
  {
    slug: "didamie",
    title: "Didamie",
    client: "Didamie",
    role: "Photography for the debut collection.",
    statement: "Didamie",
    subtitle: "Photography",
    services: ["Photography"],
    tags: ["Photography"],
    cover: "/images/didamie/didamie-titelbild.jpg",
    gallery: [
      "/images/didamie/didamie-01.jpg",
      "/images/didamie/didamie-02.jpg",
      { video: "/images/didamie/didamie-video.mp4", ratio: "1920 / 1080" },
      "/images/didamie/didamie-04.jpg",
      "/images/didamie/didamie-05.jpg",
      "/images/didamie/didamie-06.jpg",
      "/images/didamie/didamie-07.jpg",
      "/images/didamie/didamie-08.jpg",
      "/images/didamie/didamie-09.jpg",
      "/images/didamie/didamie-11.jpg",
      "/images/didamie/didamie-10.jpg",
      "/images/didamie/didamie-12.jpg",
      "/images/didamie/didamie-13.jpg",
      "/images/didamie/didamie-15.jpg",
      "/images/didamie/didamie-14.jpg",
    ],
  },
  {
    slug: "chop-chop-bloom",
    title: "Chop Chop Bloom",
    client: "Chop Chop Bloom",
    role: "Art direction & photography for the brand campaign.",
    statement: "What if gardening were sexy?",
    overview:
      "Chop Chop Bloom is an luxurious urban gardening brand, selling high quality secateurs. The idea of the brand is to give gardening a fashionable twist and enhance its fun and playful sides, while being extraordinarily chic doing so.",
    tags: ["Design & Branding", "Photography"],
    cover: "/images/chop-chop-bloom/chop-chop-bloom-cover.jpg",
    gallery: [
      { video: "/images/chop-chop-bloom/chop-chop-bloom-leder-cards.mp4", portrait: true },
      { video: "/images/chop-chop-bloom/chop-chop-bloom-cards.mp4", portrait: true },
      { video: "/images/chop-chop-bloom/chop-chop-bloom-garden-shears.mp4", portrait: true, ratio: "1 / 1" },
      { video: "/images/chop-chop-bloom/chop-chop-bloom-description.mp4", portrait: true, ratio: "1 / 1" },
      {
        carousel: [
          "/images/chop-chop-bloom/chop-chop-bloom-photo-1.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-2.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-3.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-4.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-5.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-6.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-7.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-8.jpg",
          "/images/chop-chop-bloom/chop-chop-bloom-photo-9.jpg",
        ],
        ratio: "4 / 5",
      },
      { video: "/images/chop-chop-bloom/chop-chop-bloom-illus.mp4", portrait: true },
      {
        row: ["/images/chop-chop-bloom/chop-chop-bloom-stationery.jpg", "/images/chop-chop-bloom/chop-chop-bloom-shears-detail.jpg"],
        cols: "1.5fr 1.291fr",
      },
      {
        row: [
          { video: "/images/chop-chop-bloom/chop-chop-bloom-film.mp4", portrait: true, ratio: "16 / 9" },
          {
            carousel: [
              { video: "/images/chop-chop-bloom/chop-chop-bloom-busy-lizzy-1.mp4" },
              { video: "/images/chop-chop-bloom/chop-chop-bloom-busy-lizzy-2.mp4" },
              { video: "/images/chop-chop-bloom/chop-chop-bloom-busy-lizzy-3.mp4" },
            ],
            ratio: "700 / 782",
          },
        ],
        cols: "1.778fr 0.895fr",
      },
    ],
  },
  {
    slug: "irmas-world",
    title: "Irma's World",
    client: "Irma's World",
    role: "Editorial design for a magazine project.",
    tags: ["Layout Design"],
    cover:
      "https://static.wixstatic.com/media/a138c8_053a0b7fce974f9fa968a1239e2bcf04~mv2.png/v1/fit/w_960,h_722,q_90/a138c8_053a0b7fce974f9fa968a1239e2bcf04~mv2.png",
  },
  {
    slug: "jolou-studio-vin-art",
    title: "JOLOUSTUDIO - Vin Art",
    client: "Jolou Studio",
    role: "Art direction & production of a product campaign.",
    tags: ["Design & Branding", "Photography"],
    cover:
      "https://static.wixstatic.com/media/a138c8_ff53095dbb1c4721b82065db4b108cf4~mv2.jpg/v1/fit/w_960,h_722,q_90/a138c8_ff53095dbb1c4721b82065db4b108cf4~mv2.jpg",
  },
  {
    slug: "jolou-studio-rainbow-collection",
    title: "JOLOUSTUDIO - Rainbow Collection",
    client: "Jolou Studio",
    role: "Art direction & film for a collection.",
    tags: ["Design & Branding", "Videography"],
    cover:
      "https://static.wixstatic.com/media/a138c8_006dd416138b4a60816aaf477290fd52~mv2.png/v1/fit/w_960,h_722,q_90/a138c8_006dd416138b4a60816aaf477290fd52~mv2.png",
  },
  {
    slug: "jolou-studio-valentines-day",
    title: "JOLOUSTUDIO - Valentine's Day",
    client: "Jolou Studio",
    role: "Art direction & film for a seasonal campaign.",
    tags: ["Design & Branding", "Videography"],
    cover:
      "https://static.wixstatic.com/media/a138c8_7adb3d2b6fd34d6dab88a0c0556c41cb~mv2.png/v1/fit/w_600,h_480,q_90/a138c8_7adb3d2b6fd34d6dab88a0c0556c41cb~mv2.png",
  },
];

// Projekt-Detailseiten brauchen etwas mehr Inhalt als die Grid-Ansicht
// (Overview-Text, Leistungen, mehrere Bilder). Statt das bei allen Projekten
// oben von Hand zu pflegen, werden fehlende Felder hier automatisch aus den
// vorhandenen Daten abgeleitet — trag bei einem Projekt "overview", "services"
// oder "gallery" ein, sobald du echten Content dafür hast, und der Platzhalter
// wird automatisch ersetzt.
export function getProjectBySlug(slug) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return undefined;

  return {
    ...project,
    statement:
      project.statement ||
      (project.role ? `${project.title} ${project.role}` : project.title),
    overview: project.overview || project.role,
    services: project.services || project.tags,
    gallery:
      project.gallery ||
      (project.cover ? [project.cover, project.cover, project.cover] : []),
  };
}

// Automatisch aus allen vorkommenden Tags gebildet — wächst mit, sobald du
// bei einem Projekt einen neuen Tag einträgst.
export const TAGS = Array.from(new Set(projects.flatMap((p) => p.tags)));

// Farbe eines Pill-Tags: Tags bekommen der Reihe nach Rot, Grün, Blau, Rosa;
// alles andere (z. B. Services) die Farbe an Position i.
export function tagColor(tag, i = 0) {
  const idx = TAGS.indexOf(tag);
  return BRAND_COLORS[(idx >= 0 ? idx : i) % BRAND_COLORS.length];
}

// Schrift auf der Pill-Farbe: dunkel auf Rosa, sonst weiß
export const tagTextColor = (color) => (color === PINK ? "#1f1f1f" : "#ffffff");
