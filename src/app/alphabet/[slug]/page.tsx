import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { RecordCompare } from "@/components/RecordCompare";
import { SoundButton } from "@/components/SoundButton";
import { alphabet, getLetter, getNeighbours } from "@/content/alphabet";
import { contrasts } from "@/content/pronunciation";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Every letter page is fully prerendered (best for SEO and Core Web Vitals)
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return alphabet.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = getLetter(slug);
  if (!l) return {};
  const kind = l.kind === "vowel" ? "vowel" : "consonant";
  return {
    title: `${l.glyph} (${l.roman}): How to Say and Write the Malayalam Letter`,
    description: `Learn the Malayalam ${kind} ${l.glyph} (${l.roman}). It sounds like ${l.soundsLike}. Example: ${l.example.ml} (${l.example.roman}) means "${l.example.en}". Hear it, say it and practise.`,
    alternates: { canonical: `/alphabet/${l.slug}` },
    openGraph: { title: `Malayalam letter ${l.glyph} (${l.roman})`, url: `/alphabet/${l.slug}` },
  };
}

// The shared App Shell can't depend on the URL, so the letter content sits behind Suspense.
// Every letter is still fully prerendered to static HTML (ensureStatic = "navigation").
export default function LetterPage({ params }: Props) {
  return (
    <Suspense fallback={<LetterSkeleton />}>
      <LetterContent params={params} />
    </Suspense>
  );
}

function LetterSkeleton() {
  return (
    <div aria-hidden className="grid gap-8 py-12 lg:grid-cols-2">
      <div className="h-96 animate-pulse rounded-3xl bg-surface" />
      <div className="h-96 animate-pulse rounded-3xl bg-surface" />
    </div>
  );
}

async function LetterContent({ params }: Props) {
  const { slug } = await params;
  const letter = getLetter(slug);
  if (!letter) notFound();
  const { prev, next } = getNeighbours(slug);
  const related = contrasts.filter((c) => c.letters.includes(slug));
  const url = absoluteUrl(`/alphabet/${slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LearningResource",
              name: `Malayalam letter ${letter.glyph} (${letter.roman})`,
              url,
              inLanguage: ["en", "ml"],
              learningResourceType: "Lesson",
              educationalLevel: "Beginner",
              typicalAgeRange: "5-18",
              isAccessibleForFree: true,
              teaches: `Pronunciation and recognition of the Malayalam ${letter.kind} ${letter.glyph}`,
              publisher: { "@type": "Organization", name: site.name },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Alphabet", item: absoluteUrl("/alphabet") },
                { "@type": "ListItem", position: 3, name: letter.glyph, item: url },
              ],
            },
          ],
        }}
      />

      <nav aria-label="Breadcrumb" className="pt-6 text-sm text-muted">
        <Link href="/alphabet" className="underline underline-offset-4">
          ← All letters
        </Link>
      </nav>

      <article className="grid gap-8 py-6 lg:grid-cols-2">
        <div className="flex flex-col items-center rounded-3xl bg-surface p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {letter.kind === "vowel" ? "Vowel" : "Consonant"}
            {letter.tricky && " · ⭐ Tricky sound"}
          </p>
          <h1 className="my-4 text-center">
            <span lang="ml" className="block font-ml text-[9rem] leading-none sm:text-[11rem]">
              {letter.glyph}
            </span>
            <span className="mt-2 block text-3xl font-bold">{letter.roman}</span>
          </h1>
          <SoundButton audioPath={`letters/${letter.slug}`} text={letter.glyph} label={`Hear ${letter.roman}`} />
          <p className="mt-2 text-center text-lg">
            Sounds like <strong>{letter.soundsLike}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <section aria-labelledby="example" className="rounded-3xl bg-surface p-6 shadow-sm">
            <h2 id="example" className="text-xl font-bold">
              Example word
            </h2>
            <div className="mt-3 flex items-center gap-4">
              <span aria-hidden className="text-6xl">
                {letter.example.emoji}
              </span>
              <div className="flex-1">
                <p lang="ml" className="font-ml text-4xl">
                  {letter.example.ml}
                </p>
                <p className="text-muted">
                  {letter.example.roman}: “{letter.example.en}”
                </p>
              </div>
              <SoundButton
                audioPath={`examples/${letter.slug}`}
                text={letter.example.ml}
                label={`Hear ${letter.example.roman}`}
                size="sm"
              />
            </div>
          </section>

          {letter.tip && (
            <section aria-labelledby="tip" className="rounded-3xl border-2 border-sun bg-surface p-6">
              <h2 id="tip" className="text-xl font-bold">
                <span aria-hidden>🐦</span> Vezhu&apos;s tip
              </h2>
              <p className="mt-2 text-lg">{letter.tip}</p>
            </section>
          )}

          <RecordCompare audioPath={`letters/${letter.slug}`} />

          {related.length > 0 && (
            <section aria-labelledby="dont-mix" className="rounded-3xl bg-surface p-6 shadow-sm">
              <h2 id="dont-mix" className="text-xl font-bold">
                Don&apos;t mix it up with…
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related
                  .flatMap((c) => c.letters)
                  .filter((s, i, arr) => s !== slug && arr.indexOf(s) === i)
                  .map((s) => {
                    const other = getLetter(s);
                    return other ? (
                      <li key={s}>
                        <Link
                          href={`/alphabet/${s}`}
                          className="flex items-center gap-2 rounded-full border-2 border-line px-4 py-2 font-semibold hover:border-brand"
                        >
                          <span lang="ml" className="font-ml text-2xl">
                            {other.glyph}
                          </span>
                          {other.roman}
                        </Link>
                      </li>
                    ) : null;
                  })}
              </ul>
              <Link href="/pronunciation" className="mt-3 inline-block text-sm underline underline-offset-4">
                Learn the difference →
              </Link>
            </section>
          )}
        </div>
      </article>

      <nav aria-label="Letter navigation" className="flex justify-between gap-4 py-4">
        {prev ? (
          <Link href={`/alphabet/${prev.slug}`} rel="prev" className="rounded-full bg-surface px-5 py-3 font-bold shadow-sm">
            ← <span lang="ml" className="font-ml">{prev.glyph}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/alphabet/${next.slug}`} rel="next" className="rounded-full bg-brand px-5 py-3 font-bold text-brand-ink shadow">
            Next: <span lang="ml" className="font-ml">{next.glyph}</span> →
          </Link>
        )}
      </nav>
    </>
  );
}
