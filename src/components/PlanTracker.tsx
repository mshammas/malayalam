"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildSchedule, DEFAULT_PLAN, getPlan, plans, sessionSteps, type PlanDay, type PlanId } from "@/content/plans";

const KEY = "vezhu.plan";

interface Saved {
  planId: PlanId;
  /** Day numbers the learner has finished */
  done: number[];
}

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    return getPlan(parsed.planId) && Array.isArray(parsed.done) ? parsed : null;
  } catch {
    return null;
  }
}

function save(s: Saved | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: progress just won't persist */
  }
}

export function PlanTracker() {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [preview, setPreview] = useState<PlanId>(DEFAULT_PLAN);

  useEffect(() => {
    // Restore saved progress after hydration
    const s = load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(s);
    if (s) setPreview(s.planId);
  }, []);

  function update(next: Saved | null) {
    setSaved(next);
    save(next);
  }

  const plan = getPlan(saved?.planId ?? preview)!;
  const schedule = useMemo(() => buildSchedule(plan), [plan]);
  const done = new Set(saved?.done ?? []);
  const today = saved ? schedule.find((d) => !done.has(d.day)) : undefined;
  const finished = saved && !today;

  function toggle(day: number) {
    if (!saved) return;
    const next = done.has(day) ? saved.done.filter((d) => d !== day) : [...saved.done, day];
    update({ ...saved, done: next });
  }

  return (
    <div className="flex flex-col gap-10">
      {!saved && (
        <section aria-labelledby="choose">
          <h2 id="choose" className="mb-4 text-center text-2xl font-bold">
            Pick your pace
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {plans.map((p) => {
              const active = preview === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPreview(p.id)}
                    aria-pressed={active}
                    className={`flex w-full flex-col items-center gap-1 rounded-3xl border-4 bg-surface p-6 text-center land:p-4 shadow-sm transition hover:-translate-y-1 ${
                      active ? "border-brand" : "border-transparent"
                    }`}
                  >
                    <span aria-hidden className="text-5xl">
                      {p.emoji}
                    </span>
                    <span className="text-xl font-bold">{p.title}</span>
                    <span className="font-semibold">
                      {p.lettersPerDay} letter{p.lettersPerDay > 1 ? "s" : ""} · {p.minutesPerDay} min a day
                    </span>
                    <span className="text-2xl font-extrabold text-brand">{buildSchedule(p).length} days</span>
                    <span className="text-sm text-muted">{p.blurb}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => update({ planId: preview, done: [] })}
              className="rounded-full bg-brand px-8 py-4 text-lg font-bold text-brand-ink shadow-md hover:scale-105"
            >
              Start the {plan.title} plan →
            </button>
          </div>
        </section>
      )}

      {saved && (
        <section aria-labelledby="progress" className="rounded-3xl bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="progress" className="text-2xl font-bold">
              {plan.emoji} {plan.title} plan
            </h2>
            <button
              type="button"
              onClick={() => {
                if (confirm("Change your plan? Your ticked days will be cleared.")) update(null);
              }}
              className="text-sm text-muted underline underline-offset-4"
            >
              Change plan
            </button>
          </div>
          <p className="mt-1 text-muted">
            {done.size} of {schedule.length} days done
          </p>
          <div
            className="mt-3 h-4 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={schedule.length}
            aria-valuenow={done.size}
            aria-label="Plan progress"
          >
            <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${(done.size / schedule.length) * 100}%` }} />
          </div>

          {finished ? (
            <p className="mt-6 text-center text-2xl font-bold">
              🎉 You finished the whole alphabet! <span lang="ml" className="font-ml">അടിപൊളി!</span>
            </p>
          ) : (
            today && <TodayCard day={today} planId={plan.id} onDone={() => toggle(today.day)} />
          )}
        </section>
      )}

      <section aria-labelledby="schedule">
        <h2 id="schedule" className="mb-4 text-2xl font-bold">
          Your {schedule.length}-day path
        </h2>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 land:grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] land:gap-2">
          {schedule.map((d) => {
            const isDone = done.has(d.day);
            const isToday = today?.day === d.day;
            return (
              <li key={d.day}>
                <button
                  type="button"
                  disabled={!saved}
                  onClick={() => toggle(d.day)}
                  aria-pressed={saved ? isDone : undefined}
                  title={saved ? (isDone ? "Tap to untick" : "Tap to mark done") : undefined}
                  className={`flex h-full w-full flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center land:p-2 transition enabled:hover:border-brand ${
                    isToday ? "border-brand bg-surface" : isDone ? "border-leaf bg-surface" : "border-line bg-surface/60"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Day {d.day} {isDone && "✅"}
                  </span>
                  {d.kind === "learn" ? (
                    <span lang="ml" className="font-ml text-3xl leading-tight">
                      {d.letters.map((l) => l.glyph).join(" ")}
                    </span>
                  ) : (
                    <span className="text-lg font-bold leading-tight">{d.final ? "🏆 Big review" : "🔁 Review"}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function TodayCard({ day, planId, onDone }: { day: PlanDay; planId: PlanId; onDone: () => void }) {
  const plan = getPlan(planId)!;
  const steps = sessionSteps(plan, day);
  const toPractise = day.kind === "learn" ? day.letters : day.reviewLetters;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold">
        Today: Day {day.day}{" "}
        <span className="font-normal text-muted">
          · about {plan.minutesPerDay} minutes{day.kind === "review" && (day.final ? " · final review" : " · review day")}
        </span>
      </h3>
      <ul className="mt-4 flex flex-wrap gap-3">
        {toPractise.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/alphabet/${l.slug}`}
              className="flex flex-col items-center rounded-2xl border-2 border-line bg-bg px-5 py-3 hover:border-brand"
            >
              <span lang="ml" className="font-ml text-5xl leading-none">
                {l.glyph}
              </span>
              <span className="mt-1 text-sm font-semibold text-muted">{l.roman}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="w-14 shrink-0 font-bold text-brand">{s.minutes} min</span>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onDone}
        className="mt-6 rounded-full bg-leaf px-6 py-3 font-bold text-white shadow hover:scale-105"
      >
        I did today&apos;s practice ✅
      </button>
    </div>
  );
}
