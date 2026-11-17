"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const bands = [
  { id: "little", emoji: "🐣", title: "Little Learners", ages: "5–8", blurb: "Listen, tap and trace", color: "bg-sun" },
  { id: "explorer", emoji: "🧭", title: "Explorers", ages: "9–12", blurb: "Read, play and build words", color: "bg-leaf" },
  { id: "pro", emoji: "🚀", title: "Pros", ages: "13–18", blurb: "Speak, read and go deeper", color: "bg-sky" },
] as const;

const KEY = "vezhu.ageBand";

export function AgePicker() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Restore the saved choice after hydration
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(localStorage.getItem(KEY));
    } catch {
      /* storage blocked: fine */
    }
  }, []);

  function choose(id: string) {
    setSelected(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {bands.map((b) => {
          const active = selected === b.id;
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => choose(b.id)}
                aria-pressed={active}
                className={`flex w-full flex-col items-center gap-1 rounded-3xl border-4 bg-surface p-6 text-center land:p-4 shadow-sm transition hover:-translate-y-1 ${
                  active ? "border-brand" : "border-transparent"
                }`}
              >
                <span aria-hidden className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full text-4xl ${b.color}`}>
                  {b.emoji}
                </span>
                <span className="text-xl font-bold">{b.title}</span>
                <span className="text-sm font-semibold text-muted">Ages {b.ages}</span>
                <span className="text-sm text-muted">{b.blurb}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {selected && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/plan"
            className="inline-block rounded-full border-2 border-line bg-surface px-8 py-4 text-lg font-bold shadow-sm hover:scale-105"
          >
            Pick a daily plan 📅
          </Link>
          <Link
            href="/alphabet"
            className="inline-block rounded-full bg-brand px-8 py-4 text-lg font-bold text-brand-ink shadow-md hover:scale-105"
          >
            Let&apos;s start with letters →
          </Link>
        </div>
      )}
    </div>
  );
}
