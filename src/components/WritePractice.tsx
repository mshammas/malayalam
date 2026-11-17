"use client";

import { useEffect, useState } from "react";
import type { Letter } from "@/content/types";
import { SoundButton } from "./SoundButton";
import { WritingSlate } from "./WritingSlate";

type Props = { vowels: Letter[]; consonants: Letter[] };

/** Letter picker + slate. The chosen letter is kept in the URL hash (e.g. /write#ka) so it can be shared. */
export function WritePractice({ vowels, consonants }: Props) {
  const all = [...vowels, ...consonants];
  const [slug, setSlug] = useState(all[0].slug);
  const index = Math.max(0, all.findIndex((l) => l.slug === slug));
  const letter = all[index];

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (all.some((l) => l.slug === h)) setSlug(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (s: string) => {
    setSlug(s);
    history.replaceState(null, "", `#${s}`);
  };

  const chip = (l: Letter) => (
    <li key={l.slug}>
      <button
        type="button"
        onClick={() => pick(l.slug)}
        aria-pressed={l.slug === slug}
        aria-label={l.roman}
        className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 font-ml text-2xl ${
          l.slug === slug ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:border-brand"
        }`}
      >
        <span lang="ml">{l.glyph}</span>
      </button>
    </li>
  );

  const prev = all[index - 1];
  const next = all[index + 1];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] land:grid-cols-[1fr_minmax(14rem,20rem)] land:gap-4">
      <section aria-label="Writing slate" className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <span lang="ml" className="font-ml text-6xl leading-none">
            {letter.glyph}
          </span>
          <span className="text-2xl font-bold">{letter.roman}</span>
          <SoundButton audioPath={`letters/${letter.slug}`} text={letter.glyph} label={`Hear ${letter.roman}`} size="sm" />
        </div>
        <WritingSlate key={letter.slug} glyph={letter.glyph} label={letter.roman} />
        <div className="flex w-full max-w-[32rem] justify-between gap-4">
          {prev ? (
            <button type="button" onClick={() => pick(prev.slug)} className="rounded-full bg-surface px-5 py-3 font-bold shadow-sm">
              ← <span lang="ml" className="font-ml">{prev.glyph}</span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button
              type="button"
              onClick={() => pick(next.slug)}
              className="rounded-full bg-brand px-5 py-3 font-bold text-brand-ink shadow"
            >
              Next: <span lang="ml" className="font-ml">{next.glyph}</span> →
            </button>
          )}
        </div>
      </section>

      <nav aria-label="Choose a letter" className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-lg font-bold">Vowels</h2>
          <ul className="flex flex-wrap gap-2">{vowels.map(chip)}</ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-bold">Consonants</h2>
          <ul className="flex flex-wrap gap-2">{consonants.map(chip)}</ul>
        </div>
      </nav>
    </div>
  );
}
