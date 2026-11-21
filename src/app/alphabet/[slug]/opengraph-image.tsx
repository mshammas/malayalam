import { alphabet, getLetter } from "@/content/alphabet";
import { Chip, colors, ogImage } from "@/lib/og";

export { ogContentType as contentType, ogSize as size } from "@/lib/og";
export const alt = "A Malayalam letter with how it sounds and an example word";

export function generateStaticParams() {
  return alphabet.map((l) => ({ slug: l.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = getLetter(slug)!;
  return ogImage(
    <div style={{ display: "flex", alignItems: "center", gap: 56, padding: "40px 64px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 380,
          height: 400,
          flexShrink: 0,
          borderRadius: 64,
          background: colors.surface,
          border: `6px solid ${colors.brand}`,
          fontSize: 270,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {l.glyph}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
        <Chip>
          {l.kind === "vowel" ? "Vowel" : "Consonant"}
          {l.tricky ? " · ⭐ Tricky" : ""}
        </Chip>
        <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1 }}>{l.roman}</div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 40, color: colors.muted }}>
          Sounds like&nbsp;<span style={{ color: colors.ink, fontWeight: 700 }}>{l.soundsLike}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40 }}>
          <span style={{ fontSize: 64 }}>{l.example.emoji}</span>
          <span>
            {l.example.roman} = “{l.example.en}”
          </span>
        </div>
      </div>
    </div>,
  );
}
