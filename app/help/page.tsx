import type { Metadata } from "next";
import Link from "next/link";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Help & FAQs",
  description: "Shipping, exchanges, how to order on WhatsApp, fabric length guide and frequently asked questions.",
  alternates: { canonical: "/help" },
};

const sections = [
  { id: "shipping", title: "Shipping & delivery" },
  { id: "returns", title: "Exchange & returns" },
  { id: "ordering", title: "How to order" },
  { id: "lengths", title: "Fabric length guide" },
  { id: "faq", title: "FAQs" },
];

const faqs = [
  { q: "Do you deliver outside Pakistan?", a: "Not yet. We currently deliver to every city in Pakistan. Message us on WhatsApp if you would like us to arrange international shipping." },
  { q: "Are the colours accurate?", a: "We photograph every fabric in daylight, but screens vary. Ask us on WhatsApp for an extra video of any fabric before ordering." },
  { q: "Can I change my order after placing it?", a: "Yes. Reply to your WhatsApp order message before it is dispatched and we will update it." },
  { q: "Is the dupatta length fixed?", a: "Yes. Dupattas are 2.5m and trousers are 2.5m. Only the shirt length changes with the length option you choose." },
  { q: "Do you offer stitching?", a: "We sell unstitched fabric only, so your tailor can make it exactly your way." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Customer care</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Help &amp; FAQs</h1>

      <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="border border-line bg-white px-4 py-2 text-sm hover:border-ink">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-14 space-y-16 leading-relaxed text-muted [&_h2]:mb-4 [&_h2]:scroll-mt-40 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-ink">
        <section>
          <h2 id="shipping">Shipping &amp; delivery</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Delivery in 3–5 working days to all major cities, and 5–7 days to other areas.</li>
            <li>Free delivery on orders over Rs 5,000. Otherwise a flat Rs 250.</li>
            <li>Orders confirmed before 4pm are dispatched the same day.</li>
            <li>You&apos;ll receive a tracking number on WhatsApp once your parcel ships.</li>
          </ul>
        </section>

        <section>
          <h2 id="returns">Exchange &amp; returns</h2>
          <p>
            Unused, uncut and unwashed fabric can be exchanged within 7 days of delivery. Message us on WhatsApp with your order number to arrange it. Sale items can be exchanged but not refunded. If a fabric arrives damaged, we&apos;ll replace it free of charge.
          </p>
        </section>

        <section>
          <h2 id="ordering">How to order</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Choose your fabric, shirt length and quantity, then add to bag.</li>
            <li>At checkout, enter your delivery details. Payment is Cash on Delivery.</li>
            <li>WhatsApp opens with your full order. Press send.</li>
            <li>We confirm on WhatsApp within a few hours and dispatch your parcel.</li>
          </ol>
          <p className="mt-3">You can also tap &ldquo;Order on WhatsApp&rdquo; on any product to order directly.</p>
        </section>

        <section>
          <h2 id="lengths">Fabric length guide</h2>
          <p className="mb-5">The length option sets the shirt fabric. Use this as a starting point and check with your tailor.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <caption className="sr-only">Recommended shirt fabric length by style</caption>
              <thead>
                <tr className="border-b border-ink text-ink">
                  <th scope="col" className="py-3 pr-4 font-medium">Length</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Best for</th>
                  <th scope="col" className="py-3 font-medium">Approx. shirt length</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["2.5m", "Short or straight kurta, sizes XS–M", "Up to 38\""],
                  ["3m", "Standard kameez, sizes M–XL, or short sleeves with extras", "Up to 44\""],
                  ["4m", "Long kalidar, A-line or angrakha cuts, and sizes XL+", "Up to 52\""],
                ].map(([l, use, len]) => (
                  <tr key={l} className="border-b border-line">
                    <th scope="row" className="py-3 pr-4 font-medium text-ink">{l}</th>
                    <td className="py-3 pr-4">{use}</td>
                    <td className="py-3">{len}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 id="faq">FAQs</h2>
          <div className="border-t border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-ink">
                  {f.q}
                  <span className="text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="pb-5">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-sand p-8 text-center">
          <h2 className="!mb-2">Still need help?</h2>
          <p>Our team replies on WhatsApp Mon–Sat, 10am–8pm.</p>
          <a href={whatsappUrl("Hi Roshni! I need help with…")} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block bg-ink px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ivory hover:bg-henna">
            Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="mt-4 text-sm">
            or <Link href="/collections" className="underline underline-offset-4">continue shopping</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
