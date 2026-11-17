import type { Metadata } from "next";
import { WritePractice } from "@/components/WritePractice";
import { consonants, vowels } from "@/content/alphabet";

export const metadata: Metadata = {
  title: "Write Malayalam Letters: Practice Slate for Kids",
  description:
    "Practise writing every Malayalam letter on a chalk slate with your finger, stylus or mouse. Trace over the letter, then try it on your own.",
  alternates: { canonical: "/write" },
};

export default function WritePage() {
  return (
    <>
      <header className="py-10 text-center land:py-3">
        <h1 className="text-4xl font-extrabold sm:text-5xl land:text-3xl">
          Learn to write <span lang="ml" className="font-ml text-brand">എഴുതാം</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted land:mt-1 land:max-w-2xl land:text-base">
          Trace the grey letter on the slate with your finger or mouse. When it feels easy, hide the letter and
          write it on your own. Your drawings stay on this device.
        </p>
      </header>
      <WritePractice vowels={vowels} consonants={consonants} />
    </>
  );
}
