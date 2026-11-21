import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import type { ReactNode } from "react";
import type { Letter } from "@/content/types";
import { site } from "@/lib/site";

/**
 * Link-preview images (WhatsApp, iMessage, social) drawn with next/og.
 *
 * The renderer does no complex-script shaping, so Malayalam vowel signs and
 * conjuncts come out broken. Only single-code-point letters (every alphabet
 * glyph) are drawn in Malayalam; words and lines use romanisation or a photo.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export const colors = {
  bg: "#fff8ec",
  surface: "#ffffff",
  ink: "#2b2118",
  muted: "#6b5a4a",
  brand: "#e8590c",
  leaf: "#2f9e44",
  sun: "#fab005",
  line: "#f0e2cc",
};

// Paths stay static so the build traces only these folders
const fonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/Manjari-Regular.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/Manjari-Bold.ttf")),
]);
const mascot = readFile(join(process.cwd(), "src/app/icon.svg")).then(
  (b) => `data:image/svg+xml;base64,${b.toString("base64")}`,
);

/** A dialogue's thumbnail from public/thumbnails/dialogues, as a data URL */
export async function dialogueThumbnail(slug: string) {
  const data = await readFile(join(process.cwd(), "public/thumbnails/dialogues", `${slug}.jpg`));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

/** True when text has Malayalam vowel signs or viramas, which the renderer would draw broken */
export const needsShaping = (text: string) => /[\u0D00-\u0D03\u0D3B-\u0D4E\u0D57\u0D62\u0D63]/.test(text);

/** Shortens text to at most `max` characters, at a word break */
export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

/**
 * Re-encodes an image as JPEG. Photos as PNG run past 300 KB, and WhatsApp
 * skips preview images bigger than that.
 */
export async function asJpeg(image: Response) {
  const jpeg = await sharp(Buffer.from(await image.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}

/** Cream card with the Vezhu footer; `children` fills the space above it */
export async function ogImage(children: ReactNode) {
  const [[regular, bold], logo] = await Promise.all([fonts, mascot]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: colors.bg,
          color: colors.ink,
          fontFamily: "Manjari",
        }}
      >
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>{children}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 48px",
            background: colors.ink,
            color: colors.bg,
            fontSize: 30,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={64} height={64} alt="" style={{ borderRadius: 16 }} />
          <span style={{ fontWeight: 700, fontSize: 38 }}>{site.name}</span>
          <span style={{ opacity: 0.8 }}>{site.tagline}</span>
          <span style={{ marginLeft: "auto", color: colors.sun, fontWeight: 700 }}>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Manjari", data: regular, weight: 400, style: "normal" },
        { name: "Manjari", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}

/** A Malayalam letter tile with its sound under it */
export function LetterTile({ letter, size = 150 }: { letter: Pick<Letter, "glyph" | "roman">; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: size * 1.2,
        padding: `0 ${size * 0.1}px`,
        height: size * 1.15,
        borderRadius: size / 5,
        background: colors.surface,
        border: `4px solid ${colors.line}`,
      }}
    >
      <span style={{ fontSize: size * 0.56, fontWeight: 700, lineHeight: 1 }}>{letter.glyph}</span>
      <span style={{ fontSize: size * 0.2, color: colors.muted, marginTop: size * 0.06 }}>{letter.roman}</span>
    </div>
  );
}

/** Orange pill label */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        padding: "8px 22px 4px",
        borderRadius: 999,
        background: colors.brand,
        color: "#fff",
        fontSize: 28,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}
