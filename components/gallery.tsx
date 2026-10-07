"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setActive(i);
  };

  // Native scroll-snap gives swipe on touch; keep the active thumbnail in sync.
  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse">
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex aspect-[4/5] flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl bg-sand"
        aria-roledescription="carousel"
        aria-label={`${alt} images`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(Math.min(images.length - 1, active + 1));
          if (e.key === "ArrowLeft") go(Math.max(0, active - 1));
        }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
            <Image src={src} alt={i === 0 ? alt : `${alt}, detail ${i}`} fill priority={i === 0} sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
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
            className={`relative h-20 w-16 overflow-hidden rounded-md border-2 transition-opacity ${active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
