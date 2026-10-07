import Image from "next/image";
import Link from "next/link";

export function CollectionHero({ title, tagline, banner, count }: { title: string; tagline: string; banner: string; count: number }) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover object-[70%_center] opacity-90" />
      <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent" />
      <div className="relative mx-auto flex min-h-[220px] max-w-360 flex-col justify-end px-4 py-8 text-ivory sm:min-h-[300px] sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-3 text-xs uppercase tracking-wider opacity-80">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span aria-current="page">{title}</span>
        </nav>
        <h1 className="font-serif text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-2 max-w-md opacity-90">
          {tagline} · {count} styles
        </p>
      </div>
    </section>
  );
}
