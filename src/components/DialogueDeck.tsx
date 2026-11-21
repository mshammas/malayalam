"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PLAN, getPlan } from "@/content/plans";
import type { Dialogue } from "@/content/types";
import { lettersFor, unlockDay } from "@/lib/dialogueLetters";
import { learnedSlugs, loadPlan, type SavedPlan } from "@/lib/planStorage";
import { RecordCompare } from "./RecordCompare";
import { ShareButton } from "./ShareButton";
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

const shareText = (d: Dialogue) =>
  `🎬 “${d.ml ?? d.roman}” from ${d.film} (${d.year}). Can you read this famous Malayalam line? Crack it on Vezhu!`;

export function DialogueDeck({ dialogues }: { dialogues: Dialogue[] }) {
  const [saved, setSaved] = useState<SavedPlan | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  // The one card shown in full; play says whether its clip starts at once
  const [open, setOpen] = useState<{ slug: string; play: boolean } | null>(
    null,
  );

  useEffect(() => {
    // Read plan progress after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadPlan());
    // /dialogues#slug opens that card
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && dialogues.some((d) => d.slug === hash))
      setOpen({ slug: hash, play: false });
  }, [dialogues]);

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
        <p className="text-xl font-bold">
          🎬 {deck.length} famous lines to crack
        </p>
        <p className="max-w-xl text-muted">
          {saved
            ? "Letters you've learned on your daily plan light up green on each card. Light them all up and you can read the line on your own!"
            : "Start the daily plan and watch the letters on each card light up as you learn them."}
        </p>
        {!saved && (
          <Link
            href="/plan"
            className="rounded-full bg-brand px-6 py-3 font-bold text-brand-ink shadow hover:scale-105"
          >
            Start the daily plan →
          </Link>
        )}
      </section>

      <div
        role="group"
        aria-label="Filter by mood"
        className="flex flex-wrap justify-center gap-2"
      >
        {(["all", "mass", "comedy", "drama"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border-2 px-4 py-2 font-semibold transition ${
              filter === f
                ? "border-brand bg-brand text-brand-ink"
                : "border-line bg-surface"
            }`}
          >
            {f === "all" ? "All" : `${moods[f].emoji} ${moods[f].label}`}
          </button>
        ))}
      </div>

      <ul className="grid grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 land:grid-cols-4 land:gap-3">
        {shown.map(({ d, letters }) =>
          open?.slug === d.slug ? (
            <li key={d.slug} id={d.slug} className="col-span-full scroll-mt-20">
              <DialogueCard
                d={d}
                letters={letters}
                learned={learned}
                play={open.play}
                onClose={() => setOpen(null)}
              />
            </li>
          ) : (
            <li key={d.slug} id={d.slug} className="scroll-mt-20">
              <DialogueTile
                d={d}
                onOpen={(play) => setOpen({ slug: d.slug, play })}
              />
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

/** Shorts-style poster: thumbnail, a quick title, and Watch / Details */
function DialogueTile({
  d,
  onOpen,
}: {
  d: Dialogue;
  onOpen: (play: boolean) => void;
}) {
  const mood = moods[d.mood];
  return (
    <article className="relative flex h-full flex-col rounded-2xl bg-surface shadow-sm">
      <button
        type="button"
        onClick={() => onOpen(false)}
        aria-label={`${d.film}: ${d.roman}. Show details`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-t-2xl bg-ink/90 text-left text-white"
      >
        {d.youtube ? (
          <Image
            src={`/thumbnails/dialogues/${d.slug}.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-6xl"
          >
            🎬
          </span>
        )}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-semibold">
          {mood.emoji} {mood.label}
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3">
          <span
            lang={d.ml ? "ml" : undefined}
            className={`block font-bold leading-snug ${d.ml ? "font-ml text-lg" : ""}`}
          >
            {d.ml ?? `“${d.roman}”`}
          </span>
          <span className="mt-1 block text-xs opacity-85">
            {d.film} ({d.year})
          </span>
        </span>
      </button>
      <div className="absolute right-2 top-2 z-10">
        <ShareButton
          path={`/dialogues#${d.slug}`}
          title={`${d.film}: ${d.roman}`}
          text={shareText(d)}
          label={`Share: ${d.film}`}
          iconOnly
          className="border-transparent bg-black/55 px-2 py-0.5 text-sm text-white"
        />
      </div>
      <div className="flex gap-1.5 p-2">
        {d.youtube && (
          <button
            type="button"
            onClick={() => onOpen(true)}
            aria-label={`Watch the scene: ${d.film}`}
            className="flex-1 rounded-full bg-brand px-2 py-1.5 text-sm font-bold text-brand-ink hover:scale-105"
          >
            ▶ Watch
          </button>
        )}
        <button
          type="button"
          onClick={() => onOpen(false)}
          aria-label={`Details: ${d.film}`}
          className="flex-1 rounded-full border-2 border-line px-2 py-1 text-sm font-semibold hover:border-brand"
        >
          Details
        </button>

      </div>
    </article>
  );
}

