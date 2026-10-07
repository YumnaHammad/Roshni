import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-5xl">Page not found</h1>
      <p className="mt-4 text-muted">This fabric may have sold out or moved.</p>
      <Link href="/collections" className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-ivory hover:bg-henna">
        Browse collections
      </Link>
    </div>
  );
}
