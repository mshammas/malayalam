"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "recording" | "recorded" | "denied" | "unsupported";

/**
 * Lets a learner record themself and replay it next to the native audio.
 * Privacy: audio stays in memory on this device. Nothing is uploaded or stored.
 */
export function RecordCompare({ audioPath, maxSeconds = 4 }: { audioPath: string; maxSeconds?: number }) {
  const [state, setState] = useState<State>("idle");
  const [url, setUrl] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, [url]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: rec.mimeType });
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        setState("recorded");
      };
      recorder.current = rec;
      rec.start();
      setState("recording");
      // Auto-stop: letters and words are short, dialogues get longer
      stopTimer.current = setTimeout(() => stop(), maxSeconds * 1000);
    } catch {
      setState("denied");
    }
  }

  function stop() {
    if (stopTimer.current) clearTimeout(stopTimer.current);
    if (recorder.current?.state === "recording") recorder.current.stop();
  }

  function playNative() {
    new Audio(`/audio/${audioPath}.mp3`).play().catch(() => {});
  }

  function playMine() {
    if (url) new Audio(url).play();
  }

  return (
    <section aria-labelledby="say-it" className="rounded-3xl border-2 border-line bg-surface p-5">
      <h2 id="say-it" className="text-xl font-bold">
        <span aria-hidden>🎤</span> Say it yourself
      </h2>
      <p className="mt-1 text-sm text-muted">
        Listen, then record yourself and compare. Your voice stays on this device and is never uploaded.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {state !== "recording" ? (
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-leaf px-5 py-3 font-bold text-white shadow active:scale-95"
          >
            {state === "recorded" ? "Try again" : "Record"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="animate-pulse rounded-full bg-brand px-5 py-3 font-bold text-brand-ink shadow"
          >
            ● Stop
          </button>
        )}
        <button
          type="button"
          onClick={playNative}
          className="rounded-full border-2 border-line px-5 py-3 font-semibold"
        >
          Hear Vezhu
        </button>
        <button
          type="button"
          onClick={playMine}
          disabled={!url}
          className="rounded-full border-2 border-line px-5 py-3 font-semibold disabled:opacity-40"
        >
          Hear me
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted">
        {state === "recording" && "Listening… say it now!"}
        {state === "recorded" && "Great try! Do they sound the same? 🌟"}
        {state === "denied" && "We need microphone permission to record. Ask a grown-up to help."}
        {state === "unsupported" && "Recording isn't supported in this browser."}
      </p>
    </section>
  );
}
