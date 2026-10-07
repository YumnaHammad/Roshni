"use client";

import { useEffect, useState } from "react";

const units = [
  ["Days", 86_400_000],
  ["Hours", 3_600_000],
  ["Mins", 60_000],
  ["Secs", 1000],
] as const;

/** Live countdown. Renders "--" on the server and first paint (same markup, no hydration mismatch). */
export function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  const left = now === null ? null : Math.max(0, new Date(to).getTime() - now);
  const values = units.map(([, ms], i) =>
    left === null
      ? null
      : Math.floor((i === 0 ? left : left % units[i - 1][1]) / ms),
  );
  return (
    <div
      className="flex gap-3 sm:gap-4"
      role="timer"
      aria-label="Time left in the sale"
    >
      {units.map(([label], i) => {
        const v = values[i];
        return (
          <div
            key={label}
            className="w-16 border border-[#e2b25a]/50 py-3 text-center sm:w-20"
          >
            <span className="block font-serif text-3xl tabular-nums sm:text-4xl">
              {v === null ? "--" : String(v).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
