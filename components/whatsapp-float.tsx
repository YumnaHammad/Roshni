"use client";

import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;
  return (
    <a
      href={whatsappUrl("Hi Roshni! I have a question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className={`fixed right-5 z-40 ${pathname.startsWith("/product/") ? "bottom-24 lg:bottom-5" : "bottom-5"} grid h-14 w-14 place-items-center rounded-full bg-[#1f7a4d] text-white shadow-lg transition-transform hover:scale-105`}
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
