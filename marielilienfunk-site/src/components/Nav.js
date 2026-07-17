import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-sans font-medium text-lg tracking-wide">
          Marie-Lilien Funk
        </Link>
        <nav className="flex items-center gap-8 text-sm tracking-wider">
          <Link href="/" className="hover:text-accent transition-colors">
            Work
          </Link>
          <Link href="/playground" className="hover:text-accent transition-colors">
            Playground
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
