export const metadata = { title: "About — Marie-Lilien Funk" };

const DISCIPLINES = [
  {
    name: "Design & Branding",
    text: "Visuelle Identität, Art Direction und Markenstrategie — von der Idee bis zum fertigen System.",
  },
  {
    name: "Fotografie",
    text: "Editorial-, Produkt- und Portraitfotografie für Kampagnen und Publikationen.",
  },
  {
    name: "Videografie",
    text: "Kurzfilme und Kampagnenfilme, konzipiert und produziert im gleichen visuellen System.",
  },
  {
    name: "Layout Design",
    text: "Editorial- und Print-Layouts für Magazine und Publikationen.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-sans font-medium text-3xl mb-6">About</h1>
      <p className="text-black/70 mb-10 leading-relaxed">
        Ich bin eine multidisziplinäre Designerin mit Fokus auf Art Direction,
        Fotografie und Film. Mit einem neugierigen und offenen Blick gehe ich
        auf die Welt zu, in der sich meine Kunden und ihre Marken bewegen, und
        entwickle daraus authentische, stimmige Geschichten — visuell konsequent
        über alle Formate hinweg.
      </p>

      <h2 className="text-sm tracking-widest text-black/50 mb-4">
        Disziplinen
      </h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {DISCIPLINES.map((d) => (
          <div key={d.name}>
            <h3 className="font-sans font-medium text-lg mb-1">{d.name}</h3>
            <p className="text-black/60 text-sm leading-relaxed">{d.text}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm tracking-widest text-black/50 mb-4">
        Arbeitsweise
      </h2>
      <p className="text-black/70 leading-relaxed">
        Konzept → Produktion → Post-Production. Jedes Projekt startet mit der
        Frage, was eine Marke ausmacht — Bild, Bewegtbild und Layout sind für
        mich Werkzeuge, nicht Ausgangspunkt.
      </p>
    </div>
  );
}