function DialogueCard({
  d,
  letters,
  learned,
  play,
  onClose,
}: {
  d: Dialogue;
  letters: ReturnType<typeof lettersFor>;
  learned: Set<string>;
  play: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current?.focus({ preventScroll: true });
  }, []);
  const [word, setWord] = useState<number | null>(null);
  const [showRoman, setShowRoman] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const mood = moods[d.mood];
  const vibe = vibes[d.vibe];
  const picked = word !== null ? d.words[word] : null;

  return (
    <article
      ref={ref}
      tabIndex={-1}
      className={`grid scroll-mt-20 gap-5 rounded-3xl bg-surface p-5 shadow-sm outline-none land:gap-3 land:p-4 ${
        d.youtube?.short ? "md:grid-cols-[minmax(0,16rem)_1fr]" : "md:grid-cols-[minmax(0,26rem)_1fr]"
      }`}
    >
      {d.youtube && (
        <div className="md:sticky md:top-20 md:self-start">
          <YouTubeClip
            {...d.youtube}
            thumbnail={`/thumbnails/dialogues/${d.slug}.jpg`}
            title={`${d.film}: ${d.roman}`}
            autoPlay={play}
          />
        </div>
      )}
      <div
        className={`flex flex-col gap-4 land:gap-3 ${d.youtube ? "" : "md:col-span-2"}`}
      >
        <header className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold leading-tight">
              {d.film}{" "}
              <span className="font-normal text-muted">({d.year})</span>
            </h2>
            <p className="text-sm text-muted">{d.character}</p>
          </div>
          <div className="flex flex-wrap gap-1 text-sm font-semibold">
            <span className="rounded-full bg-bg px-3 py-1">
              {mood.emoji} {mood.label}
            </span>
            {!d.ml && (
              <span className="rounded-full bg-bg px-3 py-1">🎁 Bonus</span>
            )}
            <ShareButton
              path={`/dialogues#${d.slug}`}
              title={`${d.film}: ${d.roman}`}
              text={shareText(d)}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${d.film}`}
              className="rounded-full border-2 border-line px-3 py-0.5 hover:border-brand"
            >
              ✕ Close
            </button>
          </div>
        </header>

        {d.ml ? (
          <div>
            <p
              lang="ml"
              className="flex flex-wrap gap-x-1 gap-y-2 font-ml text-3xl leading-snug sm:text-4xl"
            >
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
                  {showRoman && w.roman !== w.ml && (
                    <span className="font-sans text-sm text-muted">
                      {w.roman}
                    </span>
                  )}
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
                {picked.roman !== picked.ml && (
                  <span className="text-muted">({picked.roman})</span>
                )}{" "}
                = <strong>{picked.en}</strong>
              </p>
              {picked.note && (
                <p className="mt-1 text-sm text-muted">{picked.note}</p>
              )}
            </div>
          )}
        </div>

        {showMeaning ? (
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                Word for word
              </dt>
              <dd>{d.literal}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                What it really means
              </dt>
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
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            💡 Grammar nugget
          </p>
          <p className="mt-1">{d.nugget}</p>
        </div>

        <p>
          <strong>Use it when:</strong> {d.useItWhen}
        </p>
        <p className="flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-bg px-3 py-1">
            {vibe.emoji} {vibe.label}
          </span>
          {d.dialect && (
            <span className="rounded-full bg-bg px-3 py-1">🗺️ {d.dialect}</span>
          )}
        </p>

        {letters.length > 0 && (
          <div>
            <p className="text-sm font-semibold">
              🔤 Letters in this line:{" "}
              <span className="font-normal text-muted">
                you know {letters.filter((l) => learned.has(l.slug)).length} of{" "}
                {letters.length}
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
                        got
                          ? "border-leaf bg-leaf/10"
                          : "border-line bg-bg hover:border-brand"
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
            <SoundButton
              audioPath={`dialogues/${d.slug}`}
              text={d.ml}
              label={`Hear “${d.roman}”`}
              size="sm"
            />
            <RecordCompare
              audioPath={`dialogues/${d.slug}`}
              // Roughly a second per word, so long speeches aren't cut off
              maxSeconds={Math.min(30, Math.max(8, d.words.length))}
            />
          </div>
        )}
      </div>
    </article>
  );
}
