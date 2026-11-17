export const site = {
  name: "Vezhu",
  tagline: "Learn Malayalam the fun way",
  description:
    "Free, fun Malayalam lessons for kids aged 5 to 18: the alphabet, words and pronunciation practice with Vezhu the Hornbill. No ads, no sign-up.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
