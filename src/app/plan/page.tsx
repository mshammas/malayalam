import type { Metadata } from "next";
import { PlanTracker } from "@/components/PlanTracker";
import { alphabet } from "@/content/alphabet";
import { buildSchedule, plans } from "@/content/plans";

const [shortest] = plans.map((p) => buildSchedule(p).length).sort((a, b) => a - b);

export const metadata: Metadata = {
  title: "Daily Plan: Learn the Malayalam Alphabet in a Few Minutes a Day",
  description: `A simple daily plan for kids: learn 1 to 3 Malayalam letters a day in 10 to 20 minutes and know all ${alphabet.length} letters in as little as ${shortest} days.`,
  alternates: { canonical: "/plan" },
};

export default function PlanPage() {
  return (
    <>
      <header className="py-10 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Your daily letter plan</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
          A few minutes a day is all it takes. Pick a pace and learn all {alphabet.length} letters, with a review
          day every week. Progress is saved only on this device.
        </p>
      </header>
      <PlanTracker />
    </>
  );
}
