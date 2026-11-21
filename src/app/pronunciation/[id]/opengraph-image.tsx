import { getLetter } from "@/content/alphabet";
import { contrasts } from "@/content/pronunciation";
import { Chip, clip, colors, LetterTile, needsShaping, ogImage } from "@/lib/og";

export { ogContentType as contentType, ogSize as size } from "@/lib/og";
export const alt = "A tricky Malayalam sound to practise";

export function generateStaticParams() {
  return contrasts.map((c) => ({ id: c.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = contrasts.find((x) => x.id === id)!;
  const letters = c.letters.flatMap((s) => getLetter(s) ?? []).slice(0, 6);
  const tile = letters.length <= 3 ? 150 : 118;
  return ogImage(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, padding: "28px 64px", width: "100%" }}>
      <Chip>🗣️ Say it like a Malayali!</Chip>
      <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{c.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {letters.map((l) => (
          <LetterTile key={l.slug} letter={l} size={tile} />
        ))}
      </div>
      {!needsShaping(c.explanation) && (
        <div style={{ display: "flex", fontSize: 34, color: colors.muted, lineHeight: 1.3 }}>{clip(c.explanation, 140)}</div>
      )}
    </div>,
  );
}
