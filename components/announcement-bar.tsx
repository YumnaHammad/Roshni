"use client";

import { useEffect, useState } from "react";

const messages = [
  "Free delivery on orders over Rs 5,000",
  "Cash on Delivery across Pakistan",
  "New Festive edit is live. Up to 40% off selected styles",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-9 overflow-hidden bg-ink text-ivory" role="region" aria-label="Announcements">
      {messages.map((m, n) => (
        <p
          key={m}
          aria-hidden={n !== i}
          className={`absolute inset-0 grid place-items-center px-4 text-center text-xs tracking-wide transition-[opacity,transform] duration-500 sm:text-[13px] ${n === i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        >
          {m}
        </p>
      ))}
    </div>
  );
}
