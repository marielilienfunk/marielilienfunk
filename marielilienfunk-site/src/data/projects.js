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
    role: "Entwicklung der visuellen Identität.",
    tags: ["Design & Branding"],
    cover:
      "https://static.wixstatic.com/media/a138c8_6908d89c67b24098be6cffe8fdd9545d~mv2.png/v1/fit/w_960,h_722,q_90/a138c8_6908d89c67b24098be6cffe8fdd9545d~mv2.png",
  },
  {
    slug: "cocktail-x-festival",
    title: "Cocktail X Festival",
    tags: [],
    cover: "/images/cocktail-x/cocktail-x-cover.jpg",
    gallery: [
      { video: "/images/cocktail-x/cocktail-x-rebranding.mp4", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-karten-zu-icons.mp4", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-teaser.mp4", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-app-teaser.mp4", portrait: true },
      "/images/cocktail-x/cocktail-x-poster-mockup.jpg",
      { video: "/images/cocktail-x/cocktail-x-tags-to-map.mp4", portrait: true },
      { video: "/images/cocktail-x/cocktail-x-carousel.mp4", portrait: true },
      "/images/cocktail-x/cocktail-x-menu-karten.jpg",
      "/images/cocktail-x/cocktail-x-matchbook-mockup.jpg",
    ],
  },
  {
    slug: "didamie",
    title: "Didamie",
    client: "Didamie",
    role: "Fotografie für die Debütkollektion.",
    statement: "Didamie",
    subtitle: "Photography",
    services: ["Photography"],
    tags: ["Fotografie"],
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
    role: "Art Direction & Photography für die Markenkampagne.",
    statement: "What if gardening were sexy?",
    overview:
      "Chop Chop Bloom is an luxurious urban gardening brand, selling high quality secateurs. The idea of the brand is to give gardening a fashionable twist and enhance its fun and playful sides, while being extraordinarily chic doing so.",
    tags: ["Design & Branding", "Fotografie"],
    cover:
      "https://static.wixstatic.com/media/a138c8_50869fc9c53e45999969921c1dda21a8~mv2.jpg/v1/fit/w_960,h_722,q_90/a138c8_50869fc9c53e45999969921c1dda21a8~mv2.jpg",
  },
  {
    slug: "irmas-world",
    title: "Irma's World",
    client: "Irma's World",
    role: "Editorial Design für ein Magazin-Projekt.",
    tags: ["Layout Design"],
    cover:
      "https://static.wixstatic.com/media/a138c8_053a0b7fce974f9fa968a1239e2bcf04~mv2.png/v1/fit/w_960,h_722,q_90/a138c8_053a0b7fce974f9fa968a1239e2bcf04~mv2.png",
  },
  {
    slug: "jolou-studio-vin-art",
    title: "JOLOUSTUDIO - Vin Art",
    client: "Jolou Studio",
    role: "Art Direction & Produktion einer Produktkampagne.",
    tags: ["Design & Branding", "Fotografie"],
    cover:
      "https://static.wixstatic.com/media/a138c8_ff53095dbb1c4721b82065db4b108cf4~mv2.jpg/v1/fit/w_960,h_722,q_90/a138c8_ff53095dbb1c4721b82065db4b108cf4~mv2.jpg",
  },
  {
    slug: "jolou-studio-rainbow-collection",
    title: "JOLOUSTUDIO - Rainbow Collection",
    client: "Jolou Studio",
    role: "Art Direction & Film für eine Kollektion.",
    tags: ["Design & Branding", "Videografie"],
    cover:
      "https://static.wixstatic.com/media/a138c8_006dd416138b4a60816aaf477290fd52~mv2.png/v1/fit/w_960,h_722,q_90/a138c8_006dd416138b4a60816aaf477290fd52~mv2.png",
  },
  {
    slug: "jolou-studio-valentines-day",
    title: "JOLOUSTUDIO - Valentine's Day",
    client: "Jolou Studio",
    role: "Art Direction & Film für eine Saisonkampagne.",
    tags: ["Design & Branding", "Videografie"],
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
