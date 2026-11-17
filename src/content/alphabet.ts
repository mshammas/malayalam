import type { Letter } from "./types";

// NOTE: every entry starts as reviewed: false until a native speaker signs off.
const v = (
  slug: string,
  glyph: string,
  roman: string,
  soundsLike: string,
  example: Letter["example"],
  extra: Partial<Letter> = {},
): Letter => ({ slug, glyph, kind: "vowel", roman, soundsLike, example, reviewed: false, ...extra });

const c = (
  slug: string,
  glyph: string,
  roman: string,
  soundsLike: string,
  example: Letter["example"],
  extra: Partial<Letter> = {},
): Letter => ({ slug, glyph, kind: "consonant", roman, soundsLike, example, reviewed: false, ...extra });

export const vowels: Letter[] = [
  v("a", "അ", "a", "the 'u' in 'cup'", { ml: "അമ്മ", roman: "amma", en: "mother", emoji: "👩" }, {
    tip: "Short and quick. Compare with ആ, which is held twice as long.",
  }),
  v("aa", "ആ", "ā", "the 'a' in 'father'", { ml: "ആന", roman: "āna", en: "elephant", emoji: "🐘" }, {
    tricky: true,
    tip: "Hold it long: aaa-na. Saying it short changes the word!",
  }),
  v("i", "ഇ", "i", "the 'i' in 'sit'", { ml: "ഇല", roman: "ila", en: "leaf", emoji: "🍃" }),
  v("ii", "ഈ", "ī", "the 'ee' in 'see'", { ml: "ഈച്ച", roman: "īcca", en: "housefly", emoji: "🪰" }, {
    tricky: true,
    tip: "A long 'ee'. Smile wide and hold it.",
  }),
  v("u", "ഉ", "u", "the 'u' in 'put'", { ml: "ഉറുമ്പ്", roman: "urumbŭ", en: "ant", emoji: "🐜" }),
  v("uu", "ഊ", "ū", "the 'oo' in 'moon'", { ml: "ഊഞ്ഞാൽ", roman: "ūññāl", en: "swing", emoji: "🛝" }, {
    tricky: true,
    tip: "Round your lips and hold the 'oo' long.",
  }),
  v("ru", "ഋ", "ṛ", "'ru' as in 'rhythm'", { ml: "ഋഷി", roman: "ṛṣi", en: "sage", emoji: "🧘" }),
  v("e", "എ", "e", "the 'e' in 'bed'", { ml: "എലി", roman: "eli", en: "rat", emoji: "🐀" }),
  v("ee", "ഏ", "ē", "the 'a' in 'gate'", { ml: "ഏണി", roman: "ēṇi", en: "ladder", emoji: "🪜" }, {
    tricky: true,
    tip: "The long partner of എ. Stretch it out.",
  }),
  v("ai", "ഐ", "ai", "the 'i' in 'kite'", { ml: "ഐസ്", roman: "ais", en: "ice", emoji: "🧊" }),
  v("o", "ഒ", "o", "the 'o' in 'hot' (short)", { ml: "ഒട്ടകം", roman: "oṭṭakam", en: "camel", emoji: "🐫" }),
  v("oo", "ഓ", "ō", "the 'o' in 'go' (long)", { ml: "ഓന്ത്", roman: "ōntŭ", en: "chameleon", emoji: "🦎" }, {
    tricky: true,
  }),
  v("au", "ഔ", "au", "the 'ow' in 'cow'", { ml: "ഔഷധം", roman: "auṣadham", en: "medicine", emoji: "💊" }),
  v("am", "അം", "aṃ", "'um' with closed lips", { ml: "അംബരം", roman: "ambaram", en: "sky", emoji: "🌌" }),
  v("ah", "അഃ", "aḥ", "'a' followed by a soft breath", { ml: "ദുഃഖം", roman: "duḥkham", en: "sadness", emoji: "😢" }),
];

