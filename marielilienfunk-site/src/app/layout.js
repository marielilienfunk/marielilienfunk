import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";

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
    <html lang="de" className={notoSans.variable} suppressHydrationWarning>
      <head>
        {/* Intro nur beim ersten Aufruf pro Sitzung, nicht bei „Bewegung reduzieren“ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=document.documentElement;try{if(sessionStorage.getItem("mlf-intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches){h.classList.add("intro-seen")}else{h.classList.add("intro-active")}}catch(e){h.classList.add("intro-seen")}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Intro />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
