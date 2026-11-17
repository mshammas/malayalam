#!/usr/bin/env python3
"""Generate PLACEHOLDER Malayalam audio with Microsoft neural TTS (edge-tts).

These clips are stand-ins until native-speaker recordings exist (see PLAN.md).
Existing files are skipped unless --force is given. Clips listed in
scripts/recordings.json are human recordings (made with `npm run studio`) and
are NEVER overwritten, even with --force.

Usage:
    pip install edge-tts          # in a virtualenv; ffmpeg must be on PATH
    node scripts/audio-manifest.ts > /tmp/manifest.json
    python3 scripts/generate_audio.py /tmp/manifest.json [--voice ml-IN-MidhunNeural] [--force]
"""
import argparse
import asyncio
import json
import subprocess
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
RECORDINGS = ROOT / "scripts" / "recordings.json"

# Trim silence gently (-60 dB keeps soft endings like the tail of ഴ), add a short
# lead-in so browsers don't clip the first sound, normalise loudness, mono 64 kbps MP3
FILTER = (
    "silenceremove=start_periods=1:start_threshold=-60dB,"
    "areverse,silenceremove=start_periods=1:start_threshold=-60dB,areverse,"
    "adelay=50,"
    "loudnorm=I=-16:TP=-1.5:LRA=11,"
    "apad=pad_dur=0.15"
)


def human_recordings() -> set:
    try:
        return set(json.loads(RECORDINGS.read_text()))
    except FileNotFoundError:
        return set()


async def make(clip: dict, voice: str, rate: str, force: bool, human: set) -> str:
    dest = OUT / f"{clip['path']}.mp3"
    if clip["path"] in human:
        return f"human {clip['path']}"
    if dest.exists() and not force:
        return f"skip  {clip['path']}"
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".mp3") as raw:
        await edge_tts.Communicate(clip["text"], voice, rate=rate).save(raw.name)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", raw.name, "-af", FILTER,
             "-ac", "1", "-ar", "24000", "-b:a", "64k", str(dest)],
            check=True,
        )
    return f"ok    {clip['path']}  {clip['text']}"


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--voice", default="ml-IN-MidhunNeural")
    ap.add_argument("--rate", default="-10%", help="slightly slower than default suits learners")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    clips = json.loads(Path(args.manifest).read_text())
    human = human_recordings()
    sem = asyncio.Semaphore(4)

    async def run(c):
        async with sem:
            for attempt in range(3):
                try:
                    return await make(c, args.voice, args.rate, args.force, human)
                except Exception as e:  # network hiccups
                    if attempt == 2:
                        return f"FAIL  {c['path']}: {e}"
                    await asyncio.sleep(2)

    for line in await asyncio.gather(*(run(c) for c in clips)):
        print(line)


if __name__ == "__main__":
    asyncio.run(main())
