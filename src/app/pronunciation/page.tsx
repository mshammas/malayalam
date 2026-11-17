import type { Metadata } from "next";
import Link from "next/link";
import { SoundButton } from "@/components/SoundButton";
import { getLetter } from "@/content/alphabet";
import { contrasts, wordSlug } from "@/content/pronunciation";

export const metadata: Metadata = {
  title: "Malayalam Pronunciation for Kids: Master ഴ, ള, ട and More",
  description:
    "Learn to pronounce the trickiest Malayalam sounds: ഴ (zha), retroflex ട ണ ള, the two r's, aspirated letters and long vowels, with audio and kid-friendly tips.",
  alternates: { canonical: "/pronunciation" },
};

export default function PronunciationPage() {
  return (
    <>
      <header className="py-10 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Say it like a Malayali!</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted">
          These sounds trip up most learners. Listen closely, use the 🐢 slow button, then record yourself on any
          letter page to compare.
        </p>
      </header>

      <ul className="grid gap-6 md:grid-cols-2">
        {contrasts.map((c) => (
          <li key={c.id} id={c.id} className="flex flex-col rounded-3xl bg-surface p-6 shadow-sm">
            <h2 className="text-2xl font-bold">{c.title}</h2>
            <p className="mt-2 text-muted">{c.explanation}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.letters.map((s) => {
                const l = getLetter(s);
                return l ? (
                  <li key={s}>
                    <Link
                      href={`/alphabet/${s}`}
                      className="flex items-center gap-2 rounded-full border-2 border-line px-4 py-2 font-semibold hover:border-brand"
                    >
                      <span lang="ml" className="font-ml text-2xl">
                        {l.glyph}
                      </span>
                      {l.roman}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
            {c.pairs?.map((p) => (
              <div key={p.a.ml + p.b.ml} className="mt-4 grid grid-cols-2 gap-3">
                {[p.a, p.b].map((w) => (
                  <div key={w.ml} className="flex flex-col items-center rounded-2xl border-2 border-line p-3 text-center">
                    <span aria-hidden className="text-3xl">
                      {w.emoji}
                    </span>
                    <span lang="ml" className="font-ml text-3xl">
                      {w.ml}
                    </span>
                    <span className="text-sm text-muted">
                      {w.roman}: {w.en}
                    </span>
                    <div className="mt-2">
                      <SoundButton audioPath={`words/${wordSlug(w.roman)}`} text={w.ml} label={`Hear ${w.roman}`} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}
