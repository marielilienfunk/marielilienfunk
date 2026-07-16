import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Marie-Lilien Funk — Design, Fotografie, Film",
  description:
    "Multidisziplinäre Designerin: Art Direction, Visuelle Identität, Fotografie und Film für Marken.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
