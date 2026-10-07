"use client";

import { useState } from "react";

/** No backend: confirms locally. Swap the submit handler for your email provider's API later. */
export function Newsletter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [done, setDone] = useState(false);
  const dark = tone === "dark";
  if (done) {
    return (
      <p role="status" className={dark ? "text-ivory" : ""}>
        Thank you. You&apos;ll be the first to hear about new drops and sales.
      </p>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex w-full max-w-md"
    >
      <label htmlFor={`newsletter-${tone}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-${tone}`}
        type="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        className={`h-12 min-w-0 flex-1 border px-4 outline-none ${dark ? "border-ivory/40 bg-transparent text-ivory placeholder:text-ivory/60" : "border-ink bg-white"}`}
      />
      <button type="submit" className={`h-12 shrink-0 px-6 text-xs uppercase tracking-[0.2em] ${dark ? "bg-ivory text-ink hover:bg-gold hover:text-ivory" : "bg-ink text-ivory hover:bg-henna"}`}>
        Subscribe
      </button>
    </form>
  );
}
