import type { Metadata } from "next";
import { DialogueDeck } from "@/components/DialogueDeck";
import { dialogues } from "@/content/dialogues";

export const metadata: Metadata = {
  title: "Learn Malayalam from Movie Dialogues: Aavesham, Premalu & More",
  description:
    "Read famous lines from Malayalam films like Aavesham, Premalu and Manjummel Boys word by word. Learn the letters, unlock the dialogue, then say it like the star.",
  alternates: { canonical: "/dialogues" },
};

export default function DialoguesPage() {
  return (
    <>
      <header className="py-10 text-center land:py-3">
        <h1 className="text-4xl font-extrabold sm:text-5xl land:text-3xl">
          Movie lines <span lang="ml" className="font-ml text-brand">ഡയലോഗ്</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted land:mt-1 land:max-w-2xl land:text-base">
          Famous lines from Malayalam films, one word at a time. Learn the letters to unlock a line, work out what it
          means, then say it like the star.
        </p>
      </header>
      <DialogueDeck dialogues={dialogues} />
    </>
  );
}
