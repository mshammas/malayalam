import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy for Kids & Parents",
  description: "How Vezhu keeps children safe: no ads, no tracking, no sign-up, and voice recordings never leave the device.",
  alternates: { canonical: "/privacy" },
};

// DRAFT: needs legal review against COPPA, GDPR-K, the UK Children's Code and India's DPDP Act before launch.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl py-10 text-lg leading-relaxed">
      <h1 className="text-4xl font-extrabold">Privacy, in plain words</h1>
      <h2 className="mt-8 text-2xl font-bold">For kids</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        <li>You don&apos;t need an account. We never ask for your name, email or age.</li>
        <li>When you record your voice, it stays on your device. We never hear it or keep it.</li>
        <li>We never put ads on Vezhu, and there&apos;s no chatting with strangers.</li>
        <li>Movie clips only start when you tap play. They come from YouTube, and YouTube may show its own ads in them.</li>
      </ul>
      <h2 className="mt-8 text-2xl font-bold">For parents</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        <li>Learning progress is stored only in your browser (localStorage). Clearing site data removes it.</li>
        <li>We use no third-party trackers, advertising cookies or social widgets.</li>
        <li>
          Some movie lines have a film clip from YouTube. Nothing is loaded from YouTube until you tap play, and then
          only through YouTube&apos;s privacy-enhanced (youtube-nocookie.com) player. YouTube may show its own ads
          before or during a clip. We don&apos;t choose them and don&apos;t earn from them.
        </li>
        <li>
          Microphone recordings are processed only in the browser and discarded when the page is closed. Nothing is
          uploaded.
        </li>
      </ul>
    </article>
  );
}
