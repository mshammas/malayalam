"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_PLAN, getPlan } from "@/content/plans";
import type { Dialogue } from "@/content/types";
import { lettersFor, unlockDay } from "@/lib/dialogueLetters";
import { learnedSlugs, loadPlan, type SavedPlan } from "@/lib/planStorage";
import { RecordCompare } from "./RecordCompare";
import { SoundButton } from "./SoundButton";
import { YouTubeClip } from "./YouTubeClip";

const moods = {
  mass: { emoji: "🔥", label: "Mass" },
  comedy: { emoji: "😂", label: "Comedy" },
  drama: { emoji: "🎭", label: "Drama" },
} as const;

const vibes = {
  anyone: { emoji: "🟢", label: "Say it to anyone" },
  friends: { emoji: "🟡", label: "Friends only" },
} as const;

type Filter = "all" | Dialogue["mood"];

export function DialogueDeck({ dialogues }: { dialogues: Dialogue[] }) {
  const [saved, setSaved] = useState<SavedPlan | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    // Read plan progress after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadPlan());
  }, []);

  const plan = getPlan(saved?.planId ?? DEFAULT_PLAN)!;
  const learned = useMemo(() => learnedSlugs(saved), [saved]);
  const deck = useMemo(
    () =>
      dialogues
        .map((d) => {
          const letters = lettersFor(d);
          return { d, letters, day: unlockDay(d, plan) };
        })
        // Lines you can read soonest come first
        .sort((a, b) => a.day - b.day),
    [dialogues, plan],
  );
  const shown = deck.filter((c) => filter === "all" || c.d.mood === filter);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-surface p-5 text-center shadow-sm land:p-3">
        <p className="text-xl font-bold">🎬 {deck.length} famous lines to crack</p>
        <p className="max-w-xl text-muted">
          {saved
            ? "Letters you've learned on your daily plan light up green on each card. Light them all up and you can read the line on your own!"
            : "Start the daily plan and watch the letters on each card light up as you learn them."}
        </p>
        {!saved && (
          <Link href="/plan" className="rounded-full bg-brand px-6 py-3 font-bold text-brand-ink shadow hover:scale-105">
            Start the daily plan →
          </Link>
        )}
      </section>

      <div role="group" aria-label="Filter by mood" className="flex flex-wrap justify-center gap-2">
        {(["all", "mass", "comedy", "drama"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border-2 px-4 py-2 font-semibold transition ${
              filter === f ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"
            }`}
          >
            {f === "all" ? "All" : `${moods[f].emoji} ${moods[f].label}`}
          </button>
        ))}
      </div>

      <ul className="grid gap-5 lg:grid-cols-2 land:grid-cols-2 land:gap-3">
        {shown.map(({ d, letters }) => (
          <li key={d.slug} id={d.slug} className="scroll-mt-20">
            <DialogueCard d={d} letters={letters} learned={learned} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DialogueCard({
  d,
  letters,
  learned,
}: {
  d: Dialogue;
  letters: ReturnType<typeof lettersFor>;
  learned: Set<string>;
}) {
  const [word, setWord] = useState<number | null>(null);
  const [showRoman, setShowRoman] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const mood = moods[d.mood];
  const vibe = vibes[d.vibe];
  const picked = word !== null ? d.words[word] : null;

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-surface p-5 shadow-sm land:gap-3 land:p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold leading-tight">
            {d.film} <span className="font-normal text-muted">({d.year})</span>
          </h2>
          <p className="text-sm text-muted">{d.character}</p>
        </div>
        <div className="flex flex-wrap gap-1 text-sm font-semibold">
          <span className="rounded-full bg-bg px-3 py-1">
            {mood.emoji} {mood.label}
          </span>
          {!d.ml && <span className="rounded-full bg-bg px-3 py-1">🎁 Bonus</span>}
        </div>
      </header>

      {d.youtube && (
        <YouTubeClip {...d.youtube} thumbnail={`/thumbnails/dialogues/${d.slug}.jpg`} title={`${d.film}: ${d.roman}`} />
      )}

      {d.ml ? (
        <div>
          <p lang="ml" className="flex flex-wrap gap-x-1 gap-y-2 font-ml text-3xl leading-snug sm:text-4xl">
            {d.words.map((w, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setWord(word === i ? null : i)}
                aria-pressed={word === i}
                aria-label={`${w.ml}: ${w.en}`}
                className={`flex flex-col items-center rounded-xl px-2 py-1 transition ${
                  word === i ? "bg-sun/40" : "hover:bg-bg"
                }`}
              >
                <span>{w.ml}</span>
                {showRoman && <span className="font-sans text-sm text-muted">{w.roman}</span>}
              </button>
            ))}
          </p>
          <p className="mt-2 text-sm text-muted">
            👆 Tap a word to see what it means.{" "}
            <button
              type="button"
              onClick={() => setShowRoman((s) => !s)}
              aria-pressed={showRoman}
              className="font-semibold text-brand underline underline-offset-4"
            >
              {showRoman ? "Hide sounds" : "Show sounds"}
            </button>
          </p>
        </div>
      ) : (
        <p className="text-3xl font-bold">“{d.roman}”</p>
      )}

      <div aria-live="polite">
        {picked && (
          <div className="rounded-2xl border-2 border-sun bg-bg p-4">
            <p>
              <span lang="ml" className="font-ml text-2xl">
                {picked.ml}
              </span>{" "}
              <span className="text-muted">({picked.roman})</span> = <strong>{picked.en}</strong>
            </p>
            {picked.note && <p className="mt-1 text-sm text-muted">{picked.note}</p>}
          </div>
        )}
      </div>

      {showMeaning ? (
        <dl className="space-y-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Word for word</dt>
            <dd>{d.literal}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">What it really means</dt>
            <dd className="font-semibold">{d.meaning}</dd>
          </div>
        </dl>
      ) : (
        <button
          type="button"
          onClick={() => setShowMeaning(true)}
          className="self-start rounded-full border-2 border-line px-5 py-2 font-semibold hover:border-brand"
        >
          Got it? Reveal the meaning
        </button>
      )}

      <div className="rounded-2xl bg-bg p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">💡 Grammar nugget</p>
        <p className="mt-1">{d.nugget}</p>
      </div>

      <p>
        <strong>Use it when:</strong> {d.useItWhen}
      </p>
      <p className="flex flex-wrap gap-2 text-sm font-semibold">
        <span className="rounded-full bg-bg px-3 py-1">
          {vibe.emoji} {vibe.label}
        </span>
        {d.dialect && <span className="rounded-full bg-bg px-3 py-1">🗺️ {d.dialect}</span>}
      </p>

      {letters.length > 0 && (
        <div>
          <p className="text-sm font-semibold">
            🔤 Letters in this line:{" "}
            <span className="font-normal text-muted">
              you know {letters.filter((l) => learned.has(l.slug)).length} of {letters.length}
            </span>
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {letters.map((l) => {
              const got = learned.has(l.slug);
              return (
                <li key={l.slug}>
                  <Link
                    href={`/alphabet/${l.slug}`}
                    title={got ? `${l.roman}: learned` : `Learn ${l.roman}`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border-2 px-1.5 font-ml text-xl ${
                      got ? "border-leaf bg-leaf/10" : "border-line bg-bg hover:border-brand"
                    }`}
                  >
                    <span lang="ml">{l.glyph}</span>
                    {got && <span className="sr-only"> (learned)</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {d.ml && (
        <div className="mt-auto flex flex-col gap-3">
          <SoundButton audioPath={`dialogues/${d.slug}`} text={d.ml} label={`Hear “${d.roman}”`} size="sm" />
          <RecordCompare audioPath={`dialogues/${d.slug}`} maxSeconds={8} />
        </div>
      )}
    </article>
  );
}
