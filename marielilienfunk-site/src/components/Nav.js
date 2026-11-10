import Link from "next/link";
import Logo from "./Logo";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="block min-w-0 flex-1 text-ink" data-header-logo aria-label="Marie-Lilien Funk – Startseite">
          <Logo className="block w-full h-auto max-w-[190px] sm:max-w-[220px] lg:max-w-[250px]" />
        </Link>
        <nav className="flex shrink-0 items-center gap-4 sm:gap-8 text-[13px] sm:text-sm tracking-wider">
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
