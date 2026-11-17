// Vezhu Recording Studio: a local-only tool for recording native-speaker audio.
// It is NOT part of the website and is never deployed.
//
//   npm run studio   →   http://localhost:4321
//
// Recordings are trimmed, loudness-normalised and saved to public/audio/<path>.mp3.
// scripts/recordings.json lists which clips are human recordings, so the TTS
// generator never overwrites them. Raw takes are kept in .studio-takes/ (git-ignored).
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildClips } from "../lib/clips.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const TAKES_DIR = path.join(ROOT, ".studio-takes");
const RECORDINGS_FILE = path.join(ROOT, "scripts", "recordings.json");
const PAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), "studio.html");
const HOST = "127.0.0.1";
const PORT = Number(process.env.STUDIO_PORT ?? 4321);
const MAX_UPLOAD = 15 * 1024 * 1024;

// Human recordings have room noise, so the trim threshold is a little higher than for TTS.
// The high-pass filter removes desk thumps and mic rumble.
const FILTER = [
  "highpass=f=70",
  "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05",
  "areverse",
  "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08",
  "areverse",
  "adelay=50",
  "loudnorm=I=-16:TP=-1.5:LRA=11",
  "apad=pad_dur=0.15",
].join(",");

type Recordings = Record<string, { recordedAt: string }>;

const clips = buildClips();
const clipByPath = new Map(clips.map((c) => [c.path, c]));

async function loadRecordings(): Promise<Recordings> {
  try {
    return JSON.parse(await readFile(RECORDINGS_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function saveRecordings(rec: Recordings) {
  const sorted = Object.fromEntries(Object.entries(rec).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(RECORDINGS_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

function run(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(err.trim() || `${cmd} exited ${code}`))));
  });
}

function readBody(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (c: Buffer) => {
      size += c.length;
      if (size > MAX_UPLOAD) {
        reject(new Error("Recording too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function json(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
}

async function saveTake(clipPath: string, body: Buffer) {
  const take = path.join(TAKES_DIR, `${clipPath}.webm`);
  const dest = path.join(AUDIO_DIR, `${clipPath}.mp3`);
  const tmp = `${dest}.tmp.mp3`;
  await mkdir(path.dirname(take), { recursive: true });
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(take, body);
  try {
    await run("ffmpeg", ["-y", "-loglevel", "error", "-i", take, "-af", FILTER, "-ac", "1", "-ar", "44100", "-b:a", "96k", tmp]);
    await rename(tmp, dest);
  } finally {
    await rm(tmp, { force: true });
  }
  const duration = Number(
    (await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest])).trim(),
  );
  const rec = await loadRecordings();
  rec[clipPath] = { recordedAt: new Date().toISOString() };
  await saveRecordings(rec);
  return duration;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${HOST}`);

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      res.end(await readFile(PAGE));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/clips") {
      const rec = await loadRecordings();
      json(
        res,
        200,
        clips.map((c) => ({
          ...c,
          status: rec[c.path] ? "recorded" : existsSync(path.join(AUDIO_DIR, `${c.path}.mp3`)) ? "tts" : "missing",
        })),
      );
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/save") {
      // Only accept known clip paths: this also rules out path traversal
      const clipPath = url.searchParams.get("path") ?? "";
      if (!clipByPath.has(clipPath)) return json(res, 400, { error: "Unknown clip" });
      const body = await readBody(req);
      if (body.length < 1000) return json(res, 400, { error: "Recording is empty" });
      const duration = await saveTake(clipPath, body);
      console.log(`saved  ${clipPath}  ${duration.toFixed(2)}s`);
      return json(res, 200, { ok: true, duration });
    }

    const audio = url.pathname.match(/^\/audio\/(.+)\.mp3$/);
    if (req.method === "GET" && audio && clipByPath.has(audio[1])) {
      const file = path.join(AUDIO_DIR, `${audio[1]}.mp3`);
      if (!existsSync(file)) return json(res, 404, { error: "No audio yet" });
      res.writeHead(200, { "content-type": "audio/mpeg", "cache-control": "no-store" });
      res.end(await readFile(file));
      return;
    }

    json(res, 404, { error: "Not found" });
  } catch (e) {
    console.error(e);
    json(res, 500, { error: e instanceof Error ? e.message : "Server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n🎙️  Vezhu Recording Studio → http://127.0.0.1:${PORT}\n   ${clips.length} clips · local only · Ctrl+C to stop\n`);
});
