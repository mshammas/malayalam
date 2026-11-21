import { alphabet } from "@/content/alphabet";

export function PlanHeader() {
  return (
    <header className="py-10 text-center land:py-3">
      <h1 className="text-4xl font-extrabold sm:text-5xl land:text-3xl">Your daily letter plan</h1>
      <p className="mx-auto mt-3 max-w-xl text-lg text-muted land:mt-1 land:max-w-2xl land:text-base">
        A few minutes a day is all it takes. Pick a pace and learn all {alphabet.length} letters, with a review day
        every week. Progress is saved only on this device.
      </p>
    </header>
  );
}
