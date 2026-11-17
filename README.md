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
npm run -s audio:manifest > /tmp/audio.json
.venv/bin/python scripts/generate_audio.py /tmp/audio.json
```

The manifest is built from `src/content/`, so new letters or words get audio automatically. It fails if two different words would share one file.

## Recording studio (native-speaker audio)

A local-only tool for replacing the TTS placeholders with real recordings. It is not part of the website and is never deployed.

```bash
npm run studio
```

Open http://127.0.0.1:4321 and allow the microphone. Use a quiet room and a headset or USB mic if you have one.

| Key | Action |
|---|---|
| `Space` | Start / stop recording |
| `P` | Play your take |
| `L` | Listen to the current audio |
| `Enter` | Save and go to the next clip |
| `←` `→` | Previous / next clip |

- Tricky sounds (ഴ ള ണ ട ത റ, minimal pairs) come first.
- Each saved take is trimmed, high-pass filtered and loudness-normalised, then written to `public/audio/<path>.mp3` (mono 96 kbps).
- `scripts/recordings.json` lists the human recordings. The TTS generator never overwrites these, even with `--force`.
- Raw takes are kept in `.studio-takes/` (git-ignored) so they can be reprocessed later.
- Commit and push the new `.mp3` files plus `scripts/recordings.json` to publish them.
