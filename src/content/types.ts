export type LetterKind = "vowel" | "consonant";

export interface ExampleWord {
  /** Malayalam word */
  ml: string;
  /** Simple romanisation for heritage learners */
  roman: string;
  /** English meaning */
  en: string;
  /** Emoji used until illustrations exist */
  emoji: string;
}

export interface Letter {
  /** URL-safe id, e.g. "zha" → /alphabet/zha */
  slug: string;
  glyph: string;
  kind: LetterKind;
  /** Romanised sound, e.g. "ḻa" */
  roman: string;
  /** Kid-friendly sound hint in English */
  soundsLike: string;
  example: ExampleWord;
  /** Extra coaching for hard sounds */
  tip?: string;
  /** Sound is hard for English speakers; gets extra practice */
  tricky?: boolean;
  /** A native speaker has reviewed this entry */
  reviewed: boolean;
}

export interface SoundContrast {
  id: string;
  title: string;
  /** Letter slugs that are easily confused */
  letters: string[];
  explanation: string;
  /** Word pairs that differ only by the contrasting sound */
  pairs?: { a: ExampleWord; b: ExampleWord }[];
}
