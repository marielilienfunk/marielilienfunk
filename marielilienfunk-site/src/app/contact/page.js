export const metadata = { title: "Kontakt — Marie-Lilien Funk" };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-sans font-medium text-3xl mb-6">Kontakt</h1>
      <p className="text-black/70 mb-8 leading-relaxed">
        Für Anfragen zu Projekten in Design &amp; Branding, Fotografie,
        Videografie oder Layout Design melde dich gerne direkt per Mail.
      </p>
      <a
        href="mailto:hello@marielilienfunk.com"
        className="inline-block px-5 py-2.5 bg-ink text-paper text-sm tracking-wide"
      >
        hello@marielilienfunk.com
      </a>
      <p className="text-sm text-black/40 mt-4">
        (Mail-Adresse hier bitte durch deine echte Adresse ersetzen.)
      </p>
    </div>
  );
}
