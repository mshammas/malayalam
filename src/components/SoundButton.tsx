"use client";

import { useCallback, useRef, useState } from "react";

type Status = "idle" | "playing" | "unavailable";

/**
 * Plays native-speaker audio from /audio/<path>.mp3.
 * Until recordings exist, it falls back to an on-device Malayalam voice if the browser has one.
 */
export function SoundButton({
  audioPath,
  text,
  label,
  size = "lg",
}: {
  audioPath: string;
  text: string;
  label: string;
  size?: "lg" | "sm";
}) {
  const [slow, setSlow] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakFallback = useCallback(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    const voice = synth?.getVoices().find((v) => v.lang.toLowerCase().startsWith("ml"));
    if (!synth || !voice) {
      setStatus("unavailable");
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = slow ? 0.55 : 0.9;
    u.onend = () => setStatus("idle");
    setStatus("playing");
    synth.cancel();
    synth.speak(u);
  }, [slow, text]);

  const play = useCallback(() => {
    const audio = audioRef.current ?? new Audio(`/audio/${audioPath}.mp3`);
    audioRef.current = audio;
    audio.playbackRate = slow ? 0.6 : 1;
    // Keeps the pitch natural when slowed down
    audio.preservesPitch = true;
    audio.onended = () => setStatus("idle");
    audio.onerror = () => speakFallback();
    audio.currentTime = 0;
    setStatus("playing");
    audio.play().catch(() => speakFallback());
  }, [audioPath, slow, speakFallback]);

  const big = size === "lg";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={play}
          aria-label={`${label}${slow ? " slowly" : ""}`}
          className={`flex items-center justify-center rounded-full bg-brand font-bold text-brand-ink shadow-md transition active:scale-95 ${
            big ? "h-16 w-16 text-3xl" : "h-11 w-11 text-xl"
          } ${status === "playing" ? "ring-4 ring-sun" : ""}`}
        >
          <span aria-hidden>🔊</span>
        </button>
        <button
          type="button"
          onClick={() => setSlow((s) => !s)}
          aria-pressed={slow}
          className={`rounded-full border-2 px-3 py-2 text-sm font-semibold transition ${
            slow ? "border-leaf bg-leaf text-white" : "border-line bg-surface text-ink"
          }`}
        >
          <span aria-hidden>🐢</span> Slow
        </button>
      </div>
      <p aria-live="polite" className="min-h-5 text-xs text-muted">
        {status === "unavailable" ? "Recording coming soon!" : ""}
      </p>
    </div>
  );
}
