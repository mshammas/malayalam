import type { MetadataRoute } from "next";
import { alphabet } from "@/content/alphabet";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/alphabet"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/pronunciation"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
  ];
  return [
    ...pages,
    ...alphabet.map((l) => ({
      url: absoluteUrl(`/alphabet/${l.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
