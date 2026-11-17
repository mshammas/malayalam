// Prints every audio clip the site needs as JSON: [{ path, text, ... }].
// Run with Node 22.6+ (native TypeScript): node scripts/audio-manifest.ts
import { buildClips } from "./lib/clips.ts";

process.stdout.write(JSON.stringify(buildClips(), null, 2));
