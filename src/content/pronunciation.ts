import type { SoundContrast } from "./types";

export const contrasts: SoundContrast[] = [
  {
    id: "zha",
    title: "The famous ഴ (zha)",
    letters: ["zha", "lla", "la"],
    explanation:
      "ഴ is one of the rarest sounds in the world. Curl your tongue far back and let air glide over it without touching. ള curls back and touches; ല stays behind the teeth.",
    pairs: [
      {
        a: { ml: "കിഴി", roman: "kiḻi", en: "small cloth bundle", emoji: "🎒" },
        b: { ml: "കിളി", roman: "kiḷi", en: "bird", emoji: "🐦" },
      },
    ],
  },
  {
    id: "retroflex-dental-t",
    title: "Curled-back ട vs teeth ത",
    letters: ["tta", "ta"],
    explanation:
      "For ട the tongue curls back to the roof of the mouth. For ത it touches the back of your top teeth. English 't' sits in between, so practise both ends!",
  },
  {
    id: "retroflex-dental-n",
    title: "Curled-back ണ vs teeth ന",
    letters: ["nna", "na"],
    explanation: "Same trick as ട and ത: curl back for ണ, tongue forward for ന.",
  },
  {
    id: "l-sounds",
    title: "ള vs ല",
    letters: ["lla", "la"],
    explanation: "ള curls the tongue back; ല is like the English 'l'.",
  },
  {
    id: "r-sounds",
    title: "Soft ര vs strong റ",
    letters: ["ra", "rra"],
    explanation: "ര is a single gentle tap. റ is a stronger, almost rolled 'r'.",
  },
  {
    id: "aspiration",
    title: "Puff or no puff? ക vs ഖ",
    letters: ["ka", "kha", "pa", "pha"],
    explanation:
      "Hold a tissue in front of your mouth. ഖ and ഫ make it flutter; ക and പ shouldn't. English 'k' and 'p' usually puff, so Malayalam ക and പ need extra care.",
  },
  {
    id: "vowel-length",
    title: "Short vs long vowels",
    letters: ["a", "aa", "i", "ii", "u", "uu"],
    explanation:
      "Long vowels last about twice as long as short ones, and the length changes the meaning.",
    pairs: [
      {
        a: { ml: "പട", roman: "paṭa", en: "army", emoji: "🛡️" },
        b: { ml: "പാട", roman: "pāṭa", en: "cream on milk", emoji: "🥛" },
      },
    ],
  },
  {
    id: "doubling",
    title: "Single vs double consonants",
    letters: ["tta"],
    explanation: "A doubled consonant is held for a moment longer, and the meaning changes.",
    pairs: [
      {
        a: { ml: "പടി", roman: "paṭi", en: "step", emoji: "🪜" },
        b: { ml: "പട്ടി", roman: "paṭṭi", en: "dog", emoji: "🐕" },
      },
    ],
  },
];
