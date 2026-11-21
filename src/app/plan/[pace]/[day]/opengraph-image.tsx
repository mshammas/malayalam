import { allPlanDays, getPlanDay } from "@/content/plans";
import { Chip, colors, LetterTile, ogImage } from "@/lib/og";

export { ogContentType as contentType, ogSize as size } from "@/lib/og";
export const alt = "Today's Malayalam letters on the daily plan";

export function generateStaticParams() {
  return allPlanDays();
}

export default async function Image({ params }: { params: Promise<{ pace: string; day: string }> }) {
  const { pace, day } = await params;
  const { plan, day: d } = getPlanDay(pace, Number(day))!;
  const letters = d.kind === "learn" ? d.letters : d.reviewLetters;
  // Review days can cover a whole week of letters
  const shown = letters.slice(0, 7);
  const more = letters.length - shown.length;
  const tile = shown.length <= 3 ? 180 : shown.length <= 5 ? 140 : 110;
  return ogImage(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, padding: "28px 64px", width: "100%" }}>
      <Chip>
        {plan.emoji} {plan.title} plan · Day {d.day}
      </Chip>
      <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.2 }}>
        {d.kind === "learn" ? "Today's Malayalam letters" : d.final ? "🏆 The big review" : "🔁 Review day"}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {shown.map((l) => (
          <LetterTile key={l.slug} letter={l} size={tile} />
        ))}
        {more > 0 && <span style={{ fontSize: 48, fontWeight: 700, color: colors.muted }}>+{more}</span>}
      </div>
      <div style={{ display: "flex", fontSize: 36, color: colors.brand, fontWeight: 700 }}>
        ⏱️ About {plan.minutesPerDay} minutes. Let&apos;s {d.kind === "learn" ? "learn" : "practise"} them! →
      </div>
    </div>,
  );
}
