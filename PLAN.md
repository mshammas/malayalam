# Malayalam for Kids: Product & Technical Plan

A fun, safe, beautifully built website that helps children aged 5–18 learn Malayalam (മലയാളം).

Working name: **Vezhu** (from വേഴാമ്പൽ, the Great Hornbill and Kerala's state bird), who is also the mascot.

---

## 1. Decisions (defaults agreed)

| Topic | Decision |
|---|---|
| Audience | Both diaspora heritage learners and kids in Kerala |
| Interface language | English first; a Malayalam interface comes later (`hreflang` en / ml) |
| Business model | Free MVP. No ads, ever. |
| Mascot | Vezhu the Hornbill (original character) |
| Audio | Placeholder audio until native-speaker recordings exist (one child voice, one adult voice) |
| Accounts | None in the MVP. Progress is saved on the device. Optional parent accounts arrive in phase 2. |

## 2. Learners: three age bands

| Band | Ages | Approach |
|---|---|---|
| Little Learners | 5–8 | Audio-first, pictures, tapping, tracing, songs. Almost no text in the interface. |
| Explorers | 9–12 | The script, vocabulary themes, word-building games, illustrated stories |
| Pros | 13–18 | Conversation, grammar, reading real text, culture, speaking practice |

A transliteration (Manglish) toggle helps heritage learners who speak Malayalam but can't read it. A placement check (phase 2) lets them skip what they already know.

## 3. Curriculum

1. **Script (അക്ഷരമാല):** vowels → consonants → vowel signs → chillu letters (ൻ ർ ൽ ൾ ൺ) → conjunct letters (കൂട്ടക്ഷരങ്ങൾ)
2. **Words:** family, food, animals, colours, numbers, body, school, home
3. **Phrases and conversation:** greetings, routines, addressing family members
4. **Reading:** levelled stories with tap-to-hear on every word
5. **Culture:** Onam, Vishu, folk tales, rhymes, Kerala geography

Every letter gets: glyph, audio, transliteration, stroke-order tracing, an example word with a picture, and a printable worksheet.

## 3a. Pronunciation track (core feature)

The goal is to help learners get sounds right, especially the ones English speakers find hardest:

| Contrast | Example |
|---|---|
| ഴ (zha), unique to Malayalam/Tamil | വാഴ, മഴ, കോഴി |
| Retroflex vs dental | ട / ത, ഡ / ദ, ണ / ന, ള / ല |
| Aspirated vs unaspirated | ക / ഖ, പ / ഫ, ത / ഥ |
| Short vs long vowels | അ / ആ, ഇ / ഈ, എ / ഏ |
| ര vs റ, and the chillu endings | ൻ ർ ൽ |
| Doubled consonants | പട്ടി vs പടി |

Tools, in the order they ship:

1. **Hear it right (MVP).** Native audio at normal and slow speed, a child voice and an adult voice, and a loop/repeat button.
2. **See it (MVP).** Animated mouth and tongue diagrams for each sound, e.g. "tongue curls back" for retroflex sounds, plus short videos of a speaker's face.
3. **Hear the difference (MVP).** Minimal-pair listening games ("Which one did Vezhu say: ള or ല?") that train the ear before the mouth.
4. **Record & compare (MVP).** The child records themself and plays it back next to the native audio, with waveform or pitch overlays. **This runs entirely in the browser; no audio is uploaded.**
5. **Automatic scoring (phase 2).** Per-sound feedback ("your ഴ sounded like ള, try curling your tongue further back"):
   - Candidate models: AI4Bharat IndicWav2Vec, or Whisper fine-tuned for Malayalam, plus phoneme alignment for "goodness of pronunciation" scores
   - Prefer running the model in the browser (ONNX / transformers.js) so the voice never leaves the device. If it has to run on a server, use our own server with no storage and no third-party speech APIs.
   - Children's voices are personal data, so speech features need parental consent and a clear explanation of how audio is handled
6. **Pronunciation progress (phase 2).** Each learner gets a "tricky sounds" list that feeds back into their lessons, using spaced repetition.

The tool must stay kind: it never says "wrong", only "close! try again", and every attempt is celebrated.

## 4. Fun mechanics

- Vezhu reacts to answers, guides and celebrates
- Mini-games: listen & pop, memory match, word builder, tracing race, find-the-letter
- Stars, collectible stickers, gentle streaks (no guilt mechanics)
- 3–5 minute sessions

## 5. Child safety & compliance

- Must meet COPPA (US), GDPR-K, the UK Age Appropriate Design Code and India's DPDP Act (where under-18s need verifiable parental consent)
- No account needed to play. Progress is saved in `localStorage`.
- No ads, no third-party trackers, no open chat. Analytics must be cookieless and privacy-first (e.g. Plausible).
- Parent accounts (phase 2) hold any data that leaves the device

## 6. Tech stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**, with pages statically generated
- **Fonts:** Manjari (body Malayalam), Chilanka (playful headings), Baloo 2 (Latin), self-hosted via `next/font`
- **Animation:** Framer Motion for the UI; Rive or Lottie for the mascot (later)
- **Tracing:** SVG stroke paths for each letter, using pointer events
- **PWA:** installable and offline-capable (phase 1b)
- **Hosting:** Vercel or Cloudflare Pages. Supabase for parent accounts (phase 2).
- **Quality checks:** ESLint, type-checking, Playwright end-to-end tests, Lighthouse CI as a required check (≥95 in every category), WCAG 2.2 AA, reduced-motion support

## 7. SEO strategy

- A page for every letter and word: `/alphabet/[letter]`, `/words/[word]`
- Pillar pages: "Learn Malayalam for kids", "Malayalam alphabet chart", "Malayalam worksheets"
- Schema.org: `Course`, `LearningResource`, `FAQPage`, `BreadcrumbList`
- `sitemap.xml`, `robots.txt`, canonical URLs, OG images generated per page
- Core Web Vitals budgets: LCP < 2.0s, CLS < 0.05, INP < 150ms
- Free printable worksheets to attract backlinks

## 8. Phases

| Phase | Scope | Status |
|---|---|---|
| 0. Foundations | Brand, design system, content schema, repo, CI | **In progress** |
| 1. MVP: alphabet | All vowels and consonants, audio (normal and slow), tracing, 3 games, minimal-pair listening, record & compare, progress saved on device, per-letter SEO pages, worksheets | Next |
| 2. Words and stories | Vocabulary, stories, placement check, parent accounts, automatic pronunciation scoring, tricky-sounds practice | Later |
| 3. Teens and community | Conversation, grammar, speaking, classroom mode, culture | Later |

## 9. Content pipeline

- Content lives as typed data in `src/content/` (one source of truth for both the pages and the games)
- Audio files go in `public/audio/{letters,words}/<id>.mp3` (to be recorded)
- Every item has a `reviewed` flag that a native speaker sets after checking it
