"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function PlaygroundGallery({ images }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((src, i) => (
        <Reveal key={`${src}-${i}`} delay={(i % 6) * 0.05}>
          <div className="relative aspect-square overflow-hidden bg-black/5">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
