import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-noto",
});

export const metadata = {
  title: "Marie-Lilien Funk — Design, Fotografie, Film",
  description:
    "Multidisziplinäre Designerin: Art Direction, Visuelle Identität, Fotografie und Film für Marken.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={notoSans.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
