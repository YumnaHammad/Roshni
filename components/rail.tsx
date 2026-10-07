"use client";

import { useRef, type ReactNode } from "react";
import { ChevronIcon } from "./icons";

/** Horizontal scroll-snap carousel with arrow buttons on desktop and swipe on touch. */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <ul ref={ref} aria-label={label} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0">
        {children}
      </ul>
      {([-1, 1] as const).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => scroll(d)}
          aria-label={d === 1 ? "Scroll right" : "Scroll left"}
          className={`absolute top-[38%] hidden h-11 w-11 place-items-center rounded-full bg-ivory shadow-md hover:bg-ink hover:text-ivory lg:grid ${d === 1 ? "-right-5" : "-left-5"}`}
        >
          <ChevronIcon className={d === -1 ? "rotate-180" : ""} />
        </button>
      ))}
    </div>
  );
}

export const railItem = "w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-18px)]";
