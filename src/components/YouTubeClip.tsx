"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Click-to-load YouTube player. The poster is a thumbnail we host ourselves,
 * so nothing is requested from YouTube until the learner taps play, and then
 * only via the privacy-enhanced no-cookie domain.
 */
export function YouTubeClip({
  id,
  start,
  end,
  short,
  thumbnail,
  title,
}: {
  id: string;
  start?: number;
  end?: number;
  short?: boolean;
  /** Local poster image, e.g. /thumbnails/dialogues/<slug>.jpg */
  thumbnail?: string;
  title: string;
}) {
  const [on, setOn] = useState(false);
  const shape = short ? "mx-auto aspect-[9/16] w-full max-w-60" : "aspect-video w-full";

  if (!on) {
    return (
      <button
        type="button"
        onClick={() => setOn(true)}
        aria-label={`Watch the scene: ${title}`}
        className={`group relative flex ${shape} flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-line bg-ink/90 text-white transition hover:border-brand`}
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes={short ? "240px" : "(min-width: 1024px) 560px, 100vw"}
            className="object-cover transition group-hover:scale-105"
          />
        )}
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <span
          aria-hidden
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand text-3xl text-brand-ink shadow-lg transition group-hover:scale-110"
        >
          ▶
        </span>
        <span className="absolute inset-x-0 bottom-0 px-3 pb-3 text-center">
          <span className="block font-bold">Watch the scene</span>
          <span className="block text-xs opacity-85">Plays from YouTube</span>
        </span>
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
