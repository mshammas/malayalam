import Link from "next/link";
import { Mascot } from "./Mascot";
import { site } from "@/lib/site";

const nav = [
  { href: "/plan", label: "Daily plan" },
  { href: "/alphabet", label: "Alphabet" },
  { href: "/pronunciation", label: "Pronunciation" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-ink">
          <Mascot size={44} />
          <span>{site.name}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-1 sm:gap-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="rounded-full px-3 py-2 text-base font-semibold text-ink hover:bg-surface sm:px-4"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          {site.name}: free Malayalam for kids. No ads, no tracking, no sign-up.
        </p>
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy for kids &amp; parents
        </Link>
      </div>
    </footer>
  );
}
