import type { Metadata, Viewport } from "next";
import { Baloo_2, Chilanka, Manjari } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", display: "swap" });
const manjari = Manjari({
  subsets: ["malayalam", "latin"],
  weight: ["400", "700"],
  variable: "--font-manjari",
  display: "swap",
});
const chilanka = Chilanka({
  subsets: ["malayalam", "latin"],
  weight: "400",
  variable: "--font-chilanka",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Learn Malayalam for Kids | Alphabet, Words & Pronunciation`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "learn Malayalam for kids",
    "Malayalam alphabet",
    "Malayalam letters",
    "Malayalam pronunciation",
    "Malayalam for beginners",
    "അക്ഷരമാല",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1410" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baloo.variable} ${manjari.variable} ${chilanka.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto max-w-6xl px-4">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
