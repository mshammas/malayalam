import type { Metadata } from "next";
import { PlanTracker } from "@/components/PlanTracker";
import { alphabet } from "@/content/alphabet";
import { buildSchedule, plans } from "@/content/plans";
import { PlanHeader } from "./header";

const [shortest] = plans.map((p) => buildSchedule(p).length).sort((a, b) => a - b);

export const metadata: Metadata = {
  title: "Daily Plan: Learn the Malayalam Alphabet in a Few Minutes a Day",
  description: `A simple daily plan for kids: learn 1 to 3 Malayalam letters a day in 10 to 20 minutes and know all ${alphabet.length} letters in as little as ${shortest} days.`,
  alternates: { canonical: "/plan" },
};

export default function PlanPage() {
  return (
    <>
      <PlanHeader />
      <PlanTracker />
    </>
  );
}
