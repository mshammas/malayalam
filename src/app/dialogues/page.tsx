import type { Metadata } from "next";
import { DialogueDeck } from "@/components/DialogueDeck";
import { dialogues } from "@/content/dialogues";
import { DialoguesHeader } from "./header";

export const metadata: Metadata = {
  title: "Learn Malayalam from Movie Dialogues: Aavesham, Premalu & More",
  description:
    "Read famous lines from Malayalam films like Aavesham, Premalu and Manjummel Boys word by word. Learn the letters, unlock the dialogue, then say it like the star.",
  alternates: { canonical: "/dialogues" },
};

export default function DialoguesPage() {
  return (
    <>
      <DialoguesHeader />
      <DialogueDeck dialogues={dialogues} />
    </>
  );
}
