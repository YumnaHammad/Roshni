"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronIcon } from "./icons";

export interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  dark: boolean;
}

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[78svh] min-h-[480px] max-h-[820px] overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, n) => (
        <div
          key={s.title}
          role="group"
          aria-roledescription="slide"
          aria-label={`${n + 1} of ${slides.length}`}
          aria-hidden={n !== i}
          inert={n !== i}
          className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={s.image} alt="" fill priority={n === 0} sizes="100vw" className={`object-cover object-[70%_center] transition-transform duration-[7000ms] ease-out ${n === i ? "scale-105" : "scale-100"}`} />
          <div className={`absolute inset-0 ${s.dark ? "bg-linear-to-t from-black/85 via-black/45 to-black/10 sm:bg-linear-to-r sm:from-black/60 sm:via-black/25 sm:to-transparent" : "bg-linear-to-t from-ivory via-ivory/70 to-ivory/10 sm:bg-linear-to-r sm:from-ivory/85 sm:via-ivory/35 sm:to-transparent"}`} />
          <div className={`relative mx-auto flex h-full max-w-360 flex-col justify-end px-5 pb-20 sm:justify-center sm:px-10 sm:pb-0 ${s.dark ? "text-ivory" : "text-ink"}`}>
            <div className={n === i ? "animate-fade-up" : ""}>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] sm:text-sm">{s.eyebrow}</p>
              <h2 className="max-w-xl font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">{s.title}</h2>
              <p className="mt-5 max-w-md text-base opacity-90 sm:text-lg">{s.text}</p>
              <Link
                href={s.cta.href}
                className={`mt-8 inline-block px-10 py-4 text-xs uppercase tracking-[0.22em] ${s.dark ? "bg-ivory text-ink hover:bg-gold hover:text-ivory" : "bg-ink text-ivory hover:bg-henna"}`}
              >
                {s.cta.label}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/25 px-3 backdrop-blur-sm">
        {slides.map((s, n) => (
          <button key={s.title} type="button" onClick={() => go(n)} aria-label={`Go to slide ${n + 1}: ${s.title}`} aria-current={n === i} className="grid h-11 w-8 place-items-center">
            <span className="relative block h-0.5 w-8 overflow-hidden bg-white/40">
              {n === i && <span key={i} className={`absolute inset-0 origin-left bg-white ${paused ? "scale-x-0" : "animate-progress"}`} />}
            </span>
          </button>
        ))}
      </div>
      {([-1, 1] as const).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => go(i + d)}
          aria-label={d === 1 ? "Next slide" : "Previous slide"}
          className={`absolute bottom-5 hidden h-11 w-11 place-items-center rounded-full bg-white/85 text-ink hover:bg-white md:grid ${d === 1 ? "left-20 sm:left-24" : "left-6 sm:left-10"}`}
        >
          <ChevronIcon className={d === -1 ? "rotate-180" : ""} />
        </button>
      ))}
    </section>
  );
}
