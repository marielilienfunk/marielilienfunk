import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ClickConfetti from "@/components/ClickConfetti";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-noto",
});
export const metadata = {
  title: "Marie-Lilien Funk — Design, Photography, Film",
  description:
    "Multidisciplinary designer: art direction, visual identity, photography and film for brands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <head>
        {/* Startseite: Header-Logo ausblenden, bevor das große Logo (HeroLogo) da ist */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(location.pathname==="/")document.documentElement.classList.add("logo-big");`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ClickConfetti />
      </body>
    </html>
  );
}
