import { dialogues, getDialogue } from "@/content/dialogues";
import {
  asJpeg,
  Chip,
  clip,
  colors,
  dialogueThumbnail,
  ogImage,
} from "@/lib/og";

export { ogSize as size } from "@/lib/og";
// JPEG keeps the scene photo small enough for WhatsApp
export const contentType = "image/jpeg";
export const alt = "A famous Malayalam movie line to learn";

const moods = {
  mass: "🔥 Mass",
  comedy: "😂 Comedy",
  drama: "🎭 Drama",
} as const;

export function generateStaticParams() {
  return dialogues.map((d) => ({ slug: d.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDialogue(slug)!;
  const thumb = d.youtube
    ? await dialogueThumbnail(d.slug).catch(() => null)
    : null;
  const line = clip(d.roman, 70);
  return asJpeg(
    await ogImage(
      <div style={{ display: "flex", width: "100%" }}>
        {thumb ? (
          <img
            src={thumb}
            alt=""
            width={300}
            height={533}
            style={{ objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 300,
              fontSize: 140,
            }}
          >
            🎬
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            padding: "32px 56px",
            flex: 1,
          }}
        >
          <Chip>{moods[d.mood]} · Movie line</Chip>
          <div
            style={{
              display: "flex",
              fontSize: line.length > 40 ? 54 : 76,
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            “{line}”
          </div>
          <div style={{ display: "flex", fontSize: 40, color: colors.muted }}>
            {d.film} ({d.year}) · {d.character}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: colors.brand,
              fontWeight: 700,
            }}
          >
            Can you read it in Malayalam? →
          </div>
        </div>
      </div>,
    ),
  );
}
