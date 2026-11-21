import type { Metadata } from "next";
import { ContrastList, PronunciationHeader } from "./contrasts";

export const metadata: Metadata = {
  title: "Malayalam Pronunciation for Kids: Master ഴ, ള, ട and More",
  description:
    "Learn to pronounce the trickiest Malayalam sounds: ഴ (zha), retroflex ട ണ ള, the two r's, aspirated letters and long vowels, with audio and kid-friendly tips.",
  alternates: { canonical: "/pronunciation" },
};

export default function PronunciationPage() {
  return (
    <>
      <PronunciationHeader />
      <ContrastList />
    </>
  );
}
