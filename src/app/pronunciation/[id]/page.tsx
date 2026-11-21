import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { contrasts } from "@/content/pronunciation";
import { ContrastList, PronunciationHeader } from "../contrasts";

type Props = { params: Promise<{ id: string }> };

// A shareable page per sound card, so the link preview shows that sound
export const ensureStatic = "navigation";

const getContrast = (id: string) => contrasts.find((c) => c.id === id);

export function generateStaticParams() {
  return contrasts.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = getContrast(id);
  if (!c) return {};
  return {
    title: `${c.title}: Malayalam Pronunciation for Kids`,
    description: c.explanation,
    // Same cards as /pronunciation, just reordered
    alternates: { canonical: "/pronunciation" },
    openGraph: { title: `Say it like a Malayali: ${c.title}`, url: `/pronunciation/${c.id}` },
  };
}

export default function ContrastPage({ params }: Props) {
  return (
    <>
      <PronunciationHeader />
      <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <List params={params} />
      </Suspense>
    </>
  );
}

async function List({ params }: Props) {
  const { id } = await params;
  if (!getContrast(id)) notFound();
  return <ContrastList first={id} />;
}
