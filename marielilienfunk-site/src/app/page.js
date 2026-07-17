import Image from "next/image";
import { projects } from "@/data/projects";
import ProjectGrid from "@/components/ProjectGrid";
import SkillsCarousel from "@/components/SkillsCarousel";

const CLIENTS = ["Chop Chop Bloom", "Jolou Studio", "Irma's World", "Chateau de Brantes"];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14">
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-black/5 mb-10">
          <Image
            src={projects[0].cover}
            alt={projects[0].title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <p className="font-sans font-light text-xl sm:text-2xl max-w-2xl leading-snug">
          Ich entwickle visuelle Identitäten für Marken — von Art Direction und
          Design über Fotografie bis Film. Eine Handschrift, konsequent über
          alle Formate hinweg.
        </p>
      </section>

      {/* Portfolio */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <ProjectGrid projects={projects} />
      </section>

      {/* Skills */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-sm tracking-widest text-black/50 mb-6">Skills</h2>
        <SkillsCarousel />
      </section>

      {/* Selected clients */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-sm tracking-widest text-black/50 mb-6">
          Selected Clients
        </h2>
        <div className="flex flex-wrap gap-x-10 gap-y-3 font-sans font-light text-lg text-black/70">
          {CLIENTS.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="border-t border-black/10 pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-sans font-light text-lg">Lust auf ein gemeinsames Projekt?</p>
          <a
            href="mailto:hello@marielilienfunk.com"
            className="inline-block px-5 py-2.5 bg-ink text-paper text-sm tracking-wide"
          >
            Kontakt aufnehmen
          </a>
        </div>
      </section>
    </div>
  );
}
