import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DialogueDeck } from "@/components/DialogueDeck";
import { dialogues, getDialogue } from "@/content/dialogues";
import { DialoguesHeader } from "../header";

type Props = { params: Promise<{ slug: string }> };

// One page per line, so a shared link gets that line's preview image
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return dialogues.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = getDialogue(slug);
  if (!d) return {};
  // Long speeches would make an unwieldy title
  const words = d.roman.split(" ");
  const line = words.length > 5 ? `${words.slice(0, 5).join(" ").replace(/[,.?!]+$/, "")}…` : d.roman;
  return {
    title: `“${line}” from ${d.film} (${d.year}): Learn the Malayalam Movie Line`,
    description: `${d.meaning} Read the famous ${d.film} line word by word, learn its letters, then say it like the star.`,
    alternates: { canonical: `/dialogues/${d.slug}` },
    openGraph: { title: `“${line}” from ${d.film}: can you read it?`, url: `/dialogues/${d.slug}` },
  };
}

export default function DialoguePage({ params }: Props) {
  return (
    <>
      <DialoguesHeader />
      <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <Deck params={params} />
      </Suspense>
    </>
  );
}

async function Deck({ params }: Props) {
  const { slug } = await params;
  if (!getDialogue(slug)) notFound();
  return <DialogueDeck dialogues={dialogues} initialOpen={slug} />;
}
