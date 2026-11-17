// Prints every audio clip the site needs as JSON: [{ path, text }].
// Run with Node 22.6+ (native TypeScript): node scripts/audio-manifest.ts
import { alphabet } from "../src/content/alphabet.ts";
import { contrasts, wordSlug } from "../src/content/pronunciation.ts";

const clips: { path: string; text: string }[] = [];

for (const l of alphabet) {
  clips.push({ path: `letters/${l.slug}`, text: l.glyph });
  clips.push({ path: `examples/${l.slug}`, text: l.example.ml });
}

for (const c of contrasts) {
  for (const p of c.pairs ?? []) {
    for (const w of [p.a, p.b]) clips.push({ path: `words/${wordSlug(w.roman)}`, text: w.ml });
  }
}

// Same path for different text means two words would share one file: fail loudly
const byPath = new Map<string, { path: string; text: string }>();
for (const c of clips) {
  const prev = byPath.get(c.path);
  if (prev && prev.text !== c.text) {
    throw new Error(`Audio path collision: ${c.path} is used by both ${prev.text} and ${c.text}`);
  }
  byPath.set(c.path, c);
}
const unique = [...byPath.values()];
process.stdout.write(JSON.stringify(unique, null, 2));
