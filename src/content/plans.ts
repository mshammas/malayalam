import { alphabet } from "./alphabet";
import type { Letter } from "./types";

export type PlanId = "gentle" | "steady" | "speedy";

export interface LearningPlan {
  id: PlanId;
  emoji: string;
  title: string;
  /** New letters introduced on each learning day */
  lettersPerDay: number;
  /** Suggested minutes per day */
  minutesPerDay: number;
  blurb: string;
}

export const plans: LearningPlan[] = [
  { id: "gentle", emoji: "🐢", title: "Gentle", lettersPerDay: 1, minutesPerDay: 10, blurb: "One letter a day. Great for little learners." },
  { id: "steady", emoji: "🐘", title: "Steady", lettersPerDay: 2, minutesPerDay: 15, blurb: "Two letters a day. Our favourite pace." },
  { id: "speedy", emoji: "🐆", title: "Speedy", lettersPerDay: 3, minutesPerDay: 20, blurb: "Three letters a day for keen explorers." },
];

export const DEFAULT_PLAN: PlanId = "steady";

/** Every Nth day is a review day with no new letters. */
const REVIEW_EVERY = 7;

export type PlanDay =
  | { day: number; kind: "learn"; letters: Letter[]; reviewLetters: Letter[] }
  | { day: number; kind: "review"; reviewLetters: Letter[]; final: boolean };

export function getPlan(id: string): LearningPlan | undefined {
  return plans.find((p) => p.id === id);
}

/**
 * Splits the alphabet (vowels first, then consonants) into daily chunks.
 * Every 7th day is a review of what was learned since the last review,
 * and the plan ends with a final review of the trickiest letters.
 */
export function buildSchedule(plan: LearningPlan, letters: Letter[] = alphabet): PlanDay[] {
  const days: PlanDay[] = [];
  let sinceReview: Letter[] = [];
  let previous: Letter[] = [];

  for (let i = 0; i < letters.length; i += plan.lettersPerDay) {
    if ((days.length + 1) % REVIEW_EVERY === 0) {
      days.push({ day: days.length + 1, kind: "review", reviewLetters: sinceReview, final: false });
      sinceReview = [];
      previous = [];
    }
    const chunk = letters.slice(i, i + plan.lettersPerDay);
    days.push({ day: days.length + 1, kind: "learn", letters: chunk, reviewLetters: previous });
    sinceReview = [...sinceReview, ...chunk];
    previous = chunk;
  }

  days.push({ day: days.length + 1, kind: "review", reviewLetters: letters.filter((l) => l.tricky), final: true });
  return days;
}

/** One day of a plan, as linked from /plan/<pace>/<day> */
export function getPlanDay(planId: string, day: number): { plan: LearningPlan; day: PlanDay } | undefined {
  const plan = getPlan(planId);
  const found = plan && buildSchedule(plan).find((d) => d.day === day);
  return plan && found ? { plan, day: found } : undefined;
}

/** Every plan day, for prerendering the shareable day pages */
export const allPlanDays = () =>
  plans.flatMap((p) => buildSchedule(p).map((d) => ({ pace: p.id, day: String(d.day) })));

/** What to do in a session, scaled to the plan's minutes. */
export function sessionSteps(plan: LearningPlan, day: PlanDay): { minutes: number; text: string }[] {
  const m = plan.minutesPerDay;
  if (day.kind === "review") {
    return [
      { minutes: Math.round(m * 0.4), text: day.final ? "Hear and say every ⭐ tricky letter once more" : "Hear and say each letter from this week" },
      { minutes: Math.round(m * 0.3), text: "Cover the letter name and guess each sound before you tap it" },
      { minutes: Math.round(m * 0.3), text: "Say the example words out loud and record yourself" },
    ];
  }
  const warmUp = day.reviewLetters.length > 0 ? 2 : 0;
  const perLetter = Math.floor((m - warmUp) / day.letters.length);
  const steps = [];
  if (warmUp) steps.push({ minutes: warmUp, text: "Warm up: say yesterday's letters again" });
  for (const l of day.letters) {
    steps.push({ minutes: perLetter, text: `Learn ${l.glyph}: hear it, say it, record yourself, learn “${l.example.en}”` });
  }
  return steps;
}
