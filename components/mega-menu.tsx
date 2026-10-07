"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

/** Desktop mega menu: opens on hover or keyboard focus, closes on Escape, link click and page change. */
export function MegaMenu({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname; // auto-closes when the route changes

  return (
    <li
      onMouseEnter={() => setOpenOn(pathname)}
      onMouseLeave={() => setOpenOn(null)}
      onFocus={() => setOpenOn(pathname)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpenOn(null)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpenOn(null);
          (e.currentTarget.querySelector("a") as HTMLElement | null)?.focus();
        }
      }}
      onClick={(e) => (e.target as HTMLElement).closest("a") && setOpenOn(null)}
    >
      <Link href={href} className="block py-3.5 hover:text-henna" aria-expanded={open}>
        {label}
      </Link>
      <div
        className={`absolute inset-x-0 top-full border-y border-line bg-ivory shadow-lg transition-[opacity,transform] duration-200 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
      >
        {children}
      </div>
    </li>
  );
}
