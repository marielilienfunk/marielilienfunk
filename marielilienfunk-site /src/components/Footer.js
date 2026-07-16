export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-black/60">
        <p>© {year} Marie-Lilien Funk</p>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/marielilienfunk/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/marie-lilien-funk-227440117/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
