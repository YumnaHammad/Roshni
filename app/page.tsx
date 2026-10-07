import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { HeroSlider, type Slide } from "@/components/hero-slider";
import {
  CashIcon,
  ExchangeIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { Newsletter } from "@/components/newsletter";
import { ProductTabs } from "@/components/product-tabs";
import {
  collections,
  fabrics,
  getBestsellers,
  getCollectionProducts,
  getNewArrivals,
  getSale,
  products,
  salePrice,
} from "@/lib/data";
import { formatPrice } from "@/lib/format";

const slides: Slide[] = [
  {
    image: "/banners/hero-festive.svg",
    eyebrow: "Festive '26",
    title: "Nights of Gold",
    text: "Chiffon and organza in maroon, emerald and silver, with zari and dabka work made for Eid and wedding season.",
    cta: { label: "Shop Festive", href: "/collections/festive" },
    dark: true,
  },
  {
    image: "/banners/hero-lawn.svg",
    eyebrow: "Summer Lawn Vol. II",
    title: "Prints in Bloom",
    text: "Light lawn printed in champa, gulnar and indigo, with 3-piece sets from Rs 3,250.",
    cta: { label: "Shop Lawn", href: "/collections/summer-lawn" },
    dark: false,
  },
  {
    image: "/banners/hero-winter.svg",
    eyebrow: "Winter Pre-Launch",
    title: "Woven Warmth",
    text: "Khaddar, jacquard and cotton silk in charcoal, camel and plum. Now in store.",
    cta: { label: "Shop Winter", href: "/collections/winter" },
    dark: true,
  },
];

const usps = [
  { icon: TruckIcon, title: "Nationwide delivery", text: "3–5 working days" },
  { icon: CashIcon, title: "Cash on Delivery", text: "Pay when it arrives" },
  { icon: ExchangeIcon, title: "Easy exchange", text: "Within 7 days" },
  { icon: ShieldIcon, title: "Quality checked", text: "Every metre inspected" },
];

const reviews = [
  {
    name: "Mahnoor A.",
    city: "Lahore",
    text: "The Gulnar lawn is even softer in person. Print colours stayed perfect after three washes.",
    product: "Gulnar Printed Lawn",
  },
  {
    name: "Sana R.",
    city: "Karachi",
    text: "I ordered on WhatsApp at night and it was confirmed by morning. The Roshan chiffon was the star of my sister's mehndi.",
    product: "Roshan Chiffon",
  },
  {
    name: "Hira K.",
    city: "Islamabad",
    text: "Exactly the length I needed, with no wastage. The khaddar is thick and warm, and my tailor loved working with it.",
    product: "Kohsar Khaddar",
  },
  {
    name: "Ayesha M.",
    city: "Multan",
    text: "Cash on delivery made it so easy for my mother to order. The embroidery is neat and the thread doesn't pull.",
    product: "Kesar Embroidered Lawn",
  },
  {
    name: "Fatima Z.",
    city: "Peshawar",
    text: "The organza dupatta is light but holds its shape. I got so many compliments at the walima.",
    product: "Shaam Organza",
  },
  {
    name: "Zainab T.",
    city: "Faisalabad",
    text: "Packed beautifully and arrived in three days. The colour is exactly as shown.",
    product: "Champa Printed Lawn",
  },
];

function SectionTitle({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <h2 id={id} className="font-serif text-4xl sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  const fabricImages = fabrics.map((f) => ({
    fabric: f,
    product: products.find((p) => p.fabric === f)!,
  }));
  const lookbook = [11, 0, 15, 7, 17, 5].map((i) => products[i]);

  return (
    <>
      <HeroSlider slides={slides} />

      <Marquee duration={45} className="bg-henna py-3.5 text-ivory">
        {[
          ...fabrics,
          "Cash on Delivery",
          "Cut to your length",
          "Made in Pakistan",
        ].map((t) => (
          <span
            key={t}
            className="flex items-center gap-8 pr-8 text-xs uppercase tracking-[0.3em] sm:text-sm"
          >
            {t}
            <span className="text-[#e2b25a]" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </Marquee>

      <section
        aria-label="Why shop with us"
        className="border-b border-line bg-sand"
      >
        <ul className="mx-auto grid max-w-360 grid-cols-2 gap-y-6 px-4 py-7 sm:px-6 lg:grid-cols-4">
          {usps.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex items-center justify-center gap-3 text-left"
            >
              <Icon width={28} height={28} className="shrink-0 text-gold" />
              <span>
                <span className="block text-[13px] font-medium uppercase tracking-wider">
                  {title}
                </span>
                <span className="block text-xs text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="cat-heading"
        className="mx-auto max-w-360 px-4 pt-20 sm:px-6"
      >
        <SectionTitle
          eyebrow="Unstitched"
          title="Shop by Collection"
          id="cat-heading"
        />
        <ul className="reveal grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="group relative block aspect-3/4 overflow-hidden bg-sand"
              >
                <Image
                  src={getCollectionProducts(c.slug)[0].images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-ivory sm:p-6">
                  <p className="font-serif text-2xl sm:text-3xl">{c.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] opacity-90 transition-transform group-hover:translate-x-1">
                    Shop now →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="sale-heading"
        className="relative mt-24 overflow-hidden bg-henna text-ivory"
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#e2b25a]/30"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full border border-[#e2b25a]/20"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-360 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.3em] text-[#e2b25a]">
              Limited time · Festive Sale
            </p>
            <h2
              id="sale-heading"
              className="mt-4 font-serif text-5xl leading-none sm:text-7xl"
            >
              Up to <span className="text-[#e2b25a]">40%</span> off
            </h2>
            <p className="mt-5 max-w-md text-ivory/85">
              Chiffon, organza and embroidered lawn at their lowest prices of
              the year. Ends 31 October.
            </p>
            <div className="mt-8">
              <Countdown to="2026-10-31T23:59:59+05:00" />
            </div>
            <Link
              href="/collections/sale"
              className="mt-10 inline-block bg-[#e2b25a] px-10 py-4 text-xs uppercase tracking-[0.22em] text-ink hover:bg-ivory"
            >
              Shop the Sale
            </Link>
          </div>
          <ul className="reveal grid grid-cols-3 gap-3 sm:gap-4">
            {getSale(3).map((p, i) => (
              <li key={p.slug} className={i === 1 ? "translate-y-8" : ""}>
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-3/4 overflow-hidden bg-ivory/10">
                    <Image
                      src={p.images[0]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 15vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 bg-[#e2b25a] px-2 py-0.5 text-[11px] font-medium text-ink">
                      -{p.discount}%
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm">{p.name}</p>
                  <p className="text-xs tabular-nums">
                    {formatPrice(salePrice(p.lengths[0].price, p.discount))}{" "}
                    <s className="opacity-75">
                      {formatPrice(p.lengths[0].price)}
                    </s>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="mx-auto max-w-360 px-4 pt-24 sm:px-6"
      >
        <SectionTitle
          eyebrow="Just landed"
          title="This Season's Edit"
          id="featured-heading"
        />
        <div className="reveal">
          <ProductTabs
            tabs={[
              {
                id: "new",
                label: "New In",
                href: "/collections/new-arrivals",
                products: getNewArrivals(),
              },
              {
                id: "best",
                label: "Best Sellers",
                href: "/collections?sort=bestsellers",
                products: getBestsellers(),
              },
              {
                id: "sale",
                label: "Sale",
                href: "/collections/sale",
                products: getSale(),
              },
            ]}
          />
        </div>
      </section>

      <section
        aria-label="Editorial"
        className="reveal mx-auto mt-24 grid max-w-360 gap-3 px-4 sm:grid-cols-2 sm:gap-5 sm:px-6"
      >
        {[
          {
            img: "/banners/edit-festive.svg",
            eyebrow: "Wedding season",
            title: "The Festive Edit",
            href: "/collections/festive",
          },
          {
            img: "/banners/edit-embroidered.svg",
            eyebrow: "Threadwork",
            title: "Embroidered Lawn",
            href: "/collections/embroidered",
          },
        ].map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="group relative block aspect-4/5 overflow-hidden sm:aspect-9/11"
          >
            <Image
              src={e.img}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/75 via-black/15 to-transparent p-6 text-ivory sm:p-10">
              <p className="text-xs uppercase tracking-[0.3em]">{e.eyebrow}</p>
              <p className="mt-2 font-serif text-4xl sm:text-5xl">{e.title}</p>
              <span className="mt-5 w-fit border-b border-ivory pb-1 text-xs uppercase tracking-[0.22em]">
                Discover
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section aria-labelledby="fabric-heading" className="bg-sand">
        <div className="reveal mx-auto max-w-360 px-4 py-20 sm:px-6">
          <SectionTitle
            eyebrow="Feel the difference"
            title="Shop by Fabric"
            id="fabric-heading"
          />
          <ul className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
            {fabricImages.map(({ fabric, product }) => (
              <li key={fabric} className="w-28 shrink-0 snap-start sm:w-auto">
                <Link
                  href={`/collections?fabric=${encodeURIComponent(fabric)}`}
                  className="group block text-center"
                >
                  <div className="relative mx-auto aspect-square overflow-hidden rounded-full border border-line bg-sand">
                    <Image
                      src={product.images[2]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 15vw, 112px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.16em] group-hover:text-henna">
                    {fabric}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="winter-heading"
        className="relative overflow-hidden"
      >
        <Image
          src="/banners/winter.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[460px] max-w-360 flex-col justify-center px-5 py-16 text-ivory sm:px-10">
          <p className="text-xs uppercase tracking-[0.3em]">
            Winter &apos;26 · Pre-launch
          </p>
          <h2
            id="winter-heading"
            className="mt-3 max-w-lg font-serif text-5xl sm:text-6xl"
          >
            Layers for the cold months
          </h2>
          <p className="mt-4 max-w-md opacity-90">
            Heavy khaddar, woven jacquard and soft shawls, ready before the
            first chill.
          </p>
          <Link
            href="/collections/winter"
            className="mt-8 w-fit bg-ivory px-10 py-4 text-xs uppercase tracking-[0.22em] text-ink hover:bg-gold hover:text-ivory"
          >
            Explore Winter
          </Link>
        </div>
      </section>

      <section aria-label="Roshni in numbers" className="bg-ink text-ivory">
        <dl className="reveal mx-auto grid max-w-360 grid-cols-2 gap-y-10 px-4 py-14 text-center sm:px-6 lg:grid-cols-4">
          {[
            ["50,000+", "Metres delivered"],
            ["120+", "Cities across Pakistan"],
            ["4.8★", "Average rating"],
            ["24 hrs", "WhatsApp confirmation"],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col">
              <dt className="order-2 mt-1 text-xs uppercase tracking-[0.2em] text-ivory/70">
                {l}
              </dt>
              <dd className="font-serif text-4xl text-[#e2b25a] sm:text-5xl">
                {n}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="reviews-heading" className="pt-24">
        <div className="mx-auto max-w-360 px-4 sm:px-6">
          <SectionTitle
            eyebrow="4.8 / 5 from 2,000+ orders"
            title="Loved Across Pakistan"
            id="reviews-heading"
          />
        </div>
        <Marquee duration={60}>
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="mr-5 flex w-[300px] shrink-0 flex-col border border-line bg-white p-7 sm:w-[380px]"
            >
              <div
                className="mb-4 flex gap-0.5 text-gold"
                aria-label="5 out of 5 stars"
                role="img"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} width={16} height={16} />
                ))}
              </div>
              <blockquote className="flex-1 font-serif text-xl leading-snug">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-medium">{r.name}</span>{" "}
                <span className="text-muted">· {r.city}</span>
                <span className="block text-xs uppercase tracking-wider text-muted">
                  Bought: {r.product}
                </span>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </section>

      <section
        aria-labelledby="look-heading"
        className="mx-auto max-w-360 px-4 pt-24 sm:px-6"
      >
        <SectionTitle
          eyebrow="#WearRoshni"
          title="The Lookbook"
          id="look-heading"
        />
        <ul className="reveal grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-6">
          {lookbook.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/product/${p.slug}`}
                className="group relative block aspect-square overflow-hidden bg-sand"
              >
                <Image
                  src={p.images[1]}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/50 p-2 text-center text-xs uppercase tracking-wider text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                  {p.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="news-heading"
        className="mt-24 bg-henna px-4 py-16 text-center text-ivory sm:px-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#e2b25a]">
          Roshni Insider
        </p>
        <h2 id="news-heading" className="mt-3 font-serif text-4xl sm:text-5xl">
          Get first access to new drops
        </h2>
        <p className="mx-auto mt-3 max-w-md opacity-80">
          Join for early sale access, styling notes and 10% off your first
          order.
        </p>
        <div className="mt-8 flex justify-center">
          <Newsletter tone="dark" />
        </div>
      </section>
    </>
  );
}
