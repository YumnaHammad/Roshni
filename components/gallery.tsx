"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = (i: number) => setActive(Math.max(0, Math.min(images.length - 1, i)));

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:items-start">
      <div
        className="relative aspect-4/5 min-w-0 flex-1 overflow-hidden bg-sand lg:max-h-[calc(100svh-11rem)]"
        aria-roledescription="carousel"
        aria-label={`${alt} images`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
        // Swipe on touch devices.
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt}, detail ${i}`}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 45vw, 100vw"
            aria-hidden={active !== i}
            className={`object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      <div className="flex gap-3 md:flex-col" role="group" aria-label="Choose image">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show image ${i + 1}`}
            aria-current={active === i}
            className={`relative h-24 w-[76px] shrink-0 overflow-hidden border-2 transition-opacity ${active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="76px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
