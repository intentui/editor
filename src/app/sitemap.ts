import type { MetadataRoute } from "next";
import { app } from "@/config/app";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: app.url, changeFrequency: "weekly", priority: 1 },
    ...source.getPages().map((page) => ({
      url: `${app.url}${page.url}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
