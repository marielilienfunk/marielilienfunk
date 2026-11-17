import { projects } from "@/data/projects";
import ProjectGrid from "@/components/ProjectGrid";
import SkillsCarousel from "@/components/SkillsCarousel";
import HeroLogo from "@/components/HeroLogo";
import LineReveal from "@/components/LineReveal";

const CLIENTS = ["Chop Chop Bloom", "Jolou Studio", "Irma's World", "Chateau de Brantes"];

export default function HomePage() {
  return (
    <div>
      <HeroLogo />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6">
        <LineReveal
          className="font-sans font-light text-ink text-center text-xl sm:text-[1.6rem] lg:text-[1.8rem] leading-[1.35] max-w-[36rem] mx-auto"
          text="I am a multidisciplinary designer specialised in Art Direction, Photography & Film. With a curious and open mind I gain insights into the worlds around me, creating authentic and compelling stories for my clients their brands & their products."
        />
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
          <p className="font-sans font-light text-lg">Let’s create something together.</p>
          <a
            href="mailto:hello@marielilienfunk.com"
            className="inline-block px-5 py-2.5 bg-ink text-paper text-sm tracking-wide"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  );
}
