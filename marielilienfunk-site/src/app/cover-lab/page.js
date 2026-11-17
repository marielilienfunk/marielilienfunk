import CocktailXCover from "@/components/CocktailXCover";
import { CoverStamps, CoverPattern, CoverMorph, CoverPop, CoverCircles } from "@/components/CocktailXCoverVariants";

export const metadata = { title: "Cover Lab", robots: { index: false } };

const VARIANTS = [
  ["A – Wandernde Icons", CocktailXCover],
  ["B – Briefmarken-Raster", CoverStamps],
  ["C – Muster mit Label", CoverPattern],
  ["D – Stern wird zum Icon", CoverMorph],
  ["E – Icons poppen im Hintergrund", CoverPop],
  ["F – Kugel-Muster", CoverCircles],
];

export default function CoverLab() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 sm:grid-cols-2">
      {VARIANTS.map(([name, Cover]) => (
        <div key={name} className="group">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Cover />
          </div>
          <p className="mt-3 font-light">{name}</p>
        </div>
      ))}
    </div>
  );
}
