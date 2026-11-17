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

## Audio

`public/audio/` holds **placeholder** clips made with Microsoft neural TTS (voice `ml-IN-MidhunNeural`, chosen because it pronounces ഴ correctly) through [edge-tts](https://github.com/rany2/edge-tts). Native-speaker recordings will replace them. A recording saved at the same path takes priority: the generator skips files that already exist.

```bash
python3 -m venv .venv && .venv/bin/pip install edge-tts   # ffmpeg must be installed
node scripts/audio-manifest.ts > /tmp/audio.json
.venv/bin/python scripts/generate_audio.py /tmp/audio.json
```

The manifest is built from `src/content/`, so new letters or words get audio automatically. It fails if two different words would share one file.
