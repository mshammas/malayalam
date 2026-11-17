import Link from "next/link";
import type { Letter } from "@/content/types";

export function LetterCard({ letter }: { letter: Letter }) {
  return (
    <Link
      href={`/alphabet/${letter.slug}`}
      className="group relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-line bg-surface shadow-sm transition hover:-translate-y-1 hover:border-brand"
    >
      <span lang="ml" className="font-ml text-4xl leading-none sm:text-5xl">
        {letter.glyph}
      </span>
      <span className="mt-1 text-sm font-semibold text-muted">{letter.roman}</span>
      {letter.tricky && (
        <span className="absolute right-1.5 top-1.5 text-xs" title="Tricky sound: extra practice" aria-label="Tricky sound">
          ⭐
        </span>
      )}
    </Link>
  );
}
