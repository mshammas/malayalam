import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { LetterCard } from "@/components/LetterCard";
import { consonants, vowels } from "@/content/alphabet";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Malayalam Alphabet for Kids: All Letters with Sounds",
  description:
    "The Malayalam alphabet (അക്ഷരമാല) for kids: every vowel and consonant with audio, pronunciation tips and example words.",
  alternates: { canonical: "/alphabet" },
};

export default function AlphabetPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Alphabet", item: absoluteUrl("/alphabet") },
          ],
        }}
      />
      <header className="py-10 text-center land:py-4">
        <h1 className="text-4xl font-extrabold sm:text-5xl land:text-3xl">
          The Malayalam Alphabet <span lang="ml" className="font-ml text-brand">അക്ഷരമാല</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted land:mt-1 land:text-base">
          Tap a letter to hear it, see an example word and practise saying it. ⭐ marks the tricky sounds.
        </p>
      </header>

      <section aria-labelledby="vowels" className="mb-12 land:mb-6">
        <h2 id="vowels" className="mb-4 text-2xl font-bold land:mb-2 land:text-xl">
          Vowels <span lang="ml" className="font-ml text-muted">സ്വരങ്ങൾ</span>
        </h2>
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8 land:grid-cols-[repeat(auto-fill,minmax(clamp(4.5rem,21dvh,7rem),1fr))] land:gap-2">
          {vowels.map((l) => (
            <li key={l.slug}>
              <LetterCard letter={l} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="consonants">
        <h2 id="consonants" className="mb-4 text-2xl font-bold land:mb-2 land:text-xl">
          Consonants <span lang="ml" className="font-ml text-muted">വ്യഞ്ജനങ്ങൾ</span>
        </h2>
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8 land:grid-cols-[repeat(auto-fill,minmax(clamp(4.5rem,21dvh,7rem),1fr))] land:gap-2">
          {consonants.map((l) => (
            <li key={l.slug}>
              <LetterCard letter={l} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
