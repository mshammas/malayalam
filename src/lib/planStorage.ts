import { buildSchedule, getPlan, type PlanId } from "@/content/plans";

const KEY = "vezhu.plan";

export interface SavedPlan {
  planId: PlanId;
  /** Day numbers the learner has finished */
  done: number[];
}

export function loadPlan(): SavedPlan | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPlan;
    return getPlan(parsed.planId) && Array.isArray(parsed.done) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePlan(s: SavedPlan | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: progress just won't persist */
  }
}

/** Slugs of every letter on a ticked-off learning day. */
export function learnedSlugs(saved: SavedPlan | null): Set<string> {
  const learned = new Set<string>();
  if (!saved) return learned;
  const done = new Set(saved.done);
  for (const day of buildSchedule(getPlan(saved.planId)!)) {
    if (day.kind === "learn" && done.has(day.day)) day.letters.forEach((l) => learned.add(l.slug));
  }
  return learned;
}
