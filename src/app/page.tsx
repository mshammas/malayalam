import Link from "next/link";
import { AgePicker } from "@/components/AgePicker";
import { JsonLd } from "@/components/JsonLd";
import { Mascot } from "@/components/Mascot";
import { alphabet } from "@/content/alphabet";
import { absoluteUrl, site } from "@/lib/site";

const features = [
  { emoji: "🔊", title: "Hear it", text: "Native-speaker audio for every letter, at normal and slow speed." },
  { emoji: "🎤", title: "Say it", text: "Record yourself and compare. Your voice never leaves your device." },
  { emoji: "✍️", title: "Trace it", text: "Learn to write each letter stroke by stroke." },
  { emoji: "🎮", title: "Play it", text: "Short games that make practice feel like play." },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Malayalam for Kids",
          description: site.description,
          provider: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
          inLanguage: "en",
          teaches: "Malayalam language: alphabet, vocabulary and pronunciation",
          educationalLevel: "Beginner",
          typicalAgeRange: "5-18",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
          hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT5M" },
        }}
      />

      <section className="flex flex-col items-center gap-6 py-12 text-center sm:py-16 land:gap-3 land:py-6">
        <Mascot size={140} className="animate-bob" />
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Learn <span lang="ml" className="font-fun text-brand">മലയാളം</span> the fun way!
        </h1>
        <p className="max-w-xl text-lg text-muted sm:text-xl">
          Join Vezhu the Hornbill to learn letters, words and how to say them just right. Free, with no ads and
          no sign-up.
        </p>
      </section>

      <section aria-labelledby="pick-age" className="py-6">
        <h2 id="pick-age" className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          How old are you?
        </h2>
        <AgePicker />
      </section>

      <section aria-labelledby="how" className="py-12">
        <h2 id="how" className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          How you&apos;ll learn
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 land:grid-cols-4 land:gap-3">
          {features.map((f) => (
            <li key={f.title} className="rounded-3xl bg-surface p-6 shadow-sm land:p-4">
              <span aria-hidden className="text-4xl">
                {f.emoji}
              </span>
              <h3 className="mt-2 text-xl font-bold">{f.title}</h3>
              <p className="mt-1 text-muted">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-surface p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold">
          Malayalam has a sound almost no other language has: <span lang="ml" className="font-ml">ഴ</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted">
          Can you say <span lang="ml" className="font-ml">മഴ</span> (rain) like a real Malayali? Our pronunciation
          coach helps you master ഴ and the other tricky sounds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/alphabet/zha" className="rounded-full bg-brand px-6 py-3 font-bold text-brand-ink shadow">
            Try ഴ now
          </Link>
          <Link href="/pronunciation" className="rounded-full border-2 border-line px-6 py-3 font-bold">
            All tricky sounds
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">{alphabet.length} letters to explore</p>
      </section>
    </>
  );
}
