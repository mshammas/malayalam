# Vezhu: Learn Malayalam for Kids

A fun, safe website that helps children aged 5–18 learn Malayalam. See [PLAN.md](PLAN.md) for the product and technical plan.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/content/`: typed learning content (alphabet, pronunciation contrasts). The single source of truth.
- `src/app/`: routes (statically generated). `/alphabet/[slug]` creates one SEO page per letter.
- `src/components/`: UI (SoundButton, RecordCompare, AgePicker, Mascot…).
- `public/audio/{letters,examples,words}/<slug>.mp3`: native-speaker recordings (to be added).

## Environment

- `NEXT_PUBLIC_SITE_URL`: the production URL, used for canonical URLs, the sitemap and structured data.
