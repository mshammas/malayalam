import { alphabet } from "@/content/alphabet";
import { buildSchedule, type LearningPlan } from "@/content/plans";
import type { Dialogue, Letter } from "@/content/types";

const byGlyph = new Map(alphabet.map((l) => [l.glyph, l.slug]));

/** Vowel signs and chillu letters, mapped to the alphabet letter a learner meets them as. */
const marks: Record<string, string> = {
  "ാ": "aa", "ി": "i", "ീ": "ii", "ു": "u", "ൂ": "uu", "ൃ": "ru",
  "െ": "e", "േ": "ee", "ൈ": "ai", "ൊ": "o", "ോ": "oo", "ൌ": "au", "ൗ": "au",
  "ം": "am", "ഃ": "ah",
  // Chillu: the "dead" final forms of ന, ണ, ര, ല, ള, ക
  "ൻ": "na", "ൺ": "nna", "ർ": "ra", "ൽ": "la", "ൾ": "lla", "ൿ": "ka",
};

/**
 * The alphabet letters someone needs to read this text, in alphabet order.
 * Virama (്), zero-width joiners, punctuation and Latin letters need no lesson.
 */
export function lettersIn(text: string): Letter[] {
  const slugs = new Set<string>();
  for (const ch of text) {
    const slug = byGlyph.get(ch) ?? marks[ch];
    if (slug) slugs.add(slug);
  }
  return alphabet.filter((l) => slugs.has(l.slug));
}

export function lettersFor(d: Dialogue): Letter[] {
  return d.ml ? lettersIn(d.ml) : [];
}

/** The plan day on which the last letter this dialogue needs is taught. */
export function unlockDay(d: Dialogue, plan: LearningPlan): number {
  const needed = new Set(lettersFor(d).map((l) => l.slug));
  if (needed.size === 0) return 0;
  for (const day of buildSchedule(plan)) {
    if (day.kind !== "learn") continue;
    for (const l of day.letters) needed.delete(l.slug);
    if (needed.size === 0) return day.day;
  }
  return Infinity;
}
