import Link from "next/link";
import Logo from "./Logo";

// Logo mittig in der Leiste, Menü rechts; auf dem Handy steht das Menü darunter
export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 px-6 py-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:py-5">
        <div className="hidden sm:block" />
        <Link
          href="/"
          className="block w-[190px] sm:w-[220px] lg:w-[250px] text-ink"
          data-header-logo
          aria-label="Marie-Lilien Funk – Home"
        >
          <Logo className="block w-full h-auto" />
        </Link>
        <nav className="flex items-center justify-center sm:justify-end gap-6 sm:gap-8 text-[13px] sm:text-sm tracking-wider">
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
