import Link from "next/link";
import { Mascot } from "./Mascot";
import { site } from "@/lib/site";

const nav = [
  { href: "/plan", label: "Daily plan", short: "Plan" },
  { href: "/alphabet", label: "Alphabet", short: "Letters" },
  { href: "/write", label: "Write", short: "Write" },
  { href: "/dialogues", label: "Movie lines", short: "Movies" },
  { href: "/pronunciation", label: "Pronunciation", short: "Sounds" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 land:static border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 land:py-1">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-ink">
          <Mascot size={44} />
          <span className="sr-only sm:not-sr-only">{site.name}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex sm:gap-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block whitespace-nowrap rounded-full px-1.5 py-2 text-[15px] font-semibold text-ink hover:bg-surface sm:px-4 sm:text-base"
                >
                  <span className="lg:hidden">{n.short}</span>
                  <span className="hidden lg:inline">{n.label}</span>
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
