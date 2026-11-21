import { colors, LetterTile, ogImage } from "@/lib/og";
import { site } from "@/lib/site";

export { ogContentType as contentType, ogSize as size } from "@/lib/og";
export const alt = `${site.name}: ${site.tagline}`;

// Site-wide preview; letter, dialogue, plan-day and sound pages have their own
const letters = [
  { glyph: "അ", roman: "a" },
  { glyph: "ക", roman: "ka" },
  { glyph: "ഴ", roman: "ḻa" },
  { glyph: "മ", roman: "ma" },
];

export default async function Image() {
  return ogImage(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "28px 64px", width: "100%" }}>
      <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.15 }}>Learn Malayalam the fun way</div>
      <div style={{ display: "flex", gap: 22 }}>
        {letters.map((l) => (
          <LetterTile key={l.glyph} letter={l} size={130} />
        ))}
      </div>
      <div style={{ display: "flex", fontSize: 36, color: colors.brand, fontWeight: 700 }}>
        Free for kids 5 to 18 · A few minutes a day · No ads, no sign-up
      </div>
    </div>,
  );
}
