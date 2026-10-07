import type { CSSProperties, ReactNode } from "react";

/** Seamless infinite marquee. Children are rendered twice; the copy is hidden from assistive tech. */
export function Marquee({ children, duration = 40, className = "" }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="animate-marquee flex w-max" style={{ "--marquee-duration": `${duration}s` } as CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