export const consonants: Letter[] = [
  c("ka", "ക", "ka", "'k' in 'skip' (no puff of air)", { ml: "കപ്പൽ", roman: "kappal", en: "ship", emoji: "🚢" }),
  c("kha", "ഖ", "kha", "'k' with a puff of air", { ml: "ഖനി", roman: "khani", en: "mine", emoji: "⛏️" }, {
    tricky: true,
    tip: "Hold your hand in front of your mouth: you should feel a puff of air. With ക you shouldn't.",
  }),
  c("ga", "ഗ", "ga", "'g' in 'go'", { ml: "ഗദ", roman: "gada", en: "mace", emoji: "🔨" }),
  c("gha", "ഘ", "gha", "'g' with a breathy push", { ml: "ഘടികാരം", roman: "ghaṭikāram", en: "clock", emoji: "⏰" }, { tricky: true }),
  c("nga", "ങ", "ṅa", "'ng' in 'sing'", { ml: "മാങ്ങ", roman: "māṅṅa", en: "mango", emoji: "🥭" }),
  c("cha", "ച", "ca", "'ch' in 'chair' (no puff)", { ml: "ചക്ക", roman: "cakka", en: "jackfruit", emoji: "🍈" }),
  c("chha", "ഛ", "cha", "'ch' with a puff of air", { ml: "ഛായ", roman: "chāya", en: "shade", emoji: "🌳" }, { tricky: true }),
  c("ja", "ജ", "ja", "'j' in 'jam'", { ml: "ജനൽ", roman: "janal", en: "window", emoji: "🪟" }),
  c("jha", "ഝ", "jha", "'j' with a breathy push", { ml: "ഝഷം", roman: "jhaṣam", en: "fish", emoji: "🐟" }),
  c("nya", "ഞ", "ña", "'ny' in 'canyon'", { ml: "ഞണ്ട്", roman: "ñaṇṭŭ", en: "crab", emoji: "🦀" }, { tricky: true }),
  c("tta", "ട", "ṭa", "a 't' with the tongue curled back", { ml: "പട്ടം", roman: "paṭṭam", en: "kite", emoji: "🪁" }, {
    tricky: true,
    tip: "Curl the tip of your tongue back and tap the roof of your mouth. Compare with ത, where the tongue touches your teeth.",
  }),
  c("ttha", "ഠ", "ṭha", "curled-back 't' with a puff", { ml: "കഠിനം", roman: "kaṭhinam", en: "hard", emoji: "🪨" }),
  c("dda", "ഡ", "ḍa", "a 'd' with the tongue curled back", { ml: "ഡമരു", roman: "ḍamaru", en: "small drum", emoji: "🪘" }, { tricky: true }),
  c("ddha", "ഢ", "ḍha", "curled-back 'd' with a breathy push", { ml: "ഢക്ക", roman: "ḍhakka", en: "big drum", emoji: "🥁" }),
  c("nna", "ണ", "ṇa", "an 'n' with the tongue curled back", { ml: "മണി", roman: "maṇi", en: "bell", emoji: "🔔" }, {
    tricky: true,
    tip: "Curl your tongue back like for ട, then hum. ന keeps the tongue just behind the teeth.",
  }),
  c("ta", "ത", "ta", "a soft 't' with the tongue on the teeth", { ml: "തത്ത", roman: "tatta", en: "parrot", emoji: "🦜" }, {
    tricky: true,
    tip: "Put your tongue tip against the back of your top teeth. It's softer than an English 't'.",
  }),
  c("tha", "ഥ", "tha", "teeth 't' with a puff of air", { ml: "രഥം", roman: "ratham", en: "chariot", emoji: "🛞" }),
  c("da", "ദ", "da", "a soft 'd' with the tongue on the teeth", { ml: "ദീപം", roman: "dīpam", en: "lamp", emoji: "🪔" }, { tricky: true }),
  c("dha", "ധ", "dha", "teeth 'd' with a breathy push", { ml: "ധനുസ്സ്", roman: "dhanussŭ", en: "bow", emoji: "🏹" }),
  c("na", "ന", "na", "'n' in 'no'", { ml: "നക്ഷത്രം", roman: "nakṣatram", en: "star", emoji: "⭐" }),
  c("pa", "പ", "pa", "'p' in 'spin' (no puff)", { ml: "പൂച്ച", roman: "pūcca", en: "cat", emoji: "🐈" }),
  c("pha", "ഫ", "pha", "'p' with a puff (often said like 'f')", { ml: "ഫലം", roman: "phalam", en: "fruit", emoji: "🍎" }),
  c("ba", "ബ", "ba", "'b' in 'ball'", { ml: "ബലൂൺ", roman: "balūṇ", en: "balloon", emoji: "🎈" }),
  c("bha", "ഭ", "bha", "'b' with a breathy push", { ml: "ഭരണി", roman: "bharaṇi", en: "jar", emoji: "🏺" }, { tricky: true }),
  c("ma", "മ", "ma", "'m' in 'mum'", { ml: "മയിൽ", roman: "mayil", en: "peacock", emoji: "🦚" }),
  c("ya", "യ", "ya", "'y' in 'yes'", { ml: "യന്ത്രം", roman: "yantram", en: "machine", emoji: "⚙️" }),
  c("ra", "ര", "ra", "a soft, single-tap 'r'", { ml: "രാജാവ്", roman: "rājāvŭ", en: "king", emoji: "🤴" }, {
    tricky: true,
    tip: "Tap your tongue once, lightly. റ is stronger, almost rolled.",
  }),
  c("la", "ല", "la", "'l' in 'love'", { ml: "ലഡ്ഡു", roman: "laḍḍu", en: "laddu", emoji: "🟠" }),
  c("va", "വ", "va", "between 'v' and 'w'", { ml: "വീട്", roman: "vīṭŭ", en: "house", emoji: "🏠" }),
  c("sha", "ശ", "śa", "'sh' in 'ship'", { ml: "ശംഖ്", roman: "śaṅkhŭ", en: "conch", emoji: "🐚" }),
  c("ssa", "ഷ", "ṣa", "'sh' with the tongue curled back", { ml: "പുഷ്പം", roman: "puṣpam", en: "flower", emoji: "🌸" }),
  c("sa", "സ", "sa", "'s' in 'sun'", { ml: "സിംഹം", roman: "simham", en: "lion", emoji: "🦁" }),
  c("ha", "ഹ", "ha", "'h' in 'hat'", { ml: "ഹംസം", roman: "hamsam", en: "swan", emoji: "🦢" }),
  c("lla", "ള", "ḷa", "an 'l' with the tongue curled back", { ml: "തവള", roman: "tavaḷa", en: "frog", emoji: "🐸" }, {
    tricky: true,
    tip: "Curl your tongue tip back, then say 'l'. ല keeps the tongue behind the teeth.",
  }),
  c("zha", "ഴ", "ḻa", "a special sound between 'r' and 'l'", { ml: "മഴ", roman: "maḻa", en: "rain", emoji: "🌧️" }, {
    tricky: true,
    tip: "Malayalam's superstar sound! Curl your tongue far back without touching the roof of your mouth, then let the air glide over it. It's not 'l', not 'r', and not 'zh'.",
  }),
  c("rra", "റ", "ṟa", "a strong, rolled 'r'", { ml: "റാന്തൽ", roman: "ṟāntal", en: "lantern", emoji: "🏮" }, {
    tricky: true,
    tip: "Stronger than ര: let your tongue trill against the ridge behind your teeth.",
  }),
];

export const alphabet: Letter[] = [...vowels, ...consonants];

export function getLetter(slug: string): Letter | undefined {
  return alphabet.find((l) => l.slug === slug);
}

export function getNeighbours(slug: string) {
  const i = alphabet.findIndex((l) => l.slug === slug);
  return {
    prev: i > 0 ? alphabet[i - 1] : undefined,
    next: i >= 0 && i < alphabet.length - 1 ? alphabet[i + 1] : undefined,
  };
}
