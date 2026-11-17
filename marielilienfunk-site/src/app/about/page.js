export const metadata = { title: "About — Marie-Lilien Funk" };

const DISCIPLINES = [
  {
    name: "Design & Branding",
    text: "Visual identity, art direction and brand strategy — from the first idea to the finished system.",
  },
  {
    name: "Photography",
    text: "Editorial, product and portrait photography for campaigns and publications.",
  },
  {
    name: "Videography",
    text: "Short films and campaign films, conceived and produced within the same visual system.",
  },
  {
    name: "Layout Design",
    text: "Editorial and print layouts for magazines and publications.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-sans font-light text-3xl mb-6">About</h1>
      <p className="text-black/70 mb-10 leading-relaxed">
        I am a multidisciplinary designer focused on art direction, photography
        and film. With a curious and open mind I explore the worlds my clients
        and their brands live in, and turn them into authentic, coherent
        stories — visually consistent across every format.
      </p>

      <h2 className="text-sm tracking-widest text-black/50 mb-4">
        Disciplines
      </h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {DISCIPLINES.map((d) => (
          <div key={d.name}>
            <h3 className="font-sans font-light text-lg mb-1">{d.name}</h3>
            <p className="text-black/60 text-sm leading-relaxed">{d.text}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm tracking-widest text-black/50 mb-4">
        Approach
      </h2>
      <p className="text-black/70 leading-relaxed">
        Concept → production → post-production. Every project starts with the
        question of what makes a brand — stills, moving image and layout are
        tools for me, not the starting point.
      </p>
    </div>
  );
}
