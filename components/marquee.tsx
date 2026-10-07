import type { CSSProperties, ReactNode } from "react";

/** Seamless infinite marquee. Children render twice; the copy is hidden from assistive tech and keyboard. */
export function Marquee({ children, duration = 40, reverse = false, className = "" }: { children: ReactNode; duration?: number; reverse?: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as CSSProperties}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
