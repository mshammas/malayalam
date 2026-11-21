import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PlanTracker } from "@/components/PlanTracker";
import { allPlanDays, getPlanDay } from "@/content/plans";
import { PlanHeader } from "../../header";

type Props = { params: Promise<{ pace: string; day: string }> };

// A shareable page per plan day, so the link preview shows that day's letters
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return allPlanDays();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pace, day } = await params;
  const found = getPlanDay(pace, Number(day));
  if (!found) return {};
  const { plan, day: d } = found;
  const letters = d.kind === "learn" ? d.letters : d.reviewLetters;
  const glyphs = letters.map((l) => l.glyph).join(" ");
  const title =
    d.kind === "learn"
      ? `Day ${d.day}: Learn the Malayalam letters ${glyphs}`
      : `Day ${d.day}: Malayalam letter review`;
  return {
    title,
    description: `Day ${d.day} of the ${plan.title} plan: about ${plan.minutesPerDay} minutes to ${
      d.kind === "learn" ? "learn" : "review"
    } ${letters.map((l) => `${l.glyph} (${l.roman})`).join(", ")}.`,
    // The plan itself is the page worth indexing
    alternates: { canonical: "/plan" },
    openGraph: { title, url: `/plan/${plan.id}/${d.day}` },
  };
}

export default function PlanDayPage({ params }: Props) {
  return (
    <>
      <PlanHeader />
      <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <Tracker params={params} />
      </Suspense>
    </>
  );
}

async function Tracker({ params }: Props) {
  const { pace, day } = await params;
  const found = getPlanDay(pace, Number(day));
  if (!found) notFound();
  return <PlanTracker sharedDay={{ planId: found.plan.id, day: found.day.day }} />;
}
