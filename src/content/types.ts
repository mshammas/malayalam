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

export interface DialogueWord {
  ml: string;
  roman: string;
  en: string;
  /** How the word is built, or when to use it */
  note?: string;
}

export interface Dialogue {
  /** URL-safe id, used for /dialogues#slug and audio/dialogues/<slug> */
  slug: string;
  film: string;
  year: number;
  character: string;
  /** The line in Malayalam script. Missing for English-only (Manglish) lines. */
  ml?: string;
  roman: string;
  /** Tappable words, in order */
  words: DialogueWord[];
  /** Word-for-word English */
  literal: string;
  /** What it really means, and the scene */
  meaning: string;
  /** A real-life situation where the line fits */
  useItWhen: string;
  /** One grammar idea the line teaches */
  nugget: string;
  mood: "mass" | "comedy" | "drama";
  /** Who you can say it to */
  vibe: "anyone" | "friends";
  dialect?: string;
  /**
   * The scene on YouTube, ideally from the film's official channel.
   * Only loaded when the learner taps play (privacy-enhanced embed).
   */
  youtube?: {
    /** The 11-character video id, e.g. from youtube.com/watch?v=<id> */
    id: string;
    /** Seconds into the video where the line starts */
    start?: number;
    /** Seconds where the clip should stop */
    end?: number;
    /** A vertical YouTube Short */
    short?: boolean;
  };
  /** A native speaker has reviewed the word breakdown */
  reviewed: boolean;
}
