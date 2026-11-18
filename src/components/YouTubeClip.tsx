"use client";

import { useState } from "react";

/**
 * Click-to-load YouTube player. Nothing is requested from YouTube until the
 * learner taps play, and then only via the privacy-enhanced no-cookie domain.
 */
export function YouTubeClip({
  id,
  start,
  end,
  short,
  title,
}: {
  id: string;
  start?: number;
  end?: number;
  short?: boolean;
  title: string;
}) {
  const [on, setOn] = useState(false);
  const shape = short ? "mx-auto aspect-[9/16] w-full max-w-72" : "aspect-video w-full";

  if (!on) {
    return (
      <button
        type="button"
        onClick={() => setOn(true)}
        className={`flex ${shape} flex-col items-center justify-center gap-2 rounded-2xl border-2 border-line bg-ink/90 text-bg transition hover:border-brand`}
      >
        <span aria-hidden className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-3xl text-brand-ink">
          ▶
        </span>
        <span className="font-bold">Watch the scene</span>
        <span className="px-4 text-center text-xs opacity-80">Plays from YouTube. Nothing loads until you tap.</span>
      </button>
    );
  }

  const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1", modestbranding: "1" });
  if (start) params.set("start", String(start));
  if (end) params.set("end", String(end));

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className={`${shape} rounded-2xl border-0`}
    />
  );
}
