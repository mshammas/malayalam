// Single source of truth for every audio clip the site plays.
// Used by audio-manifest.ts (TTS generator) and the recording studio.
import { alphabet } from "../../src/content/alphabet.ts";
import { dialogues } from "../../src/content/dialogues.ts";
import { contrasts, wordSlug } from "../../src/content/pronunciation.ts";

export type ClipGroup = "letters" | "examples" | "words" | "dialogues";

export interface Clip {
  /** Path under public/audio without extension, e.g. "letters/zha" */
  path: string;
  group: ClipGroup;
  /** Malayalam text to say */
  text: string;
  roman: string;
  /** English meaning or sound hint */
  meaning: string;
  /** Coaching note shown to the speaker */
  tip?: string;
  /** Hard sound: recorded first in the studio */
  tricky: boolean;
}

export function buildClips(): Clip[] {
  const clips: Clip[] = [];

  for (const l of alphabet) {
    clips.push({
      path: `letters/${l.slug}`,
      group: "letters",
      text: l.glyph,
      roman: l.roman,
      meaning: `${l.kind}: sounds like ${l.soundsLike}`,
      tip: l.tip,
      tricky: Boolean(l.tricky),
    });
    clips.push({
      path: `examples/${l.slug}`,
      group: "examples",
      text: l.example.ml,
      roman: l.example.roman,
      meaning: l.example.en,
      tricky: Boolean(l.tricky),
    });
  }

  for (const c of contrasts) {
    for (const p of c.pairs ?? []) {
      for (const w of [p.a, p.b]) {
        clips.push({
          path: `words/${wordSlug(w.roman)}`,
          group: "words",
          text: w.ml,
          roman: w.roman,
          meaning: w.en,
          tip: `Minimal pair: ${c.title}`,
          tricky: true,
        });
      }
    }
  }

  for (const d of dialogues) {
    clips.push({
      path: `dialogues/${d.slug}`,
      group: "dialogues",
      text: d.ml,
      roman: d.roman,
      meaning: d.literal,
      tip: `${d.film} (${d.year}), ${d.character}. Say it the way it's said in the film.`,
      tricky: false,
    });
  }

  // The same path for different text means two words would share one file: fail loudly
  const byPath = new Map<string, Clip>();
  for (const c of clips) {
    const prev = byPath.get(c.path);
    if (prev && prev.text !== c.text) {
      throw new Error(`Audio path collision: ${c.path} is used by both ${prev.text} and ${c.text}`);
    }
    byPath.set(c.path, c);
  }
  return [...byPath.values()];
}
