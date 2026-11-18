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
          return { d, letters, day: unlockDay(d, plan), unlocked: letters.every((l) => learned.has(l.slug)) };
        })
        .sort((a, b) => a.day - b.day),
    [dialogues, plan, learned],
  );
  const unlocked = deck.filter((c) => c.unlocked).length;
  const shown = deck.filter((c) => filter === "all" || c.d.mood === filter);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-surface p-5 text-center shadow-sm land:p-3">
        <p className="text-xl font-bold">
          🎬 {unlocked} of {deck.length} dialogues unlocked
        </p>
        <p className="max-w-xl text-muted">
          {saved
            ? "Every letter you learn on your daily plan unlocks more lines. Tick off a day and come back!"
            : "Start the daily plan and each line unlocks once you've learned all its letters."}
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
        {shown.map(({ d, letters, day, unlocked }) => (
          <li key={d.slug} id={d.slug} className="scroll-mt-20">
            <DialogueCard d={d} letters={letters} learned={learned} unlocked={unlocked} day={day} planTitle={plan.title} hasPlan={!!saved} />
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
  unlocked,
  day,
  planTitle,
  hasPlan,
}: {
  d: Dialogue;
  letters: ReturnType<typeof lettersFor>;
  learned: Set<string>;
  unlocked: boolean;
  day: number;
  planTitle: string;
  hasPlan: boolean;
}) {
  const [peek, setPeek] = useState(false);
  const [word, setWord] = useState<number | null>(null);
  const [showRoman, setShowRoman] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const open = unlocked || peek;
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

      {!open ? (
        <div className="flex flex-col gap-3">
          <p
            lang="ml"
            aria-hidden
            className="select-none font-ml text-3xl leading-snug blur-sm"
          >
            {d.ml}
          </p>
          <p className="font-semibold">
            🔒 Learn these letters to unlock:{" "}
            <span className="font-normal text-muted">
              {letters.filter((l) => learned.has(l.slug)).length} of {letters.length} done
            </span>
          </p>
          <ul className="flex flex-wrap gap-2">
            {letters.map((l) => {
              const got = learned.has(l.slug);
              return (
                <li key={l.slug}>
                  <Link
                    href={`/alphabet/${l.slug}`}
                    title={got ? `${l.roman}: learned` : `Learn ${l.roman}`}
                    className={`flex h-12 min-w-12 items-center justify-center rounded-xl border-2 px-2 font-ml text-2xl ${
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
          <p className="text-sm text-muted">
            {Number.isFinite(day) && `Unlocks on Day ${day} of ${hasPlan ? "your" : "the"} ${planTitle} plan. `}
            Can&apos;t wait?{" "}
            <button type="button" onClick={() => setPeek(true)} className="font-semibold text-brand underline underline-offset-4">
              Peek anyway
            </button>
          </p>
        </div>
      ) : (
        <>
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

          {d.youtube && (
            <YouTubeClip {...d.youtube} title={`${d.film}: ${d.roman}`} />
          )}

          {d.ml && (
            <div className="mt-auto flex flex-col gap-3">
              <SoundButton audioPath={`dialogues/${d.slug}`} text={d.ml} label={`Hear “${d.roman}”`} size="sm" />
              <RecordCompare audioPath={`dialogues/${d.slug}`} maxSeconds={8} />
            </div>
          )}
        </>
      )}
    </article>
  );
}
