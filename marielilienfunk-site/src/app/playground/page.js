import { projects } from "@/data/projects";
import PlaygroundGallery from "@/components/PlaygroundGallery";

export const metadata = { title: "Playground — Marie-Lilien Funk" };

// Platzhalter: zeigt vorerst die vorhandenen Projektbilder. Sobald du eigene
// Playground-Fotos hast, hier einfach ein eigenes Array mit Bild-URLs
// eintragen und PlaygroundGallery damit füttern.
const images = projects.map((p) => p.cover).filter(Boolean);

export default function PlaygroundPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-sans font-medium text-3xl mb-10">Playground</h1>
      <PlaygroundGallery images={images} />
    </div>
  );
}
