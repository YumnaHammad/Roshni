"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ChevronIcon, CloseIcon, MenuIcon } from "./icons";
import { mainNav, megaColumns } from "./nav-data";
import { useFocusTrap } from "./use-focus-trap";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(panel, open, close);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand lg:hidden">
        <MenuIcon />
      </button>
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} inert={!open}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={close} aria-hidden="true" />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="font-serif text-2xl">Roshni</span>
            <button type="button" onClick={close} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand" data-autofocus>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-2">
            <ul className="divide-y divide-line">
              {mainNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} onClick={close} className={`flex items-center justify-between py-4 text-[15px] uppercase tracking-wider ${n.highlight ? "text-henna" : ""}`}>
                    {n.label}
                    <ChevronIcon width={16} height={16} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
            {megaColumns.slice(1).map((col) => (
              <details key={col.title} className="group border-t border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] uppercase tracking-wider">
                  {col.title}
                  <ChevronIcon width={16} height={16} className="text-muted transition-transform group-open:rotate-90" />
                </summary>
                <ul className="pb-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={close} className="block py-2.5 pl-3 text-muted hover:text-henna">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <Link href="/help" onClick={close} className="block border-t border-line py-4 text-[15px] uppercase tracking-wider">
              Help &amp; FAQs
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
